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
    throw new Error("Unauthorized");
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

export async function isMemberTxAllowedAction(): Promise<boolean> {
  const value = await getCachedMemberTxSetting();
  return value === "true";
}

export async function setMemberTxAllowedAction(enabled: boolean): Promise<boolean> {
  return updateSystemSettingAction("allow_member_tx", enabled ? "true" : "false");
}
