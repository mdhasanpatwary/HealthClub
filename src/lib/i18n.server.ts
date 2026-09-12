import "server-only";
import { en } from "./translations.en";
import { bn } from "./translations.bn";
import type { TranslationKey } from "./translations.en";
import type { Locale } from "./i18n";

/**
 * Server-side translation utility.
 * Looks up the correct string from the translations dictionary depending on the active locale.
 * Kept strictly server-only to prevent large translation dictionaries from bundling into client code.
 */
export function tServer(
  locale: Locale,
  key: TranslationKey | (string & {}),
  fallbackEn?: string
): string {
  if (fallbackEn !== undefined) {
    return locale === "en" ? fallbackEn : (key as string);
  }

  const dict = (locale === "en" ? en : bn) as Record<string, string>;
  if (dict?.[key]) return dict[key];
  if (locale !== "en" && (en as Record<string, string>)?.[key]) {
    return (en as Record<string, string>)[key];
  }
  return key as string;
}
