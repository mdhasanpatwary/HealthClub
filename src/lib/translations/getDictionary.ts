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

export { namespaceLoaders } from "./clientLoaders";

