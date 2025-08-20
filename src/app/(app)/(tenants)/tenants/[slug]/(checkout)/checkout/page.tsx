import { CheckoutView } from "@/modules/checkout/ui/components/views/checkout-view";

interface Props {
  params: Promise<{ slug: string }>;
}

const Page = async ({ params }: Props) => {
  const { slug } = await params;
  return <CheckoutView tenantSlug={slug} />;
};

export default Page;
