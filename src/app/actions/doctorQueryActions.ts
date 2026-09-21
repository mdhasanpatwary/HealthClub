"use server";

import { prisma } from "@/lib/prisma";
import { Doctor, Partner } from "@/services/db";
import { logger } from "@/lib/logger";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { distributeDoctorsFairly } from "@/lib/doctorDistribution";
import { formatDoctor, DOCTOR_SELECT_FIELDS } from "@/lib/doctorFormat";

const DOCTORS_TAG = "doctors";

/**
 * Server action to fetch all active doctors.
 * Cached with ISR tags and revalidated on changes.
 */
export const getDoctorsAction = unstable_cache(
  async (): Promise<Doctor[]> => {
    try {
      if (!prisma?.doctor) {
        return [];
      }

      const data = await prisma.doctor.findMany({
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
        select: DOCTOR_SELECT_FIELDS,
      });

      const formatted = data.map(formatDoctor);
      return distributeDoctorsFairly(formatted);
    } catch (error) {
      logger.error("Error in getDoctorsAction:", error);
      return [];
    }
  },
  ["doctors-list"],
  { revalidate: 60, tags: [DOCTORS_TAG] }
);

/**
 * Fetch doctor image on-demand when opening edit dialog.
 */
export async function getDoctorImageAction(id: string): Promise<string | null> {
  try {
    const doc = await prisma.doctor.findUnique({
      where: { id },
      select: { imageUrl: true },
    });
    return doc?.imageUrl || null;
  } catch (error) {
    logger.error("Error in getDoctorImageAction:", error);
    return null;
  }
}

/**
 * Fetch single doctor by ID or Slug with partner hospital details.
 * Request-memoized via React cache() to deduplicate DB queries between generateMetadata and page body.
 */
export const getDoctorByIdAction = cache(
  async (
    idOrSlug: string
  ): Promise<(Doctor & { partner?: Partner | null }) | null> => {
    try {
      if (!prisma?.doctor || !idOrSlug) {
        return null;
      }

      let decoded = idOrSlug;
      try {
        decoded = decodeURIComponent(idOrSlug);
      } catch {
        // Keep original
      }

      const d = await prisma.doctor.findFirst({
        where: {
          OR: [
            { slug: decoded },
            { slug: idOrSlug },
            { id: idOrSlug },
            { id: decoded },
          ],
        },
        include: { partner: true },
      });

      if (!d) {
        return null;
      }

      return {
        ...formatDoctor(d),
        partner: d.partner
          ? {
            id: d.partner.id,
            slug: d.partner.slug || undefined,
            name: d.partner.name,
            category: d.partner.category as "hospital" | "diagnostic" | "pharmacy",
            address: d.partner.address,
            discount: d.partner.discount,
            phone: d.partner.phone,
            logoText: d.partner.logoText,
            mapLink: d.partner.mapLink || undefined,
            imageUrl: d.partner.imageUrl || undefined,
            emergencyPhone: d.partner.emergencyPhone || undefined,
            workingHours: d.partner.workingHours || undefined,
            departmentDiscounts: d.partner.departmentDiscounts || undefined,
            upazila: d.partner.upazila || "feni-sadar",
          }
          : undefined,
      };
    } catch (error) {
      logger.error("Error in getDoctorByIdAction:", error);
      return null;
    }
  }
);

/**
 * Fetch related specialist doctors in the same department.
 */
export async function getRelatedDoctorsAction(
  department: string,
  excludeDoctorId: string,
  limit = 3
): Promise<Doctor[]> {
  try {
    if (!prisma?.doctor) {
      return [];
    }

    const data = await prisma.doctor.findMany({
      where: {
        department,
        id: { not: excludeDoctorId },
        isActive: true,
      },
      take: limit,
      orderBy: { createdAt: "asc" },
      select: DOCTOR_SELECT_FIELDS,
    });

    return data.map(formatDoctor);
  } catch (error) {
    logger.error("Error in getRelatedDoctorsAction:", error);
    return [];
  }
}
