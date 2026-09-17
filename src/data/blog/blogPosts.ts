import { BlogPost, BlogCategory } from "@/types/blog";
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

export const BLOG_POSTS: BlogPost[] = [
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

  return BLOG_POSTS.filter((post) => post.slug !== current.slug).slice(0, limit);
}
