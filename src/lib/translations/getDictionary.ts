import type { Locale, TranslationNamespace, Dict } from "./types";
import {
  commonEn,
  landingEn,
  authEn,
  adminEn,
  dashboardEn,
  partnerEn,
  consultantsEn,
  emergencyEn,
  partnerHospitalsEn,
  membershipEn,
  healthToolsEn,
  en,
} from "./en/index";
import {
  commonBn,
  landingBn,
  authBn,
  adminBn,
  dashboardBn,
  partnerBn,
  consultantsBn,
  emergencyBn,
  partnerHospitalsBn,
  membershipBn,
  healthToolsBn,
  bn,
} from "./bn/index";

export const enNamespaces: Record<TranslationNamespace, Dict> = {
  common: commonEn,
  landing: landingEn,
  auth: authEn,
  admin: adminEn,
  dashboard: dashboardEn,
  partner: partnerEn,
  consultants: consultantsEn,
  emergency: emergencyEn,
  partnerHospitals: partnerHospitalsEn,
  membership: membershipEn,
  healthTools: healthToolsEn,
};

export const bnNamespaces: Record<TranslationNamespace, Dict> = {
  common: commonBn,
  landing: landingBn,
  auth: authBn,
  admin: adminBn,
  dashboard: dashboardBn,
  partner: partnerBn,
  consultants: consultantsBn,
  emergency: emergencyBn,
  partnerHospitals: partnerHospitalsBn,
  membership: membershipBn,
  healthTools: healthToolsBn,
};

/**
 * Synchronous dictionary builder for Server Components and initial HTML payloads.
 * Combines only the requested namespaces for the given locale.
 */
export function getDictionary(
  locale: Locale,
  namespaces: TranslationNamespace[] = ["common", "landing"]
): Dict {
  const isEn = locale === "en";
  const source = isEn ? enNamespaces : bnNamespaces;
  const result: Dict = {};

  for (const ns of namespaces) {
    const dict = source[ns];
    if (dict) {
      Object.assign(result, dict);
    }
  }

  return result;
}

/**
 * Returns the entire translation dictionary for server-side operations (e.g. tServer).
 */
export function getFullDictionary(locale: Locale): Dict {
  return (locale === "en" ? en : bn) as unknown as Dict;
}

/**
 * Client-side dynamic loaders for on-demand namespace chunk fetching.
 */
export const namespaceLoaders: Record<
  Locale,
  Record<TranslationNamespace, () => Promise<Dict>>
> = {
  en: {
    common: () => import("./en/common").then((m) => m.commonEn as unknown as Dict),
    landing: () => import("./en/landing").then((m) => m.landingEn as unknown as Dict),
    auth: () => import("./en/auth").then((m) => m.authEn as unknown as Dict),
    admin: () => import("./en/admin").then((m) => m.adminEn as unknown as Dict),
    dashboard: () => import("./en/dashboard").then((m) => m.dashboardEn as unknown as Dict),
    partner: () => import("./en/partner").then((m) => m.partnerEn as unknown as Dict),
    consultants: () => import("./en/consultants").then((m) => m.consultantsEn as unknown as Dict),
    emergency: () => import("./en/emergency").then((m) => m.emergencyEn as unknown as Dict),
    partnerHospitals: () =>
      import("./en/partnerHospitals").then((m) => m.partnerHospitalsEn as unknown as Dict),
    membership: () => import("./en/membership").then((m) => m.membershipEn as unknown as Dict),
    healthTools: () => import("./en/healthTools").then((m) => m.healthToolsEn as unknown as Dict),
  },
  bn: {
    common: () => import("./bn/common").then((m) => m.commonBn as unknown as Dict),
    landing: () => import("./bn/landing").then((m) => m.landingBn as unknown as Dict),
    auth: () => import("./bn/auth").then((m) => m.authBn as unknown as Dict),
    admin: () => import("./bn/admin").then((m) => m.adminBn as unknown as Dict),
    dashboard: () => import("./bn/dashboard").then((m) => m.dashboardBn as unknown as Dict),
    partner: () => import("./bn/partner").then((m) => m.partnerBn as unknown as Dict),
    consultants: () => import("./bn/consultants").then((m) => m.consultantsBn as unknown as Dict),
    emergency: () => import("./bn/emergency").then((m) => m.emergencyBn as unknown as Dict),
    partnerHospitals: () =>
      import("./bn/partnerHospitals").then((m) => m.partnerHospitalsBn as unknown as Dict),
    membership: () => import("./bn/membership").then((m) => m.membershipBn as unknown as Dict),
    healthTools: () => import("./bn/healthTools").then((m) => m.healthToolsBn as unknown as Dict),
  },
};
