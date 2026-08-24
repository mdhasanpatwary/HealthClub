import { verifyAdmin } from "@/lib/dal";
import { AdminNav } from "../components/AdminNav";
import { AdminStaffTab } from "../components/AdminStaffTab";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "এডমিন ও স্টাফ ব্যবস্থাপনা | হেলথ ক্লাব",
  description: "এডমিন রোল-বেসড অ্যাক্সেস কন্ট্রোল (RBAC) ও পারমিশন ব্যবস্থাপনা।",
};

export default async function AdminStaffPage() {
  // Only super admins can access the staff & RBAC configuration page
  await verifyAdmin(["super_admin"]);

  return (
    <div className="space-y-6">
      <AdminNav />
      <AdminStaffTab />
    </div>
  );
}
