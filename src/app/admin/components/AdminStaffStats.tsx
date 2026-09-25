"use client";

import { Card, CardContent } from "@/components/ui/card";
import { formatNum } from "@/lib/utils";
import { Users, Shield, CheckCircle2 } from "lucide-react";

interface AdminStaffStatsProps {
  totalStaff: number;
  superAdminCount: number;
  moderatorCount: number;
  supportCount: number;
  activeCount: number;
}

export function AdminStaffStats({
  totalStaff,
  superAdminCount,
  moderatorCount,
  supportCount,
  activeCount,
}: AdminStaffStatsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      <Card className="border-border shadow-2xs bg-card">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-muted-foreground">
              মোট স্টাফ
            </p>
            <h3 className="text-xl sm:text-2xl font-bold font-mono text-foreground mt-0.5">
              {formatNum(totalStaff)}
            </h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {formatNum(activeCount)} সক্রিয় একাউন্ট
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
              সুপার এডমিন
            </p>
            <h3 className="text-xl sm:text-2xl font-bold font-mono text-purple-600 dark:text-purple-400 mt-0.5">
              {formatNum(superAdminCount)}
            </h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              সর্বোচ্চ ক্ষমতা
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
              কন্টেন্ট মডারেটর
            </p>
            <h3 className="text-xl sm:text-2xl font-bold font-mono text-blue-600 dark:text-blue-400 mt-0.5">
              {formatNum(moderatorCount)}
            </h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              ডাক্তার ও ব্লগ
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
              সাপোর্ট স্টাফ
            </p>
            <h3 className="text-xl sm:text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-0.5">
              {formatNum(supportCount)}
            </h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              মেম্বার ও নবায়ন
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
