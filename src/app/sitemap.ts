import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/siteConfig";
import { getDoctorsAction } from "@/app/actions/doctorActions";
import { getPartnersAction } from "@/app/actions/partnerActions";
import { getAllHealthTipsAction } from "@/app/actions/healthTipsAdminActions";
import { HEALTH_TIPS_ARTICLES, HealthTipArticle } from "@/data/healthTipsData";
import { logger } from "@/lib/logger";

const STATIC_LAST_MODIFIED = new Date("2026-08-20T00:00:00.000Z");

const BN_TO_EN_DIGITS: Record<string, string> = {
  "০": "0",
  "১": "1",
  "২": "2",
  "৩": "3",
  "৪": "4",
  "৫": "5",
  "৬": "6",
  "৭": "7",
  "৮": "8",
  "৯": "9",
};

const BN_MONTHS_MAP: Record<string, string> = {
  "জানুয়ারি": "01",
  "ফেব্রুয়ারি": "02",
  "মার্চ": "03",
  "এপ্রিল": "04",
  "মে": "05",
  "জুন": "06",
  "জুলাই": "07",
  "আগস্ট": "08",
  "সেপ্টেম্বর": "09",
  "অক্টোবর": "10",
  "নভেম্বর": "11",
  "ডিসেম্বর": "12",
};

function parseArticleDate(dateStr?: string): Date {
  if (!dateStr) return STATIC_LAST_MODIFIED;

  // Try direct parsing if standard format (e.g. YYYY-MM-DD)
  const parsedDirect = new Date(dateStr);
  if (!isNaN(parsedDirect.getTime())) {
    return parsedDirect;
  }

  try {
    let normalized = dateStr;
    for (const [bnDigit, enDigit] of Object.entries(BN_TO_EN_DIGITS)) {
      normalized = normalized.replaceAll(bnDigit, enDigit);
    }

    for (const [bnMonth, monthNum] of Object.entries(BN_MONTHS_MAP)) {
      if (normalized.includes(bnMonth)) {
        const parts = normalized.replace(",", "").split(/\s+/);
        const day = parts[0]?.padStart(2, "0");
        const year = parts[2] || parts[1];
        if (day && year && !isNaN(Number(day)) && !isNaN(Number(year))) {
          const parsed = new Date(`${year}-${monthNum}-${day}T00:00:00.000Z`);
          if (!isNaN(parsed.getTime())) return parsed;
        }
      }
    }
  } catch {
    // Fallback
  }

  return STATIC_LAST_MODIFIED;
}

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
    doctorEntries = doctors.map((doc) => {
      const url = `${baseUrl}/consultants/${doc.id}`;
      return {
        url,
        lastModified: STATIC_LAST_MODIFIED,
        changeFrequency: "daily",
        priority: 0.85,
        alternates: getAlternates(url),
      };
    });
  } catch (error) {
    logger.error("Error fetching doctors in sitemap:", error);
    doctorEntries = [];
  }

  // Dynamic partner hospital & clinic profiles
  let partnerEntries: MetadataRoute.Sitemap = [];
  try {
    const partners = await getPartnersAction();
    partnerEntries = partners.map((partner) => {
      const url = `${baseUrl}/partner-hospitals/${partner.id}`;
      return {
        url,
        lastModified: STATIC_LAST_MODIFIED,
        changeFrequency: "daily",
        priority: 0.85,
        alternates: getAlternates(url),
      };
    });
  } catch (error) {
    logger.error("Error fetching partners in sitemap:", error);
    partnerEntries = [];
  }

  return [...staticEntries, ...articleEntries, ...doctorEntries, ...partnerEntries];
}
