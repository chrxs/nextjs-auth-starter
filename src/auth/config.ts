import type { NextAuthConfig, User } from "next-auth";
import type { Provider } from "next-auth/providers";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

declare module "next-auth" {
  interface Session {
    user: {
      picture?: string;
    } & Omit<User, "id">;
  }
}

export const API_AUTH_PREFIX = "/api/auth";

export const DEFAULT_LOGIN_REDIRECT = "/";

// const authRoutes = [
//   "/auth/signin",
//   "/auth/register",
//   "/auth/error",
//   "/auth/reset",
//   "/auth/new-password",
// ];
export const AUTH_ROUTES = {
  signIn: "/signin",
  // signOut: "/auth/signout",
  // error: "/auth/error", // Error code passed in query string as ?error=
  // verifyRequest: "/auth/verify-request", // (used for check email message)
  // newUser: "/auth/new-user", // New users will be directed here on first sign in (leave the property out if not of interest)
};

export const PUBLIC_ROUTES = {};

const providers = [
  process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET && Google,

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
].filter(Boolean) as Provider[];

const authConfig = {
  debug: false,
  providers,
  callbacks: {
    authorized({ auth }) {
      return !!auth?.user;
    },
  },

  pages: AUTH_ROUTES,
} satisfies NextAuthConfig;

export default authConfig;
