"use server";

import { prisma, withDbRetry } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { logger } from "@/lib/logger";
import { unstable_cache, updateTag, revalidatePath } from "next/cache";
import { cache } from "react";
import { BlogPost, BlogPostCardItem } from "@/types/blog";
import { BLOG_POSTS } from "@/data/blog/blogPosts";
import { PaginatedResult } from "@/types/pagination";
import { hasAdminPermission } from "@/lib/permissions";
import { blogPostSchema } from "@/lib/validations/blog";
import { getPostFacilityMeta } from "@/app/blog/utils/blogPagination";

const BLOG_POSTS_TAG = "blog-posts-data";
const BLOG_CARDS_TAG = "blog-cards-data";

async function verifyAdmin(): Promise<boolean> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") return false;
  const role = session.adminRole || "super_admin";
  return hasAdminPermission(role, "manage_blogs");
}

import {
  mapStaticPostsToCards,
  mapDbRowToBlogPost,
} from "./blogAdminMappers";
import {
  notifyBlogUpdatedToIndexNow,
  submitUrlsToIndexNow,
  notifyBatchUrlsToIndexNow,
} from "@/lib/seo/indexNowHelper";
import { SITE_URL } from "@/lib/siteConfig";

/**
 * Lightweight Card Querying for `/blog` Listing & Home Page.
 * Loads ONLY essential card projection columns via Prisma select.
 */
export const getAllBlogPostCardsAction = unstable_cache(
  async (): Promise<BlogPostCardItem[]> => {
    try {
      const posts = await withDbRetry(() =>
        prisma.blogPost.findMany({
          select: {
            slug: true,
            titleBn: true,
            titleEn: true,
            excerptBn: true,
            excerptEn: true,
            category: true,
            categoryNameBn: true,
            categoryNameEn: true,
            readTimeBn: true,
            readTimeEn: true,
            publishedDate: true,
            coverImage: true,
            coverImageAlt: true,
            author: true,
            hospitalCount: true,
            facilityCount: true,
            facilityLabelBn: true,
            facilityLabelEn: true,
            tags: true,
            metaKeywords: true,
          },
          orderBy: { publishedDate: "desc" },
        })
      );

      if (posts && posts.length > 0) {
        return posts.map((p) => ({
          slug: p.slug,
          titleBn: p.titleBn,
          titleEn: p.titleEn,
          excerptBn: p.excerptBn,
          excerptEn: p.excerptEn,
          category: p.category,
          categoryNameBn: p.categoryNameBn,
          categoryNameEn: p.categoryNameEn,
          readTimeBn: p.readTimeBn,
          readTimeEn: p.readTimeEn,
          publishedDate: p.publishedDate,
          coverImage: p.coverImage,
          coverImageAlt: p.coverImageAlt,
          author: p.author as unknown as BlogPostCardItem["author"],
          hospitalCount: p.hospitalCount,
          facilityCount: p.facilityCount,
          facilityLabelBn: p.facilityLabelBn || undefined,
          facilityLabelEn: p.facilityLabelEn || undefined,
          tags: (p.tags as unknown as string[]) || undefined,
          metaKeywords: (p.metaKeywords as unknown as string[]) || undefined,
        }));
      }

      return mapStaticPostsToCards();
    } catch (err) {
      logger.error("Error in getAllBlogPostCardsAction:", err);
      return mapStaticPostsToCards();
    }
  },
  ["all-blog-post-cards-v3"],
  { revalidate: false, tags: [BLOG_POSTS_TAG, BLOG_CARDS_TAG] }
);

/**
 * Fetch all slugs for SSG generateStaticParams.
 */
export const getAllBlogSlugsAction = unstable_cache(
  async (): Promise<string[]> => {
    try {
      const posts = await withDbRetry(() =>
        prisma.blogPost.findMany({
          select: { slug: true },
          orderBy: { publishedDate: "desc" },
        })
      );
      if (posts && posts.length > 0) {
        return posts.map((p) => p.slug);
      }
      return BLOG_POSTS.map((p) => p.slug);
    } catch (err) {
      logger.error("Error in getAllBlogSlugsAction:", err);
      return BLOG_POSTS.map((p) => p.slug);
    }
  },
  ["all-blog-slugs-v2"],
  { revalidate: false, tags: [BLOG_POSTS_TAG] }
);

