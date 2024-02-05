import { redirect } from "next/navigation";

import { verifyEmail } from "@/auth/actions";
import { AUTH_SIGN_IN_PATH } from "@/auth/routes";
import { Alert, Link } from "@/components";
import { Card } from "../_components";

interface Props {
  searchParams: { token: string };
}

export default async function VerifyEmailPage({
  searchParams: { token },
}: Props) {
  if (!token) {
    redirect(AUTH_SIGN_IN_PATH);
  }

  const response = await verifyEmail(token);

  return (
    <Card title="Verify Email">
      <Alert type={response.status as "success" | "error"}>
        {response.message}
      </Alert>

      <Link href={AUTH_SIGN_IN_PATH}>Sign in</Link>
    </Card>
  );
}
