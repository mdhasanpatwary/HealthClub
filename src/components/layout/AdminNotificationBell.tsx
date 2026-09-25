"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCheck,
  RotateCcw,
  Building2,
  Mail,
  UserPlus,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toBanglaNums } from "@/lib/utils";
import { useAdminNotifications } from "@/app/admin/hooks/useAdminNotifications";
import {
  isNotificationSoundEnabled,
  setNotificationSoundEnabled,
} from "@/lib/notificationSound";
import type { AdminNotificationItem, NotificationCategory } from "@/app/actions/adminNotificationTypes";

function getCategoryIcon(category: NotificationCategory) {
  switch (category) {
    case "renewal":
      return <RotateCcw className="h-4 w-4 text-purple-500" />;
    case "partner_request":
      return <Building2 className="h-4 w-4 text-amber-500" />;
    case "message":
      return <Mail className="h-4 w-4 text-rose-500" />;
    case "member_expiring":
      return <AlertTriangle className="h-4 w-4 text-amber-600" />;
    case "member_new":
      return <UserPlus className="h-4 w-4 text-emerald-500" />;
    default:
      return <Bell className="h-4 w-4 text-primary" />;
  }
}

function getCategoryBg(category: NotificationCategory) {
  switch (category) {
    case "renewal":
      return "bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400";
    case "partner_request":
      return "bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400";
    case "message":
      return "bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400";
    case "member_expiring":
      return "bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300";
    case "member_new":
      return "bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400";
    default:
      return "bg-primary/10 text-primary";
  }
}

