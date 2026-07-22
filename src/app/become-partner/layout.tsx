import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Locale } from "@/lib/i18n";
import JsonLd from "@/components/seo/JsonLd";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "bn";
  const isEn = locale === "en";

  return {
    title: isEn
      ? "Become a Partner Hospital or Diagnostic Center - Health Club"
      : "পার্টনার হোন - হেলথ ক্লাব হাসপাতাল ও ডায়াগনস্টিক নেটওয়ার্ক",
    description: isEn
      ? "Join the Health Club partner healthcare network to connect with thousands of active members and expand your hospital or clinic patient base."
      : "হেলথ ক্লাবের পার্টনার নেটওয়ার্কে আপনার হাসপাতাল, ল্যাব বা ফার্মেসি রেজিস্টার করুন এবং হাজারো মেম্বারদের চিকিৎসাসেবা প্রদান করুন।",
    alternates: {
      canonical: "https://healthclubfeni.vercel.app/become-partner",
    },
    openGraph: {
      title: isEn
        ? "Healthcare Partner Application - Health Club"
        : "হেলথ ক্লাব পার্টনারশিপ আবেদন",
      description: isEn
        ? "Apply to become a partner medical center in Feni & Bangladesh."
        : "চিকিৎসাকেন্দ্র, ল্যাব বা ফার্মেসি পার্টনারশিপের জন্য আজই আবেদন করুন।",
      url: "https://healthclubfeni.vercel.app/become-partner",
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
          "item": "https://healthclubfeni.vercel.app"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": locale === "en" ? "Become a Partner" : "পার্টনার হোন",
          "item": "https://healthclubfeni.vercel.app/become-partner"
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
