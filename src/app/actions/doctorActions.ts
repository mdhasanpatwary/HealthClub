"use server";

import { prisma } from "@/lib/prisma";
import { Doctor, initialDoctors } from "@/services/db";
import { getSessionUser } from "@/lib/session";
import { logger } from "@/lib/logger";
import { unstable_cache, updateTag } from "next/cache";
import { PaginatedResult } from "@/types/pagination";

const DOCTORS_TAG = "doctors";

export interface GetPaginatedDoctorsAdminParams {
  page?: number;
  pageSize?: number;
  search?: string;
  department?: string;
  isActive?: boolean;
}

export async function getPaginatedDoctorsAdminAction(
  params?: GetPaginatedDoctorsAdminParams
): Promise<PaginatedResult<Doctor>> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") {
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
  const isActive = params?.isActive;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};
  if (department && department !== "all") {
    where.department = department;
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
      }),
    ]);

    const doctors: Doctor[] = data.map((d) => ({
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
      isActive: d.isActive,
    }));

    return {
      data: doctors,
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
 * Server action to fetch all active doctors.
 * Cached with ISR tags and revalidated on changes.
 * Automatically seeds initial doctors if the table is empty.
 */
export const getDoctorsAction = unstable_cache(
  async (): Promise<Doctor[]> => {
    try {
      if (!prisma?.doctor) {
        return initialDoctors;
      }

      const data = await prisma.doctor.findMany({
        where: { isActive: true },
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
          isActive: true,
        },
      });

      if (data.length === 0) {
        return initialDoctors;
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
        isActive: d.isActive,
      }));
    } catch (error) {
      logger.error("Error in getDoctorsAction:", error);
      return initialDoctors;
    }
  },
  ["doctors-list"],
  { revalidate: 60, tags: [DOCTORS_TAG] }
);

/**
 * Fetch all doctors including inactive ones (for Admin dashboard).
 */
export async function getAllDoctorsAdminAction(): Promise<Doctor[]> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") return [];

  try {
    const data = await prisma.doctor.findMany({
      orderBy: { createdAt: "desc" },
    });

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
      isActive: d.isActive,
    }));
  } catch (error) {
    logger.error("Error in getAllDoctorsAdminAction:", error);
    return [];
  }
}

/**
 * Fetch single doctor by ID.
 */
export async function getDoctorByIdAction(id: string): Promise<Doctor | null> {
  try {
    const d = await prisma.doctor.findUnique({
      where: { id },
    });
    if (!d) return null;

    return {
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
      isActive: d.isActive,
    };
  } catch (error) {
    logger.error("Error in getDoctorByIdAction:", error);
    return null;
  }
}

/**
 * Admin action to add a doctor.
 */
export async function addDoctorAction(
  doctor: Omit<Doctor, "id">
): Promise<{ success: boolean; doctor?: Doctor; error?: string }> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") {
    return { success: false, error: "অননুমোদিত অ্যাক্সেস।" };
  }

  const newDocId = `doc_${crypto.randomUUID().slice(0, 8)}`;
  try {
    const d = await prisma.doctor.create({
      data: {
        id: newDocId,
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
        imageUrl: doctor.imageUrl || null,
        partnerId: doctor.partnerId || null,
        isActive: doctor.isActive ?? true,
      },
    });

    return {
      success: true,
      doctor: {
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
        isActive: d.isActive,
      },
    };
  } catch (error) {
    logger.error("Error in addDoctorAction:", error);
    return { success: false, error: "ডাক্তারের তথ্য যুক্ত করতে সমস্যা হয়েছে।" };
  } finally {
    updateTag(DOCTORS_TAG);
  }
}

/**
 * Admin action to update a doctor.
 */
export async function updateDoctorAction(
  id: string,
  doctor: Partial<Omit<Doctor, "id">>
): Promise<{ success: boolean; error?: string }> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") {
    return { success: false, error: "অননুমোদিত অ্যাক্সেস।" };
  }

  try {
    await prisma.doctor.update({
      where: { id },
      data: {
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
        ...(doctor.imageUrl !== undefined && { imageUrl: doctor.imageUrl || null }),
        ...(doctor.partnerId !== undefined && { partnerId: doctor.partnerId || null }),
        ...(doctor.isActive !== undefined && { isActive: doctor.isActive }),
      },
    });

    return { success: true };
  } catch (error) {
    logger.error("Error in updateDoctorAction:", error);
    return { success: false, error: "তথ্য আপডেট করতে সমস্যা হয়েছে।" };
  } finally {
    updateTag(DOCTORS_TAG);
  }
}

/**
 * Admin action to delete a doctor.
 */
export async function deleteDoctorAction(id: string): Promise<{ success: boolean; error?: string }> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") {
    return { success: false, error: "অননুমোদিত অ্যাক্সেস।" };
  }

  try {
    await prisma.doctor.delete({
      where: { id },
    });
    return { success: true };
  } catch (error) {
    logger.error("Error in deleteDoctorAction:", error);
    return { success: false, error: "ডাক্তার ডিলিট করতে সমস্যা হয়েছে।" };
  } finally {
    updateTag(DOCTORS_TAG);
  }
}

/**
 * Admin action to seed default doctors into the database if needed.
 */
export async function seedDoctorsAction(): Promise<{ success: boolean; count?: number; error?: string }> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") {
    return { success: false, error: "অননুমোদিত অ্যাক্সেস।" };
  }

  try {
    const res = await prisma.doctor.createMany({
      data: initialDoctors.map((doc) => ({
        id: doc.id,
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
        isActive: doc.isActive ?? true,
      })),
      skipDuplicates: true,
    });

    updateTag(DOCTORS_TAG);
    return { success: true, count: res.count };
  } catch (error) {
    logger.error("Error in seedDoctorsAction:", error);
    return { success: false, error: "ডাক্তার সিড করতে সমস্যা হয়েছে।" };
  }
}
