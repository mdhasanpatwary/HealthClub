import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Locale } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "bn";
  const isEn = locale === "en";

  return {
    title: isEn ? "Verify Email - Health Club" : "ইমেইল ভেরিফিকেশন - হেলথ ক্লাব",
    description: isEn
      ? "Enter the 6-digit OTP to verify your email address and complete registration."
      : "আপনার নিবন্ধিত ইমেইলে পাঠানো ৬ সংখ্যার ওটিপি কোড যাচাই করুন।",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function RegisterVerifyEmailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
