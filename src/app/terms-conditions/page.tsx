import { cookies } from "next/headers";
import { Locale, tServer } from "@/lib/i18n";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_URL, DEFAULT_OG_IMAGES, DEFAULT_TWITTER_IMAGES } from "@/lib/siteConfig";

export async function generateMetadata() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "bn";
  const title = tServer(locale, "pages.termsConditions.metaTitle");
  const description = tServer(locale, "pages.termsConditions.metaDesc");

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/terms-conditions`,
      languages: {
        "bn-BD": `${SITE_URL}/terms-conditions`,
        "en-US": `${SITE_URL}/terms-conditions`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/terms-conditions`,
      siteName: "হেলথ ক্লাব (Health Club)",
      locale: locale === "en" ? "en_US" : "bn_BD",
      type: "website",
      images: DEFAULT_OG_IMAGES,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: DEFAULT_TWITTER_IMAGES,
    },
  };
}

export default async function TermsConditionsPage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "bn";
  const t = (key: string) => tServer(locale, key);

  const jsonLdData = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": locale === "en" ? "Home" : "হোম",
          "item": SITE_URL
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": locale === "en" ? "Terms & Conditions" : "টার্মস অ্যান্ড কন্ডিশনস",
          "item": `${SITE_URL}/terms-conditions`
        }
      ]
    }
  ];

  return (
    <div className="bg-background min-h-screen py-12">
      <JsonLd data={jsonLdData} />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-8 text-secondary/90 leading-relaxed text-sm sm:text-base">
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-secondary dark:text-white border-b border-border pb-4">
          {t("pages.termsConditions.title")}
        </h1>
        <p className="text-muted-foreground">{t("pages.termsConditions.lastUpdated")}</p>
        
        <p>
          {t("pages.termsConditions.intro")}
        </p>

        <h2 className="font-heading text-xl font-bold text-secondary dark:text-white mt-6">
          {t("pages.termsConditions.section1Title")}
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>{t("pages.termsConditions.section1Item1")}</li>
          <li>{t("pages.termsConditions.section1Item2")}</li>
          <li>{t("pages.termsConditions.section1Item3")}</li>
        </ul>

        <h2 className="font-heading text-xl font-bold text-secondary dark:text-white mt-6">
          {t("pages.termsConditions.section2Title")}
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>{t("pages.termsConditions.section2Item1")}</li>
          <li>{t("pages.termsConditions.section2Item2")}</li>
          <li>{t("pages.termsConditions.section2Item3")}</li>
        </ul>

        <h2 className="font-heading text-xl font-bold text-secondary dark:text-white mt-6">
          {t("pages.termsConditions.section3Title")}
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>{t("pages.termsConditions.section3Item1")}</li>
          <li>{t("pages.termsConditions.section3Item2")}</li>
        </ul>
      </div>
    </div>
  );
}
