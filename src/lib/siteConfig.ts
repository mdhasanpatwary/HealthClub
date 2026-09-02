/**
 * Global Site Configuration & Canonical URLs
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : null) ||
  "https://www.healthclubfeni.com"
).replace(/\/$/, "");

/**
 * Standardized High-Resolution 1200x630 OpenGraph and Social Card Images
 */
export const DEFAULT_OG_IMAGES = [
  {
    url: `${SITE_URL}/og-image.png`,
    width: 1200,
    height: 630,
    alt: "হেলথ ক্লাব - স্বাস্থ্য সেবা হোক সহজ ও সাশ্রয়ী | Health Club",
    type: "image/png",
  },
  {
    url: `${SITE_URL}/og-image.jpg`,
    width: 1200,
    height: 630,
    alt: "হেলথ ক্লাব - স্বাস্থ্য সেবা হোক সহজ ও সাশ্রয়ী | Health Club",
    type: "image/jpeg",
  },
];

export const DEFAULT_TWITTER_IMAGES = [`${SITE_URL}/og-image.png`];
