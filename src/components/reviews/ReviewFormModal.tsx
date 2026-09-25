"use client";

import { useState } from "react";
import { z } from "zod";
import { Star, Loader2, CheckCircle2, AlertCircle, MessageSquarePlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { submitReviewAction } from "@/app/actions/reviewActions";
import { Review } from "@/services/db";

const formSchema = z.object({
  rating: z.number().int().min(1, "অনুগ্রহ করে কমপক্ষে ১টি স্টার রেটিং নির্বাচন করুন").max(5),
  comment: z
    .string()
    .max(1000, "মন্তব্য সর্বোচ্চ ১০০০ অক্ষরের মধ্যে হতে হবে")
    .optional(),
});

interface ReviewFormModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  partnerId: string;
  partnerName: string;
  existingReview?: Review | null;
  onSuccess: () => void;
}

function ReviewFormContent({
  partnerId,
  partnerName,
  existingReview,
  onSuccess,
  onClose,
}: {
  partnerId: string;
  partnerName: string;
  existingReview?: Review | null;
  onSuccess: () => void;
  onClose: () => void;
}) {
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
        if (err.path[0] === "rating") fieldErrors.rating = "অনুগ্রহ করে কমপক্ষে ১টি স্টার রেটিং নির্বাচন করুন";
        if (err.path[0] === "comment") fieldErrors.comment = "মন্তব্য সর্বোচ্চ ১০০০ অক্ষরের মধ্যে হতে হবে";
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
        toast.success(res.message || "আপনার রিভিউ জমা হয়েছে। এডমিন অনুমোদনের পর প্রদর্শিত হবে।");
        onClose();
        onSuccess();
      } else {
        toast.error(res.message || "রিভিউ জমা দিতে ব্যর্থ হয়েছে।");
      }
    } catch {
      toast.error("সার্ভারে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingLabel = (stars: number) => {
    switch (stars) {
      case 5:
        return "অসাধারণ (Excellent)";
      case 4:
        return "খুব ভালো (Very Good)";
      case 3:
        return "ভালো (Good)";
      case 2:
        return "চলনসই (Fair)";
      case 1:
        return "অসন্তোষজনক (Poor)";
      default:
        return "";
    }
  };

  const currentDisplayRating = hoveredStar ?? rating;

  return (
    <>
      <DialogHeader className="space-y-1.5 text-left pb-2 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <MessageSquarePlus className="h-4 w-4" />
          </div>
          <DialogTitle className="text-base sm:text-lg font-bold text-foreground font-heading">
            {existingReview ? "আপনার রিভিউ পরিবর্তন করুন" : "রিভিউ লিখুন"}
          </DialogTitle>
        </div>
        <DialogDescription className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">{partnerName}</span> -{" "}
          আপনার সৎ অভিজ্ঞতা অন্য সদস্যদের সঠিক হাসপাতাল ও সেবা বেছে নিতে সাহায্য করবে।
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        {/* Star Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-foreground block">
            আপনার রেটিং <span className="text-destructive">*</span>
          </label>

          <div className="p-3 rounded-2xl bg-muted/40 border border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-1 sm:gap-2">
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
                          : "text-muted-foreground/30 hover:text-amber-400"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 font-heading">
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
              চিকিৎসা সেবার অভিজ্ঞতা (ঐচ্ছিক)
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
            placeholder="ডাক্তার, নার্স, পরিবেশ ও ডিসকাউন্ট সুবিধা নিয়ে আপনার অভিজ্ঞতা শেয়ার করুন..."
            rows={4}
            className="bg-background text-xs sm:text-sm rounded-xl resize-none shadow-2xs"
          />

          {errors.comment && (
            <p className="text-xs text-destructive flex items-center gap-1 mt-1">
              <AlertCircle className="h-3 w-3" />
              <span>{errors.comment}</span>
            </p>
          )}
        </div>

        {/* Moderation Disclaimer */}
        <div className="flex items-start gap-2 text-[11px] text-muted-foreground bg-muted/40 p-2.5 rounded-xl border border-border/50">
          <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
          <span>
            সব রিভিউ এডমিন মডারেশনের মাধ্যমে ভেরিফাই করা হয়। কোনো অশালীন বা বিভ্রান্তিকর মন্তব্য প্রকাশিত হবে না।
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/40">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-xs rounded-xl"
          >
            বাতিল
          </Button>

          <Button
            type="submit"
            size="sm"
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary-dark text-white font-bold text-xs px-5 rounded-xl cursor-pointer shadow-xs"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                <span>জমা দেওয়া হচ্ছে...</span>
              </>
            ) : (
              <span>রিভিউ জমা দিন</span>
            )}
          </Button>
        </div>
      </form>
    </>
  );
}

export function ReviewFormModal({
  isOpen,
  onOpenChange,
  partnerId,
  partnerName,
  existingReview,
  onSuccess,
}: ReviewFormModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-background border-border p-4 sm:p-6 rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        {isOpen && (
          <ReviewFormContent
            key={existingReview?.id || "new-review"}
            partnerId={partnerId}
            partnerName={partnerName}
            existingReview={existingReview}
            onSuccess={onSuccess}
            onClose={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
