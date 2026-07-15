"use client";

import React, { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { Locale } from "@/lib/i18n";
import { translations, TranslationKey } from "@/lib/translations";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey | string, fallbackEn?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({
  children,
  initialLocale,
}: {
  children: React.ReactNode;
  initialLocale: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const router = useRouter();

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    // Set a long-lived cookie (1 year)
    document.cookie = `locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    // Refresh the router to fetch updated Server Components with the new locale
    router.refresh();
  };

  const t = (key: TranslationKey | string, fallbackEn?: string) => {
    if (fallbackEn !== undefined) {
      return locale === "en" ? fallbackEn : (key as string);
    }
    const dict = translations[locale] as Record<string, string>;
    return dict[key] || key;
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
