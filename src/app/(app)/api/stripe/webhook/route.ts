/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Stripe } from "stripe";
import { getPayload } from "payload";
import config from "@payload-config";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { ExpandedLineItem } from "@/modules/checkout/types";

// تعريف نوع Payload
type PayloadInstance = Awaited<ReturnType<typeof getPayload>>;

export async function POST(req: Request) {
  let event: Stripe.Event;

  // Parse and validate webhook
  try {
    const body = await (await req.blob()).text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      throw new Error("Missing Stripe signature");
    }

    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK as string
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json(
      {
        message: "🚫Webhook Error: " + (error as Error).message,
      },
      { status: 400 }
    );
  }

  const permittedEvents: string[] = [
    "checkout.session.completed",
    "account.updated",
  ];

  // Only process permitted events
  if (!permittedEvents.includes(event.type)) {
    return NextResponse.json({ received: true }, { status: 200 });
  }

  const payload = await getPayload({ config });

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event, payload);
        break;
      case "account.updated":
        await handleAccountUpdated(event, payload);
        break;
      default:
        throw new Error(`Unhandled Event: ${event.type}`);
    }
  } catch (error) {
    console.error(`Handler error for ${event.type}:`, error);
    return NextResponse.json(
      {
        message: "🚫Handler Error: " + (error as Error).message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true }, { status: 200 });
}

async function handleCheckoutCompleted(event: Stripe.Event, payload: PayloadInstance) {
  const data = event.data.object as Stripe.Checkout.Session;

  if (!data.metadata?.userId) {
    throw new Error("User ID is required in session metadata");
  }

  // Fetch user
  const user = await payload.findByID({
    collection: "users",
    id: data.metadata.userId,
  });

  if (!user) {
    throw new Error(`User not found: ${data.metadata.userId}`);
  }

  // Retrieve expanded session with line items
  let expandedSession: Stripe.Checkout.Session;
  try {
    expandedSession = await stripe.checkout.sessions.retrieve(
      data.id,
      {
        expand: ["line_items.data.price.product"],
      },
      event.account ? { stripeAccount: event.account } : undefined
    );
  } catch (error) {
    throw new Error(`Failed to retrieve session: ${(error as Error).message}`);
  }

  const lineItems = expandedSession.line_items?.data as ExpandedLineItem[];

  if (!lineItems || lineItems.length === 0) {
    throw new Error("No line items found in checkout session");
  }

  // Validate line items structure
  for (const item of lineItems) {
    if (!item.price?.product?.metadata?.id) {
      throw new Error("Invalid line item: missing product metadata ID");
    }
  }

  // Create orders (consider batch operations for better performance)
  const orderPromises = lineItems.map(async (item) => {
    return payload.create({
      collection: "orders",
      data: {
        name: item.price.product.name,
        user: user.id,
        product: item.price.product.metadata.id,
        stripeCheckoutSessionId: data.id,
        stripeAccountId: event.account || null,
      },
    });
  });

  await Promise.all(orderPromises);
  console.log(`Created ${lineItems.length} orders for user ${user.id}`);
}

async function handleAccountUpdated(event: Stripe.Event, payload: PayloadInstance) {
  const data = event.data.object as Stripe.Account;

  const updateResult = await payload.update({
    collection: "tenants",
    where: {
      stripeAccountId: {
        equals: data.id,
      },
    },
    data: {
      stripeDetailsSubmitted: data.details_submitted,
      chargesEnabled: data.charges_enabled,
      payoutsEnabled: data.payouts_enabled,
    },
  });

  console.log(
    `Updated ${updateResult.docs.length} tenant(s) for account ${data.id}`
  );
}
