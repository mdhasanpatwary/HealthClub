import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session";
import { canAccessAdminRoute } from "@/lib/permissions";

const protectedRoutes = ["/dashboard", "/admin", "/profile", "/partner"];
const adminRoutes = ["/admin"];
const partnerRoutes = ["/partner"];
const authRoutes = ["/login", "/register"];

// Public routes that never need session checks — skip JWT decrypt entirely
const publicRoutes = [
  "/about-us",
  "/partner-hospitals",
  "/consultants",
  "/doctors",
  "/membership",
  "/contact",
  "/privacy-policy",
  "/terms-conditions",
  "/become-partner",
  "/forgot-password",
  "/offline",
  "/verify",
  "/emergency",
  "/health-tools",
  "/health-tips",
  "/register/payment",
];

const matchRoute = (path: string, route: string) => {
  return path === route || path.startsWith(route + "/");
};

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", path);

  // Fast path: skip JWT decrypt for public-only routes (saves ~20ms per request)
  if (path === "/" || publicRoutes.some((r) => matchRoute(path, r))) {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // Read session cookie directly (no DB call — optimistic check only)
  const sessionCookie = req.cookies.get("session")?.value;
  const session = await decrypt(sessionCookie);

  // If user is NOT authenticated and trying to access protected routes
  const isProtectedRoute = protectedRoutes.some((r) => matchRoute(path, r));
  if (isProtectedRoute && !session?.userId) {
    if (matchRoute(path, "/admin")) {
      return NextResponse.redirect(new URL("/login/admin", req.nextUrl));
    }
    if (matchRoute(path, "/partner")) {
      return NextResponse.redirect(new URL("/login/partner", req.nextUrl));
    }
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // If user IS authenticated, check role-based route permissions
  if (session?.userId) {
    // 1. Partners cannot access standard user routes (/dashboard or /profile)
    const isUserRoute = ["/dashboard", "/profile"].some((r) => matchRoute(path, r));
    if (isUserRoute && (session.role === "partner" || session.role === "partner_staff")) {
      return NextResponse.redirect(new URL("/partner/dashboard", req.nextUrl));
    }

    // 2. Only partners and partner staff can access partner routes
    const isPartnerRoute = partnerRoutes.some((r) => matchRoute(path, r));
    if (isPartnerRoute && session.role !== "partner" && session.role !== "partner_staff") {
      if (session.role === "admin") {
        return NextResponse.redirect(new URL("/admin", req.nextUrl));
      }
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }

    // 3. Only admins can access admin routes
    const isAdminRoute = adminRoutes.some((r) => matchRoute(path, r));
    if (isAdminRoute) {
      if (session.role !== "admin") {
        if (session.role === "partner" || session.role === "partner_staff") {
          return NextResponse.redirect(new URL("/partner/dashboard", req.nextUrl));
        }
        return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
      }

      // Check granular RBAC permissions for admin sub-routes
      const adminRole = session.adminRole || "super_admin";
      if (!canAccessAdminRoute(adminRole, path)) {
        return NextResponse.redirect(new URL("/admin", req.nextUrl));
      }
    }

    // 4. Authenticated users trying to access login/register routes → redirect to dashboards
    const isAuthRoute = authRoutes.some((r) => matchRoute(path, r));
    if (isAuthRoute) {
      if (path === "/login/admin" || path === "/login/partner") {
        return NextResponse.next({
          request: {
            headers: requestHeaders,
          },
        });
      }
      if (session.role === "admin") {
        return NextResponse.redirect(new URL("/admin", req.nextUrl));
      } else if (session.role === "partner" || session.role === "partner_staff") {
        return NextResponse.redirect(new URL("/partner/dashboard", req.nextUrl));
      } else {
        return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
      }
    }
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// Run proxy on all routes except static assets and API routes
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)"],
};
