import { toBanglaNums } from "./utils";
import { en } from "./translations.en";
import { bn } from "./translations.bn";
import type { TranslationKey } from "./translations.en";

export type Locale = "bn" | "en";

/**
 * Server-side translation utility.
 * Looks up the correct string from the translations dictionary depending on the active locale.
 */
export function tServer(locale: Locale, key: TranslationKey | string, fallbackEn?: string): string {
  if (fallbackEn !== undefined) {
    return locale === "en" ? fallbackEn : (key as string);
  }
  
  const dict = (locale === "en" ? en : bn) as Record<string, string>;
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
 * Format a discount string (e.g., "১০-২৫% ডিসকাউন্ট") to match the locale.
 */
export function formatDiscount(discount: string, locale: Locale): string {
  if (!discount) return "";
  if (locale === "en") {
    const banglaToEnglishMap: { [key: string]: string } = {
      "০": "0", "১": "1", "২": "2", "৩": "3", "৪": "4",
      "৫": "5", "৬": "6", "৭": "7", "৮": "8", "৯": "9",
    };
    let converted = discount;
    for (const [bangla, english] of Object.entries(banglaToEnglishMap)) {
      converted = converted.replaceAll(bangla, english);
    }
    return converted
      .replace(/ফ্ল্যাট/g, "Flat")
      .replace(/ডিসকাউন্ট/g, "Discount")
      .replace(/ছাড়/g, "Discount");
  }
  return discount;
}
