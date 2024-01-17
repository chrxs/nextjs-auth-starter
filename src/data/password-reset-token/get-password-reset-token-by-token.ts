import db from "@/lib/db";

export default async function getPasswordResetTokenByToken(token: string) {
  try {
    const passwordResetToken = await db.passwordResetToken.findUnique({
      where: { token },
    });

    return passwordResetToken;
  } catch {
    return null;
  }
}
