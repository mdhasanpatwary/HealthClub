"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Star,
  ShieldCheck,
  MessageSquarePlus,
  LogIn,
  Receipt,
  Clock,
  CheckCircle2,
  Filter,
  Sparkles,
  ShieldAlert,
  Settings,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { formatNum } from "@/lib/i18n";
import { Partner, Review, PartnerReviewStats } from "@/services/db";
import {
  getPartnerReviewsAction,
  canMemberReviewPartnerAction,
  ReviewEligibilityResult,
} from "@/app/actions/reviewActions";
import { ReviewCard } from "./ReviewCard";
import { ReviewFormModal } from "./ReviewFormModal";

interface ReviewSectionProps {
  partner: Partner;
  initialStats?: PartnerReviewStats;
  initialReviews?: Review[];
}

export default function ReviewSection({
  partner,
  initialStats,
  initialReviews,
}: ReviewSectionProps) {
  const { t, locale } = useLanguage();
  const isBn = locale === "bn";

  const [loading, setLoading] = useState(!initialReviews);
  const [reviews, setReviews] = useState<Review[]>(initialReviews || []);
  const [stats, setStats] = useState<PartnerReviewStats>(
    initialStats || {
      averageRating: 0,
      totalReviews: 0,
      distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    }
  );

  const [eligibility, setEligibility] = useState<ReviewEligibilityResult | null>(null);
  const [eligibilityLoading, setEligibilityLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStarFilter, setSelectedStarFilter] = useState<number | null>(null);

  // Load reviews & stats
  const loadReviews = useCallback(async () => {
    try {
      const res = await getPartnerReviewsAction(partner.id);
      if (res.success) {
        setReviews(res.reviews);
        setStats(res.stats);
      }
    } catch {
      // Keep existing
    } finally {
      setLoading(false);
    }
  }, [partner.id]);

  // Load member review eligibility
  const checkEligibility = useCallback(async () => {
    try {
      const res = await canMemberReviewPartnerAction(partner.id);
      setEligibility(res);
    } catch {
      setEligibility({ canReview: false, reason: "NOT_LOGGED_IN", hasReviewed: false });
    } finally {
      setEligibilityLoading(false);
    }
  }, [partner.id]);

  useEffect(() => {
    let isMounted = true;
    Promise.resolve().then(() => {
      if (isMounted) {
        if (!initialReviews) loadReviews();
        checkEligibility();
      }
    });
    return () => {
      isMounted = false;
    };
  }, [initialReviews, loadReviews, checkEligibility]);

  const handleReviewSaved = async () => {
    await Promise.all([loadReviews(), checkEligibility()]);
  };

  const filteredReviews = selectedStarFilter
    ? reviews.filter((r) => r.rating === selectedStarFilter)
    : reviews;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-black text-secondary dark:text-white font-heading tracking-tight">
              {t("reviews.title")}
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span>{t("reviews.verifiedBadge")}</span>
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isBn
              ? `${partner.name}-এ চিকিৎসাসেবা ও ডিসকাউন্ট গ্রহণকারী ভেরিফাইড সদস্যদের বাস্তব অভিজ্ঞতা।`
              : `Genuine ratings & reviews from verified members who availed discounts at ${partner.name}.`}
          </p>
        </div>

        {/* Write Review Action button for eligible users */}
        {eligibility?.canReview && (
          <Button
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-xl shadow-2xs self-start sm:self-auto cursor-pointer"
          >
            <MessageSquarePlus className="h-3.5 w-3.5 mr-1.5" />
            <span>
              {eligibility.hasReviewed ? t("reviews.editReview") : t("reviews.writeReview")}
            </span>
          </Button>
        )}
      </div>

      {/* Ratings & Breakdown Scorecard */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-6 p-4 sm:p-5 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-xs shadow-2xs">
        {/* Big Score (4 cols) */}
        <div className="sm:col-span-4 flex flex-col items-center justify-center text-center p-3 rounded-xl bg-muted/40 border border-border/50">
          <span className="text-3xl sm:text-4xl font-black text-foreground font-heading tracking-tight">
            {stats.totalReviews > 0 ? formatNum(stats.averageRating, locale) : "0.0"}
          </span>
          <div className="flex items-center gap-1 my-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= Math.round(stats.averageRating)
                    ? "fill-amber-400 text-amber-500"
                    : "text-muted-foreground/30"
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground font-medium">
            {t("reviews.outOfFive")} • {formatNum(stats.totalReviews, locale)}{" "}
            {t("reviews.totalReviews")}
          </p>
        </div>

        {/* 5-Star Distribution Bars (8 cols) */}
        <div className="sm:col-span-8 flex flex-col justify-center space-y-1.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = stats.distribution[star as 1 | 2 | 3 | 4 | 5] || 0;
            const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedStarFilter(selectedStarFilter === star ? null : star)
                  }
                  className={`flex items-center gap-1 w-12 text-[11px] font-bold transition-colors cursor-pointer ${
                    selectedStarFilter === star ? "text-primary font-black" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span>{formatNum(star, locale)}</span>
                  <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
                </button>

                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <span className="w-8 text-right text-[11px] text-muted-foreground font-mono">
                  {formatNum(count, locale)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review Eligibility Feedback Cards */}
      {!eligibilityLoading && (
        <>
          {/* Case 1: Logged in as Admin */}
          {eligibility?.reason === "LOGGED_IN_AS_ADMIN" && (
            <div className="p-4 rounded-2xl border border-indigo-500/30 bg-indigo-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5">
                  <ShieldAlert className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-foreground font-heading">
                      {isBn ? "আপনি এডমিন হিসেবে লগইন আছেন" : "Logged in as Administrator"}
                    </h4>
                    <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                      {isBn ? "এডমিন সেশন" : "Admin Session"}
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
                    {isBn
                      ? "সাধারণত ভেরিফাইড মেম্বারগণ ডিসকাউন্ট ভিজিটের পর রিভিউ দেন। এডমিন হিসেবে আপনি সরাসরি মডারেশন পরিচালনা করতে পারেন অথবা টেস্ট রিভিউ দিতে পারেন।"
                      : "Verified members submit reviews after discount visits. As an admin, you can moderate reviews or post a test review."}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                <Link
                  href="/admin/reviews"
                  className={cn(
                    buttonVariants({ size: "sm" }),
                    "bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl"
                  )}
                >
                  <Settings className="h-3.5 w-3.5 mr-1" />
                  <span>{isBn ? "মডারেশন প্যানেল" : "Moderate Reviews"}</span>
                </Link>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(true)}
                  className="text-xs rounded-xl cursor-pointer"
                >
                  <MessageSquarePlus className="h-3.5 w-3.5 mr-1" />
                  <span>{isBn ? "টেস্ট রিভিউ" : "Test Review"}</span>
                </Button>
              </div>
            </div>
          )}

          {/* Case 2: Not logged in */}
          {eligibility?.reason === "NOT_LOGGED_IN" && (
            <div className="p-4 rounded-2xl border border-primary/20 bg-primary/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0 mt-0.5">
                  <LogIn className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-foreground font-heading">
                    {t("reviews.loginToReview")}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">
                    {t("reviews.loginPrompt")}
                  </p>
                </div>
              </div>
              <Link
                href={`/login?redirect=/partner-hospitals/${partner.id}`}
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-xl shrink-0 self-start sm:self-auto"
                )}
              >
                <span>{isBn ? "লগইন করুন" : "Log In"}</span>
              </Link>
            </div>
          )}

          {/* Case 3: Logged in but no transaction */}
          {eligibility?.reason === "NO_TRANSACTION" && (
            <div className="p-4 rounded-2xl border border-amber-500/25 bg-amber-500/5 flex items-start gap-3 shadow-2xs">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
                <Receipt className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs sm:text-sm font-bold text-foreground font-heading">
                  {t("reviews.transactionRequired")}
                </h4>
                <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
                  {t("reviews.transactionRequiredDesc")}
                </p>
              </div>
            </div>
          )}

          {/* Case 4: Eligible with existing review */}
          {eligibility?.hasReviewed && eligibility.existingReview && (
            <div className="p-4 rounded-2xl border border-border bg-card shadow-2xs space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-bold text-foreground font-heading">
                  <span>{isBn ? "আপনার জমাকৃত রিভিউ" : "Your Submitted Review"}</span>
                  {eligibility.existingReview.status === "pending" ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{t("reviews.pendingModeration")}</span>
                    </span>
                  ) : eligibility.existingReview.status === "approved" ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>{t("reviews.approvedStatus")}</span>
                    </span>
                  ) : null}
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsModalOpen(true)}
                  className="h-7 text-xs rounded-lg cursor-pointer"
                >
                  <span>{t("reviews.editReview")}</span>
                </Button>
              </div>

              {eligibility.existingReview.status === "pending" && (
                <p className="text-xs text-muted-foreground">
                  {t("reviews.underReviewNotice")}
                </p>
              )}

              <div className="pt-1 flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`h-3.5 w-3.5 ${
                        s <= (eligibility.existingReview?.rating || 0)
                          ? "fill-amber-400 text-amber-500"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>
                {eligibility.existingReview.comment && (
                  <span className="text-xs text-foreground/80 truncate">
                    &ldquo;{eligibility.existingReview.comment}&rdquo;
                  </span>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Filter Bar */}
      {reviews.length > 0 && (
        <div className="flex items-center justify-between gap-2 pt-2">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-muted-foreground flex items-center gap-1 text-[11px] font-semibold mr-1">
              <Filter className="h-3 w-3" />
              <span>{isBn ? "ফিল্টার:" : "Filter:"}</span>
            </span>
            <Button
              variant={selectedStarFilter === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedStarFilter(null)}
              className="h-7 text-xs rounded-full cursor-pointer px-3"
            >
              <span>{t("reviews.allRatings")}</span>
            </Button>
            {[5, 4, 3, 2, 1].map((s) => (
              <Button
                key={s}
                variant={selectedStarFilter === s ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStarFilter(selectedStarFilter === s ? null : s)}
                className="h-7 text-xs rounded-full cursor-pointer px-2.5 flex items-center gap-1"
              >
                <span>{formatNum(s, locale)}</span>
                <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
              </Button>
            ))}
          </div>

          <span className="text-[11px] text-muted-foreground shrink-0 font-mono hidden sm:inline">
            {formatNum(filteredReviews.length, locale)} / {formatNum(reviews.length, locale)}
          </span>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-3">
        {loading ? (
          <div className="space-y-3 animate-pulse">
            <Skeleton className="h-24 w-full rounded-2xl" />
            <Skeleton className="h-24 w-full rounded-2xl" />
          </div>
        ) : filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))
        ) : (
          /* Empty State */
          <div className="text-center py-8 sm:py-10 px-4 rounded-2xl border border-dashed border-border/80 bg-card/40 space-y-3">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Sparkles className="h-6 w-6" />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <h4 className="text-sm font-bold text-foreground font-heading">
                {selectedStarFilter
                  ? isBn
                    ? "এই স্টার রেটিংয়ে কোনো রিভিউ নেই"
                    : "No reviews for this star rating"
                  : isBn
                  ? "এখনও কোনো রিভিউ যুক্ত হয়নি"
                  : "No reviews yet"}
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t("reviews.noReviewsYet")}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Review Submission Dialog Modal */}
      <ReviewFormModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        partnerId={partner.id}
        partnerName={partner.name}
        existingReview={eligibility?.existingReview}
        onSuccess={handleReviewSaved}
      />
    </div>
  );
}
