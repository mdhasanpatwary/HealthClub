
export interface UpazilaHealthcareReviewItem {
  rank: number;
  nameBn: string;
  nameEn: string;
  upazilaBn: "দাগনভূঞা" | "ছাগলনাইয়া" | "সোনাগাজী" | "পরশুরাম" | "ফুলগাজী";
  upazilaEn: "Daganbhuiyan" | "Chhagalnaiya" | "Sonagazi" | "Parshuram" | "Fulgazi";
  typeBn: string;
  typeEn: string;
  addressBn: string;
  addressEn: string;
  phone: string;
  emergencyPhone?: string;
  descriptionBn: string;
  descriptionEn?: string;
  keyFeaturesBn: string[];
  keyFeaturesEn?: string[];
  specialtiesBn: string[];
  specialtiesEn?: string[];
  bedCountBn?: string;
  bedCountEn?: string;
  icuAvailable: boolean;
  emergency24x7: boolean;
  distanceToSadarBn: string;
  travelTimeToSadarBn: string;
  partnerStatus: boolean;
  partnerDiscountBn?: string;
  partnerProfileSlug?: string;
  imageUrl?: string;
  mapQuery?: string;
}

export interface UpazilaComparisonItem {
  rank: number;
  nameBn: string;
  nameEn: string;
  upazilaBn: string;
  upazilaEn?: string;
  typeBn: string;
  typeEn?: string;
  bedCountBn: string;
  bedCountEn?: string;
  icu: string;
  icuEn?: string;
  emergency: string;
  emergencyEn?: string;
  discountBn: string;
  discountEn?: string;
  locationBn: string;
  locationEn?: string;
  distanceToSadarBn: string;
  partnerStatus?: boolean;
}

export interface UpazilaCarePackageItem {
  id?: string;
  procedureOrTestNameBn: string;
  procedureOrTestNameEn: string;
  categoryBn: string;
  regularPriceRangeBn: string;
  memberPriceRangeBn?: string;
  discountPercentageBn?: string;
  durationOrTurnaroundBn: string;
}
