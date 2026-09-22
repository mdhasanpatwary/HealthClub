"use server";

import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { updateTag, revalidateTag, revalidatePath } from "next/cache";
import { getSessionUser } from "@/lib/session";
import { hasAdminPermission } from "@/lib/permissions";

const PARTNERS_TAG = "partners";

function revalidateRequestCaches() {
  try {
    updateTag(PARTNERS_TAG);
    updateTag("homepage-partners");
    updateTag("admin-stats");
    revalidateTag(PARTNERS_TAG, "max");
    revalidateTag("homepage-partners", "max");
    revalidateTag("admin-stats", "max");
    revalidatePath("/partner-hospitals");
    revalidatePath("/");
    revalidatePath("/admin/partners");
    revalidatePath("/admin/partner-requests");
    revalidatePath("/dashboard");
  } catch (err) {
    logger.warn("Failed to revalidate partner request caches:", err);
  }
}

async function verifyPartnerRequestAdmin(): Promise<boolean> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") return false;
  const role = session.adminRole || "super_admin";
  return hasAdminPermission(role, "manage_partner_requests");
}

/**
 * Safely cleans up any orphan partner account created during initial submission
 * if the request was rejected and the partner never created any doctors, staff, or transactions.
 */
async function cleanupOrphanPartner(email?: string | null, phone?: string | null) {
  if (!email && !phone) return;

  try {
    const partner = await prisma.partner.findFirst({
      where: {
        OR: [
          ...(email ? [{ email }] : []),
          ...(phone ? [{ phone }] : []),
        ],
      },
      include: {
        _count: {
          select: {
            doctors: true,
            staff: true,
            transactions: true,
          },
        },
      },
    });

    if (
      partner &&
      partner._count.doctors === 0 &&
      partner._count.staff === 0 &&
      partner._count.transactions === 0
    ) {
      await prisma.partner.delete({ where: { id: partner.id } });
    }
  } catch (err) {
    logger.warn("Failed to clean up orphan partner record:", err);
  }
}

/**
 * Delete a rejected partner request by ID.
 * Only rejected requests can be deleted to prevent accidental data loss.
 */
export async function deletePartnerRequestAction(id: string): Promise<boolean> {
  if (!(await verifyPartnerRequestAdmin())) {
    logger.warn("Unauthorized attempt to delete partner request");
    return false;
  }

  try {
    const req = await prisma.partnerRequest.findUnique({
      where: { id },
      select: { id: true, status: true, email: true, phone: true },
    });

    if (!req) {
      logger.warn(`Partner request ${id} not found for deletion`);
      return false;
    }

    if (req.status !== "rejected") {
      logger.warn(`Cannot delete partner request ${id}: status is '${req.status}', only 'rejected' requests can be deleted`);
      return false;
    }

    await cleanupOrphanPartner(req.email, req.phone);

    await prisma.partnerRequest.delete({
      where: { id },
    });

    revalidateRequestCaches();

    return true;
  } catch (error) {
    logger.error("Error in deletePartnerRequestAction:", error);
    return false;
  }
}

/**
 * Delete all rejected partner requests in bulk.
 */
export async function deleteAllRejectedPartnerRequestsAction(): Promise<{
  success: boolean;
  count: number;
}> {
  if (!(await verifyPartnerRequestAdmin())) {
    logger.warn("Unauthorized attempt to bulk delete rejected partner requests");
    return { success: false, count: 0 };
  }

  try {
    const rejectedList = await prisma.partnerRequest.findMany({
      where: { status: "rejected" },
      select: { id: true, email: true, phone: true },
    });

    if (rejectedList.length === 0) {
      return { success: true, count: 0 };
    }

    for (const req of rejectedList) {
      await cleanupOrphanPartner(req.email, req.phone);
    }

    const deleted = await prisma.partnerRequest.deleteMany({
      where: { status: "rejected" },
    });

    revalidateRequestCaches();

    return { success: true, count: deleted.count };
  } catch (error) {
    logger.error("Error in deleteAllRejectedPartnerRequestsAction:", error);
    return { success: false, count: 0 };
  }
}
