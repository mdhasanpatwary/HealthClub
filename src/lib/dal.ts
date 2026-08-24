import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { getSessionUser, type SessionPayload } from "./session";
import { AdminRole } from "@/services/db";

/**
 * Data Access Layer — verifies user session.
 * Memoized per React render pass using `cache()`.
 * Redirects to /login if no valid session found.
 */
export const verifySession = cache(async (): Promise<SessionPayload> => {
  const session = await getSessionUser();
  if (!session?.userId) {
    redirect("/login");
  }
  return session;
});

/**
 * Verifies that the current session user has admin role and optional specific RBAC role.
 * Redirects to /login/admin if not authenticated, or /dashboard if not admin,
 * or /admin if admin doesn't have required granular role.
 */
export const verifyAdmin = async (allowedRoles?: AdminRole[]): Promise<SessionPayload> => {
  const session = await getSessionUser();
  if (!session?.userId) {
    redirect("/login/admin");
  }
  if (session.role !== "admin") {
    redirect("/dashboard");
  }
  if (allowedRoles && allowedRoles.length > 0) {
    const adminRole = session.adminRole || "super_admin";
    if (!allowedRoles.includes(adminRole)) {
      redirect("/admin");
    }
  }
  return session;
};

/**
 * Gets the current session if it exists, without redirecting.
 * Returns null if no valid session. Useful for conditional UI rendering.
 */
export const getOptionalSession = cache(async (): Promise<SessionPayload | null> => {
  return getSessionUser();
});
