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
    ? "Healthcare Partner Application - Health Club"
    : "হেলথ ক্লাব পার্টনারশিপ আবেদন";
  const ogDesc = isEn
    ? "Apply to become a partner medical center in Feni & Bangladesh."
    : "চিকিৎসাকেন্দ্র, ল্যাব বা ফার্মেসি পার্টনারশিপের জন্য আজই আবেদন করুন।";

  return {
    title: isEn
      ? "Become a Partner Hospital or Diagnostic Center - Health Club"
      : "পার্টনার হোন - হেলথ ক্লাব হাসপাতাল ও ডায়াগনস্টিক নেটওয়ার্ক",
    description: isEn
      ? "Join the Health Club partner healthcare network to connect with thousands of active members and expand your hospital or clinic patient base."
      : "হেলথ ক্লাবের পার্টনার নেটওয়ার্কে আপনার হাসপাতাল, ল্যাব বা ফার্মেসি রেজিস্টার করুন এবং হাজারো মেম্বারদের চিকিৎসাসেবা প্রদান করুন।",
    alternates: {
      canonical: `${SITE_URL}/become-partner`,
      languages: {
        "bn-BD": `${SITE_URL}/become-partner`,
        "en-US": `${SITE_URL}/become-partner`,
      },
    },
    openGraph: {
      title: ogTitle,
      description: ogDesc,
      url: `${SITE_URL}/become-partner`,
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

export default async function BecomePartnerLayout({
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
          "name": locale === "en" ? "Become a Partner" : "পার্টনার হোন",
          "item": `${SITE_URL}/become-partner`
        }
      ]
    }
  ];

  return (
    <>
      <JsonLd data={jsonLdData} />
      {children}
    </>
  );
}
