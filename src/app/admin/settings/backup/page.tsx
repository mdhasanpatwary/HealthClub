import { verifyAdmin } from "@/lib/dal";
import { DbBackupManager } from "../../components/DbBackupManager";
import { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft, Database, LayoutDashboard, Settings } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "ডাটাবেস ব্যাকআপ ও স্ন্যাপশট | হেলথ ক্লাব",
  description: "ওয়ান-ক্লিক ডাটাবেস ব্যাকআপ এক্সপোর্ট, স্ন্যাপশট রেজিস্ট্রি ও রিটেনশন পলিসি ব্যবস্থাপনা।",
};

export default async function AdminDbBackupPage() {
  // Only super admins can access database backup and disaster recovery
  await verifyAdmin(["super_admin"]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Breadcrumbs & Quick Back Link */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link
            href="/admin"
            className="hover:text-primary transition-colors flex items-center gap-1 font-medium"
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            <span>ড্যাশবোর্ড</span>
          </Link>
          <span>/</span>
          <Link
            href="/admin/settings"
            className="hover:text-primary transition-colors flex items-center gap-1 font-medium"
          >
            <Settings className="h-3.5 w-3.5" />
            <span>সেটিংস</span>
          </Link>
          <span>/</span>
          <span className="text-foreground font-semibold">
            ডাটাবেস ব্যাকআপ ও স্ন্যাপশট
          </span>
        </div>

        <Link
          href="/admin/settings"
          className={buttonVariants({
            variant: "outline",
            size: "sm",
            className: "h-8 text-xs gap-1.5 border-border rounded-xl cursor-pointer",
          })}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>সেটিংস এ ফিরে যান</span>
        </Link>
      </div>

      {/* Hero Banner Card */}
      <Card className="border-border bg-gradient-to-r from-primary/5 via-card to-background shadow-xs">
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-xs">
                <Database className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="font-heading text-lg sm:text-xl font-bold text-foreground">
                  ডাটাবেস ব্যাকআপ ও স্ন্যাপশট ব্যবস্থাপনা (Disaster Recovery)
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm mt-0.5">
                  ওয়ান-ক্লিক JSON/SQL ব্যাকআপ এক্সপোর্ট, পয়েন্ট-ইন-টাইম স্ন্যাপশট ও স্বয়ংক্রিয় রিটেনশন পলিসি নিয়ন্ত্রণ করুন।
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Backup Manager */}
      <DbBackupManager />
    </div>
  );
}
