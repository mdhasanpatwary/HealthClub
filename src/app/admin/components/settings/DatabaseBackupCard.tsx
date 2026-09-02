import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Database, ArrowRight } from "lucide-react";

interface DatabaseBackupCardProps {
  isEn: boolean;
}

export function DatabaseBackupCard({ isEn }: DatabaseBackupCardProps) {
  return (
    <Card className="border border-border shadow-xs">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Database className="h-4 w-4 text-primary" />
          <span>{isEn ? "Database Backup & Snapshots" : "ডাটাবেস ব্যাকআপ ও স্ন্যাপশট"}</span>
        </CardTitle>
        <CardDescription className="text-xs">
          {isEn
            ? "One-click JSON/SQL backup export, snapshot registry, and retention policies"
            : "ওয়ান-ক্লিক ব্যাকআপ ডাম্প, সার্ভার স্ন্যাপশট ও স্বয়ংক্রিয় রিটেনশন পলিসি"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-muted-foreground leading-relaxed">
          {isEn
            ? "Export complete database records, schedule automated snapshots, and manage retention for disaster recovery."
            : "সম্পূর্ণ ডাটাবেসের ব্যাকআপ এক্সপোর্ট, পয়েন্ট-ইন-টাইম স্ন্যাপশট এবং অটো রিটেনশন পলিসি নিয়ন্ত্রণ করুন।"}
        </p>
        <div className="pt-1">
          <Link
            href="/admin/settings/backup"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors"
          >
            <span>{isEn ? "Manage Backups & Snapshots" : "ব্যাকআপ ও স্ন্যাপশট ব্যবস্থাপনা"}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
