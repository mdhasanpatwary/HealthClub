import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "এডমিন লগইন - হেলথ ক্লাব",
  description: "হেলথ ক্লাব এডমিন পোর্টালে লগইন করুন।",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
