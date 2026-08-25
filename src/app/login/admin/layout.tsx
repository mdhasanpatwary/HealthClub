import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Locale } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "bn";
  const isEn = locale === "en";

  return {
    title: isEn ? "Admin Login - Health Club" : "এডমিন লগইন - হেলথ ক্লাব",
    description: isEn
      ? "Log in to the Health Club admin management portal."
      : "হেলথ ক্লাব এডমিন পোর্টালে লগইন করুন।",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
