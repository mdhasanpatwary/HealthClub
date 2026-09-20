import { EntCarePackageItem } from "./blog";

export interface BloodBankReviewItem {
  rank: number;
  nameBn: string;
  nameEn: string;
  typeBn: string;
  typeEn: string;
  hubBn: string;
  hubEn: string;
  addressBn: string;
  addressEn: string;
  phone: string;
  hotline?: string;
  emergencyContact?: string;
  descriptionBn: string;
  descriptionEn?: string;
  keyFeaturesBn: string[];
  keyFeaturesEn?: string[];
  servicesOfferedBn: string[];
  servicesOfferedEn?: string[];
  openHoursBn: string;
  openHoursEn?: string;
  is24x7: boolean;
  bloodTestingFacility: boolean;
  voluntaryDonorsNetwork: boolean;
  rareGroupSupport: boolean;
  bloodBagCollection: boolean;
  partnerStatus: boolean;
  partnerDiscountBn?: string;
  partnerDiscountEn?: string;
  partnerProfileSlug?: string;
  imageUrl?: string;
  mapQuery?: string;
}

export interface BloodBankComparisonItem {
  rank: number;
  nameBn: string;
  nameEn: string;
  hubBn: string;
  is24x7: boolean | string;
  testingScreening: boolean | string;
  voluntaryNetwork: boolean | string;
  rareNegativeDesk: boolean | string;
  serviceFeeBn?: string;
  serviceFeeEn?: string;
  discountBn: string;
  discountEn?: string;
  locationBn: string;
  locationEn?: string;
  partnerStatus?: boolean;
}

export type BloodCarePackageItem = EntCarePackageItem;
