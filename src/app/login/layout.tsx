import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Locale } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "bn";
  const isEn = locale === "en";

  return {
    title: isEn ? "Member Login - Health Club" : "সদস্য লগইন - হেলথ ক্লাব",
    description: isEn
      ? "Log in to your Health Club member portal to view digital membership ID card and savings history."
      : "আপনার হেলথ ক্লাব অ্যাকাউন্টে লগইন করে মেম্বার আইডি ও ছাড়ের ইতিহাস দেখুন।",
    alternates: {
      canonical: "https://healthclubfeni.vercel.app/login",
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
