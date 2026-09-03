"use server";

import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { logger } from "@/lib/logger";
import { updateTag, revalidateTag, revalidatePath } from "next/cache";
import {
  doctorImportSchema,
  partnerImportSchema,
} from "@/lib/bulkImportSchemas";
import { BulkImportResult } from "@/types/bulkImport";
import { hasAdminPermission } from "@/lib/permissions";

const DOCTORS_TAG = "doctors";
const PARTNERS_TAG = "partners";

async function verifyAdmin(): Promise<boolean> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") return false;
  const role = session.adminRole || "super_admin";
  return hasAdminPermission(role, "bulk_import");
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
      errors: ["No doctor records provided."],
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const validDoctors: any[] = [];
  const errors: string[] = [];

  rawDoctors.forEach((item, index) => {
    const result = doctorImportSchema.safeParse(item);
    if (result.success) {
      const d = result.data;
      validDoctors.push({
        id: `doc-${crypto.randomUUID().slice(0, 8)}`,
        name: d.name,
        specialty: d.specialty,
        department: d.department,
        degrees: d.degrees,
        designation: d.designation,
        chamberName: d.chamberName,
        chamberAddress: d.chamberAddress,
        roomNo: d.roomNo || null,
        visitingDays: d.visitingDays,
        visitingHours: d.visitingHours,
        serialPhone: d.serialPhone,
        consultationFee: d.consultationFee || null,
        imageUrl: d.imageUrl || null,
        partnerId: null,
        upazila: d.upazila || "feni-sadar",
        isActive: true,
        availableToday: true,
        notice: null,
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
    const created = await prisma.doctor.createMany({
      data: validDoctors,
      skipDuplicates: true,
    });

    updateTag(DOCTORS_TAG);
    updateTag("admin-stats");
    revalidateTag(DOCTORS_TAG, "max");
    revalidatePath("/consultants");
    revalidatePath("/admin");
    revalidatePath("/admin/doctors");

    return {
      success: true,
      totalImported: created.count,
      totalFailed: rawDoctors.length - created.count,
      errors: errors.length > 0 ? errors : undefined,
      message: `Successfully imported ${created.count} doctor records.`,
    };
  } catch (error) {
    logger.error("Failed to bulk import doctors:", error);
    return {
      success: false,
      totalImported: 0,
      totalFailed: rawDoctors.length,
      errors: ["Database insertion error during bulk import."],
    };
  }
}

/**
 * Bulk import partner facilities into the database.
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
      errors: ["No partner records provided."],
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const validPartners: any[] = [];
  const errors: string[] = [];

  rawPartners.forEach((item, index) => {
    const result = partnerImportSchema.safeParse(item);
    if (result.success) {
      const p = result.data;
      validPartners.push({
        id: `partner-${crypto.randomUUID().slice(0, 8)}`,
        name: p.name,
        category: p.category,
        address: p.address,
        discount: p.discount,
        phone: p.phone,
        email: p.email || null,
        logoText: p.logoText,
        mapLink: p.mapLink || null,
        imageUrl: p.imageUrl || null,
        emergencyPhone: p.emergencyPhone || null,
        workingHours: p.workingHours || "২৪ ঘণ্টা খোলা",
        departmentDiscounts: null,
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
    let imported = 0;
    const dbErrors: string[] = [];

    for (const partner of validPartners) {
      try {
        await prisma.partner.upsert({
          where: { id: partner.id },
          update: partner,
          create: partner,
        });
        imported++;
      } catch (err: unknown) {
        dbErrors.push(`Failed to import ${partner.name}: ${(err as Error).message}`);
      }
    }

    updateTag(PARTNERS_TAG);
    updateTag("admin-stats");
    revalidateTag(PARTNERS_TAG, "max");
    revalidatePath("/partner-hospitals");
    revalidatePath("/admin");
    revalidatePath("/admin/partners");

    return {
      success: true,
      totalImported: imported,
      totalFailed: rawPartners.length - imported,
      errors: [...errors, ...dbErrors].length > 0 ? [...errors, ...dbErrors] : undefined,
      message: `Successfully imported ${imported} partner facilities.`,
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
