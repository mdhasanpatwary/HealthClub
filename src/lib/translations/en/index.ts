import { commonEn } from "./common";
import { landingEn } from "./landing";
import { authEn } from "./auth";
import { adminEn } from "./admin";
import { dashboardEn } from "./dashboard";
import { partnerEn } from "./partner";
import { consultantsEn } from "./consultants";
import { emergencyEn } from "./emergency";
import { partnerHospitalsEn } from "./partnerHospitals";
import { membershipEn } from "./membership";
import { healthToolsEn } from "./healthTools";

export {
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
};

export const en = {
  ...commonEn,
  ...landingEn,
  ...authEn,
  ...adminEn,
  ...dashboardEn,
  ...partnerEn,
  ...consultantsEn,
  ...emergencyEn,
  ...partnerHospitalsEn,
  ...membershipEn,
  ...healthToolsEn,
} as const;

export type TranslationKey = keyof typeof en;
