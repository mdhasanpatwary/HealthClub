import { BlogPost } from "@/types/blog";
import { BEST_ORTHOPEDIC_DOCTORS_IN_FENI } from "./posts/bestOrthopedicDoctorsInFeni";
import { BEST_NEUROLOGISTS_IN_FENI } from "./posts/bestNeurologistsInFeni";
import { BEST_DIABETES_DOCTORS_IN_FENI } from "./posts/bestDiabetesDoctorsInFeni";
import { BEST_PSYCHIATRISTS_IN_FENI } from "./posts/bestPsychiatristsInFeni";
import { BEST_SURGEONS_IN_FENI } from "./posts/bestSurgeonsInFeni";
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
import { FENI_SADAR_HOSPITAL_GUIDE } from "./posts/feniSadarHospitalGuide";
import { FENI_DIABETIC_HOSPITAL_GUIDE } from "./posts/feniDiabeticHospitalGuide";
import { FENI_MEDICAL_TEST_PRICE_LIST } from "./posts/feniMedicalTestPriceList";
import { BEST_PHARMACIES_IN_FENI } from "./posts/bestPharmaciesInFeni";
import { FENI_BLOOD_BANK_AND_DONORS_GUIDE } from "./posts/feniBloodBankAndDonorsGuide";
import { FENI_AMBULANCE_AND_OXYGEN_SERVICE_GUIDE } from "./posts/feniAmbulanceAndOxygenServiceGuide";
import { DAGANBHUIYAN_CHHAGALNAIYA_SONAGAZI_HEALTHCARE_GUIDE } from "./posts/daganbhuiyanChhagalnaiyaSonagaziHealthcareGuide";
import { PARSHURAM_FULGAZI_HEALTHCARE_GUIDE } from "./posts/parshuramFulgaziHealthcareGuide";

export {
  BLOG_CATEGORIES,
  BLOG_FILTER_PILLS,
  type BlogFilterPill,
} from "./blogCategories";

export const BLOG_POSTS: BlogPost[] = [
  PARSHURAM_FULGAZI_HEALTHCARE_GUIDE,
  DAGANBHUIYAN_CHHAGALNAIYA_SONAGAZI_HEALTHCARE_GUIDE,
  FENI_AMBULANCE_AND_OXYGEN_SERVICE_GUIDE,
  FENI_BLOOD_BANK_AND_DONORS_GUIDE,
  BEST_PHARMACIES_IN_FENI,
  BEST_ORTHOPEDIC_DOCTORS_IN_FENI,
  BEST_NEUROLOGISTS_IN_FENI,
  BEST_DIABETES_DOCTORS_IN_FENI,
  BEST_PSYCHIATRISTS_IN_FENI,
  BEST_SURGEONS_IN_FENI,
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
  FENI_SADAR_HOSPITAL_GUIDE,
  FENI_DIABETIC_HOSPITAL_GUIDE,
  FENI_MEDICAL_TEST_PRICE_LIST,
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
