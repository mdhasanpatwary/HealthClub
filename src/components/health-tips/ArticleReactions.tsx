"use client";

import { useState, useSyncExternalStore } from "react";
import { ThumbsUp, ThumbsDown, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { toBanglaNums } from "@/lib/utils";
import { submitArticleReactionAction } from "@/app/actions/healthTipsAdminActions";

interface ArticleReactionsProps {
  slug: string;
  initialHelpful?: number;
  initialNotHelpful?: number;
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("hc-reaction-change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("hc-reaction-change", callback);
  };
}

function getServerSnapshot() {
  return "";
}

export function ArticleReactions({
  slug,
  initialHelpful = 0,
  initialNotHelpful = 0,
}: ArticleReactionsProps) {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  const [helpfulCount, setHelpfulCount] = useState<number>(initialHelpful);
  const [notHelpfulCount, setNotHelpfulCount] = useState<number>(initialNotHelpful);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const storedReaction = useSyncExternalStore(
    subscribe,
    () => {
      try {
        return localStorage.getItem(`hc_reaction_${slug}`) || "";
      } catch {
        return "";
      }
    },
    getServerSnapshot
  );

  const userReaction =
    storedReaction === "helpful" || storedReaction === "not_helpful"
      ? (storedReaction as "helpful" | "not_helpful")
      : null;

  const totalVotes = helpfulCount + notHelpfulCount;
  const helpfulPercentage =
    totalVotes > 0 ? Math.round((helpfulCount / totalVotes) * 100) : 0;

  const handleVote = async (reaction: "helpful" | "not_helpful") => {
    if (isSubmitting) return;

    // If user clicked the same button they already voted for
    if (userReaction === reaction) {
      toast.info(
        isEn
          ? "You have already recorded this feedback."
          : "আপনি ইতিমধ্যে এই মতামতটি জানিয়েছেন।"
      );
      return;
    }

    const previous = userReaction;

    // Optimistic state updates
    if (reaction === "helpful") {
      setHelpfulCount((prev) => prev + 1);
      if (previous === "not_helpful") {
        setNotHelpfulCount((prev) => Math.max(0, prev - 1));
      }
    } else {
      setNotHelpfulCount((prev) => prev + 1);
      if (previous === "helpful") {
        setHelpfulCount((prev) => Math.max(0, prev - 1));
      }
    }

    try {
      localStorage.setItem(`hc_reaction_${slug}`, reaction);
      window.dispatchEvent(new Event("hc-reaction-change"));
    } catch {
      // Storage unavailable
    }

    setIsSubmitting(true);

    try {
      const res = await submitArticleReactionAction(slug, reaction, previous);
      if (res.success && res.stats) {
        setHelpfulCount(res.stats.helpful);
        setNotHelpfulCount(res.stats.notHelpful);
        toast.success(
          isEn
            ? "Thank you for your valuable feedback!"
            : "আপনার মূল্যবান মতামতের জন্য আন্তরিক ধন্যবাদ!"
        );
      } else {
        // Rollback
        try {
          if (previous) {
            localStorage.setItem(`hc_reaction_${slug}`, previous);
          } else {
            localStorage.removeItem(`hc_reaction_${slug}`);
          }
          window.dispatchEvent(new Event("hc-reaction-change"));
        } catch {}
        toast.error(
          isEn
            ? "Could not record feedback. Please try again."
            : "মতামত সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।"
        );
      }
    } catch {
      // Rollback
      try {
        if (previous) {
          localStorage.setItem(`hc_reaction_${slug}`, previous);
        } else {
          localStorage.removeItem(`hc_reaction_${slug}`);
        }
        window.dispatchEvent(new Event("hc-reaction-change"));
      } catch {}
      toast.error(
        isEn
          ? "Network error. Please try again."
          : "নেটওয়ার্ক ত্রুটি। আবার চেষ্টা করুন।"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const formattedHelpful = isEn ? helpfulCount : toBanglaNums(helpfulCount);
  const formattedNotHelpful = isEn ? notHelpfulCount : toBanglaNums(notHelpfulCount);
  const formattedTotal = isEn ? totalVotes : toBanglaNums(totalVotes);
  const formattedPercentage = isEn
    ? helpfulPercentage
    : toBanglaNums(helpfulPercentage);

  return (
    <Card className="border border-border/70 bg-gradient-to-br from-card via-card to-muted/20 shadow-xs rounded-3xl overflow-hidden">
      <CardContent className="p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Header & Prompt */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Sparkles className="h-3.5 w-3.5" />
              </span>
              <h4 className="font-heading font-bold text-sm sm:text-base text-secondary dark:text-white">
                {isEn
                  ? "Was this article helpful?"
                  : "এই স্বাস্থ্য পরামর্শটি কি আপনার উপকারে এসেছে?"}
              </h4>
            </div>
            <p className="text-xs text-muted-foreground">
              {isEn
                ? "Your feedback helps our doctors and editorial team improve health guides."
                : "আপনার মতামত আমাদের চিকিৎসকদের গাইড ও কনটেন্টের মান আরো সমৃদ্ধ করতে সহায়তা করে।"}
            </p>
          </div>

          {/* Satisfaction summary badge if votes exist */}
          {totalVotes > 0 && (
            <Badge
              variant="outline"
              className="self-start sm:self-auto bg-primary/5 text-primary border-primary/20 text-xs py-1 px-3 font-semibold rounded-full shrink-0"
            >
              {isEn
                ? `${formattedPercentage}% found this helpful (${formattedTotal})`
                : `${formattedPercentage}% পাঠকদের কাছে সহায়ক (${formattedTotal}টি ভোট)`}
            </Badge>
          )}
        </div>

        {/* Reaction Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          {/* Helpful Button */}
          <Button
            type="button"
            variant="outline"
            size="default"
            disabled={isSubmitting}
            onClick={() => handleVote("helpful")}
            className={`flex-1 sm:flex-initial h-11 px-5 rounded-2xl text-xs sm:text-sm font-bold gap-2.5 transition-all cursor-pointer shadow-2xs ${
              userReaction === "helpful"
                ? "bg-primary text-white border-primary hover:bg-primary/90 hover:text-white ring-2 ring-primary/20"
                : "bg-background hover:bg-primary/10 hover:text-primary hover:border-primary/40 border-border text-foreground"
            }`}
          >
            {userReaction === "helpful" ? (
              <Check className="h-4 w-4" />
            ) : (
              <ThumbsUp className="h-4 w-4 text-primary" />
            )}
            <span>{isEn ? "Yes, Helpful" : "হ্যাঁ, তথ্যটি সহায়ক"}</span>
            <span
              className={`text-[11px] px-2 py-0.5 rounded-full font-extrabold ${
                userReaction === "helpful"
                  ? "bg-white/20 text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {formattedHelpful}
            </span>
          </Button>

          {/* Not Really Button */}
          <Button
            type="button"
            variant="outline"
            size="default"
            disabled={isSubmitting}
            onClick={() => handleVote("not_helpful")}
            className={`flex-1 sm:flex-initial h-11 px-5 rounded-2xl text-xs sm:text-sm font-bold gap-2.5 transition-all cursor-pointer shadow-2xs ${
              userReaction === "not_helpful"
                ? "bg-amber-600 text-white border-amber-600 hover:bg-amber-700 hover:text-white ring-2 ring-amber-600/20"
                : "bg-background hover:bg-amber-50 dark:hover:bg-amber-950/40 hover:text-amber-600 hover:border-amber-500/40 border-border text-foreground"
            }`}
          >
            {userReaction === "not_helpful" ? (
              <Check className="h-4 w-4" />
            ) : (
              <ThumbsDown className="h-4 w-4 text-muted-foreground" />
            )}
            <span>{isEn ? "Not really" : "না, তেমন নয়"}</span>
            <span
              className={`text-[11px] px-2 py-0.5 rounded-full font-extrabold ${
                userReaction === "not_helpful"
                  ? "bg-white/20 text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {formattedNotHelpful}
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
