import { DepartmentSeoConfig } from "./departments/types";
import { generalCareDepartments } from "./departments/generalCare";
import { maternalHealthDepartments } from "./departments/maternalHealth";
import { surgicalCareDepartments } from "./departments/surgicalCare";
import { internalSpecialtiesDepartments } from "./departments/internalSpecialties";

export type { DepartmentSeoConfig };

export const DOCTOR_DEPARTMENTS_SEO: Record<string, DepartmentSeoConfig> = {
  ...generalCareDepartments,
  ...maternalHealthDepartments,
  ...surgicalCareDepartments,
  ...internalSpecialtiesDepartments,
};

/**
 * Returns SEO configuration for a specific department id.
 */
export function getDepartmentSeoConfig(departmentId?: string | null): DepartmentSeoConfig | null {
  if (!departmentId || departmentId === "all" || departmentId === "other") {
    return null;
  }
  return DOCTOR_DEPARTMENTS_SEO[departmentId] || null;
}

/**
 * Returns list of all indexed department slugs for sitemap and landing links.
 */
export function getAllDepartmentSlugs(): string[] {
  return Object.keys(DOCTOR_DEPARTMENTS_SEO);
}

export interface DoctorMetadataSource {
  name: string;
  nameEn?: string | null;
  specialty: string;
  degrees?: string | null;
  designation?: string | null;
  chamberName?: string | null;
  chamberAddress?: string | null;
  visitingDays?: string | null;
  visitingHours?: string | null;
  serialPhone?: string | null;
  department?: string | null;
}

