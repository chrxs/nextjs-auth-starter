// Next Auth V5 - Advanced Guide (2024)
// https://www.youtube.com/watch?v=1MTyCvS05V4
// https://github.com/AntonioErdeljac/next-auth-v5-advanced-guide/blob/master/
import NextAuth from "next-auth";

import authConfig, {
  AUTH_ROUTES,
  PUBLIC_ROUTES,
  DEFAULT_SIGN_IN_REDIRECT,
  API_AUTH_PREFIX,
} from "@/auth/config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = Boolean(req.auth);
  const isApiAuthRoute = nextUrl.pathname.startsWith(API_AUTH_PREFIX);
  const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname);
  const isAuthRoute = Object.values(AUTH_ROUTES).includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return null;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_SIGN_IN_REDIRECT, nextUrl));
    }
    return null;
  }

  if (!isLoggedIn && !isPublicRoute) {
    let redirectTo = nextUrl.pathname;
    if (nextUrl.search) {
      redirectTo += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(redirectTo);

    return Response.redirect(
      new URL(`/auth/sign-in?redirectTo=${encodedCallbackUrl}`, nextUrl),
    );
  }

  return null;
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
