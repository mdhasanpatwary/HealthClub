import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/siteConfig";

const ALLOWED_PATHS = [
  "/",
  "/blog",
  "/blog/*",
  "/consultants",
  "/consultants/*",
  "/partner-hospitals",
  "/partner-hospitals/*",
  "/emergency",
  "/health-tips",
  "/health-tips/*",
  "/health-tools",
  "/membership",
  "/about-us",
  "/contact",
  "/become-partner",
  "/llms.txt",
  "/llms-full.txt",
];

const DISALLOWED_PATHS = [
  "/admin/",
  "/admin$",
  "/dashboard/",
  "/dashboard$",
  "/partner/",
  "/partner$",
  "/profile/",
  "/profile$",
  "/api/",
  "/api$",
  "/offline/",
  "/offline$",
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
  "GrokBot",
  "xAI-bot",
  "cohere-ai",
  "facebookexternalhit",
  "Meta-ExternalAgent",
];

export default function robots(): MetadataRoute.Robots {
  const baseUrl = SITE_URL;

  return {
    rules: [
      {
        userAgent: "*",
        allow: ALLOWED_PATHS,
        disallow: DISALLOWED_PATHS,
      },
      ...AI_AND_SEARCH_BOTS.map((bot) => ({
        userAgent: bot,
        allow: ALLOWED_PATHS,
        disallow: DISALLOWED_PATHS,
      })),
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

