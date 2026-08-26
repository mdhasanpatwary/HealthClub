import { commonBn } from "./common";
import { landingBn } from "./landing";
import { authBn } from "./auth";
import { adminBn } from "./admin";
import { dashboardBn } from "./dashboard";
import { partnerBn } from "./partner";
import { consultantsBn } from "./consultants";
import { emergencyBn } from "./emergency";
import { partnerHospitalsBn } from "./partnerHospitals";
import { membershipBn } from "./membership";
import { healthToolsBn } from "./healthTools";

export {
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
};

export const bn = {
  ...commonBn,
  ...landingBn,
  ...authBn,
  ...adminBn,
  ...dashboardBn,
  ...partnerBn,
  ...consultantsBn,
  ...emergencyBn,
  ...partnerHospitalsBn,
  ...membershipBn,
  ...healthToolsBn,
} as const;
