"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Star,
  ShieldCheck,
  MessageSquarePlus,
  Filter,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toBanglaNums } from "@/lib/utils";
import { Partner, Review, PartnerReviewStats } from "@/services/db";
import {
  getPartnerReviewsAction,
  canMemberReviewPartnerAction,
} from "@/app/actions/reviewActions";
import type { ReviewEligibilityResult } from "@/app/actions/reviewHelpers";
import { ReviewCard } from "./ReviewCard";
import { ReviewFormModal } from "./ReviewFormModal";
import { ReviewEligibilityBanner } from "./ReviewEligibilityBanner";

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
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [reviews, setReviews] = useState<Review[]>(initialReviews || []);
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const [totalItems, setTotalItems] = useState(
    initialStats?.totalReviews || initialReviews?.length || 0
  );
  const [hasMore, setHasMore] = useState(
    (initialReviews?.length || 0) < (initialStats?.totalReviews || 0)
  );
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

  // Load reviews & stats with server-side pagination
  const loadReviews = useCallback(
    async (pageToLoad: number, starFilter: number | null, append: boolean = false) => {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      try {
        const res = await getPartnerReviewsAction(partner.id, {
          page: pageToLoad,
          pageSize,
          rating: starFilter,
        });

        if (res.success) {
          if (append) {
            setReviews((prev) => [...prev, ...res.reviews]);
          } else {
            setReviews(res.reviews);
          }
          setStats(res.stats);
          setPage(pageToLoad);
          setTotalItems(res.totalItems);
          setHasMore(res.hasMore);
        }
      } catch {
        // Keep existing
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [partner.id, pageSize]
  );

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
        if (!initialReviews) {
          loadReviews(1, null, false);
        }
        checkEligibility();
      }
    });
    return () => {
      isMounted = false;
    };
  }, [initialReviews, loadReviews, checkEligibility]);

  const handleStarFilterChange = (star: number | null) => {
    const newFilter = selectedStarFilter === star ? null : star;
    setSelectedStarFilter(newFilter);
    loadReviews(1, newFilter, false);
  };

  const handleLoadMore = () => {
    if (loadingMore || !hasMore) return;
    loadReviews(page + 1, selectedStarFilter, true);
  };

  const handleReviewSaved = async () => {
    await Promise.all([loadReviews(1, selectedStarFilter, false), checkEligibility()]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-black text-secondary dark:text-white font-heading tracking-tight">
              সদস্যদের রিভিউ ও রেটিং
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span>ভেরিফাইড মেম্বার রিভিউ</span>
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {partner.name}-এ চিকিৎসাসেবা ও ডিসকাউন্ট গ্রহণকারী ভেরিফাইড সদস্যদের বাস্তব অভিজ্ঞতা।
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
              {eligibility.hasReviewed ? "আপনার রিভিউ পরিবর্তন করুন" : "রিভিউ লিখুন"}
            </span>
          </Button>
        )}
      </div>

      {/* Ratings & Breakdown Scorecard */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-6 p-4 sm:p-5 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-xs shadow-2xs">
        {/* Big Score (4 cols) */}
        <div className="sm:col-span-4 flex flex-col items-center justify-center text-center p-3 rounded-xl bg-muted/40 border border-border/50">
          <span className="text-3xl sm:text-4xl font-black text-foreground font-heading tracking-tight">
            {stats.totalReviews > 0 ? toBanglaNums(stats.averageRating) : "০.০"}
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
            ৫ এর মধ্যে • {toBanglaNums(stats.totalReviews)} টি রিভিউ
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
                  onClick={() => handleStarFilterChange(star)}
                  className={`flex items-center gap-1 w-12 text-[11px] font-bold transition-colors cursor-pointer ${
                    selectedStarFilter === star ? "text-primary font-black" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span>{toBanglaNums(star)}</span>
                  <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
                </button>

                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <span className="w-8 text-right text-[11px] text-muted-foreground font-mono">
                  {toBanglaNums(count)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review Eligibility Feedback Cards */}
      <ReviewEligibilityBanner
        partner={partner}
        eligibility={eligibility}
        eligibilityLoading={eligibilityLoading}
        onOpenReviewModal={() => setIsModalOpen(true)}
      />

      {/* Filter Bar */}
      {(stats.totalReviews > 0 || reviews.length > 0) && (
        <div className="flex items-center justify-between gap-2 pt-2">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-muted-foreground flex items-center gap-1 text-[11px] font-semibold mr-1">
              <Filter className="h-3 w-3" />
              <span>ফিল্টার</span>
            </span>
            <Button
              variant={selectedStarFilter === null ? "default" : "outline"}
              size="sm"
              onClick={() => handleStarFilterChange(null)}
              className="h-7 text-xs rounded-full cursor-pointer px-3"
            >
              <span>সকল রেটিং</span>
            </Button>
            {[5, 4, 3, 2, 1].map((s) => (
              <Button
                key={s}
                variant={selectedStarFilter === s ? "default" : "outline"}
                size="sm"
                onClick={() => handleStarFilterChange(s)}
                className="h-7 text-xs rounded-full cursor-pointer px-2.5 flex items-center gap-1"
              >
                <span>{toBanglaNums(s)}</span>
                <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
              </Button>
            ))}
          </div>

          <span className="text-[11px] text-muted-foreground shrink-0 font-mono hidden sm:inline">
            {toBanglaNums(reviews.length)} / {toBanglaNums(totalItems)}
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
        ) : reviews.length > 0 ? (
          reviews.map((review) => (
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
                  ? "এই রেটিংয়ের কোনো রিভিউ নেই"
                  : "কোনো রিভিউ এখনও যোগ হয়নি"}
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                এই প্রতিষ্ঠানের কোনো রিভিউ এখনও যোগ হয়নি। আপনিই প্রথম সেবাগ্রহীতা হিসেবে আপনার অভিজ্ঞতা শেয়ার করুন!
              </p>
            </div>
          </div>
        )}

        {/* Load More Pagination Button */}
        {hasMore && !loading && (
          <div className="pt-3 flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="rounded-xl px-5 py-2 text-xs font-bold border-border/80 hover:bg-muted cursor-pointer shadow-2xs gap-1.5"
            >
              {loadingMore && <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />}
              <span>
                {loadingMore ? "লোড হচ্ছে..." : "আরও রিভিউ দেখুন"}
              </span>
              {!loadingMore && (
                <span className="text-[10px] text-muted-foreground font-mono font-normal">
                  ({toBanglaNums(reviews.length)} / {toBanglaNums(totalItems)})
                </span>
              )}
            </Button>
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
