"use server";

import { prisma } from "@/lib/prisma";
import { Doctor, initialDoctors, initialPartners, Partner } from "@/services/db";
import { logger } from "@/lib/logger";
import { unstable_cache } from "next/cache";

const PARTNERS_TAG = "partners";
const DOCTORS_TAG = "doctors";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatPartner(p: any): Partner {
  return {
    id: p.id,
    name: p.name,
    category: p.category as Partner["category"],
    address: p.address,
    discount: p.discount,
    phone: p.phone,
    email: p.email || undefined,
    logoText: p.logoText,
    mapLink: p.mapLink || undefined,
    imageUrl: p.imageUrl || undefined,
    emergencyPhone: p.emergencyPhone || undefined,
    workingHours: p.workingHours || undefined,
    departmentDiscounts: p.departmentDiscounts || undefined,
    upazila: p.upazila || "feni-sadar",
  };
}

/**
 * Fetch a single partner by ID.
 * Falls back to initialPartners if not found in database.
 */
export async function getPartnerByIdAction(id: string): Promise<Partner | null> {
  try {
    if (!prisma?.partner) {
      const fallback = initialPartners.find((p) => p.id === id);
      return fallback || null;
    }

    const p = await prisma.partner.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        category: true,
        address: true,
        discount: true,
        phone: true,
        email: true,
        logoText: true,
        mapLink: true,
        imageUrl: true,
        emergencyPhone: true,
        workingHours: true,
        departmentDiscounts: true,
        upazila: true,
      },
    });

    if (!p) {
      const fallback = initialPartners.find((item) => item.id === id);
      return fallback || null;
    }

    return formatPartner(p);
  } catch (error) {
    logger.error("Error in getPartnerByIdAction:", error);
    const fallback = initialPartners.find((item) => item.id === id);
    return fallback || null;
  }
}

/**
 * Fetch resident consultant doctors practicing at a partner hospital.
 * Cached with tags.
 */
export const getDoctorsByPartnerIdAction = unstable_cache(
  async (partnerId: string): Promise<Doctor[]> => {
    try {
      if (!prisma?.doctor) {
        return initialDoctors.filter((d) => d.partnerId === partnerId && d.isActive !== false);
      }

      const data = await prisma.doctor.findMany({
        where: {
          partnerId,
          isActive: true,
        },
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          name: true,
          specialty: true,
          department: true,
          degrees: true,
          designation: true,
          chamberName: true,
          chamberAddress: true,
          roomNo: true,
          visitingDays: true,
          visitingHours: true,
          serialPhone: true,
          consultationFee: true,
          imageUrl: true,
          partnerId: true,
          upazila: true,
          isActive: true,
        },
      });

      if (data.length === 0) {
        return initialDoctors.filter((d) => d.partnerId === partnerId && d.isActive !== false);
      }

      return data.map((d) => ({
        id: d.id,
        name: d.name,
        specialty: d.specialty,
        department: d.department,
        degrees: d.degrees,
        designation: d.designation,
        chamberName: d.chamberName,
        chamberAddress: d.chamberAddress,
        roomNo: d.roomNo || undefined,
        visitingDays: d.visitingDays,
        visitingHours: d.visitingHours,
        serialPhone: d.serialPhone,
        consultationFee: d.consultationFee || undefined,
        imageUrl: d.imageUrl || undefined,
        partnerId: d.partnerId || undefined,
        upazila: d.upazila || "feni-sadar",
        isActive: d.isActive,
      }));
    } catch (error) {
      logger.error("Error in getDoctorsByPartnerIdAction:", error);
      return initialDoctors.filter((d) => d.partnerId === partnerId && d.isActive !== false);
    }
  },
  ["doctors-by-partner"],
  { revalidate: 60, tags: [DOCTORS_TAG, PARTNERS_TAG] }
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
      select: {
        id: true,
        name: true,
        category: true,
        address: true,
        discount: true,
        phone: true,
        email: true,
        logoText: true,
        mapLink: true,
        imageUrl: true,
        emergencyPhone: true,
        workingHours: true,
        departmentDiscounts: true,
        upazila: true,
      },
    });

    // If not enough in same category, fetch other partners
    if (data.length < limit) {
      const extra = await prisma.partner.findMany({
        where: {
          id: { notIn: [currentId, ...data.map((d) => d.id)] },
        },
        take: limit - data.length,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          category: true,
          address: true,
          discount: true,
          phone: true,
          email: true,
          logoText: true,
          mapLink: true,
          imageUrl: true,
          emergencyPhone: true,
          workingHours: true,
          departmentDiscounts: true,
          upazila: true,
        },
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
