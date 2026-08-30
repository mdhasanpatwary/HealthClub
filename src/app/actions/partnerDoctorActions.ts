"use server";

import { prisma } from "@/lib/prisma";
import { Doctor, initialDoctors } from "@/services/db";
import { getSessionUser } from "@/lib/session";
import { logger } from "@/lib/logger";
import { updateTag } from "next/cache";

const DOCTORS_TAG = "doctors";
const PARTNERS_TAG = "partners";

async function getAuthenticatedPartnerId(): Promise<string | null> {
  const session = await getSessionUser();
  if (!session || (session.role !== "partner" && session.role !== "partner_staff")) {
    return null;
  }
  return session.role === "partner_staff" ? session.partnerId || null : session.userId;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatDoctor(d: any): Doctor {
  return {
    id: d.id, name: d.name, specialty: d.specialty, department: d.department,
    degrees: d.degrees, designation: d.designation, chamberName: d.chamberName, chamberAddress: d.chamberAddress,
    roomNo: d.roomNo || undefined, visitingDays: d.visitingDays, visitingHours: d.visitingHours,
    serialPhone: d.serialPhone, consultationFee: d.consultationFee || undefined, imageUrl: d.imageUrl || undefined,
    partnerId: d.partnerId || undefined, upazila: d.upazila || "feni-sadar", isActive: d.isActive,
    availableToday: d.availableToday ?? true,
    onLeaveUntil: d.onLeaveUntil ? (typeof d.onLeaveUntil === "string" ? d.onLeaveUntil : d.onLeaveUntil.toISOString().slice(0, 10)) : undefined,
    notice: d.notice || undefined,
  };
}

export interface PartnerDoctorChamberInput {
  roomNo?: string;
  visitingDays?: string;
  visitingHours?: string;
  serialPhone?: string;
  consultationFee?: string;
}

export interface AddPartnerDoctorInput {
  name: string;
  specialty: string;
  department: string;
  degrees: string;
  designation: string;
  roomNo?: string;
  visitingDays: string;
  visitingHours: string;
  serialPhone: string;
  consultationFee?: string;
  imageUrl?: string;
  upazila?: string;
  isActive?: boolean;
  availableToday?: boolean;
  onLeaveUntil?: string;
  notice?: string;
}

export type UpdatePartnerDoctorInput = Partial<AddPartnerDoctorInput>;

/**
 * Fetch all doctors practicing in the logged-in partner's hospital/chamber.
 */
export async function getPartnerDoctorsAction(): Promise<{
  success: boolean;
  doctors: Doctor[];
  error?: string;
}> {
  const partnerId = await getAuthenticatedPartnerId();
  if (!partnerId) {
    return { success: false, doctors: [], error: "অননুমোদিত অ্যাক্সেস।" };
  }

  try {
    const data = await prisma.doctor.findMany({
      where: { partnerId },
      orderBy: { createdAt: "desc" },
    });

    if (data.length === 0) {
      const fallbackList = initialDoctors.filter((doc) => doc.partnerId === partnerId);
      if (fallbackList.length > 0) {
        return { success: true, doctors: fallbackList };
      }
    }

    return { success: true, doctors: data.map(formatDoctor) };
  } catch (error) {
    logger.error("Error in getPartnerDoctorsAction:", error);
    const fallbackList = initialDoctors.filter((doc) => doc.partnerId === partnerId);
    if (fallbackList.length > 0) {
      return { success: true, doctors: fallbackList };
    }
    return { success: false, doctors: [], error: "ডাক্তারদের তালিকা লোড করতে সমস্যা হয়েছে।" };
  }
}

/**
 * Fetch active doctors available to be linked to this partner (with pagination).
 */
export async function getAvailableDoctorsToLinkAction(
  search?: string,
  page: number = 1,
  limit: number = 50
): Promise<{
  success: boolean;
  doctors: Doctor[];
  hasMore: boolean;
  total: number;
  error?: string;
}> {
  const partnerId = await getAuthenticatedPartnerId();
  if (!partnerId) {
    return { success: false, doctors: [], hasMore: false, total: 0, error: "অননুমোদিত অ্যাক্সেস।" };
  }

  const safePage = Math.max(1, page);
  const safeLimit = Math.max(1, Math.min(limit, 100));
  const skip = (safePage - 1) * safeLimit;
  const trimmed = search?.trim();
  const q = trimmed?.toLowerCase();

  const filterFallback = () => initialDoctors.filter((doc) => {
    if (!doc.isActive || doc.partnerId === partnerId) return false;
    if (!q) return true;
    return doc.name.toLowerCase().includes(q) || doc.specialty.toLowerCase().includes(q) ||
      doc.department.toLowerCase().includes(q) || doc.degrees.toLowerCase().includes(q) ||
      (doc.designation && doc.designation.toLowerCase().includes(q)) ||
      (doc.chamberName && doc.chamberName.toLowerCase().includes(q));
  });

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      isActive: true,
      AND: [{ OR: [{ partnerId: null }, { partnerId: { not: partnerId } }] }],
    };

    if (trimmed) {
      where.AND.push({
        OR: [
          { name: { contains: trimmed, mode: "insensitive" } },
          { specialty: { contains: trimmed, mode: "insensitive" } },
          { department: { contains: trimmed, mode: "insensitive" } },
          { degrees: { contains: trimmed, mode: "insensitive" } },
          { designation: { contains: trimmed, mode: "insensitive" } },
          { chamberName: { contains: trimmed, mode: "insensitive" } },
        ],
      });
    }

    const [total, data] = await Promise.all([
      prisma.doctor.count({ where }),
      prisma.doctor.findMany({
        where,
        orderBy: { name: "asc" },
        skip,
        take: safeLimit,
      }),
    ]);

    if (total === 0 && safePage === 1) {
      const fallbackList = filterFallback();
      const paginated = fallbackList.slice(skip, skip + safeLimit);
      return {
        success: true,
        doctors: paginated,
        hasMore: fallbackList.length > skip + safeLimit,
        total: fallbackList.length,
      };
    }

    return {
      success: true,
      doctors: data.map(formatDoctor),
      hasMore: total > skip + data.length,
      total,
    };
  } catch (error) {
    logger.error("Error in getAvailableDoctorsToLinkAction:", error);
    const fallbackList = filterFallback();
    const paginated = fallbackList.slice(skip, skip + safeLimit);
    return {
      success: true,
      doctors: paginated,
      hasMore: fallbackList.length > skip + safeLimit,
      total: fallbackList.length,
    };
  }
}

