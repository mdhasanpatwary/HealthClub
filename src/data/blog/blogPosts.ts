import { BlogPost, BlogCategory } from "@/types/blog";
import { BEST_ORTHOPEDIC_DOCTORS_IN_FENI } from "./posts/bestOrthopedicDoctorsInFeni";
import { BEST_ENT_DOCTORS_IN_FENI } from "./posts/bestEntDoctorsInFeni";
import { BEST_EYE_SPECIALISTS_IN_FENI } from "./posts/bestEyeSpecialistsInFeni";
import { BEST_SKIN_SPECIALISTS_IN_FENI } from "./posts/bestSkinSpecialistsInFeni";
import { BEST_CHILD_SPECIALISTS_IN_FENI } from "./posts/bestChildSpecialistsInFeni";
import { BEST_KIDNEY_DOCTORS_IN_FENI } from "./posts/bestKidneyDoctorsInFeni";
import { BEST_MEDICINE_DOCTORS_IN_FENI } from "./posts/bestMedicineDoctorsInFeni";
import { BEST_CARDIOLOGISTS_IN_FENI } from "./posts/bestCardiologistsInFeni";
import { BEST_GYNECOLOGISTS_IN_FENI } from "./posts/bestGynecologistsInFeni";
import { BEST_PHYSIOTHERAPY_IN_FENI } from "./posts/bestPhysiotherapyInFeni";
import { BEST_DENTAL_CLINICS_IN_FENI } from "./posts/bestDentalClinicsInFeni";
import { BEST_DIAGNOSTIC_CENTERS_IN_FENI } from "./posts/bestDiagnosticCentersInFeni";
import { BEST_DOCTORS_IN_FENI } from "./posts/bestDoctorsInFeni";
import { BEST_10_HOSPITALS_IN_FENI } from "./posts/best10HospitalsInFeni";

