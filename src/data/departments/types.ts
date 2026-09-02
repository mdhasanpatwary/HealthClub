export interface DepartmentSeoConfig {
  id: string;
  slug: string;
  nameBn: string;
  nameEn: string;
  metaTitleBn: string;
  metaTitleEn: string;
  metaDescriptionBn: string;
  metaDescriptionEn: string;
  keywords: string[];
  heroBadgeBn: string;
  heroBadgeEn: string;
  heroHeadlineBn: string;
  heroHeadlineEn: string;
  introDescriptionBn: string;
  introDescriptionEn: string;
  clinicalScopeBn: string[];
  clinicalScopeEn: string[];
  medicalSpecialtySchema: string;
  faqs: {
    qBn: string;
    aBn: string;
    qEn: string;
    aEn: string;
  }[];
}
