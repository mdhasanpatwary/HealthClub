export interface BloodDonor {
  id: string;
  name: string;
  bloodGroup: "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-";
  upazila: string;
  phone: string;
  lastDonated: string;
  isAvailable: boolean;
}

export interface AmbulanceService {
  id: string;
  name: string;
  type: "ICU" | "AC" | "Non-AC" | "Freezer";
  location: string;
  phone: string;
  availableHours: string;
}

export interface EmergencyHotline {
  id: string;
  titleBn: string;
  titleEn: string;
  category: "hospital" | "fire" | "police" | "oxygen" | "blood_bank";
  phone: string;
  descriptionBn: string;
  descriptionEn: string;
}

export const UPAZILAS_FENI = [
  { id: "all", nameBn: "সকল উপজেলা", nameEn: "All Upazilas" },
  { id: "feni-sadar", nameBn: "ফেনী সদর", nameEn: "Feni Sadar" },
  { id: "daganbhuiyan", nameBn: "দাগনভূঞা", nameEn: "Daganbhuiyan" },
  { id: "chhagalnaiya", nameBn: "ছাগলনাইয়া", nameEn: "Chhagalnaiya" },
  { id: "parshuram", nameBn: "পরশুরাম", nameEn: "Parshuram" },
  { id: "sonagazi", nameBn: "সোনাগাজী", nameEn: "Sonagazi" },
  { id: "fulgazi", nameBn: "ফুলগাজী", nameEn: "Fulgazi" },
];

export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"] as const;

export const INITIAL_BLOOD_DONORS: BloodDonor[] = [
  {
    id: "donor-1",
    name: "তানভীর আহমেদ",
    bloodGroup: "O+",
    upazila: "feni-sadar",
    phone: "01819001122",
    lastDonated: "৪ মাস আগে",
    isAvailable: true,
  },
  {
    id: "donor-2",
    name: "মোঃ সাজ্জাদ হোসেন",
    bloodGroup: "A+",
    upazila: "feni-sadar",
    phone: "01712334455",
    lastDonated: "৫ মাস আগে",
    isAvailable: true,
  },
  {
    id: "donor-3",
    name: "মাহমুদুল হাসান",
    bloodGroup: "B+",
    upazila: "daganbhuiyan",
    phone: "01822445566",
    lastDonated: "৬ মাস আগে",
    isAvailable: true,
  },
  {
    id: "donor-4",
    name: "রাকিবুল ইসলাম",
    bloodGroup: "AB+",
    upazila: "chhagalnaiya",
    phone: "01833556677",
    lastDonated: "৩ মাস আগে",
    isAvailable: true,
  },
  {
    id: "donor-5",
    name: "কামরুল হাসান",
    bloodGroup: "O-",
    upazila: "feni-sadar",
    phone: "01844667788",
    lastDonated: "৫ মাস আগে",
    isAvailable: true,
  },
  {
    id: "donor-6",
    name: "আরিফুর রহমান",
    bloodGroup: "A-",
    upazila: "parshuram",
    phone: "01755778899",
    lastDonated: "৪ মাস আগে",
    isAvailable: true,
  },
  {
    id: "donor-7",
    name: "ইমরান হোসেন",
    bloodGroup: "B-",
    upazila: "sonagazi",
    phone: "01866889900",
    lastDonated: "৬ মাস আগে",
    isAvailable: true,
  },
  {
    id: "donor-8",
    name: "সাইফুল ইসলাম",
    bloodGroup: "AB-",
    upazila: "fulgazi",
    phone: "01777990011",
    lastDonated: "৭ মাস আগে",
    isAvailable: true,
  },
];

