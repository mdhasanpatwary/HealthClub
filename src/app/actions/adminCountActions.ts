"use server";

import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { logger } from "@/lib/logger";

export interface AdminBadgeCounts {
  doctorsCount: number;
  pendingPartnerRequests: number;
  pendingRenewals: number;
  contactMessagesCount: number;
}

const DEFAULT_COUNTS: AdminBadgeCounts = {
  doctorsCount: 0,
  pendingPartnerRequests: 0,
  pendingRenewals: 0,
  contactMessagesCount: 0,
};

/**
 * Returns lightweight SQL count aggregates for administrative nav badges.
 * Executes parallel Prisma count() queries without loading full entity records or images into memory.
 */
export async function getAdminCountsAction(): Promise<AdminBadgeCounts> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") {
    return DEFAULT_COUNTS;
  }

  try {
    const [doctorsCount, pendingPartnerRequests, pendingRenewals, contactMessagesCount] =
      await Promise.all([
        prisma.doctor.count(),
        prisma.partnerRequest.count({ where: { status: "pending" } }),
        prisma.member.count({ where: { renewalStatus: "pending" } }),
        prisma.contactMessage.count(),
      ]);

    return {
      doctorsCount,
      pendingPartnerRequests,
      pendingRenewals,
      contactMessagesCount,
    };
  } catch (error) {
    logger.error("Error in getAdminCountsAction:", error);
    return DEFAULT_COUNTS;
  }
}
