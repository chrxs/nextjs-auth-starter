import { useTranslations } from "next-intl";

import { AUTH_REGISTER_PATH } from "@/auth/routes";
import { Link } from "@/components";
import { Card, SignInForm } from "../_components";

export default function SignInPage() {
  const t = useTranslations("Index");

  return (
    <Card title="Sign In">
      <p>{t("title")}</p>
      <p>{t("content")}</p>

      <SignInForm />

      <Link href={AUTH_REGISTER_PATH}>Don&apos;t have an account?</Link>
    </Card>
  );
}
