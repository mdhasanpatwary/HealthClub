export interface StrokeCardiacProcedurePriceItem {
  procedureOrTestNameBn: string;
  procedureOrTestNameEn: string;
  categoryBn: string;
  regularPriceRangeBn: string;
  memberPriceRangeBn?: string;
  discountPercentageBn?: string;
  durationOrTurnaroundBn: string;
}

export interface StrokeCardiacPricingData {
  titleBn: string;
  subtitleBn: string;
  titleEn?: string;
  subtitleEn?: string;
  packages: StrokeCardiacProcedurePriceItem[];
}
