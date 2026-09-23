"use server";

import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { logger } from "@/lib/logger";
import { unstable_cache, updateTag, revalidatePath } from "next/cache";
import { BlogPost } from "@/types/blog";
import { BLOG_POSTS } from "@/data/blog/blogPosts";
import { PaginatedResult } from "@/types/pagination";
import { hasAdminPermission } from "@/lib/permissions";
import { blogPostSchema } from "@/lib/validations/blog";

const BLOG_POSTS_TAG = "blog-posts-data";
const BLOG_SETTING_KEY = "blog_posts";
const DELETED_SLUGS_SETTING_KEY = "blog_deleted_slugs";

async function verifyAdmin(): Promise<boolean> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") return false;
  const role = session.adminRole || "super_admin";
  return hasAdminPermission(role, "manage_blogs");
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
    logger.error("Failed to parse blog deleted slugs:", err);
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
    logger.error(`Failed to mark blog slug as deleted: ${slug}`, err);
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
    logger.error(`Failed to unmark blog slug as deleted: ${slug}`, err);
  }
}

export interface GetPaginatedBlogsAdminParams {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
}

/**
 * Cached reader for all blog posts.
 * Combines database entries with static fallback items while excluding deleted slugs.
 */
const getCachedBlogPosts = unstable_cache(
  async (): Promise<BlogPost[]> => {
    try {
      const deletedSlugs = await getDeletedSlugs();
      const setting = await prisma.systemSetting.findUnique({
        where: { key: BLOG_SETTING_KEY },
      });

      if (!setting?.value) {
        // First run seed: write static articles to database
        const initialArticles =
          deletedSlugs.length > 0
            ? BLOG_POSTS.filter((a) => !deletedSlugs.includes(a.slug))
            : BLOG_POSTS;

        await prisma.systemSetting
          .upsert({
            where: { key: BLOG_SETTING_KEY },
            create: {
              key: BLOG_SETTING_KEY,
              value: JSON.stringify(initialArticles),
            },
            update: { value: JSON.stringify(initialArticles) },
          })
          .catch(() => {});
        return initialArticles;
      }

      const dbArticles = JSON.parse(setting.value);
      if (Array.isArray(dbArticles)) {
        const staticMap = new Map(BLOG_POSTS.map((p) => [p.slug.toLowerCase().trim(), p]));
        const syncedDbArticles = dbArticles.map((a: BlogPost) => {
          const staticMatch = staticMap.get(a.slug.toLowerCase().trim());
          if (staticMatch) {
            return staticMatch;
          }
          return a;
        });

        const existingSlugs = new Set(syncedDbArticles.map((a: BlogPost) => a.slug.toLowerCase().trim()));
        const missingStatic = BLOG_POSTS.filter(
          (p) => !existingSlugs.has(p.slug.toLowerCase().trim()) && !deletedSlugs.includes(p.slug)
        );
        const combined = [...missingStatic, ...syncedDbArticles];
        
        await prisma.systemSetting
          .upsert({
            where: { key: BLOG_SETTING_KEY },
            create: {
              key: BLOG_SETTING_KEY,
              value: JSON.stringify(combined),
            },
            update: { value: JSON.stringify(combined) },
          })
          .catch(() => {});

        if (deletedSlugs.length > 0) {
          return combined.filter((a: BlogPost) => !deletedSlugs.includes(a.slug));
        }
        return combined;
      }

      return BLOG_POSTS;
    } catch (err) {
      logger.error("Error in getAllBlogPostsAction:", err);
      return BLOG_POSTS;
    }
  },
  ["all-blog-posts-admin-v21"],
  { revalidate: 86400, tags: [BLOG_POSTS_TAG] }
);

export async function getAllBlogPostsAction(): Promise<BlogPost[]> {
  return getCachedBlogPosts();
}

/**
 * Fetch a single article by slug.
 */
export async function getBlogPostBySlugAction(
  slug: string
): Promise<BlogPost | null> {
  const raw = decodeURIComponent(slug).toLowerCase().trim();
  const normalized = raw.replace(/^[—–\s-]+|[—–\s-]+$/g, "");
  const articles = await getAllBlogPostsAction();
  const found = articles.find(
    (a) =>
      a.slug.toLowerCase().trim() === normalized ||
      a.slug.toLowerCase().trim() === raw
  );
  if (found) return found;
  return (
    BLOG_POSTS.find(
      (a) =>
        a.slug.toLowerCase().trim() === normalized ||
        a.slug.toLowerCase().trim() === raw
    ) || null
  );
}

/**
 * Admin paginated, searched, and filtered list of blog posts.
 */
