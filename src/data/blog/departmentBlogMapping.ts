export interface DepartmentPillarGuide {
  slug: string;
  titleBn: string;
  subtitleBn: string;
  badgeBn: string;
  readTimeBn: string;
  department: string;
}

/**
 * Mapping from doctor department IDs to high-authority blog pillar guides.
 * Used on doctor profile pages for contextual internal linking.
 */
export const DEPARTMENT_PILLAR_MAP: Record<string, DepartmentPillarGuide> = {
  medicine: {
    slug: "best-medicine-doctors-in-feni",
    titleBn: "ফেনীর সেরা মেডিসিন ডাক্তার তালিকা ও চেম্বার গাইড ২০২৬",
    subtitleBn: "জ্বর, ডায়াবেটিস, প্রেশার ও সাধারণ মেডিসিন বিশেষজ্ঞদের চেম্বার ও সিরিয়াল হটলাইন।",
    badgeBn: "মেডিসিন স্পেশাল গাইড",
    readTimeBn: "৭ মিনিট",
    department: "medicine",
  },
  cardiology: {
    slug: "best-cardiologists-in-feni",
    titleBn: "ফেনীর সেরা কার্ডিওলজিস্ট ও হৃদরোগ বিশেষজ্ঞ গাইড ২০২৬",
    subtitleBn: "বুকে ব্যথা, হার্ট অ্যাটাক প্রতিরোধ ও ইকো-ইসিজি পরীক্ষার সেরা কার্ডিওলজি সেন্টার।",
    badgeBn: "হৃদরোগ স্পেশাল গাইড",
    readTimeBn: "৮ মিনিট",
    department: "cardiology",
  },
  gynecology: {
    slug: "best-gynecologists-in-feni",
    titleBn: "ফেনীর সেরা গাইনি ও প্রসূতিরোগ বিশেষজ্ঞ গাইড ২০২৬",
    subtitleBn: "গর্ভকালীন সেবা, নরমাল ডেলিভারি ও সিজারিয়ান প্রসিডিউর সংক্রান্ত পূর্ণাঙ্গ নির্দেশিকা।",
    badgeBn: "গাইনি ও প্রসূতি গাইড",
    readTimeBn: "৮ মিনিট",
    department: "gynecology",
  },
  pediatrics: {
    slug: "best-child-specialists-in-feni",
    titleBn: "ফেনীর সেরা শিশু ও নবজাতক রোগ বিশেষজ্ঞ গাইড ২০২৬",
    subtitleBn: "শিশুর নিউমোনিয়া, টিকাদান, বৃদ্ধি ও পুষ্টি পরামর্শের নির্ভরযোগ্য ডাক্তার তালিকা।",
    badgeBn: "শিশু ও নবজাতক গাইড",
    readTimeBn: "৭ মিনিট",
    department: "pediatrics",
  },
  orthopedics: {
    slug: "best-orthopedic-doctors-in-feni",
    titleBn: "ফেনীর সেরা অর্থোপেডিক ও হাড়-জোড়া বিশেষজ্ঞ গাইড ২০২৬",
    subtitleBn: "হাড় ভাঙা, ট্রমা সার্জারি, স্পাইন ও জয়েন্ট ব্যথার বিশেষজ্ঞ ডাক্তারদের চেম্বার শিডিউল।",
    badgeBn: "অর্থোপেডিক গাইড",
    readTimeBn: "৮ মিনিট",
    department: "orthopedics",
  },
  dermatology: {
    slug: "best-skin-specialists-in-feni",
    titleBn: "ফেনীর সেরা চর্ম, এলার্জি ও যৌনরোগ বিশেষজ্ঞ গাইড ২০২৬",
    subtitleBn: "ব্রণ, একজিমা, চুল পড়া ও স্কিন লেজার ট্রিটমেন্টের অভিজ্ঞ চিকিৎসকদের চেম্বার তালিকা।",
    badgeBn: "চর্ম ও স্কিন গাইড",
    readTimeBn: "৬ মিনিট",
    department: "dermatology",
  },
  eye: {
    slug: "best-eye-specialists-in-feni",
    titleBn: "ফেনীর সেরা চক্ষু বিশেষজ্ঞ ও চক্ষু হাসপাতাল গাইড ২০২৬",
    subtitleBn: "ছানি অপারেশন, গ্লুকোমা ও আধুনিক ফ্যাকো সার্জারির সেরা চক্ষু চিকিৎসকদের নির্দেশিকা।",
    badgeBn: "চক্ষুরোগ গাইড",
    readTimeBn: "৭ মিনিট",
    department: "eye",
  },
  ent: {
    slug: "best-ent-doctors-in-feni",
    titleBn: "ফেনীর সেরা নাক, কান ও গলা (ENT) বিশেষজ্ঞ গাইড ২০২৬",
    subtitleBn: "কানের পর্দা ফুটো, টনসিল অপারেশন ও সাইনোসাইটিসের অভিজ্ঞ চিকিৎসকদের চেম্বার গাইড।",
    badgeBn: "ইএনটি কেয়ার গাইড",
    readTimeBn: "৬ মিনিট",
    department: "ent",
  },
  diabetes: {
    slug: "best-diabetes-doctors-in-feni",
    titleBn: "ফেনীর সেরা ডায়াবেটিস ও হরমোন বিশেষজ্ঞ গাইড ২০২৬",
    subtitleBn: "রক্তে সুগার নিয়ন্ত্রণ, ইনসুলিন গাইড ও থাইরয়েড চিকিৎসার বিশ্বস্ত বিশেষজ্ঞ তালিকা।",
    badgeBn: "ডায়াবেটিস ও হরমোন গাইড",
    readTimeBn: "৭ মিনিট",
    department: "diabetes",
  },
  psychiatry: {
    slug: "best-psychiatrists-in-feni",
    titleBn: "ফেনীর সেরা মানসিক রোগ ও সাইকিয়াট্রি বিশেষজ্ঞ গাইড ২০২৬",
    subtitleBn: "বিষণ্নতা, অনিদ্রা, ফোবিয়া ও সাইকোথেরাপির অভিজ্ঞ মানসিক চিকিৎসকদের পূর্ণাঙ্গ তথ্য।",
    badgeBn: "মানসিক স্বাস্থ্য গাইড",
    readTimeBn: "৭ মিনিট",
    department: "psychiatry",
  },
  nephrology: {
    slug: "best-kidney-doctors-in-feni",
    titleBn: "ফেনীর সেরা কিডনি রোগ বিশেষজ্ঞ ও ডায়ালাইসিস গাইড ২০২৬",
    subtitleBn: "কিডনি ইনফেকশন, ডায়ালাইসিস ও ইউরোলজি চিকিৎসার সেরা ডাক্তার ও সেন্টার গাইড।",
    badgeBn: "কিডনি রোগ গাইড",
    readTimeBn: "৭ মিনিট",
    department: "nephrology",
  },
  surgery: {
    slug: "best-surgeons-in-feni",
    titleBn: "ফেনীর সেরা জেনারেল ও ল্যাপারোস্কপিক সার্জন গাইড ২০২৬",
    subtitleBn: "পিত্তথলির পাথর, হার্নিয়া, অ্যাপেন্ডিক্স ও লেজার সার্জারির সেরা শল্য চিকিৎসকদের তথ্য।",
    badgeBn: "সার্জারি গাইড",
    readTimeBn: "৮ মিনিট",
    department: "surgery",
  },
  neurology: {
    slug: "best-neurologists-in-feni",
    titleBn: "ফেনীর সেরা নিউরোলজিস্ট ও স্ট্রোক বিশেষজ্ঞ গাইড ২০২৬",
    subtitleBn: "স্ট্রোক, প্যারালাইসিস, মাইগ্রেন ও নার্ভের জটিল রোগের বিশ্বস্ত নিউরো চিকিৎসকদের তালিকা।",
    badgeBn: "নিউরোমেডিসিন গাইড",
    readTimeBn: "৭ মিনিট",
    department: "neurology",
  },
  dental: {
    slug: "best-dental-clinics-in-feni",
    titleBn: "ফেনীর সেরা ডেন্টাল ক্লিনিক ও অভিজ্ঞ দন্ত বিশেষজ্ঞ গাইড ২০২৬",
    subtitleBn: "রুট ক্যানেল, স্কেলিং ও আধুনিক অর্থোডন্টিক চিকিৎসার সেরা ডেন্টাল ডাক্তারদের চেম্বার।",
    badgeBn: "ডেন্টাল গাইড",
    readTimeBn: "৬ মিনিট",
    department: "dental",
  },
  hepatology: {
    slug: "best-medicine-doctors-in-feni",
    titleBn: "ফেনীর সেরা লিভার ও গ্যাস্ট্রোএন্টারোলজি বিশেষজ্ঞ গাইড",
    subtitleBn: "জন্ডিস, ফ্যাটি লিভার ও হেপাটাইটিস চিকিৎসার অভিজ্ঞ চিকিৎসকদের চেম্বার শিডিউল।",
    badgeBn: "লিভার ও পরিপাকতন্ত্র",
    readTimeBn: "৭ মিনিট",
    department: "medicine",
  },
  rheumatology: {
    slug: "best-orthopedic-doctors-in-feni",
    titleBn: "ফেনীর সেরা বাত-ব্যথা, রিউমাটোলজি ও হাড় বিশেষজ্ঞ গাইড",
    subtitleBn: "আর্থ্রাইটিস, গাউট ও দীর্ঘমেয়াদী অস্থিসন্ধির ব্যথার আধুনিক চিকিৎসা নির্দেশিকা।",
    badgeBn: "বাত-ব্যথা গাইড",
    readTimeBn: "৭ মিনিট",
    department: "orthopedics",
  },
  nutrition: {
    slug: "best-diabetes-doctors-in-feni",
    titleBn: "ফেনীর সেরা ডায়াবেটিস ও পুষ্টি সচেতনতা গাইড ২০২৬",
    subtitleBn: "স্বাস্থ্যকর খাদ্যাভ্যাস, ডায়েট চার্ট ও পুষ্টিবিদদের প্রয়োজনীয় পরামর্শ।",
    badgeBn: "পুষ্টি ও লাইফস্টাইল",
    readTimeBn: "৬ মিনিট",
    department: "diabetes",
  },
};

