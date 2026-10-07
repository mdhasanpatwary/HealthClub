"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/client/client";
import { Doctor, Partner, initialDoctors } from "@/services/db";
import fallbackDoctors from "@/data/feniUniqueDoctors.json";
import { generateDoctorSlug } from "@/lib/slugify";
import { logger } from "@/lib/logger";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { distributeDoctorsFairly } from "@/lib/doctorDistribution";
import {
  formatDoctor,
  DOCTOR_CARD_SELECT_FIELDS,
  type PrismaDoctorRecord,
} from "@/lib/doctorFormat";

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
        select: DOCTOR_CARD_SELECT_FIELDS,
      });

      const formatted = data.map(formatDoctor);
      return distributeDoctorsFairly(formatted);
    } catch (error) {
      logger.error("Error in getDoctorsAction:", error);
      return [];
    }
  },
  ["doctors-list"],
  { revalidate: false, tags: [DOCTORS_TAG] }
);

/**
 * Server action to fetch active doctors by department.
 * Eliminates over-fetching all doctors across the database when requesting a single department.
 * Cached with ISR tags and revalidated on changes.
 */
export const getDoctorsByDepartmentAction = unstable_cache(
  async (department: string): Promise<Doctor[]> => {
    try {
      if (!prisma?.doctor) {
        return [];
      }

      const normalizedDept = (department || "").trim().toLowerCase();
      if (!normalizedDept || normalizedDept === "all") {
        return getDoctorsAction();
      }

      let whereClause: Prisma.DoctorWhereInput;

      if (normalizedDept === "diabetes") {
        whereClause = {
          isActive: true,
          OR: [
            { department: "diabetes" },
            { specialty: { contains: "diabetes", mode: "insensitive" } },
            { specialty: { contains: "ডায়াবেটিস" } },
            { specialty: { contains: "ডায়াবেটিস" } },
            { specialty: { contains: "হরমোন" } },
            { specialty: { contains: "hormone", mode: "insensitive" } },
            { specialty: { contains: "থাইরয়েড" } },
            { specialty: { contains: "থাইরয়েড" } },
            { specialty: { contains: "endocrin", mode: "insensitive" } },
          ],
        };
      } else {
        whereClause = {
          department: normalizedDept,
          isActive: true,
        };
      }

      const data = await prisma.doctor.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        select: DOCTOR_CARD_SELECT_FIELDS,
      });

      const formatted = data.map(formatDoctor);
      return distributeDoctorsFairly(formatted);
    } catch (error) {
      logger.error(`Error in getDoctorsByDepartmentAction(${department}):`, error);
      return [];
    }
  },
  ["doctors-by-department"],
  { revalidate: false, tags: [DOCTORS_TAG] }
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
 * Cached single doctor query at the Vercel Edge / Next.js Data Cache.
 * Eliminates repeat PostgreSQL round-trips and egress leaks on profile routes.
 */
const fetchDbDoctorByIdOrSlug = unstable_cache(
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

      const asciiSlug = generateDoctorSlug(decoded);

      const d = await prisma.doctor.findFirst({
        where: {
          OR: [
            { slug: asciiSlug },
            { slug: decoded },
            { slug: idOrSlug },
            { id: idOrSlug },
            { id: decoded },
            { name: decoded },
            { nameEn: { equals: decoded, mode: "insensitive" } },
          ],
        },
        include: {
          partner: {
            select: {
              id: true,
              slug: true,
              name: true,
              category: true,
              address: true,
              discount: true,
              phone: true,
              logoText: true,
              mapLink: true,
              imageUrl: true,
              emergencyPhone: true,
              workingHours: true,
              departmentDiscounts: true,
              upazila: true,
            },
          },
        },
      });

      if (d) {
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
      }

      // Fast in-memory fallback check across all known catalog doctors
      const fallbackFromInitial = initialDoctors.find(
        (doc) =>
          doc.slug === asciiSlug ||
          doc.slug === decoded ||
          doc.slug === idOrSlug ||
          doc.id === idOrSlug ||
          doc.id === decoded ||
          doc.name === decoded ||
          (doc.nameEn && doc.nameEn.toLowerCase() === decoded.toLowerCase())
      );
      if (fallbackFromInitial) {
        return { ...fallbackFromInitial, partner: null };
      }

      const rawFallback = (fallbackDoctors as unknown as PrismaDoctorRecord[]).find((doc) => {
        const docAscii = formatDoctor(doc).slug;
        return (
          docAscii === asciiSlug ||
          docAscii === decoded ||
          docAscii === idOrSlug ||
          doc.id === idOrSlug ||
          doc.id === decoded ||
          doc.name === decoded ||
          (doc.nameEn && doc.nameEn.toLowerCase() === decoded.toLowerCase())
        );
      });
      return rawFallback ? { ...formatDoctor(rawFallback), partner: null } : null;
    } catch (error) {
      logger.error("Error in fetchDbDoctorByIdOrSlug:", error);
      return null;
    }
  },
  ["single-doctor-by-id-or-slug-v2"],
  { revalidate: false, tags: [DOCTORS_TAG] }
);

/**
 * Fetch single doctor by ID or Slug with partner hospital details.
 * Combines Next.js unstable_cache (Edge Data Cache for 24h) with React cache()
 * (per-request in-memory deduplication between generateMetadata & page body).
 */
export const getDoctorByIdAction = cache(
  async (
    idOrSlug: string
  ): Promise<(Doctor & { partner?: Partner | null }) | null> => {
    if (!idOrSlug) return null;
    const normalizedKey = idOrSlug.trim().toLowerCase();
    return fetchDbDoctorByIdOrSlug(normalizedKey);
  }
);

/**
 * Fetch related specialist doctors in the same department.
 * Wrapped with unstable_cache so identical department queries are served from
 * the Next.js data cache instead of hitting the DB on every profile render.
 */
export const getRelatedDoctorsAction = unstable_cache(
  async (
    department: string,
    excludeDoctorId: string,
    limit = 3
  ): Promise<Doctor[]> => {
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
        select: DOCTOR_CARD_SELECT_FIELDS,
      });

      return data.map(formatDoctor);
    } catch (error) {
      logger.error("Error in getRelatedDoctorsAction:", error);
      return [];
    }
  },
  ["related-doctors"],
  { revalidate: false, tags: [DOCTORS_TAG] }
);
