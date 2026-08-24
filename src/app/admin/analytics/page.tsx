import { Metadata } from "next";
import { RevenueAnalyticsTab } from "../components/RevenueAnalyticsTab";

export const metadata: Metadata = {
  title: "Financial & Revenue Analytics | Admin Portal - Health Club",
  description: "Subscription revenue, member savings, renewal retention rates and partner hospital performance analytics.",
};

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <RevenueAnalyticsTab />
    </div>
  );
}
