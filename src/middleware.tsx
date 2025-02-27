import { NextResponse } from "next/server";
import withAuth from "next-auth/middleware";

export default withAuth(function middleware(req) {
  const token = req.nextauth.token;
  const isLoggedIn = !!token;

  const url = req.nextUrl.clone();
  if (!isLoggedIn) {
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  if (["dashboard", "add-device"].includes(req.nextUrl.pathname)) {
    url.pathname = "dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/add-device/:path*", "/stats/:path*"],
};
