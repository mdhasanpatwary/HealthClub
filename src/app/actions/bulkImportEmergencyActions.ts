"use server";

import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { logger } from "@/lib/logger";
import { updateTag, revalidateTag, revalidatePath } from "next/cache";
import {
  bloodDonorImportSchema,
  ambulanceImportSchema,
  hotlineImportSchema,
} from "@/lib/bulkImportSchemas";
import { BulkImportResult } from "@/types/bulkImport";
import { BloodDonor, AmbulanceService, EmergencyHotline } from "@/data/emergencyData";
import { hasAdminPermission } from "@/lib/permissions";
import { getHotlinesList } from "./emergencyHotlineActions";

async function verifyAdmin(): Promise<boolean> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") return false;
  const role = session.adminRole || "super_admin";
  return hasAdminPermission(role, "bulk_import");
}

function revalidateEmergencyCaches() {
  updateTag("emergency-data");
  updateTag("admin-stats");
  revalidateTag("emergency-data", "max");
  revalidatePath("/emergency");
  revalidatePath("/admin");
  revalidatePath("/admin/emergency");
}

/**
 * Bulk import blood donors into relational table.
 */
export async function bulkImportBloodDonorsAction(
  rawDonors: unknown[]
): Promise<BulkImportResult> {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) {
    return {
      success: false,
      totalImported: 0,
      totalFailed: rawDonors.length,
      errors: ["Unauthorized access. Admin privileges required."],
    };
  }

  if (!Array.isArray(rawDonors) || rawDonors.length === 0) {
    return {
      success: false,
      totalImported: 0,
      totalFailed: 0,
      errors: ["No donor records provided."],
    };
  }

  const validDonors: BloodDonor[] = [];
  const errors: string[] = [];

  rawDonors.forEach((item, index) => {
    const result = bloodDonorImportSchema.safeParse(item);
    if (result.success) {
      const d = result.data;
      validDonors.push({
        id: `donor-bulk-${crypto.randomUUID().slice(0, 8)}`,
        name: d.name,
        bloodGroup: d.bloodGroup,
        upazila: d.upazila,
        phone: d.phone,
        lastDonated: d.lastDonated || "তথ্য নেই",
        isAvailable: d.isAvailable !== undefined ? d.isAvailable : true,
        status: "approved",
        createdAt: new Date().toISOString(),
      });
    } else {
      errors.push(`Row ${index + 1}: ${result.error.issues.map((e) => e.message).join(", ")}`);
    }
  });

  if (validDonors.length === 0) {
    return {
      success: false,
      totalImported: 0,
      totalFailed: rawDonors.length,
      errors,
    };
  }

  try {
    let importedCount = 0;
    for (const donor of validDonors) {
      await prisma.bloodDonor.upsert({
        where: { phone: donor.phone },
        update: {
          name: donor.name,
          bloodGroup: donor.bloodGroup,
          upazila: donor.upazila,
          lastDonated: donor.lastDonated,
          isAvailable: donor.isAvailable,
          status: "approved",
        },
        create: {
          id: donor.id,
          name: donor.name,
          phone: donor.phone,
          bloodGroup: donor.bloodGroup,
          upazila: donor.upazila,
          lastDonated: donor.lastDonated,
          isAvailable: donor.isAvailable,
          status: "approved",
        },
      });
      importedCount++;
    }

    revalidateEmergencyCaches();

    return {
      success: true,
      totalImported: importedCount,
      totalFailed: rawDonors.length - validDonors.length,
      errors: errors.length > 0 ? errors : undefined,
      message: `Successfully imported ${importedCount} blood donors.`,
    };
  } catch (error) {
    logger.error("Failed to bulk import blood donors:", error);
    return {
      success: false,
      totalImported: 0,
      totalFailed: rawDonors.length,
      errors: ["Failed to save blood donor records."],
    };
  }
}

/**
 * Bulk import ambulance services into relational table.
 */
