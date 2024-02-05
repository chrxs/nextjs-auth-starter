import { AUTH_SIGN_IN_PATH } from "@/auth/routes";
import { Link } from "@/components";
import { Card, ResetPasswordForm } from "../_components";

export default function ResetPasswordPage() {
  return (
    <Card title="Reset Password">
      <ResetPasswordForm />

      <Link href={AUTH_SIGN_IN_PATH}>Sign in</Link>
    </Card>
  );
}
