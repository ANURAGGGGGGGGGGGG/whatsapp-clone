import { NextResponse } from "next/server";

const AUTH_COOKIE = "whatsapp_clone.auth";

export function middleware(req) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/api")) return NextResponse.next();
  if (pathname.startsWith("/_next")) return NextResponse.next();
  if (pathname === "/favicon.ico") return NextResponse.next();

  const isLoggedIn = req.cookies.get(AUTH_COOKIE)?.value === "1";

  if (!isLoggedIn && pathname !== "/login") {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (isLoggedIn && pathname === "/login") {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