const DEFAULT_PILLAR_GUIDE: DepartmentPillarGuide = {
  slug: "best-doctors-in-feni",
  titleBn: "ফেনীর সেরা বিশেষজ্ঞ ডাক্তারদের চেম্বার ও সিরিয়াল গাইড ২০২৬",
  subtitleBn: "ফেনী সদর ও উপজেলা রোগীদের জন্য অভিজ্ঞ বিশেষজ্ঞ চিকিৎসকদের চেম্বার ও শিডিউল।",
  badgeBn: "বিশেষজ্ঞ ডাক্তার ডিরেক্টরি",
  readTimeBn: "১০ মিনিট",
  department: "medicine",
};

/**
 * Get contextual blog pillar guide for any doctor based on department or specialty.
 */
export function getDepartmentPillarPost(department?: string): DepartmentPillarGuide {
  if (!department) return DEFAULT_PILLAR_GUIDE;
  const normalized = department.trim().toLowerCase();
  return DEPARTMENT_PILLAR_MAP[normalized] || DEFAULT_PILLAR_GUIDE;
}

/**
 * Mapping from blog post slug to the primary medical department for live doctor roster.
 */
export const BLOG_SLUG_TO_DEPARTMENT_MAP: Record<string, string> = {
  "best-orthopedic-doctors-in-feni": "orthopedics",
  "best-cardiologists-in-feni": "cardiology",
  "best-gynecologists-in-feni": "gynecology",
  "best-child-specialists-in-feni": "pediatrics",
  "best-neurologists-in-feni": "neurology",
  "best-diabetes-doctors-in-feni": "diabetes",
  "best-psychiatrists-in-feni": "psychiatry",
  "best-surgeons-in-feni": "surgery",
  "best-ent-doctors-in-feni": "ent",
  "best-eye-specialists-in-feni": "eye",
  "best-skin-specialists-in-feni": "dermatology",
  "best-kidney-doctors-in-feni": "nephrology",
  "best-medicine-doctors-in-feni": "medicine",
  "best-dental-clinics-in-feni": "dental",
  "best-physiotherapy-in-feni": "orthopedics",
  "feni-cardiac-ecg-echo-ett-test-guide": "cardiology",
  "feni-stroke-cardiac-guide": "cardiology",
  "feni-endoscopy-colonoscopy-test-cost-guide": "surgery",
  "feni-normal-delivery-and-cesarean-cost-guide": "gynecology",
  "feni-laser-piles-fistula-guide": "surgery",
  "feni-laparoscopic-gallstone-hernia-guide": "surgery",
  "feni-kidney-stone-urology-guide": "nephrology",
  "feni-pregnancy-ultrasonography-guide": "gynecology",
  "feni-diabetic-hospital-guide": "diabetes",
  "feni-sadar-hospital-guide": "medicine",
  "feni-icu-ccu-nicu-guide": "pediatrics",
  "feni-full-body-health-checkup-guide": "medicine",
  "feni-ct-scan-and-mri-test-price-guide": "neurology",
  "feni-dengue-typhoid-guide": "medicine",
  "feni-medical-test-price-list": "medicine",
  "feni-doctor-serial-appointment-guide": "medicine",
  "best-doctors-in-feni": "medicine",
  "best-10-hospitals-in-feni": "medicine",
  "daganbhuiyan-patient-guide": "medicine",
  "chhagalnaiya-patient-guide": "medicine",
  "sonagazi-patient-guide": "medicine",
  "parshuram-patient-guide": "medicine",
  "fulgazi-patient-guide": "medicine",
  "daganbhuiyan-chhagalnaiya-sonagazi-healthcare-guide": "medicine",
  "parshuram-fulgazi-healthcare-guide": "medicine",
  "feni-health-club-membership-discount-guide": "medicine",
  "feni-blood-test-cbc-cost-guide": "medicine",
  "feni-lipid-profile-cholesterol-test-guide": "cardiology",
  "feni-thyroid-tsh-test-cost-guide": "diabetes",
  "feni-hba1c-diabetes-test-guide": "diabetes",
  "feni-liver-function-sgpt-test-guide": "medicine",
  "feni-kidney-creatinine-urea-test-guide": "nephrology",
  "feni-urine-re-culture-test-guide": "nephrology",
  "feni-x-ray-digital-dr-cost-guide": "orthopedics",
  "feni-hormone-test-fertility-guide": "gynecology",
  "feni-pap-smear-cervical-cancer-screening-guide": "gynecology",
  "feni-allergy-asthma-test-guide": "medicine",
  "feni-semen-analysis-infertility-test-guide": "nephrology",
  "feni-biopsy-fnac-tumor-test-guide": "surgery",
  "feni-cataract-phaco-eye-surgery-cost-guide": "eye",
  "feni-tonsil-adenoid-surgery-cost-guide": "ent",
  "feni-appendix-appendectomy-surgery-cost-guide": "surgery",
  "feni-dialysis-kidney-hemodialysis-guide": "nephrology",
  "feni-orthopedic-fracture-bone-surgery-cost-guide": "orthopedics",
  "feni-root-canal-cap-dental-braces-cost-guide": "dental",
  "best-dental-specialists-in-feni": "dental",
  "feni-hydrocele-varicocele-surgery-cost-guide": "surgery",
  "feni-hysterectomy-uterus-removal-surgery-guide": "gynecology",
  "feni-skin-laser-wart-mole-removal-cost-guide": "dermatology",
  "feni-circumcision-khatna-cost-guide": "pediatrics",
  "feni-back-pain-spine-slip-disc-treatment-guide": "orthopedics",
  "feni-knee-pain-osteoarthritis-treatment-guide": "orthopedics",
  "feni-headache-migraine-treatment-guide": "neurology",
  "feni-gastric-ulcer-acidity-treatment-guide": "medicine",
  "feni-hair-fall-prp-treatment-guide": "dermatology",
  "feni-infertility-treatment-ivf-iui-guide": "gynecology",
  "feni-pediatric-child-fever-convulsion-emergency-guide": "pediatrics",
  "feni-vertigo-dizziness-imbalance-treatment-guide": "ent",
  "feni-allergy-skin-rash-eczema-treatment-guide": "dermatology",
  "feni-thyroid-swelling-goiter-treatment-guide": "diabetes",
  "feni-depression-anxiety-mental-health-counseling-guide": "psychiatry",
  "feni-burn-injury-emergency-first-aid-hospital-guide": "surgery",
  "feni-dog-bite-rabies-vaccine-guide": "medicine",
  "feni-snake-bite-antivenom-emergency-guide": "medicine",
  "feni-hypertension-high-blood-pressure-control-guide": "cardiology",
  "feni-maternal-and-child-welfare-centre-matri-sadan-guide": "gynecology",
  "feni-chest-disease-tb-hospital-guide": "medicine",
  "feni-trauma-center-emergency-highway-accident-guide": "orthopedics",
  "feni-epi-child-vaccination-schedule-centers-guide": "pediatrics",
  "feni-4d-anomaly-scan-pregnancy-ultrasound-guide": "gynecology",
  "feni-eeg-brain-test-cost-guide": "neurology",
  "feni-bone-mineral-density-bmd-test-guide": "orthopedics",
  "feni-mammography-breast-cancer-screening-guide": "gynecology",
  "feni-echocardiogram-color-doppler-heart-test-guide": "cardiology",
  "feni-hospital-road-ss-k-road-chamber-hub-guide": "medicine",
  "feni-trunk-road-mizan-road-clinic-pharmacy-hub-guide": "medicine",
  "feni-friday-weekend-doctor-chamber-serial-guide": "medicine",
  "feni-female-gynecologist-doctor-chamber-list": "gynecology",
  "feni-evening-doctor-chambers-after-5pm-guide": "medicine",
  "feni-hearing-aid-audiometry-hearing-test-guide": "ent",
};

/**
 * Resolves the primary department for a blog post slug.
 */
export function getBlogDoctorDepartment(slug: string, fallbackDept?: string): string {
  if (BLOG_SLUG_TO_DEPARTMENT_MAP[slug]) {
    return BLOG_SLUG_TO_DEPARTMENT_MAP[slug];
  }
  if (fallbackDept) {
    return fallbackDept;
  }
  return "medicine";
}
