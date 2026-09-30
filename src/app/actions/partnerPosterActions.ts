"use server";

import { prisma } from "@/lib/prisma";
import { Partner } from "@/services/db";
import { getSessionUser } from "@/lib/session";
import { hasAdminPermission } from "@/lib/permissions";
import { logger } from "@/lib/logger";
import { formatPartner, PARTNER_CARD_SELECT_FIELDS, PARTNER_FULL_SELECT_FIELDS } from "@/lib/partnerFormat";

async function verifyPartnerAdmin(): Promise<boolean> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") return false;
  const role = session.adminRole || "super_admin";
  return hasAdminPermission(role, "manage_partners");
}

/**
 * Fetch all verified partner facilities for marketing poster and QR code generation.
 * Enforces geographic scope: filters for Feni Sadar and active partner status.
 */
export async function getPartnersForPostersAction(): Promise<Partner[]> {
  const isAuthorized = await verifyPartnerAdmin();
  if (!isAuthorized) {
    logger.warn("[partnerPosterActions] Unauthorized attempt to access poster partners list");
    return [];
  }

  try {
    const data = await prisma.partner.findMany({
      where: {
        isPartner: true,
        upazila: "feni-sadar",
      },
      orderBy: [
        { category: "asc" },
        { name: "asc" },
      ],
      select: PARTNER_CARD_SELECT_FIELDS,
    });

    return data.map(formatPartner);
  } catch (error) {
    logger.error("Error in getPartnersForPostersAction:", error);
    return [];
  }
}

/**
 * Fetch single full partner detail for poster rendering.
 */
export async function getSinglePartnerForPosterAction(idOrSlug: string): Promise<Partner | null> {
  const isAuthorized = await verifyPartnerAdmin();
  if (!isAuthorized) {
    return null;
  }

  try {
    const isId = idOrSlug.startsWith("p_");
    const partner = await prisma.partner.findFirst({
      where: isId ? { id: idOrSlug } : { slug: idOrSlug },
      select: PARTNER_FULL_SELECT_FIELDS,
    });

    if (!partner) return null;
    return formatPartner(partner);
  } catch (error) {
    logger.error("Error in getSinglePartnerForPosterAction:", error);
    return null;
  }
}
