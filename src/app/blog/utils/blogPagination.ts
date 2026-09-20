import { BlogPost } from "@/types/blog";
import { BLOG_FILTER_PILLS, BlogFilterPill } from "@/data/blog/blogCategories";

export interface PaginateBlogPostsOptions {
  page?: number;
  pageSize?: number;
  category?: string;
  search?: string;
  filterPills?: BlogFilterPill[];
}

export interface PaginatedBlogPostsResult {
  posts: BlogPost[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export const DEFAULT_BLOG_PAGE_SIZE = 9;

/**
 * Filter and paginate blog posts deterministically for server-side rendering.
 */
export function paginateBlogPosts(
  allPosts: BlogPost[],
  options: PaginateBlogPostsOptions = {}
): PaginatedBlogPostsResult {
  const pageSize = Math.max(1, options.pageSize || DEFAULT_BLOG_PAGE_SIZE);
  const rawPage = Math.max(1, options.page || 1);
  const selectedCategory = options.category?.trim() || "all";
  const query = options.search?.trim().toLowerCase() || "";
  const filterPills = options.filterPills || BLOG_FILTER_PILLS;

  // 1. Filter articles
  const filtered = allPosts.filter((post) => {
    // Category match
    if (selectedCategory !== "all") {
      const activePill = filterPills.find((p) => p.id === selectedCategory);
      if (activePill?.matchingCategories && activePill.matchingCategories.length > 0) {
        if (!activePill.matchingCategories.includes(post.category)) {
          return false;
        }
      } else if (post.category !== selectedCategory) {
        return false;
      }
    }

    // Search query match
    if (query) {
      const titleMatch =
        post.titleBn.toLowerCase().includes(query) ||
        post.titleEn.toLowerCase().includes(query);

      const excerptMatch =
        post.excerptBn.toLowerCase().includes(query) ||
        post.excerptEn.toLowerCase().includes(query);

      const slugMatch = post.slug.toLowerCase().includes(query);

      const tagMatch = post.tags?.some((t) => t.toLowerCase().includes(query));

      const keywordMatch = post.metaKeywords?.some((k) =>
        k.toLowerCase().includes(query)
      );

      if (!titleMatch && !excerptMatch && !slugMatch && !tagMatch && !keywordMatch) {
        return false;
      }
    }

    return true;
  });

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(rawPage, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const posts = filtered.slice(startIndex, endIndex);

  return {
    posts,
    totalItems,
    totalPages,
    currentPage,
    pageSize,
  };
}
