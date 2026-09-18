export interface BlogCategory {
  id: string;
  nameBn: string;
  nameEn: string;
  descriptionBn?: string;
  descriptionEn?: string;
}

export interface BlogAuthor {
  nameBn: string;
  nameEn: string;
  roleBn: string;
  roleEn: string;
  avatarUrl?: string;
}

export interface HospitalReviewItem {
  rank: number;
  nameBn: string;
  nameEn: string;
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
  partnerStatus: boolean;
  partnerDiscountBn?: string;
  partnerProfileSlug?: string;
  imageUrl?: string;
  mapQuery?: string;
}

export interface HospitalComparisonItem {
  rank: number;
  nameBn: string;
  nameEn: string;
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
  partnerStatus?: boolean;
}

export interface DoctorSpecialistItem {
  id: string;
  nameBn: string;
  nameEn: string;
  specialtyBn: string;
  specialtyEn: string;
  department: string;
  degreesBn: string;
  designationBn: string;
  chamberNameBn: string;
  chamberAddressBn: string;
  visitingDaysBn: string;
  visitingHoursBn: string;
  serialPhone: string;
  consultationFeeBn: string;
  consultantProfileUrl?: string;
  featuredBadgeBn?: string;
  partnerStatus?: boolean;
  rank?: number;
}

export interface DoctorSpecialtyGroup {
  department: string;
  departmentNameBn: string;
  departmentNameEn: string;
  iconName?: string;
  descriptionBn: string;
  descriptionEn?: string;
  doctors: DoctorSpecialistItem[];
}

export interface DoctorChamberHub {
  areaNameBn: string;
  areaNameEn: string;
  descriptionBn: string;
  descriptionEn?: string;
  popularHospitalsChambersBn: string[];
  popularHospitalsChambersEn?: string[];
  tipsBn: string;
  tipsEn?: string;
}

export interface BlogFAQItem {
  questionBn: string;
  questionEn: string;
  answerBn: string;
  answerEn: string;
}

export interface DiagnosticCenterReviewItem {
  rank: number;
  nameBn: string;
  nameEn: string;
  typeBn: string;
  typeEn: string;
  addressBn: string;
  addressEn: string;
  phone: string;
  hotline?: string;
  descriptionBn: string;
  descriptionEn?: string;
  keyFeaturesBn: string[];
  keyFeaturesEn?: string[];
  equipmentHighlightsBn: string[];
  equipmentHighlightsEn?: string[];
  testCategoriesBn: string[];
  testCategoriesEn?: string[];
  reportTimingBn?: string;
  reportTimingEn?: string;
  homeSampleCollection: boolean;
  onlineReport: boolean;
  partnerStatus: boolean;
  partnerDiscountBn?: string;
  partnerDiscountEn?: string;
  partnerProfileSlug?: string;
  imageUrl?: string;
  mapQuery?: string;
}

export interface DiagnosticComparisonItem {
  rank: number;
  nameBn: string;
  nameEn: string;
  mriAvailable: boolean | string;
  ctScanAvailable: boolean | string;
  ultrasound4D: boolean | string;
  digitalXray: boolean | string;
  automatedLab: boolean | string;
  discountBn: string;
  discountEn?: string;
  locationBn: string;
  locationEn?: string;
  partnerStatus?: boolean;
}

export interface DiagnosticTestPriceItem {
  testNameBn: string;
  testNameEn: string;
  categoryBn: string;
  regularPriceRangeBn: string;
  memberPriceRangeBn: string;
  discountPercentageBn: string;
  turnaroundTimeBn: string;
}

export interface DentalClinicReviewItem {
  rank: number;
  nameBn: string;
  nameEn: string;
  doctorInChargeBn: string;
  doctorInChargeEn: string;
  degreesBn: string;
  degreesEn: string;
  specialtiesBn: string[];
  addressBn: string;
  addressEn: string;
  phone: string;
  visitingHoursBn: string;
  visitingHoursEn?: string;
  descriptionBn: string;
  descriptionEn?: string;
  keyFeaturesBn: string[];
  equipmentHighlightsBn: string[];
  proceduresBn: string[];
  sterilizationStandardBn?: string;
  partnerStatus: boolean;
  partnerDiscountBn?: string;
  partnerProfileSlug?: string;
  imageUrl?: string;
  mapQuery?: string;
}

export interface DentalComparisonItem {
  rank: number;
  nameBn: string;
  nameEn: string;
  leadDentistBn: string;
  leadDentistEn?: string;
  degreesBn: string;
  degreesEn?: string;
  digitalRvg: boolean | string;
  laserImplants: boolean | string;
  bracesOrthodontics: boolean | string;
  discountBn: string;
  discountEn?: string;
  locationBn: string;
  locationEn?: string;
  partnerStatus?: boolean;
}

export interface DentalProcedurePriceItem {
  procedureNameBn: string;
  procedureNameEn: string;
  categoryBn: string;
  regularPriceRangeBn: string;
  memberPriceRangeBn?: string;
  discountPercentageBn: string;
  durationBn: string;
}

