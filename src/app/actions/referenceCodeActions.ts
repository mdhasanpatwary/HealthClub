"use server";

import {
  evaluateReferenceCode,
  getAllActiveReferenceCodes,
  type ReferenceCodeValidationResult,
  type ReferenceCodeItem,
} from "@/lib/referenceCodes";
import { updateSystemSettingAction } from "@/app/actions/systemSettingsActions";
import { getSessionUser } from "@/lib/session";
import { hasAdminPermission } from "@/lib/permissions";

/**
 * Public action: validate a reference code for the given tier.
 */
export async function validateReferenceCodeAction(
  rawCode: string,
  tier: "founding" | "premium"
): Promise<ReferenceCodeValidationResult> {
  return evaluateReferenceCode(rawCode, tier);
}

/**
 * Admin action: get all active reference codes.
 */
export async function getAdminReferenceCodesAction(): Promise<ReferenceCodeItem[]> {
  return getAllActiveReferenceCodes();
}

/**
 * Admin action: save updated reference codes list.
 */
export async function saveAdminReferenceCodesAction(
  codes: ReferenceCodeItem[]
): Promise<{ success: boolean; message: string }> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin" || !hasAdminPermission(session.adminRole || "super_admin", "manage_settings")) {
    return { success: false, message: "অননুমোদিত অ্যাক্সেস।" };
  }

  const success = await updateSystemSettingAction(
    "reference_codes_config",
    JSON.stringify(codes)
  );

  return {
    success,
    message: success ? "রেফারেন্স কোড তালিকা সফলভাবে সংরক্ষিত হয়েছে।" : "সংরক্ষণ করতে সমস্যা হয়েছে।",
  };
}
