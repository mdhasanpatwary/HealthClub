import type { MetadataRoute } from "next";
import { HEALTH_TIPS_ARTICLES } from "@/data/healthTipsData";
import { SITE_URL } from "@/lib/siteConfig";
import { getDoctorsAction } from "@/app/actions/doctorActions";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL;
  const lastModified = new Date();

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

    return {
      url: route === "" ? `${baseUrl}/` : `${baseUrl}${route}`,
      lastModified,
      changeFrequency,
      priority,
    };
  });

  // Dynamic health tip articles
  const articleEntries: MetadataRoute.Sitemap = HEALTH_TIPS_ARTICLES.map((article) => ({
    url: `${baseUrl}/health-tips/${article.slug}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Dynamic doctor profiles
  let doctorEntries: MetadataRoute.Sitemap = [];
  try {
    const doctors = await getDoctorsAction();
    doctorEntries = doctors.map((doc) => ({
      url: `${baseUrl}/consultants/${doc.id}`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.85,
    }));
  } catch {
    doctorEntries = [];
  }

  return [...staticEntries, ...articleEntries, ...doctorEntries];
}

