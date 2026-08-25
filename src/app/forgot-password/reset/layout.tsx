import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Locale } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "bn";
  const isEn = locale === "en";

  return {
    title: isEn ? "Reset Password - Health Club" : "পাসওয়ার্ড রিসেট করুন - হেলথ ক্লাব",
    description: isEn
      ? "Enter OTP verification code and set a new password for your Health Club account."
      : "ওটিপি কোড যাচাই করে নতুন পাসওয়ার্ড সংরক্ষণ করুন।",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
