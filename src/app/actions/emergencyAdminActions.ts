"use server";

import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { logger } from "@/lib/logger";
import { unstable_cache, updateTag, revalidateTag, revalidatePath } from "next/cache";
import {
  BloodDonor,
  AmbulanceService,
  EmergencyHotline,
  INITIAL_BLOOD_DONORS,
  INITIAL_AMBULANCES,
} from "@/data/emergencyData";
import { PaginatedResult } from "@/types/pagination";
import { hasAdminPermission } from "@/lib/permissions";
import { getHotlinesList } from "./emergencyHotlineActions";
import { Prisma } from "@/generated/client/client";

const EMERGENCY_TAG = "emergency-data";

async function verifyAdmin(): Promise<boolean> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") return false;
  const role = session.adminRole || "super_admin";
  return hasAdminPermission(role, "manage_emergency");
}

function revalidateEmergencyCaches() {
  updateTag(EMERGENCY_TAG);
  updateTag("admin-stats");
  revalidateTag(EMERGENCY_TAG, "max");
  revalidatePath("/emergency");
  revalidatePath("/admin");
  revalidatePath("/admin/emergency");
}

function mapDonorRow(r: {
  id: string;
  name: string;
  bloodGroup: string;
  upazila: string;
  phone: string;
  lastDonated: string;
  isAvailable: boolean;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}): BloodDonor {
  return {
    id: r.id,
    name: r.name,
    bloodGroup: r.bloodGroup as BloodDonor["bloodGroup"],
    upazila: r.upazila,
    phone: r.phone,
    lastDonated: r.lastDonated,
    isAvailable: r.isAvailable,
    status: r.status as BloodDonor["status"],
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  };
}

function mapAmbulanceRow(r: {
  id: string;
  name: string;
  type: string;
  location: string;
  phone: string;
  availableHours: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}): AmbulanceService {
  return {
    id: r.id,
    name: r.name,
    type: r.type as AmbulanceService["type"],
    location: r.location,
    phone: r.phone,
    availableHours: r.availableHours,
    status: r.status as AmbulanceService["status"],
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  };
}

export interface GetPaginatedDonorsAdminParams {
  page?: number;
  pageSize?: number;
  search?: string;
  group?: string;
  bloodGroup?: string;
  upazila?: string;
  area?: string;
  status?: string;
}

export async function getPaginatedDonorsAdminAction(
  params?: GetPaginatedDonorsAdminParams
): Promise<PaginatedResult<BloodDonor>> {
  const session = await getSessionUser();
  if (
    !session ||
    session.role !== "admin" ||
    !hasAdminPermission(session.adminRole || "super_admin", "manage_emergency")
  ) {
    return { data: [], totalItems: 0, totalPages: 1, currentPage: 1, pageSize: params?.pageSize || 10 };
  }

  const page = Math.max(1, params?.page || 1);
  const pageSize = Math.max(1, params?.pageSize || 10);
  const search = params?.search?.trim();
  const bloodGroup = params?.bloodGroup || params?.group;
  const upazila = params?.upazila || params?.area;
  const status = params?.status;

  const where: Prisma.BloodDonorWhereInput = {};

  if (status && status !== "all") {
    where.status = status === "pending" ? "pending" : { not: "pending" };
  }
  if (bloodGroup && bloodGroup !== "all") where.bloodGroup = bloodGroup;
  if (upazila && upazila !== "all") where.upazila = upazila;

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
      { upazila: { contains: search, mode: "insensitive" } },
      { bloodGroup: { contains: search, mode: "insensitive" } },
    ];
  }

  const startIndex = (page - 1) * pageSize;
  const [totalItems, rows] = await Promise.all([
    prisma.bloodDonor.count({ where }),
    prisma.bloodDonor.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: startIndex,
      take: pageSize,
    }),
  ]);

  return {
    data: rows.map(mapDonorRow),
    totalItems,
    totalPages: Math.max(1, Math.ceil(totalItems / pageSize)),
    currentPage: page,
    pageSize,
  };
}

export interface GetPaginatedAmbulancesAdminParams {
  page?: number;
  pageSize?: number;
  search?: string;
  location?: string;
  area?: string;
  type?: string;
  status?: string;
}

