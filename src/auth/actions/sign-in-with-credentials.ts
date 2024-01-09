"use server";

import * as z from "zod";
import { AuthError } from "next-auth";

import { signIn } from "../index";
import { DEFAULT_SIGN_IN_REDIRECT } from "../config";
import { SignInSchema } from "../schemas";
import { getUserByEmail } from "@/data/user";

export type State =
  | {
      status: "success";
      message: string;
    }
  | {
      status: "error";
      message: string;
      errors?: Array<{
        path: string;
        message: string;
      }>;
    }
  | null;

export default async function signInWithCredentials(
  prevState: State | null,
  formData: FormData,
  // callbackUrl?: string | null,
) {
  // Artificial delay; don't forget to remove that!
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const validatedFields = SignInSchema.safeParse(Object.fromEntries(formData));

  if (!validatedFields.success) {
    return { status: "error", message: "Invalid fields!" };
  }

  const { email, password } = validatedFields.data;

  // const existingUser = await getUserByEmail(email);

  // if (!existingUser || !existingUser.email || !existingUser.password) {
  //   return { status: "error", message: "Email does not exist!" };
  // }

  console.log({ email, password });

  await signIn("credentials", {
    email,
    password,
    redirectTo: DEFAULT_SIGN_IN_REDIRECT,
    // redirectTo: callbackUrl || DEFAULT_SIGN_IN_REDIRECT,
  });

  // try {
  // } catch (error) {
  //   console.log("error", error);
  //   if (error instanceof AuthError) {
  //     switch (error.type) {
  //       case "CredentialsSignin":
  //         return { status: "error", message: "Invalid credentials!" };
  //       default:
  //         return { status: "error", message: "Something went wrong!" };
  //     }
  //   }

  //   throw error;
  // }
}
