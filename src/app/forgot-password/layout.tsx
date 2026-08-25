import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Locale } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "bn";
  const isEn = locale === "en";

  return {
    title: isEn ? "Forgot Password - Health Club" : "পাসওয়ার্ড ভুলে গেছেন? - হেলথ ক্লাব",
    description: isEn
      ? "Reset your Health Club account password."
      : "আপনার হেলথ ক্লাব অ্যাকাউন্টের পাসওয়ার্ড রিসেট করুন।",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
