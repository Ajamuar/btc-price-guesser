import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { getToken } from "next-auth/jwt";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

function stripLocalePrefix(pathname: string): string {
  const match = pathname.match(
    new RegExp(`^/(${routing.locales.join("|")})(/.*|$)`)
  );
  if (match) {
    const rest = match[2];
    if (rest === "" || rest === undefined) {
      return "/";
    }
    return rest;
  }
  return pathname;
}

function signInPathForPathname(pathname: string): string {
  const match = pathname.match(
    new RegExp(`^/(${routing.locales.join("|")})(/.*|$)`)
  );
  if (match && match[1] !== routing.defaultLocale) {
    return `/${match[1]}/auth/signin`;
  }
  return "/auth/signin";
}

export default async function middleware(request: NextRequest) {
  const response = intlMiddleware(request);
  if (response.headers.has("location")) {
    return response;
  }

  const pathname = request.nextUrl.pathname;
  if (stripLocalePrefix(pathname) !== "/play") {
    return response;
  }

  const token = await getToken({ req: request });
  if (token) {
    return response;
  }

  const signInUrl = new URL(signInPathForPathname(pathname), request.url);
  signInUrl.searchParams.set("callbackUrl", pathname);
  return NextResponse.redirect(signInUrl);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
