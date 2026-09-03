"use client";

import Link from "next/link";
import {
  LogIn,
  Receipt,
  Clock,
  CheckCircle2,
  ShieldAlert,
  Settings,
  MessageSquarePlus,
  Star,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/layout/LanguageProvider";
import type { Partner } from "@/services/db";
import type { ReviewEligibilityResult } from "@/app/actions/reviewHelpers";

interface ReviewEligibilityBannerProps {
  partner: Partner;
  eligibility: ReviewEligibilityResult | null;
  eligibilityLoading: boolean;
  onOpenReviewModal: () => void;
}

export function ReviewEligibilityBanner({
  partner,
  eligibility,
  eligibilityLoading,
  onOpenReviewModal,
}: ReviewEligibilityBannerProps) {
  const { t } = useLanguage();

  if (eligibilityLoading || !eligibility) return null;

  return (
    <>
      {/* Case 1: Logged in as Admin */}
      {eligibility.reason === "LOGGED_IN_AS_ADMIN" && (
        <div className="p-4 rounded-2xl border border-indigo-500/30 bg-indigo-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5">
              <ShieldAlert className="h-4 w-4" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h4 className="text-xs sm:text-sm font-bold text-foreground font-heading">
                  {t("reviews.adminBanner")}
                </h4>
                <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                  {t("reviews.adminSession")}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
                {t("reviews.adminSessionDesc")}
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
              <span>{t("reviews.moderateBtn")}</span>
            </Link>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onOpenReviewModal}
              className="text-xs rounded-xl cursor-pointer"
            >
              <MessageSquarePlus className="h-3.5 w-3.5 mr-1" />
              <span>{t("reviews.testReviewBtn")}</span>
            </Button>
          </div>
        </div>
      )}

      {/* Case 2: Not logged in */}
      {eligibility.reason === "NOT_LOGGED_IN" && (
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
            <span>{t("reviews.loginBtn")}</span>
          </Link>
        </div>
      )}

      {/* Case 3: Logged in but no transaction */}
      {eligibility.reason === "NO_TRANSACTION" && (
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
      {eligibility.hasReviewed && eligibility.existingReview && (
        <div className="p-4 rounded-2xl border border-border bg-card shadow-2xs space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-foreground font-heading">
              <span>{t("reviews.yourSubmittedReview")}</span>
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
              onClick={onOpenReviewModal}
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
  );
}
