import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ইমেইল ভেরিফিকেশন - হেলথ ক্লাব",
  description: "আপনার নিবন্ধিত ইমেইলে পাঠানো ৬ সংখ্যার ওটিপি কোড যাচাই করুন।",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RegisterVerifyEmailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
