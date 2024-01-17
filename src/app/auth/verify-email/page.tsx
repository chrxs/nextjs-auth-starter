import { redirect } from "next/navigation";

import { verifyEmail } from "@/auth/actions";
import { Alert, Link } from "@/components";
import { Card } from "../_components";

interface Props {
  searchParams: { token: string };
}

export default async function VerifyEmailPage({
  searchParams: { token },
}: Props) {
  if (!token) {
    redirect("/auth/sign-in");
  }

  const response = await verifyEmail(token);

  return (
    <Card title="Verify Email">
      <Alert type={response.status as "success" | "error"}>
        {response.message}
      </Alert>

      <Link href="/auth/sign-in">Sign In</Link>
    </Card>
  );
}
