import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function sendTwoFactorTokenEmail(
  email: string,
  token: string,
) {
  await resend.emails.send({
    from: process.env.EMAIL_FROM as string,
    to: email,
    subject: "2FA Code",
    html: `<p>Your 2FA code: ${token}</p>`,
  });
}
