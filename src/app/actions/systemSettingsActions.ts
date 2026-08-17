"use server";

import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { unstable_cache, updateTag } from "next/cache";

const SYSTEM_SETTINGS_TAG = "system-settings";

export async function getSystemSettingAction(key: string, defaultValue: string = "false"): Promise<string> {
  try {
    const setting = await prisma.systemSetting.findUnique({
      where: { key },
    });
    return setting ? setting.value : defaultValue;
  } catch (error) {
    console.error(`Error fetching system setting '${key}':`, error);
    return defaultValue;
  }
}

export async function updateSystemSettingAction(key: string, value: string): Promise<boolean> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") {
    return false;
  }

  try {
    await prisma.systemSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
    // Bust the cache so the new value is visible immediately
    updateTag(SYSTEM_SETTINGS_TAG);
    return true;
  } catch (error) {
    console.error(`Error updating system setting '${key}':`, error);
    return false;
  }
}

/**
 * Cached reader for allow_member_tx.
 * Hits the DB at most once per 60 seconds; instantly invalidated on writes
 * via revalidateTag(SYSTEM_SETTINGS_TAG).
 */
const getCachedMemberTxSetting = unstable_cache(
  async (): Promise<string> => {
    try {
      const setting = await prisma.systemSetting.findUnique({
        where: { key: "allow_member_tx" },
        select: { value: true },
      });
      return setting?.value ?? "false";
    } catch {
      return "false";
    }
  },
  ["allow_member_tx"],
  { revalidate: 60, tags: [SYSTEM_SETTINGS_TAG] }
);

export async function getAllSystemSettingsAction(): Promise<Record<string, string>> {
  try {
    const settings = await prisma.systemSetting.findMany();
    const result: Record<string, string> = {};
    for (const item of settings) {
      result[item.key] = item.value;
    }
    return result;
  } catch (error) {
    console.error("Error fetching all system settings:", error);
    return {};
  }
}

export async function updateMultipleSystemSettingsAction(
  settings: Record<string, string>
): Promise<{ success: boolean; message: string }> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") {
    return { success: false, message: "অননুমোদিত অ্যাক্সেস।" };
  }

  try {
    const operations = Object.entries(settings).map(([key, value]) =>
      prisma.systemSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    );

    await prisma.$transaction(operations);
    updateTag(SYSTEM_SETTINGS_TAG);

    return { success: true, message: "সকল সেটিংস সফলভাবে সংরক্ষণ করা হয়েছে।" };
  } catch (error) {
    console.error("Error updating multiple system settings:", error);
    return { success: false, message: "সেটিংস সংরক্ষণ করতে সমস্যা হয়েছে।" };
  }
}

export async function isMemberTxAllowedAction(): Promise<boolean> {
  const value = await getCachedMemberTxSetting();
  return value === "true";
}

export async function setMemberTxAllowedAction(enabled: boolean): Promise<boolean> {
  return updateSystemSettingAction("allow_member_tx", enabled ? "true" : "false");
}

