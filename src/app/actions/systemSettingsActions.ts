"use server";

import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { logger } from "@/lib/logger";
import { unstable_cache, updateTag, revalidatePath } from "next/cache";
import { hasAdminPermission } from "@/lib/permissions";

const SYSTEM_SETTINGS_TAG = "system-settings";

export interface GlobalNoticeSetting {
  enabled: boolean;
  text: string;
}

export async function getSystemSettingAction(key: string, defaultValue: string = "false"): Promise<string> {
  try {
    const setting = await prisma.systemSetting.findUnique({
      where: { key },
    });
    return setting ? setting.value : defaultValue;
  } catch (error) {
    logger.error(`Error fetching system setting '${key}':`, error);
    return defaultValue;
  }
}

export async function updateSystemSettingAction(key: string, value: string): Promise<boolean> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin" || !hasAdminPermission(session.adminRole || "super_admin", "manage_settings")) {
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
    revalidatePath("/", "layout");
    return true;
  } catch (error) {
    logger.error(`Error updating system setting '${key}':`, error);
    return false;
  }
}

/**
 * Cached reader for allow_member_tx.
 * Hits the DB at most once per 60 seconds; instantly invalidated on writes
 * via updateTag(SYSTEM_SETTINGS_TAG).
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

/**
 * Cached reader for global website notice banner.
 * Hits the DB at most once per 60 seconds; instantly invalidated on writes
 * via updateTag(SYSTEM_SETTINGS_TAG).
 */
export const getCachedNoticeSetting = unstable_cache(
  async (): Promise<GlobalNoticeSetting> => {
    try {
      const settings = await prisma.systemSetting.findMany({
        where: {
          key: { in: ["notice_enabled", "notice_text"] },
        },
      });
      const map: Record<string, string> = {};
      for (const s of settings) {
        map[s.key] = s.value;
      }
      return {
        enabled: map["notice_enabled"] === "true",
        text: map["notice_text"] || "",
      };
    } catch (error) {
      logger.error("Error fetching notice setting:", error);
      return { enabled: false, text: "" };
    }
  },
  ["global_notice_setting"],
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
    logger.error("Error fetching all system settings:", error);
    return {};
  }
}

export async function updateMultipleSystemSettingsAction(
  settings: Record<string, string>
): Promise<{ success: boolean; message: string }> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin" || !hasAdminPermission(session.adminRole || "super_admin", "manage_settings")) {
    return { success: false, message: "অননুমোদিত অ্যাক্সেস। সেটিংস পরিবর্তনের অনুমতি নেই।" };
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
    revalidatePath("/", "layout");

    return { success: true, message: "সকল সেটিংস সফলভাবে সংরক্ষণ করা হয়েছে।" };
  } catch (error) {
    logger.error("Error updating multiple system settings:", error);
    return { success: false, message: "সেটিংস সংরক্ষণ করতে সমস্যা হয়েছে।" };
  }
}

export interface PublicPaymentSettings {
  bkashPersonal: string;
  bkashMerchant: string;
  premiumFee: string;
  foundingFee: string;
  paymentInstructions: string;
}

export const getCachedPaymentSettings = unstable_cache(
  async (): Promise<PublicPaymentSettings> => {
    try {
      const settings = await prisma.systemSetting.findMany({
        where: {
          key: {
            in: [
              "bkash_personal_number",
              "bkash_merchant_number",
              "premium_fee",
              "founding_fee",
              "payment_instructions",
            ],
          },
        },
      });
      const map: Record<string, string> = {};
      for (const s of settings) {
        map[s.key] = s.value;
      }
      return {
        bkashPersonal: map["bkash_personal_number"] || "01886763849",
        bkashMerchant: map["bkash_merchant_number"] || "01886763849",
        premiumFee: map["premium_fee"] || "500",
        foundingFee: map["founding_fee"] || "0",
        paymentInstructions:
          map["payment_instructions"] ||
          "বিকাশ পার্সোনাল বা মার্চেন্ট নম্বরে সেন্ড মানি/পেমেন্ট সম্পন্ন করে TrxID ও প্রেরক নম্বর লিখুন।",
      };
    } catch (error) {
      logger.error("Error fetching payment settings:", error);
      return {
        bkashPersonal: "01886763849",
        bkashMerchant: "01886763849",
        premiumFee: "500",
        foundingFee: "0",
        paymentInstructions:
          "বিকাশ পার্সোনাল বা মার্চেন্ট নম্বরে সেন্ড মানি/পেমেন্ট সম্পন্ন করে TrxID ও প্রেরক নম্বর লিখুন।",
      };
    }
  },
  ["public_payment_settings"],
  { revalidate: 60, tags: [SYSTEM_SETTINGS_TAG] }
);

export async function getPublicPaymentSettingsAction(): Promise<PublicPaymentSettings> {
  return getCachedPaymentSettings();
}

export async function isMemberTxAllowedAction(): Promise<boolean> {
  const value = await getCachedMemberTxSetting();
  return value === "true";
}

export async function setMemberTxAllowedAction(enabled: boolean): Promise<boolean> {
  return updateSystemSettingAction("allow_member_tx", enabled ? "true" : "false");
}

