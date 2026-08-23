"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCheck,
  Receipt,
  Sparkles,
  ArrowRight,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { formatNum } from "@/lib/i18n";
import { useMemberNotifications } from "../hooks/useMemberNotifications";
import { MemberNotification, MemberNotificationType } from "@/services/db";

function getNotificationIcon(type: MemberNotificationType) {
  switch (type) {
    case "renewal_approved":
      return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
    case "renewal_rejected":
      return <XCircle className="h-4 w-4 text-rose-500" />;
    case "transaction_recorded":
      return <Receipt className="h-4 w-4 text-cyan-500" />;
    case "expiring_soon":
      return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    case "welcome":
      return <Sparkles className="h-4 w-4 text-purple-500" />;
    case "system":
    default:
      return <Bell className="h-4 w-4 text-primary" />;
  }
}

function getNotificationBg(type: MemberNotificationType) {
  switch (type) {
    case "renewal_approved":
      return "bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400";
    case "renewal_rejected":
      return "bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400";
    case "transaction_recorded":
      return "bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400";
    case "expiring_soon":
      return "bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300";
    case "welcome":
      return "bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400";
    case "system":
    default:
      return "bg-primary/10 text-primary";
  }
}

function formatRelativeTime(dateStr: string, isBn: boolean): string {
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffMin < 1) return isBn ? "এইমাত্র" : "Just now";
    if (diffMin < 60)
      return isBn
        ? `${formatNum(diffMin, "bn")} মিনিট আগে`
        : `${diffMin}m ago`;
    if (diffHour < 24)
      return isBn
        ? `${formatNum(diffHour, "bn")} ঘণ্টা আগে`
        : `${diffHour}h ago`;
    if (diffDay < 7)
      return isBn ? `${formatNum(diffDay, "bn")} দিন আগে` : `${diffDay}d ago`;

    return d.toLocaleDateString(isBn ? "bn-BD" : "en-US", {
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function MemberNotificationBell() {
  const { locale, t } = useLanguage();
  const isBn = locale === "bn";
  const [open, setOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"all" | "transactions" | "account">("all");

  const {
    items,
    unreadCount,
    highPriorityCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useMemberNotifications();

  // Filter items for the dropdown preview
  const filteredItems = items.filter((item) => {
    if (activeFilter === "transactions") {
      return item.type === "transaction_recorded";
    }
    if (activeFilter === "account") {
      return (
        item.type === "renewal_approved" ||
        item.type === "renewal_rejected" ||
        item.type === "expiring_soon" ||
        item.type === "welcome" ||
        item.type === "system"
      );
    }
    return true;
  });

  const previewItems = filteredItems.slice(0, 10);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        aria-label={t("dashboard.notifications.title") || "বিজ্ঞপ্তি"}
        title={
          unreadCount > 0
            ? `${formatNum(unreadCount, locale)} ${
                t("dashboard.notifications.unreadCount") || "টি অপঠিত বিজ্ঞপ্তি"
              }`
            : t("dashboard.notifications.title") || "বিজ্ঞপ্তি"
        }
        className="relative inline-flex items-center justify-center size-8 sm:size-9 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all cursor-pointer outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40 border border-border/50 bg-background/50 shadow-2xs"
      >
        <Bell className="h-4 w-4 sm:h-4.5 sm:w-4.5 transition-transform active:scale-90" />

        {unreadCount > 0 && (
          <span
            className={`absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white shadow-xs transition-transform animate-in zoom-in ${
              highPriorityCount > 0 ? "bg-rose-500 animate-pulse" : "bg-primary"
            }`}
          >
            {unreadCount > 9 ? "9+" : formatNum(unreadCount, locale)}
          </span>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-[320px] sm:w-[380px] max-w-[92vw] p-0 bg-background dark:bg-slate-900 border border-border shadow-2xl rounded-2xl overflow-hidden z-50 animate-in fade-in-50 zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-3.5 border-b border-border/70 bg-muted/30">
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-sm text-foreground">
              {t("dashboard.notifications.title") || "বিজ্ঞপ্তি ও অ্যালার্ট"}
            </span>
            {unreadCount > 0 && (
              <Badge
                variant="outline"
                className="bg-primary/10 text-primary border-primary/20 text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-full"
              >
                {formatNum(unreadCount, locale)} {isBn ? "নতুন" : "new"}
              </Badge>
            )}
          </div>

          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="xs"
              onClick={markAllAsRead}
              className="text-[11px] h-7 px-2 font-medium text-muted-foreground hover:text-primary transition-colors gap-1"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              <span>{t("dashboard.notifications.markAllRead") || "সব পঠিত"}</span>
            </Button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-2 bg-muted/10 border-b border-border/40 text-xs overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveFilter("all")}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all shrink-0 text-xs ${
              activeFilter === "all"
                ? "bg-primary text-primary-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
            }`}
          >
            {t("dashboard.notifications.all") || "সকল"} ({formatNum(items.length, locale)})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("transactions")}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all shrink-0 text-xs ${
              activeFilter === "transactions"
                ? "bg-primary text-primary-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
            }`}
          >
            {t("dashboard.notifications.transactions") || "লেনদেন"}
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("account")}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all shrink-0 text-xs ${
              activeFilter === "account"
                ? "bg-primary text-primary-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
            }`}
          >
            {t("dashboard.notifications.accountRenewals") || "অ্যাকাউন্ট ও নবায়ন"}
          </button>
        </div>

        {/* Notification List */}
        <div className="max-h-[360px] overflow-y-auto divide-y divide-border/40 overscroll-contain">
          {previewItems.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <div className="inline-flex size-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <CheckCheck className="h-5 w-5" />
              </div>
              <p className="text-xs font-semibold text-foreground">
                {t("dashboard.notifications.allCaughtUp") || "সব ক্লিয়ার! কোনো নতুন বিজ্ঞপ্তি নেই।"}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {t("dashboard.notifications.emptyDesc") ||
                  "ডিসকাউন্ট ট্রানজেকশন বা মেম্বারশিপ নবায়নের আপডেট এখানে প্রদর্শিত হবে।"}
              </p>
            </div>
          ) : (
            previewItems.map((item: MemberNotification) => {
              const isRead = item.isRead;
              const title = isBn ? item.titleBn : item.titleEn;
              const msg = isBn ? item.messageBn : item.messageEn;

              return (
                <div
                  key={item.id}
                  className={`p-3 sm:p-3.5 transition-colors relative flex gap-3 items-start group ${
                    isRead
                      ? "bg-background hover:bg-muted/40 opacity-85"
                      : "bg-primary/5 hover:bg-primary/10"
                  }`}
                >
                  {/* Category Icon */}
                  <div
                    className={`size-8 rounded-xl shrink-0 flex items-center justify-center mt-0.5 ${getNotificationBg(
                      item.type
                    )}`}
                  >
                    {getNotificationIcon(item.type)}
                  </div>

                  {/* Body */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <p
                        className={`text-xs truncate ${
                          isRead
                            ? "font-medium text-foreground/90"
                            : "font-bold text-foreground"
                        }`}
                      >
                        {title}
                      </p>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0">
                        {formatRelativeTime(item.createdAt, isBn)}
                      </span>
                    </div>

                    <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                      {msg}
                    </p>

                    {/* Quick CTA and Controls */}
                    <div className="pt-1 flex items-center gap-2">
                      {item.link && (
                        <Link
                          href={item.link}
                          onClick={() => {
                            if (!isRead) markAsRead(item.id);
                            setOpen(false);
                          }}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline"
                        >
                          <span>{t("dashboard.notifications.viewDetails") || "বিস্তারিত দেখুন"}</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      )}

                      {!isRead && (
                        <button
                          type="button"
                          onClick={() => markAsRead(item.id)}
                          className="text-[10px] text-muted-foreground hover:text-foreground font-medium ml-auto transition-colors"
                        >
                          {t("dashboard.notifications.markRead") || "পঠিত"}
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => deleteNotification(item.id)}
                        className={`text-[10px] text-muted-foreground hover:text-rose-500 p-1 rounded-md transition-colors opacity-0 group-hover:opacity-100 ${
                          isRead ? "ml-auto" : ""
                        }`}
                        title={t("dashboard.notifications.delete") || "মুছে ফেলুন"}
                        aria-label={t("dashboard.notifications.delete") || "মুছে ফেলুন"}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Unread indicator dot */}
                  {!isRead && (
                    <span className="size-2 rounded-full bg-primary shrink-0 mt-1.5" />
                  )}
                </div>
              );
            })
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
