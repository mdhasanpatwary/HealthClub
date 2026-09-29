"use server";

import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { logger } from "@/lib/logger";
import { unstable_cache, updateTag, revalidatePath } from "next/cache";
import { BlogPost, BlogPostCardItem, BlogAuthor, BlogFAQItem } from "@/types/blog";
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

function mapStaticPostsToCards(): BlogPostCardItem[] {
  return BLOG_POSTS.map((post) => {
    const facilityMeta = getPostFacilityMeta(post);
    return {
      slug: post.slug,
      titleBn: post.titleBn,
      titleEn: post.titleEn,
      excerptBn: post.excerptBn,
      excerptEn: post.excerptEn,
      category: post.category,
      categoryNameBn: post.categoryNameBn || "",
      categoryNameEn: post.categoryNameEn || "",
      readTimeBn: post.readTimeBn,
      readTimeEn: post.readTimeEn,
      publishedDate: post.publishedDate,
      coverImage: post.coverImage,
      coverImageAlt: post.coverImageAlt || post.titleBn,
      author: {
        nameBn: post.author?.nameBn || "হেলথ ক্লাব টিম",
        nameEn: post.author?.nameEn || "Health Club Team",
      },
      hospitalCount: post.hospitals?.length ?? 0,
      facilityCount: facilityMeta.count,
      facilityLabelBn: facilityMeta.labelBn,
      facilityLabelEn: facilityMeta.labelEn,
      tags: post.tags,
      metaKeywords: post.metaKeywords,
    };
  });
}

function normalizeDiagnosticPricing(pricing: unknown): BlogPost["diagnosticTestPricingBn"] {
  if (!pricing || typeof pricing !== "object") return undefined;
  const p = pricing as Record<string, unknown>;
  const rawTests = (p.tests || p.items || []) as unknown[];
  return {
    titleBn: (p.titleBn as string) || "",
    subtitleBn: (p.subtitleBn as string) || "",
    tests: Array.isArray(rawTests)
      ? rawTests.map((t) => {
          const item = (t || {}) as Record<string, unknown>;
          return {
            testNameBn: (item.testNameBn || item.nameBn || item.name || "") as string,
            testNameEn: (item.testNameEn || item.nameEn || "") as string,
            categoryBn: (item.categoryBn || item.category || "") as string,
            regularPriceRangeBn: (item.regularPriceRangeBn || item.regularPriceRange || "") as string,
            memberPriceRangeBn: (item.memberPriceRangeBn || item.memberPriceRange || "") as string,
            discountPercentageBn: (item.discountPercentageBn || item.benefitBn || "১০-৩০% বিশেষ ছাড়") as string,
            turnaroundTimeBn: (item.turnaroundTimeBn || item.reportDeliveryBn || item.turnaroundTime || "") as string,
          };
        })
      : [],
  };
}

function normalizeSelectionGuide(guide: unknown): BlogPost["selectionGuideBn"] {
  if (!guide || typeof guide !== "object") return undefined;
  const g = guide as Record<string, unknown>;
  const rawPoints = (g.pointsBn || g.criteria || g.points || []) as unknown[];
  return {
    titleBn: (g.titleBn || g.title || "") as string,
    pointsBn: Array.isArray(rawPoints)
      ? rawPoints.map((p) => {
          const pt = (p || {}) as Record<string, unknown>;
          return {
            title: (pt.title || pt.titleBn || "") as string,
            desc: (pt.desc || pt.descBn || pt.description || "") as string,
          };
        })
      : [],
  };
}

function normalizeBookingGuide(guide: unknown): BlogPost["bookingGuideBn"] {
  if (!guide || typeof guide !== "object") return undefined;
  const g = guide as Record<string, unknown>;
  const rawSteps = (g.stepsBn || g.steps || []) as unknown[];
  return {
    titleBn: (g.titleBn || g.title || "") as string,
    stepsBn: Array.isArray(rawSteps)
      ? rawSteps.map((s) => {
          const st = (s || {}) as Record<string, unknown>;
          return {
            step: (st.step || (st.stepNumber ? `ধাপ ${st.stepNumber}` : "")) as string,
            title: (st.title || st.titleBn || "") as string,
            desc: (st.desc || st.descBn || st.description || "") as string,
          };
        })
      : [],
  };
}

