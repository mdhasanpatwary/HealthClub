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
  INITIAL_EMERGENCY_HOTLINES,
} from "@/data/emergencyData";
import { PaginatedResult } from "@/types/pagination";

const EMERGENCY_TAG = "emergency-data";

async function verifyAdmin(): Promise<boolean> {
  const session = await getSessionUser();
  return !!(session && session.role === "admin");
}

async function saveEmergencySetting(key: string, data: unknown) {
  await prisma.systemSetting.upsert({
    where: { key },
    create: { key, value: JSON.stringify(data) },
    update: { value: JSON.stringify(data) },
  });
  updateTag(EMERGENCY_TAG);
  revalidateTag(EMERGENCY_TAG, "max");
  revalidatePath("/emergency");
  revalidatePath("/admin");
  revalidatePath("/admin/emergency");
}

export interface GetPaginatedHotlinesAdminParams {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
}

export async function getPaginatedHotlinesAdminAction(
  params?: GetPaginatedHotlinesAdminParams
): Promise<PaginatedResult<EmergencyHotline>> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") {
    return { data: [], totalItems: 0, totalPages: 1, currentPage: 1, pageSize: params?.pageSize || 10 };
  }

  const { hotlines } = await getEmergencyDataAction();
  const page = Math.max(1, params?.page || 1);
  const pageSize = Math.max(1, params?.pageSize || 10);
  const search = params?.search?.trim().toLowerCase();
  const category = params?.category;

  let filtered = hotlines;
  if (category && category !== "all") {
    filtered = filtered.filter((h) => h.category === category);
  }
  if (search) {
    filtered = filtered.filter(
      (h) =>
        h.titleBn.toLowerCase().includes(search) ||
        h.titleEn.toLowerCase().includes(search) ||
        h.phone.toLowerCase().includes(search) ||
        (h.descriptionBn && h.descriptionBn.toLowerCase().includes(search)) ||
        (h.descriptionEn && h.descriptionEn.toLowerCase().includes(search))
    );
  }

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = (page - 1) * pageSize;
  const data = filtered.slice(startIndex, startIndex + pageSize);

  return {
    data,
    totalItems,
    totalPages,
    currentPage: page,
    pageSize,
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
  if (!session || session.role !== "admin") {
    return { data: [], totalItems: 0, totalPages: 1, currentPage: 1, pageSize: params?.pageSize || 10 };
  }

  const { bloodDonors } = await getEmergencyDataAction();
  const page = Math.max(1, params?.page || 1);
  const pageSize = Math.max(1, params?.pageSize || 10);
  const search = params?.search?.trim().toLowerCase();
  const bloodGroup = params?.bloodGroup || params?.group;
  const upazila = params?.upazila || params?.area;
  const status = params?.status;

  let filtered = bloodDonors;
  if (status && status !== "all") {
    if (status === "pending") {
      filtered = filtered.filter((d) => d.status === "pending");
    } else if (status === "approved") {
      filtered = filtered.filter((d) => d.status !== "pending");
    }
  }
  if (bloodGroup && bloodGroup !== "all") {
    filtered = filtered.filter((d) => d.bloodGroup === bloodGroup);
  }
  if (upazila && upazila !== "all") {
    filtered = filtered.filter((d) => d.upazila === upazila);
  }
  if (search) {
    filtered = filtered.filter(
      (d) =>
        d.name.toLowerCase().includes(search) ||
        d.phone.toLowerCase().includes(search) ||
        d.upazila.toLowerCase().includes(search) ||
        d.bloodGroup.toLowerCase().includes(search)
    );
  }

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = (page - 1) * pageSize;
  const data = filtered.slice(startIndex, startIndex + pageSize);

  return {
    data,
    totalItems,
    totalPages,
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
  if (!session || session.role !== "admin") {
    return { data: [], totalItems: 0, totalPages: 1, currentPage: 1, pageSize: params?.pageSize || 10 };
  }

  const { ambulances } = await getEmergencyDataAction();
  const page = Math.max(1, params?.page || 1);
  const pageSize = Math.max(1, params?.pageSize || 10);
  const search = params?.search?.trim().toLowerCase();
  const location = params?.location || params?.area;
  const type = params?.type;
  const status = params?.status;

  let filtered = ambulances;
  if (status && status !== "all") {
    if (status === "pending") {
      filtered = filtered.filter((a) => a.status === "pending");
    } else if (status === "approved") {
      filtered = filtered.filter((a) => a.status !== "pending");
    }
  }
  if (type && type !== "all") {
    filtered = filtered.filter((a) => a.type === type);
  }
  if (location && location !== "all") {
    filtered = filtered.filter((a) => a.location === location);
  }
  if (search) {
    filtered = filtered.filter(
      (a) =>
        a.name.toLowerCase().includes(search) ||
        a.location.toLowerCase().includes(search) ||
        a.phone.toLowerCase().includes(search) ||
        a.type.toLowerCase().includes(search)
    );
  }

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = (page - 1) * pageSize;
  const data = filtered.slice(startIndex, startIndex + pageSize);

  return {
    data,
    totalItems,
    totalPages,
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
      if (!prisma?.systemSetting) {
        return {
          bloodDonors: INITIAL_BLOOD_DONORS,
          ambulances: INITIAL_AMBULANCES,
          hotlines: INITIAL_EMERGENCY_HOTLINES,
        };
      }

      const settings = await prisma.systemSetting.findMany({
        where: {
          key: {
            in: ["emergency_donors", "emergency_ambulances", "emergency_hotlines"],
          },
        },
      });

      const map = new Map(settings.map((s) => [s.key, s.value]));

      let bloodDonors = INITIAL_BLOOD_DONORS;
      let ambulances = INITIAL_AMBULANCES;
      let hotlines = INITIAL_EMERGENCY_HOTLINES;

      if (map.has("emergency_donors")) {
        try {
          const parsed = JSON.parse(map.get("emergency_donors")!);
          if (Array.isArray(parsed) && parsed.length > 0) {
            bloodDonors = parsed;
          }
        } catch (e) {
          logger.error("Failed to parse emergency_donors", e);
        }
      }

      if (map.has("emergency_ambulances")) {
        try {
          const parsed = JSON.parse(map.get("emergency_ambulances")!);
          if (Array.isArray(parsed) && parsed.length > 0) {
            ambulances = parsed;
          }
        } catch (e) {
          logger.error("Failed to parse emergency_ambulances", e);
        }
      }

      if (map.has("emergency_hotlines")) {
        try {
          const parsed = JSON.parse(map.get("emergency_hotlines")!);
          if (Array.isArray(parsed) && parsed.length > 0) {
            hotlines = parsed;
          }
        } catch (e) {
          logger.error("Failed to parse emergency_hotlines", e);
        }
      }

      return { bloodDonors, ambulances, hotlines };
    } catch (err) {
      logger.error("Error in getEmergencyDataAction:", err);
      return {
        bloodDonors: INITIAL_BLOOD_DONORS,
        ambulances: INITIAL_AMBULANCES,
        hotlines: INITIAL_EMERGENCY_HOTLINES,
      };
    }
  },
  ["all-emergency-data-v4"],
  { tags: [EMERGENCY_TAG], revalidate: 60 }
);

