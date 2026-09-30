import { BlogPost } from "@/types/blog";
import { Doctor } from "@/services/db";
import { parseArticleDate, getArticleIsoDate } from "@/lib/dateUtils";

/**
 * Computes programmatic freshness dateModified for a blog post.
 * Synchronizes with:
 * 1. Base post.modifiedDate and post.publishedDate
 * 2. Physician review date (post.reviewedBy.reviewDateBn)
 * 3. Live doctor department roster updates (createdAt / updatedAt)
 * 4. Partner diagnostic fee updates
 *
 * Emits ISO 8601 date (YYYY-MM-DD) signaling ongoing algorithmic freshness to search engines and AI models.
 */
export function computeBlogDateModified(
  post: BlogPost,
  liveDoctors?: Doctor[],
  latestRosterUpdateDate?: string | Date
): string {
  let latestDate = parseArticleDate(post.modifiedDate || post.publishedDate);

  // 1. Consider physician clinical review date
  if (post.reviewedBy?.reviewDateBn) {
    const reviewerDate = parseArticleDate(post.reviewedBy.reviewDateBn);
    if (!isNaN(reviewerDate.getTime()) && reviewerDate.getTime() > latestDate.getTime()) {
      latestDate = reviewerDate;
    }
  }

  // 2. Consider explicit roster update date
  if (latestRosterUpdateDate) {
    const rosterDate = latestRosterUpdateDate instanceof Date
      ? latestRosterUpdateDate
      : parseArticleDate(latestRosterUpdateDate);
    if (!isNaN(rosterDate.getTime()) && rosterDate.getTime() > latestDate.getTime()) {
      latestDate = rosterDate;
    }
  }

  // 3. Inspect live doctor department roster timestamps
  if (liveDoctors && liveDoctors.length > 0) {
    for (const doc of liveDoctors) {
      if (doc.createdAt) {
        const docDate = new Date(doc.createdAt);
        if (!isNaN(docDate.getTime()) && docDate.getTime() > latestDate.getTime()) {
          latestDate = docDate;
        }
      }
      if (doc.updatedAt) {
        const docUpdateDate = new Date(doc.updatedAt);
        if (!isNaN(docUpdateDate.getTime()) && docUpdateDate.getTime() > latestDate.getTime()) {
          latestDate = docUpdateDate;
        }
      }
    }
  }

  // Prevent erroneous forward dates into the future
  const now = new Date();
  if (latestDate.getTime() > now.getTime()) {
    latestDate = now;
  }

  return getArticleIsoDate(latestDate.toISOString().split("T")[0]);
}
