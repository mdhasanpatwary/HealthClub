"use client";

import { Card, CardContent } from "@/components/ui/card";
import { formatNum } from "@/lib/i18n";
import { Users, Shield, CheckCircle2 } from "lucide-react";

interface AdminStaffStatsProps {
  totalStaff: number;
  superAdminCount: number;
  moderatorCount: number;
  supportCount: number;
  activeCount: number;
  locale: "bn" | "en";
}

export function AdminStaffStats({
  totalStaff,
  superAdminCount,
  moderatorCount,
  supportCount,
  activeCount,
  locale,
}: AdminStaffStatsProps) {
  const isBn = locale === "bn";

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      <Card className="border-border shadow-2xs bg-card">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-muted-foreground">
              {isBn ? "মোট স্টাফ" : "Total Staff"}
            </p>
            <h3 className="text-xl sm:text-2xl font-bold font-mono text-foreground mt-0.5">
              {formatNum(totalStaff, locale)}
            </h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {formatNum(activeCount, locale)} {isBn ? "সক্রিয় একাউন্ট" : "active"}
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-primary/10 text-primary">
            <Users className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border shadow-2xs bg-card">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-muted-foreground">
              {isBn ? "সুপার এডমিন" : "Super Admins"}
            </p>
            <h3 className="text-xl sm:text-2xl font-bold font-mono text-purple-600 dark:text-purple-400 mt-0.5">
              {formatNum(superAdminCount, locale)}
            </h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {isBn ? "সর্বোচ্চ ক্ষমতা" : "Full access"}
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-600">
            <Shield className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border shadow-2xs bg-card">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-muted-foreground">
              {isBn ? "কন্টেন্ট মডারেটর" : "Moderators"}
            </p>
            <h3 className="text-xl sm:text-2xl font-bold font-mono text-blue-600 dark:text-blue-400 mt-0.5">
              {formatNum(moderatorCount, locale)}
            </h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {isBn ? "ডাক্তার ও ব্লগ" : "Content & medical"}
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-600">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border shadow-2xs bg-card">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-muted-foreground">
              {isBn ? "সাপোর্ট স্টাফ" : "Support Staff"}
            </p>
            <h3 className="text-xl sm:text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-0.5">
              {formatNum(supportCount, locale)}
            </h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {isBn ? "মেম্বার ও নবায়ন" : "Members & operations"}
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600">
            <Users className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
