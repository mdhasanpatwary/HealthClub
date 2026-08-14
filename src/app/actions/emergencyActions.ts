"use server";

import { prisma } from "@/lib/prisma";

export interface RegisterBloodDonorInput {
  name: string;
  phone: string;
  bloodGroup: string;
  upazila: string;
  lastDonated?: string;
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
