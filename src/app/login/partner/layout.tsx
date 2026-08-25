import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Locale } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "bn";
  const isEn = locale === "en";

  return {
    title: isEn ? "Partner & Desk Login - Health Club" : "পার্টনার ও ক্যাশিয়ার লগইন - হেলথ ক্লাব",
    description: isEn
      ? "Log in to the Health Club partner hospital and counter desk portal."
      : "হেলথ ক্লাব অংশীদার হাসপাতাল ও কাউন্টার ডেস্কে লগইন করুন।",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function PartnerLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
