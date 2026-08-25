import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/siteConfig";

const DISALLOWED_PATHS = [
  "/admin/",
  "/admin/*",
  "/dashboard/",
  "/dashboard/*",
  "/partner/",
  "/partner/*",
  "/profile/",
  "/profile/*",
  "/api/",
  "/api/*",
  "/login/admin",
  "/login/partner",
  "/register/payment",
  "/register/verify-email",
  "/forgot-password/reset",
];

const AI_AND_SEARCH_BOTS = [
  "Googlebot",
  "Bingbot",
  "Applebot",
  "GPTBot",
  "ClaudeBot",
  "PerplexityBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "Google-Extended",
  "Applebot-Extended",
  "cohere-ai",
];

export default function robots(): MetadataRoute.Robots {
  const baseUrl = SITE_URL;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: DISALLOWED_PATHS,
      },
      ...AI_AND_SEARCH_BOTS.map((bot) => ({
        userAgent: bot,
        allow: "/",
        disallow: DISALLOWED_PATHS,
      })),
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

