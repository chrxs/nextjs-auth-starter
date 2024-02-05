import { AUTH_REGISTER_PATH } from "@/auth/routes";
import { Link } from "@/components";
import { Card, SignInForm } from "../_components";

export default function SignInPage() {
  return (
    <Card title="Sign In">
      <SignInForm />

      <Link href={AUTH_REGISTER_PATH}>Don&apos;t have an account?</Link>
    </Card>
  );
}
