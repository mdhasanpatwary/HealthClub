/**
 * Curated popularity and priority ranking for Health Club blog posts.
 * Articles listed here appear first in the specified order on the Home page,
 * Blog listing page (/blog), category filters, and recommendation modules.
 */
export const FAMOUS_BLOG_SLUGS_ORDER: readonly string[] = [
  // 1-3: Core Platform Flagship Pillars (Featured on Landing / Home Page)
  "best-10-hospitals-in-feni",
  "best-doctors-in-feni",
  "best-diagnostic-centers-in-feni",

  // 4-9: Flagship Medical Price List, Major Public/Specialized Hospitals & Emergency Services
  "feni-medical-test-price-list",
  "feni-sadar-hospital-guide",
  "feni-diabetic-hospital-guide",
  "feni-ambulance-and-oxygen-service-guide",
  "feni-blood-bank-and-donors-guide",
  "feni-health-club-membership-discount-guide",

  // 10-18: Most-Searched Specialist Doctors & Advanced Diagnostic Scans
  "best-medicine-doctor-in-feni",
  "best-gynecologists-in-feni",
  "best-cardiologists-in-feni",
  "best-child-specialists-in-feni",
  "feni-ct-scan-and-mri-test-price-guide",
  "pregnancy-ultrasonography-4d-anomaly-scan-in-feni",
  "full-body-health-checkup-packages-in-feni",
  "best-orthopedic-doctors-in-feni",
  "best-diabetes-doctors-in-feni",

  // 19-27: Critical Procedures, Maternity & Specialized Disciplines
  "feni-normal-delivery-and-cesarean-cost-guide",
  "best-neurologists-in-feni",
  "best-skin-specialists-in-feni",
  "best-eye-specialists-in-feni",
  "best-ent-doctors-in-feni",
  "best-surgeons-in-feni",
  "best-kidney-doctors-in-feni",
  "kidney-stone-laser-treatment-and-urology-guide-feni",
  "laser-piles-fissure-fistula-treatment-cost-in-feni",

  // 28-36: Emergency, Critical Care & Allied Health
  "feni-icu-ccu-nicu-bed-charges-and-facilities-guide",
  "stroke-and-heart-attack-emergency-protocol-feni",
  "best-psychiatrists-in-feni",
  "best-dental-clinics-in-feni",
  "best-physiotherapy-centers-in-feni",
  "24-hour-pharmacy-in-feni",
  "laparoscopic-gallstone-and-hernia-surgery-guide-feni",
  "feni-doctor-serial-appointment-guide",
  "feni-blood-test-cbc-cost-guide",

  // 37-45: Common Pathology & Diagnostic Tests
  "feni-hba1c-diabetes-test-guide",
  "feni-cardiac-ecg-echo-ett-test-guide",
  "feni-endoscopy-colonoscopy-test-cost-guide",
  "feni-x-ray-digital-dr-cost-guide",
  "feni-thyroid-tsh-test-cost-guide",
  "feni-lipid-profile-cholesterol-test-guide",
  "feni-kidney-creatinine-urea-test-guide",
  "feni-liver-function-sgpt-test-guide",
  "feni-urine-re-culture-test-guide",

  // 46-54: Specific Clinical Interventions & Home Care
  "dengue-and-typhoid-test-cost-management-guide-feni",
  "feni-oxygen-cylinder-refill-and-home-rent-guide",
  "home-sample-collection-and-nursing-service-in-feni",
  "feni-cataract-phaco-eye-surgery-cost-guide",
  "feni-appendix-appendectomy-surgery-cost-guide",
  "feni-tonsil-adenoid-surgery-cost-guide",
  "feni-hormone-test-fertility-guide",
  "feni-allergy-asthma-test-guide",
  "feni-biopsy-fnac-tumor-test-guide",

  // 55-63: Specialized Tests & Upazila Healthcare Guides
  "feni-semen-analysis-infertility-test-guide",
  "feni-pap-smear-cervical-cancer-screening-guide",
  "daganbhuiyan-chagalnaiya-sonagazi-healthcare-guide",
  "parshuram-fulgazi-healthcare-guide",
  "daganbhuiyan-patient-guide",
  "chhagalnaiya-patient-guide",
  "sonagazi-patient-guide",
  "parshuram-patient-guide",
  "fulgazi-patient-guide",
];

const FAMOUS_RANK_MAP = new Map<string, number>(
  FAMOUS_BLOG_SLUGS_ORDER.map((slug, idx) => [slug.toLowerCase().trim(), idx])
);

/**
 * Returns the priority rank of a blog slug (0-indexed).
 * If not in the curated list, returns 99999.
 */
export function getBlogFamousRank(slug: string): number {
  return FAMOUS_RANK_MAP.get(slug.toLowerCase().trim()) ?? 99999;
}

/**
 * Sorts any list of blog posts or cards by famous order first,
 * falling back to publishedDate (newest first) for items with identical rank.
 */
export function sortBlogPostsByFamousOrder<T extends { slug: string; publishedDate?: string }>(
  items: T[]
): T[] {
  return [...items].sort((a, b) => {
    const rankA = getBlogFamousRank(a.slug);
    const rankB = getBlogFamousRank(b.slug);
    if (rankA !== rankB) {
      return rankA - rankB;
    }
    const dateA = a.publishedDate ? new Date(a.publishedDate).getTime() : 0;
    const dateB = b.publishedDate ? new Date(b.publishedDate).getTime() : 0;
    return dateB - dateA;
  });
}
