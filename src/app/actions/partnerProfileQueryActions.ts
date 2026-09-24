"use server";

import { prisma } from "@/lib/prisma";
import { Doctor, initialPartners, Partner } from "@/services/db";
import { logger } from "@/lib/logger";
import { unstable_cache } from "next/cache";
import { cache } from "react";

import {
  PARTNER_FULL_SELECT_FIELDS,
  PARTNER_CARD_SELECT_FIELDS,
  formatPartner,
} from "@/lib/partnerFormat";
import { DOCTOR_CARD_SELECT_FIELDS, formatDoctor } from "@/lib/doctorFormat";

const PARTNERS_TAG = "partners";
const DOCTORS_TAG = "doctors";

/**
 * Fetch a single partner by ID or Slug.
 * Request-memoized via React cache() to deduplicate DB queries between generateMetadata and page body.
 * Falls back to initialPartners if not found in database.
 * Retains full field selection (including heavy JSON strings & gallery) for single profile view.
 */
export const getPartnerByIdAction = cache(
  async (idOrSlug: string): Promise<Partner | null> => {
    try {
      let decoded = idOrSlug;
      try {
        decoded = decodeURIComponent(idOrSlug);
      } catch {
        // keep original
      }

      if (!prisma?.partner) {
        const fallback = initialPartners.find(
          (p) => p.slug === decoded || p.slug === idOrSlug || p.id === idOrSlug || p.id === decoded
        );
        return fallback || null;
      }

      const p = await prisma.partner.findFirst({
        where: {
          OR: [
            { slug: decoded },
            { slug: idOrSlug },
            { id: idOrSlug },
            { id: decoded },
          ],
        },
        select: PARTNER_FULL_SELECT_FIELDS,
      });

      if (!p) {
        const fallback = initialPartners.find(
          (item) => item.slug === decoded || item.slug === idOrSlug || item.id === idOrSlug || item.id === decoded
        );
        return fallback || null;
      }

      return formatPartner(p);
    } catch (error) {
      logger.error("Error in getPartnerByIdAction:", error);
      const fallback = initialPartners.find(
        (item) => item.slug === idOrSlug || item.id === idOrSlug
      );
      return fallback || null;
    }
  }
);

/**
 * Fetch resident consultant doctors practicing at a partner hospital.
 * Cached with tags.
 */
export const getDoctorsByPartnerIdAction = unstable_cache(
  async (partnerId: string): Promise<Doctor[]> => {
    try {
      if (!prisma?.doctor) {
        return [];
      }

      const data = await prisma.doctor.findMany({
        where: {
          partnerId,
          isActive: true,
        },
        orderBy: { createdAt: "asc" },
        select: DOCTOR_CARD_SELECT_FIELDS,
      });

      return data.map(formatDoctor);
    } catch (error) {
      logger.error("Error in getDoctorsByPartnerIdAction:", error);
      return [];
    }
  },
  ["doctors-by-partner"],
  { revalidate: 86400, tags: [DOCTORS_TAG, PARTNERS_TAG] }
);

/**
 * Fetch related / recommended partner facilities in Feni.
 */
export async function getRelatedPartnersAction(
  category: string,
  currentId: string,
  limit: number = 3
): Promise<Partner[]> {
  try {
    if (!prisma?.partner) {
      return initialPartners
        .filter((p) => p.id !== currentId)
        .slice(0, limit);
    }

    const data = await prisma.partner.findMany({
      where: {
        id: { not: currentId },
        category: category,
      },
      take: limit,
      orderBy: { createdAt: "desc" },
      select: PARTNER_CARD_SELECT_FIELDS,
    });

    // If not enough in same category, fetch other partners
    if (data.length < limit) {
      const extra = await prisma.partner.findMany({
        where: {
          id: { notIn: [currentId, ...data.map((d) => d.id)] },
        },
        take: limit - data.length,
        orderBy: { createdAt: "desc" },
        select: PARTNER_CARD_SELECT_FIELDS,
      });
      data.push(...extra);
    }

    if (data.length === 0) {
      return initialPartners
        .filter((p) => p.id !== currentId)
        .slice(0, limit);
    }

    return data.map(formatPartner);
  } catch (error) {
    logger.error("Error in getRelatedPartnersAction:", error);
    return initialPartners
      .filter((p) => p.id !== currentId)
      .slice(0, limit);
  }
}
