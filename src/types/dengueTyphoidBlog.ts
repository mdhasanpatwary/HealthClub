export interface DengueTyphoidProcedurePriceItem {
  procedureOrServiceNameBn: string;
  procedureOrServiceNameEn: string;
  categoryBn: string;
  regularPriceRangeBn: string;
  memberPriceRangeBn?: string;
  discountPercentageBn?: string;
  durationOrTurnaroundBn: string;
}

export interface DengueTyphoidPricingData {
  titleBn: string;
  subtitleBn: string;
  titleEn?: string;
  subtitleEn?: string;
  packages: DengueTyphoidProcedurePriceItem[];
}
