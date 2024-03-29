import { sendEmail } from "@/mail";

export default async function sendTwoFactorTokenEmail(
  email: string,
  token: string,
) {
  await sendEmail({
    from: process.env.EMAIL_FROM as string,
    to: email,
    subject: "2FA Code",
    html: `<p>Your 2FA code: ${token}</p>`,
  });
}
