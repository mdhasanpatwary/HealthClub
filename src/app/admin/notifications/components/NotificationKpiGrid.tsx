"use client";

import { Bell, Building2, Mail, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { toBanglaNums } from "@/lib/utils";
import type { AdminNotificationSummary } from "@/app/actions/adminNotificationTypes";

interface NotificationKpiGridProps {
  summary: AdminNotificationSummary;
  totalCount: number;
  unreadCount: number;
}

export function NotificationKpiGrid({
  summary,
  totalCount,
  unreadCount,
}: NotificationKpiGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* KPI 1: Unread */}
      <Card className="rounded-2xl border-border/80 shadow-xs bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">
              সর্বমোট বিজ্ঞপ্তি
            </p>
            <p className="text-xl sm:text-2xl font-extrabold text-foreground">
              {toBanglaNums(totalCount)}
            </p>
            <span className="text-[11px] font-semibold text-primary">
              {toBanglaNums(unreadCount)} অপঠিত
            </span>
          </div>
          <div className="size-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <Bell className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      {/* KPI 2: Action Required */}
      <Card className="rounded-2xl border-border/80 shadow-xs bg-gradient-to-br from-amber-500/5 to-transparent">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">
              অপেক্ষমাণ অ্যাকশন
            </p>
            <p className="text-xl sm:text-2xl font-extrabold text-amber-600 dark:text-amber-400">
              {toBanglaNums(
                summary.pendingRenewalsCount + summary.pendingPartnerRequestsCount
              )}
            </p>
            <span className="text-[11px] text-muted-foreground">
              নবায়ন ও পার্টনার আবেদন
            </span>
          </div>
          <div className="size-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <Building2 className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      {/* KPI 3: Messages */}
      <Card className="rounded-2xl border-border/80 shadow-xs bg-gradient-to-br from-rose-500/5 to-transparent">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">
              নতুন বার্তা
            </p>
            <p className="text-xl sm:text-2xl font-extrabold text-rose-600 dark:text-rose-400">
              {toBanglaNums(summary.unreadMessagesCount)}
            </p>
            <span className="text-[11px] text-muted-foreground">
              যোগাযোগের বার্তা
            </span>
          </div>
          <div className="size-10 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
            <Mail className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      {/* KPI 4: Expiring Members */}
      <Card className="rounded-2xl border-border/80 shadow-xs bg-gradient-to-br from-purple-500/5 to-transparent">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">
              মেয়াদোত্তীর্ণের সতর্কতা
            </p>
            <p className="text-xl sm:text-2xl font-extrabold text-purple-600 dark:text-purple-400">
              {toBanglaNums(summary.expiringMembersCount)}
            </p>
            <span className="text-[11px] text-muted-foreground">
              ১৫ দিনের মধ্যে শেষ হবে
            </span>
          </div>
          <div className="size-10 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
            <AlertTriangle className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
