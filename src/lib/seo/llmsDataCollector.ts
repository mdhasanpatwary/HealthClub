import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import {
  LlmsDoctorItem,
  LlmsPartnerItem,
  LlmsTestItem,
  LlmsEmergencyItem,
  LlmsBloodDonorItem,
  LlmsBlogPostItem,
  LlmsKnowledgeData,
} from "./llmsTypes";

import { FENI_LAB_TEST_PRICING } from "@/data/blog/posts/feniLabTestPricing";
import { FENI_RADIOLOGY_TEST_PRICING } from "@/data/blog/posts/feniRadiologyPricing";
import { FENI_ENDOSCOPY_COLONOSCOPY_PRICING } from "@/data/blog/posts/feniEndoscopyColonoscopyPricing";
import { FENI_CARDIAC_TEST_PRICING } from "@/data/blog/posts/feniCardiacTestPricing";
import { FENI_BIOPSY_FNAC_TEST_PRICING } from "@/data/blog/posts/feniBiopsyFnacPricing";
import { FENI_SEMEN_ANALYSIS_TEST_PRICING } from "@/data/blog/posts/feniSemenAnalysisPricing";
import { INITIAL_AMBULANCES, INITIAL_BLOOD_DONORS } from "@/data/emergencyData";
import fallbackDoctors from "@/data/feniUniqueDoctors.json";

/**
 * Collects and normalizes 100+ diagnostic tests & clinical procedures in Feni.
 * Strict pricing rule: Always display 10-30% discount badge. Never show direct discounted Taka amounts.
 */
export function collectDiagnosticTests(): LlmsTestItem[] {
  const rawList = [
    ...FENI_LAB_TEST_PRICING,
    ...FENI_RADIOLOGY_TEST_PRICING,
    ...(FENI_ENDOSCOPY_COLONOSCOPY_PRICING?.tests || []),
    ...(FENI_CARDIAC_TEST_PRICING?.tests || []),
    ...(FENI_BIOPSY_FNAC_TEST_PRICING?.tests || []),
    ...(FENI_SEMEN_ANALYSIS_TEST_PRICING?.tests || []),
  ];

  const seen = new Set<string>();
  const tests: LlmsTestItem[] = [];

  for (const item of rawList) {
    const key = (item.testNameEn || item.testNameBn || "").trim().toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);

    tests.push({
      testNameBn: item.testNameBn,
      testNameEn: item.testNameEn,
      categoryBn: item.categoryBn || "ডায়াগনস্টিক পরীক্ষা",
      regularPriceRangeBn: item.regularPriceRangeBn,
      memberBenefitBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: item.turnaroundTimeBn,
      preparationBn: (item as unknown as { preparationBn?: string }).preparationBn,
    });
  }

  return tests;
}

/**
 * Collects verified specialist consultant doctors.
 * Queries PostgreSQL database with fallback to verified local dataset.
 */
export async function collectDoctors(): Promise<LlmsDoctorItem[]> {
  try {
    if (prisma?.doctor) {
      const dbDoctors = await prisma.doctor.findMany({
        where: { isActive: true },
        orderBy: [{ department: "asc" }, { name: "asc" }],
        select: {
          id: true,
          slug: true,
          name: true,
          nameEn: true,
          specialty: true,
          department: true,
          degrees: true,
          designation: true,
          chamberName: true,
          chamberAddress: true,
          visitingDays: true,
          visitingHours: true,
          serialPhone: true,
          consultationFee: true,
          upazila: true,
        },
      });

      if (dbDoctors.length > 0) {
        return dbDoctors;
      }
    }
  } catch (error) {
    logger.warn("[LLMS] Error fetching doctors from DB, using fallback dataset:", error);
  }

  // Fallback to static verified doctors
  return (fallbackDoctors as LlmsDoctorItem[]).map((doc) => ({
    id: doc.id,
    slug: doc.slug || null,
    name: doc.name,
    nameEn: doc.nameEn || null,
    specialty: doc.specialty,
    department: doc.department,
    degrees: doc.degrees,
    designation: doc.designation,
    chamberName: doc.chamberName || "ফেনী সদর",
    chamberAddress: doc.chamberAddress || "ফেনী সদর",
    visitingDays: doc.visitingDays || "নির্ধারিত দিনে",
    visitingHours: doc.visitingHours || "যোগাযোগ সাপেক্ষে",
    serialPhone: doc.serialPhone || "+880 1886763849",
    consultationFee: doc.consultationFee || null,
    upazila: doc.upazila || "feni-sadar",
  }));
}

