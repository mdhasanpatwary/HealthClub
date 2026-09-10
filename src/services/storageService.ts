import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { logger } from "@/lib/logger";

const DEFAULT_SUPABASE_URL = "https://uqtodphwiwzikmhsyiyc.supabase.co";
export const STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "healthclub-public";

let storageClientInstance: SupabaseClient | null = null;

/**
 * Returns a server-side Supabase client authenticated for Storage operations.
 * Prefers SUPABASE_SERVICE_ROLE_KEY if available, falling back to NEXT_PUBLIC_SUPABASE_ANON_KEY.
 */
export function getStorageSupabaseClient(): SupabaseClient | null {
  if (storageClientInstance) {
    return storageClientInstance;
  }

  const supabaseUrl =
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    DEFAULT_SUPABASE_URL;

  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  try {
    storageClientInstance = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    return storageClientInstance;
  } catch (error) {
    logger.error("Failed to initialize Storage Supabase client:", error);
    return null;
  }
}

/**
 * Checks if Supabase Storage is configured with required credentials.
 */
export function isStorageConfigured(): boolean {
  return Boolean(
    (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL) &&
    (process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.SUPABASE_ANON_KEY)
  );
}

export type StorageFolder = "members" | "partners" | "doctors";

export interface StorageUploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Uploads a base64 Data URL or Buffer to Supabase Storage bucket and returns the public CDN URL.
 */
export async function uploadBase64Image(
  dataUrlOrBuffer: string | Buffer,
  folder: StorageFolder,
  entityId?: string,
  explicitMimeType?: string
): Promise<StorageUploadResult> {
  const client = getStorageSupabaseClient();
  if (!client) {
    logger.warn("[Storage] Supabase client credentials missing. Storage upload skipped.");
    return {
      success: false,
      error: "Supabase Storage credentials not configured.",
    };
  }

  try {
    let buffer: Buffer;
    let mimeType = explicitMimeType || "image/jpeg";

    if (Buffer.isBuffer(dataUrlOrBuffer)) {
      buffer = dataUrlOrBuffer;
    } else if (typeof dataUrlOrBuffer === "string") {
      if (dataUrlOrBuffer.startsWith("data:")) {
        const matches = dataUrlOrBuffer.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
          return { success: false, error: "Invalid base64 data format." };
        }
        mimeType = matches[1];
        buffer = Buffer.from(matches[2], "base64");
      } else {
        buffer = Buffer.from(dataUrlOrBuffer, "base64");
      }
    } else {
      return { success: false, error: "Unsupported image input format." };
    }

    // Determine clean file extension
    let extension = "jpg";
    if (mimeType.includes("png")) extension = "png";
    else if (mimeType.includes("webp")) extension = "webp";
    else if (mimeType.includes("gif")) extension = "gif";

    const cleanEntityId = (entityId || "img")
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 32);
    const uniqueSuffix = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const filePath = `${folder}/${cleanEntityId}_${uniqueSuffix}.${extension}`;

    const { error: uploadError } = await client.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, buffer, {
        contentType: mimeType,
        upsert: true,
        cacheControl: "31536000", // 1 year cache
      });

    if (uploadError) {
      logger.error(`[Storage] Failed to upload ${filePath}:`, uploadError);
      return { success: false, error: uploadError.message };
    }

    const { data: publicData } = client.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);

    if (!publicData?.publicUrl) {
      return { success: false, error: "Failed to retrieve public CDN URL." };
    }

    return {
      success: true,
      url: publicData.publicUrl,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Unknown storage error";
    logger.error("[Storage] Unexpected error uploading image:", err);
    return { success: false, error: errorMsg };
  }
}

/**
 * Ensures an image URL is converted to a Supabase Storage CDN URL if it is currently a base64 string.
 * If storage is not configured or the URL is already an HTTP(S) link, returns the original string safely.
 */
export async function ensureStorageUrl(
  imageUrl: string | null | undefined,
  folder: StorageFolder,
  entityId?: string
): Promise<string | null> {
  if (!imageUrl) return null;

  // Already an external or CDN HTTP URL
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  // Base64 data URL to be migrated to CDN
  if (imageUrl.startsWith("data:image/")) {
    if (!isStorageConfigured()) {
      logger.warn(`[Storage] Cannot migrate base64 image for ${folder}/${entityId || "unknown"}: Storage not configured.`);
      return imageUrl;
    }

    const res = await uploadBase64Image(imageUrl, folder, entityId);
    if (res.success && res.url) {
      return res.url;
    }
  }

  return imageUrl;
}

/**
 * Removes an image from Supabase Storage given its public CDN URL.
 */
export async function deleteImageFromStorage(publicUrl: string): Promise<boolean> {
  const client = getStorageSupabaseClient();
  if (!client || !publicUrl) return false;

  try {
    const marker = `/object/public/${STORAGE_BUCKET}/`;
    const markerIndex = publicUrl.indexOf(marker);
    if (markerIndex === -1) return false;

    const filePath = decodeURIComponent(publicUrl.substring(markerIndex + marker.length));
    const { error } = await client.storage.from(STORAGE_BUCKET).remove([filePath]);
    if (error) {
      logger.error(`[Storage] Failed to delete ${filePath}:`, error);
      return false;
    }
    return true;
  } catch (err) {
    logger.error("[Storage] Error deleting object from storage:", err);
    return false;
  }
}
