import { Link } from "@/components";
import { Card, SignInForm } from "../_components";

export default function SignInPage() {
  return (
    <Card title="Sign In">
      <SignInForm />

      <Link href="/auth/register">Don&apos;t have an account?</Link>
    </Card>
  );
}