export interface PhysiotherapyCenterReviewItem {
  rank: number;
  nameBn: string;
  nameEn: string;
  doctorInChargeBn: string;
  doctorInChargeEn: string;
  degreesBn: string;
  degreesEn: string;
  specialtiesBn: string[];
  addressBn: string;
  addressEn: string;
  phone: string;
  visitingHoursBn: string;
  visitingHoursEn?: string;
  homeServiceAvailable: boolean;
  descriptionBn: string;
  descriptionEn?: string;
  keyFeaturesBn: string[];
  keyFeaturesEn?: string[];
  equipmentHighlightsBn: string[];
  equipmentHighlightsEn?: string[];
  conditionsTreatedBn: string[];
  conditionsTreatedEn?: string[];
  partnerStatus: boolean;
  partnerDiscountBn?: string;
  partnerDiscountEn?: string;
  partnerProfileSlug?: string;
  imageUrl?: string;
  mapQuery?: string;
}

export interface PhysiotherapyComparisonItem {
  rank: number;
  nameBn: string;
  nameEn: string;
  leadTherapistBn: string;
  leadTherapistEn?: string;
  degreesBn: string;
  degreesEn?: string;
  tractionSwd: boolean | string;
  strokeRehab: boolean | string;
  homeService: boolean | string;
  discountBn: string;
  discountEn?: string;
  locationBn: string;
  locationEn?: string;
  partnerStatus?: boolean;
}

export interface PhysiotherapyTreatmentPriceItem {
  treatmentNameBn: string;
  treatmentNameEn: string;
  categoryBn: string;
  regularPriceRangeBn: string;
  memberPriceRangeBn?: string;
  discountPercentageBn?: string;
  durationBn: string;
}

export interface MaternityCarePackageItem {
  packageNameBn: string;
  packageNameEn: string;
  categoryBn: string;
  regularPriceRangeBn: string;
  memberPriceRangeBn?: string;
  discountPercentageBn?: string;
  stayOrDurationBn: string;
}

export interface CardiacPackagePriceItem {
  testOrPackageNameBn: string;
  testOrPackageNameEn: string;
  categoryBn: string;
  regularPriceRangeBn: string;
  memberPriceRangeBn?: string;
  discountPercentageBn?: string;
  reportTimeBn: string;
}

export interface BlogPost {
  slug: string;
  titleBn: string;
  titleEn: string;
  excerptBn: string;
  excerptEn: string;
  category: string;
  categoryNameBn: string;
  categoryNameEn: string;
  publishedDate: string;
  modifiedDate: string;
  readTimeBn: string;
  readTimeEn: string;
  author: BlogAuthor;
  coverImage: string;
  coverImageAlt: string;
  tags: string[];
  metaKeywords: string[];
  keyHighlightsBn?: string[];
  keyHighlightsEn?: string[];
  introParagraphsBn: string[];
  introParagraphsEn?: string[];
  hospitals?: HospitalReviewItem[];
  comparisonTable?: HospitalComparisonItem[];
  doctorGroups?: DoctorSpecialtyGroup[];
  chamberHubsBn?: DoctorChamberHub[];
  diagnosticCenters?: DiagnosticCenterReviewItem[];
  diagnosticComparisonTable?: DiagnosticComparisonItem[];
  diagnosticTestPricingBn?: {
    titleBn: string;
    subtitleBn: string;
    tests: DiagnosticTestPriceItem[];
  };
  dentalClinics?: DentalClinicReviewItem[];
  dentalComparisonTable?: DentalComparisonItem[];
  dentalProcedurePricingBn?: {
    titleBn: string;
    subtitleBn: string;
    procedures: DentalProcedurePriceItem[];
  };
  physiotherapyCenters?: PhysiotherapyCenterReviewItem[];
  physiotherapyComparisonTable?: PhysiotherapyComparisonItem[];
  physiotherapyTreatmentPricingBn?: {
    titleBn: string;
    subtitleBn: string;
    treatments: PhysiotherapyTreatmentPriceItem[];
  };
  maternityCarePricingBn?: {
    titleBn: string;
    subtitleBn: string;
    packages: MaternityCarePackageItem[];
  };
  cardiacCarePricingBn?: {
    titleBn: string;
    subtitleBn: string;
    packages: CardiacPackagePriceItem[];
  };
  bookingGuideBn?: {
    titleBn: string;
    stepsBn: { step: string; title: string; desc: string }[];
  };
  bookingGuideEn?: {
    titleEn: string;
    stepsEn: { step: string; title: string; desc: string }[];
  };
  selectionGuideBn?: {
    titleBn: string;
    pointsBn: { title: string; desc: string }[];
  };
  selectionGuideEn?: {
    titleEn: string;
    pointsEn: { title: string; desc: string }[];
  };
  emergencyDirectoryBn?: {
    titleBn: string;
    services: { name: string; phone: string; note: string }[];
  };
  emergencyDirectoryEn?: {
    titleEn: string;
    services: { name: string; phone: string; note: string }[];
  };
  faqs: BlogFAQItem[];
  relatedSlugs?: string[];
}


