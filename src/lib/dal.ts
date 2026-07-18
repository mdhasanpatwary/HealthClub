import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { getSessionUser, type SessionPayload } from "./session";

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
 * Verifies that the current session user has admin role.
 * Redirects to /dashboard if not admin.
 */
export const verifyAdmin = cache(async (): Promise<SessionPayload> => {
  const session = await verifySession();
  if (session.role !== "admin") {
    redirect("/dashboard");
  }
  return session;
});

/**
 * Gets the current session if it exists, without redirecting.
 * Returns null if no valid session. Useful for conditional UI rendering.
 */
export const getOptionalSession = cache(async (): Promise<SessionPayload | null> => {
  return getSessionUser();
});
