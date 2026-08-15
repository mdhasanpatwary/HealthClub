/**
 * Global Site Configuration & Canonical URLs
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : null) ||
  "https://healthclubfeni.com"
).replace(/\/$/, "");
