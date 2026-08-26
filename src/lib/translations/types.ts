export type Locale = "bn" | "en";

export type TranslationNamespace =
  | "common"
  | "landing"
  | "auth"
  | "admin"
  | "dashboard"
  | "partner"
  | "consultants"
  | "emergency"
  | "partnerHospitals"
  | "membership"
  | "healthTools";

export type Dict = Record<string, string>;