export const DEPARTMENT_SYMPTOM_KEYWORDS_MAP: Record<string, string[]> = {
  medicine: [
    "জ্বর ও সংক্রমণ",
    "জন্ডিস",
    "টাইফয়েড",
    "গ্যাস্ট্রিক ও পেটের আলসার",
    "কাশি ও শ্বাসকষ্ট",
    "উচ্চ রক্তচাপ",
    "শারীরিক দুর্বলতা ও রক্তশূন্যতা",
  ],
  cardiology: [
    "বুকের ব্যথা",
    "বুক ধড়ফড়",
    "শ্বাসকষ্ট",
    "উচ্চ রক্তচাপ ও হাইপারটেনশন",
    "হার্ট ব্লকেজ",
    "বাতজ্বর",
    "পা ফোলা ও হার্ট ফেইলিউর",
  ],
  gynecology: [
    "গর্ভকালীন যত্ন",
    "অনিয়মিত মাসিক",
    "বন্ধ্যাত্ব চিকিৎসা",
    "জরায়ুর টিউমার ও সিস্ট",
    "সাদাস্রাব",
    "তলপেটে ব্যথা",
    "পলিসিস্টিক ওভারি (PCOS)",
  ],
  pediatrics: [
    "শিশুর জ্বর",
    "নিউমোনিয়া ও শ্বাসকষ্ট",
    "বাচ্চার সর্দি-কাশি",
    "অপুষ্টি ও কম ওজন",
    "শিশুর ডায়রিয়া ও বমি",
    "শিশুর টিকা পরামর্শ",
  ],
  orthopedics: [
    "হাড় ভাঙা ও ফ্র্যাকচার",
    "কোমর ব্যথা",
    "হাঁটু ও জয়েন্টে ব্যথা",
    "বাত-ব্যথা (Arthritis)",
    "মেরুদণ্ড ও স্পাইন সমস্যা",
    "স্পোর্টস ইনজুরি ও লিগামেন্ট",
  ],
  psychiatry: [
    "উদ্বেগ ও দুশ্চিন্তা (Anxiety)",
    "অনিদ্রা ও ঘুমের সমস্যা",
    "ডিপ্রেশন ও অবসাদ",
    "প্যানিক অ্যাটাক",
    "ফোবিয়া ও মানসিক ভয়",
    "মাদকাসক্তি মুক্তি ও কাউন্সেলিং",
  ],
  nephrology: [
    "কিডনিতে পাথর",
    "প্রস্রাবে জ্বালাপোড়া ও ইউটিআই",
    "হাত-পা বা মুখ ফোলা",
    "প্রস্রাবে প্রোটিন নির্গমন",
    "ক্রনিক কিডনি ডিজিজ (CKD)",
    "ডায়ালাইসিস পরামর্শ",
  ],
  hepatology: [
    "জন্ডিস ও লিভার সমস্যা",
    "ফ্যাটি লিভার",
    "লিভার সিরোসিস",
    "হেপাটাইটিস বি ও সি",
    "পেটে পানি জমা (Ascites)",
    "লিভার এনজাইম বৃদ্ধি",
  ],
  surgery: [
    "অ্যাপেন্ডিসাইটিস ব্যথা",
    "হার্নিয়া",
    "পিত্তথলির পাথর",
    "শরীরে টিউমার ও সিস্ট",
    "পাইলস, ফিশার ও ফিস্টুলা",
    "ল্যাপারোস্কপিক অপারেশন",
  ],
  dermatology: [
    "চুলকানি ও এলার্জি",
    "দাদ ও ফাঙ্গাল ইনফেকশন",
    "ব্রণ ও মেছতা",
    "সোরিয়াসিস",
    "চুল পড়া ও টাক",
    "একজিমা",
    "ত্বকে লালচে র‍্যাশ",
  ],
  ent: [
    "কান পাকা ও পুঁজ পড়া",
    "নাক বন্ধ ও সাইনোসাইটিস",
    "টনসিল ব্যথা ও ইনফেকশন",
    "গলায় কিছু আটকে থাকা",
    "কানে কম শোনা",
    "থাইরয়েড সমস্যা",
  ],
  eye: [
    "চোখে ঝাপসা দেখা",
    "ছানি পড়া (Cataract)",
    "চোখ লাল হওয়া ও চুলকানি",
    "গ্লুকোমা",
    "চোখে পানি পড়া",
    "দৃষ্টিশক্তি পরীক্ষা ও চশমা",
  ],
  dental: [
    "দাঁতে পোকা ও ক্যাভিটি",
    "মাড়ি দিয়ে রক্ত পড়া",
    "দাঁতের শিরশিরানি",
    "মাড়ি ফোলা ও ইনফেকশন",
    "আক্কেল দাঁতের ব্যথা",
    "রুট ক্যানেল ও ফিলিং",
  ],
  diabetes: [
    "অনিয়ন্ত্রিত ডায়াবেটিস ও সুগার",
    "ঘন ঘন প্রস্রাব হওয়া",
    "অতিরিক্ত ক্ষুধা ও পিপাসা",
    "ওজন দ্রুত কমে যাওয়া",
    "থাইরয়েড হরমোন সমস্যা",
    "ডায়াবেটিক ফুট ও ক্ষত",
  ],
  nutrition: [
    "অতিরিক্ত ওজন ও স্থূলতা",
    "ওজন বাড়ানোর ডায়েট",
    "ডায়াবেটিস রোগীর খাবার চার্ট",
    "কিডনি ও লিভার রোগীর পুষ্টি",
    "শিশুর পুষ্টিকর খাদ্য তালিকা",
  ],
  rheumatology: [
    "রিউমাটয়েড আর্থ্রাইটিস (বাত)",
    "ইউরিক এসিড ও গাউট",
    "এঙ্কাইলোজিং স্পন্ডিলাইটিস",
    "হাতের আঙুল ও গিঁটে ব্যথা",
    "লুপাস ও অটোইমিউন রোগ",
  ],
  other: [
    "সাধারণ শারীরিক সমস্যা",
    "বিশেষায়িত কনসালটেশন",
    "রোগ নির্ণয় ও রেফারেল",
  ],
};

/**
 * Resolves canonical department key for a doctor by checking department id and specialty keywords.
 */
