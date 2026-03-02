import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedPaths = ["/cart", "/checkout", "/account", "/orders"];
const guestOnlyPaths = ["/connexion", "/inscription"];

function isMatchingPath(pathname: string, paths: string[]) {
  return paths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const isLoggedIn = !!token;

  if (!isLoggedIn && isMatchingPath(pathname, protectedPaths)) {
    const callbackUrl = `${pathname}${search}`;
    const loginUrl = new URL("/connexion", request.url);
    loginUrl.searchParams.set("callbackUrl", callbackUrl);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoggedIn && isMatchingPath(pathname, guestOnlyPaths)) {
    const target = request.nextUrl.searchParams.get("callbackUrl") ?? "/account";
    return NextResponse.redirect(new URL(target, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/cart/:path*", "/checkout/:path*", "/account/:path*", "/orders/:path*", "/connexion", "/inscription"],
};
