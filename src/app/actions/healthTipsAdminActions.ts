"use server";

import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { unstable_cache, updateTag } from "next/cache";
import { HealthTipArticle, HEALTH_TIPS_ARTICLES } from "@/data/healthTipsData";

const HEALTH_TIPS_TAG = "health-tips-data";

async function verifyAdmin() {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") {
    throw new Error("Unauthorized: Admin access required");
  }
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
      console.error("Error in getAllHealthTipsAction:", err);
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
    await verifyAdmin();
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
    await verifyAdmin();
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
    return { success: true, count: articles.length };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}
