"use server";

import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { logger } from "@/lib/logger";
import { updateTag, revalidateTag, revalidatePath } from "next/cache";
import {
  doctorImportSchema,
  partnerImportSchema,
  bloodDonorImportSchema,
  ambulanceImportSchema,
  hotlineImportSchema,
} from "@/lib/bulkImportUtils";
import { BulkImportResult } from "@/types/bulkImport";
import { getEmergencyDataAction } from "./emergencyAdminActions";
import { BloodDonor, AmbulanceService, EmergencyHotline } from "@/data/emergencyData";

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
  updateTag("emergency-data");
  revalidateTag("emergency-data", "max");
  revalidatePath("/emergency");
  revalidatePath("/admin");
  revalidatePath("/admin/emergency");
}

/**
 * Bulk import doctor records into the database.
 */
export async function bulkImportDoctorsAction(
  rawDoctors: unknown[]
): Promise<BulkImportResult> {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) {
    return {
      success: false,
      totalImported: 0,
      totalFailed: rawDoctors.length,
      errors: ["Unauthorized access. Admin privileges required."],
    };
  }

  if (!Array.isArray(rawDoctors) || rawDoctors.length === 0) {
    return {
      success: false,
      totalImported: 0,
      totalFailed: 0,
      errors: ["No doctor records provided for import."],
    };
  }

  const validDoctors: {
    id: string;
    name: string;
    specialty: string;
    department: string;
    degrees: string;
    designation: string;
    chamberName: string;
    chamberAddress: string;
    roomNo: string | null;
    visitingDays: string;
    visitingHours: string;
    serialPhone: string;
    consultationFee: string | null;
    imageUrl: string | null;
    upazila: string;
    isActive: boolean;
  }[] = [];
  const errors: string[] = [];

  rawDoctors.forEach((item, index) => {
    const result = doctorImportSchema.safeParse(item);
    if (result.success) {
      const doc = result.data;
      validDoctors.push({
        id: `doc_${crypto.randomUUID().slice(0, 8)}`,
        name: doc.name,
        specialty: doc.specialty,
        department: doc.department || "medicine",
        degrees: doc.degrees,
        designation: doc.designation,
        chamberName: doc.chamberName,
        chamberAddress: doc.chamberAddress,
        roomNo: doc.roomNo || null,
        visitingDays: doc.visitingDays,
        visitingHours: doc.visitingHours,
        serialPhone: doc.serialPhone,
        consultationFee: doc.consultationFee || null,
        imageUrl: doc.imageUrl || null,
        upazila: doc.upazila || "feni-sadar",
        isActive: true,
      });
    } else {
      errors.push(`Row ${index + 1}: ${result.error.issues.map((e) => e.message).join(", ")}`);
    }
  });

  if (validDoctors.length === 0) {
    return {
      success: false,
      totalImported: 0,
      totalFailed: rawDoctors.length,
      errors,
    };
  }

  try {
    await prisma.doctor.createMany({
      data: validDoctors,
      skipDuplicates: false,
    });

    updateTag("doctors");
    revalidatePath("/doctors");
    revalidatePath("/admin");
    revalidatePath("/admin/doctors");

    return {
      success: true,
      totalImported: validDoctors.length,
      totalFailed: rawDoctors.length - validDoctors.length,
      errors: errors.length > 0 ? errors : undefined,
      message: `Successfully imported ${validDoctors.length} doctors.`,
    };
  } catch (error) {
    logger.error("Failed to bulk import doctors:", error);
    return {
      success: false,
      totalImported: 0,
      totalFailed: rawDoctors.length,
      errors: ["Database insertion error. Please check for unique constraint violations."],
    };
  }
}

/**
 * Bulk import partner healthcare facilities into the database.
 */
