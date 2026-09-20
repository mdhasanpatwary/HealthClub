import { AmbulanceReviewItem, AmbulanceComparisonItem } from "@/types/ambulanceBlog";
import { FENI_AMBULANCE_PROFILES_PART1 } from "./feniAmbulanceProfilesPart1";
import { FENI_AMBULANCE_PROFILES_PART2 } from "./feniAmbulanceProfilesPart2";

export const FENI_AMBULANCE_PROFILES: AmbulanceReviewItem[] = [
  ...FENI_AMBULANCE_PROFILES_PART1,
  ...FENI_AMBULANCE_PROFILES_PART2,
];

export const FENI_AMBULANCE_COMPARISON_TABLE: AmbulanceComparisonItem[] = FENI_AMBULANCE_PROFILES.map((amb) => ({
  rank: amb.rank,
  nameBn: amb.nameBn,
  nameEn: amb.nameEn,
  hubBn: amb.hubBn,
  is24x7: amb.is24x7,
  icuVentilator: amb.hasIcu,
  oxygenSupply: amb.hasOxygen,
  dhakaCtgTransfer: amb.interDistrictCoverage,
  freezingVan: amb.freezingAmbulance,
  fareRangeBn: "রুট ও গাড়ির ধরন অনুযায়ী নির্ধারিত",
  fareRangeEn: "Varies by route & vehicle class",
  discountBn: amb.partnerDiscountBn || "পাবলিক ডিরেক্টরি (সরাসরি ড্রাইভার বুকিং)",
  discountEn: amb.partnerDiscountEn || "Public Directory (Direct Driver Booking)",
  locationBn: amb.addressBn,
  locationEn: amb.addressEn,
  partnerStatus: amb.partnerStatus,
}));
