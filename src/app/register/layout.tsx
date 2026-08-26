import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Locale } from "@/lib/i18n";
import { SITE_URL, DEFAULT_OG_IMAGES, DEFAULT_TWITTER_IMAGES } from "@/lib/siteConfig";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "bn";
  const isEn = locale === "en";

  const title = isEn
    ? "Register Free Health Membership Card - Health Club"
    : "ফ্রি সদস্য রেজিস্ট্রেশন - হেলথ ক্লাব ডিজিটাল কার্ড";
  const description = isEn
    ? "Register for free Health Club founding membership card and start saving on hospital and lab bills."
    : "হেলথ ক্লাবের ফাউন্ডিং সদস্য হতে আজই ফ্রি রেজিস্ট্রেশন করুন এবং হাসপাতালে চিকিৎসায় সেরা ছাড় পান।";

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/register`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/register`,
      siteName: "হেলথ ক্লাব (Health Club)",
      locale: isEn ? "en_US" : "bn_BD",
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

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
