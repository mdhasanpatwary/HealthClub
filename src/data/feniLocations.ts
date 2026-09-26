export interface FeniUpazila {
  id: string;
  nameBn: string;
  nameEn: string;
}

export interface UpazilaSeoConfig {
  id: string;
  slug: string;
  nameBn: string;
  nameEn: string;
  heroHeadlineBn: string;
  metaTitleBn: string;
  metaDescriptionBn: string;
  keywords: string[];
}

export const FENI_UPAZILAS: readonly FeniUpazila[] = [
  { id: "all", nameBn: "সকল এলাকা", nameEn: "All Areas" },
  { id: "feni-sadar", nameBn: "ফেনী সদর", nameEn: "Feni Sadar" },
  { id: "chhagalnaiya", nameBn: "ছাগলনাইয়া", nameEn: "Chhagalnaiya" },
  { id: "daganbhuiyan", nameBn: "দাগনভূঞা", nameEn: "Daganbhuiyan" },
  { id: "sonagazi", nameBn: "সোনাগাজী", nameEn: "Sonagazi" },
  { id: "parshuram", nameBn: "পরশুরাম", nameEn: "Parshuram" },
  { id: "fulgazi", nameBn: "ফুলগাজী", nameEn: "Fulgazi" },
] as const;

export const VALID_UPAZILA_IDS = [
  "feni-sadar",
  "chhagalnaiya",
  "daganbhuiyan",
  "sonagazi",
  "parshuram",
  "fulgazi",
] as const;

export const UPAZILA_SEO_CONFIG: Record<string, UpazilaSeoConfig> = {
  "feni-sadar": {
    id: "feni-sadar",
    slug: "feni-sadar",
    nameBn: "ফেনী সদর",
    nameEn: "Feni Sadar",
    heroHeadlineBn: "ফেনী সদর ডাক্তার ও চেম্বার ডিরেক্টরি",
    metaTitleBn: "ফেনী সদর ডাক্তার তালিকা | বিশেষজ্ঞ ডাক্তারের চেম্বার, সিরিয়াল ও ঠিকানা",
    metaDescriptionBn: "ফেনী সদর, ট্রাঙ্ক রোড, এসএসকে রোড, হাসপাতাল রোডে বিশেষজ্ঞ ডাক্তার, চেম্বার সময়সূচী, সিরিয়াল নাম্বার ও রোগী দেখার তথ্য খুঁজুন.",
    keywords: [
      "ফেনী সদর ডাক্তার তালিকা",
      "feni sadar doctor list",
      "feni doctor appointment",
      "ফেনী সদর ডায়াগনস্টিক টেস্টের খরচ",
      "ফেনীতে সেরা মেডিসিন বিশেষজ্ঞ",
      "ফেনী হাসপাতাল সিরিয়াল",
      "Feni specialist doctor",
      "doctor chamber in Feni Sadar",
    ],
  },
  chhagalnaiya: {
    id: "chhagalnaiya",
    slug: "chhagalnaiya",
    nameBn: "ছাগলনাইয়া",
    nameEn: "Chhagalnaiya",
    heroHeadlineBn: "ছাগলনাইয়া ডাক্তার, চেম্বার ও হাসপাতাল গাইড",
    metaTitleBn: "ছাগলনাইয়ায় বিশেষজ্ঞ ডাক্তার তালিকা | ফেনী ডাক্তার চেম্বার ও সিরিয়াল",
    metaDescriptionBn: "ছাগলনাইয়ার রোগীদের জন্য ফেনী এলাকার বিশেষজ্ঞ ডাক্তার, চেম্বার সময়সূচী, হাসপাতাল ও ডায়াগনস্টিক সেবা খুঁজুন।",
    keywords: [
      "ছাগলনাইয়া ডাক্তার তালিকা",
      "chhagalnaiya doctor",
      "ফেনী ডাক্তারের চেম্বার",
      "specialist doctor near Chhagalnaiya",
      "ফেনী সদর রেফারেল হাসপাতাল",
    ],
  },
  daganbhuiyan: {
    id: "daganbhuiyan",
    slug: "daganbhuiyan",
    nameBn: "দাগনভূঞা",
    nameEn: "Daganbhuiyan",
    heroHeadlineBn: "দাগনভূঞায় বিশেষজ্ঞ ডাক্তার ও হাসপাতাল তথ্য",
    metaTitleBn: "দাগনভূঞায় ডাক্তার তালিকা | ফেনী বিশেষজ্ঞ ডাক্তারের সিরিয়াল ও চেম্বার",
    metaDescriptionBn: "দাগনভূঞার রোগীদের জন্য ফেনী শহরের বিশেষজ্ঞ ডাক্তার, চেম্বার স্থিতি, সিটি স্ক্যান ও ডায়াগনস্টিক রেফারেল গাইড জানতে দেখুন।",
    keywords: [
      "দাগনভূঞা ডাক্তার তালিকা",
      "daganbhuiyan doctor",
      "ফেনী সদর বিশেষজ্ঞ ডাক্তার",
      "ডাগনভূঞা হাসপাতাল সিরিয়াল",
      "Feni specialist appointment Daganbhuiyan",
    ],
  },
  sonagazi: {
    id: "sonagazi",
    slug: "sonagazi",
    nameBn: "সোনাগাজী",
    nameEn: "Sonagazi",
    heroHeadlineBn: "সোনাগাজী ডাক্তার ও স্বাস্থ্যসেবা গাইড",
    metaTitleBn: "সোনাগাজীতে ডাক্তার তালিকা | ফেনী বিশেষজ্ঞ ডাক্তার, চেম্বার ও সিরিয়াল",
    metaDescriptionBn: "সোনাগাজীর রোগীদের জন্য ফেনী শহর ও পার্শ্ববর্তী সেবা কেন্দ্রের বিশেষজ্ঞ ডাক্তার, প্রসূতি ও ডায়াগনস্টিক তথ্য দেখুন।",
    keywords: [
      "সোনাগাজী ডাক্তার তালিকা",
      "sonagazi doctor",
      "ফেনী সদর রোগী দেখার সময়",
      "সোনাগাজী চেম্বার",
      "feni specialist doctor Sonagazi",
    ],
  },
  parshuram: {
    id: "parshuram",
    slug: "parshuram",
    nameBn: "পরশুরাম",
    nameEn: "Parshuram",
    heroHeadlineBn: "পরশুরামে ডাক্তার, চেম্বার ও স্বাস্থ্য সেবা",
    metaTitleBn: "পরশুরামে ডাক্তার তালিকা | ফেনী বিশেষজ্ঞ চেম্বার, সিরিয়াল ও হাসপাতাল",
    metaDescriptionBn: "পরশুরাম এলাকার রোগীদের জন্য ফেনীর বিশেষজ্ঞ ডাক্তার, ডায়াগনস্টিক ও রেফারেল হাসপাতালের আপডেটেড তথ্য খুঁজুন।",
    keywords: [
      "পরশুরাম ডাক্তার তালিকা",
      "parshuram doctor",
      "ফেনী সদর ডাক্তারের সিরিয়াল",
      "Parshuram specialist doctor",
      "ফেনী হাসপাতাল রেফারেল",
    ],
  },
  fulgazi: {
    id: "fulgazi",
    slug: "fulgazi",
    nameBn: "ফুলগাজী",
    nameEn: "Fulgazi",
    heroHeadlineBn: "ফুলগাজী ডাক্তার ও হাসপাতাল গাইড",
    metaTitleBn: "ফুলগাজীতে ডাক্তার তালিকা | ফেনী বিশেষজ্ঞ চেম্বার ও সিরিয়াল গাইড",
    metaDescriptionBn: "ফুলগাজী এলাকার রোগীদের জন্য ফেনী শহরের ডাক্তারের চেম্বার, বিশেষজ্ঞতা, রেফারেল ও ডায়াগনস্টিক সেবা খুঁজুন।",
    keywords: [
      "ফুলগাজী ডাক্তার তালিকা",
      "fulgazi doctor",
      "ফেনী সদর চেম্বার",
      "specialist doctor in Fulgazi",
      "ফেনী ডায়াগনস্টিক রেফারেল",
    ],
  },
};

