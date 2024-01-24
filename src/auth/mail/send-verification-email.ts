import { sendEmail } from "@/mail";

const domain = process.env.NEXT_PUBLIC_APP_URL;

export default async function sendVerificationEmail(
  email: string,
  token: string,
) {
  const confirmLink = `${domain}/auth/verify-email?token=${token}`;

  await sendEmail({
    from: process.env.EMAIL_FROM as string,
    to: email,
    subject: "Confirm your email",
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
  });
}
