"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/client/client";
import { Doctor, initialDoctors } from "@/services/db";
import { getSessionUser } from "@/lib/session";
import { logger } from "@/lib/logger";
import { updateTag } from "next/cache";
import { PaginatedResult } from "@/types/pagination";
import { hasAdminPermission } from "@/lib/permissions";
import { ensureStorageUrl } from "@/services/storageService";
import { generateDoctorSlug, sanitizeDoctorSlug, resolveUniqueDoctorSlug } from "@/lib/slugify";
import {
  formatDoctor,
  DOCTOR_FULL_SELECT_FIELDS,
  DOCTOR_ADMIN_SELECT_FIELDS,
} from "@/lib/doctorFormat";
import {
  getDoctorsAction,
  getDoctorsByDepartmentAction,
  getDoctorImageAction,
  getDoctorByIdAction,
  getRelatedDoctorsAction,
} from "./doctorQueryActions";

export {
  getDoctorsAction,
  getDoctorsByDepartmentAction,
  getDoctorImageAction,
  getDoctorByIdAction,
  getRelatedDoctorsAction,
};

const DOCTORS_TAG = "doctors";

async function verifyDoctorAdmin(): Promise<boolean> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") return false;
  const role = session.adminRole || "super_admin";
  return hasAdminPermission(role, "manage_doctors");
}

export interface GetPaginatedDoctorsAdminParams {
  page?: number;
  pageSize?: number;
  search?: string;
  department?: string;
  upazila?: string;
  isActive?: boolean;
}

export async function getPaginatedDoctorsAdminAction(
  params?: GetPaginatedDoctorsAdminParams
): Promise<PaginatedResult<Doctor>> {
  if (!await verifyDoctorAdmin()) {
    return {
      data: [],
      totalItems: 0,
      totalPages: 1,
      currentPage: 1,
      pageSize: params?.pageSize || 10,
    };
  }

  const page = Math.max(1, params?.page || 1);
  const pageSize = Math.max(1, params?.pageSize || 10);
  const search = params?.search?.trim();
  const department = params?.department;
  const upazila = params?.upazila;
  const isActive = params?.isActive;

  const where: Prisma.DoctorWhereInput = {};
  if (department && department !== "all") {
    where.department = department;
  }
  if (upazila && upazila !== "all") {
    where.upazila = upazila;
  }
  if (isActive !== undefined) {
    where.isActive = isActive;
  }
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { specialty: { contains: search, mode: "insensitive" } },
      { department: { contains: search, mode: "insensitive" } },
      { chamberName: { contains: search, mode: "insensitive" } },
      { chamberAddress: { contains: search, mode: "insensitive" } },
      { serialPhone: { contains: search, mode: "insensitive" } },
    ];
  }

  try {
    const [totalItems, data] = await Promise.all([
      prisma.doctor.count({ where }),
      prisma.doctor.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          ...DOCTOR_ADMIN_SELECT_FIELDS,
          imageUrl: false,
        },
      }),
    ]);

    return {
      data: data.map(formatDoctor),
      totalItems,
      totalPages: Math.max(1, Math.ceil(totalItems / pageSize)),
      currentPage: page,
      pageSize,
    };
  } catch (error) {
    logger.error("Error in getPaginatedDoctorsAdminAction:", error);
    return { data: [], totalItems: 0, totalPages: 1, currentPage: 1, pageSize };
  }
}

/**
 * Fetch all doctors including inactive ones (for Admin dashboard).
 */
export async function getAllDoctorsAdminAction(): Promise<Doctor[]> {
  if (!await verifyDoctorAdmin()) return [];

  try {
    const data = await prisma.doctor.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        ...DOCTOR_ADMIN_SELECT_FIELDS,
        imageUrl: false,
      },
    });

    return data.map(formatDoctor);
  } catch (error) {
    logger.error("Error in getAllDoctorsAdminAction:", error);
    return [];
  }
}

/**
 * Admin action to add a doctor.
 */
