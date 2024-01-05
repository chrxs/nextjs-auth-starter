"use server";

import { signIn as authSignIn, signOut as authSignOut } from "./index";

export async function signIn() {
  await authSignIn("google");
}

export async function signOut() {
  await authSignOut();
}