function mapDbRowToBlogPost(dbPost: {
  slug: string;
  titleBn: string;
  titleEn: string;
  excerptBn: string;
  excerptEn: string;
  category: string;
  categoryNameBn: string;
  categoryNameEn: string;
  publishedDate: string;
  modifiedDate: string;
  readTimeBn: string;
  readTimeEn: string;
  coverImage: string;
  coverImageAlt: string;
  author: unknown;
  tags?: unknown;
  metaKeywords?: unknown;
  keyHighlightsBn?: unknown;
  introParagraphsBn?: unknown;
  diagnosticComparisonTable?: unknown;
  diagnosticCenters?: unknown;
  diagnosticTestPricingBn?: unknown;
  bookingGuideBn?: unknown;
  selectionGuideBn?: unknown;
  faqs?: unknown;
  relatedSlugs?: unknown;
  contentPayload?: unknown;
}): BlogPost {
  const payload = (dbPost.contentPayload as unknown as Partial<BlogPost>) || {};
  return {
    ...payload,
    slug: dbPost.slug,
    titleBn: dbPost.titleBn,
    titleEn: dbPost.titleEn,
    excerptBn: dbPost.excerptBn,
    excerptEn: dbPost.excerptEn,
    category: dbPost.category,
    categoryNameBn: dbPost.categoryNameBn,
    categoryNameEn: dbPost.categoryNameEn,
    publishedDate: dbPost.publishedDate,
    modifiedDate: dbPost.modifiedDate,
    readTimeBn: dbPost.readTimeBn,
    readTimeEn: dbPost.readTimeEn,
    coverImage: dbPost.coverImage,
    coverImageAlt: dbPost.coverImageAlt,
    author: dbPost.author as unknown as BlogAuthor,
    tags: (dbPost.tags as unknown as string[]) || payload.tags || [],
    metaKeywords: (dbPost.metaKeywords as unknown as string[]) || payload.metaKeywords || [],
    keyHighlightsBn: (dbPost.keyHighlightsBn as unknown as string[]) || payload.keyHighlightsBn,
    introParagraphsBn: (dbPost.introParagraphsBn as unknown as string[]) || payload.introParagraphsBn || [],
    diagnosticComparisonTable: (dbPost.diagnosticComparisonTable as unknown as BlogPost["diagnosticComparisonTable"]) || payload.diagnosticComparisonTable,
    diagnosticCenters: (dbPost.diagnosticCenters as unknown as BlogPost["diagnosticCenters"]) || payload.diagnosticCenters,
    diagnosticTestPricingBn: normalizeDiagnosticPricing(dbPost.diagnosticTestPricingBn || payload.diagnosticTestPricingBn),
    bookingGuideBn: normalizeBookingGuide(dbPost.bookingGuideBn || payload.bookingGuideBn),
    selectionGuideBn: normalizeSelectionGuide(dbPost.selectionGuideBn || payload.selectionGuideBn),
    faqs: (dbPost.faqs as unknown as BlogFAQItem[]) || payload.faqs || [],
    relatedSlugs: (dbPost.relatedSlugs as unknown as string[]) || payload.relatedSlugs,
  };
}

/**
 * Lightweight Card Querying for `/blog` Listing & Home Page.
 * Loads ONLY essential card projection columns via Prisma select.
 */
export const getAllBlogPostCardsAction = unstable_cache(
  async (): Promise<BlogPostCardItem[]> => {
    try {
      const posts = await prisma.blogPost.findMany({
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
      });

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
  ["all-blog-post-cards-v2"],
  { revalidate: 86400, tags: [BLOG_POSTS_TAG, BLOG_CARDS_TAG] }
);

/**
 * Fetch all slugs for SSG generateStaticParams.
 */
export const getAllBlogSlugsAction = unstable_cache(
  async (): Promise<string[]> => {
    try {
      const posts = await prisma.blogPost.findMany({
        select: { slug: true },
        orderBy: { publishedDate: "desc" },
      });
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
  { revalidate: 86400, tags: [BLOG_POSTS_TAG] }
);

/**
 * Fetch full blog post by slug from database (with static fallback).
 */
export async function getBlogPostBySlugAction(
  slug: string
): Promise<BlogPost | null> {
  const raw = decodeURIComponent(slug).toLowerCase().trim();
  const normalized = raw.replace(/^[—–\s-]+|[—–\s-]+$/g, "");

  try {
    const dbPost = await prisma.blogPost.findUnique({
      where: { slug: normalized },
    });

    if (dbPost) {
      return mapDbRowToBlogPost(dbPost);
    }
  } catch (err) {
    logger.error(`Error fetching blog post by slug from DB: ${slug}`, err);
  }

  return (
    BLOG_POSTS.find(
      (a) =>
        a.slug.toLowerCase().trim() === normalized ||
        a.slug.toLowerCase().trim() === raw
    ) || null
  );
}

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
  { revalidate: 86400, tags: [BLOG_POSTS_TAG] }
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

    return { success: true };
  } catch (err: unknown) {
    logger.error(`Error deleting blog post ${slug}:`, err);
    return { success: false, error: "ব্লগ পোস্ট মুছে ফেলতে সমস্যা হয়েছে।" };
  }
}
