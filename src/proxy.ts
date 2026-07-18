import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session";

const protectedRoutes = ["/dashboard", "/admin", "/profile"];
const adminRoutes = ["/admin"];
const authRoutes = ["/login", "/register"];

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Read session cookie directly (no DB call — optimistic check only)
  const sessionCookie = req.cookies.get("session")?.value;
  const session = await decrypt(sessionCookie);

  // If user is NOT authenticated and trying to access protected routes → redirect to login
  const isProtectedRoute = protectedRoutes.some((r) => path.startsWith(r));
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // If user is authenticated but NOT admin and trying to access admin routes → redirect to dashboard
  const isAdminRoute = adminRoutes.some((r) => path.startsWith(r));
  if (isAdminRoute && session?.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  // If user IS authenticated and trying to access login/register → redirect to dashboard
  const isAuthRoute = authRoutes.some((r) => path.startsWith(r));
  if (isAuthRoute && session?.userId) {
    // Allow admin to access admin login if they want to re-login
    if (path === "/login/admin") {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}

// Run proxy on all routes except static assets and API routes
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)"],
};