export function resolveDoctorDepartmentKey(doc: {
  department?: string | null;
  specialty?: string | null;
}): string {
  const dept = doc.department?.trim().toLowerCase();
  if (dept && dept !== "all" && dept !== "other" && (DOCTOR_DEPARTMENTS_SEO[dept] || DEPARTMENT_SYMPTOM_KEYWORDS_MAP[dept])) {
    return dept;
  }

  const spec = (doc.specialty || "").toLowerCase();
  if (spec.includes("মেডিসিন") || spec.includes("medicine")) return "medicine";
  if (spec.includes("কার্ডিওলজি") || spec.includes("হৃদরোগ") || spec.includes("cardio") || spec.includes("হার্ট")) return "cardiology";
  if (spec.includes("গাইনী") || spec.includes("প্রসূতি") || spec.includes("gyne") || spec.includes("obs")) return "gynecology";
  if (spec.includes("শিশু") || spec.includes("নবজাতক") || spec.includes("pediatric")) return "pediatrics";
  if (spec.includes("হাড়") || spec.includes("অর্থোপেডিক") || spec.includes("ortho") || spec.includes("ট্রমা")) return "orthopedics";
  if (spec.includes("চর্ম") || spec.includes("যৌন") || spec.includes("এলার্জি") || spec.includes("derma") || spec.includes("skin")) return "dermatology";
  if (spec.includes("নাক") || spec.includes("কান") || spec.includes("গলা") || spec.includes("ent")) return "ent";
  if (spec.includes("চোখ") || spec.includes("চক্ষু") || spec.includes("eye") || spec.includes("ophthal")) return "eye";
  if (spec.includes("দাঁত") || spec.includes("ডেন্টাল") || spec.includes("dental")) return "dental";
  if (spec.includes("ডায়াবেটিস") || spec.includes("হরমোন") || spec.includes("diabet") || spec.includes("endocrin")) return "diabetes";
  if (spec.includes("কিডনি") || spec.includes("নেফ্রোলজি") || spec.includes("nephro") || spec.includes("ইউরোলজি")) return "nephrology";
  if (spec.includes("লিভার") || spec.includes("হেপাটোলজি") || spec.includes("গ্যাস্ট্রো") || spec.includes("hepato") || spec.includes("gastro")) return "hepatology";
  if (spec.includes("সার্জারি") || spec.includes("সার্জন") || spec.includes("surg")) return "surgery";
  if (spec.includes("বাত") || spec.includes("রিউমাটোলজি") || spec.includes("rheumat")) return "rheumatology";
  if (spec.includes("মানসিক") || spec.includes("সাইকিয়াট্রি") || spec.includes("psych")) return "psychiatry";
  if (spec.includes("পুষ্টি") || spec.includes("ডায়েট") || spec.includes("nutrit") || spec.includes("diet")) return "nutrition";

  return "other";
}

/**
 * Returns 3-5 clinical scope tags in Bengali for a doctor based on department and specialty.
 */
export function getDoctorClinicalScope(doc: {
  department?: string | null;
  specialty?: string | null;
}): string[] {
  const deptKey = resolveDoctorDepartmentKey(doc);
  const deptConfig = DOCTOR_DEPARTMENTS_SEO[deptKey];
  if (deptConfig && deptConfig.clinicalScopeBn && deptConfig.clinicalScopeBn.length > 0) {
    return deptConfig.clinicalScopeBn;
  }

  return [
    "বিশেষায়িত চিকিৎসা পরামর্শ",
    "রোগ নির্ণয় ও ক্লিনিক্যাল টেস্ট",
    "নিয়মিত ফলোআপ ও স্বাস্থ্যসেবা",
  ];
}

/**
 * Returns disease & symptom keywords in Bengali treated by this doctor's specialty/department.
 */
export function getDoctorSymptomKeywords(doc: {
  department?: string | null;
  specialty?: string | null;
}): string[] {
  const deptKey = resolveDoctorDepartmentKey(doc);
  const symptoms = DEPARTMENT_SYMPTOM_KEYWORDS_MAP[deptKey];
  if (symptoms && symptoms.length > 0) {
    return symptoms;
  }
  return DEPARTMENT_SYMPTOM_KEYWORDS_MAP.other;
}

