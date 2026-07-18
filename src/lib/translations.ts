/**
 * Backward-compat shim: re-exports both locale dictionaries as the combined
 * `translations` object used by tServer (server-side, tree-shaken at build time).
 *
 * Client components should NOT import this directly — use LanguageProvider
 * which dynamically imports only the active locale's dictionary.
 */
export { en } from "./translations.en";
export { bn } from "./translations.bn";
export type { TranslationKey } from "./translations.en";

import { en } from "./translations.en";
import { bn } from "./translations.bn";

export const translations = { en, bn } as const;
