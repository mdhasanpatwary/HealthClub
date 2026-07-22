"use server";

import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

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
    return true;
  } catch (error) {
    console.error(`Error updating system setting '${key}':`, error);
    return false;
  }
}

export async function isMemberTxAllowedAction(): Promise<boolean> {
  const value = await getSystemSettingAction("allow_member_tx", "false");
  return value === "true";
}

export async function setMemberTxAllowedAction(enabled: boolean): Promise<boolean> {
  return updateSystemSettingAction("allow_member_tx", enabled ? "true" : "false");
}
