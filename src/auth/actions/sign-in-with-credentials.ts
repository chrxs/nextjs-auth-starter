"use server";

import * as z from "zod";

import { signIn } from "../index";
import { SignInSchema } from "../schemas";

export default async function signInWithCredentials(
  values: z.infer<typeof SignInSchema>,
  callbackUrl?: string | null,
) {
  // await signIn("credentials");
}