export async function bulkImportAmbulancesAction(
  rawAmbulances: unknown[]
): Promise<BulkImportResult> {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) {
    return {
      success: false,
      totalImported: 0,
      totalFailed: rawAmbulances.length,
      errors: ["Unauthorized access. Admin privileges required."],
    };
  }

  if (!Array.isArray(rawAmbulances) || rawAmbulances.length === 0) {
    return {
      success: false,
      totalImported: 0,
      totalFailed: 0,
      errors: ["No ambulance records provided."],
    };
  }

  const validAmbulances: AmbulanceService[] = [];
  const errors: string[] = [];

  rawAmbulances.forEach((item, index) => {
    const result = ambulanceImportSchema.safeParse(item);
    if (result.success) {
      const a = result.data;
      validAmbulances.push({
        id: `amb-bulk-${crypto.randomUUID().slice(0, 8)}`,
        name: a.name,
        type: a.type,
        location: a.location,
        phone: a.phone,
        availableHours: a.availableHours || "২৪ ঘণ্টা",
        status: "approved",
        createdAt: new Date().toISOString(),
      });
    } else {
      errors.push(`Row ${index + 1}: ${result.error.issues.map((e) => e.message).join(", ")}`);
    }
  });

  if (validAmbulances.length === 0) {
    return {
      success: false,
      totalImported: 0,
      totalFailed: rawAmbulances.length,
      errors,
    };
  }

  try {
    let importedCount = 0;
    for (const amb of validAmbulances) {
      await prisma.ambulanceService.upsert({
        where: { phone: amb.phone },
        update: {
          name: amb.name,
          type: amb.type,
          location: amb.location,
          availableHours: amb.availableHours,
          status: "approved",
        },
        create: {
          id: amb.id,
          name: amb.name,
          phone: amb.phone,
          type: amb.type,
          location: amb.location,
          availableHours: amb.availableHours,
          status: "approved",
        },
      });
      importedCount++;
    }

    revalidateEmergencyCaches();

    return {
      success: true,
      totalImported: importedCount,
      totalFailed: rawAmbulances.length - validAmbulances.length,
      errors: errors.length > 0 ? errors : undefined,
      message: `Successfully imported ${importedCount} ambulance services.`,
    };
  } catch (error) {
    logger.error("Failed to bulk import ambulances:", error);
    return {
      success: false,
      totalImported: 0,
      totalFailed: rawAmbulances.length,
      errors: ["Failed to save ambulance records."],
    };
  }
}

function normalizeHotlinePhone(phone: string): string {
  if (!phone) return "";
  const banglaToEnglishMap: Record<string, string> = {
    "০": "0", "১": "1", "২": "2", "৩": "3", "৪": "4",
    "৫": "5", "৬": "6", "৭": "7", "৮": "8", "৯": "9",
  };
  let converted = phone.trim();
  for (const [bn, en] of Object.entries(banglaToEnglishMap)) {
    converted = converted.replaceAll(bn, en);
  }
  const cleaned = converted.toLowerCase().replace(/[\s_\-–—()[\]{}./\\]/g, "");
  const withoutCountryCode = cleaned.replace(/^\+?88/, "");
  return withoutCountryCode || cleaned;
}

