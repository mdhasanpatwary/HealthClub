import { BlogPost, BlogClinicalSource } from "@/types/blog";
import { getBlogDoctorDepartment } from "@/data/blog/departmentBlogMapping";

export const DGHS_GENERAL_GUIDELINE: BlogClinicalSource = {
  titleBn: "জাতীয় চিকিৎসা নির্দেশিকা ও স্ট্যান্ডার্ড ক্লিনিক্যাল প্রটোকল",
  titleEn: "DGHS National Guidelines for Clinical Management & Referral",
  organization: "স্বাস্থ্য অধিদপ্তর (DGHS), স্বাস্থ্য ও পরিবার কল্যাণ মন্ত্রণালয়",
  url: "https://dghs.gov.bd/",
  yearOrEdition: "২০২৪-২০২৬ সংস্করণ",
  type: "guideline",
  descriptionBn: "রোগী ব্যবস্থাপনা, নিরাপদ ওপিডি সেবা এবং সেকেন্ডারি ও টারশিয়ারি কেয়ারে উপযুক্ত রেফারেল নির্দেশিকা।",
};

export const BMDC_PRACTICE_STANDARDS: BlogClinicalSource = {
  titleBn: "বিএমডিসি চিকিৎসা নৈতিকতা ও প্র্যাকটিস স্ট্যান্ডার্ডস",
  titleEn: "BMDC Code of Medical Ethics & Clinical Practice Standards",
  organization: "বাংলাদেশ মেডিকেল অ্যান্ড ডেন্টাল কাউন্সিল (BMDC)",
  url: "https://bmdc.org.bd/",
  yearOrEdition: "২০২৪ সংস্করণ",
  type: "regulatory",
  descriptionBn: "নিবন্ধিত চিকিৎসকদের পেশাগত যোগ্যতা, দায়িত্বশীল প্রেসক্রিপশন এবং রোগীর অধিকার ও সম্মতির আইনগত নীতিমালা।",
};

export const WHO_SEARO_PROTOCOLS: BlogClinicalSource = {
  titleBn: "হু (WHO) দক্ষিণ-পূর্ব এশিয়া ক্লিনিক্যাল কেয়ার প্রটোকল",
  titleEn: "WHO South-East Asia Region Clinical Management Guidelines",
  organization: "World Health Organization (WHO)",
  url: "https://www.who.int/southeastasia",
  yearOrEdition: "২০২৫-২০২৬ নির্দেশিকা",
  type: "protocol",
  descriptionBn: "ডায়াগনস্টিক পরীক্ষার নির্ভুলতা, অ্যান্টিমাইক্রোবিয়াল স্টিওয়ার্ডশিপ ও আন্তর্জাতিক রোগী নিরাপত্তা মানদণ্ড।",
};