export async function getPaginatedBlogPostsAdminAction(
  params: GetPaginatedBlogsAdminParams
): Promise<PaginatedResult<BlogPost>> {
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.max(1, Math.min(100, params.pageSize || 10));
  const search = params.search?.trim().toLowerCase() || "";
  const category = params.category?.trim() || "all";

  const allArticles = await getAllBlogPostsAction();

  let filtered = allArticles;

  if (category !== "all") {
    filtered = filtered.filter((a) => a.category === category);
  }

  if (search) {
    filtered = filtered.filter(
      (a) =>
        a.titleBn.toLowerCase().includes(search) ||
        a.titleEn.toLowerCase().includes(search) ||
        a.excerptBn.toLowerCase().includes(search) ||
        a.excerptEn.toLowerCase().includes(search) ||
        a.slug.toLowerCase().includes(search) ||
        a.tags.some((t) => t.toLowerCase().includes(search))
    );
  }

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const start = (page - 1) * pageSize;
  const paginatedData = filtered.slice(start, start + pageSize);

  return {
    data: paginatedData,
    totalItems,
    totalPages,
    currentPage: page,
    pageSize,
  };
}

/**
 * Create or update a blog post.
 */
export async function saveBlogPostAction(data: unknown) {
  try {
    const isAuthorized = await verifyAdmin();
    if (!isAuthorized) {
      return { success: false, error: "অননুমোদিত অ্যাক্সেস। আপনার ব্লগ সম্পাদনার অনুমতি নেই।" };
    }

    const validationResult = blogPostSchema.safeParse(data);
    if (!validationResult.success) {
      const firstIssue = validationResult.error.issues[0]?.message || "ইনপুট ডাটা সঠিক নয়";
      return { success: false, error: firstIssue };
    }

    const post = validationResult.data as BlogPost;
    const articles = await getAllBlogPostsAction();
    const existingIndex = articles.findIndex(
      (a) => a.slug.toLowerCase().trim() === post.slug.toLowerCase().trim()
    );

    let updatedList: BlogPost[];

    if (existingIndex >= 0) {
      // Preserve any specialized arrays if not re-provided
      const existing = articles[existingIndex];
      const merged: BlogPost = {
        ...existing,
        ...post,
        modifiedDate: new Date().toISOString().split("T")[0],
      };
      updatedList = [...articles];
      updatedList[existingIndex] = merged;
    } else {
      const now = new Date().toISOString().split("T")[0];
      const newPost: BlogPost = {
        ...post,
        publishedDate: post.publishedDate || now,
        modifiedDate: now,
      };
      updatedList = [newPost, ...articles];
    }

    await prisma.systemSetting.upsert({
      where: { key: BLOG_SETTING_KEY },
      create: {
        key: BLOG_SETTING_KEY,
        value: JSON.stringify(updatedList),
      },
      update: { value: JSON.stringify(updatedList) },
    });

    // Unmark deleted slug if it was previously deleted
    await unmarkSlugAsDeleted(post.slug);

    // Bust Next.js cache and revalidate pages
    updateTag(BLOG_POSTS_TAG);
    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);
    revalidatePath("/admin/blogs");
    revalidatePath("/");
    revalidatePath("/sitemap.xml");

    return { success: true };
  } catch (err: unknown) {
    logger.error("Error saving blog post:", err);
    return { success: false, error: "ব্লগ পোস্ট সংরক্ষণ করতে সমস্যা হয়েছে।" };
  }
}

/**
 * Delete a blog post by slug.
 */
export async function deleteBlogPostAction(slug: string) {
  try {
    const isAuthorized = await verifyAdmin();
    if (!isAuthorized) {
      return { success: false, error: "অননুমোদিত অ্যাক্সেস।" };
    }

    const normalizedSlug = decodeURIComponent(slug).toLowerCase().trim();
    const articles = await getAllBlogPostsAction();
    const updatedList = articles.filter(
      (a) => a.slug.toLowerCase().trim() !== normalizedSlug
    );

    await prisma.systemSetting.upsert({
      where: { key: BLOG_SETTING_KEY },
      create: {
        key: BLOG_SETTING_KEY,
        value: JSON.stringify(updatedList),
      },
      update: { value: JSON.stringify(updatedList) },
    });

    // Permanently record deleted slug so static fallback doesn't revive it
    await markSlugAsDeleted(normalizedSlug);

    updateTag(BLOG_POSTS_TAG);
    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);
    revalidatePath("/admin/blogs");
    revalidatePath("/");
    revalidatePath("/sitemap.xml");

    return { success: true };
  } catch (err: unknown) {
    logger.error(`Error deleting blog post ${slug}:`, err);
    return { success: false, error: "ব্লগ পোস্ট মুছে ফেলতে সমস্যা হয়েছে।" };
  }
}
