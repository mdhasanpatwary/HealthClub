"use client";

import React, { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { Locale } from "@/lib/i18n";
import type { TranslationKey } from "@/lib/translations.en";

// Type for a locale dictionary
type Dict = Record<string, string>;

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey | string, fallbackEn?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({
  children,
  initialLocale,
  initialDict,
}: {
  children: React.ReactNode;
  initialLocale: Locale;
  /**
   * The active locale's dictionary, serialized server-side and passed as a prop.
   * Only the active locale is shipped to the client — cuts bundle by ~50%.
   */
  initialDict: Dict;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [dict, setDict] = useState<Dict>(initialDict);
  const router = useRouter();

  const setLocale = async (newLocale: Locale) => {
    // Dynamically import only the newly requested locale dictionary
    if (newLocale !== locale) {
      if (newLocale === "en") {
        const { en } = await import("@/lib/translations.en");
        setDict(en as unknown as Dict);
      } else {
        const { bn } = await import("@/lib/translations.bn");
        setDict(bn as unknown as Dict);
      }
    }
    setLocaleState(newLocale);
    document.cookie = `locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    router.refresh();
  };

  const t = (key: TranslationKey | string, fallbackEn?: string): string => {
    if (dict && dict[key]) {
      return dict[key];
    }
    if (fallbackEn !== undefined) {
      return fallbackEn;
    }
    return key as string;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
