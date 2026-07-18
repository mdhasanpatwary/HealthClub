import "server-only";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { Partner } from "@/services/db";

/**
 * Fetches all 4 homepage stat counts in a single raw SQL query.
 * Cached for 60 seconds to avoid hitting the DB on every homepage render.
 */
export const getHomepageStats = unstable_cache(
  async () => {
    try {
      const result = await prisma.$queryRawUnsafe<
        Array<{
          member_count: bigint;
          hospital_count: bigint;
          diagnostic_count: bigint;
          pharmacy_count: bigint;
        }>
      >(`
        SELECT
          (SELECT COUNT(*) FROM members WHERE status = 'active') AS member_count,
          (SELECT COUNT(*) FROM partners WHERE category = 'hospital') AS hospital_count,
          (SELECT COUNT(*) FROM partners WHERE category = 'diagnostic') AS diagnostic_count,
          (SELECT COUNT(*) FROM partners WHERE category = 'pharmacy') AS pharmacy_count
      `);

      const row = result[0];
      return {
        memberCount: Number(row?.member_count ?? 0),
        hospitalCount: Number(row?.hospital_count ?? 0),
        diagnosticCount: Number(row?.diagnostic_count ?? 0),
        pharmacyCount: Number(row?.pharmacy_count ?? 0),
      };
    } catch (error) {
      console.error("Error fetching homepage stats:", error);
      return {
        memberCount: 100,
        hospitalCount: 10,
        diagnosticCount: 20,
        pharmacyCount: 5,
      };
    }
  },
  ["homepage-stats"],
  { revalidate: 60, tags: ["homepage-stats"] }
);

/**
 * Fetches partners for the homepage preview section.
 * Cached for 60 seconds. Returns a limited set ordered by newest first.
 */
export const getHomepagePartners = unstable_cache(
  async (limit: number): Promise<Partner[]> => {
    try {
      const data = await prisma.partner.findMany({
        orderBy: { createdAt: "desc" },
        take: limit,
      });

      return data.map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category as Partner["category"],
        address: p.address,
        discount: p.discount,
        phone: p.phone,
        logoText: p.logoText,
        mapLink: p.mapLink || undefined,
        imageUrl: p.imageUrl || undefined,
      }));
    } catch (error) {
      console.error("Error fetching homepage partners:", error);
      return [];
    }
  },
  ["homepage-partners"],
  { revalidate: 60, tags: ["homepage-partners"] }
);
