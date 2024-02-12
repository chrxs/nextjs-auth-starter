import { AUTH_SIGN_IN_PATH } from "@/auth/routes";
import { Link } from "@/components";
import { Card, RegisterForm } from "../_components";

export default function RegisterPage() {
  return (
    <Card title="Register">
      <RegisterForm />

      <Link href={AUTH_SIGN_IN_PATH}>Sign in</Link>
    </Card>
  );
}
