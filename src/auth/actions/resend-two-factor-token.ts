"use server";

import db from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { sendTwoFactorTokenEmail } from "@/auth/mail";
import { generateTwoFactorToken } from "@/auth/tokens";

export default async function resendTwoFactorToken({
  email,
}: {
  email: string;
}) {
  const existingUser = await getUserByEmail(email);

  if (
    !existingUser ||
    !existingUser.email ||
    !existingUser.password ||
    !existingUser.emailVerified ||
    !existingUser.isTwoFactorEnabled
  ) {
    return { error: "User not found" };
  }

  await db.twoFactorToken.deleteMany({
    where: { email: existingUser.email },
  });

  const twoFactorToken = await generateTwoFactorToken(existingUser.email);

  await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);

  return { success: "2FA code sent", twoFactor: true };
}
