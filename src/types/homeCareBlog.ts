export interface HomeCareProcedurePriceItem {
  procedureOrServiceNameBn: string;
  procedureOrServiceNameEn: string;
  categoryBn: string;
  regularPriceRangeBn: string;
  memberPriceRangeBn?: string;
  discountPercentageBn?: string;
  durationOrTurnaroundBn: string;
}

export interface HomeCarePricingData {
  titleBn: string;
  subtitleBn: string;
  titleEn?: string;
  subtitleEn?: string;
  packages: HomeCareProcedurePriceItem[];
}
