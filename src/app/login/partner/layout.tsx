import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "পার্টনার ও ক্যাশিয়ার লগইন - হেলথ ক্লাব",
  description: "হেলথ ক্লাব অংশীদার হাসপাতাল ও কাউন্টার ডেস্কে লগইন করুন।",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PartnerLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
