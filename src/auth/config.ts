import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";
import type { NextAuthConfig, User, DefaultSession } from "next-auth";
import type { Provider } from "next-auth/providers";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import { SignInSchema } from "@/auth/schemas";
import { getUserByEmail } from "@/data/user";

export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}

export const API_AUTH_PREFIX = "/api/auth";

export const DEFAULT_SIGN_IN_REDIRECT = "/";

export const AUTH_ROUTES = [
  "/auth/sign-in",
  "/auth/register",
  "/auth/error",
  "/auth/forgot-password",
  "/auth/reset-password",
];

export const PUBLIC_ROUTES = ["/auth/verify-email"];

const providers = [
  process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET && Google,

  Credentials({
    async authorize(credentials) {
      const validationResult = SignInSchema.safeParse(credentials);

      if (!validationResult.success) {
        return null;
      }

      const { email, password } = validationResult.data;

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
