import { BlogPost, BlogPostCardItem, BlogAuthor, BlogFAQItem } from "@/types/blog";
import { BLOG_POSTS } from "@/data/blog/blogPosts";
import { getPostFacilityMeta } from "@/app/blog/utils/blogPagination";
import { sortBlogPostsByFamousOrder } from "@/data/blog/famousBlogRanking";

export function mapStaticPostsToCards(): BlogPostCardItem[] {
  const cards: BlogPostCardItem[] = BLOG_POSTS.map((post) => {
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
  return sortBlogPostsByFamousOrder(cards);
}

export function normalizeDiagnosticPricing(pricing: unknown): BlogPost["diagnosticTestPricingBn"] {
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

export function normalizeSelectionGuide(guide: unknown): BlogPost["selectionGuideBn"] {
  if (!guide || typeof guide !== "object") return undefined;
  const g = guide as Record<string, unknown>;

  const pointsBnArr = Array.isArray(g.pointsBn) ? g.pointsBn : [];
  const criteriaArr = Array.isArray(g.criteria) ? g.criteria : [];
  const pointsArr = Array.isArray(g.points) ? g.points : [];

  let rawPoints: unknown[] = [];
  if (pointsBnArr.length > 0) {
    const hasValidDesc = pointsBnArr.some(
      (p) =>
        typeof p === "string" ||
        Boolean(
          (p as Record<string, unknown>)?.desc ||
          (p as Record<string, unknown>)?.description ||
          (p as Record<string, unknown>)?.descriptionBn ||
          (p as Record<string, unknown>)?.detail
        )
    );
    if (!hasValidDesc && criteriaArr.length > 0) {
      rawPoints = criteriaArr;
    } else {
      rawPoints = pointsBnArr;
    }
  } else if (criteriaArr.length > 0) {
    rawPoints = criteriaArr;
  } else if (pointsArr.length > 0) {
    rawPoints = pointsArr;
  }

  return {
    titleBn: (g.titleBn || g.title || "") as string,
    subtitleBn: (g.subtitleBn || g.subtitle || undefined) as string | undefined,
    pointsBn: Array.isArray(rawPoints)
      ? rawPoints.map((p) => {
          if (typeof p === "string") {
            const colonIdx = p.indexOf(":") !== -1 ? p.indexOf(":") : p.indexOf("ঃ");
            if (colonIdx !== -1) {
              return {
                title: p.slice(0, colonIdx).trim(),
                desc: p.slice(colonIdx + 1).trim(),
              };
            }
            return {
              title: p.trim(),
              desc: "",
            };
          }
          const pt = (p || {}) as Record<string, unknown>;
          const rawTitle = (pt.title || pt.titleBn || pt.point || pt.criterionBn || "") as string;
          const rawDesc = (pt.desc || pt.descBn || pt.description || pt.descriptionBn || pt.detail || "") as string;

          if (!rawDesc && rawTitle) {
            const colonIdx = rawTitle.indexOf(":") !== -1 ? rawTitle.indexOf(":") : rawTitle.indexOf("ঃ");
            if (colonIdx !== -1) {
              return {
                title: rawTitle.slice(0, colonIdx).trim(),
                desc: rawTitle.slice(colonIdx + 1).trim(),
              };
            }
          }

          return {
            title: String(rawTitle).trim(),
            desc: String(rawDesc).trim(),
          };
        })
      : [],
  };
}

export function normalizeBookingGuide(guide: unknown): BlogPost["bookingGuideBn"] {
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

export function mapDbRowToBlogPost(dbPost: {
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
