import { PartnerFacilityItem, Partner } from "@/services/db";

export interface FacilityPreset {
  id: string;
  nameBn: string;
  nameEn: string;
  descBn: string;
  descEn: string;
  icon: string;
  category: "all" | "hospital" | "diagnostic" | "pharmacy";
  defaultActiveFor: ("hospital" | "diagnostic" | "pharmacy" | "emergencyPhone")[];
}

export const MASTER_FACILITY_PRESETS: FacilityPreset[] = [
  // --- Hospital & Diagnostic Presets ---
  {
    id: "emergency",
    nameBn: "২৪/৭ জরুরি বিভাগ",
    nameEn: "24/7 Emergency Care",
    descBn: "সার্বক্ষণিক জরুরি চিকিৎসা ও ট্রমা সেবা",
    descEn: "Round-the-clock emergency & trauma management",
    icon: "ShieldAlert",
    category: "hospital",
    defaultActiveFor: ["hospital", "emergencyPhone"],
  },
  {
    id: "icu_ccu",
    nameBn: "আইসিইউ ও সসিসিইউ",
    nameEn: "ICU & CCU Units",
    descBn: "আধুনিক লাইফ সাপোর্ট ও কার্ডিয়াক মনিটরিং",
    descEn: "Modern life support & cardiac monitoring",
    icon: "HeartPulse",
    category: "hospital",
    defaultActiveFor: ["hospital"],
  },
  {
    id: "ambulance",
    nameBn: "জরুরি অ্যাম্বুলেন্স",
    nameEn: "Emergency Ambulance",
    descBn: "অন-কল দ্রুত রোগী স্থানান্তর ব্যবস্থা",
    descEn: "On-call patient transfer & oxygen support",
    icon: "Truck",
    category: "hospital",
    defaultActiveFor: ["hospital", "emergencyPhone"],
  },
  {
    id: "pathology",
    nameBn: "ডিজিটাল প্যাথলজি ল্যাব",
    nameEn: "Digital Pathology Lab",
    descBn: "স্বয়ংক্রিয় হরমোন ও বায়োকেমিস্ট্রি পরীক্ষা",
    descEn: "Automated hormone, blood & biochemistry tests",
    icon: "Microscope",
    category: "all",
    defaultActiveFor: ["hospital", "diagnostic"],
  },
  {
    id: "imaging",
    nameBn: "ডিজিটাল এক্স-রে ও ইউএসজি",
    nameEn: "Digital X-Ray & 4D USG",
    descBn: "হাই-রেজোলিউশন ডায়াগনস্টিক ইমেজিং",
    descEn: "High-resolution 4D Ultrasonography & Imaging",
    icon: "Activity",
    category: "all",
    defaultActiveFor: ["hospital", "diagnostic"],
  },
  {
    id: "ot",
    nameBn: "মডার্ন অপারেশন থিয়েটার",
    nameEn: "Modern Operation Theater",
    descBn: "ল্যাপারোস্কপিক ও জেনারেল সার্জারি সুবিধা",
    descEn: "Laparoscopic, general & orthopedic surgery",
    icon: "Sparkles",
    category: "hospital",
    defaultActiveFor: ["hospital"],
  },
  {
    id: "pharmacy_dept",
    nameBn: "ইন-হাউজ ফার্মেসি",
    nameEn: "In-House Pharmacy",
    descBn: "১০০% খাঁটি ও কোল্ড-চেইন সংরক্ষিত ঔষধ",
    descEn: "100% genuine & temperature-controlled medicine",
    icon: "Pill",
    category: "hospital",
    defaultActiveFor: ["hospital"],
  },
  {
    id: "consultation",
    nameBn: "বিশেষজ্ঞ কনসালটেশন",
    nameEn: "Specialist OPD Chambers",
    descBn: "নিয়মিত অভিজ্ঞ কনসালটেন্ট চিকিৎসকের সেবা",
    descEn: "Resident and visiting consultant chambers",
    icon: "Stethoscope",
    category: "all",
    defaultActiveFor: ["hospital", "diagnostic"],
  },
  {
    id: "cabins",
    nameBn: "এসি কেবিন ও ওয়ার্ড",
    nameEn: "AC Cabins & General Ward",
    descBn: "পরিচ্ছন্ন ও আরামদায়ক ইনডোর ভর্তি সুবিধা",
    descEn: "Hygienic private cabins & monitored wards",
    icon: "BedDouble",
    category: "hospital",
    defaultActiveFor: ["hospital"],
  },
  {
    id: "facilities",
    nameBn: "ফ্রি ওয়াইফাই ও জেনারেটর",
    nameEn: "Generator & Wi-Fi",
    descBn: "নিরবচ্ছিন্ন বিদ্যুৎ ও অপেক্ষমান লাউঞ্জ",
    descEn: "24/7 power backup & comfortable waiting area",
    icon: "Wifi",
    category: "all",
    defaultActiveFor: ["hospital", "diagnostic", "pharmacy"],
  },
  {
    id: "dialysis",
    nameBn: "হিমোডায়ালাইসিস ইউনিট",
    nameEn: "Hemodialysis Unit",
    descBn: "আধুনিক ডায়ালাইসিস ও নেফ্রোলজি সেবা",
    descEn: "Modern dialysis and nephrology care",
    icon: "Activity",
    category: "hospital",
    defaultActiveFor: [],
  },
  {
    id: "nicu_picu",
    nameBn: "এনআইসিইউ ও পিআইসিইউ",
    nameEn: "NICU & PICU",
    descBn: "নবজাতক ও শিশুদের নিবিড় পরিচর্যা কেন্দ্র",
    descEn: "Neonatal & pediatric intensive care units",
    icon: "HeartPulse",
    category: "hospital",
    defaultActiveFor: [],
  },
  {
    id: "blood_bank",
    nameBn: "ব্লাড ব্যাংক ও ট্রান্সফিউশন",
    nameEn: "Blood Bank & Transfusion",
    descBn: "নিরাপদ রক্ত সংগ্রহ ও স্ক্রিনিং ব্যবস্থা",
    descEn: "Safe blood collection & screening unit",
    icon: "ShieldAlert",
    category: "hospital",
    defaultActiveFor: [],
  },
  {
    id: "physiotherapy",
    nameBn: "ফিজিওথেরাপি ও রিহ্যাব",
    nameEn: "Physiotherapy & Rehab",
    descBn: "বিশেষায়িত ফিজিওথেরাপি ও পুনর্বাসন সেন্টার",
    descEn: "Specialized rehabilitation & physical therapy",
    icon: "Sparkles",
    category: "all",
    defaultActiveFor: [],
  },

  // --- Pharmacy Presets ---
  {
    id: "genuine_drugs",
    nameBn: "১০০% খাঁটি ও আসল ঔষধ",
    nameEn: "100% Genuine Medicines",
    descBn: "রেজিস্টার্ড ফার্মাসিউটিক্যালস কোম্পানির জেনুইন ঔষধ",
    descEn: "Authentic drugs sourced directly from authorized companies",
    icon: "Pill",
    category: "pharmacy",
    defaultActiveFor: ["pharmacy"],
  },
  {
    id: "cold_chain",
    nameBn: "কোল্ড-চেইন সংরক্ষণ",
    nameEn: "Cold-Chain Temperature Control",
    descBn: "ইনসুলিন ও ভ্যাকসিনের সঠিক তাপমাত্রা নিয়ন্ত্রণ ব্যবস্থা",
    descEn: "Monitored refrigeration for insulin, vaccines & biotics",
    icon: "ThermometerSnowflake",
    category: "pharmacy",
    defaultActiveFor: ["pharmacy"],
  },
  {
    id: "pharmacist",
    nameBn: "অভিজ্ঞ ফার্মাসিস্ট পরামর্শ",
    nameEn: "Registered Pharmacist On Duty",
    descBn: "ঔষধ সেবনের সঠিক নিয়ম ও ডোজ নির্দেশনা",
    descEn: "Expert guidance on dosage, administration & safety",
    icon: "UserCheck",
    category: "pharmacy",
    defaultActiveFor: ["pharmacy"],
  },
  {
    id: "surgical",
    nameBn: "সার্জিক্যাল ও হেলথকেয়ার আইটেম",
    nameEn: "Surgical & Health Supplies",
    descBn: "বিপি মেশিন, গ্লুকোমিটার স্ট্রিপ ও সার্জিক্যাল সামগ্রী",
    descEn: "BP monitors, glucometer strips & surgical disposables",
    icon: "PackageCheck",
    category: "pharmacy",
    defaultActiveFor: ["pharmacy"],
  },
  {
    id: "invoicing",
    nameBn: "স্বচ্ছ কম্পিউটারাইজড বিলিং",
    nameEn: "Computerized Billing & Discount",
    descBn: "প্রতিটি ক্রয়ে মুদ্রিত ইনভয়েস ও মেম্বার ডিসকাউন্ট",
    descEn: "Printed receipts with itemized Health Club discount",
    icon: "ReceiptText",
    category: "pharmacy",
    defaultActiveFor: ["pharmacy"],
  },
  {
    id: "support",
    nameBn: "জরুরি সেবা ও সাপোর্ট",
    nameEn: "Direct Support & Guidance",
    descBn: "জরুরি ঔষধ প্রাপ্তির তথ্য ও সার্বক্ষণিক সহায়তা",
    descEn: "Availability check and quick phone support",
    icon: "ShieldAlert",
    category: "pharmacy",
    defaultActiveFor: ["pharmacy"],
  },
];

