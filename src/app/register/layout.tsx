import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Locale } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "bn";
  const isEn = locale === "en";

  return {
    title: isEn
      ? "Register Free Health Membership Card - Health Club"
      : "ফ্রি সদস্য রেজিস্ট্রেশন - হেলথ ক্লাব ডিজিটাল কার্ড",
    description: isEn
      ? "Register for free Health Club founding membership card and start saving on hospital and lab bills."
      : "হেলথ ক্লাবের ফাউন্ডিং সদস্য হতে আজই ফ্রি রেজিস্ট্রেশন করুন এবং হাসপাতালে চিকিৎসায় সেরা ছাড় পান।",
    alternates: {
      canonical: "https://healthclubfeni.vercel.app/register",
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
