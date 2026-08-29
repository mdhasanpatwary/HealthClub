"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Locale } from "@/lib/i18n";
import type { TranslationKey } from "@/lib/translations.en";
import {
  TranslationNamespace,
  Dict,
  getNamespacesForRoute,
  namespaceLoaders,
  enNamespaces,
  bnNamespaces,
} from "@/lib/translations";

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
  initialNamespaces = ["common", "landing"],
}: {
  children: React.ReactNode;
  initialLocale: Locale;
  /**
   * Active route's translation dictionary slice serialized server-side.
   * Only the route namespaces are sent across the wire, cutting payload by 60-80%.
   */
  initialDict: Dict;
  initialNamespaces?: TranslationNamespace[];
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [dict, setDict] = useState<Dict>(initialDict);
  const loadedNamespacesRef = useRef<Set<TranslationNamespace>>(
    new Set(initialNamespaces)
  );
  const router = useRouter();
  const pathname = usePathname();

  // Dynamically load additional namespaces on client-side route navigation
  useEffect(() => {
    if (!pathname) return;
    const required = getNamespacesForRoute(pathname);
    const missing = required.filter((ns: TranslationNamespace) => !loadedNamespacesRef.current.has(ns));
    if (missing.length === 0) return;

    let isMounted = true;
    Promise.all(missing.map((ns: TranslationNamespace) => namespaceLoaders[locale][ns]())).then(
      (results: Dict[]) => {
        if (!isMounted) return;
        const merged: Dict = {};
        for (const res of results) {
          Object.assign(merged, res);
        }
        missing.forEach((ns: TranslationNamespace) => loadedNamespacesRef.current.add(ns));
        setDict((prev: Dict) => ({ ...prev, ...merged }));
      }
    );

    return () => {
      isMounted = false;
    };
  }, [pathname, locale]);

  const setLocale = async (newLocale: Locale) => {
    if (newLocale !== locale) {
      // Fetch all currently active namespaces in the new locale
      const activeNamespaces = Array.from(loadedNamespacesRef.current);
      const results = await Promise.all(
        activeNamespaces.map((ns: TranslationNamespace) => namespaceLoaders[newLocale][ns]())
      );
      const newDict: Dict = {};
      for (const res of results) {
        Object.assign(newDict, res);
      }
      setDict(newDict);
    }
    setLocaleState(newLocale);
    document.cookie = `locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    router.refresh();
  };

  const t = (key: TranslationKey | string, fallbackEn?: string): string => {
    if (dict && dict[key]) {
      return dict[key];
    }
    // Universal fallback across all namespaces for robust resilience
    const source = locale === "en" ? enNamespaces : bnNamespaces;
    for (const nsDict of Object.values(source)) {
      if (nsDict && nsDict[key]) {
        return nsDict[key];
      }
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
