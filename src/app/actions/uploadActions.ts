"use server";

import { getSessionUser } from "@/lib/session";
import { getClientIp, checkRateLimit } from "@/lib/rateLimit";
import { logger } from "@/lib/logger";
import {
  uploadBase64Image,
  isStorageConfigured,
  StorageFolder,
  StorageUploadResult,
} from "@/services/storageService";

export interface ClientUploadResult extends StorageUploadResult {
  isConfigured: boolean;
}

const UPLOAD_RATE_LIMIT = {
  limit: 40,
  windowMs: 10 * 60 * 1000, // 40 uploads per 10 minutes per IP
};

/**
 * Server action to securely upload an image to Supabase Storage.
 * Callable from client components such as ImageUpload.
 */
export async function uploadImageAction(
  base64Data: string,
  folder: StorageFolder = "members",
  customEntityId?: string
): Promise<ClientUploadResult> {
  if (!isStorageConfigured()) {
    return {
      success: false,
      isConfigured: false,
      error: "Supabase Storage credentials are not configured.",
    };
  }

  const ip = await getClientIp();
  const rateLimit = checkRateLimit(
    `upload:${ip}`,
    UPLOAD_RATE_LIMIT.limit,
    UPLOAD_RATE_LIMIT.windowMs
  );

  if (!rateLimit.success) {
    return {
      success: false,
      isConfigured: true,
      error: "খুব বেশি ছবি আপলোড করা হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর চেষ্টা করুন।",
    };
  }

  if (!base64Data || typeof base64Data !== "string") {
    return {
      success: false,
      isConfigured: true,
      error: "কোনো ছবি ডেটা পাওয়া যায়নি।",
    };
  }

  // Ensure it is an image data URL
  if (!base64Data.startsWith("data:image/")) {
    return {
      success: false,
      isConfigured: true,
      error: "শুধুমাত্র ছবি (JPG, PNG, WebP) গ্রহণযোগ্য।",
    };
  }

  // Enforce 5MB limit
  const approxSizeBytes = (base64Data.length * 3) / 4;
  if (approxSizeBytes > 5.5 * 1024 * 1024) {
    return {
      success: false,
      isConfigured: true,
      error: "ছবির সাইজ সর্বোচ্চ ৫ মেগাবাইট হতে পারবে।",
    };
  }

  // Derive entityId if available from session
  const session = await getSessionUser();
  const entityId = customEntityId || session?.userId || "upload";

  try {
    const res = await uploadBase64Image(base64Data, folder, entityId);
    return {
      ...res,
      isConfigured: true,
    };
  } catch (error) {
    logger.error("Error in uploadImageAction:", error);
    return {
      success: false,
      isConfigured: true,
      error: "ছবি আপলোড করতে ব্যর্থ হয়েছে।",
    };
  }
}
