"use server";

import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { updateTag, revalidateTag, revalidatePath } from "next/cache";
import {
  BloodDonor,
  AmbulanceService,
  INITIAL_BLOOD_DONORS,
  INITIAL_AMBULANCES,
} from "@/data/emergencyData";
import { getClientIp, checkRateLimit, RATE_LIMIT_RULES } from "@/lib/rateLimit";

const EMERGENCY_TAG = "emergency-data";

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 13 && digits.startsWith("8801")) {
    return digits.substring(2);
  }
  return digits;
}

export interface RegisterBloodDonorInput {
  name: string;
  phone: string;
  bloodGroup: string;
  upazila: string;
  lastDonated?: string;
}

export interface RegisterAmbulanceInput {
  operatorName: string;
  serviceName: string;
  phone: string;
  altPhone?: string;
  type: string;
  location: string;
  coverage?: string;
}

export async function registerBloodDonorAction(
  input: RegisterBloodDonorInput
): Promise<{ success: boolean; message: string }> {
  try {
    const ip = await getClientIp();
    const rateLimit = checkRateLimit(
      `emergency_donor:${ip}`,
      RATE_LIMIT_RULES.EMERGENCY_SUBMISSION_PER_IP.limit,
      RATE_LIMIT_RULES.EMERGENCY_SUBMISSION_PER_IP.windowMs
    );
    if (!rateLimit.success) {
      return {
        success: false,
        message: rateLimit.message || "আপনি খুব দ্রুত অনুরোধ পাঠাচ্ছেন। অনুগ্রহ করে কিছুক্ষণ পর চেষ্টা করুন।",
      };
    }

    if (!input.name || !input.phone || !input.bloodGroup || !input.upazila) {
      return { success: false, message: "সকল প্রয়োজনীয় তথ্য পূরণ করুন।" };
    }

    const cleanInputPhone = normalizePhone(input.phone);
    if (cleanInputPhone.length < 10) {
      return { success: false, message: "অনুগ্রহ করে একটি সঠিক মোবাইল নম্বর দিন।" };
    }

    const newDonor: BloodDonor = {
      id: `donor-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: input.name.trim(),
      phone: input.phone.trim(),
      bloodGroup: input.bloodGroup as BloodDonor["bloodGroup"],
      upazila: input.upazila,
      lastDonated: input.lastDonated?.trim() || "তথ্য নেই",
      isAvailable: true,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    let duplicateFound = false;

    await prisma.$transaction(async (tx) => {
      const defaultDonorsJson = JSON.stringify(INITIAL_BLOOD_DONORS);
      await tx.$executeRaw`
        INSERT INTO "system_settings" ("key", "value", "updated_at")
        VALUES ('emergency_donors', ${defaultDonorsJson}, NOW())
        ON CONFLICT ("key") DO NOTHING
      `;

      const rows = await tx.$queryRaw<Array<{ key: string; value: string }>>`
        SELECT "key", "value" FROM "system_settings" WHERE "key" = 'emergency_donors' FOR UPDATE
      `;

      let donorsList: BloodDonor[] = INITIAL_BLOOD_DONORS;
      if (rows.length > 0 && rows[0].value) {
        try {
          const parsed = JSON.parse(rows[0].value);
          if (Array.isArray(parsed) && parsed.length > 0) {
            donorsList = parsed;
          }
        } catch (e) {
          logger.error("Failed to parse existing emergency_donors", e);
        }
      }

      // Check for phone duplicate
      const exists = donorsList.some(
        (d) => normalizePhone(d.phone) === cleanInputPhone
      );

      if (exists) {
        duplicateFound = true;
        return;
      }

      const updatedDonors = [newDonor, ...donorsList];

      await tx.systemSetting.update({
        where: { key: "emergency_donors" },
        data: { value: JSON.stringify(updatedDonors) },
      });
    });

    if (duplicateFound) {
      return {
        success: false,
        message: "এই মোবাইল নম্বরটি দিয়ে ইতিমধ্যে রক্তদাতা হিসেবে আবেদন জমা করা হয়েছে।",
      };
    }

    updateTag(EMERGENCY_TAG);
    updateTag("admin-stats");
    revalidateTag(EMERGENCY_TAG, "max");
    revalidatePath("/emergency");
    revalidatePath("/admin");
    revalidatePath("/admin/emergency");

    return {
      success: true,
      message: "রক্তদাতা হিসেবে আপনার নিবন্ধন সফলভাবে জমা হয়েছে। এডমিন অনুমোদনের পর এটি তালিকায় যুক্ত হবে।",
    };
  } catch (error) {
    logger.error("Error registering blood donor:", error);
    return {
      success: false,
      message: "নিবন্ধন সম্পন্ন করা সম্ভব হয়নি। অনুগ্রহ করে পরে চেষ্টা করুন।",
    };
  }
}

export async function registerAmbulanceAction(
  input: RegisterAmbulanceInput
): Promise<{ success: boolean; message: string }> {
  try {
    const ip = await getClientIp();
    const rateLimit = checkRateLimit(
      `emergency_ambulance:${ip}`,
      RATE_LIMIT_RULES.EMERGENCY_SUBMISSION_PER_IP.limit,
      RATE_LIMIT_RULES.EMERGENCY_SUBMISSION_PER_IP.windowMs
    );
    if (!rateLimit.success) {
      return {
        success: false,
        message: rateLimit.message || "আপনি খুব দ্রুত অনুরোধ পাঠাচ্ছেন। অনুগ্রহ করে কিছুক্ষণ পর চেষ্টা করুন।",
      };
    }

    if (!input.operatorName || !input.serviceName || !input.phone || !input.type || !input.location) {
      return { success: false, message: "সকল প্রয়োজনীয় তথ্য পূরণ করুন।" };
    }

    const cleanInputPhone = normalizePhone(input.phone);
    if (cleanInputPhone.length < 10) {
      return { success: false, message: "অনুগ্রহ করে একটি সঠিক মোবাইল নম্বর দিন।" };
    }

    const coverageInfo = input.coverage ? ` | কভারেজ: ${input.coverage}` : "";

    const newAmbulance: AmbulanceService = {
      id: `amb-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: `${input.serviceName.trim()}${input.operatorName ? ` (${input.operatorName.trim()})` : ""}`,
      type: input.type as AmbulanceService["type"],
      location: `${input.location.trim()}${coverageInfo}`,
      phone: input.phone.trim(),
      availableHours: "২৪/৭ সার্বক্ষণিক",
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    let duplicateFound = false;

    await prisma.$transaction(async (tx) => {
      const defaultAmbulancesJson = JSON.stringify(INITIAL_AMBULANCES);
      await tx.$executeRaw`
        INSERT INTO "system_settings" ("key", "value", "updated_at")
        VALUES ('emergency_ambulances', ${defaultAmbulancesJson}, NOW())
        ON CONFLICT ("key") DO NOTHING
      `;

      const rows = await tx.$queryRaw<Array<{ key: string; value: string }>>`
        SELECT "key", "value" FROM "system_settings" WHERE "key" = 'emergency_ambulances' FOR UPDATE
      `;

      let ambulancesList: AmbulanceService[] = INITIAL_AMBULANCES;
      if (rows.length > 0 && rows[0].value) {
        try {
          const parsed = JSON.parse(rows[0].value);
          if (Array.isArray(parsed) && parsed.length > 0) {
            ambulancesList = parsed;
          }
        } catch (e) {
          logger.error("Failed to parse existing emergency_ambulances", e);
        }
      }

      // Check for phone duplicate
      const exists = ambulancesList.some(
        (a) => normalizePhone(a.phone) === cleanInputPhone
      );

      if (exists) {
        duplicateFound = true;
        return;
      }

      const updatedAmbulances = [newAmbulance, ...ambulancesList];

      await tx.systemSetting.update({
        where: { key: "emergency_ambulances" },
        data: { value: JSON.stringify(updatedAmbulances) },
      });
    });

    if (duplicateFound) {
      return {
        success: false,
        message: "এই মোবাইল নম্বরটি দিয়ে ইতিমধ্যে অ্যাম্বুলেন্স সেবা তালিকাভুক্ত রয়েছে।",
      };
    }

    updateTag(EMERGENCY_TAG);
    updateTag("admin-stats");
    revalidateTag(EMERGENCY_TAG, "max");
    revalidatePath("/emergency");
    revalidatePath("/admin");
    revalidatePath("/admin/emergency");

    return {
      success: true,
      message: "আপনার অ্যাম্বুলেন্সের তথ্য সফলভাবে জমা হয়েছে। এডমিন অনুমোদনের পর এটি তালিকায় যুক্ত হবে।",
    };
  } catch (error) {
    logger.error("Error registering ambulance service:", error);
    return {
      success: false,
      message: "তথ্য জমা দেওয়া সম্ভব হয়নি। অনুগ্রহ করে পরে আবার চেষ্টা করুন।",
    };
  }
}
