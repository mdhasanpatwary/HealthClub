export interface CriticalCarePackagePriceItem {
  serviceOrBedNameBn: string;
  serviceOrBedNameEn: string;
  categoryBn: string;
  regularPriceRangeBn: string;
  memberPriceRangeBn?: string;
  discountPercentageBn?: string;
  stayOrDurationBn: string;
}

export interface CriticalCarePricingData {
  titleBn: string;
  subtitleBn: string;
  titleEn?: string;
  subtitleEn?: string;
  packages: CriticalCarePackagePriceItem[];
}
