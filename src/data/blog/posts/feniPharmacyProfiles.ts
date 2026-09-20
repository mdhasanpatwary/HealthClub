import { PharmacyReviewItem, PharmacyComparisonItem } from "@/types/pharmacyBlog";
import { FENI_PHARMACY_PROFILES_PART1 } from "./feniPharmacyProfilesPart1";
import { FENI_PHARMACY_PROFILES_PART2 } from "./feniPharmacyProfilesPart2";

export const FENI_PHARMACY_PROFILES: PharmacyReviewItem[] = [
  ...FENI_PHARMACY_PROFILES_PART1,
  ...FENI_PHARMACY_PROFILES_PART2,
];

export const FENI_PHARMACY_COMPARISON_TABLE: PharmacyComparisonItem[] = FENI_PHARMACY_PROFILES.map((p) => ({
  rank: p.rank,
  nameBn: p.nameBn,
  nameEn: p.nameEn,
  hubBn: p.hubBn,
  is24x7: p.is24x7 ? true : p.nightServiceTypeBn,
  homeDelivery: p.homeDelivery,
  coldChainInsulin: p.coldChainStorage,
  prescriptionVerification: p.prescriptionVerification,
  discountBn: "১০-৩০% মেম্বার ছাড়",
  discountEn: "10-30% Member Discount",
  locationBn: p.addressBn,
  locationEn: p.addressEn,
  partnerStatus: p.partnerStatus,
}));
