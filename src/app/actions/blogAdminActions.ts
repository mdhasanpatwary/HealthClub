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

/**
 * DB keys — intentionally lightweight:
 *   blog_admin_posts   : only admin-created posts (not in static BLOG_POSTS) as JSON array
 *   blog_deleted_slugs : slugs of static posts the admin has deleted, as JSON string[]
 *
 * The full 106-post static corpus is NEVER written to the database; it lives
 * exclusively as a TypeScript import, eliminating ~200 MB/day of Supabase egress.
 */
const ADMIN_POSTS_SETTING_KEY = "blog_admin_posts";
const DELETED_SLUGS_SETTING_KEY = "blog_deleted_slugs";

/** Set of slugs that exist in the static TypeScript corpus. */
const STATIC_SLUG_SET = new Set(BLOG_POSTS.map((p) => p.slug.toLowerCase().trim()));

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

/** Fetch only admin-created posts (those NOT in the static corpus). */
async function getAdminCreatedPosts(): Promise<BlogPost[]> {
  try {
    const setting = await prisma.systemSetting.findUnique({
      where: { key: ADMIN_POSTS_SETTING_KEY },
    });
    if (!setting?.value) return [];
    const parsed = JSON.parse(setting.value);
    return Array.isArray(parsed) ? (parsed as BlogPost[]) : [];
  } catch (err) {
    logger.error("Failed to parse blog_admin_posts:", err);
    return [];
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
 *
 * Reads only two tiny DB rows (admin_posts + deleted_slugs), then merges
 * with the static BLOG_POSTS array — zero full-corpus DB reads.
 */
const getCachedBlogPosts = unstable_cache(
  async (): Promise<BlogPost[]> => {
    try {
      const [deletedSlugs, adminPosts] = await Promise.all([
        getDeletedSlugs(),
        getAdminCreatedPosts(),
      ]);

      // Static posts minus any admin-deleted slugs
      const staticPosts =
        deletedSlugs.length > 0
          ? BLOG_POSTS.filter((p) => !deletedSlugs.includes(p.slug))
          : BLOG_POSTS;

      // Admin-created posts are prepended so they appear first
      // (their slugs are guaranteed NOT in STATIC_SLUG_SET)
      return [...adminPosts, ...staticPosts];
    } catch (err) {
      logger.error("Error in getCachedBlogPosts:", err);
      return BLOG_POSTS;
    }
  },
  ["all-blog-posts-admin-v22"],
  { revalidate: 86400, tags: [BLOG_POSTS_TAG] }
);

export async function getAllBlogPostsAction(): Promise<BlogPost[]> {
  return getCachedBlogPosts();
}

/**
 * Fetch a single article by slug.
 * Checks admin posts first (DB-free fast path for static slugs via unstable_cache).
 */
export async function getBlogPostBySlugAction(
  slug: string
): Promise<BlogPost | null> {
  const raw = decodeURIComponent(slug).toLowerCase().trim();
  const normalized = raw.replace(/^[—–\s-]+|[—–\s-]+$/g, "");

  // Fast path: static corpus lookup (no DB)
  const staticMatch =
    BLOG_POSTS.find(
      (a) =>
        a.slug.toLowerCase().trim() === normalized ||
        a.slug.toLowerCase().trim() === raw
    ) || null;

  if (staticMatch) {
    // Still respect admin-deleted slugs
    const deletedSlugs = await getDeletedSlugs();
    if (deletedSlugs.includes(staticMatch.slug)) return null;
    return staticMatch;
  }

  // Fallback: admin-created posts
  const articles = await getAllBlogPostsAction();
  return (
    articles.find(
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
 *
 * Static posts (those already in BLOG_POSTS) are served from the TypeScript
 * import and are never persisted to DB. Only admin-created posts (new slugs
 * absent from the static corpus) are stored in the `blog_admin_posts` row.
 */
export async function saveBlogPostAction(data: unknown) {
  try {
    const isAuthorized = await verifyAdmin();
    if (!isAuthorized) {
      return { success: false, error: "অননুমোদিত অ্যাক্সেস। আপনার ব্লগ সম্পাদনার অনুমতি নেই।" };
    }

    const validationResult = blogPostSchema.safeParse(data);
    if (!validationResult.success) {
      const firstIssue = validationResult.error.issues[0]?.message || "ইনপুট ডাটা সঠিক নয়";
      return { success: false, error: firstIssue };
    }

    const post = validationResult.data as BlogPost;
    const slugKey = post.slug.toLowerCase().trim();
    const isStaticPost = STATIC_SLUG_SET.has(slugKey);

    if (!isStaticPost) {
      // Persist only non-static (admin-created) posts to DB
      const adminPosts = await getAdminCreatedPosts();
      const existingIndex = adminPosts.findIndex(
        (a) => a.slug.toLowerCase().trim() === slugKey
      );

      let updatedAdminPosts: BlogPost[];

      if (existingIndex >= 0) {
        const existing = adminPosts[existingIndex];
        const merged: BlogPost = {
          ...existing,
          ...post,
          modifiedDate: new Date().toISOString().split("T")[0],
        };
        updatedAdminPosts = [...adminPosts];
        updatedAdminPosts[existingIndex] = merged;
      } else {
        const now = new Date().toISOString().split("T")[0];
        const newPost: BlogPost = {
          ...post,
          publishedDate: post.publishedDate || now,
          modifiedDate: now,
        };
        updatedAdminPosts = [newPost, ...adminPosts];
      }

      await prisma.systemSetting.upsert({
        where: { key: ADMIN_POSTS_SETTING_KEY },
        create: {
          key: ADMIN_POSTS_SETTING_KEY,
          value: JSON.stringify(updatedAdminPosts),
        },
        update: { value: JSON.stringify(updatedAdminPosts) },
      });
    }

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
    return { success: false, error: "ব্লগ পোস্ট সংরক্ষণ করতে সমস্যা হয়েছে।" };
  }
}

/**
 * Delete a blog post by slug.
 *
 * For static posts: adds slug to `blog_deleted_slugs` (a tiny string array).
 * For admin-created posts: removes from `blog_admin_posts` and adds to deleted list.
 */
export async function deleteBlogPostAction(slug: string) {
  try {
    const isAuthorized = await verifyAdmin();
    if (!isAuthorized) {
      return { success: false, error: "অননুমোদিত অ্যাক্সেস।" };
    }

    const normalizedSlug = decodeURIComponent(slug).toLowerCase().trim();
    const isStaticPost = STATIC_SLUG_SET.has(normalizedSlug);

    if (!isStaticPost) {
      // Remove from admin-created posts list
      const adminPosts = await getAdminCreatedPosts();
      const updatedAdminPosts = adminPosts.filter(
        (a) => a.slug.toLowerCase().trim() !== normalizedSlug
      );
      await prisma.systemSetting.upsert({
        where: { key: ADMIN_POSTS_SETTING_KEY },
        create: {
          key: ADMIN_POSTS_SETTING_KEY,
          value: JSON.stringify(updatedAdminPosts),
        },
        update: { value: JSON.stringify(updatedAdminPosts) },
      });
    }

    // Always record deleted slug to prevent static fallback from reviving it
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
    return { success: false, error: "ব্লগ পোস্ট মুছে ফেলতে সমস্যা হয়েছে।" };
  }
}