/**
 * Returns default list of facilities for a given category & partner info
 */
export function getDefaultFacilities(
  category: Partner["category"],
  emergencyPhone?: string | null,
  ambulancePhone?: string | null
): PartnerFacilityItem[] {
  const isHospital = category === "hospital";
  const isDiagnostic = category === "diagnostic";
  const isPharmacy = category === "pharmacy";
  const hasEmergency = Boolean(
    (emergencyPhone && emergencyPhone.trim().length > 0) ||
    (ambulancePhone && ambulancePhone.trim().length > 0)
  );

  const presets = MASTER_FACILITY_PRESETS.filter((p) => {
    if (isPharmacy) return p.category === "pharmacy" || p.category === "all";
    return p.category === "hospital" || p.category === "diagnostic" || p.category === "all";
  });

  return presets.map((p) => {
    let isAvailable = false;
    if (isHospital && p.defaultActiveFor.includes("hospital")) {
      isAvailable = true;
    } else if (isDiagnostic && p.defaultActiveFor.includes("diagnostic")) {
      isAvailable = true;
    } else if (isPharmacy && p.defaultActiveFor.includes("pharmacy")) {
      isAvailable = true;
    }
    if (hasEmergency && p.defaultActiveFor.includes("emergencyPhone")) {
      isAvailable = true;
    }

    return {
      id: p.id,
      nameBn: p.nameBn,
      nameEn: p.nameEn,
      descBn: p.descBn,
      descEn: p.descEn,
      icon: p.icon,
      isAvailable,
      isCustom: false,
    };
  });
}

/**
 * Parses raw JSON string of facilities.
 */
export function parsePartnerFacilities(raw?: string | null): PartnerFacilityItem[] | null {
  if (!raw || typeof raw !== "string" || !raw.trim()) return null;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed as PartnerFacilityItem[];
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Resolves facilities for public display:
 * Uses custom saved facilities if present; otherwise falls back to smart category defaults.
 */
export function getResolvedFacilities(partner: Partner): PartnerFacilityItem[] {
  const custom = parsePartnerFacilities(partner.facilities);
  if (custom && custom.length > 0) {
    // Only return facilities marked as available
    return custom.filter((f) => f.isAvailable);
  }

  // Fallback to active defaults
  const defaults = getDefaultFacilities(
    partner.category,
    partner.emergencyPhone,
    partner.ambulancePhone
  );
  return defaults.filter((f) => f.isAvailable);
}
