import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AUTH_SIGN_IN_PATH } from "@/auth/routes";

export default async function getCurrentUser() {
  const session = await auth();

  if (!session?.user) {
    redirect(AUTH_SIGN_IN_PATH);
  }

  return session.user;
}
