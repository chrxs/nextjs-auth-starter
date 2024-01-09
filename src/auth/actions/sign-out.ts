"use server";

import { signOut as authSignOut } from "../index";

export default async function signOut() {
  await authSignOut();
}