export async function getPaginatedAmbulancesAdminAction(
  params?: GetPaginatedAmbulancesAdminParams
): Promise<PaginatedResult<AmbulanceService>> {
  const session = await getSessionUser();
  if (
    !session ||
    session.role !== "admin" ||
    !hasAdminPermission(session.adminRole || "super_admin", "manage_emergency")
  ) {
    return { data: [], totalItems: 0, totalPages: 1, currentPage: 1, pageSize: params?.pageSize || 10 };
  }

  const page = Math.max(1, params?.page || 1);
  const pageSize = Math.max(1, params?.pageSize || 10);
  const search = params?.search?.trim();
  const location = params?.location || params?.area;
  const type = params?.type;
  const status = params?.status;

  const where: Prisma.AmbulanceServiceWhereInput = {};

  if (status && status !== "all") {
    where.status = status === "pending" ? "pending" : { not: "pending" };
  }
  if (type && type !== "all") where.type = type;
  if (location && location !== "all") {
    where.location = { contains: location, mode: "insensitive" };
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { location: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
      { type: { contains: search, mode: "insensitive" } },
    ];
  }

  const startIndex = (page - 1) * pageSize;
  const [totalItems, rows] = await Promise.all([
    prisma.ambulanceService.count({ where }),
    prisma.ambulanceService.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: startIndex,
      take: pageSize,
    }),
  ]);

  return {
    data: rows.map(mapAmbulanceRow),
    totalItems,
    totalPages: Math.max(1, Math.ceil(totalItems / pageSize)),
    currentPage: page,
    pageSize,
  };
}

/**
 * Fetch all emergency data (blood donors, ambulances, hotlines).
 * Cached via Next.js ISR tags.
 */
export const getEmergencyDataAction = unstable_cache(
  async (): Promise<{
    bloodDonors: BloodDonor[];
    ambulances: AmbulanceService[];
    hotlines: EmergencyHotline[];
  }> => {
    try {
      if (!prisma?.bloodDonor || !prisma?.ambulanceService) {
        return {
          bloodDonors: INITIAL_BLOOD_DONORS,
          ambulances: INITIAL_AMBULANCES,
          hotlines: await getHotlinesList(),
        };
      }

      const [donorRows, ambRows, hotlines] = await Promise.all([
        prisma.bloodDonor.findMany({ orderBy: { createdAt: "desc" } }),
        prisma.ambulanceService.findMany({ orderBy: { createdAt: "desc" } }),
        getHotlinesList(),
      ]);

      const bloodDonors = donorRows.map(mapDonorRow);
      const ambulances = ambRows.map(mapAmbulanceRow);

      return {
        bloodDonors: bloodDonors.length > 0 ? bloodDonors : INITIAL_BLOOD_DONORS,
        ambulances: ambulances.length > 0 ? ambulances : INITIAL_AMBULANCES,
        hotlines,
      };
    } catch (err) {
      logger.error("Error in getEmergencyDataAction:", err);
      return {
        bloodDonors: INITIAL_BLOOD_DONORS,
        ambulances: INITIAL_AMBULANCES,
        hotlines: await getHotlinesList(),
      };
    }
  },
  ["all-emergency-data-v5"],
  { tags: [EMERGENCY_TAG], revalidate: 60 }
);

export interface EmergencyCounts {
  donors: number;
  ambulances: number;
  hotlines: number;
  pendingDonors: number;
  pendingAmbulances: number;
}

export async function getEmergencyCountsAdminAction(): Promise<EmergencyCounts> {
  const session = await getSessionUser();
  if (
    !session ||
    session.role !== "admin" ||
    !hasAdminPermission(session.adminRole || "super_admin", "manage_emergency")
  ) {
    return {
      donors: 0,
      ambulances: 0,
      hotlines: 0,
      pendingDonors: 0,
      pendingAmbulances: 0,
    };
  }

  try {
    const [
      totalDonors,
      pendingDonors,
      totalAmbulances,
      pendingAmbulances,
      hotlines,
    ] = await Promise.all([
      prisma.bloodDonor.count(),
      prisma.bloodDonor.count({ where: { status: "pending" } }),
      prisma.ambulanceService.count(),
      prisma.ambulanceService.count({ where: { status: "pending" } }),
      getHotlinesList(),
    ]);

    return {
      donors: totalDonors,
      ambulances: totalAmbulances,
      hotlines: hotlines.length,
      pendingDonors,
      pendingAmbulances,
    };
  } catch (error) {
    logger.error("Error getting emergency counts:", error);
    return {
      donors: 0,
      ambulances: 0,
      hotlines: 0,
      pendingDonors: 0,
      pendingAmbulances: 0,
    };
  }
}

