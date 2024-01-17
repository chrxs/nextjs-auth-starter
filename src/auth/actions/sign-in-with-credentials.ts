"use server";

import * as z from "zod";
import { AuthError } from "next-auth";

import { signIn } from "../index";
import { DEFAULT_SIGN_IN_REDIRECT } from "../config";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import { SignInSchema } from "../schemas";
import { getUserByEmail } from "@/data/user";

export type ActionResponse = {
  status: "success" | "error";
  message?: string;
  errors?: z.ZodIssue[];
};

export type FormValues = z.infer<typeof SignInSchema>;

export default async function signInWithCredentials(
  formValues: FormValues,
  redirectTo: string = DEFAULT_SIGN_IN_REDIRECT,
): Promise<ActionResponse> {
  const validationResult = SignInSchema.safeParse(formValues);

  if (!validationResult.success) {
    return {
      status: "error",
      message: "Invalid fields!",
      errors: validationResult.error.errors,
    };
  }

  const { email, password } = validationResult.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return {
      status: "error",
      message: "Invalid credentials",
      errors: [
        {
          code: "custom",
          path: ["root"],
          message: "Invalid credentials",
        },
      ],
    };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email,
    );

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
    );

    return { status: "success", message: "Confirmation email sent!" };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            status: "error",
            message: "Invalid credentials",
            errors: [
              {
                code: "custom",
                path: ["root"],
                message: "Invalid credentials",
              },
            ],
          };

        default:
          return {
            status: "error",
            message: "Something went wrong",
            errors: [
              {
                code: "custom",
                path: ["root"],
                message: "Something went wrong",
              },
            ],
          };
      }
    }

    throw error;
  }

  return {
    status: "success",
  };
}
