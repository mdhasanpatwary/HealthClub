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
  "/register",
  "/login",
  "/privacy-policy",
  "/terms-conditions",
  "/llms.txt",
  "/llms-full.txt",
  "/images/*",
  "/icons/*",
  "/logo/*",
];

const DISALLOWED_PATHS = [
  "/admin",
  "/admin/*",
  "/dashboard",
  "/dashboard/*",
  "/partner/*",
  "/profile",
  "/profile/*",
  "/verify",
  "/verify/*",
  "/api",
  "/api/*",
  "/offline",
  "/offline/*",
  "/login/admin",
  "/login/partner",
  "/register/payment",
  "/register/verify-email",
  "/forgot-password/reset",
  "/_next/static/media/*",
  "/*.woff2$",
  "/*.woff$",
  "/*.ttf$",
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
  "anthropic-ai",
  "DuckAssistBot",
  "GrokBot",
  "xAI-bot",
  "cohere-ai",
  "facebookexternalhit",
  "Meta-ExternalAgent",
];

const AGGRESSIVE_SCRAPERS = [
  "Bytespider",
  "CCBot",
  "Amazonbot",
  "SemrushBot",
  "AhrefsBot",
  "MJ12bot",
  "DotBot",
  "PetalBot",
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
      ...AGGRESSIVE_SCRAPERS.map((bot) => ({
        userAgent: bot,
        disallow: ["/"],
      })),
      ...AI_AND_SEARCH_BOTS.map((bot) => ({
        userAgent: bot,
        allow: ALLOWED_PATHS,
        disallow: DISALLOWED_PATHS,
      })),
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

