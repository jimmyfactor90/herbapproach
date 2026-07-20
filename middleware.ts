import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Routes that require authentication
const protectedRoutes = ["/dashboard", "/checkout", "/wishlist", "/orders"];

// Routes that require admin role
const adminRoutes = ["/admin"];

// Routes that should redirect if already authenticated
const authRoutes = ["/login", "/register"];

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get session token from cookie (handles the __Secure- prefix used over https)
  const sessionCookie = getSessionCookie(request);

  const isAuthenticated = !!sessionCookie;

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && authRoutes.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Redirect unauthenticated users to login
  if (
    !isAuthenticated &&
    protectedRoutes.some((r) => pathname.startsWith(r))
  ) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Admin routes - check session cookie exists (role check happens server-side)
  if (!isAuthenticated && adminRoutes.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/checkout/:path*",
    "/wishlist/:path*",
    "/orders/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};
