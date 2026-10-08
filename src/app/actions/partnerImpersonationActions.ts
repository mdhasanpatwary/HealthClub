"use server";

import { prisma } from "@/lib/prisma";
import { Partner } from "@/services/db";
import { getSessionUser, setSessionUser, clearSessionUser, verifyActiveAdminUser } from "@/lib/session";
import { hasAdminPermission } from "@/lib/permissions";
import { logger } from "@/lib/logger";
import { PARTNER_SELECT_FIELDS, formatPartner } from "@/lib/partnerFormat";

export interface ImpersonationResponse {
  success: boolean;
  partner?: Partner;
  error?: string;
}

export interface ImpersonationStatus {
  isImpersonating: boolean;
  adminName?: string;
  adminId?: string;
  partnerId?: string;
}

/**
 * Allows a Super Admin (or Admin with manage_partners permission) to seamlessly
 * log in as a partner without changing passwords or using manual credentials.
 */
export async function impersonatePartnerAction(partnerId: string): Promise<ImpersonationResponse> {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "admin") {
      return {
        success: false,
        error: "অননুমোদিত অ্যাক্সেস। শুধুমাত্র অ্যাডমিন এই সুবিধা ব্যবহার করতে পারবেন।",
      };
    }

    const adminRole = session.adminRole || "super_admin";
    if (!hasAdminPermission(adminRole, "manage_partners")) {
      return {
        success: false,
        error: "আপনার পার্টনার প্যানেল অ্যাক্সেস করার অনুমতি নেই।",
      };
    }

    const partnerData = await prisma.partner.findUnique({
      where: { id: partnerId },
      select: PARTNER_SELECT_FIELDS,
    });

    if (!partnerData) {
      return {
        success: false,
        error: "পার্টনার চিকিৎসাকেন্দ্র খুঁজে পাওয়া যায়নি।",
      };
    }

    // Switch session to partner while preserving original admin identification
    await setSessionUser(partnerData.id, "partner", {
      partnerId: partnerData.id,
      impersonatorAdminId: session.userId,
      impersonatorAdminRole: adminRole,
      impersonatorAdminName: session.adminName || "সুপার অ্যাডমিন",
    });

    logger.info(
      `[IMPERSONATION] Admin ${session.userId} (${session.adminName || "Super Admin"}) started impersonating partner ${partnerData.id} (${partnerData.name})`
    );

    return {
      success: true,
      partner: formatPartner(partnerData),
    };
  } catch (error) {
    logger.error("Error in impersonatePartnerAction:", error);
    return {
      success: false,
      error: "পার্টনার প্যানেলে প্রবেশ করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।",
    };
  }
}

/**
 * Reverts an active partner impersonation session back to the original Super Admin session.
 */
export async function stopImpersonatingPartnerAction(): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await getSessionUser();
    if (!session || !session.impersonatorAdminId) {
      return {
        success: false,
        error: "কোনো সক্রিয় ইম্পার্সোনেশন সেশন পাওয়া যায়নি।",
      };
    }

    const originalAdminId = session.impersonatorAdminId;
    const admin = await verifyActiveAdminUser(originalAdminId, session.impersonatorAdminRole);

    if (!admin) {
      await clearSessionUser();
      return {
        success: false,
        error: "মূল অ্যাডমিন অ্যাকাউন্ট নিষ্ক্রিয় বা পাওয়া যায়নি। দয়া করে পুনরায় লগইন করুন।",
      };
    }

    // Restore original admin session
    await setSessionUser(admin.id, "admin", {
      adminRole: admin.role,
      adminName: admin.name,
      adminEmail: admin.email,
    });

    logger.info(`[IMPERSONATION] Admin ${admin.id} (${admin.name}) exited partner impersonation session.`);

    return { success: true };
  } catch (error) {
    logger.error("Error in stopImpersonatingPartnerAction:", error);
    return {
      success: false,
      error: "অ্যাডমিন প্যানেলে ফিরে যেতে সমস্যা হয়েছে।",
    };
  }
}

/**
 * Checks if the current request is running under an active admin impersonation session.
 */
export async function getImpersonationStatusAction(): Promise<ImpersonationStatus> {
  try {
    const session = await getSessionUser();
    if (session && session.impersonatorAdminId) {
      return {
        isImpersonating: true,
        adminName: session.impersonatorAdminName || "সুপার অ্যাডমিন",
        adminId: session.impersonatorAdminId,
        partnerId: session.userId,
      };
    }
    return { isImpersonating: false };
  } catch {
    return { isImpersonating: false };
  }
}