function formatRelativeTime(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffMin < 1) return "এইমাত্র";
    if (diffMin < 60) return `${toBanglaNums(diffMin)} মিনিট আগে`;
    if (diffHour < 24) return `${toBanglaNums(diffHour)} ঘণ্টা আগে`;
    if (diffDay < 7) return `${toBanglaNums(diffDay)} দিন আগে`;

    return d.toLocaleDateString("bn-BD", {
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function AdminNotificationBell() {
  const [open, setOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"all" | "actions" | "messages">("all");
  const [soundEnabled, setSoundEnabled] = useState(() => isNotificationSoundEnabled());

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    setNotificationSoundEnabled(next);
  };

  const {
    items,
    unreadCount,
    highPriorityCount,
    readSet,
    markAsRead,
    markAllAsRead,
  } = useAdminNotifications();

  // Filter items for the dropdown preview
  const filteredItems = items.filter((item) => {
    if (activeFilter === "actions") {
      return item.category === "renewal" || item.category === "partner_request";
    }
    if (activeFilter === "messages") {
      return item.category === "message";
    }
    return true;
  });

  const previewItems = filteredItems.slice(0, 5);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        aria-label="বিজ্ঞপ্তি"
        title={
          unreadCount > 0
            ? `${toBanglaNums(unreadCount)}টি অপঠিত`
            : "বিজ্ঞপ্তি"
        }
        className="relative inline-flex items-center justify-center size-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-background/80 transition-all cursor-pointer outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40"
      >
        <Bell className="h-4 w-4 transition-transform active:scale-90" />

        {unreadCount > 0 && (
          <span
            className={`absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white shadow-xs transition-transform animate-in zoom-in ${
              highPriorityCount > 0 ? "bg-rose-500 animate-pulse" : "bg-primary"
            }`}
          >
            {unreadCount > 9 ? "৯+" : toBanglaNums(unreadCount)}
          </span>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-[340px] sm:w-[380px] p-0 bg-background dark:bg-slate-900 border border-border shadow-2xl rounded-2xl overflow-hidden z-50 animate-in fade-in-50 zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3.5 border-b border-border/70 bg-muted/30">
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-sm text-foreground">
              বিজ্ঞপ্তি ও অ্যালার্ট
            </span>
            {unreadCount > 0 && (
              <Badge
                variant="outline"
                className="bg-primary/10 text-primary border-primary/20 text-[11px] font-semibold px-2 py-0.5 rounded-full"
              >
                {toBanglaNums(unreadCount)} নতুন
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={toggleSound}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
              title={soundEnabled ? "শব্দ বন্ধ করুন" : "শব্দ চালু করুন"}
              aria-label={soundEnabled ? "শব্দ বন্ধ করুন" : "শব্দ চালু করুন"}
            >
              {soundEnabled ? (
                <Volume2 className="h-3.5 w-3.5 text-primary" />
              ) : (
                <VolumeX className="h-3.5 w-3.5 text-muted-foreground" />
              )}
            </button>

            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="xs"
                onClick={markAllAsRead}
                className="text-[11px] h-7 px-2 font-medium text-muted-foreground hover:text-primary transition-colors gap-1"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                <span>সব পঠিত</span>
              </Button>
            )}
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 p-2 bg-muted/10 border-b border-border/40 text-xs">
          <button
            type="button"
            onClick={() => setActiveFilter("all")}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              activeFilter === "all"
                ? "bg-primary text-primary-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
            }`}
          >
            সকল ({toBanglaNums(items.length)})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("actions")}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              activeFilter === "actions"
                ? "bg-primary text-primary-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
            }`}
          >
            প্রয়োজনীয় অ্যাকশন
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("messages")}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              activeFilter === "messages"
                ? "bg-primary text-primary-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
            }`}
          >
            বার্তা
          </button>
        </div>

        {/* Notification List */}
        <div className="max-h-[340px] overflow-y-auto divide-y divide-border/40 overscroll-contain">
          {previewItems.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <div className="inline-flex size-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <CheckCheck className="h-5 w-5" />
              </div>
              <p className="text-xs font-semibold text-foreground">
                সব ক্লিয়ার! কোনো অপেক্ষমাণ নোটিফিকেশন নেই।
              </p>
              <p className="text-[11px] text-muted-foreground">
                নতুন মেম্বারশিপ বা পার্টনার আবেদন আসলে এখানে দেখতে পাবেন।
              </p>
            </div>
          ) : (
            previewItems.map((item: AdminNotificationItem) => {
              const isRead = readSet.has(item.id);
              const title = item.titleBn;
              const desc = item.descriptionBn;
              const actionLabel = item.actionLabelBn;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (!isRead) markAsRead(item.id);
                  }}
                  className={`p-3 transition-colors relative flex gap-3 items-start group cursor-pointer ${
                    isRead
                      ? "bg-background hover:bg-muted/40 opacity-80"
                      : "bg-primary/5 hover:bg-primary/10"
                  }`}
                >
                  {/* Category Icon */}
                  <div
                    className={`size-8 rounded-xl shrink-0 flex items-center justify-center ${getCategoryBg(
                      item.category
                    )}`}
                  >
                    {getCategoryIcon(item.category)}
                  </div>

                  {/* Body */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <p
                        className={`text-xs truncate ${
                          isRead
                            ? "font-medium text-foreground/80"
                            : "font-bold text-foreground"
                        }`}
                      >
                        {title}
                      </p>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0">
                        {formatRelativeTime(item.timestamp)}
                      </span>
                    </div>

                    <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                      {desc}
                    </p>

                    {/* Quick CTA */}
                    <div className="pt-1 flex items-center gap-2">
                      <Link
                        href={item.actionUrl}
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(item.id);
                          setOpen(false);
                        }}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline"
                      >
                        <span>{actionLabel}</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>

                      {!isRead && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(item.id);
                          }}
                          className="text-[10px] text-muted-foreground hover:text-foreground font-medium ml-auto cursor-pointer"
                        >
                          পঠিত করুন
                        </button>
                      )}
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

        {/* Footer */}
        <div className="p-2.5 border-t border-border/70 bg-muted/30 text-center">
          <Link
            href="/admin/notifications"
            onClick={() => setOpen(false)}
            className="inline-flex items-center justify-center gap-1.5 w-full py-1.5 px-3 rounded-xl text-xs font-bold text-primary hover:bg-primary/10 transition-colors"
          >
            <span>সকল বিজ্ঞপ্তি ও হিস্ট্রি দেখুন</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
