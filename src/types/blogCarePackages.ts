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

export interface KidneyPackagePriceItem {
  testOrPackageNameBn: string;
  testOrPackageNameEn: string;
  categoryBn: string;
  regularPriceRangeBn: string;
  memberPriceRangeBn?: string;
  discountPercentageBn?: string;
  turnaroundOrDurationBn: string;
}

export interface PediatricCarePackageItem {
  serviceOrVaccineNameBn: string;
  serviceOrVaccineNameEn: string;
  categoryBn: string;
  regularPriceRangeBn: string;
  memberPriceRangeBn?: string;
  discountPercentageBn?: string;
  ageOrDurationBn: string;
}

export interface SkinCarePackageItem {
  procedureOrTestNameBn: string;
  procedureOrTestNameEn: string;
  categoryBn: string;
  regularPriceRangeBn: string;
  memberPriceRangeBn?: string;
  discountPercentageBn?: string;
  durationOrTurnaroundBn: string;
}

export interface EyeCarePackageItem {
  procedureOrTestNameBn: string;
  procedureOrTestNameEn: string;
  categoryBn: string;
  regularPriceRangeBn: string;
  memberPriceRangeBn?: string;
  discountPercentageBn?: string;
  durationOrTurnaroundBn: string;
}

export interface OrthopedicCarePackageItem {
  procedureOrTestNameBn: string;
  procedureOrTestNameEn: string;
  categoryBn: string;
  regularPriceRangeBn: string;
  memberPriceRangeBn?: string;
  discountPercentageBn?: string;
  durationOrTurnaroundBn: string;
}

export interface EntCarePackageItem {
  procedureOrTestNameBn: string;
  procedureOrTestNameEn: string;
  categoryBn: string;
  regularPriceRangeBn: string;
  memberPriceRangeBn?: string;
  discountPercentageBn?: string;
  durationOrTurnaroundBn: string;
}

export type SurgicalCarePackageItem = EntCarePackageItem;
export type NeurologyCarePackageItem = EntCarePackageItem;
export type DiabetesCarePackageItem = EntCarePackageItem;
export type PsychiatryCarePackageItem = EntCarePackageItem;
export type SadarHospitalCarePackageItem = EntCarePackageItem;
export type DiabeticHospitalPackageItem = EntCarePackageItem;