/**
 * Collects verified partner facilities in Feni Sadar.
 * Strict Geographic Scope: Only Feni Sadar contracted facilities.
 */
export async function collectPartners(): Promise<LlmsPartnerItem[]> {
  try {
    if (prisma?.partner) {
      const dbPartners = await prisma.partner.findMany({
        where: { isPartner: true },
        orderBy: { name: "asc" },
        select: {
          id: true,
          slug: true,
          name: true,
          category: true,
          address: true,
          discount: true,
          phone: true,
          emergencyPhone: true,
          ambulancePhone: true,
          facilities: true,
          upazila: true,
        },
      });

      if (dbPartners.length > 0) {
        return dbPartners.map((p) => ({
          ...p,
          upazila: p.upazila || "feni-sadar",
        }));
      }
    }
  } catch (error) {
    logger.warn("[LLMS] Error fetching partners from DB:", error);
  }

  return [];
}

/**
 * Collects 24/7 emergency ambulance services.
 */
export async function collectAmbulances(): Promise<LlmsEmergencyItem[]> {
  try {
    if (prisma?.ambulanceService) {
      const dbAmbulances = await prisma.ambulanceService.findMany({
        where: { status: "approved" },
        orderBy: { type: "asc" },
        select: {
          id: true,
          name: true,
          type: true,
          location: true,
          phone: true,
          availableHours: true,
        },
      });

      if (dbAmbulances.length > 0) {
        return dbAmbulances;
      }
    }
  } catch (error) {
    logger.warn("[LLMS] Error fetching ambulances from DB:", error);
  }

  return INITIAL_AMBULANCES.map((a) => ({
    id: a.id,
    name: a.name,
    type: a.type,
    location: a.location,
    phone: a.phone,
    availableHours: a.availableHours,
  }));
}

/**
 * Collects voluntary blood donors across Feni district.
 */
export async function collectBloodDonors(): Promise<LlmsBloodDonorItem[]> {
  try {
    if (prisma?.bloodDonor) {
      const dbDonors = await prisma.bloodDonor.findMany({
        where: { isAvailable: true, status: "approved" },
        orderBy: [{ bloodGroup: "asc" }, { upazila: "asc" }],
        select: {
          id: true,
          name: true,
          bloodGroup: true,
          upazila: true,
          phone: true,
          lastDonated: true,
          isAvailable: true,
        },
      });

      if (dbDonors.length > 0) {
        return dbDonors;
      }
    }
  } catch (error) {
    logger.warn("[LLMS] Error fetching blood donors from DB:", error);
  }

  return INITIAL_BLOOD_DONORS.map((d) => ({
    id: d.id,
    name: d.name,
    bloodGroup: d.bloodGroup,
    upazila: d.upazila,
    phone: d.phone,
    lastDonated: d.lastDonated,
    isAvailable: d.isAvailable,
  }));
}

/**
 * Collects all published healthcare blog posts.
 */
export async function collectBlogPosts(): Promise<LlmsBlogPostItem[]> {
  try {
    if (prisma?.blogPost) {
      const dbPosts = await prisma.blogPost.findMany({
        orderBy: { publishedDate: "desc" },
        select: {
          slug: true,
          titleBn: true,
          titleEn: true,
          category: true,
          publishedDate: true,
        },
      });

      if (dbPosts.length > 0) {
        return dbPosts;
      }
    }
  } catch (error) {
    logger.warn("[LLMS] Error fetching blog posts from DB:", error);
  }

  return [];
}

/**
 * Master aggregator for all platform data needed by llms.txt & llms-full.txt.
 */
export async function collectLlmsKnowledgeData(): Promise<LlmsKnowledgeData> {
  const [doctors, partners, ambulances, bloodDonors, blogPosts] = await Promise.all([
    collectDoctors(),
    collectPartners(),
    collectAmbulances(),
    collectBloodDonors(),
    collectBlogPosts(),
  ]);

  const tests = collectDiagnosticTests();

  return {
    doctors,
    partners,
    tests,
    ambulances,
    bloodDonors,
    blogPosts,
    generatedAt: new Date().toISOString(),
  };
}