/**
 * Link an existing doctor to this partner's chamber.
 */
export async function linkDoctorToPartnerAction(
  doctorId: string,
  chamberData: PartnerDoctorChamberInput
): Promise<{ success: boolean; error?: string }> {
  const partnerId = await getAuthenticatedPartnerId();
  if (!partnerId) {
    return { success: false, error: "অননুমোদিত অ্যাক্সেস।" };
  }

  try {
    const partner = await prisma.partner.findUnique({
      where: { id: partnerId },
      select: { name: true, address: true, phone: true, upazila: true },
    });

    if (!partner) {
      return { success: false, error: "পার্টনার খুঁজে পাওয়া যায়নি।" };
    }

    const existingDoctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
    });

    if (!existingDoctor) {
      const initDoc = initialDoctors.find((d) => d.id === doctorId);
      if (initDoc) {
        await prisma.doctor.create({
          data: {
            id: initDoc.id,
            name: initDoc.name,
            specialty: initDoc.specialty,
            department: initDoc.department,
            degrees: initDoc.degrees,
            designation: initDoc.designation,
            chamberName: partner.name,
            chamberAddress: partner.address,
            roomNo: chamberData.roomNo?.trim() || initDoc.roomNo || null,
            visitingDays: chamberData.visitingDays?.trim() || initDoc.visitingDays,
            visitingHours: chamberData.visitingHours?.trim() || initDoc.visitingHours,
            serialPhone: chamberData.serialPhone?.trim() || partner.phone || initDoc.serialPhone,
            consultationFee: chamberData.consultationFee !== undefined ? chamberData.consultationFee.trim() || null : initDoc.consultationFee || null,
            imageUrl: initDoc.imageUrl || null,
            partnerId,
            upazila: partner.upazila || initDoc.upazila || "feni-sadar",
            isActive: true,
            availableToday: initDoc.availableToday ?? true,
            notice: initDoc.notice || null,
          },
        });
        return { success: true };
      }
      return { success: false, error: "ডাক্তার খুঁজে পাওয়া যায়নি।" };
    }

    await prisma.doctor.update({
      where: { id: doctorId },
      data: {
        partnerId,
        chamberName: partner.name,
        chamberAddress: partner.address,
        upazila: partner.upazila || "feni-sadar",
        roomNo: chamberData.roomNo?.trim() || null,
        ...(chamberData.visitingDays?.trim() && { visitingDays: chamberData.visitingDays.trim() }),
        ...(chamberData.visitingHours?.trim() && { visitingHours: chamberData.visitingHours.trim() }),
        ...(chamberData.serialPhone?.trim() ? { serialPhone: chamberData.serialPhone.trim() } : { serialPhone: partner.phone }),
        ...(chamberData.consultationFee !== undefined && { consultationFee: chamberData.consultationFee.trim() || null }),
      },
    });

    return { success: true };
  } catch (error) {
    logger.error("Error in linkDoctorToPartnerAction:", error);
    return { success: false, error: "ডাক্তার লিঙ্ক করতে সমস্যা হয়েছে।" };
  } finally {
    updateTag(DOCTORS_TAG);
    updateTag(PARTNERS_TAG);
    updateTag("admin-stats");
  }
}

