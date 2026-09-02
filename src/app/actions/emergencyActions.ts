"use server";

import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { updateTag, revalidateTag, revalidatePath } from "next/cache";
import { getClientIp, checkRateLimit, RATE_LIMIT_RULES } from "@/lib/rateLimit";
import {
  bloodDonorRegistrationSchema,
  ambulanceRegistrationSchema,
} from "@/lib/validations/emergency";
import { Prisma } from "@/generated/client/client";

const EMERGENCY_TAG = "emergency-data";

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 13 && digits.startsWith("8801")) {
    return digits.substring(2);
  }
  return digits;
}

function revalidateEmergencyCaches() {
  updateTag(EMERGENCY_TAG);
  updateTag("admin-stats");
  revalidateTag(EMERGENCY_TAG, "max");
  revalidatePath("/emergency");
  revalidatePath("/admin");
  revalidatePath("/admin/emergency");
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

    const parsed = bloodDonorRegistrationSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        message: parsed.error.issues[0]?.message || "সকল প্রয়োজনীয় তথ্য সঠিকভাবে পূরণ করুন।",
      };
    }

    const cleanInputPhone = normalizePhone(parsed.data.phone);

    // Fast check for phone uniqueness
    const existing = await prisma.bloodDonor.findUnique({
      where: { phone: cleanInputPhone },
      select: { id: true },
    });

    if (existing) {
      return {
        success: false,
        message: "এই মোবাইল নম্বরটি দিয়ে ইতিমধ্যে রক্তদাতা হিসেবে আবেদন জমা করা হয়েছে।",
      };
    }

    await prisma.bloodDonor.create({
      data: {
        id: `donor-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: parsed.data.name.trim(),
        phone: cleanInputPhone,
        bloodGroup: parsed.data.bloodGroup,
        upazila: parsed.data.upazila,
        lastDonated: parsed.data.lastDonated?.trim() || "তথ্য নেই",
        isAvailable: true,
        status: "pending",
      },
    });

    revalidateEmergencyCaches();

    return {
      success: true,
      message: "রক্তদাতা হিসেবে আপনার নিবন্ধন সফলভাবে জমা হয়েছে। এডমিন অনুমোদনের পর এটি তালিকায় যুক্ত হবে।",
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return {
        success: false,
        message: "এই মোবাইল নম্বরটি দিয়ে ইতিমধ্যে রক্তদাতা হিসেবে আবেদন জমা করা হয়েছে।",
      };
    }
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

    const parsed = ambulanceRegistrationSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        message: parsed.error.issues[0]?.message || "সকল প্রয়োজনীয় তথ্য সঠিকভাবে পূরণ করুন।",
      };
    }

    const cleanInputPhone = normalizePhone(parsed.data.phone);

    // Fast check for phone uniqueness
    const existing = await prisma.ambulanceService.findUnique({
      where: { phone: cleanInputPhone },
      select: { id: true },
    });

    if (existing) {
      return {
        success: false,
        message: "এই মোবাইল নম্বরটি দিয়ে ইতিমধ্যে অ্যাম্বুলেন্স সেবা তালিকাভুক্ত রয়েছে।",
      };
    }

    const coverageInfo = parsed.data.coverage ? ` | কভারেজ: ${parsed.data.coverage}` : "";

    await prisma.ambulanceService.create({
      data: {
        id: `amb-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: `${parsed.data.serviceName.trim()}${parsed.data.operatorName ? ` (${parsed.data.operatorName.trim()})` : ""}`,
        type: parsed.data.type,
        location: `${parsed.data.location.trim()}${coverageInfo}`,
        phone: cleanInputPhone,
        availableHours: "২৪/৭ সার্বক্ষণিক",
        status: "pending",
      },
    });

    revalidateEmergencyCaches();

    return {
      success: true,
      message: "আপনার অ্যাম্বুলেন্সের তথ্য সফলভাবে জমা হয়েছে। এডমিন অনুমোদনের পর এটি তালিকায় যুক্ত হবে।",
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return {
        success: false,
        message: "এই মোবাইল নম্বরটি দিয়ে ইতিমধ্যে অ্যাম্বুলেন্স সেবা তালিকাভুক্ত রয়েছে।",
      };
    }
    logger.error("Error registering ambulance service:", error);
    return {
      success: false,
      message: "তথ্য জমা দেওয়া সম্ভব হয়নি। অনুগ্রহ করে পরে আবার চেষ্টা করুন।",
    };
  }
}
