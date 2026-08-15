import { EMERGENCY_HEALTH_TIPS } from "./health-tips/emergencyTips";
import { CHRONIC_CARE_HEALTH_TIPS } from "./health-tips/chronicCareTips";
import { WELLNESS_HEALTH_TIPS } from "./health-tips/wellnessTips";
import { SPECIALIZED_CARE_HEALTH_TIPS } from "./health-tips/specializedCareTips";
import { CLINICAL_WELLNESS_HEALTH_TIPS } from "./health-tips/clinicalWellnessTips";

export type HealthCategoryType =
  | "general"
  | "diabetes"
  | "cardiology"
  | "emergency"
  | "nutrition"
  | "pediatrics"
  | "maternal"
  | "lifestyle";

export interface HealthTipArticle {
  slug: string;
  titleBn: string;
  titleEn: string;
  excerptBn: string;
  excerptEn: string;
  category: HealthCategoryType;
  categoryNameBn: string;
  categoryNameEn: string;
  readTimeBn: string;
  readTimeEn: string;
  publishedDate: string;
  authorBn: string;
  authorEn: string;
  keyTakeawaysBn: string[];
  keyTakeawaysEn: string[];
  contentBn: string[];
  contentEn: string[];
  relatedSpecialty: string;
}

export const HEALTH_CATEGORIES = [
  { id: "all", nameBn: "সব বিষয়", nameEn: "All Topics" },
  { id: "emergency", nameBn: "জরুরি ও ফার্স্ট এইড", nameEn: "Emergency & First Aid" },
  { id: "general", nameBn: "সাধারণ স্বাস্থ্য", nameEn: "General Health" },
  { id: "diabetes", nameBn: "ডায়াবেটিস ও হরমোন", nameEn: "Diabetes Care" },
  { id: "cardiology", nameBn: "হৃদরোগ ও রক্তচাপ", nameEn: "Cardiology & BP" },
  { id: "pediatrics", nameBn: "শিশু স্বাস্থ্য", nameEn: "Child Health" },
  { id: "maternal", nameBn: "নারী ও মাতৃত্ব", nameEn: "Maternal & Women" },
  { id: "lifestyle", nameBn: "লাইফস্টাইল ও ফিটনেস", nameEn: "Lifestyle & Fitness" },
  { id: "nutrition", nameBn: "পুষ্টি ও ডায়েট", nameEn: "Nutrition & Diet" },
] as const;

export const HEALTH_TIPS_ARTICLES: HealthTipArticle[] = [
  ...EMERGENCY_HEALTH_TIPS,
  ...CHRONIC_CARE_HEALTH_TIPS,
  ...WELLNESS_HEALTH_TIPS,
  ...SPECIALIZED_CARE_HEALTH_TIPS,
  ...CLINICAL_WELLNESS_HEALTH_TIPS,
];
