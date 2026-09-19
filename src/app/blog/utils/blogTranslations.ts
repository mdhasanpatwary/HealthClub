import {
  ARTICLE_ENGLISH_INTROS,
  ARTICLE_ENGLISH_HIGHLIGHTS,
  ARTICLE_SELECTION_GUIDES,
} from "./articleTranslationsData";

/**
 * Converts Bengali digits (০-৯) to English digits (0-9).
 */
export function toEnglishDigits(str: string | number): string {
  if (str === null || str === undefined) return "";
  const banglaToEnglishMap: Record<string, string> = {
    "০": "0",
    "১": "1",
    "২": "2",
    "৩": "3",
    "৪": "4",
    "৫": "5",
    "৬": "6",
    "৭": "7",
    "৮": "8",
    "৯": "9",
  };
  let result = str.toString();
  for (const [bn, en] of Object.entries(banglaToEnglishMap)) {
    result = result.replaceAll(bn, en);
  }
  return result;
}

/**
 * Formats pricing ranges like '৳৩০০ - ৳৫০০' to '৳300 - ৳500' in English.
 */
export function formatBlogPriceRange(priceStr: string, isEn: boolean): string {
  if (!priceStr) return "";
  if (!isEn) return priceStr;
  return toEnglishDigits(priceStr)
    .replace(/প্রতি সেশন/g, "per session")
    .replace(/প্রতি টেস্ট/g, "per test")
    .replace(/থেকে/g, "-")
    .replace(/টাকা/g, "BDT");
}

const CATEGORY_TRANSLATIONS: Record<string, string> = {
  "প্যাথলজি ও বায়োকেমিস্ট্রি": "Pathology & Biochemistry",
  "হেমাটোলজি": "Hematology",
  "বায়োকেমিস্ট্রি": "Biochemistry",
  "ইলেক্ট্রোকার্ডিওগ্রাম / কার্ডিয়াক": "Electrocardiogram / Cardiac",
  "সোনোগ্রাফি / ইমেজিং": "Sonography / Imaging",
  "অ্যাডভান্সড নিউরো ইমেজিং": "Advanced Neuro Imaging",
  "হরমোন ও থাইরয়েড": "Hormones & Thyroid",
  "মাইক্রোবায়োলজি": "Microbiology",
  "সেরোলজি": "Serology",
  "ডেন্টাল সার্জারি": "Dental Surgery",
  "এন্ডোডন্টিক্স": "Endodontics",
  "প্রোস্থোডন্টিক্স": "Prosthodontics",
  "অর্থোডন্টিক্স": "Orthodontics",
  "কসমেটিক ডেন্টিস্ট্রি": "Cosmetic Dentistry",
  "রেস্টোরেটিভ ডেন্টিস্ট্রি": "Restorative Dentistry",
  "ইলেক্ট্রোথেরাপি": "Electrotherapy",
  "ম্যানুয়াল থেরাপি": "Manual Therapy",
  "নিউরো রিহ্যাব": "Neuro Rehabilitation",
  "অর্থোপেডিক রিহ্যাব": "Orthopedic Rehabilitation",
  "জেরিয়াট্রিক কেয়ার": "Geriatric Care",
  "প্রসব সেবা": "Delivery Care",
  "সিজারিয়ান প্যাকেজ": "C-Section Package",
  "স্বাভাবিক প্রসব": "Normal Delivery Package",
  "কার্ডিয়াক ডায়াগনস্টিক": "Cardiac Diagnostics",
  "কার্ডিয়াক হেলথ চেকআপ": "Cardiac Health Checkup",
  "জরুরি কার্ডিয়াক কেয়ার": "Emergency Cardiac Care",
  "হিমোডায়ালাইসিস সেশন": "Hemodialysis Session",
  "রেনাল ফাংশন টেস্ট": "Renal Function Test",
  "ডায়াবেটিক কিডনি ড্যামেজ স্ক্রিনিং": "Diabetic Renal Screening",
  "রেনাল আল্ট্রাসনোগ্রাফি": "Renal Ultrasonography",
  "রক্তের ইলেক্ট্রোলাইট ভারসাম্য": "Serum Electrolytes Balance",
  "কিডনি হেলথ চেকআপ": "Kidney Health Checkup",
  "সরকারি রুটিন টিকা": "Govt. Routine Vaccine",
  "ঐচ্ছিক প্রাইভেট টিকা": "Optional Private Vaccine",
  "সিজনাল ফ্লু টিকা": "Seasonal Flu Vaccine",
  "নবজাতক নিবিড় পরিচর্যা": "Neonatal Intensive Care (NICU)",
  "নবজাতকের জন্ডিস চিকিৎসা": "Neonatal Jaundice Care",
  "শিশুর ল্যাব ডায়াগনস্টিক": "Pediatric Diagnostics",
  "জন্ডিস মনিটরিং টেস্ট": "Jaundice Monitoring Test",
  "নিউমোনিয়া ও শ্বাসকষ্ট ইমেজিং": "Pediatric Respiratory Imaging",
  "স্কিন ল্যাব ডায়াগনস্টিক": "Skin Lab Diagnostics",
  "অ্যালার্জি টেস্ট": "Allergy Test",
  "স্কিন ক্লিনিক্যাল পরীক্ষা": "Clinical Skin Examination",
  "হিস্টোপ্যাথলজি ও বায়োপসি": "Histopathology & Biopsy",
  "ডার্মাটোসার্জারি প্রসিডিউর": "Dermatosurgery Procedure",
  "কসমেটিক স্কিন থেরাপি": "Cosmetic Skin Therapy",
  "হেয়ার রিস্টোরেশন প্রসিডিউর": "Hair Restoration Procedure",
  "গোপনীয় যৌন স্বাস্থ্য পরীক্ষা": "Confidential Sexual Health Panel",
};

