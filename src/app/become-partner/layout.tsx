import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_URL, DEFAULT_OG_IMAGES, DEFAULT_TWITTER_IMAGES } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "পার্টনার হোন - হাসপাতাল ও ডায়াগনস্টিক নেটওয়ার্ক",
  description: "হেলথ ক্লাবের পার্টনার নেটওয়ার্কে আপনার হাসপাতাল, ল্যাব বা ফার্মেসি রেজিস্টার করুন এবং হাজারো মেম্বারদের চিকিৎসাসেবা প্রদান করুন।",
  alternates: {
    canonical: `${SITE_URL}/become-partner`,
  },
  openGraph: {
    title: "হেলথ ক্লাব পার্টনারশিপ আবেদন",
    description: "চিকিৎসাকেন্দ্র, ল্যাব বা ফার্মেসি পার্টনারশিপের জন্য আজই আবেদন করুন।",
    url: `${SITE_URL}/become-partner`,
    siteName: "হেলথ ক্লাব (Health Club)",
    type: "website",
    images: DEFAULT_OG_IMAGES,
  },
  twitter: {
    card: "summary_large_image",
    title: "হেলথ ক্লাব পার্টনারশিপ আবেদন",
    description: "চিকিৎসাকেন্দ্র, ল্যাব বা ফার্মেসি পার্টনারশিপের জন্য আজই আবেদন করুন।",
    images: DEFAULT_TWITTER_IMAGES,
  },
};

export default function BecomePartnerLayout({
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
          name: "পার্টনার হোন",
          item: `${SITE_URL}/become-partner`,
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

