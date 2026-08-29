import type { TranslationNamespace } from "./types";

/**
 * Determines the required translation namespaces for a given pathname.
 * Always includes "common" (layout, navigation, footer, reviews, and ui components).
 */
export function getNamespacesForRoute(pathname?: string | null): TranslationNamespace[] {
  if (!pathname || pathname === "/") {
    return ["common", "landing", "partnerHospitals", "consultants", "emergency"];
  }

  // Normalize pathname
  const cleanPath = pathname.split("?")[0].replace(/\/$/, "") || "/";

  if (cleanPath.startsWith("/admin")) {
    return ["common", "admin", "dashboard", "consultants", "partner", "emergency"];
  }

  if (cleanPath.startsWith("/dashboard") || cleanPath.startsWith("/profile")) {
    return ["common", "dashboard"];
  }

  if (cleanPath.startsWith("/partner-hospitals")) {
    return ["common", "partnerHospitals", "consultants", "emergency"];
  }

  if (cleanPath.startsWith("/partner") || cleanPath.startsWith("/become-partner")) {
    return ["common", "partner", "consultants"];
  }

  if (cleanPath.startsWith("/consultants") || cleanPath.startsWith("/doctors")) {
    return ["common", "consultants", "emergency"];
  }

  if (cleanPath.startsWith("/emergency")) {
    return ["common", "emergency"];
  }

  if (cleanPath.startsWith("/membership")) {
    return ["common", "membership", "landing"];
  }

  if (cleanPath.startsWith("/health-tools")) {
    return ["common", "healthTools"];
  }

  if (cleanPath.startsWith("/health-tips")) {
    return ["common", "landing", "consultants"];
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

  // Default to common + landing + emergency for general public pages (e.g. /about-us, /privacy-policy, /terms-conditions, /contact)
  return ["common", "landing", "emergency"];
}

