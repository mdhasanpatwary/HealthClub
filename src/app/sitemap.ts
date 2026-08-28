import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/siteConfig";
import { getDoctorsAction } from "@/app/actions/doctorActions";
import { getPartnersAction } from "@/app/actions/partnerActions";
import { getAllHealthTipsAction } from "@/app/actions/healthTipsAdminActions";
import { HEALTH_TIPS_ARTICLES, HealthTipArticle } from "@/data/healthTipsData";
import { getAllDepartmentSlugs } from "@/data/doctorSeoData";
import { logger } from "@/lib/logger";

import { parseArticleDate, STATIC_FALLBACK_DATE as STATIC_LAST_MODIFIED } from "@/lib/dateUtils";

function getAlternates(url: string) {
  return {
    languages: {
      "bn-BD": url,
      "en-US": url,
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL;

  // Public static routes
  const staticRoutes = [
    "",
    "/emergency",
    "/consultants",
    "/partner-hospitals",
    "/health-tips",
    "/health-tools",
    "/membership",
    "/about-us",
    "/become-partner",
    "/contact",
    "/privacy-policy",
    "/terms-conditions",
    "/login",
    "/register",
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
    } else if (route === "/partner-hospitals" || route === "/membership") {
      priority = 0.9;
      changeFrequency = "daily";
    } else if (route === "/health-tips" || route === "/health-tools") {
      priority = 0.85;
      changeFrequency = "daily";
    } else if (route === "/about-us" || route === "/contact" || route === "/become-partner") {
      priority = 0.8;
      changeFrequency = "weekly";
    } else if (route === "/privacy-policy" || route === "/terms-conditions") {
      priority = 0.3;
      changeFrequency = "monthly";
    } else if (route === "/login" || route === "/register") {
      priority = 0.5;
      changeFrequency = "monthly";
    }

    const url = route === "" ? `${baseUrl}/` : `${baseUrl}${route}`;

    return {
      url,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency,
      priority,
      alternates: getAlternates(url),
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
      alternates: getAlternates(url),
    };
  });

  // Dynamic doctor profiles
  let doctorEntries: MetadataRoute.Sitemap = [];
  try {
    const doctors = await getDoctorsAction();
    doctorEntries = doctors
      .filter((doc) => doc.isActive !== false)
      .map((doc) => {
        const url = `${baseUrl}/consultants/${doc.id}`;
        const lastModified =
          doc.createdAt && !isNaN(new Date(doc.createdAt).getTime())
            ? new Date(doc.createdAt)
            : STATIC_LAST_MODIFIED;

        return {
          url,
          lastModified,
          changeFrequency: "daily",
          priority: 0.85,
          alternates: getAlternates(url),
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
      const url = `${baseUrl}/partner-hospitals/${partner.id}`;
      const lastModified =
        partner.createdAt && !isNaN(new Date(partner.createdAt).getTime())
          ? new Date(partner.createdAt)
          : STATIC_LAST_MODIFIED;

      return {
        url,
        lastModified,
        changeFrequency: "daily",
        priority: 0.85,
        alternates: getAlternates(url),
      };
    });
  } catch (error) {
    logger.error("Error fetching partners in sitemap:", error);
    partnerEntries = [];
  }

  // Dynamic specialized doctor department SEO landing routes
  const departmentEntries: MetadataRoute.Sitemap = getAllDepartmentSlugs().map((slug) => {
    const url = `${baseUrl}/consultants?dept=${slug}`;
    return {
      url,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: "daily",
      priority: 0.9,
      alternates: getAlternates(url),
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
      alternates: getAlternates(url),
    };
  });

  return [
    ...staticEntries,
    ...departmentEntries,
    ...partnerCategoryEntries,
    ...articleEntries,
    ...doctorEntries,
    ...partnerEntries,
  ];
}
