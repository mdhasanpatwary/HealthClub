import { headers } from "next/headers";
import { logger } from "@/lib/logger";

export interface RateLimitSuccess {
  success: true;
  remaining: number;
  resetSeconds: 0;
  message?: string;
}

export interface RateLimitFailure {
  success: false;
  remaining: 0;
  resetSeconds: number;
  message: string;
}

export type RateLimitResult = RateLimitSuccess | RateLimitFailure;

export interface RateLimitRule {
  limit: number;
  windowMs: number;
}

// In-memory sliding-window log store
interface RateLimitEntry {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitEntry>();
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
let lastCleanup = Date.now();

/**
 * Prunes expired timestamps from the memory store to prevent memory bloat.
 */
function cleanupStore() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  for (const [key, entry] of rateLimitStore.entries()) {
    const validTimestamps = entry.timestamps.filter((ts) => now - ts < 60 * 60 * 1000);
    if (validTimestamps.length === 0) {
      rateLimitStore.delete(key);
    } else {
      entry.timestamps = validTimestamps;
    }
  }
}

/**
 * Safely extracts client IP address from Next.js request headers.
 */
export async function getClientIp(): Promise<string> {
  try {
    const headerList = await headers();
    const forwarded = headerList.get("x-forwarded-for");
    if (forwarded) {
      const firstIp = forwarded.split(",")[0]?.trim();
      if (firstIp) return firstIp;
    }
    const realIp = headerList.get("x-real-ip");
    if (realIp?.trim()) return realIp.trim();

    const cfIp = headerList.get("cf-connecting-ip");
    if (cfIp?.trim()) return cfIp.trim();

    return "127.0.0.1";
  } catch (error) {
    logger.warn("Could not retrieve client IP from headers:", error);
    return "127.0.0.1";
  }
}

/**
 * Formats seconds into Bengali text (e.g. "১ মিনিট ৩০ সেকেন্ড" or "৪৫ সেকেন্ড").
 */
export function formatBanglaTime(seconds: number): string {
  const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  const toBn = (num: number) =>
    num
      .toString()
      .split("")
      .map((d) => bnDigits[parseInt(d, 10)] ?? d)
      .join("");

  if (seconds < 60) {
    return `${toBn(seconds)} সেকেন্ড`;
  }
  const mins = Math.floor(seconds / 60);
  const remSecs = seconds % 60;
  if (remSecs === 0) {
    return `${toBn(mins)} মিনিট`;
  }
  return `${toBn(mins)} মিনিট ${toBn(remSecs)} সেকেন্ড`;
}

/**
 * Core sliding-window rate limit checker.
 *
 * @param key Unique identifier (e.g., `login:ip:192.168.1.1` or `contact:ip`)
 * @param limit Maximum allowed requests in the time window
 * @param windowMs Time window in milliseconds
 * @param customMessage Optional custom error prefix in Bengali
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
  customMessage?: string
): RateLimitResult {
  cleanupStore();

  const now = Date.now();
  const windowStart = now - windowMs;

  let entry = rateLimitStore.get(key);
  if (!entry) {
    entry = { timestamps: [] };
    rateLimitStore.set(key, entry);
  }

  // Filter out timestamps outside the sliding window
  entry.timestamps = entry.timestamps.filter((ts) => ts > windowStart);

  if (entry.timestamps.length >= limit) {
    const oldestTimestamp = entry.timestamps[0];
    const retryAfterMs = Math.max(1000, oldestTimestamp + windowMs - now);
    const resetSeconds = Math.ceil(retryAfterMs / 1000);
    const timeText = formatBanglaTime(resetSeconds);

    const defaultMsg = `অনেক বেশি অনুরোধ পাঠানো হয়েছে। অনুগ্রহ করে ${timeText} পর আবার চেষ্টা করুন।`;

    return {
      success: false,
      remaining: 0,
      resetSeconds,
      message: customMessage ? `${customMessage} (${timeText} পর আবার চেষ্টা করুন)` : defaultMsg,
    };
  }

  // Record this request timestamp
  entry.timestamps.push(now);

  return {
    success: true,
    remaining: limit - entry.timestamps.length,
    resetSeconds: 0,
  };
}

/**
 * Reset rate limit entry for a specific key (e.g., after a successful login).
 */
export function resetRateLimit(key: string): void {
  rateLimitStore.delete(key);
}

/**
 * Pre-configured rate limiting rules for different sensitive actions.
 */
export const RATE_LIMIT_RULES = {
  // Member & Admin Login
  LOGIN_PER_IP: { limit: 15, windowMs: 10 * 60 * 1000 },
  LOGIN_PER_IDENTIFIER: { limit: 5, windowMs: 10 * 60 * 1000 },
  ADMIN_LOGIN_PER_IP: { limit: 5, windowMs: 15 * 60 * 1000 },
  ADMIN_LOGIN_PER_IDENTIFIER: { limit: 5, windowMs: 15 * 60 * 1000 },

  // Registration & Onboarding
  REGISTRATION_PER_IP: { limit: 5, windowMs: 30 * 60 * 1000 },
  PARTNER_REQUEST_PER_IP: { limit: 5, windowMs: 30 * 60 * 1000 },

  // OTP & Password Reset
  OTP_VERIFY_PER_IP_ACCOUNT: { limit: 10, windowMs: 10 * 60 * 1000 },
  OTP_RESEND_PER_IP_ACCOUNT: { limit: 3, windowMs: 10 * 60 * 1000 },
  PASSWORD_RESET_REQ: { limit: 3, windowMs: 10 * 60 * 1000 },
  PASSWORD_RESET_CONFIRM: { limit: 5, windowMs: 10 * 60 * 1000 },

  // Public Submissions
  CONTACT_MESSAGE_PER_IP: { limit: 5, windowMs: 15 * 60 * 1000 },
  PARTNER_LOGIN_PER_IP: { limit: 10, windowMs: 10 * 60 * 1000 },
  PARTNER_LOGIN_PER_IDENTIFIER: { limit: 5, windowMs: 10 * 60 * 1000 },
} as const;
