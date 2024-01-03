import NextAuth from "next-auth";
import type { NextAuthConfig, User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

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
    Credentials({
      credentials: { password: { label: "Password", type: "password" } },
      authorize(c) {
        if (c.password !== "1") return null;
        return {
          name: "Fill Murray",
          email: "bill@fillmurray.com",
          image: "https://www.fillmurray.com/64/64",
          id: "1",
        };
      },
    }),
  ],
  callbacks: {
    authorized({ auth }) {
      console.log("authorized", auth);
      return !!auth?.user;
    },

    async signIn({ user, account, profile }) {
      console.log("signIn", {
        user,
        account,
        profile,
      });

      if (!profile?.email) {
        throw new Error("No profile");
      }

      await prisma?.user.upsert({
        where: {
          email: profile.email,
        },
        create: {
          email: profile.email,
          name: profile.name,
        },
        update: {
          name: profile.name,
        },
      });

      return true;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

// import NextAuth from "next-auth";
// import { PrismaAdapter } from "@auth/prisma-adapter";
// import Google from "next-auth/providers/google"

// import prisma from "@/utils/prisma";
// // import authConfig from "./auth.config";

// export const {
//   handlers: { GET, POST },
//   auth,
// } = NextAuth({
//   adapter: PrismaAdapter(prisma),
//   session: { strategy: "jwt" },
//   providers: [Google],
//   callbacks: {
//     async signIn({ account, profile }) {
//       if (account.provider === "google") {
//         return profile.email_verified && profile.email.endsWith("@example.com")
//       }
//       return true // Do different verification for other providers that don't have `email_verified`
//     },
//   },
//   // ...authConfig,
// });
