import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Locale } from "@/lib/i18n";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_URL, DEFAULT_OG_IMAGES, DEFAULT_TWITTER_IMAGES } from "@/lib/siteConfig";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "bn";
  const isEn = locale === "en";

  const ogTitle = isEn
    ? "Member Verification - Health Club"
    : "সদস্যতা যাচাই - হেলথ ক্লাব";
  const ogDesc = isEn
    ? "Official instant verification system for Health Club membership cards."
    : "হেলথ ক্লাব মেম্বারশিপ কার্ড যাচাইকরণ সিস্টেম।";

  return {
    title: isEn
      ? "Digital Membership Card Verification - Health Club"
      : "ডিজিটাল মেম্বারশিপ কার্ড ভেরিফিকেশন - হেলথ ক্লাব",
    description: isEn
      ? "Verify the authenticity, validity, and status of Health Club member discount cards instantly."
      : "হেলথ ক্লাব ডিজিটাল মেম্বারশিপ কার্ডের সত্যতা, মেয়াদ এবং স্ট্যাটাস তাৎক্ষণিকভাবে যাচাই করুন।",
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      title: ogTitle,
      description: ogDesc,
      url: `${SITE_URL}/verify`,
      siteName: "হেলথ ক্লাব (Health Club)",
      locale: isEn ? "en_US" : "bn_BD",
      type: "website",
      images: DEFAULT_OG_IMAGES,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDesc,
      images: DEFAULT_TWITTER_IMAGES,
    },
  };
}

export default async function VerifyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "bn";

  const jsonLdData = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: locale === "en" ? "Home" : "হোম",
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: locale === "en" ? "Verify Member" : "সদস্য যাচাই",
          item: `${SITE_URL}/verify`,
        },
      ],
    },
  ];

  return (
    <>
      <JsonLd data={jsonLdData} />
      {children}
    </>
  );
}
