import { toBanglaNums } from "./utils";
import { translations, TranslationKey } from "./translations";

export type Locale = "bn" | "en";

/**
 * Server-side translation utility.
 * Looks up the correct string from the translations dictionary depending on the active locale.
 */
export function tServer(locale: Locale, key: TranslationKey | string, fallbackEn?: string): string {
  if (fallbackEn !== undefined) {
    return locale === "en" ? fallbackEn : (key as string);
  }
  
  const dict = translations[locale as keyof typeof translations] as Record<string, string>;
  return dict?.[key] || key;
}

/**
 * Format a number or numeric string to match the current locale's writing system.
 * - Bangla: 'bn' -> converts to Bangla digits (e.g. 100 -> ১০০)
 * - English: 'en' -> retains standard English digits (e.g. 100 -> 100)
 */
export function formatNum(num: number | string, locale: Locale): string {
  if (!num && num !== 0) return "";
  if (locale === "en") return num.toString();
  return toBanglaNums(num);
}

/**
 * Format a discount string (e.g., "১০% ফ্ল্যাট ডিসকাউন্ট") to match the locale.
 */
export function formatDiscount(discount: string, locale: Locale): string {
  if (!discount) return "";
  if (locale === "en") {
    return discount
      .replace(/১০/g, "10")
      .replace(/৫/g, "5")
      .replace(/১৫/g, "15")
      .replace(/২০/g, "20")
      .replace(/ফ্ল্যাট/g, "Flat")
      .replace(/ডিসকাউন্ট/g, "Discount");
  }
  return discount;
}