const fetchDbBlogPostBySlug = unstable_cache(
  async (normalizedSlug: string): Promise<BlogPost | null> => {
    try {
      const dbPost = await withDbRetry(() =>
        prisma.blogPost.findUnique({
          where: { slug: normalizedSlug },
        })
      );

      if (dbPost) {
        return mapDbRowToBlogPost(dbPost);
      }
    } catch (err) {
      logger.error(`Error fetching blog post by slug from DB: ${normalizedSlug}`, err);
    }

    return null;
  },
  ["single-blog-post-by-slug-v1"],
  { revalidate: false, tags: [BLOG_POSTS_TAG] }
);

/**
 * Fetch full blog post by slug from database (with static fallback).
 * Memoized with React cache to eliminate duplicate queries between
 * generateMetadata and the page component during the same render pass.
 */
export const getBlogPostBySlugAction = cache(
  async (slug: string): Promise<BlogPost | null> => {
    const raw = decodeURIComponent(slug).toLowerCase().trim();
    const normalized = raw.replace(/^[—–\s-]+|[—–\s-]+$/g, "");

    const dbPost = await fetchDbBlogPostBySlug(normalized);
    if (dbPost) {
      return dbPost;
    }

    if (raw !== normalized) {
      const rawDbPost = await fetchDbBlogPostBySlug(raw);
      if (rawDbPost) {
        return rawDbPost;
      }
    }

    return (
      BLOG_POSTS.find(
        (a) =>
          a.slug.toLowerCase().trim() === normalized ||
          a.slug.toLowerCase().trim() === raw
      ) || null
    );
  }
);

/**
 * Cached reader for all full blog posts.
 */
export const getAllBlogPostsAction = unstable_cache(
  async (): Promise<BlogPost[]> => {
    try {
      const dbPosts = await prisma.blogPost.findMany({
        orderBy: { publishedDate: "desc" },
      });
      if (dbPosts && dbPosts.length > 0) {
        return dbPosts.map(mapDbRowToBlogPost);
      }
      return BLOG_POSTS;
    } catch (err) {
      logger.error("Error in getAllBlogPostsAction:", err);
      return BLOG_POSTS;
    }
  },
  ["all-blog-posts-v24"],
  { revalidate: false, tags: [BLOG_POSTS_TAG] }
);

export interface GetPaginatedBlogsAdminParams {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
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
        a.tags?.some((t) => t.toLowerCase().includes(search))
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
 * Create or update a blog post directly in PostgreSQL database.
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

    const facilityMeta = getPostFacilityMeta(post);
    const hospitalCount = post.hospitals?.length ?? 0;
    const facilityCount = facilityMeta.count;
    const facilityLabelBn = facilityMeta.labelBn;
    const facilityLabelEn = facilityMeta.labelEn;

    const rowData = {
      slug: slugKey,
      titleBn: post.titleBn,
      titleEn: post.titleEn,
      excerptBn: post.excerptBn,
      excerptEn: post.excerptEn,
      category: post.category,
      categoryNameBn: post.categoryNameBn || "",
      categoryNameEn: post.categoryNameEn || "",
      publishedDate: post.publishedDate || new Date().toISOString().split("T")[0],
      modifiedDate: new Date().toISOString().split("T")[0],
      readTimeBn: post.readTimeBn,
      readTimeEn: post.readTimeEn,
      coverImage: post.coverImage,
      coverImageAlt: post.coverImageAlt || post.titleBn,
      author: JSON.parse(JSON.stringify(post.author)),
      hospitalCount,
      facilityCount,
      facilityLabelBn,
      facilityLabelEn,
      keyHighlightsBn: post.keyHighlightsBn ? JSON.parse(JSON.stringify(post.keyHighlightsBn)) : null,
      introParagraphsBn: post.introParagraphsBn ? JSON.parse(JSON.stringify(post.introParagraphsBn)) : null,
      diagnosticComparisonTable: post.diagnosticComparisonTable
        ? JSON.parse(JSON.stringify(post.diagnosticComparisonTable))
        : null,
      diagnosticCenters: post.diagnosticCenters ? JSON.parse(JSON.stringify(post.diagnosticCenters)) : null,
      diagnosticTestPricingBn: post.diagnosticTestPricingBn
        ? JSON.parse(JSON.stringify(post.diagnosticTestPricingBn))
        : null,
      bookingGuideBn: post.bookingGuideBn ? JSON.parse(JSON.stringify(post.bookingGuideBn)) : null,
      selectionGuideBn: post.selectionGuideBn ? JSON.parse(JSON.stringify(post.selectionGuideBn)) : null,
      faqs: post.faqs ? JSON.parse(JSON.stringify(post.faqs)) : null,
      relatedSlugs: post.relatedSlugs ? JSON.parse(JSON.stringify(post.relatedSlugs)) : null,
      metaKeywords: post.metaKeywords ? JSON.parse(JSON.stringify(post.metaKeywords)) : null,
      tags: post.tags ? JSON.parse(JSON.stringify(post.tags)) : null,
      contentPayload: JSON.parse(JSON.stringify(post)),
    };