const DEPARTMENT_CLINICAL_SOURCES: Record<string, BlogClinicalSource> = {
  nephrology: {
    titleBn: "কেডিআইজিও (KDIGO) ক্লিনিক্যাল গাইডলাইন ও জাতীয় ডায়ালাইসিস প্রটোকল",
    titleEn: "KDIGO Clinical Practice Guidelines for Kidney Diseases & Hemodialysis",
    organization: "KDIGO & বাংলাদেশ রেনাল অ্যাসোসিয়েশন",
    url: "https://kdigo.org/guidelines/",
    yearOrEdition: "২০২৪-২০২৬ গাইডলাইন",
    type: "guideline",
    descriptionBn: "ক্রনিক কিডনি ডিজিজ (CKD) স্টেজ মূল্যায়ন, ডায়ালাইসিস ডোজ ও ভাস্কুলার অ্যাক্সেস রক্ষণাবেক্ষণ স্ট্যান্ডার্ড।",
  },
  cardiology: {
    titleBn: "জাতীয় হৃদরোগ ইনস্টিটিউট ও আমেরিকান কলেজ অব কার্ডিওলজি (ACC) প্রটোকল",
    titleEn: "ACC/AHA Clinical Practice Guidelines & National Heart Foundation Protocol",
    organization: "National Heart Foundation of Bangladesh & ACC",
    url: "https://nhf.org.bd/",
    yearOrEdition: "২০২৪-২০২৬ প্রটোকল",
    type: "guideline",
    descriptionBn: "হৃদরোগ, একিউট করোনারি সিনড্রোম, ইকোকার্ডিওগ্রাফি ও উচ্চ রক্তচাপ ব্যবস্থাপনা নির্দেশিকা।",
  },
  diabetes: {
    titleBn: "বারডেম (BIRDEM) ও বাংলাদেশ ডায়াবেটিক সমিতি ক্লিনিক্যাল কেয়ার ম্যানুয়াল",
    titleEn: "BIRDEM & Diabetic Association of Bangladesh (BADAS) Clinical Protocol",
    organization: "Diabetic Association of Bangladesh (BADAS) & ADA",
    url: "https://www.dab-bd.org/",
    yearOrEdition: "২০২৪-২০২৬ ম্যানুয়াল",
    type: "textbook",
    descriptionBn: "ডায়াবেটিস নিয়ন্ত্রণ, HbA1c লক্ষ্যমাত্রা, ইনসুলিন থেরাপি ও ডায়াবেটিক রেটিনোপ্যাথি স্ক্রিনিং প্রটোকল।",
  },
  surgery: {
    titleBn: "হু সার্জিক্যাল সেফটি চেকলিস্ট ও বিসিপিএস সার্জারি প্রটোকল",
    titleEn: "WHO Surgical Safety Checklist & BCPS Clinical Surgery Standards",
    organization: "World Health Organization (WHO) & BCPS",
    url: "https://www.who.int/teams/integrated-health-services/patient-safety/research/safe-surgery",
    yearOrEdition: "সার্জিক্যাল সেফটি স্ট্যান্ডার্ড",
    type: "protocol",
    descriptionBn: "অপারেশন থিয়েটারে সংক্রমণ প্রতিরোধ, প্রি-অপারেটিভ মূল্যায়ন ও রোগীর অস্ত্রোপচার নিরাপত্তা বিধিমালা।",
  },
  orthopedics: {
    titleBn: "নিটোর (NITOR) ট্রমা প্রটোকল ও এও ট্রমা (AO Trauma) প্রিন্সিপালস",
    titleEn: "NITOR Trauma Clinical Protocol & AO Principles of Fracture Management",
    organization: "National Institute of Traumatology and Orthopaedic Rehabilitation (NITOR)",
    url: "http://nitorbd.gov.bd/",
    yearOrEdition: "অর্থোপেডিক ট্রমা গাইডলাইন",
    type: "textbook",
    descriptionBn: "হাড়ভাঙা নিরাময়, অর্থোপেডিক ইমপ্লান্ট স্ট্যান্ডার্ড ও পোস্ট-ট্রমাটিক পুনর্বাসন নির্দেশিকা।",
  },
  gynecology: {
    titleBn: "জাতীয় মাতৃ ও নবজাতক স্বাস্থ্য নির্দেশিকা এবং ফিকো (FIGO) প্রটোকল",
    titleEn: "DGHS National Maternal & Neonatal Health Guidelines & FIGO Standards",
    organization: "স্বাস্থ্য অধিদপ্তর (DGHS) & OGSB",
    url: "https://dghs.gov.bd/",
    yearOrEdition: "২০২৪-২০২৬ সংস্করণ",
    type: "guideline",
    descriptionBn: "নিরাপদ প্রসব, এন্টিনেটাল কেয়ার (ANC), সিজারিয়ান সেকশনের ক্লিনিক্যাল ইন্ডিকেশন ও নবজাতক যত্ন।",
  },
  pediatrics: {
    titleBn: "আইএমসিআই (IMCI) বাংলাদেশ প্রটোকল ও বিপিএ শিশু স্বাস্থ্য নির্দেশিকা",
    titleEn: "Integrated Management of Childhood Illness (IMCI) Bangladesh & BPA",
    organization: "স্বাস্থ্য অধিদপ্তর (DGHS) & Bangladesh Pediatric Association",
    url: "https://dghs.gov.bd/",
    yearOrEdition: "জাতীয় শিশু স্বাস্থ্য প্রটোকল",
    type: "protocol",
    descriptionBn: "নবজাতক ও শিশুর সংক্রমণ নিয়ন্ত্রণ, পুষ্টি চাহিদা, টিকাদান ও সাধারণ রোগের সমন্বিত চিকিৎসা ব্যবস্থাপনা।",
  },
  dermatology: {
    titleBn: "বাংলাদেশ একাডেমি অব ডার্মাটোলজি (BAD) ক্লিনিক্যাল প্র্যাকটিস গাইডলাইন",
    titleEn: "Bangladesh Academy of Dermatology Clinical Guidelines",
    organization: "Bangladesh Academy of Dermatology (BAD)",
    url: "https://dghs.gov.bd/",
    yearOrEdition: "ডার্মাটোলজি ক্লিনিক্যাল ম্যানুয়াল",
    type: "guideline",
    descriptionBn: "চর্মরোগ, এলার্জি, ক্রনিক স্কিন ডিজিজ ও সেফ লেজার থেরাপির ক্লিনিক্যাল নির্দেশিকা।",
  },
  dental: {
    titleBn: "বাংলাদেশ ডেন্টাল সোসাইটি ও বিএমডিসি ডেন্টাল প্র্যাকটিস কোড",
    titleEn: "Bangladesh Dental Society & BMDC Dental Infection Control & Standards",
    organization: "Bangladesh Dental Society & BMDC",
    url: "https://bmdc.org.bd/",
    yearOrEdition: "ডেন্টাল সেফটি প্রটোকল",
    type: "regulatory",
    descriptionBn: "দাঁতের চিকিৎসা, স্টেরিলাইজেশন প্রটোকল, আরসিটি ও ডেন্টাল ইমপ্লান্ট ইনফেকশন প্রতিরোধ নির্দেশিকা।",
  },
  eye: {
    titleBn: "জাতীয় চক্ষু বিজ্ঞান ইনস্টিটিউট ও ওএসবি (OSB) ক্লিনিক্যাল প্রটোকল",
    titleEn: "National Institute of Ophthalmology & Hospital (NIO&H) & OSB Standards",
    organization: "National Institute of Ophthalmology (NIO&H)",
    url: "http://nioh.gov.bd/",
    yearOrEdition: "জাতীয় চক্ষু সেবা প্রটোকল",
    type: "guideline",
    descriptionBn: "ছানি অপারেশন, গ্লুকোমা স্ক্রিনিং ও আধুনিক রিফ্র্যাক্টিভ ত্রুটি সংশোধনের ক্লিনিক্যাল মানদণ্ড।",
  },
  urology: {
    titleBn: "ইউরোলজিক্যাল সোসাইটি অব বাংলাদেশ (USB) ও ইউরোপীয়ান ইউরোলজি গাইডলাইন",
    titleEn: "Urological Society of Bangladesh (USB) & EAU Guidelines",
    organization: "Urological Society of Bangladesh & EAU",
    url: "https://dghs.gov.bd/",
    yearOrEdition: "ইউরোলজি গাইডলাইন",
    type: "guideline",
    descriptionBn: "কিডনি পাথর, প্রোস্টেট বৃদ্ধি ও মিনিমালি ইনভেসিভ ইউরোলজি সার্জারি প্রটোকল।",
  },
  ent: {
    titleBn: "জাতীয় নাক-কান-গলা ইনস্টিটিউট (National ENT Institute) ক্লিনিক্যাল স্ট্যান্ডার্ড",
    titleEn: "National Institute of ENT Bangladesh Clinical Management Guidelines",
    organization: "National Institute of ENT, Dhaka & DGHS",
    url: "https://dghs.gov.bd/",
    yearOrEdition: "ইএনটি ক্লিনিক্যাল প্রটোকল",
    type: "guideline",
    descriptionBn: "টনসিল সার্জারি, শ্রবণ পরীক্ষা ও এন্ডোস্কোপিক সাইনাস সার্জারির স্ট্যান্ডার্ড নির্দেশিকা।",
  },
  diagnostic: {
    titleBn: "স্বাস্থ্য অধিদপ্তর ক্লিনিক্যাল ল্যাবরেটরি ও রেডিওলজি মান নিয়ন্ত্রণ নীতিমালা",
    titleEn: "DGHS Laboratory Accreditation, Safety & Quality Assurance Guidelines",
    organization: "স্বাস্থ্য অধিদপ্তর (DGHS) ল্যাবরেটরি উইং",
    url: "https://dghs.gov.bd/",
    yearOrEdition: "২০২৪-২০২৬ কোয়ালিটি স্ট্যান্ডার্ড",
    type: "regulatory",
    descriptionBn: "প্যাথলজি ও রেডিওলজিক্যাল ডায়াগনস্টিক পরীক্ষার নির্ভুলতা ও মান নিয়ন্ত্রণের জাতীয় বিধি।",
  },
};

/**
 * Returns structured clinical sources for a given blog post.
 * Prioritizes custom post.clinicalSources, otherwise resolves top authoritative DGHS,
 * BMDC, WHO, and specialty-specific clinical guidelines.
 */
export function getBlogClinicalSources(post: BlogPost): BlogClinicalSource[] {
  if (post.clinicalSources && post.clinicalSources.length > 0) {
    return post.clinicalSources;
  }

  const dept = getBlogDoctorDepartment(post.slug, post.doctorGroups?.[0]?.department);
  const specialtySource = DEPARTMENT_CLINICAL_SOURCES[dept] || DEPARTMENT_CLINICAL_SOURCES.diagnostic;

  return [
    DGHS_GENERAL_GUIDELINE,
    specialtySource,
    BMDC_PRACTICE_STANDARDS,
    WHO_SEARO_PROTOCOLS,
  ];
}
