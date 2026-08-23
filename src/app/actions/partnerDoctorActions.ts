"use server";

import { prisma } from "@/lib/prisma";
import { Doctor } from "@/services/db";
import { getSessionUser } from "@/lib/session";
import { logger } from "@/lib/logger";
import { updateTag } from "next/cache";

const DOCTORS_TAG = "doctors";
const PARTNERS_TAG = "partners";

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
  isActive?: boolean;
}

export interface UpdatePartnerDoctorInput {
  name?: string;
  specialty?: string;
  department?: string;
  degrees?: string;
  designation?: string;
  roomNo?: string;
  visitingDays?: string;
  visitingHours?: string;
  serialPhone?: string;
  consultationFee?: string;
  imageUrl?: string;
  isActive?: boolean;
}

/**
 * Fetch all doctors practicing in the logged-in partner's hospital/chamber.
 */
export async function getPartnerDoctorsAction(): Promise<{
  success: boolean;
  doctors: Doctor[];
  error?: string;
}> {
  const session = await getSessionUser();
  if (!session || session.role !== "partner") {
    return { success: false, doctors: [], error: "অননুমোদিত অ্যাক্সেস।" };
  }

  try {
    const data = await prisma.doctor.findMany({
      where: { partnerId: session.userId },
      orderBy: { createdAt: "desc" },
    });

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

    return { success: true, doctors };
  } catch (error) {
    logger.error("Error in getPartnerDoctorsAction:", error);
    return { success: false, doctors: [], error: "ডাক্তারদের তালিকা লোড করতে সমস্যা হয়েছে।" };
  }
}

/**
 * Fetch active doctors available to be linked to this partner.
 */
export async function getAvailableDoctorsToLinkAction(search?: string): Promise<{
  success: boolean;
  doctors: Doctor[];
  error?: string;
}> {
  const session = await getSessionUser();
  if (!session || session.role !== "partner") {
    return { success: false, doctors: [], error: "অননুমোদিত অ্যাক্সেস।" };
  }

  try {
    const trimmed = search?.trim();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      isActive: true,
      NOT: { partnerId: session.userId },
    };

    if (trimmed) {
      where.OR = [
        { name: { contains: trimmed, mode: "insensitive" } },
        { specialty: { contains: trimmed, mode: "insensitive" } },
        { department: { contains: trimmed, mode: "insensitive" } },
        { degrees: { contains: trimmed, mode: "insensitive" } },
      ];
    }

    const data = await prisma.doctor.findMany({
      where,
      orderBy: { name: "asc" },
      take: 20,
    });

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

    return { success: true, doctors };
  } catch (error) {
    logger.error("Error in getAvailableDoctorsToLinkAction:", error);
    return { success: false, doctors: [], error: "ডাক্তারদের তালিকা পেতে সমস্যা হয়েছে।" };
  }
}

/**
 * Link an existing doctor to this partner's chamber.
 */
export async function linkDoctorToPartnerAction(
  doctorId: string,
  chamberData: PartnerDoctorChamberInput
): Promise<{ success: boolean; error?: string }> {
  const session = await getSessionUser();
  if (!session || session.role !== "partner") {
    return { success: false, error: "অননুমোদিত অ্যাক্সেস।" };
  }

  try {
    const partner = await prisma.partner.findUnique({
      where: { id: session.userId },
      select: { name: true, address: true, phone: true },
    });

    if (!partner) {
      return { success: false, error: "পার্টনার খুঁজে পাওয়া যায়নি।" };
    }

    await prisma.doctor.update({
      where: { id: doctorId },
      data: {
        partnerId: session.userId,
        chamberName: partner.name,
        chamberAddress: partner.address,
        roomNo: chamberData.roomNo?.trim() || null,
        ...(chamberData.visitingDays?.trim() && { visitingDays: chamberData.visitingDays.trim() }),
        ...(chamberData.visitingHours?.trim() && { visitingHours: chamberData.visitingHours.trim() }),
        ...(chamberData.serialPhone?.trim()
          ? { serialPhone: chamberData.serialPhone.trim() }
          : { serialPhone: partner.phone }),
        ...(chamberData.consultationFee !== undefined && {
          consultationFee: chamberData.consultationFee.trim() || null,
        }),
      },
    });

    return { success: true };
  } catch (error) {
    logger.error("Error in linkDoctorToPartnerAction:", error);
    return { success: false, error: "ডাক্তার লিঙ্ক করতে সমস্যা হয়েছে।" };
  } finally {
    updateTag(DOCTORS_TAG);
    updateTag(PARTNERS_TAG);
  }
}

/**
 * Unlink a doctor from this partner's chamber.
 */