/**
 * Generates high-converting local intent meta title for individual doctor profiles.
 * Pattern: "{Name} - {Specialty} | চেম্বার, ভিজিটিং সময় ও সিরিয়াল ফেনী"
 */
export function formatDoctorMetaTitle(name: string, specialty: string): string {
  const cleanName = (name || "").trim();
  const cleanSpecialty = (specialty || "").trim();
  return `${cleanName} - ${cleanSpecialty} | চেম্বার, ভিজিটিং সময় ও সিরিয়াল ফেনী`;
}

/**
 * Generates localized intent meta description for individual doctor profiles.
 */
export function formatDoctorMetaDescription(doc: DoctorMetadataSource): string {
  const parts: string[] = [];
  const degreePart = doc.degrees ? `, ${doc.degrees.trim()}` : "";
  parts.push(`${doc.name.trim()}, ${doc.specialty.trim()}${degreePart}।`);

  if (doc.chamberName) {
    const addr = doc.chamberAddress ? `, ${doc.chamberAddress.trim()}` : "";
    parts.push(`চেম্বার: ${doc.chamberName.trim()}${addr}।`);
  }

  if (doc.visitingDays || doc.visitingHours) {
    const days = doc.visitingDays?.trim() || "";
    const hours = doc.visitingHours?.trim() ? ` (${doc.visitingHours.trim()})` : "";
    parts.push(`রোগী দেখার সময় ও শিডিউল: ${days}${hours}।`);
  }

  if (doc.serialPhone) {
    parts.push(`ফেনীতে সরাসরি সিরিয়াল নিতে কল করুন: ${doc.serialPhone.trim()}।`);
  }

  return parts.join(" ");
}

/**
 * Generates comprehensive localized search keywords for doctor profiles.
 */
export function generateDoctorKeywords(doc: DoctorMetadataSource): string[] {
  const cleanName = doc.name.trim();
  const cleanSpec = doc.specialty.trim();
  const chamber = doc.chamberName?.trim() || "";

  const keywords: string[] = [
    cleanName,
    cleanSpec,
    `${cleanName} চেম্বার ফেনী`,
    `${cleanName} সিরিয়াল`,
    `${cleanName} serial`,
    `${cleanName} chamber`,
    `${cleanName} feni`,
    `${cleanName} visiting time`,
    `${cleanSpec} ডাক্তার ফেনী`,
    `ফেনীতে ${cleanSpec} বিশেষজ্ঞ`,
    "ফেনী ডাক্তার সিরিয়াল নাম্বার",
    "feni doctor serial number",
    "feni specialist doctors",
    "ফেনী ডাক্তার",
    "ফেনীর বিশেষজ্ঞ ডাক্তার",
    "Health Club doctor directory",
  ];

  if (doc.nameEn && doc.nameEn.trim()) {
    const cleanNameEn = doc.nameEn.trim();
    keywords.push(
      cleanNameEn,
      `${cleanNameEn} Feni`,
      `${cleanNameEn} doctor`,
      `${cleanNameEn} serial`,
      `${cleanNameEn} appointment`,
      `${cleanNameEn} chamber`,
      `${cleanNameEn} visiting time`
    );
    if (chamber) {
      keywords.push(`${cleanNameEn} ${chamber}`);
    }
  }

  if (doc.department) {
    keywords.push(doc.department);
  }

  if (chamber) {
    keywords.push(chamber);
    keywords.push(`${chamber} ডাক্তার সিরিয়াল`);
    keywords.push(`${chamber} Feni`);
  }

  // High-converting long-tail symptom & disease keywords
  const symptoms = getDoctorSymptomKeywords(doc);
  for (const symptom of symptoms) {
    keywords.push(
      symptom,
      `${symptom} ডাক্তার ফেনী`,
      `${symptom} বিশেষজ্ঞ ফেনী`,
      `ফেনীতে ${symptom} ডাক্তার`
    );
  }

  return Array.from(new Set(keywords));
}

export {
  generateDoctorQuickSummary,
  generateDoctorProfileFaqs,
} from "./doctorFaqData";
export type { DoctorFaqItem } from "./doctorFaqData";

