import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/siteConfig";

/**
 * Disallowed API endpoints for legitimate search bots.
 * Note: Private user/admin pages (/admin, /dashboard, /profile, /verify, /login/admin)
 * use <meta name="robots" content="noindex, nofollow"> in their layouts instead of robots.txt
 * disallow, so Googlebot can crawl and discover the noindex directive to prevent
 * "Indexed, though blocked by robots.txt" Search Console warnings.
 */
const DISALLOWED_PATHS = [
  "/api",
  "/api/*",
];

const ALLOWED_PATHS = [
  "/",
  "/llms.txt",
  "/llms-full.txt",
  "/blog",
  "/consultants",
  "/partner-hospitals",
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


