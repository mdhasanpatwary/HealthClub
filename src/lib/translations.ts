/**
 * Re-exports translation dictionaries and types.
 * Client components should NOT import this directly — use LanguageProvider
 * which dynamically imports only the active locale's dictionary.
 */
export { en } from "./translations.en";
export { bn } from "./translations.bn";
export type { TranslationKey } from "./translations.en";