// --- BLOOD DONORS ---

export async function saveBloodDonorAction(donor: BloodDonor) {
  try {
    if (!await verifyAdmin()) return { success: false, error: "অননুমোদিত অ্যাক্সেস।" };
    const data = await getEmergencyDataAction();
    const existingIndex = data.bloodDonors.findIndex((d) => d.id === donor.id);
    let updatedList: BloodDonor[];

    const donorToSave: BloodDonor = {
      ...donor,
      status: donor.status || "approved",
    };

    if (existingIndex >= 0) {
      updatedList = [...data.bloodDonors];
      updatedList[existingIndex] = donorToSave;
    } else {
      updatedList = [donorToSave, ...data.bloodDonors];
    }

    await saveEmergencySetting("emergency_donors", updatedList);
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

export async function approveBloodDonorAction(id: string) {
  try {
    if (!await verifyAdmin()) return { success: false, error: "অননুমোদিত অ্যাক্সেস।" };
    const data = await getEmergencyDataAction();
    const updatedList = data.bloodDonors.map((d) =>
      d.id === id ? { ...d, status: "approved" as const } : d
    );
    await saveEmergencySetting("emergency_donors", updatedList);
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

export async function deleteBloodDonorAction(id: string) {
  try {
    if (!await verifyAdmin()) return { success: false, error: "অননুমোদিত অ্যাক্সেস।" };
    const data = await getEmergencyDataAction();
    const updatedList = data.bloodDonors.filter((d) => d.id !== id);
    await saveEmergencySetting("emergency_donors", updatedList);
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

export async function toggleBloodDonorAvailabilityAction(id: string) {
  try {
    if (!await verifyAdmin()) return { success: false, error: "অননুমোদিত অ্যাক্সেস।" };
    const data = await getEmergencyDataAction();
    const updatedList = data.bloodDonors.map((d) =>
      d.id === id ? { ...d, isAvailable: !d.isAvailable } : d
    );
    await saveEmergencySetting("emergency_donors", updatedList);
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

// --- AMBULANCE SERVICES ---

export async function saveAmbulanceAction(ambulance: AmbulanceService) {
  try {
    if (!await verifyAdmin()) return { success: false, error: "অননুমোদিত অ্যাক্সেস।" };
    const data = await getEmergencyDataAction();
    const existingIndex = data.ambulances.findIndex((a) => a.id === ambulance.id);
    let updatedList: AmbulanceService[];

    const ambulanceToSave: AmbulanceService = {
      ...ambulance,
      status: ambulance.status || "approved",
    };

    if (existingIndex >= 0) {
      updatedList = [...data.ambulances];
      updatedList[existingIndex] = ambulanceToSave;
    } else {
      updatedList = [ambulanceToSave, ...data.ambulances];
    }

    await saveEmergencySetting("emergency_ambulances", updatedList);
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

export async function approveAmbulanceAction(id: string) {
  try {
    if (!await verifyAdmin()) return { success: false, error: "অননুমোদিত অ্যাক্সেস।" };
    const data = await getEmergencyDataAction();
    const updatedList = data.ambulances.map((a) =>
      a.id === id ? { ...a, status: "approved" as const } : a
    );
    await saveEmergencySetting("emergency_ambulances", updatedList);
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

export async function deleteAmbulanceAction(id: string) {
  try {
    if (!await verifyAdmin()) return { success: false, error: "অননুমোদিত অ্যাক্সেস।" };
    const data = await getEmergencyDataAction();
    const updatedList = data.ambulances.filter((a) => a.id !== id);
    await saveEmergencySetting("emergency_ambulances", updatedList);
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

// --- HOTLINES & OXYGEN ---

export async function saveHotlineAction(hotline: EmergencyHotline) {
  try {
    if (!await verifyAdmin()) return { success: false, error: "অননুমোদিত অ্যাক্সেস।" };
    const data = await getEmergencyDataAction();
    const existingIndex = data.hotlines.findIndex((h) => h.id === hotline.id);
    let updatedList: EmergencyHotline[];

    if (existingIndex >= 0) {
      updatedList = [...data.hotlines];
      updatedList[existingIndex] = hotline;
    } else {
      updatedList = [hotline, ...data.hotlines];
    }

    await saveEmergencySetting("emergency_hotlines", updatedList);
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

export async function deleteHotlineAction(id: string) {
  try {
    if (!await verifyAdmin()) return { success: false, error: "অননুমোদিত অ্যাক্সেস।" };
    const data = await getEmergencyDataAction();
    const updatedList = data.hotlines.filter((h) => h.id !== id);
    await saveEmergencySetting("emergency_hotlines", updatedList);
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}
