import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL;

export default async function sendPasswordResetEmail(
  email: string,
  token: string,
) {
  const resetLink = `${domain}/auth/reset-password?token=${token}`;

  await resend.emails.send({
    from: process.env.EMAIL_FROM as string,
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`,
  });
}
