import { BloodBankReviewItem, BloodBankComparisonItem } from "@/types/bloodBankBlog";
import { FENI_BLOOD_BANK_PROFILES_PART1 } from "./feniBloodBankProfilesPart1";
import { FENI_BLOOD_BANK_PROFILES_PART2 } from "./feniBloodBankProfilesPart2";

export const FENI_BLOOD_BANK_PROFILES: BloodBankReviewItem[] = [
  ...FENI_BLOOD_BANK_PROFILES_PART1,
  ...FENI_BLOOD_BANK_PROFILES_PART2,
];

export const FENI_BLOOD_BANK_COMPARISON_TABLE: BloodBankComparisonItem[] = FENI_BLOOD_BANK_PROFILES.map((b) => ({
  rank: b.rank,
  nameBn: b.nameBn,
  nameEn: b.nameEn,
  hubBn: b.hubBn,
  is24x7: b.is24x7,
  testingScreening: b.bloodTestingFacility,
  voluntaryNetwork: b.voluntaryDonorsNetwork,
  rareNegativeDesk: b.rareGroupSupport,
  serviceFeeBn: b.partnerDiscountBn || "১০০% সম্পূর্ণ বিনামূল্যে",
  serviceFeeEn: b.partnerDiscountEn || "100% Free Volunteer Service",
  discountBn: b.partnerDiscountBn || "১০০% সম্পূর্ণ বিনামূল্যে",
  discountEn: b.partnerDiscountEn || "100% Free Volunteer Service",
  locationBn: b.addressBn,
  locationEn: b.addressEn,
  partnerStatus: false,
}));
