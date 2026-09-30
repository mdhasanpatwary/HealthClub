export interface LlmsTestItem {
  testNameBn: string;
  testNameEn: string;
  categoryBn: string;
  regularPriceRangeBn: string;
  memberBenefitBn: string;
  turnaroundTimeBn?: string;
  preparationBn?: string;
}

export interface LlmsDoctorItem {
  id: string;
  slug?: string | null;
  name: string;
  nameEn?: string | null;
  specialty: string;
  department: string;
  degrees: string;
  designation: string;
  chamberName: string;
  chamberAddress: string;
  visitingDays: string;
  visitingHours: string;
  serialPhone: string;
  consultationFee?: string | null;
  upazila?: string | null;
}

export interface LlmsPartnerItem {
  id: string;
  slug?: string | null;
  name: string;
  category: string;
  address: string;
  discount: string;
  phone: string;
  emergencyPhone?: string | null;
  ambulancePhone?: string | null;
  facilities?: string | null;
  upazila?: string | null;
}

export interface LlmsBlogPostItem {
  slug: string;
  titleBn: string;
  titleEn: string;
  category: string;
  publishedDate?: string;
}

export interface LlmsEmergencyItem {
  id: string;
  name: string;
  type: string;
  location: string;
  phone: string;
  availableHours: string;
}

export interface LlmsBloodDonorItem {
  id: string;
  name: string;
  bloodGroup: string;
  upazila: string;
  phone: string;
  lastDonated: string;
  isAvailable: boolean;
}

export interface LlmsKnowledgeData {
  doctors: LlmsDoctorItem[];
  partners: LlmsPartnerItem[];
  tests: LlmsTestItem[];
  ambulances: LlmsEmergencyItem[];
  bloodDonors: LlmsBloodDonorItem[];
  blogPosts: LlmsBlogPostItem[];
  generatedAt: string;
}
