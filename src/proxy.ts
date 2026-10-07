import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session";
import { canAccessAdminRoute } from "@/lib/permissions";
import { logger } from "@/lib/logger";

const protectedRoutes = ["/dashboard", "/admin", "/profile", "/partner"];
const adminRoutes = ["/admin"];
const partnerRoutes = ["/partner"];
const authRoutes = ["/login", "/register"];

const matchRoute = (path: string, route: string) => {
  return path === route || path.startsWith(route + "/");
};

export async function proxy(req: NextRequest) {
  try {
    const path = req.nextUrl.pathname;

    // Reject aggressive, non-search scraping bots to preserve Vercel Active CPU quota
    const userAgent = req.headers.get("user-agent") || "";
    if (/(Bytespider|MJ12bot|DotBot|SemrushBot|AhrefsBot)/i.test(userAgent)) {
      return new NextResponse("Access restricted for automated scrapers", { status: 403 });
    }

    // Read session cookie directly (no DB call — optimistic JWT decrypt)
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
          const fallbackPath = adminRole === "shop_owner" ? "/admin/products" : "/admin";
          return NextResponse.redirect(new URL(fallbackPath, req.nextUrl));
        }
      }

      // 4. Authenticated users trying to access login/register routes → redirect to dashboards
      const isAuthRoute = authRoutes.some((r) => matchRoute(path, r));
      if (isAuthRoute) {
        if (path === "/login/admin" || path === "/login/partner") {
          return NextResponse.next();
        }
        if (session.role === "admin") {
          const defaultAdminPath = session.adminRole === "shop_owner" ? "/admin/products" : "/admin";
          return NextResponse.redirect(new URL(defaultAdminPath, req.nextUrl));
        } else if (session.role === "partner" || session.role === "partner_staff") {
          return NextResponse.redirect(new URL("/partner/dashboard", req.nextUrl));
        } else {
          return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
        }
      }
    }

    return NextResponse.next();
  } catch (error) {
    logger.error("[PROXY_ERROR] Unhandled exception in proxy middleware:", error);
    return NextResponse.next();
  }
}

// Scope proxy strictly to protected panels and auth routes.
// Public visitors (browsing /, /consultants, /partner-hospitals, /blog, /emergency, /membership)
// bypass proxy entirely, serving 100% from Vercel Edge CDN with 0 Active CPU.
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/partner/:path*",
    "/profile/:path*",
    "/login/:path*",
    "/register/:path*",
  ],
};
