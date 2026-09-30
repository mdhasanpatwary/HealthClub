import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { hasAdminPermission } from "@/lib/permissions";
import {
  getIndexNowKey,
  getIndexNowHost,
  getIndexNowKeyLocation,
  INDEXNOW_ENDPOINTS,
  submitUrlsToIndexNow,
  notifyBlogUpdatedToIndexNow,
  notifyBatchUrlsToIndexNow,
} from "@/lib/seo/indexNowHelper";
import { getAllBlogPostCardsAction } from "@/app/actions/blogAdminActions";
import { SITE_URL } from "@/lib/siteConfig";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";

/**
 * Verify administrative authorization for IndexNow programmatic triggers.
 */
async function verifyAuthorization(request: NextRequest): Promise<boolean> {
  // 1. Check active admin session cookie
  const session = await getSessionUser();
  if (session && session.role === "admin") {
    const role = session.adminRole || "super_admin";
    if (hasAdminPermission(role, "manage_blogs")) {
      return true;
    }
  }

  // 2. Check secret bearer token or API key header (for CI/CD, webhooks, or cron jobs)
  const authHeader = request.headers.get("authorization");
  const apiKeyHeader = request.headers.get("x-api-key");
  const secretKey = process.env.INDEXNOW_SECRET || process.env.SESSION_SECRET;

  if (secretKey) {
    const bearerMatch = authHeader === `Bearer ${secretKey}`;
    const keyMatch = apiKeyHeader === secretKey;
    if (bearerMatch || keyMatch) {
      return true;
    }
  }

  return false;
}

/**
 * GET /api/indexnow
 * Serves the IndexNow plain text verification key or JSON metadata status.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const wantsJson = searchParams.get("format") === "json" || request.headers.get("accept")?.includes("application/json");

  const key = getIndexNowKey();
  const host = getIndexNowHost();
  const keyLocation = getIndexNowKeyLocation();

  if (wantsJson) {
    return NextResponse.json({
      status: "active",
      host,
      key,
      keyLocation,
      endpoints: INDEXNOW_ENDPOINTS,
      siteUrl: SITE_URL,
    });
  }

  // IndexNow default: returns key in plain text
  return new NextResponse(key, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}

/**
 * POST /api/indexnow
 * Trigger IndexNow submission for specific URLs, blog posts, or the entire blog catalog.
 */
export async function POST(request: NextRequest) {
  const isAuthorized = await verifyAuthorization(request);
  if (!isAuthorized) {
    return NextResponse.json(
      { success: false, error: "অননুমোদিত অ্যাক্সেস। অনুগ্রহ করে অ্যাডমিন লগইন নিশ্চিত করুন।" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { urls, slug, allBlogs } = body as {
      urls?: string[];
      slug?: string;
      allBlogs?: boolean;
    };

    // Case 1: All published blog articles sync
    if (allBlogs) {
      const posts = await getAllBlogPostCardsAction();
      const allBlogUrls = [
        `${SITE_URL}/`,
        `${SITE_URL}/blog`,
        `${SITE_URL}/sitemap.xml`,
        ...posts.map((p) => `${SITE_URL}/blog/${encodeURIComponent(p.slug)}`),
      ];

      const result = await notifyBatchUrlsToIndexNow(allBlogUrls);
      logger.info(`IndexNow all-blogs sync triggered: ${allBlogUrls.length} URLs submitted`);

      return NextResponse.json({
        success: result.success,
        type: "all_blogs",
        submittedCount: result.submittedCount,
        results: result.results,
        error: result.error,
      });
    }

    // Case 2: Single blog slug sync
    if (slug && typeof slug === "string") {
      const result = await notifyBlogUpdatedToIndexNow(slug);
      return NextResponse.json({
        success: result.success,
        type: "single_blog",
        slug,
        submittedCount: result.submittedCount,
        results: result.results,
        error: result.error,
      });
    }

    // Case 3: Explicit list of URLs
    if (Array.isArray(urls) && urls.length > 0) {
      const result = await submitUrlsToIndexNow(urls);
      return NextResponse.json({
        success: result.success,
        type: "custom_urls",
        submittedCount: result.submittedCount,
        results: result.results,
        error: result.error,
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: "অনুরোধে 'urls', 'slug', অথবা 'allBlogs' প্যারামিটার প্রদান করুন।",
      },
      { status: 400 }
    );
  } catch (err: unknown) {
    logger.error("Error processing /api/indexnow POST request:", err);
    return NextResponse.json(
      { success: false, error: "IndexNow অনুরোধ প্রক্রিয়াকরণে ত্রুটি ঘটেছে।" },
      { status: 500 }
    );
  }
}
