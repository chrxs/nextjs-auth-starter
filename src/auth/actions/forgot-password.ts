"use server";

import * as z from "zod";

import { ForgotPasswordSchema } from "../schemas";
import { getUserByEmail } from "@/data/user";
import { sendPasswordResetEmail } from "@/auth/mail";
import { generatePasswordResetToken } from "@/auth/tokens";

export type ActionResponse = {
  success?: string;
  errors?: z.ZodIssue[];
};

export type FormValues = z.infer<typeof ForgotPasswordSchema>;

export default async function forgotPassword(
  values: FormValues,
): Promise<ActionResponse> {
  const validationResult = ForgotPasswordSchema.safeParse(values);

  if (!validationResult.success) {
    return {
      errors: validationResult.error.errors,
    };
  }

  const { email } = validationResult.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return {
      errors: [
        {
          code: "custom",
          path: ["root"],
          message: "Email not found",
        },
      ],
    };
  }

  const passwordResetToken = await generatePasswordResetToken(email);

  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token,
  );

  return { success: "Reset email sent" };
}
