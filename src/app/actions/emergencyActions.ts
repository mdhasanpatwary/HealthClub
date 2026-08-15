"use server";

import { prisma } from "@/lib/prisma";

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

export async function registerBloodDonorAction(input: RegisterBloodDonorInput): Promise<{ success: boolean; message: string }> {
  try {
    if (!input.name || !input.phone || !input.bloodGroup || !input.upazila) {
      return { success: false, message: "সকল প্রয়োজনীয় তথ্য পূরণ করুন।" };
    }

    // Persist as a contact message / blood donor registration note
    await prisma.contactMessage.create({
      data: {
        name: input.name,
        phone: input.phone,
        message: `[রক্তদাতা নিবন্ধন] রক্তের গ্রুপ: ${input.bloodGroup} | উপজেলা: ${input.upazila} | শেষ রক্তদান: ${input.lastDonated || "তথ্য নেই"}`,
      },
    });

    return {
      success: true,
      message: "রক্তদাতা হিসেবে আপনার নিবন্ধন সফল হয়েছে। ধন্যবাদ!",
    };
  } catch (error) {
    console.error("Error registering blood donor:", error);
    return {
      success: false,
      message: "নিবন্ধন সম্পন্ন করা সম্ভব হয়নি। অনুগ্রহ করে পরে চেষ্টা করুন।",
    };
  }
}

export async function registerAmbulanceAction(input: RegisterAmbulanceInput): Promise<{ success: boolean; message: string }> {
  try {
    if (!input.operatorName || !input.serviceName || !input.phone || !input.type || !input.location) {
      return { success: false, message: "সকল প্রয়োজনীয় তথ্য পূরণ করুন।" };
    }

    const altInfo = input.altPhone ? ` | বিকল্প ফোন: ${input.altPhone}` : "";
    const coverageInfo = input.coverage ? ` | কভারেজ রুট: ${input.coverage}` : "";

    // Persist as a contact message / ambulance registration note for admin review
    await prisma.contactMessage.create({
      data: {
        name: `${input.serviceName} (${input.operatorName})`,
        phone: input.phone,
        message: `[অ্যাম্বুলেন্স নিবন্ধন] সেবা/গাড়ির নাম: ${input.serviceName} | চালক/মালিক: ${input.operatorName} | ধরন: ${input.type} | স্ট্যান্ড/এলাকা: ${input.location}${altInfo}${coverageInfo}`,
      },
    });

    return {
      success: true,
      message: "আপনার অ্যাম্বুলেন্সের তথ্য সফলভাবে জমা হয়েছে। যাচাইয়ের পর এটি তালিকায় যুক্ত করা হবে।",
    };
  } catch (error) {
    console.error("Error registering ambulance service:", error);
    return {
      success: false,
      message: "তথ্য জমা দেওয়া সম্ভব হয়নি। অনুগ্রহ করে পরে আবার চেষ্টা করুন।",
    };
  }
}