// --- BLOOD DONORS ---

export async function saveBloodDonorAction(donor: BloodDonor) {
  try {
    if (!(await verifyAdmin())) return { success: false, error: "অননুমোদিত অ্যাক্সেস।" };

    const cleanPhone = donor.phone.trim();
    await prisma.bloodDonor.upsert({
      where: { phone: cleanPhone },
      update: {
        name: donor.name.trim(),
        bloodGroup: donor.bloodGroup,
        upazila: donor.upazila,
        lastDonated: donor.lastDonated || "তথ্য নেই",
        isAvailable: donor.isAvailable !== false,
        status: donor.status || "approved",
      },
      create: {
        id: donor.id || `donor-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: donor.name.trim(),
        phone: cleanPhone,
        bloodGroup: donor.bloodGroup,
        upazila: donor.upazila,
        lastDonated: donor.lastDonated || "তথ্য নেই",
        isAvailable: donor.isAvailable !== false,
        status: donor.status || "approved",
      },
    });

    revalidateEmergencyCaches();
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

export async function approveBloodDonorAction(id: string) {
  try {
    if (!(await verifyAdmin())) return { success: false, error: "অননুমোদিত অ্যাক্সেস।" };
    await prisma.bloodDonor.update({
      where: { id },
      data: { status: "approved" },
    });
    revalidateEmergencyCaches();
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

export async function deleteBloodDonorAction(id: string) {
  try {
    if (!(await verifyAdmin())) return { success: false, error: "অননুমোদিত অ্যাক্সেস।" };
    await prisma.bloodDonor.delete({
      where: { id },
    });
    revalidateEmergencyCaches();
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

export async function toggleBloodDonorAvailabilityAction(id: string) {
  try {
    if (!(await verifyAdmin())) return { success: false, error: "অননুমোদিত অ্যাক্সেস।" };
    const current = await prisma.bloodDonor.findUnique({
      where: { id },
      select: { isAvailable: true },
    });
    if (!current) {
      return { success: false, error: "রক্তদাতা খুঁজে পাওয়া যায়নি।" };
    }
    await prisma.bloodDonor.update({
      where: { id },
      data: { isAvailable: !current.isAvailable },
    });
    revalidateEmergencyCaches();
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

// --- AMBULANCE SERVICES ---

export async function saveAmbulanceAction(ambulance: AmbulanceService) {
  try {
    if (!(await verifyAdmin())) return { success: false, error: "অননুমোদিত অ্যাক্সেস।" };

    const cleanPhone = ambulance.phone.trim();
    await prisma.ambulanceService.upsert({
      where: { phone: cleanPhone },
      update: {
        name: ambulance.name.trim(),
        type: ambulance.type,
        location: ambulance.location.trim(),
        availableHours: ambulance.availableHours || "২৪/৭ সার্বক্ষণিক",
        status: ambulance.status || "approved",
      },
      create: {
        id: ambulance.id || `amb-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: ambulance.name.trim(),
        phone: cleanPhone,
        type: ambulance.type,
        location: ambulance.location.trim(),
        availableHours: ambulance.availableHours || "২৪/৭ সার্বক্ষণিক",
        status: ambulance.status || "approved",
      },
    });

    revalidateEmergencyCaches();
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

export async function approveAmbulanceAction(id: string) {
  try {
    if (!(await verifyAdmin())) return { success: false, error: "অননুমোদিত অ্যাক্সেস।" };
    await prisma.ambulanceService.update({
      where: { id },
      data: { status: "approved" },
    });
    revalidateEmergencyCaches();
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

export async function deleteAmbulanceAction(id: string) {
  try {
    if (!(await verifyAdmin())) return { success: false, error: "অননুমোদিত অ্যাক্সেস।" };
    await prisma.ambulanceService.delete({
      where: { id },
    });
    revalidateEmergencyCaches();
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}