/**
 * Unlink a doctor from this partner's chamber.
 */
export async function unlinkDoctorFromPartnerAction(
  doctorId: string
): Promise<{ success: boolean; error?: string }> {
  const partnerId = await getAuthenticatedPartnerId();
  if (!partnerId) {
    return { success: false, error: "অননুমোদিত অ্যাক্সেস।" };
  }

  try {
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
      select: { partnerId: true },
    });

    if (!doctor || doctor.partnerId !== partnerId) {
      return { success: false, error: "এই ডাক্তার আপনার চেম্বারের অন্তর্ভুক্ত নয়।" };
    }

    await prisma.doctor.update({
      where: { id: doctorId },
      data: {
        partnerId: null,
        roomNo: null,
      },
    });

    return { success: true };
  } catch (error) {
    logger.error("Error in unlinkDoctorFromPartnerAction:", error);
    return { success: false, error: "ডাক্তার আনলিঙ্ক করতে সমস্যা হয়েছে।" };
  } finally {
    updateTag(DOCTORS_TAG);
    updateTag(PARTNERS_TAG);
    updateTag("admin-stats");
  }
}

/**
 * Add a new specialist doctor directly to this partner's chamber.
 */
export async function addPartnerDoctorAction(
  input: AddPartnerDoctorInput
): Promise<{ success: boolean; doctor?: Doctor; error?: string }> {
  const partnerId = await getAuthenticatedPartnerId();
  if (!partnerId) {
    return { success: false, error: "অননুমোদিত অ্যাক্সেস।" };
  }

  if (
    !input.name?.trim() ||
    !input.specialty?.trim() ||
    !input.department?.trim() ||
    !input.visitingDays?.trim() ||
    !input.visitingHours?.trim() ||
    !input.serialPhone?.trim()
  ) {
    return { success: false, error: "অনুগ্রহ করে সকল আবশ্যকীয় তথ্য পূরণ করুন।" };
  }

  try {
    const partner = await prisma.partner.findUnique({
      where: { id: partnerId },
      select: { name: true, address: true, upazila: true },
    });

    if (!partner) {
      return { success: false, error: "পার্টনার খুঁজে পাওয়া যায়নি।" };
    }

    const newDocId = `doc_${crypto.randomUUID().slice(0, 8)}`;
    const created = await prisma.doctor.create({
      data: {
        id: newDocId,
        name: input.name.trim(),
        specialty: input.specialty.trim(),
        department: input.department.trim(),
        degrees: input.degrees?.trim() || "",
        designation: input.designation?.trim() || "",
        chamberName: partner.name,
        chamberAddress: partner.address,
        roomNo: input.roomNo?.trim() || null,
        visitingDays: input.visitingDays.trim(),
        visitingHours: input.visitingHours.trim(),
        serialPhone: input.serialPhone.trim(),
        consultationFee: input.consultationFee?.trim() || null,
        imageUrl: input.imageUrl?.trim() || null,
        partnerId,
        upazila: input.upazila || partner.upazila || "feni-sadar",
        isActive: input.isActive ?? true,
        availableToday: input.availableToday ?? true,
        onLeaveUntil: input.onLeaveUntil ? new Date(input.onLeaveUntil) : null,
        notice: input.notice ? input.notice.trim() || null : null,
      },
    });

    return {
      success: true,
      doctor: formatDoctor(created),
    };
  } catch (error) {
    logger.error("Error in addPartnerDoctorAction:", error);
    return { success: false, error: "নতুন ডাক্তার যুক্ত করতে সমস্যা হয়েছে।" };
  } finally {
    updateTag(DOCTORS_TAG);
    updateTag(PARTNERS_TAG);
    updateTag("admin-stats");
  }
}