export type UpazilaId = (typeof VALID_UPAZILA_IDS)[number];

export function getUpazilaLabel(upazilaId?: string | null): string {
  if (!upazilaId) {
    return "ফেনী সদর";
  }
  const match = FENI_UPAZILAS.find((u) => u.id === upazilaId);
  return match ? match.nameBn : "ফেনী সদর";
}

export function getUpazilaSeoConfig(upazilaId?: string | null): UpazilaSeoConfig | null {
  if (!upazilaId) return UPAZILA_SEO_CONFIG["feni-sadar"] || null;
  return UPAZILA_SEO_CONFIG[upazilaId] || null;
}

export function getAllUpazilaSlugs(): string[] {
  return FENI_UPAZILAS.filter((entry) => entry.id !== "all").map((entry) => entry.id);
}

/**
 * Detects upazila key from address/chamber text as a smart fallback
 */
export function detectUpazilaFromText(text?: string | null): UpazilaId {
  if (!text) return "feni-sadar";
  const lower = text.toLowerCase();

  if (
    lower.includes("দাগনভূঞা") ||
    lower.includes("দাগনভুঁইয়া") ||
    lower.includes("দাগনভূঁইয়া") ||
    lower.includes("daganbhuiyan") ||
    lower.includes("daganbhuiya")
  ) {
    return "daganbhuiyan";
  }

  if (
    lower.includes("ছাগলনাইয়া") ||
    lower.includes("ছাগলনাইয়া") ||
    lower.includes("chhagalnaiya") ||
    lower.includes("chagalnaiya")
  ) {
    return "chhagalnaiya";
  }

  if (
    lower.includes("সোনাগাজী") ||
    lower.includes("sonagazi")
  ) {
    return "sonagazi";
  }

  if (
    lower.includes("পরশুরাম") ||
    lower.includes("parshuram") ||
    lower.includes("parashuram")
  ) {
    return "parshuram";
  }

  if (
    lower.includes("ফুলগাজী") ||
    lower.includes("fulgazi") ||
    lower.includes("phulgazi")
  ) {
    return "fulgazi";
  }

  return "feni-sadar";
}
