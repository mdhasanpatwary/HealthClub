import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://healthclubfeni.vercel.app";
  const lastModified = new Date();

  // Public static routes
  const routes = [
    "",
    "/about-us",
    "/membership",
    "/partner-hospitals",
    "/consultants",
    "/become-partner",
    "/contact",
    "/privacy-policy",
    "/terms-conditions",
    "/login",
    "/register",
  ];

  return routes.map((route) => {
    let priority = 0.8;
    let changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never" = "weekly";

    if (route === "") {
      priority = 1.0;
      changeFrequency = "daily";
    } else if (route === "/partner-hospitals" || route === "/consultants" || route === "/membership") {
      priority = 0.9;
      changeFrequency = "daily";
    } else if (route === "/about-us" || route === "/contact" || route === "/become-partner") {
      priority = 0.8;
      changeFrequency = "weekly";
    } else if (route === "/privacy-policy" || route === "/terms-conditions") {
      priority = 0.3;
      changeFrequency = "monthly";
    }

    return {
      url: `${baseUrl}${route}`,
      lastModified,
      changeFrequency,
      priority,
    };
  });
}
