import { SITE_URL } from "@/lib/siteConfig";
import { logger } from "@/lib/logger";

/**
 * Standard IndexNow Configuration & Default Key
 * Key must be 8-128 hex or alphanumeric characters.
 */
export const DEFAULT_INDEXNOW_KEY = "8f7e2a9b3c4d5e6f7a8b9c0d1e2f3a4b";

export const INDEXNOW_ENDPOINTS = [
  "https://api.indexnow.org/indexnow",
  "https://www.bing.com/indexnow",
  "https://yandex.com/indexnow",
] as const;

export interface IndexNowPayload {
  host: string;
  key: string;
  keyLocation?: string;
  urlList: string[];
}

export interface IndexNowEndpointResult {
  endpoint: string;
  status: number;
  ok: boolean;
  message: string;
}

export interface IndexNowSubmissionResult {
  success: boolean;
  host: string;
  key: string;
  submittedCount: number;
  results: IndexNowEndpointResult[];
  error?: string;
}

/**
 * Returns the configured or default IndexNow API key.
 */
export function getIndexNowKey(): string {
  return (process.env.INDEXNOW_KEY || DEFAULT_INDEXNOW_KEY).trim();
}

/**
 * Returns the host domain (e.g. "www.healthclubfeni.com") extracted from SITE_URL.
 */
export function getIndexNowHost(): string {
  try {
    const parsed = new URL(SITE_URL);
    return parsed.host;
  } catch {
    return "www.healthclubfeni.com";
  }
}

/**
 * Returns the key location URL used by search engines to verify domain ownership.
 */
export function getIndexNowKeyLocation(): string {
  const key = getIndexNowKey();
  return `${SITE_URL}/${key}.txt`;
}

/**
 * Translates standard IndexNow HTTP status codes into human-readable messages.
 */
export function parseIndexNowStatus(statusCode: number): string {
  switch (statusCode) {
    case 200:
      return "URL(s) submitted successfully. Search engines acknowledged the change.";
    case 202:
      return "URL(s) accepted. IndexNow key will be validated and URLs queued for crawling.";
    case 400:
      return "Bad request. Invalid JSON payload format or empty URL list.";
    case 403:
      return "Forbidden. Invalided or unverified IndexNow key on host.";
    case 422:
      return "Unprocessable Entity. Submitted URLs do not match the specified host domain.";
    case 429:
      return "Too many requests. Rate limit temporarily reached for this domain.";
    default:
      if (statusCode >= 500) {
        return `Search engine server error (HTTP ${statusCode}).`;
      }
      return `IndexNow responded with status code ${statusCode}.`;
  }
}

/**
 * Submits an array of absolute URLs to the IndexNow network.
 * Immediately notifies search engines (Bing, Yandex, IndexNow partner engines) of new or updated pages.
 */
export async function submitUrlsToIndexNow(
  urls: string | string[],
  options?: {
    key?: string;
    keyLocation?: string;
    primaryEndpointOnly?: boolean;
    timeoutMs?: number;
  }
): Promise<IndexNowSubmissionResult> {
  const host = getIndexNowHost();
  const key = options?.key || getIndexNowKey();
  const keyLocation = options?.keyLocation || getIndexNowKeyLocation();
  const timeoutMs = options?.timeoutMs ?? 8000;

  // Normalize, deduplicate and filter valid URLs matching host
  const rawUrls = Array.isArray(urls) ? urls : [urls];
  const normalizedUrls = Array.from(
    new Set(
      rawUrls
        .map((u) => u.trim())
        .filter((u) => {
          if (!u.startsWith("http://") && !u.startsWith("https://")) return false;
          try {
            const parsed = new URL(u);
            return parsed.host.toLowerCase() === host.toLowerCase();
          } catch {
            return false;
          }
        })
    )
  );

  if (normalizedUrls.length === 0) {
    logger.warn("IndexNow submission aborted: No valid URLs matching domain host.", { host, rawUrls });
    return {
      success: false,
      host,
      key,
      submittedCount: 0,
      results: [],
      error: "No valid URLs matching current site host found.",
    };
  }

  // IndexNow allows up to 10,000 URLs per request
  const batchUrls = normalizedUrls.slice(0, 10000);

  const payload: IndexNowPayload = {
    host,
    key,
    keyLocation,
    urlList: batchUrls,
  };

  const endpointsToPing = options?.primaryEndpointOnly
    ? [INDEXNOW_ENDPOINTS[0]]
    : [INDEXNOW_ENDPOINTS[0], INDEXNOW_ENDPOINTS[1]];

  const endpointResults: IndexNowEndpointResult[] = [];

  for (const endpoint of endpointsToPing) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "User-Agent": "HealthClub-IndexNow/1.0",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timer);

      const ok = response.status === 200 || response.status === 202;
      const message = parseIndexNowStatus(response.status);

      endpointResults.push({
        endpoint,
        status: response.status,
        ok,
        message,
      });

      if (ok) {
        logger.info(`IndexNow success [${endpoint}]`, {
          host,
          count: batchUrls.length,
          status: response.status,
        });
      } else {
        logger.warn(`IndexNow warning [${endpoint}]: HTTP ${response.status}`, {
          message,
          host,
        });
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      logger.error(`IndexNow fetch failure for ${endpoint}:`, errorMsg);
      endpointResults.push({
        endpoint,
        status: 0,
        ok: false,
        message: `Network/Timeout error: ${errorMsg}`,
      });
    }
  }

  const overallSuccess = endpointResults.some((r) => r.ok);

  return {
    success: overallSuccess,
    host,
    key,
    submittedCount: batchUrls.length,
    results: endpointResults,
    error: overallSuccess ? undefined : endpointResults[0]?.message || "Failed to notify IndexNow endpoints",
  };
}

/**
 * Convenience helper to notify IndexNow when a specific blog post is published or updated.
 * Automatically pings the canonical post URL, /blog hub, /sitemap.xml, and home page.
 */
export async function notifyBlogUpdatedToIndexNow(slug: string): Promise<IndexNowSubmissionResult> {
  const cleanSlug = encodeURIComponent(slug.trim().toLowerCase());
  const urlsToPing = [
    `${SITE_URL}/blog/${cleanSlug}`,
    `${SITE_URL}/blog`,
    `${SITE_URL}/sitemap.xml`,
    `${SITE_URL}/`,
  ];

  return submitUrlsToIndexNow(urlsToPing, { primaryEndpointOnly: false });
}

/**
 * Batched submission for large sets of URLs (splits into batches of up to 10,000).
 */
export async function notifyBatchUrlsToIndexNow(urls: string[]): Promise<IndexNowSubmissionResult> {
  return submitUrlsToIndexNow(urls);
}
