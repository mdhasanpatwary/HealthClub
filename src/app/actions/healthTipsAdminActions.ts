"use server";

import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { logger } from "@/lib/logger";
import { unstable_cache, updateTag, revalidatePath } from "next/cache";
import { HealthTipArticle, HEALTH_TIPS_ARTICLES } from "@/data/healthTipsData";
import { PaginatedResult } from "@/types/pagination";
import { hasAdminPermission } from "@/lib/permissions";

const HEALTH_TIPS_TAG = "health-tips-data";
const ARTICLES_SETTING_KEY = "health_tips_articles";
const DELETED_SLUGS_SETTING_KEY = "health_tips_deleted_slugs";

async function verifyAdmin(): Promise<boolean> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") return false;
  const role = session.adminRole || "super_admin";
  return hasAdminPermission(role, "manage_health_tips");
}

async function getDeletedSlugs(): Promise<string[]> {
  try {
    const setting = await prisma.systemSetting.findUnique({
      where: { key: DELETED_SLUGS_SETTING_KEY },
    });
    if (!setting?.value) return [];
    const parsed = JSON.parse(setting.value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    logger.error("Failed to parse health tips deleted slugs:", err);
    return [];
  }
}

async function markSlugAsDeleted(slug: string): Promise<void> {
  try {
    const current = await getDeletedSlugs();
    if (!current.includes(slug)) {
      const updated = [...current, slug];
      await prisma.systemSetting.upsert({
        where: { key: DELETED_SLUGS_SETTING_KEY },
        create: {
          key: DELETED_SLUGS_SETTING_KEY,
          value: JSON.stringify(updated),
        },
        update: { value: JSON.stringify(updated) },
      });
    }
  } catch (err) {
    logger.error(`Failed to mark slug as deleted: ${slug}`, err);
  }
}

async function unmarkSlugAsDeleted(slug: string): Promise<void> {
  try {
    const current = await getDeletedSlugs();
    if (current.includes(slug)) {
      const updated = current.filter((s) => s !== slug);
      await prisma.systemSetting.upsert({
        where: { key: DELETED_SLUGS_SETTING_KEY },
        create: {
          key: DELETED_SLUGS_SETTING_KEY,
          value: JSON.stringify(updated),
        },
        update: { value: JSON.stringify(updated) },
      });
    }
  } catch (err) {
    logger.error(`Failed to unmark slug as deleted: ${slug}`, err);
  }
}

export interface GetPaginatedHealthTipsAdminParams {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
}

export async function getPaginatedHealthTipsAdminAction(
  params?: GetPaginatedHealthTipsAdminParams
): Promise<PaginatedResult<HealthTipArticle>> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin" || !hasAdminPermission(session.adminRole || "super_admin", "manage_health_tips")) {
    return {
      data: [],
      totalItems: 0,
      totalPages: 1,
      currentPage: 1,
      pageSize: params?.pageSize || 10,
    };
  }

  const allArticles = await getAllHealthTipsAction();
  const page = Math.max(1, params?.page || 1);
  const pageSize = Math.max(1, params?.pageSize || 10);
  const search = params?.search?.trim().toLowerCase();
  const category = params?.category;

  let filtered = allArticles;
  if (category && category !== "all") {
    filtered = filtered.filter((a) => a.category === category);
  }
  if (search) {
    filtered = filtered.filter(
      (a) =>
        a.titleBn.toLowerCase().includes(search) ||
        a.titleEn.toLowerCase().includes(search) ||
        a.excerptBn.toLowerCase().includes(search) ||
        a.excerptEn.toLowerCase().includes(search) ||
        a.categoryNameBn.toLowerCase().includes(search) ||
        a.category.toLowerCase().includes(search)
    );
  }


  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = (page - 1) * pageSize;
  const data = filtered.slice(startIndex, startIndex + pageSize);

  return {
    data,
    totalItems,
    totalPages,
    currentPage: page,
    pageSize,
  };
}


/**
 * Fetch all health tips articles from system_settings.
 * Cached via Next.js ISR tags.
 */