export function translateMedicalCategory(categoryBn: string, isEn: boolean): string {
  if (!categoryBn || !isEn) return categoryBn;
  return CATEGORY_TRANSLATIONS[categoryBn.trim()] || categoryBn;
}

const LOCATION_TRANSLATIONS: Record<string, string> = {
  "জিরো পয়েন্ট, এসএসকে রোড": "Zero Point, SSK Road",
  "এসএসকে রোড": "SSK Road",
  "গ্র্যান্ড ট্রাঙ্ক রোড": "Grand Trunk Road",
  "ট্রাঙ্ক রোড": "Trunk Road",
  "খেজুর চত্বর, ট্রাংক রোড": "Khejur Chottor, Trunk Road",
  "জাহিরিয়া টাওয়ার, ট্রাঙ্ক রোড": "Jahiria Tower, Trunk Road",
  "মিজান রোড": "Mizan Road",
  "জেল রোড, সদর হাসপাতাল মোড়": "Jail Road, Sadar Hospital Mor",
  "খাজুরিয়া কোট বিল্ডিং, ট্রাংক রোড": "Khajuria Court Building, Trunk Road",
  "শহীদ শহিদুল্লাহ কায়সার সড়ক": "Shahid Shahidullah Kaiser Road",
  "হাসপাতাল মোড়, জেল রোড": "Hospital Mor, Jail Road",
  "সদর হাসপাতাল রোড": "Sadar Hospital Road",
  "ডাক্তার পাড়া": "Doctor Para",
  "কলেজ রোড": "College Road",
  "বড় বাজার": "Boro Bazar",
  "ইসলামপুর রোড": "Islampur Road",
  "মুক্তার বাড়ি মোড়": "Muktar Bari Mor",
  "মাস্টার পাড়া": "Master Para",
};

export function translateLocation(locBn: string, isEn: boolean): string {
  if (!locBn || !isEn) return locBn;
  const match = Object.entries(LOCATION_TRANSLATIONS).find(([bn]) =>
    locBn.toLowerCase().includes(bn.toLowerCase())
  );
  if (match) {
    return match[1];
  }
  return toEnglishDigits(locBn);
}

export function translateDiscount(discountBn: string, isEn: boolean): string {
  if (!discountBn || !isEn) return discountBn;
  return toEnglishDigits(discountBn)
    .replace(/১০-৩০% বিশেষ ছাড়/g, "10-30% Member Discount")
    .replace(/১০-৩০% মেম্বার ছাড়/g, "10-30% Member Discount")
    .replace(/হেলথ ক্লাব কার্ডে ২৫% পর্যন্ত ছাড়/g, "Up to 25% Health Club Discount")
    .replace(/সরকারি ন্যূনতম ফি/g, "Govt. Subsidized Rates")
    .replace(/প্রাইভেট নির্ধারিত চার্জ/g, "Standard Private Rates")
    .replace(/রেগুলার রেট/g, "Regular Market Rate")
    .replace(/মেম্বার হলে ১০-৩০% ডিসকাউন্ট/g, "10-30% Member Discount")
    .replace(/১০-২০% মেম্বার ছাড়/g, "10-20% Member Discount")
    .replace(/বিশেষ মেম্বার ছাড়/g, "Special Member Savings")
    .replace(/ছাড়/g, "Discount");
}

export function translateTurnaroundTime(timeBn: string, isEn: boolean): string {
  if (!timeBn || !isEn) return timeBn;
  return toEnglishDigits(timeBn)
    .replace(/তাৎক্ষণিক রিপোর্ট/g, "Instant Report")
    .replace(/২৪ ঘণ্টা/g, "24 Hours")
    .replace(/২-৪ ঘণ্টা/g, "2-4 Hours")
    .replace(/৪-৬ ঘণ্টা/g, "4-6 Hours")
    .replace(/৬-৮ ঘণ্টা/g, "6-8 Hours")
    .replace(/১২ ঘণ্টা/g, "12 Hours")
    .replace(/২-৩ দিন/g, "2-3 Days")
    .replace(/৩-৫ দিন/g, "3-5 Days")
    .replace(/ঘণ্টা/g, "Hours")
    .replace(/দিন/g, "Days")
    .replace(/মিনিট/g, "Minutes");
}

