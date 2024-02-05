"use server";

import { redirect } from "next/navigation";
import * as z from "zod";
import bcrypt from "bcryptjs";

import { ResetPasswordSchema } from "@/auth/schemas";
import { AUTH_SIGN_IN_PATH } from "@/auth/routes";
import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { getUserByEmail } from "@/data/user";
import db from "@/lib/db";

export type ActionResponse = {
  success?: string;
  errors?: z.ZodIssue[];
};

export type FormValues = z.infer<typeof ResetPasswordSchema>;

export default async function resetPassword(
  values: FormValues,
  token?: string | null,
): Promise<ActionResponse> {
  if (!token) {
    return {
      errors: [
        {
          code: "custom",
          path: ["root"],
          message: "Missing token",
        },
      ],
    };
  }

  const validationResult = ResetPasswordSchema.safeParse(values);

  if (!validationResult.success) {
    return {
      errors: validationResult.error.errors,
    };
  }

  const { password } = validationResult.data;

  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) {
    return {
      errors: [
        {
          code: "custom",
          path: ["root"],
          message: "Invalid token",
        },
      ],
    };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return {
      errors: [
        {
          code: "custom",
          path: ["root"],
          message: "Token has expired",
        },
      ],
    };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return {
      errors: [
        {
          code: "custom",
          path: ["root"],
          message: "User does not exist",
        },
      ],
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.user.update({
    where: { id: existingUser.id },
    data: { password: hashedPassword },
  });

  await db.passwordResetToken.delete({
    where: { id: existingToken.id },
  });

  redirect(AUTH_SIGN_IN_PATH);
}
