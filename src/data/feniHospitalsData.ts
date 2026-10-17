import { Doctor } from "@/services/db";

export interface FeniHospitalDirectoryItem {
  id: string;
  nameBn: string;
  nameEn: string;
  shortNameBn: string;
  categoryBn: string;
  addressBn: string;
  searchAliases: string[];
  partnerSlug?: string;
  isPartner: boolean;
  memberDiscountBn?: string;
  featured?: boolean;
}

/**
 * Verified Contracted Partner Facilities & Major Hospital/Clinic Doctor Rosters in Feni Sadar.
 * Follows strict geographic rules: All facilities are strictly located in Feni Sadar.
 * Only verified contracted partners carry isPartner: true with standard 10-30% discount benefits.
 */
export const FENI_HOSPITALS_DIRECTORY: FeniHospitalDirectoryItem[] = [
  // --- VERIFIED CONTRACTED PARTNER FACILITIES IN FENI SADAR ---
  {
    id: "life-care",
    nameBn: "লাইফ কেয়ার ডায়াগনস্টিক সেন্টার",
    nameEn: "Life Care Diagnostic Center Feni",
    shortNameBn: "লাইফ কেয়ার",
    categoryBn: "ডায়াগনস্টিক ও কনসালটেশন",
    addressBn: "কেন্দ্রীয় বোরো জামে মসজিদের পূর্ব পাশে, ট্রাঙ্ক রোড, ফেনী সদর",
    searchAliases: ["লাইফ কেয়ার", "লাইফ কেয়ার", "life care", "lifecare"],
    partnerSlug: "life-care-diagnostic-center",
    isPartner: true,
    memberDiscountBn: "১০-৩০% মেম্বার ছাড়",
    featured: true,
  },
  {
    id: "feni-care",
    nameBn: "ফেনী কেয়ার হসপিটাল",
    nameEn: "Feni Care Hospital",
    shortNameBn: "ফেনী কেয়ার",
    categoryBn: "স্পেশালাইজড হাসপাতাল",
    addressBn: "এস.এস.কে রোড, স্টার লাইন টার্মিনালের সামনে, ফেনী সদর",
    searchAliases: ["ফেনী কেয়ার", "ফেনী কেয়ার", "feni care", "fenicare"],
    partnerSlug: "feni-care-hospital",
    isPartner: true,
    memberDiscountBn: "১০-৩০% মেম্বার ছাড়",
    featured: true,
  },
  {
    id: "feni-max",
    nameBn: "ফেনি ম্যাক্স ডায়াগনস্টিক সেন্টার",
    nameEn: "Feni Max Diagnostic Centre",
    shortNameBn: "ফেনী ম্যাক্স",
    categoryBn: "ডায়াগনস্টিক ও কনসালটেশন",
    addressBn: "জাহিরিয়া টাওয়ার, বড় মসজিদের পাশে, ট্রাঙ্ক রোড, ফেনী সদর",
    searchAliases: ["ফেনি ম্যাক্স", "ফেনী ম্যাক্স", "feni max", "fenimax"],
    partnerSlug: "feni-max-diagnostic-centre",
    isPartner: true,
    memberDiscountBn: "১০-৩০% মেম্বার ছাড়",
    featured: true,
  },
  {
    id: "al-aqsa",
    nameBn: "আল-আকসা হাসপাতাল লিঃ ফেনী",
    nameEn: "Al-Aqsa Hospital Feni",
    shortNameBn: "আল-আকসা",
    categoryBn: "স্পেশালাইজড হাসপাতাল",
    addressBn: "খাজুরিয়া কোট বিল্ডিং, ট্রাংক রোড, ফেনী সদর",
    searchAliases: ["আল-আকসা", "আল আকসা", "al aqsa", "al-aqsa"],
    partnerSlug: "al-aqsa-hospital-feni",
    isPartner: true,
    memberDiscountBn: "১০-২৫% মেম্বার ছাড়",
    featured: true,
  },
  {
    id: "niramoy",
    nameBn: "নিরাময় ডায়াগনস্টিক এন্ড কনসালটেশন সেন্টার",
    nameEn: "Niramoy Diagnostic and Consultation Center",
    shortNameBn: "নিরাময়",
    categoryBn: "ডায়াগনস্টিক ও কনসালটেশন",
    addressBn: "জুহানা শপিং সেন্টার, খেজুর চত্বর, ট্রাংক রোড, ফেনী সদর",
    searchAliases: ["নিরাময়", "নিরাময়", "niramoy", "niramay"],
    partnerSlug: "niramoy-diagnostic-consultation-center",
    isPartner: true,
    memberDiscountBn: "১০-৩০% মেম্বার ছাড়",
    featured: true,
  },
  {
    id: "pacific-health",
    nameBn: "প্যাসিফিক হেলথ কেয়ার সেন্টার",
    nameEn: "Pacific Health Care Centre Feni",
    shortNameBn: "প্যাসিফিক হেলথ",
    categoryBn: "ডায়াগনস্টিক ও কনসালটেশন",
    addressBn: "শহীদ শহীদুল্লাহ কায়সার সড়ক, জিরো পয়েন্ট, ফেনী সদর",
    searchAliases: ["প্যাসিফিক", "প্যাসিপিক", "pacific"],
    partnerSlug: "pacific-health-care-centre",
    isPartner: true,
    memberDiscountBn: "১০-৩০% মেম্বার ছাড়",
    featured: true,
  },
  {
    id: "imperial-neurocare",
    nameBn: "ইম্পেরিয়াল নিউরোকেয়ার অ্যান্ড ডায়াগনস্টিক সেন্টার",
    nameEn: "Imperial Neurocare and Diagnostic Center Feni",
    shortNameBn: "ইম্পেরিয়াল",
    categoryBn: "ডায়াগনস্টিক ও নিউরোকেয়ার",
    addressBn: "কেন্দ্রীয় বোরো জামে মসজিদ মার্কেট ২য় তলা, ট্রাঙ্ক রোড, ফেনী সদর",
    searchAliases: ["ইম্পেরিয়াল", "ইম্পেরিয়াল নিউরোকেয়ার", "imperial neurocare", "imperial"],
    partnerSlug: "imperial-neurocare-diagnostic-center",
    isPartner: true,
    memberDiscountBn: "১০-৩০% মেম্বার ছাড়",
    featured: true,
  },
  {
    id: "mazumder-dental",
    nameBn: "মজুমদার ডেন্টাল ক্লিনিক",
    nameEn: "Mazumder Dental Clinic Feni",
    shortNameBn: "মজুমদার ডেন্টাল",
    categoryBn: "ডেন্টাল সার্জারি ও ক্লিনিক",
    addressBn: "জিরো পয়েন্ট, ট্রাঙ্ক রোড, ফেনী সদর",
    searchAliases: ["মজুমদার ডেন্টাল", "mojumdar dental", "mazumder"],
    partnerSlug: "mazumder-dental-clinic",
    isPartner: true,
    memberDiscountBn: "১০-৩০% মেম্বার ছাড়",
  },
  {
    id: "islamia-physio",
    nameBn: "ইসলামিয়া ফিজিওথেরাপি এন্ড রিহ্যাবিলিটেশন সেন্টার",
    nameEn: "Islamia Physiotherapy Rehabilitation Center",
    shortNameBn: "ইসলামিয়া ফিজিও",
    categoryBn: "ফিজিওথেরাপি ও রিহ্যাব",
    addressBn: "আল কেমী হাসপাতালের দক্ষিণ পার্শ্বে, এস.এস.কে রোড, ফেনী সদর",
    searchAliases: ["ইসলামিয়া ফিজিওথেরাপি", "islamia physio", "islamia"],
    partnerSlug: "islamia-physiotherapy-and-rehabilitation-center",
    isPartner: true,
    memberDiscountBn: "১০-৩০% মেম্বার ছাড়",
  },

  // --- POPULAR HOSPITAL & CLINIC DOCTOR ROSTERS IN FENI SADAR ---
  {
    id: "united-medical",
    nameBn: "ইউনাইটেড মেডিকেল সেন্টার",
    nameEn: "Feni United Medical Center",
    shortNameBn: "ইউনাইটেড মেডিকেল",
    categoryBn: "মেডিকেল সেন্টার ও কনসালটেশন",
    addressBn: "এস.এস.কে রোড, ফেনী সদর",
    searchAliases: ["ইউনাইটেড", "united", "feni united"],
    isPartner: false,
    featured: true,
  },
  {
    id: "concept-plus",
    nameBn: "কনসেপ্ট প্লাস ডায়াগনস্টিক সেন্টার",
    nameEn: "Concept Plus Diagnostic & Consultation Feni",
    shortNameBn: "কনসেপ্ট প্লাস",
    categoryBn: "ডায়াগনস্টিক ও হাসপাতাল",
    addressBn: "এস.এস.কে রোড, ফেনী সদর",
    searchAliases: ["কনসেপ্ট", "concept", "concept plus"],
    isPartner: false,
    featured: true,
  },
  {
    id: "feni-clinic",
    nameBn: "ফেনী ক্লিনিক",
    nameEn: "Feni Clinic Doctors Roster",
    shortNameBn: "ফেনী ক্লিনিক",
    categoryBn: "ক্লিনিক ও কনসালটেশন",
    addressBn: "এস.এস.কে রোড, ফেনী সদর",
    searchAliases: ["ফেনী ক্লিনিক", "feni clinic"],
    isPartner: false,
    featured: true,
  },
  {
    id: "feni-medical-center",
    nameBn: "ফেনী মেডিকেল সেন্টার",
    nameEn: "Feni Medical Center",
    shortNameBn: "ফেনী মেডিকেল",
    categoryBn: "মেডিকেল সেন্টার ও কনসালটেশন",
    addressBn: "জহিরিয়া মসজিদের পশ্চিম পাশে, এস.এস.কে রোড, ফেনী সদর",
    searchAliases: ["ফেনী মেডিকেল", "feni medical center", "feni medical"],
    isPartner: false,
    featured: true,
  },
  {
    id: "medicare",
    nameBn: "মেডিকেয়ার ডায়াগনস্টিক সেন্টার",
    nameEn: "Medicare Diagnostic Center Feni",
    shortNameBn: "মেডিকেয়ার",
    categoryBn: "ডায়াগনস্টিক ও কনসালটেশন",
    addressBn: "এস.এস.কে রোড, ফেনী সদর",
    searchAliases: ["মেডিকেয়ার", "মেডিকেয়ার", "medicare"],
    isPartner: false,
    featured: true,
  },
  {
    id: "square-lab",
    nameBn: "ইস্কয়ার ল্যাব ডায়াগনস্টিক সেন্টার",
    nameEn: "Square Lab Diagnostic Center Feni",
    shortNameBn: "ইস্কয়ার ল্যাব",
    categoryBn: "ডায়াগনস্টিক ও কনসালটেশন",
    addressBn: "ফেনী সদর, ফেনী",
    searchAliases: ["ইস্কয়ার", "ইস্কয়ার", "square lab", "square"],
    isPartner: false,
  },
  {
    id: "dd-lab",
    nameBn: "ডিডি ল্যাব কনসালটেশন সেন্টার",
    nameEn: "DD Lab Consultation Center Feni",
    shortNameBn: "ডিডি ল্যাব",
    categoryBn: "কনসালটেশন ও ল্যাব",
    addressBn: "মা প্লাজা, শহীদ শহীদুল্লাহ কায়সার রোড, ফেনী সদর",
    searchAliases: ["ডিডি ল্যাব", "dd lab", "ddlab"],
    isPartner: false,
    featured: true,
  },
  {
    id: "al-kemi",
    nameBn: "আল কেমী হাসপাতাল",
    nameEn: "Al Kemi Hospital Feni",
    shortNameBn: "আল কেমী",
    categoryBn: "স্পেশালাইজড হাসপাতাল",
    addressBn: "এস.এস.কে রোড, ফেনী সদর",
    searchAliases: ["আল কেমী", "আল-কেমী", "al kemi", "alkemi"],
    isPartner: false,
  },
];

/**
 * Checks if a doctor practices at a specific hospital or matches a hospital filter query.
 */
export function matchesHospitalDoctor(
  doc: Doctor,
  hospitalIdOrQuery: string
): boolean {
  if (!hospitalIdOrQuery || hospitalIdOrQuery === "all") return true;

  const target = hospitalIdOrQuery.toLowerCase().trim();

  // 1. Direct partnerId match or slug match
  const hospital = FENI_HOSPITALS_DIRECTORY.find(
    (h) => h.id === target || h.partnerSlug === target
  );

  const searchTerms = hospital ? hospital.searchAliases : [target];

  const chamber = (doc.chamberName || "").toLowerCase();
  const address = (doc.chamberAddress || "").toLowerCase();
  const partnerId = (doc.partnerId || "").toLowerCase();

  return searchTerms.some((term) => {
    const t = term.toLowerCase();
    return (
      chamber.includes(t) ||
      address.includes(t) ||
      (hospital?.partnerSlug && partnerId === hospital.partnerSlug.toLowerCase()) ||
      (hospital?.id && partnerId.includes(hospital.id.toLowerCase()))
    );
  });
}