    await prisma.blogPost.upsert({
      where: { slug: slugKey },
      update: rowData,
      create: rowData,
    });

    updateTag(BLOG_POSTS_TAG);
    updateTag(BLOG_CARDS_TAG);
    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);
    revalidatePath("/admin/blogs");
    revalidatePath("/");
    revalidatePath("/sitemap.xml");

    // Immediately ping search engines (Bing, Yandex, IndexNow network)
    notifyBlogUpdatedToIndexNow(post.slug).catch((indexNowErr) => {
      logger.error(`IndexNow ping failed for blog ${post.slug}:`, indexNowErr);
    });

    return { success: true };
  } catch (err: unknown) {
    logger.error("Error saving blog post:", err);
    return { success: false, error: "ব্লগ পোস্ট সংরক্ষণ করতে সমস্যা হয়েছে।" };
  }
}

/**
 * Delete a blog post by slug from database.
 */
export async function deleteBlogPostAction(slug: string) {
  try {
    const isAuthorized = await verifyAdmin();
    if (!isAuthorized) {
      return { success: false, error: "অননুমোদিত অ্যাক্সেস।" };
    }

    const normalizedSlug = decodeURIComponent(slug).toLowerCase().trim();

    try {
      await prisma.blogPost.delete({
        where: { slug: normalizedSlug },
      });
    } catch (dbErr) {
      logger.warn(`Could not delete from DB table blog_posts: ${normalizedSlug}`, dbErr);
    }

    updateTag(BLOG_POSTS_TAG);
    updateTag(BLOG_CARDS_TAG);
    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);
    revalidatePath("/admin/blogs");
    revalidatePath("/");
    revalidatePath("/sitemap.xml");

    // Immediately notify search engines of removal and directory updates
    submitUrlsToIndexNow([
      `${SITE_URL}/blog/${normalizedSlug}`,
      `${SITE_URL}/blog`,
      `${SITE_URL}/sitemap.xml`,
    ]).catch((indexNowErr) => {
      logger.error(`IndexNow ping failed on blog delete for ${normalizedSlug}:`, indexNowErr);
    });

    return { success: true };
  } catch (err: unknown) {
    logger.error(`Error deleting blog post ${slug}:`, err);
    return { success: false, error: "ব্লগ পোস্ট মুছে ফেলতে সমস্যা হয়েছে।" };
  }
}

/**
 * Manually trigger IndexNow search engine ping for an individual blog post or all blogs.
 */
export async function pingIndexNowForBlogAction(slug?: string) {
  try {
    const isAuthorized = await verifyAdmin();
    if (!isAuthorized) {
      return { success: false, error: "অননুমোদিত অ্যাক্সেস।" };
    }

    if (slug) {
      const result = await notifyBlogUpdatedToIndexNow(slug);
      return {
        success: result.success,
        submittedCount: result.submittedCount,
        results: result.results,
        error: result.error,
      };
    }

    // Ping all published articles
    const posts = await getAllBlogPostCardsAction();
    const urls = [
      `${SITE_URL}/`,
      `${SITE_URL}/blog`,
      `${SITE_URL}/sitemap.xml`,
      ...posts.map((p) => `${SITE_URL}/blog/${encodeURIComponent(p.slug)}`),
    ];

    const result = await notifyBatchUrlsToIndexNow(urls);
    return {
      success: result.success,
      submittedCount: result.submittedCount,
      results: result.results,
      error: result.error,
    };
  } catch (err: unknown) {
    logger.error("Error running IndexNow ping action:", err);
    return { success: false, error: "IndexNow সিঙ্ক ব্যর্থ হয়েছে।" };
  }
}