export const BLOG_CATEGORIES: BlogCategory[] = [
  {
    id: "all",
    nameBn: "সকল ব্লগ",
    nameEn: "All Posts",
    descriptionBn: "স্বাস্থ্যসেবা, হাসপাতাল রিভিউ ও জীবনযাত্রার প্রয়োজনীয় সব গাইড",
    descriptionEn: "All healthcare reviews, hospital directories and wellness guides",
  },
  {
    id: "orthopedic-guide",
    nameBn: "অর্থোপেডিক ও ট্রমা কেয়ার গাইড",
    nameEn: "Orthopedics & Trauma Care",
    descriptionBn: "ফেনীর সেরা অর্থোপেডিক ডাক্তার, হাড় ভাঙা ও জোড়া বিশেষজ্ঞ, স্পাইন ও ট্রমা সেন্টার গাইড",
    descriptionEn: "Top orthopedic doctors, trauma surgeons, fracture care, spine and joint specialists in Feni",
  },
  {
    id: "ent-guide",
    nameBn: "ইএনটি ও নাক-কান-গলা কেয়ার গাইড",
    nameEn: "ENT & Head-Neck Care",
    descriptionBn: "ফেনীর সেরা নাক, কান ও গলা বিশেষজ্ঞ ডাক্তার, টনসিল, সাইনাস ও কানের মাইক্রোসার্জারি গাইড",
    descriptionEn: "Top ENT specialists, otolaryngologists, tonsillectomy, sinus and ear microsurgery in Feni",
  },
  {
    id: "ophthalmology-guide",
    nameBn: "চক্ষু সেবা ও হাসপাতাল গাইড",
    nameEn: "Ophthalmology & Eye Care",
    descriptionBn: "ফেনীর সেরা চক্ষু বিশেষজ্ঞ ডাক্তার, আধুনিক ফ্যাকো ছানি অপারেশন, গ্লুকোমা ও দৃষ্টিসেবা গাইড",
    descriptionEn: "Top eye specialists, ophthalmologists, modern Phaco cataract surgery, glaucoma and vision care in Feni",
  },
  {
    id: "dermatology-guide",
    nameBn: "চর্ম ও এলার্জি সেবা গাইড",
    nameEn: "Dermatology & Skin Care",
    descriptionBn: "ফেনীর সেরা চর্ম, এলার্জি ও যৌন রোগ বিশেষজ্ঞ ডাক্তার, লেজার ও স্কিন কেয়ার গাইড",
    descriptionEn: "Top dermatologists, skin & VD specialists, allergy care and dermatosurgery in Feni",
  },
  {
    id: "pediatric-guide",
    nameBn: "শিশু ও নবজাতক সেবা গাইড",
    nameEn: "Pediatrics & Neonatal Care",
    descriptionBn: "ফেনীর সেরা শিশু বিশেষজ্ঞ ডাক্তার, নবজাতক এনআইসিইউ ও টিকাদান গাইড",
    descriptionEn: "Top pediatricians, child specialists, NICU incubator care and vaccination guides in Feni",
  },
  {
    id: "kidney-guide",
    nameBn: "কিডনি ও নেফ্রোলজি গাইড",
    nameEn: "Nephrology & Kidney Care",
    descriptionBn: "ফেনীর সেরা কিডনি বিশেষজ্ঞ ডাক্তার, ডায়ালাইসিস খরচ ও কিডনি পাথর চিকিৎসা গাইড",
    descriptionEn: "Top nephrologists, kidney doctors, dialysis costs and urology surgery in Feni",
  },
  {
    id: "medicine-guide",
    nameBn: "মেডিসিন ও ইন্টারনাল কেয়ার গাইড",
    nameEn: "Medicine & Internal Care",
    descriptionBn: "ফেনীর সেরা মেডিসিন বিশেষজ্ঞ ডাক্তার, দীর্ঘমেয়াদী রোগ ও চেম্বার সিরিয়াল গাইড",
    descriptionEn: "Top medicine specialists, internal care and chamber serial guides in Feni",
  },
  {
    id: "cardiology-guide",
    nameBn: "হৃদরোগ ও কার্ডিওলজি গাইড",
    nameEn: "Cardiology & Heart Care",
    descriptionBn: "ফেনীর সেরা হৃদরোগ বিশেষজ্ঞ ডাক্তার, ইকো/ইটিটি টেস্ট ও সিসিইউ গাইড",
    descriptionEn: "Top cardiologists, heart specialists, echo/ett tests and CCU care guides in Feni",
  },
  {
    id: "gynecology-guide",
    nameBn: "গাইনি ও প্রসূতি সেবা গাইড",
    nameEn: "Gynecology & Maternity Care",
    descriptionBn: "ফেনীর সেরা গাইনি বিশেষজ্ঞ ডাক্তার, স্বাভাবিক প্রসব ও এনআইসিইউ গাইড",
    descriptionEn: "Top gynecologists, obstetricians, normal delivery and NICU guides in Feni",
  },
  {
    id: "physiotherapy-guide",
    nameBn: "ফিজিওথেরাপি ও পুনর্বাসন গাইড",
    nameEn: "Physiotherapy & Rehab Guides",
    descriptionBn: "ফেনীর সেরা ফিজিওথেরাপি সেন্টার, স্ট্রোক রিহ্যাব, পিএলআইডি ও থেরাপি খরচের তথ্য",
    descriptionEn: "Top physiotherapy centers, stroke rehabilitation, PLID and therapy cost guides in Feni",
  },
  {
    id: "dental-guide",
    nameBn: "ডেন্টাল ও দন্ত চিকিৎসা গাইড",
    nameEn: "Dental Care Guides",
    descriptionBn: "ফেনীর সেরা ডেন্টাল ক্লিনিক, দন্ত বিশেষজ্ঞ, রুট ক্যানেল ও চিকিৎসা খরচের তথ্য",
    descriptionEn: "Top dental clinics, dental surgeons, root canal, scaling and implant cost guides in Feni",
  },
  {
    id: "diagnostic-guide",
    nameBn: "ডায়াগনস্টিক ও ল্যাব গাইড",
    nameEn: "Diagnostic Guides",
    descriptionBn: "ফেনীর সেরা ডায়াগনস্টিক সেন্টার, প্যাথলজি ল্যাব, সিটি স্ক্যান ও টেস্ট খরচের তথ্য",
    descriptionEn: "Top diagnostic centers, pathology labs, CT scan and medical test cost guides in Feni",
  },
  {
    id: "doctor-guide",
    nameBn: "ডাক্তার ও চেম্বার গাইড",
    nameEn: "Doctor Guides",
    descriptionBn: "ফেনীর সেরা বিশেষজ্ঞ ডাক্তারদের তালিকা, চেম্বার লোকেশন ও সিরিয়াল তথ্য",
    descriptionEn: "Top specialist doctors, chamber schedules and serial contacts in Feni",
  },
  {
    id: "hospital-guide",
    nameBn: "হাসপাতাল ও ক্লিনিক গাইড",
    nameEn: "Hospital Guides",
    descriptionBn: "ফেনী ও পার্শ্ববর্তী অঞ্চলের সেরা হাসপাতাল, বিশেষজ্ঞ চেম্বার ও ডিসকাউন্ট তথ্য",
    descriptionEn: "Top hospitals, specialist chambers and discount guides in Feni",
  },
  {
    id: "emergency-care",
    nameBn: "জরুরি সেবা ও অ্যাম্বুলেন্স",
    nameEn: "Emergency Care",
    descriptionBn: "জরুরি রক্তদাতা, অ্যাম্বুলেন্স ও তাৎক্ষণিক প্রাথমিক চিকিৎসা সহায়িকা",
    descriptionEn: "Emergency blood donors, ambulance hotlines and first aid guides",
  },
  {
    id: "health-awareness",
    nameBn: "রোগ প্রতিরোধ ও সচেতনতা",
    nameEn: "Health Awareness",
    descriptionBn: "ডায়াবেটিস, হৃদরোগ, মা ও শিশুর পুষ্টি এবং প্রতিরোধমূলক পরামর্শ",
    descriptionEn: "Disease prevention, diabetes, cardiac and maternal health advice",
  },
];