export async function addDoctorAction(
  doctor: Omit<Doctor, "id">
): Promise<{ success: boolean; doctor?: Doctor; error?: string }> {
  if (!await verifyDoctorAdmin()) {
    return { success: false, error: "অননুমোদিত অ্যাক্সেস।" };
  }

  const newDocId = `doc_${crypto.randomUUID().slice(0, 8)}`;
  try {
    const baseSlug = doctor.slug?.trim()
      ? sanitizeDoctorSlug(doctor.slug)
      : generateDoctorSlug(doctor.name) || `doc-${newDocId.replace(/^doc_/, "")}`;
    const resolvedSlug = await resolveUniqueDoctorSlug(prisma, baseSlug);

    const d = await prisma.doctor.create({
      data: {
        id: newDocId,
        slug: resolvedSlug,
        name: doctor.name,
        specialty: doctor.specialty,
        department: doctor.department,
        degrees: doctor.degrees,
        designation: doctor.designation,
        chamberName: doctor.chamberName,
        chamberAddress: doctor.chamberAddress,
        roomNo: doctor.roomNo || null,
        visitingDays: doctor.visitingDays,
        visitingHours: doctor.visitingHours,
        serialPhone: doctor.serialPhone,
        consultationFee: doctor.consultationFee || null,
        imageUrl: (await ensureStorageUrl(doctor.imageUrl, "doctors")) || null,
        partnerId: doctor.partnerId || null,
        upazila: doctor.upazila || "feni-sadar",
        isActive: doctor.isActive ?? true,
        availableToday: doctor.availableToday ?? true,
        onLeaveUntil: doctor.onLeaveUntil ? new Date(doctor.onLeaveUntil) : null,
        notice: doctor.notice ? doctor.notice.trim() || null : null,
      },
      select: DOCTOR_FULL_SELECT_FIELDS,
    });

    updateTag(DOCTORS_TAG);
    updateTag("admin-stats");
    return {
      success: true,
      doctor: formatDoctor(d),
    };
  } catch (error) {
    logger.error("Error in addDoctorAction:", error);
    return { success: false, error: "ডাক্তারের তথ্য যুক্ত করতে সমস্যা হয়েছে।" };
  }
}

/**
 * Admin action to update a doctor.
 */
export async function updateDoctorAction(
  id: string,
  doctor: Partial<Omit<Doctor, "id">>
): Promise<{ success: boolean; error?: string }> {
  if (!await verifyDoctorAdmin()) {
    return { success: false, error: "অননুমোদিত অ্যাক্সেস।" };
  }

  try {
    let finalSlug: string | undefined = undefined;
    if (doctor.slug && doctor.slug.trim()) {
      const sanitized = sanitizeDoctorSlug(doctor.slug);
      finalSlug = await resolveUniqueDoctorSlug(prisma, sanitized, id);
    } else if (doctor.name) {
      const current = await prisma.doctor.findUnique({
        where: { id },
        select: { slug: true },
      });
      if (!current?.slug) {
        finalSlug = await resolveUniqueDoctorSlug(
          prisma,
          generateDoctorSlug(doctor.name),
          id
        );
      }
    }

    await prisma.doctor.update({
      where: { id },
      data: {
        ...(finalSlug !== undefined && { slug: finalSlug }),
        ...(doctor.name !== undefined && { name: doctor.name }),
        ...(doctor.specialty !== undefined && { specialty: doctor.specialty }),
        ...(doctor.department !== undefined && { department: doctor.department }),
        ...(doctor.degrees !== undefined && { degrees: doctor.degrees }),
        ...(doctor.designation !== undefined && { designation: doctor.designation }),
        ...(doctor.chamberName !== undefined && { chamberName: doctor.chamberName }),
        ...(doctor.chamberAddress !== undefined && { chamberAddress: doctor.chamberAddress }),
        ...(doctor.roomNo !== undefined && { roomNo: doctor.roomNo || null }),
        ...(doctor.visitingDays !== undefined && { visitingDays: doctor.visitingDays }),
        ...(doctor.visitingHours !== undefined && { visitingHours: doctor.visitingHours }),
        ...(doctor.serialPhone !== undefined && { serialPhone: doctor.serialPhone }),
        ...(doctor.consultationFee !== undefined && { consultationFee: doctor.consultationFee || null }),
        ...(doctor.imageUrl !== undefined && { imageUrl: (await ensureStorageUrl(doctor.imageUrl, "doctors", id)) || null }),
        ...(doctor.partnerId !== undefined && { partnerId: doctor.partnerId || null }),
        ...(doctor.upazila !== undefined && { upazila: doctor.upazila || "feni-sadar" }),
        ...(doctor.isActive !== undefined && { isActive: doctor.isActive }),
        ...(doctor.availableToday !== undefined && { availableToday: doctor.availableToday }),
        ...(doctor.onLeaveUntil !== undefined && {
          onLeaveUntil: doctor.onLeaveUntil ? new Date(doctor.onLeaveUntil) : null,
        }),
        ...(doctor.notice !== undefined && { notice: doctor.notice ? doctor.notice.trim() || null : null }),
      },
    });

    updateTag(DOCTORS_TAG);
    updateTag("admin-stats");
    return { success: true };
  } catch (error) {
    logger.error("Error in updateDoctorAction:", error);
    return { success: false, error: "তথ্য আপডেট করতে সমস্যা হয়েছে।" };
  }
}

