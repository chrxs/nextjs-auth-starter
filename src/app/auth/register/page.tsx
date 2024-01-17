import { Link } from "@/components";
import { Card, RegisterForm } from "../_components";

export default function RegisterPage() {
  return (
    <Card title="Register">
      <RegisterForm />

      <Link href="/auth/sign-in">Sign in</Link>
    </Card>
  );
}
