"use server";

import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { logger } from "@/lib/logger";
import { unstable_cache, updateTag } from "next/cache";
import { HealthTipArticle, HEALTH_TIPS_ARTICLES } from "@/data/healthTipsData";
import { PaginatedResult } from "@/types/pagination";
import { hasAdminPermission } from "@/lib/permissions";

const HEALTH_TIPS_TAG = "health-tips-data";

async function verifyAdmin(): Promise<boolean> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") return false;
  const role = session.adminRole || "super_admin";
  return hasAdminPermission(role, "manage_health_tips");
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
 * Fetch all health tips articles (database + base articles merged).
 * Cached via Next.js ISR tags.
 */
export const getAllHealthTipsAction = unstable_cache(
  async (): Promise<HealthTipArticle[]> => {
    try {
      if (!prisma?.systemSetting) {
        return HEALTH_TIPS_ARTICLES;
      }

      const setting = await prisma.systemSetting.findUnique({
        where: { key: "health_tips_articles" },
      });

      if (!setting?.value) {
        await prisma.systemSetting
          .upsert({
            where: { key: "health_tips_articles" },
            create: {
              key: "health_tips_articles",
              value: JSON.stringify(HEALTH_TIPS_ARTICLES),
            },
            update: { value: JSON.stringify(HEALTH_TIPS_ARTICLES) },
          })
          .catch(() => {});
        return HEALTH_TIPS_ARTICLES;
      }

      const dbArticles = JSON.parse(setting.value);
      if (!Array.isArray(dbArticles) || dbArticles.length === 0) {
        return HEALTH_TIPS_ARTICLES;
      }

      // Merge: prioritize DB edits for existing slugs, include new base articles, and retain custom admin articles
      const dbMap = new Map(dbArticles.map((a: HealthTipArticle) => [a.slug, a]));
      const merged: HealthTipArticle[] = HEALTH_TIPS_ARTICLES.map((base) => {
        return dbMap.get(base.slug) || base;
      });

      for (const dbArt of dbArticles) {
        if (!HEALTH_TIPS_ARTICLES.some((b) => b.slug === dbArt.slug)) {
          merged.push(dbArt);
        }
      }

      // Keep DB synchronized if new articles were added
      if (merged.length !== dbArticles.length) {
        await prisma.systemSetting
          .update({
            where: { key: "health_tips_articles" },
            data: { value: JSON.stringify(merged) },
          })
          .catch(() => {});
      }

      return merged;
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
      where: { key: "health_tips_articles" },
      create: {
        key: "health_tips_articles",
        value: JSON.stringify(updatedList),
      },
      update: { value: JSON.stringify(updatedList) },
    });

    updateTag(HEALTH_TIPS_TAG);
    updateTag("admin-stats");
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
      where: { key: "health_tips_articles" },
      create: {
        key: "health_tips_articles",
        value: JSON.stringify(updatedList),
      },
      update: { value: JSON.stringify(updatedList) },
    });

    updateTag(HEALTH_TIPS_TAG);
    updateTag("admin-stats");
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

/**
 * Sync / Reset database articles to include all 25 current health guides.
 */
export async function syncHealthTipsWithDatabaseAction() {
  try {
    const articles = await getAllHealthTipsAction();
    await prisma.systemSetting.upsert({
      where: { key: "health_tips_articles" },
      create: {
        key: "health_tips_articles",
        value: JSON.stringify(articles),
      },
      update: { value: JSON.stringify(articles) },
    });
    updateTag(HEALTH_TIPS_TAG);
    updateTag("admin-stats");
    return { success: true, count: articles.length };
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


