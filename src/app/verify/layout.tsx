import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_URL, DEFAULT_OG_IMAGES, DEFAULT_TWITTER_IMAGES } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "ডিজিটাল মেম্বারশিপ কার্ড ভেরিফিকেশন - হেলথ ক্লাব",
  description: "হেলথ ক্লাব ডিজিটাল মেম্বারশিপ কার্ডের সত্যতা, মেয়াদ এবং স্ট্যাটাস তাৎক্ষণিকভাবে যাচাই করুন।",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "সদস্যতা যাচাই - হেলথ ক্লাব",
    description: "হেলথ ক্লাব মেম্বারশিপ কার্ড যাচাইকরণ সিস্টেম।",
    url: `${SITE_URL}/verify`,
    siteName: "হেলথ ক্লাব (Health Club)",
    type: "website",
    images: DEFAULT_OG_IMAGES,
  },
  twitter: {
    card: "summary_large_image",
    title: "সদস্যতা যাচাই - হেলথ ক্লাব",
    description: "হেলথ ক্লাব মেম্বারশিপ কার্ড যাচাইকরণ সিস্টেম।",
    images: DEFAULT_TWITTER_IMAGES,
  },
};

export default function VerifyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLdData = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "হোম",
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "সদস্য যাচাই",
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

