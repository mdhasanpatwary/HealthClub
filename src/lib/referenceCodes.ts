import "server-only";
import { prisma } from "@/lib/prisma";
import { getCachedPaymentSettings } from "@/app/actions/systemSettingsActions";
import { logger } from "@/lib/logger";

export type ReferenceDiscountType = "free" | "percent" | "fixed";

export interface ReferenceCodeItem {
  code: string;
  type: ReferenceDiscountType;
  value: number; // e.g., 100 for 100% or 50 for 50%, or 200 for ৳200
  isActive: boolean;
  labelBn: string;
  labelEn: string;
}

export interface ReferenceCodeValidationResult {
  valid: boolean;
  code: string;
  discountType?: ReferenceDiscountType;
  discountValue?: number;
  discountAmount: number;
  finalFee: number;
  originalFee: number;
  messageBn: string;
  messageEn: string;
}

// Built-in default reference codes
export const DEFAULT_REFERENCE_CODES: ReferenceCodeItem[] = [
  {
    code: "FREECLUB",
    type: "free",
    value: 100,
    isActive: true,
    labelBn: "১০০% ফ্রি মেম্বারশিপ অফার",
    labelEn: "100% Free Membership Offer",
  },
  {
    code: "HEALTHFREE",
    type: "free",
    value: 100,
    isActive: true,
    labelBn: "১০০% ফ্রি মেম্বারশিপ অফার",
    labelEn: "100% Free Membership Offer",
  },
  {
    code: "HC50",
    type: "percent",
    value: 50,
    isActive: true,
    labelBn: "৫০% স্পেশাল মেম্বার ডিসকাউন্ট",
    labelEn: "50% Special Member Discount",
  },
  {
    code: "SPECIAL50",
    type: "percent",
    value: 50,
    isActive: true,
    labelBn: "৫০% স্পেশাল মেম্বার ডিসকাউন্ট",
    labelEn: "50% Special Member Discount",
  },
  {
    code: "HEALTH200",
    type: "fixed",
    value: 200,
    isActive: true,
    labelBn: "৳২০০ মেম্বার ফি ছাড়",
    labelEn: "৳200 Member Fee Discount",
  },
];

/**
 * Loads all active reference codes from SystemSettings or fallback defaults.
 */
export async function getAllActiveReferenceCodes(): Promise<ReferenceCodeItem[]> {
  try {
    const setting = await prisma.systemSetting.findUnique({
      where: { key: "reference_codes_config" },
    });

    if (setting?.value) {
      try {
        const parsed = JSON.parse(setting.value);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.filter((item: ReferenceCodeItem) => item && item.isActive);
        }
      } catch (err) {
        logger.error("Error parsing reference_codes_config JSON:", err);
      }
    }
  } catch (err) {
    logger.error("Error fetching reference codes from DB:", err);
  }

  return DEFAULT_REFERENCE_CODES.filter((item) => item.isActive);
}

/**
 * Validates a reference code and calculates the discount for the selected tier.
 */
export async function evaluateReferenceCode(
  rawCode: string,
  tier: "founding" | "premium"
): Promise<ReferenceCodeValidationResult> {
  const cleanCode = rawCode?.trim().toUpperCase();

  const paymentSettings = await getCachedPaymentSettings();
  const rawFee = tier === "founding" ? paymentSettings.foundingFee : paymentSettings.premiumFee;
  const originalFee = Math.max(0, parseInt(rawFee || (tier === "founding" ? "0" : "500"), 10));

  if (!cleanCode) {
    return {
      valid: false,
      code: "",
      discountAmount: 0,
      finalFee: originalFee,
      originalFee,
      messageBn: "রেফারেন্স কোড দিন।",
      messageEn: "Please enter a reference code.",
    };
  }

  // 1. Check in configured system promo/reference codes
  const activeCodes = await getAllActiveReferenceCodes();
  const matchedPromo = activeCodes.find(
    (item) => item.code.toUpperCase() === cleanCode && item.isActive
  );

  if (matchedPromo) {
    let discountAmount = 0;
    if (matchedPromo.type === "free" || matchedPromo.value >= 100) {
      discountAmount = originalFee;
    } else if (matchedPromo.type === "percent") {
      discountAmount = Math.round((originalFee * matchedPromo.value) / 100);
    } else if (matchedPromo.type === "fixed") {
      discountAmount = Math.min(originalFee, matchedPromo.value);
    }

    const finalFee = Math.max(0, originalFee - discountAmount);
    const isFree = finalFee === 0 || matchedPromo.type === "free";

    return {
      valid: true,
      code: cleanCode,
      discountType: matchedPromo.type,
      discountValue: matchedPromo.value,
      discountAmount,
      finalFee,
      originalFee,
      messageBn: isFree
        ? `প্রযোজ্য: ${matchedPromo.labelBn} (মেম্বারশিপ সম্পূর্ণ ফ্রি!)`
        : `প্রযোজ্য: ${matchedPromo.labelBn} (ছাড়: ৳${discountAmount}, প্রদেয়: ৳${finalFee})`,
      messageEn: isFree
        ? `Applied: ${matchedPromo.labelEn} (100% Free Membership!)`
        : `Applied: ${matchedPromo.labelEn} (Discount: ৳${discountAmount}, Payable: ৳${finalFee})`,
    };
  }

  // 2. Check if reference code matches an existing active Member's phone or ID
  try {
    const referringMember = await prisma.member.findFirst({
      where: {
        OR: [
          { phone: cleanCode },
          { id: cleanCode },
        ],
        status: "active",
      },
      select: { id: true, name: true, phone: true },
    });

    if (referringMember) {
      // 20% discount on peer referral
      const referralPercent = 20;
      const discountAmount = Math.round((originalFee * referralPercent) / 100);
      const finalFee = Math.max(0, originalFee - discountAmount);

      return {
        valid: true,
        code: cleanCode,
        discountType: "percent",
        discountValue: referralPercent,
        discountAmount,
        finalFee,
        originalFee,
        messageBn: `রেফারেল প্রযোজ্য: মেম্বার ${referringMember.name}-এর রেফারেন্সে ২০% ছাড় (প্রদেয়: ৳${finalFee})!`,
        messageEn: `Referral Applied: 20% discount via member ${referringMember.name} (Payable: ৳${finalFee})!`,
      };
    }
  } catch (err) {
    logger.error("Error verifying peer referral member:", err);
  }

  return {
    valid: false,
    code: cleanCode,
    discountAmount: 0,
    finalFee: originalFee,
    originalFee,
    messageBn: "রেফারেন্স কোডটি সঠিক নয় বা মেয়াদোত্তীর্ণ।",
    messageEn: "Invalid or expired reference code.",
  };
}