function normalizeHotlineTitle(title: string): string {
  if (!title) return "";
  const banglaToEnglishMap: Record<string, string> = {
    "০": "0", "১": "1", "২": "2", "৩": "3", "৪": "4",
    "৫": "5", "৬": "6", "৭": "7", "৮": "8", "৯": "9",
  };
  let converted = title.trim().toLowerCase();
  for (const [bn, en] of Object.entries(banglaToEnglishMap)) {
    converted = converted.replaceAll(bn, en);
  }
  return converted.replace(/[\s_\-–—()[\]{}.,/\\|:;!?'"“”‘’]/g, "");
}

function isHotlineDuplicate(a: EmergencyHotline, b: EmergencyHotline): boolean {
  const phoneA = normalizeHotlinePhone(a.phone);
  const phoneB = normalizeHotlinePhone(b.phone);
  if (phoneA && phoneB && phoneA === phoneB) {
    return true;
  }

  const titleBnA = normalizeHotlineTitle(a.titleBn);
  const titleBnB = normalizeHotlineTitle(b.titleBn);
  if (titleBnA && titleBnB && titleBnA === titleBnB) {
    return true;
  }

  const titleEnA = normalizeHotlineTitle(a.titleEn);
  const titleEnB = normalizeHotlineTitle(b.titleEn);
  if (titleEnA && titleEnB && titleEnA === titleEnB) {
    return true;
  }

  return false;
}

/**
 * Bulk import emergency hotlines into system settings.
 */
export async function bulkImportHotlinesAction(
  rawHotlines: unknown[]
): Promise<BulkImportResult> {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) {
    return {
      success: false,
      totalImported: 0,
      totalFailed: rawHotlines.length,
      errors: ["Unauthorized access. Admin privileges required."],
    };
  }

  if (!Array.isArray(rawHotlines) || rawHotlines.length === 0) {
    return {
      success: false,
      totalImported: 0,
      totalFailed: 0,
      errors: ["No hotline records provided."],
    };
  }

  const validHotlines: EmergencyHotline[] = [];
  const errors: string[] = [];

  rawHotlines.forEach((item, index) => {
    const result = hotlineImportSchema.safeParse(item);
    if (result.success) {
      const h = result.data;
      validHotlines.push({
        id: `hotline-bulk-${crypto.randomUUID().slice(0, 8)}`,
        titleBn: h.titleBn,
        titleEn: h.titleEn,
        category: h.category,
        phone: h.phone,
        descriptionBn: h.descriptionBn || "",
        descriptionEn: h.descriptionEn || "",
      });
    } else {
      errors.push(`Row ${index + 1}: ${result.error.issues.map((e) => e.message).join(", ")}`);
    }
  });

  if (validHotlines.length === 0) {
    return {
      success: false,
      totalImported: 0,
      totalFailed: rawHotlines.length,
      errors,
    };
  }

  try {
    const existing = await getHotlinesList();

    // 1. Deduplicate incoming batch within itself (later entries in the batch update earlier ones)
    const dedupedIncoming: EmergencyHotline[] = [];
    for (const incoming of validHotlines) {
      const matchIdx = dedupedIncoming.findIndex((h) => isHotlineDuplicate(h, incoming));
      if (matchIdx >= 0) {
        dedupedIncoming[matchIdx] = {
          ...dedupedIncoming[matchIdx],
          ...incoming,
        };
      } else {
        dedupedIncoming.push(incoming);
      }
    }

    // 2. Merge with existing: if incoming matches an existing entry, update in-place preserving its existing ID
    const mergedExisting = [...existing];
    const newlyAdded: EmergencyHotline[] = [];

    for (const incoming of dedupedIncoming) {
      const matchIdx = mergedExisting.findIndex((h) => isHotlineDuplicate(h, incoming));
      if (matchIdx >= 0) {
        mergedExisting[matchIdx] = {
          ...incoming,
          id: mergedExisting[matchIdx].id,
        };
      } else {
        newlyAdded.push(incoming);
      }
    }

    // 3. Prune any duplicate hotlines across newlyAdded + mergedExisting (including any legacy duplicates)
    const updatedList: EmergencyHotline[] = [];
    for (const item of [...newlyAdded, ...mergedExisting]) {
      if (!updatedList.some((existingItem) => isHotlineDuplicate(existingItem, item))) {
        updatedList.push(item);
      }
    }

    await prisma.systemSetting.upsert({
      where: { key: "emergency_hotlines" },
      create: { key: "emergency_hotlines", value: JSON.stringify(updatedList) },
      update: { value: JSON.stringify(updatedList) },
    });

    revalidateEmergencyCaches();

    return {
      success: true,
      totalImported: dedupedIncoming.length,
      totalFailed: rawHotlines.length - validHotlines.length,
      errors: errors.length > 0 ? errors : undefined,
      message: `Successfully imported ${dedupedIncoming.length} emergency hotlines.`,
    };
  } catch (error) {
    logger.error("Failed to bulk import hotlines:", error);
    return {
      success: false,
      totalImported: 0,
      totalFailed: rawHotlines.length,
      errors: ["Failed to save hotline records."],
    };
  }
}
