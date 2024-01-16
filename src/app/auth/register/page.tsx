import Link from "next/link";

import { Card, RegisterForm } from "../_components";

export default function Register() {
  return (
    <Card title="Register">
      <RegisterForm />

      <Link href="/auth/sign-in">Sign in</Link>
    </Card>
  );
}
