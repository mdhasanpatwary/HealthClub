import type { Metadata } from "next";
import { SITE_URL, DEFAULT_OG_IMAGES, DEFAULT_TWITTER_IMAGES } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "সদস্য লগইন - হেলথ ক্লাব",
  description: "আপনার হেলথ ক্লাব অ্যাকাউন্টে লগইন করে মেম্বার আইডি ও ছাড়ের ইতিহাস দেখুন।",
  alternates: {
    canonical: `${SITE_URL}/login`,
  },
  openGraph: {
    title: "সদস্য লগইন - হেলথ ক্লাব",
    description: "আপনার হেলথ ক্লাব অ্যাকাউন্টে লগইন করে মেম্বার আইডি ও ছাড়ের ইতিহাস দেখুন।",
    url: `${SITE_URL}/login`,
    siteName: "হেলথ ক্লাব (Health Club)",
    type: "website",
    images: DEFAULT_OG_IMAGES,
  },
  twitter: {
    card: "summary_large_image",
    title: "সদস্য লগইন - হেলথ ক্লাব",
    description: "আপনার হেলথ ক্লাব অ্যাকাউন্টে লগইন করে মেম্বার আইডি ও ছাড়ের ইতিহাস দেখুন।",
    images: DEFAULT_TWITTER_IMAGES,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