/**
 * Update chamber details & schedule for a doctor linked to this partner.
 */
export async function updatePartnerDoctorChamberAction(
  doctorId: string,
  input: UpdatePartnerDoctorInput
): Promise<{ success: boolean; error?: string }> {
  const partnerId = await getAuthenticatedPartnerId();
  if (!partnerId) {
    return { success: false, error: "অননুমোদিত অ্যাক্সেস।" };
  }

  try {
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
      select: { partnerId: true },
    });

    if (!doctor || doctor.partnerId !== partnerId) {
      return { success: false, error: "এই ডাক্তার আপনার চেম্বারের তালিকাভুক্ত নয়।" };
    }

    await prisma.doctor.update({
      where: { id: doctorId },
      data: {
        ...(input.name && { name: input.name.trim() }),
        ...(input.specialty && { specialty: input.specialty.trim() }),
        ...(input.department && { department: input.department.trim() }),
        ...(input.degrees !== undefined && { degrees: input.degrees.trim() }),
        ...(input.designation !== undefined && { designation: input.designation.trim() }),
        ...(input.roomNo !== undefined && { roomNo: input.roomNo.trim() || null }),
        ...(input.visitingDays && { visitingDays: input.visitingDays.trim() }),
        ...(input.visitingHours && { visitingHours: input.visitingHours.trim() }),
        ...(input.serialPhone && { serialPhone: input.serialPhone.trim() }),
        ...(input.consultationFee !== undefined && { consultationFee: input.consultationFee.trim() || null }),
        ...(input.imageUrl !== undefined && { imageUrl: input.imageUrl.trim() || null }),
        ...(input.upazila !== undefined && { upazila: input.upazila || "feni-sadar" }),
        ...(input.isActive !== undefined && { isActive: input.isActive }),
        ...(input.availableToday !== undefined && { availableToday: input.availableToday }),
        ...(input.onLeaveUntil !== undefined && { onLeaveUntil: input.onLeaveUntil ? new Date(input.onLeaveUntil) : null }),
        ...(input.notice !== undefined && { notice: input.notice ? input.notice.trim() || null : null }),
      },
    });

    return { success: true };
  } catch (error) {
    logger.error("Error in updatePartnerDoctorChamberAction:", error);
    return { success: false, error: "চেম্বার তথ্য আপডেট করতে সমস্যা হয়েছে।" };
  } finally {
    updateTag(DOCTORS_TAG);
    updateTag(PARTNERS_TAG);
    updateTag("admin-stats");
  }
}

/**
 * Delete a doctor created by this partner, or unlink if it is a central directory doctor.
 */
export async function deletePartnerDoctorAction(
  doctorId: string
): Promise<{ success: boolean; error?: string }> {
  const partnerId = await getAuthenticatedPartnerId();
  if (!partnerId) {
    return { success: false, error: "অননুমোদিত অ্যাক্সেস।" };
  }

  try {
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
      select: { id: true, partnerId: true },
    });

    if (!doctor || doctor.partnerId !== partnerId) {
      return { success: false, error: "এই ডাক্তার আপনার চেম্বারের অন্তর্ভুক্ত নয়।" };
    }

    const isCentralDoctor = initialDoctors.some((d) => d.id === doctorId);

    if (isCentralDoctor) {
      await prisma.doctor.update({
        where: { id: doctorId },
        data: {
          partnerId: null,
          roomNo: null,
        },
      });
    } else {
      await prisma.doctor.delete({
        where: { id: doctorId },
      });
    }

    return { success: true };
  } catch (error) {
    logger.error("Error in deletePartnerDoctorAction:", error);
    return { success: false, error: "ডাক্তার মুছে ফেলতে সমস্যা হয়েছে।" };
  } finally {
    updateTag(DOCTORS_TAG);
    updateTag(PARTNERS_TAG);
    updateTag("admin-stats");
  }
}
