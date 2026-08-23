import { logger } from "@/lib/logger";

export interface SmsSegmentCalculation {
  charCount: number;
  isUnicode: boolean;
  segmentCount: number;
  maxCharsPerSegment: number;
  remainingInCurrentSegment: number;
}

/**
 * Calculates character count and SMS segment count based on standard GSM / Unicode rules.
 * English GSM 7-bit: 1-part = 160 chars, multi-part = 153 chars/segment.
 * Bengali / Unicode: 1-part = 70 chars, multi-part = 67 chars/segment.
 */
export function calculateSmsSegments(text: string): SmsSegmentCalculation {
  if (!text) {
    return {
      charCount: 0,
      isUnicode: false,
      segmentCount: 0,
      maxCharsPerSegment: 160,
      remainingInCurrentSegment: 160,
    };
  }

  // Check if text contains non-ASCII characters (e.g., Bengali script, emojis)
  const isUnicode = /[^\u0000-\u007F]/.test(text);
  const charCount = text.length;

  if (isUnicode) {
    if (charCount <= 70) {
      return {
        charCount,
        isUnicode: true,
        segmentCount: 1,
        maxCharsPerSegment: 70,
        remainingInCurrentSegment: 70 - charCount,
      };
    }
    const segmentCount = Math.ceil(charCount / 67);
    const totalCapacity = segmentCount * 67;
    return {
      charCount,
      isUnicode: true,
      segmentCount,
      maxCharsPerSegment: 67,
      remainingInCurrentSegment: totalCapacity - charCount,
    };
  } else {
    if (charCount <= 160) {
      return {
        charCount,
        isUnicode: false,
        segmentCount: 1,
        maxCharsPerSegment: 160,
        remainingInCurrentSegment: 160 - charCount,
      };
    }
    const segmentCount = Math.ceil(charCount / 153);
    const totalCapacity = segmentCount * 153;
    return {
      charCount,
      isUnicode: false,
      segmentCount,
      maxCharsPerSegment: 153,
      remainingInCurrentSegment: totalCapacity - charCount,
    };
  }
}

/**
 * Normalizes a Bangladeshi phone number into standard 8801XXXXXXXXX format.
 */
export function normalizeBdPhone(phone: string): string {
  if (!phone) return "";
  let cleaned = phone.replace(/[^0-9+]/g, "");
  if (cleaned.startsWith("+88")) {
    cleaned = cleaned.substring(1);
  } else if (cleaned.startsWith("880")) {
    // already 8801...
  } else if (cleaned.startsWith("01")) {
    cleaned = `88${cleaned}`;
  } else if (cleaned.startsWith("1") && cleaned.length === 10) {
    cleaned = `880${cleaned}`;
  }
  return cleaned;
}

export interface SendSmsResult {
  success: boolean;
  phone: string;
  messageId?: string;
  error?: string;
  isSimulated?: boolean;
}

/**
 * Sends a single SMS message.
 * Falls back to simulation logging if SMS gateway credentials are not configured.
 */
export async function sendSms(phone: string, message: string): Promise<SendSmsResult> {
  const normalizedPhone = normalizeBdPhone(phone);
  if (!normalizedPhone || normalizedPhone.length < 11) {
    return {
      success: false,
      phone,
      error: "অকার্যকর মোবাইল নম্বর",
    };
  }

  const apiKey = process.env.SMS_API_KEY;
  const senderId = process.env.SMS_SENDER_ID || "HealthClub";
  const apiUrl = process.env.SMS_API_URL;

  // If no SMS gateway credentials configured, run in simulation mode
  if (!apiKey || !apiUrl || apiKey.includes("placeholder")) {
    logger.info(
      `[SMS SIMULATOR] To: ${normalizedPhone} | Sender: ${senderId} | Text: "${message.substring(0, 60)}${
        message.length > 60 ? "..." : ""
      }"`
    );
    return {
      success: true,
      phone: normalizedPhone,
      messageId: `sim_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      isSimulated: true,
    };
  }

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        sender_id: senderId,
        recipient: normalizedPhone,
        message,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      logger.error(`[SMS GATEWAY ERROR] Status ${res.status} for ${normalizedPhone}: ${errText}`);
      return {
        success: false,
        phone: normalizedPhone,
        error: `Gateway error: HTTP ${res.status}`,
      };
    }

    const data = await res.json().catch(() => ({}));
    return {
      success: true,
      phone: normalizedPhone,
      messageId: (data as { message_id?: string; id?: string }).message_id || `msg_${Date.now()}`,
    };
  } catch (error) {
    logger.error(`[SMS ERROR] Failed to send SMS to ${normalizedPhone}:`, error);
    return {
      success: false,
      phone: normalizedPhone,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Sends SMS messages to a list of phone numbers in batches.
 */
export async function sendBulkSms(
  phones: string[],
  message: string,
  batchSize = 25
): Promise<{ total: number; sent: number; failed: number; results: SendSmsResult[] }> {
  const uniquePhones = Array.from(new Set(phones.map(normalizeBdPhone).filter(Boolean)));
  const results: SendSmsResult[] = [];

  for (let i = 0; i < uniquePhones.length; i += batchSize) {
    const batch = uniquePhones.slice(i, i + batchSize);
    const batchPromises = batch.map((p) => sendSms(p, message));
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
  }

  const sent = results.filter((r) => r.success).length;
  const failed = results.length - sent;

  return {
    total: uniquePhones.length,
    sent,
    failed,
    results,
  };
}
