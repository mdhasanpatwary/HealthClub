"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/client/client";
import { getSessionUser } from "@/lib/session";
import { logger } from "@/lib/logger";
import { PaginatedResult } from "@/types/pagination";
import { hasAdminPermission } from "@/lib/permissions";
import { updateTag } from "next/cache";
import {
  checkRateLimit,
  getClientIp,
  RATE_LIMIT_RULES,
} from "@/lib/rateLimit";
import { contactMessageSchema } from "@/lib/validations/contact";

async function verifyMessageAdmin(): Promise<boolean> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") return false;
  const role = session.adminRole || "super_admin";
  return hasAdminPermission(role, "manage_messages");
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  message: string;
  createdAt: string; // ISO string for safe serialization
}

export interface GetPaginatedContactMessagesParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export async function getPaginatedContactMessagesAction(
  params?: GetPaginatedContactMessagesParams
): Promise<PaginatedResult<ContactMessage>> {
  if (!await verifyMessageAdmin()) {
    return {
      data: [],
      totalItems: 0,
      totalPages: 1,
      currentPage: 1,
      pageSize: params?.pageSize || 10,
    };
  }

  const page = Math.max(1, params?.page || 1);
  const pageSize = Math.max(1, params?.pageSize || 10);
  const search = params?.search?.trim();

  const where: Prisma.ContactMessageWhereInput = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { message: { contains: search, mode: "insensitive" } },
    ];
  }

  try {
    const [totalItems, data] = await Promise.all([
      prisma.contactMessage.count({ where }),
      prisma.contactMessage.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    const messages: ContactMessage[] = data.map((m) => ({
      id: m.id,
      name: m.name,
      phone: m.phone,
      email: m.email,
      message: m.message,
      createdAt: m.createdAt.toISOString(),
    }));

    return {
      data: messages,
      totalItems,
      totalPages: Math.max(1, Math.ceil(totalItems / pageSize)),
      currentPage: page,
      pageSize,
    };
  } catch (error) {
    logger.error("Error in getPaginatedContactMessagesAction:", error);
    return { data: [], totalItems: 0, totalPages: 1, currentPage: 1, pageSize };
  }
}


/**
 * Adds a new contact message. Accessible by anyone (public).
 */
export async function addContactMessageAction(data: {
  name: string;
  phone: string;
  email?: string;
  message: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const ip = await getClientIp();
    const rateLimit = checkRateLimit(
      `contact:${ip}`,
      RATE_LIMIT_RULES.CONTACT_MESSAGE_PER_IP.limit,
      RATE_LIMIT_RULES.CONTACT_MESSAGE_PER_IP.windowMs
    );
    if (!rateLimit.success) {
      return {
        success: false,
        error: rateLimit.message || "আপনি খুব দ্রুত বার্তা পাঠাচ্ছেন। অনুগ্রহ করে কিছুক্ষণ পর চেষ্টা করুন।",
      };
    }

    const parsed = contactMessageSchema.safeParse(data);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "সকল প্রয়োজনীয় তথ্য সঠিকভাবে পূরণ করুন।",
      };
    }

    await prisma.contactMessage.create({
      data: {
        name: parsed.data.name,
        phone: parsed.data.phone,
        email: parsed.data.email || null,
        message: parsed.data.message,
      },
    });

    updateTag("admin-stats");

    return { success: true };
  } catch (error) {
    logger.error("Error in addContactMessageAction:", error);
    return { success: false, error: "Failed to send message." };
  }
}

/**
 * Retrieves all contact messages. Admin only.
 */
export async function getContactMessagesAction(): Promise<ContactMessage[]> {
  if (!await verifyMessageAdmin()) {
    return [];
  }

  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });

    return messages.map((m) => ({
      id: m.id,
      name: m.name,
      phone: m.phone,
      email: m.email,
      message: m.message,
      createdAt: m.createdAt.toISOString(),
    }));
  } catch (error) {
    logger.error("Error in getContactMessagesAction:", error);
    return [];
  }
}

/**
 * Deletes a contact message by ID. Admin only.
 */
export async function deleteContactMessageAction(id: string): Promise<boolean> {
  if (!await verifyMessageAdmin()) {
    return false;
  }

  try {
    await prisma.contactMessage.delete({
      where: { id },
    });
    updateTag("admin-stats");
    return true;
  } catch (error) {
    logger.error("Error in deleteContactMessageAction:", error);
    return false;
  }
}

const EMERGENCY_TAG = "emergency-data";

const UPAZILA_NAME_TO_ID: Record<string, string> = {
  "ফেনী সদর": "feni-sadar",
  "feni-sadar": "feni-sadar",
  "দাগনভূঞা": "daganbhuiyan",
  "daganbhuiyan": "daganbhuiyan",
  "ছাগলনাইয়া": "chhagalnaiya",
  "ছাগলনাইয়া": "chhagalnaiya",
  "chhagalnaiya": "chhagalnaiya",
  "পরশুরাম": "parshuram",
  "parshuram": "parshuram",
  "সোনাগাজী": "sonagazi",
  "sonagazi": "sonagazi",
  "ফুলগাজী": "fulgazi",
  "fulgazi": "fulgazi",
};

/**
 * Converts or adds a contact message directly into the emergency database
 * (as a Blood Donor or Ambulance Service). Admin only.
 */