/**
 * Admin action to delete a doctor.
 */
export async function deleteDoctorAction(id: string): Promise<{ success: boolean; error?: string }> {
  if (!await verifyDoctorAdmin()) {
    return { success: false, error: "অননুমোদিত অ্যাক্সেস।" };
  }

  try {
    await prisma.doctor.delete({
      where: { id },
    });
    updateTag(DOCTORS_TAG);
    updateTag("admin-stats");
    return { success: true };
  } catch (error) {
    logger.error("Error in deleteDoctorAction:", error);
    return { success: false, error: "ডাক্তার ডিলিট করতে সমস্যা হয়েছে।" };
  }
}

/**
 * Admin action to seed default doctors into the database if needed.
 */
export async function seedDoctorsAction(): Promise<{ success: boolean; count?: number; error?: string }> {
  if (!await verifyDoctorAdmin()) {
    return { success: false, error: "অননুমোদিত অ্যাক্সেস।" };
  }

  try {
    const dataWithSlugs = await Promise.all(
      initialDoctors.map(async (doc) => {
        const baseSlug = doc.slug || generateDoctorSlug(doc.name) || `doc-${doc.id.replace(/^doc_/, "")}`;
        const uniqueSlug = await resolveUniqueDoctorSlug(prisma, baseSlug, doc.id);
        return {
          id: doc.id,
          slug: uniqueSlug,
          name: doc.name,
          specialty: doc.specialty,
          department: doc.department,
          degrees: doc.degrees,
          designation: doc.designation,
          chamberName: doc.chamberName,
          chamberAddress: doc.chamberAddress,
          roomNo: doc.roomNo || null,
          visitingDays: doc.visitingDays,
          visitingHours: doc.visitingHours,
          serialPhone: doc.serialPhone,
          consultationFee: doc.consultationFee || null,
          imageUrl: doc.imageUrl || null,
          partnerId: doc.partnerId || null,
          upazila: doc.upazila || "feni-sadar",
          isActive: doc.isActive ?? true,
          availableToday: doc.availableToday ?? true,
          onLeaveUntil: doc.onLeaveUntil ? new Date(doc.onLeaveUntil) : null,
          notice: doc.notice || null,
        };
      })
    );

    const res = await prisma.doctor.createMany({
      data: dataWithSlugs,
      skipDuplicates: true,
    });

    updateTag(DOCTORS_TAG);
    updateTag("admin-stats");
    return { success: true, count: res.count };
  } catch (error) {
    logger.error("Error in seedDoctorsAction:", error);
    return { success: false, error: "ডাক্তার সিড করতে সমস্যা হয়েছে।" };
  }
}
