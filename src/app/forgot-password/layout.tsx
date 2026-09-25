import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "পাসওয়ার্ড ভুলে গেছেন? - হেলথ ক্লাব",
  description: "আপনার হেলথ ক্লাব অ্যাকাউন্টের পাসওয়ার্ড রিসেট করুন।",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
