/**
 * Utility functions for parsing and formatting dates across English and Bengali locales.
 */

export const STATIC_FALLBACK_DATE = new Date("2026-08-20T00:00:00.000Z");

export const BN_TO_EN_DIGITS: Record<string, string> = {
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

export const BN_MONTHS_MAP: Record<string, string> = {
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

export const BN_MONTH_NAMES = [
  "জানুয়ারি",
  "ফেব্রুয়ারি",
  "মার্চ",
  "এপ্রিল",
  "মে",
  "জুন",
  "জুলাই",
  "আগস্ট",
  "সেপ্টেম্বর",
  "অক্টোবর",
  "নভেম্বর",
  "ডিসেম্বর",
];

export const EN_MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

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

  // Normalize Bengali digits to English digits first
  let normalized = trimmed;
  for (const [bnDigit, enDigit] of Object.entries(BN_TO_EN_DIGITS)) {
    normalized = normalized.replaceAll(bnDigit, enDigit);
  }

  // 1. Direct parsing if standard format (e.g. YYYY-MM-DD or ISO 8601 or RFC2822)
  const ymdMatch = normalized.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (ymdMatch) {
    const year = parseInt(ymdMatch[1], 10);
    const month = parseInt(ymdMatch[2], 10) - 1;
    const day = parseInt(ymdMatch[3], 10);
    return new Date(Date.UTC(year, month, day, 12, 0, 0));
  }

  const parsedDirect = new Date(normalized);
  if (!isNaN(parsedDirect.getTime())) {
    return parsedDirect;
  }

  // 2. Parse Bengali localized dates like "১৪ আগস্ট, ২০২৬" or "14 August 2026"
  try {
    for (const [bnMonth, monthNum] of Object.entries(BN_MONTHS_MAP)) {
      if (normalized.includes(bnMonth)) {
        const cleanParts = normalized.replace(/,/g, "").split(/\s+/);
        const day = cleanParts[0]?.padStart(2, "0");
        const year = cleanParts[2] || cleanParts[1];
        if (day && year && !isNaN(Number(day)) && !isNaN(Number(year))) {
          const parsed = new Date(`${year}-${monthNum}-${day}T12:00:00.000Z`);
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

/**
 * Formats a date string (ISO, timestamp, or localized string) into a clean, human-readable date.
 * E.g. "2026-03-16T13:00:00+06:00" -> "১৬ মার্চ, ২০২৬" (bn) or "March 16, 2026" (en).
 */
export function formatArticleDate(
  dateStr?: string,
  locale: string = "bn",
  fallbackDate: Date = STATIC_FALLBACK_DATE
): string {
  if (!dateStr || typeof dateStr !== "string" || !dateStr.trim()) {
    dateStr = fallbackDate.toISOString();
  }

  const trimmed = dateStr.trim();
  const isEn = locale === "en";

  // Check if string already contains a Bengali month name
  const hasBnMonth = Object.keys(BN_MONTHS_MAP).some((m) => trimmed.includes(m));
  if (hasBnMonth) {
    if (!isEn) {
      // Return normalized Bengali numerals with standard spacing
      const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
      return trimmed
        .split("")
        .map((char) => {
          const parsed = parseInt(char, 10);
          return isNaN(parsed) ? char : banglaDigits[parsed];
        })
        .join("");
    }
    const parsed = parseArticleDate(trimmed, fallbackDate);
    const day = parsed.getUTCDate();
    const month = EN_MONTH_NAMES[parsed.getUTCMonth()];
    const year = parsed.getUTCFullYear();
    return `${month} ${day}, ${year}`;
  }

  const parsed = parseArticleDate(trimmed, fallbackDate);
  if (isNaN(parsed.getTime())) {
    return trimmed;
  }

  try {
    const formatter = new Intl.DateTimeFormat(isEn ? "en-US" : "bn-BD", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Dhaka",
    });
    return formatter.format(parsed);
  } catch {
    const day = parsed.getUTCDate();
    const monthIdx = parsed.getUTCMonth();
    const year = parsed.getUTCFullYear();
    if (isEn) {
      return `${EN_MONTH_NAMES[monthIdx]} ${day}, ${year}`;
    }
    const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    const toBnNum = (n: number) =>
      n
        .toString()
        .split("")
        .map((d) => banglaDigits[parseInt(d, 10)] ?? d)
        .join("");
    return `${toBnNum(day)} ${BN_MONTH_NAMES[monthIdx]}, ${toBnNum(year)}`;
  }
}
