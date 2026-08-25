"use client";

import { Star, ShieldCheck, User } from "lucide-react";
import { Review } from "@/services/db";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { formatNum } from "@/lib/i18n";

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const { t, locale } = useLanguage();
  const isBn = locale === "bn";

  const memberName = review.member?.name || (isBn ? "সদস্য" : "Member");
  const memberTier = review.member?.tier;

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return new Intl.DateTimeFormat(isBn ? "bn-BD" : "en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(date);
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl border border-border/70 bg-card hover:border-primary/30 transition-all duration-200 shadow-2xs space-y-3">
      {/* Header: Member Info & Rating */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Member Avatar */}
          <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0">
            {review.member?.name ? (
              review.member.name.charAt(0).toUpperCase()
            ) : (
              <User className="h-5 w-5 text-primary" />
            )}
          </div>

          {/* Member Name & Badges */}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-sm font-bold text-foreground truncate font-heading">
                {memberName}
              </span>
              {memberTier === "founding" && (
                <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  {isBn ? "ফাউন্ডিং" : "Founding"}
                </span>
              )}
              {memberTier === "premium" && (
                <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  {isBn ? "প্রিমিয়াম" : "Premium"}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                <span>{t("reviews.verifiedVisit")}</span>
              </span>
              <span>•</span>
              <span className="text-[11px] text-muted-foreground/80 font-mono">
                {formatDate(review.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Star Rating Badge */}
        <div className="flex items-center gap-0.5 bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/25 px-2 py-1 rounded-xl shrink-0">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
          <span className="text-xs font-black text-amber-600 dark:text-amber-400 font-heading">
            {formatNum(review.rating, locale)}
          </span>
        </div>
      </div>

      {/* Comment Body */}
      {review.comment && (
        <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed pl-0.5 whitespace-pre-line">
          {review.comment}
        </p>
      )}
    </div>
  );
}
