import { EntCarePackageItem } from "./blog";

export interface AmbulanceReviewItem {
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
  fleetDetailsBn: string[];
  fleetDetailsEn?: string[];
  servicesOfferedBn: string[];
  servicesOfferedEn?: string[];
  openHoursBn: string;
  openHoursEn?: string;
  is24x7: boolean;
  hasIcu: boolean;
  hasOxygen: boolean;
  interDistrictCoverage: boolean;
  freezingAmbulance: boolean;
  partnerStatus: boolean;
  partnerDiscountBn?: string;
  partnerDiscountEn?: string;
  partnerProfileSlug?: string;
  imageUrl?: string;
  mapQuery?: string;
}

export interface AmbulanceComparisonItem {
  rank: number;
  nameBn: string;
  nameEn: string;
  hubBn: string;
  is24x7: boolean | string;
  icuVentilator: boolean | string;
  oxygenSupply: boolean | string;
  dhakaCtgTransfer: boolean | string;
  freezingVan: boolean | string;
  fareRangeBn?: string;
  fareRangeEn?: string;
  discountBn: string;
  discountEn?: string;
  locationBn: string;
  locationEn?: string;
  partnerStatus?: boolean;
}

export type AmbulanceCarePackageItem = EntCarePackageItem;
export type AmbulancePackagePriceItem = EntCarePackageItem;
