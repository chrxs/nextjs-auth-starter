import { sendEmail } from "@/mail";

const domain = process.env.NEXT_PUBLIC_APP_URL;

export default async function sendPasswordResetEmail(
  email: string,
  token: string,
) {
  const resetLink = `${domain}/auth/reset-password?token=${token}`;

  await sendEmail({
    from: process.env.EMAIL_FROM as string,
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`,
  });
}
