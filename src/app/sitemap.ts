import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/siteConfig";

// Cache the sitemap for 24 hours — prevents 5 DB queries on every bot crawl
export const revalidate = 86400;
import { getDoctorsAction } from "@/app/actions/doctorActions";
import { getPartnersAction } from "@/app/actions/partnerActions";
import { getAllHealthTipsAction } from "@/app/actions/healthTipsAdminActions";
import { HEALTH_TIPS_ARTICLES, HealthTipArticle } from "@/data/healthTipsData";
import { getAllDepartmentSlugs } from "@/data/doctorSeoData";
import { getAllBlogPostsAction } from "@/app/actions/blogAdminActions";
import { BLOG_FILTER_PILLS } from "@/data/blog/blogCategories";
import { logger } from "@/lib/logger";

import { parseArticleDate, STATIC_FALLBACK_DATE as STATIC_LAST_MODIFIED } from "@/lib/dateUtils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL;

  // Public static routes
  const staticRoutes = [
    "",
    "/emergency",
    "/consultants",
    "/partner-hospitals",
    "/blog",
    "/health-tips",
    "/health-tools",
    "/membership",
    "/about-us",
    "/become-partner",
    "/contact",
    "/register",
    "/login",
    "/privacy-policy",
    "/terms-conditions",
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => {
    let priority = 0.8;
    let changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never" = "weekly";

    if (route === "") {
      priority = 1.0;
      changeFrequency = "daily";
    } else if (route === "/emergency" || route === "/consultants") {
      priority = 0.95;
      changeFrequency = "daily";
    } else if (route === "/partner-hospitals" || route === "/membership" || route === "/blog") {
      priority = 0.9;
      changeFrequency = "daily";
    } else if (route === "/health-tips" || route === "/health-tools") {
      priority = 0.85;
      changeFrequency = "daily";
    } else if (route === "/about-us" || route === "/contact" || route === "/become-partner" || route === "/register") {
      priority = 0.8;
      changeFrequency = "weekly";
    } else if (route === "/login") {
      priority = 0.5;
      changeFrequency = "monthly";
    } else if (route === "/privacy-policy" || route === "/terms-conditions") {
      priority = 0.3;
      changeFrequency = "monthly";
    }

    const url = route === "" ? `${baseUrl}/` : `${baseUrl}${route}`;

    return {
      url,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency,
      priority,
    };
  });

  // Dynamic health tip articles
  let articles: HealthTipArticle[] = [];
  try {
    articles = await getAllHealthTipsAction();
  } catch (error) {
    logger.error("Error fetching health tips in sitemap:", error);
    articles = HEALTH_TIPS_ARTICLES;
  }

  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => {
    const url = `${baseUrl}/health-tips/${article.slug}`;
    return {
      url,
      lastModified: parseArticleDate(article.publishedDate),
      changeFrequency: "weekly",
      priority: 0.85,
    };
  });

  // Dynamic doctor profiles
  let doctorEntries: MetadataRoute.Sitemap = [];
  try {
    const doctors = await getDoctorsAction();
    doctorEntries = doctors
      .filter((doc) => doc.isActive !== false)
      .map((doc) => {
        const doctorSlug = doc.slug ? encodeURIComponent(doc.slug) : doc.id;
        const url = `${baseUrl}/consultants/${doctorSlug}`;
        const lastModified =
          doc.createdAt && !isNaN(new Date(doc.createdAt).getTime())
            ? new Date(doc.createdAt)
            : STATIC_LAST_MODIFIED;

        return {
          url,
          lastModified,
          changeFrequency: "daily",
          priority: 0.85,
        };
      });
  } catch (error) {
    logger.error("Error fetching doctors in sitemap:", error);
    doctorEntries = [];
  }

  // Dynamic partner hospital, diagnostic lab & clinic profiles
  let partnerEntries: MetadataRoute.Sitemap = [];
  try {
    const partners = await getPartnersAction();
    partnerEntries = partners.map((partner) => {
      const url = `${baseUrl}/partner-hospitals/${encodeURIComponent(partner.slug || partner.id)}`;
      const lastModified =
        partner.createdAt && !isNaN(new Date(partner.createdAt).getTime())
          ? new Date(partner.createdAt)
          : STATIC_LAST_MODIFIED;

      return {
        url,
        lastModified,
        changeFrequency: "daily",
        priority: 0.85,
      };
    });
  } catch (error) {
    logger.error("Error fetching partners in sitemap:", error);
    partnerEntries = [];
  }

  // Dynamic specialized doctor department clean SEO landing routes
  const departmentEntries: MetadataRoute.Sitemap = getAllDepartmentSlugs().map((slug) => {
    const url = `${baseUrl}/consultants/department/${slug}`;
    return {
      url,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: "daily",
      priority: 0.9,
    };
  });

  // Dynamic partner category landing routes (hospital, diagnostic, pharmacy)
  const partnerCategories = ["hospital", "diagnostic", "pharmacy"] as const;
  const partnerCategoryEntries: MetadataRoute.Sitemap = partnerCategories.map((category) => {
    const url = `${baseUrl}/partner-hospitals?category=${category}`;
    return {
      url,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: "daily",
      priority: 0.85,
    };
  });

  // Dynamic blog filter category landing routes (excluding "all" which is covered by /blog)
  const blogCategoryEntries: MetadataRoute.Sitemap = BLOG_FILTER_PILLS
    .filter((pill) => pill.id !== "all")
    .map((pill) => {
      const url = `${baseUrl}/blog?category=${pill.id}`;
      return {
        url,
        lastModified: STATIC_LAST_MODIFIED,
        changeFrequency: "weekly",
        priority: 0.85,
      };
    });

  // Dynamic blog articles (e.g. Best 10 Hospitals in Feni)
  const blogPosts = await getAllBlogPostsAction();
  const blogPostEntries: MetadataRoute.Sitemap = blogPosts.map((post) => {
    const url = `${baseUrl}/blog/${encodeURIComponent(post.slug)}`;
    const lastModified = parseArticleDate(post.modifiedDate, STATIC_LAST_MODIFIED);

    return {
      url,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    };
  });

  return [
    ...staticEntries,
    ...departmentEntries,
    ...partnerCategoryEntries,
    ...blogCategoryEntries,
    ...blogPostEntries,
    ...articleEntries,
    ...doctorEntries,
    ...partnerEntries,
  ];
}
