"use server";

import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { logger } from "@/lib/logger";
import { PaginatedResult } from "@/types/pagination";

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
  const session = await getSessionUser();
  if (!session || session.role !== "admin") {
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};
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
    if (!data.name || !data.phone || !data.message) {
      return { success: false, error: "Name, phone, and message are required." };
    }

    await prisma.contactMessage.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        message: data.message,
      },
    });

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
  const session = await getSessionUser();
  if (!session || session.role !== "admin") {
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
  const session = await getSessionUser();
  if (!session || session.role !== "admin") {
    return false;
  }

  try {
    await prisma.contactMessage.delete({
      where: { id },
    });
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
  const session = await getSessionUser();
  if (!session || session.role !== "admin") {
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

      const setting = await prisma.systemSetting.findUnique({
        where: { key: "emergency_donors" },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let donors: any[] = [];
      if (setting?.value) {
        try {
          donors = JSON.parse(setting.value);
        } catch (e) {
          logger.error("Failed to parse emergency_donors", e);
        }
      }

      const donorId = `donor-msg-${msg.id.slice(0, 8)}`;
      const donorRecord = {
        id: donorId,
        name: msg.name.trim(),
        bloodGroup,
        upazila,
        phone: msg.phone.trim(),
        lastDonated,
        isAvailable: true,
        status: "approved",
        createdAt: msg.createdAt.toISOString(),
      };

      const existingIndex = donors.findIndex(
        (d) => d.id === donorId || d.phone === msg.phone.trim()
      );
      if (existingIndex >= 0) {
        donors[existingIndex] = { ...donors[existingIndex], ...donorRecord };
      } else {
        donors.unshift(donorRecord);
      }

      await prisma.systemSetting.upsert({
        where: { key: "emergency_donors" },
        create: { key: "emergency_donors", value: JSON.stringify(donors) },
        update: { value: JSON.stringify(donors) },
      });

      try {
        const { updateTag, revalidateTag, revalidatePath } = await import("next/cache");
        updateTag(EMERGENCY_TAG);
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

      const setting = await prisma.systemSetting.findUnique({
        where: { key: "emergency_ambulances" },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let ambulances: any[] = [];
      if (setting?.value) {
        try {
          ambulances = JSON.parse(setting.value);
        } catch (e) {
          logger.error("Failed to parse emergency_ambulances", e);
        }
      }

      const ambId = `amb-msg-${msg.id.slice(0, 8)}`;
      const ambulanceRecord = {
        id: ambId,
        name: msg.name.trim(),
        type: validType,
        location,
        phone: msg.phone.trim(),
        availableHours: "২৪/৭ সার্বক্ষণিক",
        status: "approved",
        createdAt: msg.createdAt.toISOString(),
      };

      const existingIndex = ambulances.findIndex(
        (a) => a.id === ambId || a.phone === msg.phone.trim()
      );
      if (existingIndex >= 0) {
        ambulances[existingIndex] = { ...ambulances[existingIndex], ...ambulanceRecord };
      } else {
        ambulances.unshift(ambulanceRecord);
      }

      await prisma.systemSetting.upsert({
        where: { key: "emergency_ambulances" },
        create: { key: "emergency_ambulances", value: JSON.stringify(ambulances) },
        update: { value: JSON.stringify(ambulances) },
      });

      try {
        const { updateTag, revalidateTag, revalidatePath } = await import("next/cache");
        updateTag(EMERGENCY_TAG);
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