export interface BlogFilterPill {
  id: string;
  nameBn: string;
  nameEn: string;
  matchingCategories?: string[];
  tagKeywords?: string[];
}

export const BLOG_FILTER_PILLS: BlogFilterPill[] = [
  {
    id: "all",
    nameBn: "সকল ব্লগ",
    nameEn: "All Posts",
  },
  {
    id: "doctor-list",
    nameBn: "ডাক্তার তালিকা",
    nameEn: "Doctor Guides",
    matchingCategories: [
      "doctor-guide",
      "orthopedic-guide",
      "ent-guide",
      "ophthalmology-guide",
      "dermatology-guide",
      "pediatric-guide",
      "medicine-guide",
      "cardiology-guide",
      "gynecology-guide",
      "kidney-guide",
    ],
  },
  {
    id: "diagnostic",
    nameBn: "ডায়াগনস্টিক",
    nameEn: "Diagnostics",
    matchingCategories: ["diagnostic-guide"],
  },
  {
    id: "dental-physio",
    nameBn: "ডেন্টাল ও ফিজিও",
    nameEn: "Dental & Physio",
    matchingCategories: ["dental-guide", "physiotherapy-guide"],
  },
  {
    id: "specialized-care",
    nameBn: "বিশেষায়িত চিকিৎসা",
    nameEn: "Specialized Care",
    matchingCategories: [
      "orthopedic-guide",
      "ent-guide",
      "ophthalmology-guide",
      "dermatology-guide",
      "pediatric-guide",
      "cardiology-guide",
      "gynecology-guide",
      "kidney-guide",
      "physiotherapy-guide",
    ],
  },
  {
    id: "hospital-guide",
    nameBn: "হাসপাতাল গাইড",
    nameEn: "Hospitals",
    matchingCategories: ["hospital-guide"],
  },
];

export const BLOG_POSTS: BlogPost[] = [
  BEST_ORTHOPEDIC_DOCTORS_IN_FENI,
  BEST_ENT_DOCTORS_IN_FENI,
  BEST_EYE_SPECIALISTS_IN_FENI,
  BEST_SKIN_SPECIALISTS_IN_FENI,
  BEST_CHILD_SPECIALISTS_IN_FENI,
  BEST_KIDNEY_DOCTORS_IN_FENI,
  BEST_MEDICINE_DOCTORS_IN_FENI,
  BEST_CARDIOLOGISTS_IN_FENI,
  BEST_GYNECOLOGISTS_IN_FENI,
  BEST_PHYSIOTHERAPY_IN_FENI,
  BEST_DENTAL_CLINICS_IN_FENI,
  BEST_DIAGNOSTIC_CENTERS_IN_FENI,
  BEST_DOCTORS_IN_FENI,
  BEST_10_HOSPITALS_IN_FENI,
];

export function getAllBlogPosts(): BlogPost[] {
  return BLOG_POSTS;
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  const normalized = decodeURIComponent(slug).toLowerCase().trim();
  return BLOG_POSTS.find(
    (post) => post.slug.toLowerCase() === normalized
  );
}

export function getRelatedBlogPosts(currentSlug: string, limit = 3): BlogPost[] {
  const current = getBlogPostBySlug(currentSlug);
  if (!current) return [];

  // If curated relatedSlugs exist, prioritize them
  if (current.relatedSlugs && current.relatedSlugs.length > 0) {
    const curated = current.relatedSlugs
      .map((slug) => getBlogPostBySlug(slug))
      .filter((post): post is BlogPost => !!post && post.slug !== current.slug);

    if (curated.length >= limit) {
      return curated.slice(0, limit);
    }

    const remaining = BLOG_POSTS.filter(
      (post) => post.slug !== current.slug && !curated.some((c) => c.slug === post.slug)
    );
    return [...curated, ...remaining].slice(0, limit);
  }

  return BLOG_POSTS.filter((post) => post.slug !== current.slug).slice(0, limit);
}