export async function convertContactMessageToEmergencyAction(messageId: string): Promise<{
  success: boolean;
  type?: "donor" | "ambulance";
  name?: string;
  error?: string;
}> {
  if (!await verifyMessageAdmin()) {
    return { success: false, error: "অননুমোদিত অ্যাক্সেস।" };
  }

  try {
    const msg = await prisma.contactMessage.findUnique({
      where: { id: messageId },
    });

    if (!msg) {
      return { success: false, error: "বার্তাটি পাওয়া যায়নি।" };
    }

    const text = msg.message;
    const isDonor = text.includes("রক্তদাতা") || text.includes("রক্তের গ্রুপ");
    const isAmbulance = text.includes("অ্যাম্বুলেন্স") || text.includes("এম্বুলেন্স");

    if (!isDonor && !isAmbulance) {
      return { success: false, error: "এই বার্তাটি রক্তদাতা বা অ্যাম্বুলেন্স সংক্রান্ত নয়।" };
    }

    if (isDonor) {
      // Parse blood donor info
      const bloodGroupMatch = text.match(/রক্তের\s*গ্রুপ\s*:\s*([A-Za-z0-9+-]+)/);
      const rawGroup = bloodGroupMatch ? bloodGroupMatch[1].trim().toUpperCase() : "A+";
      const validGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
      const bloodGroup = (validGroups.includes(rawGroup) ? rawGroup : "A+") as
        | "A+"
        | "A-"
        | "B+"
        | "B-"
        | "O+"
        | "O-"
        | "AB+"
        | "AB-";

      const upazilaMatch = text.match(/উপজেলা\s*:\s*([^|]+)/);
      const rawUpazila = upazilaMatch ? upazilaMatch[1].trim() : "ফেনী সদর";
      const upazila = UPAZILA_NAME_TO_ID[rawUpazila] || "feni-sadar";

      const lastDonatedMatch = text.match(/শেষ\s*রক্তদান\s*:\s*([^|]+)/);
      const lastDonated = lastDonatedMatch ? lastDonatedMatch[1].trim() : "তথ্য নেই";

      const donorId = `donor-msg-${msg.id.slice(0, 8)}`;
      const cleanPhone = msg.phone.trim();

      await prisma.bloodDonor.upsert({
        where: { phone: cleanPhone },
        update: {
          name: msg.name.trim(),
          bloodGroup,
          upazila,
          lastDonated,
          isAvailable: true,
          status: "approved",
        },
        create: {
          id: donorId,
          name: msg.name.trim(),
          bloodGroup,
          upazila,
          phone: cleanPhone,
          lastDonated,
          isAvailable: true,
          status: "approved",
          createdAt: msg.createdAt,
        },
      });

      try {
        const { revalidateTag, revalidatePath } = await import("next/cache");
        updateTag(EMERGENCY_TAG);
        updateTag("admin-stats");
        revalidateTag(EMERGENCY_TAG, "max");
        revalidatePath("/emergency");
        revalidatePath("/admin/emergency");
        revalidatePath("/admin/messages");
      } catch (e) {
        logger.warn("Cache revalidation note:", e);
      }

      return {
        success: true,
        type: "donor",
        name: msg.name,
      };
    }

    if (isAmbulance) {
      // Parse ambulance info
      const typeMatch = text.match(/ধরন\s*:\s*([^|]+)/);
      const rawType = typeMatch ? typeMatch[1].trim().toUpperCase() : "AC";
      const validType = ["ICU", "AC", "NON-AC", "FREEZER"].includes(rawType)
        ? rawType === "NON-AC"
          ? "Non-AC"
          : (rawType as "ICU" | "AC" | "Freezer")
        : "AC";

      const locationMatch = text.match(/স্ট্যান্ড\/এলাকা\s*:\s*([^|]+)/);
      const rawLocation = locationMatch ? locationMatch[1].trim() : "ফেনী সদর";

      const coverageMatch = text.match(/কভারেজ\s*(?:রুট)?\s*:\s*([^|]+)/);
      const coverage = coverageMatch ? ` | কভারেজ: ${coverageMatch[1].trim()}` : "";

      const location = `${rawLocation}${coverage}`;
      const ambId = `amb-msg-${msg.id.slice(0, 8)}`;
      const cleanPhone = msg.phone.trim();

      await prisma.ambulanceService.upsert({
        where: { phone: cleanPhone },
        update: {
          name: msg.name.trim(),
          type: validType,
          location,
          availableHours: "২৪/৭ সার্বক্ষণিক",
          status: "approved",
        },
        create: {
          id: ambId,
          name: msg.name.trim(),
          type: validType,
          location,
          phone: cleanPhone,
          availableHours: "২৪/৭ সার্বক্ষণিক",
          status: "approved",
          createdAt: msg.createdAt,
        },
      });

      try {
        const { revalidateTag, revalidatePath } = await import("next/cache");
        updateTag(EMERGENCY_TAG);
        updateTag("admin-stats");
        revalidateTag(EMERGENCY_TAG, "max");
        revalidatePath("/emergency");
        revalidatePath("/admin/emergency");
        revalidatePath("/admin/messages");
      } catch (e) {
        logger.warn("Cache revalidation note:", e);
      }

      return {
        success: true,
        type: "ambulance",
        name: msg.name,
      };
    }

    return { success: false, error: "অজানা সমস্যা হয়েছে।" };
  } catch (error) {
    logger.error("Error in convertContactMessageToEmergencyAction:", error);
    return { success: false, error: "ডাটাবেজে যুক্ত করতে ব্যর্থ হয়েছে।" };
  }
}
