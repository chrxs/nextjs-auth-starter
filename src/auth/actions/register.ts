"use server";

import * as z from "zod";

import { RegisterSchema } from "../schemas";
import { generateVerificationToken } from "@/auth/tokens";
import { sendVerificationEmail } from "@/auth/mail";
import { getUserByEmail, createUser } from "@/data/user";

export type ActionResponse = {
  success?: string;
  errors?: z.ZodIssue[];
};

export type FormValues = z.infer<typeof RegisterSchema>;

export default async function register(
  formValues: FormValues,
): Promise<ActionResponse> {
  const validationResult = RegisterSchema.safeParse(formValues);

  if (!validationResult.success) {
    return {
      errors: validationResult.error.errors,
    };
  }

  const { name, email, password } = validationResult.data;

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return {
      errors: [
        {
          code: "custom",
          path: ["root"],
          message: "Email already in use",
        },
      ],
    };
  }

  await createUser({
    name,
    email,
    password,
  });

  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return {
    success: "Confirmation email sent",
  };
}
