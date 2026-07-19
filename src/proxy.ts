import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session";

const protectedRoutes = ["/dashboard", "/admin", "/profile", "/partner"];
const adminRoutes = ["/admin"];
const partnerRoutes = ["/partner"];
const authRoutes = ["/login", "/register"];

const matchRoute = (path: string, route: string) => {
  return path === route || path.startsWith(route + "/");
};

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Read session cookie directly (no DB call — optimistic check only)
  const sessionCookie = req.cookies.get("session")?.value;
  const session = await decrypt(sessionCookie);

  // If user is NOT authenticated and trying to access protected routes
  const isProtectedRoute = protectedRoutes.some((r) => matchRoute(path, r));
  if (isProtectedRoute && !session?.userId) {
    if (matchRoute(path, "/partner")) {
      return NextResponse.redirect(new URL("/login/partner", req.nextUrl));
    }
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // If user IS authenticated, check role-based route permissions
  if (session?.userId) {
    // 1. Partners cannot access standard user routes (/dashboard or /profile)
    const isUserRoute = ["/dashboard", "/profile"].some((r) => matchRoute(path, r));
    if (isUserRoute && session.role === "partner") {
      return NextResponse.redirect(new URL("/partner/dashboard", req.nextUrl));
    }

    // 2. Only partners can access partner routes
    const isPartnerRoute = partnerRoutes.some((r) => matchRoute(path, r));
    if (isPartnerRoute && session.role !== "partner") {
      if (session.role === "admin") {
        return NextResponse.redirect(new URL("/admin", req.nextUrl));
      }
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }

    // 3. Only admins can access admin routes
    const isAdminRoute = adminRoutes.some((r) => matchRoute(path, r));
    if (isAdminRoute && session.role !== "admin") {
      if (session.role === "partner") {
        return NextResponse.redirect(new URL("/partner/dashboard", req.nextUrl));
      }
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }

    // 4. Authenticated users trying to access login/register routes → redirect to dashboards
    const isAuthRoute = authRoutes.some((r) => matchRoute(path, r));
    if (isAuthRoute) {
      if (path === "/login/admin" || path === "/login/partner") {
        return NextResponse.next();
      }
      if (session.role === "admin") {
        return NextResponse.redirect(new URL("/admin", req.nextUrl));
      } else if (session.role === "partner") {
        return NextResponse.redirect(new URL("/partner/dashboard", req.nextUrl));
      } else {
        return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
      }
    }
  }

  return NextResponse.next();
}

// Run proxy on all routes except static assets and API routes
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)"],
};
