import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "মেম্বারশিপ পেমেন্ট - হেলথ ক্লাব",
  description: "বিকাশ পেমেন্ট তথ্য সাবমিট করে আপনার হেলথ ক্লাব ডিজিটাল মেম্বারশিপ সক্রিয় করুন।",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RegisterPaymentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
