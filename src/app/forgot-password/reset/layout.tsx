import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "পাসওয়ার্ড রিসেট করুন - হেলথ ক্লাব",
  description: "ওটিপি কোড যাচাই করে নতুন পাসওয়ার্ড সংরক্ষণ করুন।",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