export function translateComparisonStatus(val: boolean | string, isEn: boolean): string {
  if (typeof val === "boolean") {
    return isEn ? (val ? "Yes" : "No") : val ? "আছে" : "নেই";
  }
  if (!isEn) return val;
  if (val.includes("রেফারেল")) return "Referral";
  if (val.includes("নেই") || val.toLowerCase().includes("no")) return "No";
  if (val.includes("আছে") || val.toLowerCase().includes("yes")) return "Yes";
  return toEnglishDigits(val);
}

export function getArticleEnglishIntro(slug: string, fallbackBn: string[], isEn: boolean): string[] {
  if (!isEn) return fallbackBn;
  return ARTICLE_ENGLISH_INTROS[slug] || fallbackBn;
}

export function getArticleEnglishHighlights(
  slug: string,
  keyHighlightsBn: string[] | undefined,
  isEn: boolean
): string[] {
  if (!isEn) return keyHighlightsBn || [];
  return ARTICLE_ENGLISH_HIGHLIGHTS[slug] || keyHighlightsBn || [];
}

export function getArticleSelectionGuide(
  slug: string,
  rawBn: { titleBn: string; pointsBn: { title: string; desc: string }[] } | undefined,
  isEn: boolean
) {
  if (!rawBn) return null;
  if (!isEn) {
    return {
      title: rawBn.titleBn,
      points: rawBn.pointsBn,
    };
  }
  const match = ARTICLE_SELECTION_GUIDES[slug] || ARTICLE_SELECTION_GUIDES.default;
  return {
    title: match.title,
    points: match.points,
  };
}

export function getArticleEmergencyDirectory(
  rawBn: { titleBn: string; services: { name: string; phone: string; note: string }[] } | undefined,
  isEn: boolean
) {
  if (!rawBn) return null;
  if (!isEn) {
    return {
      title: rawBn.titleBn,
      services: rawBn.services,
    };
  }

  const enServices = rawBn.services.map((svc) => {
    let nameEn = svc.name;
    let noteEn = svc.note;
    if (svc.name.includes("অ্যাম্বুলেন্স")) nameEn = "24/7 Red Crescent Ambulance Service";
    else if (svc.name.includes("জেনারেল হাসপাতাল")) nameEn = "Feni 250 Bed General Hospital Emergency";
    else if (svc.name.includes("ফায়ার সার্ভিস")) nameEn = "Feni Fire Service & Civil Defense";
    else if (svc.name.includes("পুলিশ")) nameEn = "Feni District Police Control Room";

    if (svc.note.includes("২৪/৭")) noteEn = "24/7 On-Call Emergency Service";
    else if (svc.note.includes("তাৎক্ষণিক")) noteEn = "Immediate Response Dispatch";

    return {
      name: nameEn,
      phone: svc.phone,
      note: noteEn,
    };
  });

  return {
    title: "24/7 Emergency Medical Hotlines in Feni",
    services: enServices,
  };
}

export function getArticleBookingGuide(
  rawBn: { titleBn: string; stepsBn: { step: string; title: string; desc: string }[] } | undefined,
  isEn: boolean
) {
  if (!rawBn) return null;
  if (!isEn) {
    return {
      title: rawBn.titleBn,
      steps: rawBn.stepsBn,
    };
  }

  const enSteps = rawBn.stepsBn.map((step, idx) => {
    let titleEn = step.title;
    let descEn = step.desc;

    if (idx === 0) {
      titleEn = "Call Early in the Morning";
      descEn = "Most specialist chambers in Feni begin accepting serial calls between 8:00 AM and 10:00 AM. Call early to secure lower serial numbers.";
    } else if (idx === 1) {
      titleEn = "Note Serial Number and Expected Time";
      descEn = "Clearly confirm your serial number and expected entry time with the chamber assistant to avoid prolonged waiting.";
    } else if (idx === 2) {
      titleEn = "Bring Previous Medical Records";
      descEn = "Organize prior prescription files, recent blood test reports, and imaging scans chronologically for the physician's review.";
    } else if (idx === 3) {
      titleEn = "Present Health Club Card for Test Savings";
      descEn = "If diagnostic tests are advised, visit Health Club partner centers to save 10-30% with your digital membership card.";
    }

    return {
      step: `Step ${idx + 1}`,
      title: titleEn,
      desc: descEn,
    };
  });

  return {
    title: "Step-by-Step Specialist Appointment & Serial Booking Guide",
    steps: enSteps,
  };
}
