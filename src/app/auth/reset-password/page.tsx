import { Link } from "@/components";
import { Card, ResetPasswordForm } from "../_components";

export default function ResetPasswordPage() {
  return (
    <Card title="Reset Password">
      <ResetPasswordForm />

      <Link href="/auth/sign-in">Sign in</Link>
    </Card>
  );
}
