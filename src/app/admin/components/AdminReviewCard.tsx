"use client";

import {
  Star,
  CheckCircle2,
  XCircle,
  Trash2,
  Clock,
  Building2,
  User,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { formatNum } from "@/lib/i18n";
import { Review } from "@/services/db";

interface AdminReviewCardProps {
  review: Review;
  moderating: boolean;
  deleting: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDelete: (id: string) => void;
}

export function AdminReviewCard({
  review,
  moderating,
  deleting,
  onApprove,
  onReject,
  onDelete,
}: AdminReviewCardProps) {
  const { t, locale } = useLanguage();
  const isBn = locale === "bn";

  const isPending = review.status === "pending";
  const isApproved = review.status === "approved";
  const isRejected = review.status === "rejected";

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return new Intl.DateTimeFormat(isBn ? "bn-BD" : "en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(d);
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl border border-border/80 bg-card hover:border-primary/30 transition-all shadow-2xs space-y-3">
      {/* Row 1: Member & Partner Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        {/* Left: Member & Hospital details */}
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-sm text-foreground flex items-center gap-1.5 font-heading">
              <User className="h-4 w-4 text-primary" />
              <span>{review.member?.name || (isBn ? "সদস্য" : "Member")}</span>
            </span>

            {review.member?.phone && (
              <span className="text-xs text-muted-foreground flex items-center gap-1 font-mono">
                <Phone className="h-3 w-3" />
                <span>{review.member.phone}</span>
              </span>
            )}

            {review.member?.tier === "founding" && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                {isBn ? "ফাউন্ডিং" : "Founding"}
              </span>
            )}
            {review.member?.tier === "premium" && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                {isBn ? "প্রিমিয়াম" : "Premium"}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground flex items-center gap-1">
              <Building2 className="h-3.5 w-3.5 text-primary" />
              <span>{review.partner?.name || (isBn ? "পার্টনার" : "Partner")}</span>
            </span>
            <span>•</span>
            <span className="font-mono text-[11px]">{formatDate(review.createdAt)}</span>
          </div>
        </div>

        {/* Right: Star Rating & Status Badge */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
          <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/25 px-2.5 py-1 rounded-xl">
            <Star className="h-4 w-4 fill-amber-400 text-amber-500" />
            <span className="text-xs font-black text-amber-600 dark:text-amber-400 font-heading">
              {formatNum(review.rating, locale)}
            </span>
          </div>

          {isPending && (
            <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{t("reviews.pendingModeration")}</span>
            </span>
          )}
          {isApproved && (
            <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{t("reviews.approvedStatus")}</span>
            </span>
          )}
          {isRejected && (
            <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center gap-1">
              <XCircle className="h-3.5 w-3.5" />
              <span>{t("reviews.rejectedStatus")}</span>
            </span>
          )}
        </div>
      </div>

      {/* Comment Body */}
      {review.comment && (
        <p className="text-xs sm:text-sm text-foreground/90 bg-muted/30 p-3 rounded-xl border border-border/50 whitespace-pre-line leading-relaxed">
          &ldquo;{review.comment}&rdquo;
        </p>
      )}

      {/* Admin Rejection / Moderation Feedback */}
      {review.adminFeedback && (
        <div className="text-xs text-rose-600 dark:text-rose-400 bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
          <span className="font-bold">{isBn ? "মডারেশন নোট: " : "Moderation Note: "}</span>
          <span>{review.adminFeedback}</span>
        </div>
      )}

      {/* Actions Toolbar */}
      <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/40">
        {/* Approve button */}
        {!isApproved && (
          <Button
            size="sm"
            onClick={() => onApprove(review.id)}
            disabled={moderating}
            className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-2xs cursor-pointer"
          >
            <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
            <span>{t("admin.reviews.approve")}</span>
          </Button>
        )}

        {/* Reject button */}
        {!isRejected && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onReject(review.id)}
            disabled={moderating}
            className="h-8 text-rose-600 border-rose-500/30 hover:bg-rose-500/10 text-xs font-bold rounded-xl cursor-pointer"
          >
            <XCircle className="h-3.5 w-3.5 mr-1" />
            <span>{t("admin.reviews.reject")}</span>
          </Button>
        )}

        {/* Delete button */}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onDelete(review.id)}
          disabled={deleting}
          className="h-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 text-xs rounded-xl cursor-pointer"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
