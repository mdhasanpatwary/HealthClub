/**
 * Utility functions for parsing and formatting dates across English and Bengali locales.
 */

export const STATIC_FALLBACK_DATE = new Date("2026-08-20T00:00:00.000Z");

const BN_TO_EN_DIGITS: Record<string, string> = {
  "০": "0",
  "১": "1",
  "২": "2",
  "৩": "3",
  "৪": "4",
  "৫": "5",
  "৬": "6",
  "৭": "7",
  "৮": "8",
  "৯": "9",
};

const BN_MONTHS_MAP: Record<string, string> = {
  "জানুয়ারি": "01",
  "জানুয়ারি": "01",
  "ফেব্রুয়ারি": "02",
  "ফেব্রুয়ারি": "02",
  "মার্চ": "03",
  "এপ্রিল": "04",
  "মে": "05",
  "জুন": "06",
  "জুলাই": "07",
  "আগস্ট": "08",
  "আগষ্ট": "08",
  "সেপ্টেম্বর": "09",
  "অক্টোবর": "10",
  "নভেম্বর": "11",
  "ডিসেম্বর": "12",
};

/**
 * Parses an article publishedDate string (Bengali, ISO, or English) into a valid Date object.
 */
export function parseArticleDate(
  dateStr?: string,
  fallbackDate: Date = STATIC_FALLBACK_DATE
): Date {
  if (!dateStr || typeof dateStr !== "string") {
    return fallbackDate;
  }

  const trimmed = dateStr.trim();
  if (!trimmed) {
    return fallbackDate;
  }

  // 1. Direct parsing if standard format (e.g. YYYY-MM-DD or RFC2822)
  const parsedDirect = new Date(trimmed);
  if (!isNaN(parsedDirect.getTime())) {
    return parsedDirect;
  }

  // 2. Parse Bengali localized dates like "১৪ আগস্ট, ২০২৬" or "14 August 2026"
  try {
    let normalized = trimmed;
    for (const [bnDigit, enDigit] of Object.entries(BN_TO_EN_DIGITS)) {
      normalized = normalized.replaceAll(bnDigit, enDigit);
    }

    for (const [bnMonth, monthNum] of Object.entries(BN_MONTHS_MAP)) {
      if (normalized.includes(bnMonth)) {
        // e.g. "14 আগস্ট, 2026" -> remove comma and split
        const cleanParts = normalized.replace(/,/g, "").split(/\s+/);
        const day = cleanParts[0]?.padStart(2, "0");
        const year = cleanParts[2] || cleanParts[1];
        if (day && year && !isNaN(Number(day)) && !isNaN(Number(year))) {
          const parsed = new Date(`${year}-${monthNum}-${day}T00:00:00.000Z`);
          if (!isNaN(parsed.getTime())) {
            return parsed;
          }
        }
      }
    }
  } catch {
    // Fallback on unexpected parsing error
  }

  return fallbackDate;
}

/**
 * Derives an ISO 8601 YYYY-MM-DD formatted date string from an article's publishedDate string.
 */
export function getArticleIsoDate(
  dateStr?: string,
  fallbackDate: Date = STATIC_FALLBACK_DATE
): string {
  const parsed = parseArticleDate(dateStr, fallbackDate);
  return parsed.toISOString().split("T")[0];
}
