import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function sendEmail(payload: any, options?: any) {
  return await resend.emails.send(payload, options);
}
