"use server";

import { signIn } from "../index";

export default async function signInWithProvider(provider: string) {
  await signIn(provider);
}
