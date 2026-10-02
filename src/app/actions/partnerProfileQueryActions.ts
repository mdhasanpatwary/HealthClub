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
 * Canonical partner slug alias mapping.
 * Normalizes historical or alternative slugs to their canonical database partner slugs.
 */
const KNOWN_PARTNER_ALIASES: Record<string, string> = {
  // Pacific Health Care
  "pacific-health-care": "pacific-health-care-centre",
  "pacific-health-care-feni": "pacific-health-care-centre",
  "pacific-health-care-center": "pacific-health-care-centre",
  "প্যাসিফিক-হেলথ-কেয়ার-সেন্টার": "pacific-health-care-centre",

  // Life Care
  "life-care-diagnostic": "life-care-diagnostic-center",
  "life-care-diagnostic-feni": "life-care-diagnostic-center",
  "life-care-diagnostic-center-feni": "life-care-diagnostic-center",
  "লাইফ-কেয়ার-ডায়াগনস্টিক-সেন্টার": "life-care-diagnostic-center",

  // Imperial Neurocare
  "imperial-neurocare": "imperial-neurocare-diagnostic-center",
  "imperial-neurocare-feni": "imperial-neurocare-diagnostic-center",
  "ইম্পেরিয়াল-নিউরোকেয়ার-অ্যান্ড-ডায়াগনস্টিক-সেন্টার": "imperial-neurocare-diagnostic-center",

  // Feni Max
  "feni-max-diagnostic": "feni-max-diagnostic-centre",
  "feni-max-diagnostic-center": "feni-max-diagnostic-centre",
  "ফেনি-ম্যাক্স-ডায়াগনস্টিক-সেন্টার": "feni-max-diagnostic-centre",

  // Al-Aqsa
  "al-aqsa-hospital": "al-aqsa-hospital-feni",
  "al-aqsa-hospital-feni": "al-aqsa-hospital-feni",
  "al-aqsa-hospital-ltd-feni": "al-aqsa-hospital-feni",
  "আল-আকসা-হাসপাতাল-লিঃ-ফেনী": "al-aqsa-hospital-feni",
  "আল-আকসা-হাসপাতাল-লি-ফেনী": "al-aqsa-hospital-feni",

  // Islamia Physiotherapy
  "islamia-physiotherapy": "islamia-physiotherapy-and-rehabilitation-center",
  "islamia-physiotherapy-center": "islamia-physiotherapy-and-rehabilitation-center",
  "islamia-physiotherapy-rehabilitation-center": "islamia-physiotherapy-and-rehabilitation-center",
  "islamia-physiotherapy-and-rehabilitation-center": "islamia-physiotherapy-and-rehabilitation-center",
  "ইসলামিয়া-ফিজিওথেরাপি-এন্ড-রিহ্যাবিলিটেশন-সেন্টার": "islamia-physiotherapy-and-rehabilitation-center",

  // Feni Care Hospital
  "feni-care": "feni-care-hospital",
  "feni-care-hospital": "feni-care-hospital",
  "ফেনী-কেয়ার-হসপিটাল": "feni-care-hospital",

  // Niramoy Diagnostic
  "niramoy-diagnostic": "niramoy-diagnostic-consultation-center",
  "niramoy-diagnostic-and-consultation-center": "niramoy-diagnostic-consultation-center",
  "niramoy-diagnostic-consultation-center": "niramoy-diagnostic-consultation-center",
  "নিরাময়-ডায়াগনস্টিক-এন্ড-কনসালটেশন-সেন্টার": "niramoy-diagnostic-consultation-center",
  "নিরাময়-ডায়াগনস্টিক-এন্ড-কনসালটেশন-সেন্টার": "niramoy-diagnostic-consultation-center",

  // Dhaka Pharmacy
  "dhaka-pharmacy": "dhaka-pharmacy",
  "ঢাকা-ফার্মেসি": "dhaka-pharmacy",

  // Mazumder Dental
  "mazumder-dental-clinic": "mazumder-dental-clinic",
  "mojumdar-dental-clinic": "mazumder-dental-clinic",
  "মজুমদার-ডেন্টাল-ক্লিনিক": "mazumder-dental-clinic",

  // Central Physiotherapy
  "central-physiotherapy": "central-physiotherapy-rehabilitation-center",
  "central-physiotherapy-and-rehabilitation-center": "central-physiotherapy-rehabilitation-center",
  "central-physiotherapy-and-rehabilitation-sentar": "central-physiotherapy-rehabilitation-center",
  "central-physiotherapy-rehabilitation-center": "central-physiotherapy-rehabilitation-center",
  "সেন্ট্রাল-ফিজিওথেরাপি-এন্ড-রিহ্যাবিলিটেশন-সেন্টার": "central-physiotherapy-rehabilitation-center",
};

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

      const resolvedSlug =
        KNOWN_PARTNER_ALIASES[decoded] ||
        KNOWN_PARTNER_ALIASES[idOrSlug] ||
        decoded;

      // Construct candidate slug set including reverse aliases for resilient matching
      const candidateSlugs = new Set<string>([
        resolvedSlug,
        decoded,
        idOrSlug,
      ]);

      for (const [aliasKey, targetSlug] of Object.entries(KNOWN_PARTNER_ALIASES)) {
        if (targetSlug === resolvedSlug || targetSlug === decoded || aliasKey === resolvedSlug || aliasKey === decoded) {
          candidateSlugs.add(aliasKey);
          candidateSlugs.add(targetSlug);
        }
      }

      if (!prisma?.partner) {
        const fallback = initialPartners.find(
          (p) =>
            p.isPartner !== false &&
            (candidateSlugs.has(p.slug || "") ||
              p.id === idOrSlug ||
              p.id === decoded)
        );
        return fallback || null;
      }

      // 1. Direct query with candidate slugs or IDs
      let p = await prisma.partner.findFirst({
        where: {
          isPartner: true,
          OR: [
            ...Array.from(candidateSlugs).map((s) => ({ slug: s })),
            { id: idOrSlug },
            { id: decoded },
          ],
        },
        select: PARTNER_FULL_SELECT_FIELDS,
      });

      // 2. Fallback: if not found by stored slug, scan active partners and match on formatted slug
      if (!p) {
        const allPartners = await prisma.partner.findMany({
          where: { isPartner: true },
          select: PARTNER_FULL_SELECT_FIELDS,
        });

        const matched = allPartners.find((item) => {
          const formatted = formatPartner(item);
          return (
            candidateSlugs.has(formatted.slug || "") ||
            candidateSlugs.has(item.slug || "") ||
            item.id === idOrSlug ||
            item.id === decoded
          );
        });

        if (matched) {
          p = matched;
        }
      }

      if (!p || p.isPartner === false) {
        const fallback = initialPartners.find(
          (item) =>
            item.isPartner !== false &&
            (candidateSlugs.has(item.slug || "") ||
              item.id === idOrSlug ||
              item.id === decoded)
        );
        return fallback || null;
      }

      return formatPartner(p);
    } catch (error) {
      logger.error("Error in getPartnerByIdAction:", error);
      const fallback = initialPartners.find(
        (item) =>
          item.isPartner !== false &&
          (item.slug === idOrSlug || item.id === idOrSlug)
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
 * Cached with unstable_cache so the same category lookups hit the Next.js
 * data cache instead of making a live DB query on every partner profile render.
 */
export const getRelatedPartnersAction = unstable_cache(
  async (
    category: string,
    currentId: string,
    limit: number = 3
  ): Promise<Partner[]> => {
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
  },
  ["related-partners"],
  { revalidate: 86400, tags: [PARTNERS_TAG] }
);
