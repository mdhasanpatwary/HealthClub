"use client";

import { useState } from "react";
import { z } from "zod";
import { Star, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { submitReviewAction } from "@/app/actions/reviewActions";
import { Review } from "@/services/db";

const formSchema = z.object({
  rating: z.number().int().min(1, "অনুগ্রহ করে কমপক্ষে ১টি স্টার রেটিং নির্বাচন করুন").max(5),
  comment: z
    .string()
    .max(1000, "মন্তব্য সর্বোচ্চ ১০০০ অক্ষরের মধ্যে হতে হবে")
    .optional(),
});

interface ReviewFormProps {
  partnerId: string;
  partnerName: string;
  existingReview?: Review | null;
  onSuccess: () => void;
  onCancel?: () => void;
}

export function ReviewForm({
  partnerId,
  partnerName,
  existingReview,
  onSuccess,
  onCancel,
}: ReviewFormProps) {
  const { t, locale } = useLanguage();
  const isBn = locale === "bn";

  const [rating, setRating] = useState<number>(existingReview?.rating || 5);
  const [comment, setComment] = useState<string>(existingReview?.comment || "");
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [errors, setErrors] = useState<{ rating?: string; comment?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = formSchema.safeParse({ rating, comment: comment.trim() || undefined });
    if (!validation.success) {
      const fieldErrors: { rating?: string; comment?: string } = {};
      for (const err of validation.error.issues) {
        if (err.path[0] === "rating") fieldErrors.rating = err.message;
        if (err.path[0] === "comment") fieldErrors.comment = err.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitReviewAction({
        partnerId,
        rating,
        comment: comment.trim() || undefined,
      });

      if (res.success) {
        toast.success(
          res.message ||
            (isBn
              ? "আপনার রিভিউ জমা হয়েছে। এডমিন অনুমোদনের পর প্রদর্শিত হবে।"
              : "Review submitted! It will appear once approved by admin.")
        );
        onSuccess();
      } else {
        toast.error(res.message || (isBn ? "রিভিউ জমা দিতে ব্যর্থ হয়েছে।" : "Failed to submit review."));
      }
    } catch {
      toast.error(isBn ? "সার্ভারে সমস্যা হয়েছে। আবার চেষ্টা করুন।" : "Server error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingLabel = (stars: number) => {
    switch (stars) {
      case 5:
        return isBn ? "অসাধারণ (Excellent)" : "Excellent (5 Stars)";
      case 4:
        return isBn ? "খুব ভালো (Very Good)" : "Very Good (4 Stars)";
      case 3:
        return isBn ? "ভালো (Good)" : "Good (3 Stars)";
      case 2:
        return isBn ? "চলনসই (Fair)" : "Fair (2 Stars)";
      case 1:
        return isBn ? "অসন্তোষজনক (Poor)" : "Poor (1 Star)";
      default:
        return "";
    }
  };

  const currentDisplayRating = hoveredStar ?? rating;

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 sm:p-6 rounded-2xl border border-primary/20 bg-primary/5 dark:bg-primary/10 shadow-sm space-y-4"
    >
      {/* Header */}
      <div className="space-y-1">
        <h3 className="text-base font-bold text-foreground font-heading flex items-center gap-2">
          <span>{existingReview ? t("reviews.editReview") : t("reviews.writeReview")}</span>
          <span className="text-xs font-normal text-muted-foreground">({partnerName})</span>
        </h3>
        <p className="text-xs text-muted-foreground">
          {isBn
            ? "আপনার সৎ অভিজ্ঞতা অন্য সদস্যদের সঠিক হাসপাতাল ও সেবা বেছে নিতে সাহায্য করবে।"
            : "Your authentic feedback helps fellow members make informed healthcare choices."}
        </p>
      </div>

      {/* Star Selector */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-foreground block">
          {t("reviews.ratingLabel")} <span className="text-destructive">*</span>
        </label>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {[1, 2, 3, 4, 5].map((star) => {
            const isFilled = star <= currentDisplayRating;
            return (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(null)}
                onClick={() => {
                  setRating(star);
                  setErrors((prev) => ({ ...prev, rating: undefined }));
                }}
                className="p-1 sm:p-1.5 rounded-xl hover:bg-amber-500/15 transition-transform active:scale-90 focus:outline-none cursor-pointer"
                aria-label={`Rate ${star} star`}
              >
                <Star
                  className={`h-6 w-6 sm:h-7 sm:w-7 transition-all duration-150 ${
                    isFilled
                      ? "fill-amber-400 text-amber-500 scale-110 drop-shadow-xs"
                      : "text-muted-foreground/40 hover:text-amber-400"
                  }`}
                />
              </button>
            );
          })}

          <span className="ml-2 text-xs font-bold text-amber-600 dark:text-amber-400 font-heading">
            {getRatingLabel(currentDisplayRating)}
          </span>
        </div>

        {errors.rating && (
          <p className="text-xs text-destructive flex items-center gap-1 mt-1">
            <AlertCircle className="h-3 w-3" />
            <span>{errors.rating}</span>
          </p>
        )}
      </div>

      {/* Comment Textarea */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-foreground">
            {t("reviews.commentLabel")}
          </label>
          <span className="text-[11px] text-muted-foreground font-mono">
            {comment.length} / 1000
          </span>
        </div>

        <Textarea
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
            setErrors((prev) => ({ ...prev, comment: undefined }));
          }}
          placeholder={t("reviews.commentPlaceholder")}
          rows={3}
          className="bg-background text-xs sm:text-sm rounded-xl resize-none"
        />

        {errors.comment && (
          <p className="text-xs text-destructive flex items-center gap-1 mt-1">
            <AlertCircle className="h-3 w-3" />
            <span>{errors.comment}</span>
          </p>
        )}
      </div>

      {/* Moderation Disclaimer */}
      <div className="flex items-start gap-2 text-[11px] text-muted-foreground bg-background/80 p-2.5 rounded-xl border border-border/50">
        <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
        <span>
          {isBn
            ? "সব রিভিউ এডমিন মডারেশনের মাধ্যমে ভেরিফাই করা হয়। কোনো অশালীন বা অসত্য মন্তব্য প্রকাশিত হবে না।"
            : "All reviews undergo admin moderation before publishing to maintain community trust."}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 pt-1">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            disabled={isSubmitting}
            className="text-xs rounded-xl"
          >
            {isBn ? "বাতিল" : "Cancel"}
          </Button>
        )}

        <Button
          type="submit"
          size="sm"
          disabled={isSubmitting}
          className="bg-primary hover:bg-primary-dark text-white font-bold text-xs px-5 rounded-xl cursor-pointer shadow-xs"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
              <span>{t("reviews.submitting")}</span>
            </>
          ) : (
            <span>{t("reviews.submitBtn")}</span>
          )}
        </Button>
      </div>
    </form>
  );
}
