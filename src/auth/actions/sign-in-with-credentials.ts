"use server";

import * as z from "zod";
import { AuthError } from "next-auth";

import { signIn } from "../index";
import { DEFAULT_SIGN_IN_REDIRECT } from "../config";
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
  // callbackUrl?: string | null,
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

  // const existingUser = await getUserByEmail(email);

  // if (!existingUser || !existingUser.email || !existingUser.password) {
  //   return { status: "error", message: "Email does not exist!" };
  // }

  console.log({ email, password });

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_SIGN_IN_REDIRECT,
      // redirectTo: callbackUrl || DEFAULT_SIGN_IN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
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

    throw error;
  }

  return {
    status: "success",
  };
}
