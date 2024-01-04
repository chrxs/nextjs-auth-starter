import NextAuth from "next-auth";
import type { NextAuthConfig, User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";

import prisma from "@/utils/prisma";

declare module "next-auth" {
  interface Session {
    user: {
      picture?: string;
    } & Omit<User, "id">;
  }
}

export const authConfig = {
  debug: false,
  providers: [
    Google,
    // Credentials({
    //   credentials: { password: { label: "Password", type: "password" } },
    //   authorize(c) {
    //     if (c.password !== "1") return null;
    //     return {
    //       name: "Fill Murray",
    //       email: "bill@fillmurray.com",
    //       image: "https://www.fillmurray.com/64/64",
    //       id: "1",
    //     };
    //   },
    // }),
  ],
  callbacks: {
    authorized({ auth }) {
      return !!auth?.user;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
});
