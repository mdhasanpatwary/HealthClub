import type { Metadata } from "next";
import { SITE_URL, DEFAULT_OG_IMAGES, DEFAULT_TWITTER_IMAGES } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "ফ্রি সদস্য রেজিস্ট্রেশন - হেলথ ক্লাব ডিজিটাল কার্ড",
  description: "হেলথ ক্লাবের ফাউন্ডিং সদস্য হতে আজই ফ্রি রেজিস্ট্রেশন করুন এবং হাসপাতালে চিকিৎসায় সেরা ছাড় পান।",
  alternates: {
    canonical: `${SITE_URL}/register`,
  },
  openGraph: {
    title: "ফ্রি সদস্য রেজিস্ট্রেশন - হেলথ ক্লাব ডিজিটাল কার্ড",
    description: "হেলথ ক্লাবের ফাউন্ডিং সদস্য হতে আজই ফ্রি রেজিস্ট্রেশন করুন এবং হাসপাতালে চিকিৎসায় সেরা ছাড় পান।",
    url: `${SITE_URL}/register`,
    siteName: "হেলথ ক্লাব (Health Club)",
    type: "website",
    images: DEFAULT_OG_IMAGES,
  },
  twitter: {
    card: "summary_large_image",
    title: "ফ্রি সদস্য রেজিস্ট্রেশন - হেলথ ক্লাব ডিজিটাল কার্ড",
    description: "হেলথ ক্লাবের ফাউন্ডিং সদস্য হতে আজই ফ্রি রেজিস্ট্রেশন করুন এবং হাসপাতালে চিকিৎসায় সেরা ছাড় পান।",
    images: DEFAULT_TWITTER_IMAGES,
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
