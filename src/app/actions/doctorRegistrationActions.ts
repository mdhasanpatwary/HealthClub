"use server";

import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { updateTag } from "next/cache";
import {
  doctorRegistrationSchema,
  type DoctorRegistrationFormValues,
} from "@/lib/validations/doctorRegistration";
import {
  checkRateLimit,
  getClientIp,
} from "@/lib/rateLimit";
import { broadcastAdminAlert } from "@/lib/realtimeEmitter";
import { generateDoctorSlug, resolveUniqueDoctorSlug } from "@/lib/slugify";

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 13 && digits.startsWith("8801")) {
    return digits.substring(2);
  }
  return digits;
}

export interface DoctorRegistrationResult {
  success: boolean;
  message: string;
}

const DOCTORS_TAG = "doctors";

export async function submitDoctorRegistrationAction(
  input: DoctorRegistrationFormValues
): Promise<DoctorRegistrationResult> {
  try {
    const ip = await getClientIp();
    const rateLimit = checkRateLimit(
      `doctor_registration:${ip}`,
      5, // 5 submissions
      15 * 60 * 1000 // 15 minutes window
    );

    if (!rateLimit.success) {
      return {
        success: false,
        message: rateLimit.message || "আপনি খুব দ্রুত অনুরোধ পাঠাচ্ছেন। কিছুক্ষণ পর চেষ্টা করুন।",
      };
    }

    const parsed = doctorRegistrationSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        message: parsed.error.issues[0]?.message || "সকল প্রয়োজনীয় তথ্য সঠিকভাবে পূরণ করুন।",
      };
    }

    const data = parsed.data;
    const cleanSerialPhone = normalizePhone(data.serialPhone);
    const cleanContactPhone = normalizePhone(data.contactPhone);

    // Fast check for duplicate doctor submission by name and serial phone
    const existing = await prisma.doctor.findFirst({
      where: {
        name: { equals: data.name.trim(), mode: "insensitive" },
        serialPhone: { equals: cleanSerialPhone },
      },
      select: { id: true, isActive: true },
    });

    if (existing) {
      return {
        success: false,
        message: existing.isActive
          ? "এই চিকিৎসক ইতিমধ্যে ডিরেক্টরিতে তালিকাভুক্ত রয়েছেন।"
          : "এই চিকিৎসকের আবেদন ইতিমধ্যে জমা হয়েছে এবং যাচাই প্রক্রিয়ায় রয়েছে।",
      };
    }

    const newDocId = `doc_${crypto.randomUUID().slice(0, 8)}`;
    const baseSlug = generateDoctorSlug(data.name, data.nameEn || undefined) || `doc-${newDocId.replace(/^doc_/, "")}`;
    const resolvedSlug = await resolveUniqueDoctorSlug(prisma, baseSlug);

    const bmdcNote = `[নতুন রেজিস্ট্রেশন আবেদন] BMDC নং: ${data.bmdcNo} | ভেরিফিকেশন মোবাইল: ${cleanContactPhone}${data.notice ? ` | নোট: ${data.notice}` : ""}`;

    await prisma.doctor.create({
      data: {
        id: newDocId,
        slug: resolvedSlug,
        name: data.name.trim(),
        nameEn: data.nameEn ? data.nameEn.trim() || null : null,
        specialty: data.specialty.trim(),
        department: data.department,
        degrees: data.degrees.trim(),
        designation: data.designation.trim(),
        chamberName: data.chamberName.trim(),
        chamberAddress: data.chamberAddress.trim(),
        roomNo: data.roomNo ? data.roomNo.trim() || null : null,
        visitingDays: data.visitingDays.trim(),
        visitingHours: data.visitingHours.trim(),
        serialPhone: cleanSerialPhone,
        consultationFee: data.consultationFee ? data.consultationFee.trim() || null : null,
        upazila: data.upazila,
        isActive: false, // Requires admin review and BMDC verification before publishing
        availableToday: false,
        notice: bmdcNote,
      },
    });

    // Notify administrators via realtime channel
    try {
      broadcastAdminAlert({
        category: "partner_request",
        titleBn: `নতুন ডাক্তার নিবন্ধনের আবেদন: ${data.name.trim()}`,
        titleEn: `New doctor registration submitted: ${data.name.trim()}`,
        id: newDocId,
        timestamp: new Date().toISOString(),
      });
    } catch {
      // Graceful fallback if emitter fails
    }

    updateTag(DOCTORS_TAG);
    updateTag("admin-stats");

    return {
      success: true,
      message: "আপনার চেম্বার রেজিস্ট্রেশনের আবেদন সফলভাবে জমা হয়েছে! BMDC রেজিস্ট্রেশন যাচাই শেষে পরবর্তী ১২-২৪ ঘণ্টার মধ্যে তথ্য ডিরেক্টরিতে যুক্ত করা হবে।",
    };
  } catch (error) {
    logger.error("Error in submitDoctorRegistrationAction:", error);
    return {
      success: false,
      message: "সার্ভারে সমস্যা হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন বা সরাসরি আমাদের WhatsApp নম্বরে জানান।",
    };
  }
}
