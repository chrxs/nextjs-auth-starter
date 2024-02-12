import { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
// Next Auth V5 - Advanced Guide (2024)
// https://www.youtube.com/watch?v=1MTyCvS05V4
// https://github.com/AntonioErdeljac/next-auth-v5-advanced-guide/blob/master/
import NextAuth from "next-auth";

import { LOCALES, DEFAULT_LOCALE, LOCALE_PREFIX } from "@/i18n/constants";

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales: LOCALES,
  // Used when no locale matches
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: LOCALE_PREFIX,
});

import authConfig, {
  AUTH_ROUTES,
  PUBLIC_ROUTES,
  DEFAULT_SIGN_IN_REDIRECT,
  API_AUTH_PREFIX,
} from "@/auth/config";

const { auth } = NextAuth(authConfig);

interface AppRouteHandlerFnContext {
  params?: Record<string, string | string[]>;
}

const middleware = (request: NextRequest, event: AppRouteHandlerFnContext) => {
  return auth((req) => {
    const { nextUrl } = req;

    const regex = new RegExp(`^\/(${LOCALES.join("|")})\/`);
    const [pathnameWithoutLocale, urlLocale = ""] = nextUrl.pathname
      .split(regex)
      .reverse()
      .map((str) => `/${str}`.replace(/^\/+/, "/"));

    const isLoggedIn = Boolean(req.auth);
    const isApiAuthRoute = pathnameWithoutLocale.startsWith(API_AUTH_PREFIX);
    const isPublicRoute = PUBLIC_ROUTES.includes(pathnameWithoutLocale);
    const isAuthRoute = Object.values(AUTH_ROUTES).includes(
      pathnameWithoutLocale,
    );

    if (isApiAuthRoute) {
      return intlMiddleware(request);
    }

    if (isAuthRoute) {
      if (isLoggedIn) {
        return Response.redirect(
          new URL(urlLocale + DEFAULT_SIGN_IN_REDIRECT, nextUrl),
        );
      }
      return intlMiddleware(request);
    }

    if (!isLoggedIn && !isPublicRoute) {
      let callbackUrl = nextUrl.pathname;
      if (nextUrl.search) {
        callbackUrl += nextUrl.search;
      }

      const encodedCallbackUrl = encodeURIComponent(callbackUrl);

      return Response.redirect(
        new URL(
          `${urlLocale}/auth/sign-in?callbackUrl=${encodedCallbackUrl}`,
          nextUrl,
        ),
      );
    }

    // return null;
    return intlMiddleware(request);
  })(request, event);
};

export default middleware;

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
