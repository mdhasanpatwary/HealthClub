"use server";

import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { updateTag, revalidateTag, revalidatePath } from "next/cache";
import { EmergencyHotline, INITIAL_EMERGENCY_HOTLINES } from "@/data/emergencyData";
import { PaginatedResult } from "@/types/pagination";
import { hasAdminPermission } from "@/lib/permissions";
import { logger } from "@/lib/logger";

const EMERGENCY_TAG = "emergency-data";

async function verifyAdmin(): Promise<boolean> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") return false;
  const role = session.adminRole || "super_admin";
  return hasAdminPermission(role, "manage_emergency");
}

export async function getHotlinesList(): Promise<EmergencyHotline[]> {
  try {
    const setting = await prisma.systemSetting.findUnique({
      where: { key: "emergency_hotlines" },
    });
    if (setting?.value) {
      const parsed = JSON.parse(setting.value);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    logger.error("Failed to parse emergency_hotlines", err);
  }
  return INITIAL_EMERGENCY_HOTLINES;
}

async function saveHotlinesSetting(hotlines: EmergencyHotline[]) {
  await prisma.systemSetting.upsert({
    where: { key: "emergency_hotlines" },
    create: { key: "emergency_hotlines", value: JSON.stringify(hotlines) },
    update: { value: JSON.stringify(hotlines) },
  });
  updateTag(EMERGENCY_TAG);
  updateTag("admin-stats");
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
  if (!session || session.role !== "admin" || !hasAdminPermission(session.adminRole || "super_admin", "manage_emergency")) {
    return { data: [], totalItems: 0, totalPages: 1, currentPage: 1, pageSize: params?.pageSize || 10 };
  }

  const hotlines = await getHotlinesList();
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

export async function saveHotlineAction(hotline: EmergencyHotline) {
  try {
    if (!(await verifyAdmin())) return { success: false, error: "অননুমোদিত অ্যাক্সেস।" };
    const hotlines = await getHotlinesList();
    const existingIndex = hotlines.findIndex((h) => h.id === hotline.id);
    let updatedList: EmergencyHotline[];

    if (existingIndex >= 0) {
      updatedList = [...hotlines];
      updatedList[existingIndex] = hotline;
    } else {
      updatedList = [hotline, ...hotlines];
    }

    await saveHotlinesSetting(updatedList);
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

export async function deleteHotlineAction(id: string) {
  try {
    if (!(await verifyAdmin())) return { success: false, error: "অননুমোদিত অ্যাক্সেস।" };
    const hotlines = await getHotlinesList();
    const updatedList = hotlines.filter((h) => h.id !== id);
    await saveHotlinesSetting(updatedList);
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}
