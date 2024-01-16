import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";
import type { NextAuthConfig, User } from "next-auth";
import type { Provider } from "next-auth/providers";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import { SignInSchema } from "@/auth/schemas";
import { getUserByEmail } from "@/data/user";

declare module "next-auth" {
  interface Session {
    user: {
      role: UserRole;
    } & User;
  }
}

export const API_AUTH_PREFIX = "/api/auth";

export const DEFAULT_SIGN_IN_REDIRECT = "/";

export const AUTH_ROUTES = [
  "/auth/sign-in",
  "/auth/register",
  // "/auth/error",
  // "/auth/reset",
  // "/auth/new-password"
];

export const PUBLIC_ROUTES = ["/auth/verify-email"];

const providers = [
  process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET && Google,

  Credentials({
    async authorize(credentials) {
      const validatedFields = SignInSchema.safeParse(credentials);

      if (!validatedFields.success) {
        return null;
      }

      const { email, password } = validatedFields.data;

      const user = await getUserByEmail(email);

      if (!user || !user.password) {
        return null;
      }

      const passwordsMatch = await bcrypt.compare(password, user.password);

      if (!passwordsMatch) {
        return null;
      }

      return user;
    },
  }),
].filter(Boolean) as Provider[];

const authConfig = {
  debug: false,
  providers,
  pages: {
    signIn: "/auth/sign-in",
    // signOut: "/auth/sign-out",
    // error: "/auth/error", // Error code passed in query string as ?error=
    // verifyRequest: "/auth/verify-request", // (used for check email message)
    // newUser: "/auth/new-user", // New users will be directed here on first sign in (leave the property out if not of interest)
  },
} satisfies NextAuthConfig;

export default authConfig;