export async function unlinkDoctorFromPartnerAction(
  doctorId: string
): Promise<{ success: boolean; error?: string }> {
  const session = await getSessionUser();
  if (!session || session.role !== "partner") {
    return { success: false, error: "অননুমোদিত অ্যাক্সেস।" };
  }

  try {
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
      select: { partnerId: true },
    });

    if (!doctor || doctor.partnerId !== session.userId) {
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
  }
}

/**
 * Add a new specialist doctor directly to this partner's chamber.
 */
export async function addPartnerDoctorAction(
  input: AddPartnerDoctorInput
): Promise<{ success: boolean; doctor?: Doctor; error?: string }> {
  const session = await getSessionUser();
  if (!session || session.role !== "partner") {
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
      where: { id: session.userId },
      select: { name: true, address: true },
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
        partnerId: session.userId,
        isActive: input.isActive ?? true,
      },
    });

    return {
      success: true,
      doctor: {
        id: created.id,
        name: created.name,
        specialty: created.specialty,
        department: created.department,
        degrees: created.degrees,
        designation: created.designation,
        chamberName: created.chamberName,
        chamberAddress: created.chamberAddress,
        roomNo: created.roomNo || undefined,
        visitingDays: created.visitingDays,
        visitingHours: created.visitingHours,
        serialPhone: created.serialPhone,
        consultationFee: created.consultationFee || undefined,
        imageUrl: created.imageUrl || undefined,
        partnerId: created.partnerId || undefined,
        isActive: created.isActive,
      },
    };
  } catch (error) {
    logger.error("Error in addPartnerDoctorAction:", error);
    return { success: false, error: "নতুন ডাক্তার যুক্ত করতে সমস্যা হয়েছে।" };
  } finally {
    updateTag(DOCTORS_TAG);
    updateTag(PARTNERS_TAG);
  }
}

/**
 * Update chamber details & schedule for a doctor linked to this partner.
 */
export async function updatePartnerDoctorChamberAction(
  doctorId: string,
  input: UpdatePartnerDoctorInput
): Promise<{ success: boolean; error?: string }> {
  const session = await getSessionUser();
  if (!session || session.role !== "partner") {
    return { success: false, error: "অননুমোদিত অ্যাক্সেস।" };
  }

  try {
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
      select: { partnerId: true },
    });

    if (!doctor || doctor.partnerId !== session.userId) {
      return { success: false, error: "এই ডাক্তার আপনার চেম্বারের তালিকাভুক্ত নয়।" };
    }

    await prisma.doctor.update({
      where: { id: doctorId },
      data: {
        ...(input.name !== undefined && { name: input.name.trim() }),
        ...(input.specialty !== undefined && { specialty: input.specialty.trim() }),
        ...(input.department !== undefined && { department: input.department.trim() }),
        ...(input.degrees !== undefined && { degrees: input.degrees.trim() }),
        ...(input.designation !== undefined && { designation: input.designation.trim() }),
        ...(input.roomNo !== undefined && { roomNo: input.roomNo.trim() || null }),
        ...(input.visitingDays !== undefined && { visitingDays: input.visitingDays.trim() }),
        ...(input.visitingHours !== undefined && { visitingHours: input.visitingHours.trim() }),
        ...(input.serialPhone !== undefined && { serialPhone: input.serialPhone.trim() }),
        ...(input.consultationFee !== undefined && {
          consultationFee: input.consultationFee.trim() || null,
        }),
        ...(input.imageUrl !== undefined && { imageUrl: input.imageUrl.trim() || null }),
        ...(input.isActive !== undefined && { isActive: input.isActive }),
      },
    });

    return { success: true };
  } catch (error) {
    logger.error("Error in updatePartnerDoctorChamberAction:", error);
    return { success: false, error: "চেম্বার তথ্য আপডেট করতে সমস্যা হয়েছে।" };
  } finally {
    updateTag(DOCTORS_TAG);
    updateTag(PARTNERS_TAG);
  }
}

/**
 * Delete a doctor created by this partner.
 */
export async function deletePartnerDoctorAction(
  doctorId: string
): Promise<{ success: boolean; error?: string }> {
  const session = await getSessionUser();
  if (!session || session.role !== "partner") {
    return { success: false, error: "অননুমোদিত অ্যাক্সেস।" };
  }

  try {
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
      select: { partnerId: true },
    });

    if (!doctor || doctor.partnerId !== session.userId) {
      return { success: false, error: "এই ডাক্তার আপনার চেম্বারের অন্তর্ভুক্ত নয়।" };
    }

    await prisma.doctor.delete({
      where: { id: doctorId },
    });

    return { success: true };
  } catch (error) {
    logger.error("Error in deletePartnerDoctorAction:", error);
    return { success: false, error: "ডাক্তার মুছে ফেলতে সমস্যা হয়েছে।" };
  } finally {
    updateTag(DOCTORS_TAG);
    updateTag(PARTNERS_TAG);
  }
}
