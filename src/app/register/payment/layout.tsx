import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Locale } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "bn";
  const isEn = locale === "en";

  return {
    title: isEn ? "Membership Payment - Health Club" : "মেম্বারশিপ পেমেন্ট - হেলথ ক্লাব",
    description: isEn
      ? "Submit your Health Club digital membership fee payment verification."
      : "বিকাশ পেমেন্ট তথ্য সাবমিট করে আপনার হেলথ ক্লাব ডিজিটাল মেম্বারশিপ সক্রিয় করুন।",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function RegisterPaymentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
