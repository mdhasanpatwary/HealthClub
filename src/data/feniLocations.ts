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
    heroHeadlineBn: "ফেনী সদর ডাক্তার তালিকা ও চেম্বার ডিরেক্টরি",
    metaTitleBn: "ফেনী সদর ডাক্তার তালিকা | বিশেষজ্ঞ ডাক্তারের চেম্বার, সিরিয়াল ও রোগী দেখার সময়",
    metaDescriptionBn: "ফেনী সদর, ট্রাঙ্ক রোড, এসএসকে রোড ও হাসপাতাল রোডে বিশেষজ্ঞ ডাক্তার, চেম্বার শিডিউল, রোগী দেখার সময় এবং সরাসরি সিরিয়াল নাম্বার ও অ্যাপয়েন্টমেন্ট তথ্য।",
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
    heroHeadlineBn: "ছাগলনাইয়ার রোগীদের জন্য ফেনীর বিশেষজ্ঞ ডাক্তার তালিকা",
    metaTitleBn: "ছাগলনাইয়ার রোগীদের জন্য ফেনীর বিশেষজ্ঞ ডাক্তার তালিকা | চেম্বার ও সিরিয়াল",
    metaDescriptionBn: "ছাগলনাইয়া এলাকার রোগীদের জন্য ফেনীর শীর্ষ বিশেষজ্ঞ ডাক্তার, চেম্বার শিডিউল, সরাসরি সিরিয়াল হটলাইন এবং ফেনী সদর পার্টনার ডায়াগনস্টিক রেফারেল গাইড।",
    keywords: [
      "ছাগলনাইয়ার রোগীদের জন্য ফেনীর ডাক্তার",
      "ছাগলনাইয়া ডাক্তার তালিকা",
      "chhagalnaiya doctor list",
      "ফেনী ডাক্তারের চেম্বার",
      "ছাগলনাইয়া ডাক্তার সিরিয়াল",
      "specialist doctor near Chhagalnaiya",
      "ফেনী সদর রেফারেল হাসপাতাল",
    ],
  },
  daganbhuiyan: {
    id: "daganbhuiyan",
    slug: "daganbhuiyan",
    nameBn: "দাগনভূঞা",
    nameEn: "Daganbhuiyan",
    heroHeadlineBn: "দাগনভূঞার রোগীদের জন্য ফেনীর বিশেষজ্ঞ ডাক্তার তালিকা",
    metaTitleBn: "দাগনভূঞার রোগীদের জন্য ফেনীর বিশেষজ্ঞ ডাক্তার তালিকা | চেম্বার ও সিরিয়াল",
    metaDescriptionBn: "দাগনভূঞা এলাকার রোগীদের জন্য ফেনী শহরের শীর্ষ বিশেষজ্ঞ ডাক্তার, চেম্বার শিডিউল, সিটি স্ক্যান, ডায়াগনস্টিক টেস্ট ও ফেনী সদর রেফারেল গাইড।",
    keywords: [
      "দাগনভূঞার রোগীদের জন্য ফেনীর বিশেষজ্ঞ ডাক্তার তালিকা",
      "দাগনভূঞা ডাক্তার তালিকা",
      "daganbhuiyan doctor list",
      "দাগনভূঞা ডাক্তার সিরিয়াল",
      "ফেনী সদর বিশেষজ্ঞ ডাক্তার",
      "দাগনভূঞা হাসপাতাল সিরিয়াল",
      "Feni specialist appointment Daganbhuiyan",
    ],
  },
  sonagazi: {
    id: "sonagazi",
    slug: "sonagazi",
    nameBn: "সোনাগাজী",
    nameEn: "Sonagazi",
    heroHeadlineBn: "সোনাগাজীর রোগীদের জন্য ফেনীর বিশেষজ্ঞ ডাক্তার তালিকা",
    metaTitleBn: "সোনাগাজীর রোগীদের জন্য ফেনীর বিশেষজ্ঞ ডাক্তার তালিকা | চেম্বার ও সিরিয়াল",
    metaDescriptionBn: "সোনাগাজী এলাকার রোগীদের জন্য ফেনী সদর ও ট্রাঙ্ক রোডের বিশেষজ্ঞ ডাক্তার, চেম্বার সময়সূচী, প্রসূতি ও জরুরি ডায়াগনস্টিক রেফারেল গাইড।",
    keywords: [
      "সোনাগাজীর রোগীদের জন্য ফেনীর ডাক্তার",
      "সোনাগাজী ডাক্তার তালিকা",
      "sonagazi doctor list",
      "সোনাগাজী ডাক্তার সিরিয়াল",
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
    heroHeadlineBn: "পরশুরামের রোগীদের জন্য ফেনীর বিশেষজ্ঞ ডাক্তার তালিকা",
    metaTitleBn: "পরশুরামের রোগীদের জন্য ফেনীর বিশেষজ্ঞ ডাক্তার তালিকা | চেম্বার ও সিরিয়াল",
    metaDescriptionBn: "পরশুরাম এলাকার রোগীদের জন্য ফেনী সদরের বিশেষজ্ঞ ডাক্তার, চেম্বার শিডিউল, ডায়াগনস্টিক ও রেফারেল হাসপাতালের আপডেটেড তথ্য ও সরাসরি সিরিয়াল।",
    keywords: [
      "পরশুরামের রোগীদের জন্য ফেনীর ডাক্তার",
      "পরশুরাম ডাক্তার তালিকা",
      "parshuram doctor list",
      "পরশুরাম ডাক্তার সিরিয়াল",
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
    heroHeadlineBn: "ফুলগাজীর রোগীদের জন্য ফেনীর বিশেষজ্ঞ ডাক্তার তালিকা",
    metaTitleBn: "ফুলগাজীর রোগীদের জন্য ফেনীর বিশেষজ্ঞ ডাক্তার তালিকা | চেম্বার ও সিরিয়াল",
    metaDescriptionBn: "ফুলগাজী এলাকার রোগীদের জন্য ফেনী শহরের বিশেষজ্ঞ ডাক্তারের চেম্বার, ভিজিটিং সময়, সিরিয়াল হটলাইন ও ডায়াগনস্টিক টেস্ট রেফারেল গাইড।",
    keywords: [
      "ফুলগাজীর রোগীদের জন্য ফেনীর ডাক্তার",
      "ফুলগাজী ডাক্তার তালিকা",
      "fulgazi doctor list",
      "ফুলগাজী ডাক্তার সিরিয়াল",
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
