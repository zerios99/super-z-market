import { SignUpView } from "@/modules/auth/ui/views/sign-up-view";
import { caller } from "@/trpc/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const Page = async () => {
  const session = await caller.auth.session();
  if (session.user) {
    redirect("/"); // Redirect to home if user is already signed in
  }
  return <SignUpView />;
};

export default Page;
