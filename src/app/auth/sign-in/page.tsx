import Link from "next/link";

import { Card, SignInForm } from "../_components";

export default function SignIn() {
  return (
    <Card title="Sign In">
      <SignInForm />

      <Link href="/auth/register">Don&apos;t have an account?</Link>
    </Card>
  );
}