export const INITIAL_AMBULANCES: AmbulanceService[] = [
  {
    id: "amb-1",
    name: "ফেনী সেন্ট্রাল এ্যাম্বুলেন্স সার্ভিস",
    type: "ICU",
    location: "এস এস কে রোড, ফেনী সদর",
    phone: "01811223344",
    availableHours: "২৪/৭ সার্বক্ষণিক",
  },
  {
    id: "amb-2",
    name: "রেড ক্রিসেন্ট এ্যাম্বুলেন্স ফেনী",
    type: "AC",
    location: "ট্রাঙ্ক রোড, ফেনী",
    phone: "01822334455",
    availableHours: "২৪/৭ সার্বক্ষণিক",
  },
  {
    id: "amb-3",
    name: "মহিপাল জরুরি এ্যাম্বুলেন্স সেবা",
    type: "AC",
    location: "মহিপাল প্লাজা, ফেনী",
    phone: "01733445566",
    availableHours: "২৪/৭ সার্বক্ষণিক",
  },
  {
    id: "amb-4",
    name: "দাগনভূঞা উপজেলা এ্যাম্বুলেন্স",
    type: "Non-AC",
    location: "দাগনভূঞা বাজার",
    phone: "01844556677",
    availableHours: "২৪/৭ সার্বক্ষণিক",
  },
  {
    id: "amb-5",
    name: "ফেনী ফ্রিজার ভ্যান ও লাশবাহী গাড়ি",
    type: "Freezer",
    location: "মডেল থানা রোড, ফেনী",
    phone: "01755667788",
    availableHours: "২৪/৭ সার্বক্ষণিক",
  },
];

export const INITIAL_EMERGENCY_HOTLINES: EmergencyHotline[] = [
  {
    id: "hotline-1",
    titleBn: "জাতীয় জরুরি সেবা (পুলিশ, অ্যাম্বুলেন্স, ফায়ার)",
    titleEn: "National Emergency Service (Police, Ambulance, Fire)",
    category: "police",
    phone: "999",
    descriptionBn: "টোল-ফ্রি জরুরি হেল্পলাইন। পুলিশ, ফায়ার সার্ভিস ও সরকারি অ্যাম্বুলেন্সের জন্য।",
    descriptionEn: "Toll-free emergency helpline for police, fire service, and government ambulance.",
  },
  {
    id: "hotline-2",
    titleBn: "স্বাস্থ্য বাতায়ন (সরকারি স্বাস্থ্য পরামর্শ)",
    titleEn: "Shastho Batayon (Government Health Helpline)",
    category: "hospital",
    phone: "16263",
    descriptionBn: "২৪ ঘণ্টা অভিজ্ঞ চিকিৎসকের বিনামূল্যে স্বাস্থ্য পরামর্শ ও হাসপাতাল তথ্য।",
    descriptionEn: "24/7 free medical consultation from licensed doctors and hospital information.",
  },
  {
    id: "hotline-3",
    titleBn: "ফেনী ২৫০ শয্যা জেনারেল হাসপাতাল",
    titleEn: "Feni 250-Bed General Hospital Emergency",
    category: "hospital",
    phone: "0331-74011",
    descriptionBn: "জরুরি বিভাগ ও সার্বক্ষণিক সরকারি ইনডোর/আউটডোর সেবা।",
    descriptionEn: "Emergency department and round-the-clock medical attention.",
  },
  {
    id: "hotline-4",
    titleBn: "ফেনী ফায়ার সার্ভিস ও সিভিল ডিফেন্স",
    titleEn: "Feni Fire Service & Civil Defence",
    category: "fire",
    phone: "01730-336644",
    descriptionBn: "জরুরি উদ্ধার অভিযান ও আগুন নির্বাপণ কন্ট্রোল রুম।",
    descriptionEn: "Emergency rescue operations and fire safety dispatch control room.",
  },
  {
    id: "hotline-5",
    titleBn: "ফেনী জরুরি অক্সিজেন সিলিন্ডার সেবা",
    titleEn: "Feni 24/7 Emergency Oxygen Supply",
    category: "oxygen",
    phone: "01815-998877",
    descriptionBn: "হোম ডেলিভারি সহ জরুরি মেডিকেল অক্সিজেন সিলিন্ডার সাপোর্ট।",
    descriptionEn: "Emergency medical oxygen cylinder support with fast home delivery.",
  },
  {
    id: "hotline-6",
    titleBn: "রেড ক্রিসেন্ট রক্ত কেন্দ্র (ফেনী ইউনিট)",
    titleEn: "Red Crescent Blood Center (Feni Unit)",
    category: "blood_bank",
    phone: "01819-887766",
    descriptionBn: "নিরাপদ রক্ত সংগ্রহ, স্ক্রিনিং ও জরুরি রক্তের প্রয়োজনে যোগাযোগ।",
    descriptionEn: "Safe blood collection, testing screening, and emergency blood group supplies.",
  },
];
