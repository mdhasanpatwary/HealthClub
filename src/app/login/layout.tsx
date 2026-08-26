import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Locale } from "@/lib/i18n";
import { SITE_URL, DEFAULT_OG_IMAGES, DEFAULT_TWITTER_IMAGES } from "@/lib/siteConfig";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "bn";
  const isEn = locale === "en";

  const title = isEn ? "Member Login - Health Club" : "সদস্য লগইন - হেলথ ক্লাব";
  const description = isEn
    ? "Log in to your Health Club member portal to view digital membership ID card and savings history."
    : "আপনার হেলথ ক্লাব অ্যাকাউন্টে লগইন করে মেম্বার আইডি ও ছাড়ের ইতিহাস দেখুন।";

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/login`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/login`,
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

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
