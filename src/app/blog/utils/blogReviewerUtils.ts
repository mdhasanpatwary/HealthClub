import { BlogPost, BlogReviewer } from "@/types/blog";
import { formatArticleDate } from "@/lib/dateUtils";
import { DOCTOR_SLUG_ALIASES } from "@/data/doctorSlugAliases";

/**
 * Health Club Medical Editorial & Research Desk.
 * Default institutional reviewer for medical guides, test price comparisons, and hospital directories.
 * Ensures zero unauthorized doctor attribution while maintaining high clinical accuracy and E-E-A-T transparency.
 */
export const EDITORIAL_REVIEWER: BlogReviewer = {
  doctorNameBn: "হেলথ ক্লাব মেডিকেল এডিটোরিয়াল ডেস্ক",
  doctorNameEn: "Health Club Medical Editorial Desk",
  degreesBn: "মেডিকেল কনটেন্ট, ডায়াগনস্টিক তথ্য ও স্বাস্থ্যসেবা যাচাইকরণ টিম",
  specialtyBn: "স্বাস্থ্যসেবা তথ্য সংকলন ও এডিটোরিয়াল রিভিউ",
  reviewDateBn: "",
  profileSlug: undefined,
};

/**
 * Normalizes any profileSlug to ensure it is canonical and free of route prefixes.
 */
function normalizeReviewerProfileSlug(rawSlug?: string): string | undefined {
  if (!rawSlug) return undefined;
  const stripped = rawSlug.trim().replace(/^\/?(consultants\/)?/, "").replace(/^\//, "");
  if (!stripped) return undefined;
  return DOCTOR_SLUG_ALIASES[stripped.toLowerCase()] || stripped;
}

/**
 * Resolves the authoritative reviewer for a blog post.
 * If a blog post has an explicit, verified doctor reviewer assigned in the database,
 * it returns that doctor's credentials.
 * Otherwise, defaults to the Health Club Medical Editorial Desk to prevent
 * unauthorized doctor endorsements.
 */
export function resolveBlogReviewer(post: BlogPost): BlogReviewer {
  const defaultDate = formatArticleDate(post.modifiedDate || post.publishedDate);

  if (
    post.reviewedBy &&
    typeof post.reviewedBy === "object" &&
    post.reviewedBy.doctorNameBn &&
    post.reviewedBy.doctorNameBn !== EDITORIAL_REVIEWER.doctorNameBn &&
    post.reviewedBy.bmdcRegNo
  ) {
    return {
      ...post.reviewedBy,
      profileSlug: normalizeReviewerProfileSlug(post.reviewedBy.profileSlug),
      reviewDateBn: post.reviewedBy.reviewDateBn || defaultDate,
    };
  }

  return {
    ...EDITORIAL_REVIEWER,
    reviewDateBn: defaultDate,
  };
}

/**
 * Generates Schema.org `reviewedBy` structured data for MedicalWebPage and BlogPosting.
 * Uses `Physician` type only when an actual verified doctor reviewed the post with BMDC reg.
 * Otherwise uses `Organization` type for the Health Club Medical Editorial Desk.
 */
export function getReviewerSchema(reviewer: BlogReviewer, siteUrl: string) {
  const isActualDoctor = Boolean(
    reviewer.bmdcRegNo &&
    reviewer.doctorNameBn &&
    reviewer.doctorNameBn !== EDITORIAL_REVIEWER.doctorNameBn
  );

  if (isActualDoctor) {
    const profileUrl = reviewer.profileSlug
      ? (reviewer.profileSlug.startsWith("http")
          ? reviewer.profileSlug
          : `${siteUrl}/consultants/${reviewer.profileSlug.replace(/^\//, "")}`)
      : `${siteUrl}/about-us`;

    return {
      "@type": "Physician",
      name: reviewer.doctorNameBn,
      ...(reviewer.doctorNameEn ? { alternateName: reviewer.doctorNameEn } : {}),
      jobTitle: reviewer.specialtyBn,
      medicalSpecialty: reviewer.specialtyBn,
      description: reviewer.degreesBn,
      url: profileUrl,
      ...(reviewer.photoUrl
        ? {
            image: reviewer.photoUrl.startsWith("http")
              ? reviewer.photoUrl
              : `${siteUrl}${reviewer.photoUrl}`,
          }
        : {}),
      identifier: `BMDC Reg: ${reviewer.bmdcRegNo}`,
    };
  }

  return {
    "@type": "Organization",
    name: reviewer.doctorNameBn || "হেলথ ক্লাব মেডিকেল এডিটোরিয়াল ডেস্ক",
    ...(reviewer.doctorNameEn ? { alternateName: reviewer.doctorNameEn } : {}),
    description: reviewer.degreesBn || "মেডিকেল কনটেন্ট, ডায়াগনস্টিক তথ্য ও স্বাস্থ্যসেবা যাচাইকরণ টিম",
    url: `${siteUrl}/about-us`,
  };
}
