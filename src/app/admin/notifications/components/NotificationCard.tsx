"use client";

import Link from "next/link";
import {
  Bell,
  RotateCcw,
  Building2,
  Mail,
  UserPlus,
  AlertTriangle,
  ArrowRight,
  Trash2,
  Clock,
  Check,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatNum, Locale } from "@/lib/i18n";
import {
  AdminNotificationItem,
  NotificationCategory,
} from "@/app/actions/adminNotificationActions";

export function getCategoryIcon(category: NotificationCategory) {
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

export function getCategoryBadge(category: NotificationCategory, isBn: boolean) {
  switch (category) {
    case "renewal":
      return {
        label: isBn ? "নবায়ন আবেদন" : "Renewal",
        bg: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
      };
    case "partner_request":
      return {
        label: isBn ? "পার্টনার আবেদন" : "Partner Request",
        bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      };
    case "message":
      return {
        label: isBn ? "বার্তা" : "Message",
        bg: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
      };
    case "member_expiring":
      return {
        label: isBn ? "মেয়াদ শেষ হবে" : "Expiring",
        bg: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
      };
    case "member_new":
      return {
        label: isBn ? "নতুন সদস্য" : "New Member",
        bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      };
    default:
      return {
        label: isBn ? "সিস্টেম" : "System",
        bg: "bg-primary/10 text-primary border-primary/20",
      };
  }
}

export function formatRelativeTime(dateStr: string, isBn: boolean): string {
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
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

interface NotificationCardProps {
  item: AdminNotificationItem;
  isRead: boolean;
  locale: Locale;
  onMarkRead: (id: string) => void;
  onDismiss: (id: string) => void;
  dismissText?: string;
  markAsReadText?: string;
}

export function NotificationCard({
  item,
  isRead,
  locale,
  onMarkRead,
  onDismiss,
  dismissText = "মুছে ফেলুন",
  markAsReadText = "পঠিত করুন",
}: NotificationCardProps) {
  const isBn = locale === "bn";
  const title = isBn ? item.titleBn : item.titleEn;
  const desc = isBn ? item.descriptionBn : item.descriptionEn;
  const actionLabel = isBn ? item.actionLabelBn : item.actionLabelEn;
  const badgeInfo = getCategoryBadge(item.category, isBn);

  return (
    <Card
      className={`rounded-2xl border transition-all duration-200 ${
        isRead
          ? "bg-background/80 hover:bg-background border-border/70 opacity-85 shadow-2xs"
          : "bg-background hover:bg-muted/30 border-primary/30 shadow-xs ring-1 ring-primary/10"
      }`}
    >
      <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-start justify-between">
        <div className="flex items-start gap-3.5 flex-1 min-w-0">
          {/* Icon */}
          <div
            className={`size-10 rounded-2xl shrink-0 flex items-center justify-center ${
              badgeInfo.bg
            }`}
          >
            {getCategoryIcon(item.category)}
          </div>

          {/* Content */}
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeInfo.bg}`}
              >
                {badgeInfo.label}
              </Badge>
              <h4
                className={`text-sm tracking-tight ${
                  isRead ? "font-semibold text-foreground/90" : "font-bold text-foreground"
                }`}
              >
                {title}
              </h4>
              {!isRead && (
                <span className="size-2 rounded-full bg-primary shrink-0 animate-pulse" />
              )}
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {desc}
            </p>

            <div className="flex items-center gap-4 text-[11px] text-muted-foreground pt-0.5">
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatRelativeTime(item.timestamp, isBn)}
              </span>
              {item.meta?.phone && (
                <span className="font-mono text-foreground/70 font-medium">
                  {String(item.meta.phone)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 self-end sm:self-center shrink-0 pt-2 sm:pt-0 w-full sm:w-auto justify-end border-t sm:border-t-0 border-border/40">
          <Link
            href={item.actionUrl}
            onClick={() => onMarkRead(item.id)}
            className={buttonVariants({
              size: "sm",
              className: "rounded-xl text-xs font-bold gap-1.5 shadow-2xs cursor-pointer",
            })}
          >
            <span>{actionLabel}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          {isRead ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => onDismiss(item.id)}
              className="rounded-xl text-muted-foreground hover:text-rose-600 cursor-pointer"
              title={dismissText}
              aria-label={`${dismissText}: ${title}`}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              onClick={() => onMarkRead(item.id)}
              className="rounded-xl text-muted-foreground hover:text-foreground cursor-pointer"
              title={markAsReadText}
              aria-label={`${markAsReadText}: ${title}`}
            >
              <Check className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
