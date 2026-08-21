"use client";

import { Bell, Building2, Mail, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatNum, Locale } from "@/lib/i18n";
import { AdminNotificationSummary } from "@/app/actions/adminNotificationActions";

interface NotificationKpiGridProps {
  summary: AdminNotificationSummary;
  totalCount: number;
  unreadCount: number;
  locale: Locale;
  t: (key: string) => string;
}

export function NotificationKpiGrid({
  summary,
  totalCount,
  unreadCount,
  locale,
  t,
}: NotificationKpiGridProps) {
  const isBn = locale === "bn";

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* KPI 1: Unread */}
      <Card className="rounded-2xl border-border/80 shadow-xs bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">
              {t("admin.notifications.kpiTotal") || "সর্বমোট বিজ্ঞপ্তি"}
            </p>
            <p className="text-xl sm:text-2xl font-extrabold text-foreground">
              {formatNum(totalCount, locale)}
            </p>
            <span className="text-[11px] font-semibold text-primary">
              {formatNum(unreadCount, locale)} {isBn ? "অপঠিত" : "unread"}
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
              {t("admin.notifications.kpiPending") || "অপেক্ষমাণ অ্যাকশন"}
            </p>
            <p className="text-xl sm:text-2xl font-extrabold text-amber-600 dark:text-amber-400">
              {formatNum(
                summary.pendingRenewalsCount + summary.pendingPartnerRequestsCount,
                locale
              )}
            </p>
            <span className="text-[11px] text-muted-foreground">
              {isBn ? "নবায়ন ও পার্টনার আবেদন" : "Renewals & Partners"}
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
              {t("admin.notifications.kpiMessages") || "নতুন বার্তা"}
            </p>
            <p className="text-xl sm:text-2xl font-extrabold text-rose-600 dark:text-rose-400">
              {formatNum(summary.unreadMessagesCount, locale)}
            </p>
            <span className="text-[11px] text-muted-foreground">
              {isBn ? "যোগাযোগের বার্তা" : "Contact inquiries"}
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
              {t("admin.notifications.kpiExpiring") || "মেয়াদোত্তীর্ণের সতর্কতা"}
            </p>
            <p className="text-xl sm:text-2xl font-extrabold text-purple-600 dark:text-purple-400">
              {formatNum(summary.expiringMembersCount, locale)}
            </p>
            <span className="text-[11px] text-muted-foreground">
              {isBn ? "১৫ দিনের মধ্যে শেষ হবে" : "Within 15 days"}
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
