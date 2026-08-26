import type { TranslationNamespace } from "./types";

/**
 * Determines the required translation namespaces for a given pathname.
 * Always includes "common" (layout, navigation, footer, reviews, and ui components).
 */
export function getNamespacesForRoute(pathname?: string | null): TranslationNamespace[] {
  if (!pathname || pathname === "/") {
    return ["common", "landing"];
  }

  // Normalize pathname
  const cleanPath = pathname.split("?")[0].replace(/\/$/, "") || "/";

  if (cleanPath.startsWith("/admin")) {
    return ["common", "admin"];
  }

  if (cleanPath.startsWith("/dashboard") || cleanPath.startsWith("/profile")) {
    return ["common", "dashboard"];
  }

  if (cleanPath.startsWith("/partner-hospitals")) {
    return ["common", "partnerHospitals"];
  }

  if (cleanPath.startsWith("/partner") || cleanPath.startsWith("/become-partner")) {
    return ["common", "partner"];
  }

  if (cleanPath.startsWith("/consultants") || cleanPath.startsWith("/doctors")) {
    return ["common", "consultants"];
  }

  if (cleanPath.startsWith("/emergency")) {
    return ["common", "emergency"];
  }

  if (cleanPath.startsWith("/membership")) {
    return ["common", "membership"];
  }

  if (cleanPath.startsWith("/health-tools")) {
    return ["common", "healthTools"];
  }

  if (
    cleanPath.startsWith("/login") ||
    cleanPath.startsWith("/register") ||
    cleanPath.startsWith("/forgot-password")
  ) {
    return ["common", "auth", "dashboard"];
  }

  if (cleanPath.startsWith("/verify")) {
    return ["common", "dashboard", "landing"];
  }

  if (cleanPath.startsWith("/offline")) {
    return ["common", "landing", "emergency"];
  }

  // Default to common + landing for public pages (e.g. /about-us, /privacy-policy, /terms-conditions)
  return ["common", "landing"];
}