export const getAllHealthTipsAction = unstable_cache(
  async (): Promise<HealthTipArticle[]> => {
    try {
      if (!prisma?.systemSetting) {
        return HEALTH_TIPS_ARTICLES;
      }

      const setting = await prisma.systemSetting.findUnique({
        where: { key: ARTICLES_SETTING_KEY },
      });

      if (!setting?.value) {
        const deletedSlugs = await getDeletedSlugs();
        const initialArticles = deletedSlugs.length > 0
          ? HEALTH_TIPS_ARTICLES.filter((a) => !deletedSlugs.includes(a.slug))
          : HEALTH_TIPS_ARTICLES;

        await prisma.systemSetting
          .upsert({
            where: { key: ARTICLES_SETTING_KEY },
            create: {
              key: ARTICLES_SETTING_KEY,
              value: JSON.stringify(initialArticles),
            },
            update: { value: JSON.stringify(initialArticles) },
          })
          .catch(() => {});
        return initialArticles;
      }

      const dbArticles = JSON.parse(setting.value);
      if (Array.isArray(dbArticles)) {
        return dbArticles;
      }

      return HEALTH_TIPS_ARTICLES;
    } catch (err) {
      logger.error("Error in getAllHealthTipsAction:", err);
      return HEALTH_TIPS_ARTICLES;
    }
  },
  ["all-health-tips-articles-v2"],
  { tags: [HEALTH_TIPS_TAG] }
);

/**
 * Fetch a single article by slug.
 */
export async function getHealthTipBySlugAction(
  slug: string
): Promise<HealthTipArticle | null> {
  const articles = await getAllHealthTipsAction();
  return articles.find((a) => a.slug === slug) || null;
}

/**
 * Create or update a health tip article.
 */
