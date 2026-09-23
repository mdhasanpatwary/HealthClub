export interface OxygenProcedurePriceItem {
  procedureOrServiceNameBn: string;
  procedureOrServiceNameEn: string;
  categoryBn: string;
  regularPriceRangeBn: string;
  memberPriceRangeBn?: string;
  discountPercentageBn?: string;
  durationOrTurnaroundBn: string;
}

export interface OxygenPricingData {
  titleBn: string;
  subtitleBn: string;
  titleEn?: string;
  subtitleEn?: string;
  packages: OxygenProcedurePriceItem[];
}
