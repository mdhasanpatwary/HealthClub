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

const EMERGENCY_TAG = "emergency-data";

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
    if (!input.name || !input.phone || !input.bloodGroup || !input.upazila) {
      return { success: false, message: "সকল প্রয়োজনীয় তথ্য পূরণ করুন।" };
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

    // Load existing donors
    let donorsList = INITIAL_BLOOD_DONORS;
    const setting = await prisma.systemSetting.findUnique({
      where: { key: "emergency_donors" },
    });
    if (setting?.value) {
      try {
        const parsed = JSON.parse(setting.value);
        if (Array.isArray(parsed) && parsed.length > 0) {
          donorsList = parsed;
        }
      } catch (e) {
        logger.error("Failed to parse existing emergency_donors", e);
      }
    }

    const updatedDonors = [newDonor, ...donorsList];

    await prisma.systemSetting.upsert({
      where: { key: "emergency_donors" },
      create: { key: "emergency_donors", value: JSON.stringify(updatedDonors) },
      update: { value: JSON.stringify(updatedDonors) },
    });

    updateTag(EMERGENCY_TAG);
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
    if (!input.operatorName || !input.serviceName || !input.phone || !input.type || !input.location) {
      return { success: false, message: "সকল প্রয়োজনীয় তথ্য পূরণ করুন।" };
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

    // Load existing ambulances
    let ambulancesList = INITIAL_AMBULANCES;
    const setting = await prisma.systemSetting.findUnique({
      where: { key: "emergency_ambulances" },
    });
    if (setting?.value) {
      try {
        const parsed = JSON.parse(setting.value);
        if (Array.isArray(parsed) && parsed.length > 0) {
          ambulancesList = parsed;
        }
      } catch (e) {
        logger.error("Failed to parse existing emergency_ambulances", e);
      }
    }

    const updatedAmbulances = [newAmbulance, ...ambulancesList];

    await prisma.systemSetting.upsert({
      where: { key: "emergency_ambulances" },
      create: { key: "emergency_ambulances", value: JSON.stringify(updatedAmbulances) },
      update: { value: JSON.stringify(updatedAmbulances) },
    });

    updateTag(EMERGENCY_TAG);
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
