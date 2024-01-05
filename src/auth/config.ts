import type { NextAuthConfig, User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

declare module "next-auth" {
  interface Session {
    user: {
      picture?: string;
    } & Omit<User, "id">;
  }
}

const authConfig = {
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

  // pages: {
  // signIn: "/auth/signin",
  // signOut: "/auth/signout",
  // error: "/auth/error", // Error code passed in query string as ?error=
  // verifyRequest: "/auth/verify-request", // (used for check email message)
  // newUser: "/auth/new-user", // New users will be directed here on first sign in (leave the property out if not of interest)
  // },
} satisfies NextAuthConfig;

export default authConfig;
