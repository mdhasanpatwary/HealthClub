import { EntCarePackageItem } from "./blog";

export interface PharmacyReviewItem {
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
  descriptionBn: string;
  descriptionEn?: string;
  keyFeaturesBn: string[];
  keyFeaturesEn?: string[];
  serviceHighlightsBn: string[];
  serviceHighlightsEn?: string[];
  deliveryAreasBn: string[];
  deliveryAreasEn?: string[];
  openHoursBn: string;
  openHoursEn?: string;
  is24x7: boolean;
  nightServiceTypeBn: string;
  nightServiceTypeEn: string;
  coldChainStorage: boolean;
  homeDelivery: boolean;
  prescriptionVerification: boolean;
  partnerStatus: boolean;
  partnerDiscountBn?: string;
  partnerDiscountEn?: string;
  partnerProfileSlug?: string;
  imageUrl?: string;
  mapQuery?: string;
}

export interface PharmacyComparisonItem {
  rank: number;
  nameBn: string;
  nameEn: string;
  hubBn: string;
  is24x7: boolean | string;
  homeDelivery: boolean | string;
  coldChainInsulin: boolean | string;
  prescriptionVerification: boolean | string;
  discountBn: string;
  discountEn?: string;
  locationBn: string;
  locationEn?: string;
  partnerStatus?: boolean;
}

export type PharmacyPackagePriceItem = EntCarePackageItem;
