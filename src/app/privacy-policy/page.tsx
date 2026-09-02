import { cookies } from "next/headers";
import { Locale, tServer } from "@/lib/i18n";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_URL, DEFAULT_OG_IMAGES, DEFAULT_TWITTER_IMAGES } from "@/lib/siteConfig";

export async function generateMetadata() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "bn";
  const title = tServer(locale, "pages.privacyPolicy.metaTitle");
  const description = tServer(locale, "pages.privacyPolicy.metaDesc");

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/privacy-policy`,
      languages: {
        "bn-BD": `${SITE_URL}/privacy-policy`,
        "en-US": `${SITE_URL}/privacy-policy`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/privacy-policy`,
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

export default async function PrivacyPolicyPage() {
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
          "name": locale === "en" ? "Privacy Policy" : "প্রাইভেসী পলিসি",
          "item": `${SITE_URL}/privacy-policy`
        }
      ]
    }
  ];

  return (
    <div className="bg-background min-h-screen py-12">
      <JsonLd data={jsonLdData} />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-8 text-secondary/90 leading-relaxed text-sm sm:text-base">
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-secondary dark:text-white border-b border-border pb-4">
          {t("pages.privacyPolicy.title")}
        </h1>
        <p className="text-muted-foreground">{t("pages.privacyPolicy.lastUpdated")}</p>
        
        <p>
          {t("pages.privacyPolicy.intro")}
        </p>

        <h2 className="font-heading text-xl font-bold text-secondary dark:text-white mt-6">
          {t("pages.privacyPolicy.section1Title")}
        </h2>
        <p>
          {t("pages.privacyPolicy.section1Intro")}
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>{t("pages.privacyPolicy.section1Item1")}</li>
          <li>{t("pages.privacyPolicy.section1Item2")}</li>
          <li>{t("pages.privacyPolicy.section1Item3")}</li>
          <li>{t("pages.privacyPolicy.section1Item4")}</li>
        </ul>

        <h2 className="font-heading text-xl font-bold text-secondary dark:text-white mt-6">
          {t("pages.privacyPolicy.section2Title")}
        </h2>
        <p>
          {t("pages.privacyPolicy.section2Intro")}
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>{t("pages.privacyPolicy.section2Item1")}</li>
          <li>{t("pages.privacyPolicy.section2Item2")}</li>
          <li>{t("pages.privacyPolicy.section2Item3")}</li>
          <li>{t("pages.privacyPolicy.section2Item4")}</li>
        </ul>

        <h2 className="font-heading text-xl font-bold text-secondary dark:text-white mt-6">
          {t("pages.privacyPolicy.section3Title")}
        </h2>
        <p className="text-muted-foreground">
          {t("pages.privacyPolicy.section3Desc")}
        </p>

        <h2 className="font-heading text-xl font-bold text-secondary dark:text-white mt-6">
          {t("pages.privacyPolicy.section4Title")}
        </h2>
        <p className="text-muted-foreground">
          {t("pages.privacyPolicy.section4Desc")}
        </p>
      </div>
    </div>
  );
}