export async function saveHealthTipAction(article: HealthTipArticle) {
  try {
    if (!await verifyAdmin()) return { success: false, error: "অননুমোদিত অ্যাক্সেস।" };
    const articles = await getAllHealthTipsAction();
    const existingIndex = articles.findIndex((a) => a.slug === article.slug);
    let updatedList: HealthTipArticle[];

    if (existingIndex >= 0) {
      updatedList = [...articles];
      updatedList[existingIndex] = article;
    } else {
      updatedList = [article, ...articles];
    }

    await prisma.systemSetting.upsert({
      where: { key: ARTICLES_SETTING_KEY },
      create: {
        key: ARTICLES_SETTING_KEY,
        value: JSON.stringify(updatedList),
      },
      update: { value: JSON.stringify(updatedList) },
    });

    // If re-creating or editing an article that was previously recorded as deleted, unmark it
    await unmarkSlugAsDeleted(article.slug);

    updateTag(HEALTH_TIPS_TAG);
    updateTag("admin-stats");
    revalidatePath("/health-tips");
    revalidatePath(`/health-tips/${article.slug}`);
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

/**
 * Delete a health tip article by slug.
 */
export async function deleteHealthTipAction(slug: string) {
  try {
    if (!await verifyAdmin()) return { success: false, error: "অননুমোদিত অ্যাক্সেস।" };
    const articles = await getAllHealthTipsAction();
    const updatedList = articles.filter((a) => a.slug !== slug);

    await prisma.systemSetting.upsert({
      where: { key: ARTICLES_SETTING_KEY },
      create: {
        key: ARTICLES_SETTING_KEY,
        value: JSON.stringify(updatedList),
      },
      update: { value: JSON.stringify(updatedList) },
    });

    // Permanently record deleted slug so it won't be resurrected
    await markSlugAsDeleted(slug);

    updateTag(HEALTH_TIPS_TAG);
    updateTag("admin-stats");
    revalidatePath("/health-tips");
    revalidatePath(`/health-tips/${slug}`);
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

/**
 * Sync / Reset database articles to include all base health guides.
 * Retains custom articles and skips explicitly deleted base articles unless resetDeleted is true.
 */
export async function syncHealthTipsWithDatabaseAction(options?: { resetDeleted?: boolean }) {
  try {
    if (!await verifyAdmin()) return { success: false, error: "অননুমোদিত অ্যাক্সেস।" };

    let deletedSlugs: string[] = [];
    if (!options?.resetDeleted) {
      deletedSlugs = await getDeletedSlugs();
    } else {
      await prisma.systemSetting.upsert({
        where: { key: DELETED_SLUGS_SETTING_KEY },
        create: { key: DELETED_SLUGS_SETTING_KEY, value: "[]" },
        update: { value: "[]" },
      }).catch(() => {});
    }

    const currentArticles = await getAllHealthTipsAction();
    const dbMap = new Map(currentArticles.map((a) => [a.slug, a]));

    // Include base articles that have not been explicitly deleted
    const updatedArticles: HealthTipArticle[] = [];
    for (const base of HEALTH_TIPS_ARTICLES) {
      if (!deletedSlugs.includes(base.slug)) {
        updatedArticles.push(dbMap.get(base.slug) || base);
      }
    }

    // Retain custom admin articles not in base
    for (const current of currentArticles) {
      if (
        !HEALTH_TIPS_ARTICLES.some((b) => b.slug === current.slug) &&
        !updatedArticles.some((u) => u.slug === current.slug)
      ) {
        updatedArticles.push(current);
      }
    }

    await prisma.systemSetting.upsert({
      where: { key: ARTICLES_SETTING_KEY },
      create: {
        key: ARTICLES_SETTING_KEY,
        value: JSON.stringify(updatedArticles),
      },
      update: { value: JSON.stringify(updatedArticles) },
    });

    updateTag(HEALTH_TIPS_TAG);
    updateTag("admin-stats");
    revalidatePath("/health-tips");
    return { success: true, count: updatedArticles.length };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

export interface ArticleReactionStats {
  helpful: number;
  notHelpful: number;
}

const REACTIONS_SETTING_KEY = "health_tips_reactions";

/**
 * Fetch reader reaction counts for a health tip article.
 */
export async function getArticleReactionsAction(
  slug: string
): Promise<ArticleReactionStats> {
  try {
    if (!prisma?.systemSetting) {
      return { helpful: 0, notHelpful: 0 };
    }

    const setting = await prisma.systemSetting.findUnique({
      where: { key: REACTIONS_SETTING_KEY },
    });

    if (!setting?.value) {
      return { helpful: 0, notHelpful: 0 };
    }

    const reactionsMap: Record<string, ArticleReactionStats> = JSON.parse(
      setting.value
    );
    const stats = reactionsMap[slug];

    return {
      helpful: Math.max(0, stats?.helpful || 0),
      notHelpful: Math.max(0, stats?.notHelpful || 0),
    };
  } catch (err) {
    logger.error("Error fetching article reactions:", err);
    return { helpful: 0, notHelpful: 0 };
  }
}

/**
 * Submit or update a reader feedback reaction for an article.
 */
export async function submitArticleReactionAction(
  slug: string,
  reaction: "helpful" | "not_helpful",
  previousReaction?: "helpful" | "not_helpful" | null
): Promise<{ success: boolean; stats?: ArticleReactionStats; error?: string }> {
  try {
    if (!prisma?.systemSetting) {
      return { success: false, error: "ডাটাবেজ সংযোগ পাওয়া যায়নি।" };
    }

    const updatedStats = await prisma.$transaction(async (tx) => {
      // Ensure row exists so FOR UPDATE row lock can be acquired
      await tx.$executeRaw`
        INSERT INTO "system_settings" ("key", "value", "updated_at")
        VALUES (${REACTIONS_SETTING_KEY}, '{}', NOW())
        ON CONFLICT ("key") DO NOTHING
      `;

      // Acquire exclusive row lock
      const rows = await tx.$queryRaw<Array<{ key: string; value: string }>>`
        SELECT "key", "value" FROM "system_settings" WHERE "key" = ${REACTIONS_SETTING_KEY} FOR UPDATE
      `;

      let reactionsMap: Record<string, ArticleReactionStats> = {};
      if (rows.length > 0 && rows[0].value) {
        try {
          reactionsMap = JSON.parse(rows[0].value);
        } catch {
          reactionsMap = {};
        }
      }

      const currentStats: ArticleReactionStats = reactionsMap[slug] || {
        helpful: 0,
        notHelpful: 0,
      };

      // Revert previous reaction if user is switching
      if (previousReaction === "helpful") {
        currentStats.helpful = Math.max(0, currentStats.helpful - 1);
      } else if (previousReaction === "not_helpful") {
        currentStats.notHelpful = Math.max(0, currentStats.notHelpful - 1);
      }

      // Apply new reaction
      if (reaction === "helpful") {
        currentStats.helpful += 1;
      } else if (reaction === "not_helpful") {
        currentStats.notHelpful += 1;
      }

      reactionsMap[slug] = currentStats;

      await tx.systemSetting.update({
        where: { key: REACTIONS_SETTING_KEY },
        data: {
          value: JSON.stringify(reactionsMap),
        },
      });

      return {
        helpful: currentStats.helpful,
        notHelpful: currentStats.notHelpful,
      };
    });

    return {
      success: true,
      stats: updatedStats,
    };
  } catch (err: unknown) {
    logger.error("Error saving article reaction:", err);
    return { success: false, error: (err as Error).message };
  }
}