export async function bulkImportPartnersAction(
  rawPartners: unknown[]
): Promise<BulkImportResult> {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) {
    return {
      success: false,
      totalImported: 0,
      totalFailed: rawPartners.length,
      errors: ["Unauthorized access. Admin privileges required."],
    };
  }

  if (!Array.isArray(rawPartners) || rawPartners.length === 0) {
    return {
      success: false,
      totalImported: 0,
      totalFailed: 0,
      errors: ["No partner records provided for import."],
    };
  }

  const validPartners: {
    id: string;
    name: string;
    category: string;
    address: string;
    discount: string;
    phone: string;
    email: string | null;
    logoText: string;
    mapLink: string | null;
    imageUrl: string | null;
    emergencyPhone: string | null;
    workingHours: string | null;
    upazila: string;
  }[] = [];
  const errors: string[] = [];

  rawPartners.forEach((item, index) => {
    const result = partnerImportSchema.safeParse(item);
    if (result.success) {
      const p = result.data;
      validPartners.push({
        id: `p_${crypto.randomUUID()}`,
        name: p.name,
        category: p.category,
        address: p.address,
        discount: p.discount,
        phone: p.phone,
        email: p.email || null,
        logoText: p.logoText || p.name.slice(0, 10),
        mapLink: p.mapLink || null,
        imageUrl: p.imageUrl || null,
        emergencyPhone: p.emergencyPhone || null,
        workingHours: p.workingHours || null,
        upazila: p.upazila || "feni-sadar",
      });
    } else {
      errors.push(`Row ${index + 1}: ${result.error.issues.map((e) => e.message).join(", ")}`);
    }
  });

  if (validPartners.length === 0) {
    return {
      success: false,
      totalImported: 0,
      totalFailed: rawPartners.length,
      errors,
    };
  }

  try {
    await prisma.partner.createMany({
      data: validPartners,
      skipDuplicates: true,
    });

    updateTag("partners");
    updateTag("homepage-partners");
    revalidatePath("/partner-hospitals");
    revalidatePath("/admin");
    revalidatePath("/admin/partners");

    return {
      success: true,
      totalImported: validPartners.length,
      totalFailed: rawPartners.length - validPartners.length,
      errors: errors.length > 0 ? errors : undefined,
      message: `Successfully imported ${validPartners.length} partner facilities.`,
    };
  } catch (error) {
    logger.error("Failed to bulk import partners:", error);
    return {
      success: false,
      totalImported: 0,
      totalFailed: rawPartners.length,
      errors: ["Database insertion error during partner bulk import."],
    };
  }
}

/**
 * Bulk import blood donors into system settings.
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
      errors: ["No blood donor records provided."],
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
        isAvailable: d.isAvailable ?? true,
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
    const data = await getEmergencyDataAction();
    const updatedList = [...validDonors, ...data.bloodDonors];
    await saveEmergencySetting("emergency_donors", updatedList);

    return {
      success: true,
      totalImported: validDonors.length,
      totalFailed: rawDonors.length - validDonors.length,
      errors: errors.length > 0 ? errors : undefined,
      message: `Successfully imported ${validDonors.length} blood donors.`,
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
 * Bulk import ambulance services into system settings.
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
    const data = await getEmergencyDataAction();
    const updatedList = [...validAmbulances, ...data.ambulances];
    await saveEmergencySetting("emergency_ambulances", updatedList);

    return {
      success: true,
      totalImported: validAmbulances.length,
      totalFailed: rawAmbulances.length - validAmbulances.length,
      errors: errors.length > 0 ? errors : undefined,
      message: `Successfully imported ${validAmbulances.length} ambulance services.`,
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
    const data = await getEmergencyDataAction();
    const updatedList = [...validHotlines, ...data.hotlines];
    await saveEmergencySetting("emergency_hotlines", updatedList);

    return {
      success: true,
      totalImported: validHotlines.length,
      totalFailed: rawHotlines.length - validHotlines.length,
      errors: errors.length > 0 ? errors : undefined,
      message: `Successfully imported ${validHotlines.length} emergency hotlines.`,
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
