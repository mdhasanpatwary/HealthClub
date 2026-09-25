"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Baby,
  Calendar,
  Sparkles,
  AlertTriangle,
  HeartHandshake,
  Apple,
  Clock,
  ArrowRight,
  ShieldAlert,
  Stethoscope,
} from "lucide-react";
import Link from "next/link";
import { toBanglaNums } from "@/lib/utils";
import { PregnancyCalculationResult } from "@/data/pregnancyMilestones";

interface PregnancyResultViewProps {
  result: PregnancyCalculationResult | null;
}

export function PregnancyResultView({ result }: PregnancyResultViewProps) {
  const [activeTab, setActiveTab] = useState<"milestone" | "nutrition" | "care" | "warnings">("milestone");

  const formatDisplayDate = (date: Date) => {
    return date.toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card className="lg:col-span-7 border border-border/80 bg-background shadow-sm rounded-3xl min-h-[460px] flex flex-col justify-between">
      <CardContent className="p-5 sm:p-7 space-y-6">
        {result ? (
          <div className="space-y-6">
            {/* Hero EDD Display */}
            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-pink-500/10 via-purple-500/5 to-primary/10 border border-pink-500/20 text-center space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400 text-xs font-bold">
                <Sparkles className="h-3.5 w-3.5" />
                <span>প্রসবের সম্ভাব্য তারিখ (ইডিডি)</span>
              </div>

              <div className="text-2xl sm:text-4xl font-extrabold text-foreground font-heading">
                {formatDisplayDate(result.edd)}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs">
                <Badge variant="secondary" className="font-mono font-semibold px-3 py-1 bg-background/80">
                  <Clock className="mr-1.5 h-3.5 w-3.5 text-pink-500" />
                  {result.daysRemaining > 0
                    ? `${toBanglaNums(result.daysRemaining)} দিন বাকি`
                    : "পূর্ণ মেয়াদ সম্পন্ন"}
                </Badge>
                <Badge variant="secondary" className="font-mono font-semibold px-3 py-1 bg-background/80">
                  <Calendar className="mr-1.5 h-3.5 w-3.5 text-purple-500" />
                  সম্ভাব্য গর্ভধারণ: {formatDisplayDate(result.conceptionDate)}
                </Badge>
              </div>
            </div>

            {/* Trimester & Gestational Age Progress */}
            <div className="space-y-3 p-4 rounded-2xl bg-muted/40 border border-border/60">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <span className="text-xs text-muted-foreground font-semibold">
                    গর্ভকালীন বর্তমান বয়স:
                  </span>
                  <div className="text-base sm:text-lg font-bold text-foreground font-mono">
                    {toBanglaNums(result.weeks)} সপ্তাহ {toBanglaNums(result.days)} দিন
                  </div>
                </div>
                <Badge className="self-start sm:self-center bg-pink-600 text-white font-bold text-xs px-3 py-1">
                  {result.trimester === 1 && "১ম ট্রাইমেস্টার"}
                  {result.trimester === 2 && "২য় ট্রাইমেস্টার"}
                  {result.trimester === 3 && "৩য় ট্রাইমেস্টার"}
                </Badge>
              </div>

              {/* Progress Visualizer */}
              <div className="space-y-1.5 pt-1">
                <div className="h-3 w-full rounded-full bg-muted overflow-hidden relative flex">
                  <div
                    className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-primary transition-all duration-500"
                    style={{ width: `${result.progressPercentage}%` }}
                  />
                </div>
                <div className="grid grid-cols-3 text-[10px] text-muted-foreground font-semibold text-center pt-0.5">
                  <span className={result.trimester === 1 ? "text-pink-600 font-bold" : ""}>
                    ১ম (১-১৩ সপ্তাহ)
                  </span>
                  <span className={result.trimester === 2 ? "text-pink-600 font-bold" : ""}>
                    ২য় (১৪-২৭ সপ্তাহ)
                  </span>
                  <span className={result.trimester === 3 ? "text-pink-600 font-bold" : ""}>
                    ৩য় (২৮-৪০+ সপ্তাহ)
                  </span>
                </div>
              </div>
            </div>

            {/* Sub-tabs for Milestones, Nutrition, Care, Warnings */}
            <div className="space-y-4">
              <div className="flex border-b border-border/80 gap-1 overflow-x-auto pb-1 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveTab("milestone")}
                  className={`px-3 py-1.5 rounded-lg transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    activeTab === "milestone"
                      ? "bg-pink-500/10 text-pink-600 font-bold border border-pink-500/20"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Apple className="h-3.5 w-3.5" />
                  <span>শিশুর বৃদ্ধি ও সাইজ</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("nutrition")}
                  className={`px-3 py-1.5 rounded-lg transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    activeTab === "nutrition"
                      ? "bg-pink-500/10 text-pink-600 font-bold border border-pink-500/20"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>মাতৃ পুষ্টি</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("care")}
                  className={`px-3 py-1.5 rounded-lg transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    activeTab === "care"
                      ? "bg-pink-500/10 text-pink-600 font-bold border border-pink-500/20"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <HeartHandshake className="h-3.5 w-3.5" />
                  <span>প্রসবপূর্ব প্রস্তুতি</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("warnings")}
                  className={`px-3 py-1.5 rounded-lg transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    activeTab === "warnings"
                      ? "bg-rose-500/10 text-rose-600 font-bold border border-rose-500/20"
                      : "text-muted-foreground hover:text-rose-600"
                  }`}
                >
                  <ShieldAlert className="h-3.5 w-3.5" />
                  <span>বিপদচিহ্ন</span>
                </button>
              </div>

              {/* Tab Content 1: Baby Size Milestone */}
              {activeTab === "milestone" && (
                <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-3 animate-in fade-in">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl sm:text-4xl">{result.milestone.iconEmoji}</span>
                    <div className="space-y-0.5">
                      <div className="text-xs text-muted-foreground font-semibold">
                        {toBanglaNums(result.weeks)} সপ্তাহের তুলনা:
                      </div>
                      <h4 className="font-bold text-sm sm:text-base text-foreground">
                        {result.milestone.fruitBn}
                      </h4>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-background border border-border/60">
                      <span className="text-muted-foreground block text-[11px]">আনুমানিক দৈর্ঘ্য:</span>
                      <span className="font-bold text-foreground font-mono">{toBanglaNums(result.milestone.sizeCm)}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-background border border-border/60">
                      <span className="text-muted-foreground block text-[11px]">আনুমানিক ওজন:</span>
                      <span className="font-bold text-foreground font-mono">{toBanglaNums(result.milestone.weightG)}</span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {result.milestone.developmentBn}
                  </p>
                </div>
              )}

              {/* Tab Content 2: Maternal Nutrition */}
              {activeTab === "nutrition" && (
                <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-2.5 animate-in fade-in">
                  <div className="font-bold text-xs sm:text-sm text-foreground flex items-center gap-2">
                    <Apple className="h-4 w-4 text-pink-600" />
                    <span>
                      {result.trimesterInfo.titleBn} - পুষ্টি পরামর্শ
                    </span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-muted-foreground">
                    {result.trimesterInfo.nutritionBn.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-pink-500 font-bold">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tab Content 3: Care & Prep */}
              {activeTab === "care" && (
                <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-2.5 animate-in fade-in">
                  <div className="font-bold text-xs sm:text-sm text-foreground flex items-center gap-2">
                    <HeartHandshake className="h-4 w-4 text-purple-600" />
                    <span>প্রসবপূর্ব যত্ন ও স্বাস্থ্য পরামর্শ</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-muted-foreground">
                    {result.trimesterInfo.careTipsBn.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-purple-500 font-bold">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tab Content 4: Warning Signs */}
              {activeTab === "warnings" && (
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-2.5 animate-in fade-in">
                  <div className="font-bold text-xs sm:text-sm text-rose-600 dark:text-rose-400 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span>জরুরি বিপদচিহ্ন (অবিলম্বে ডাক্তারের শরণাপন্ন হোন)</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-rose-700 dark:text-rose-300">
                    {result.trimesterInfo.warningSignsBn.map((warning, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="font-bold">⚠️</span>
                        <span>{warning}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Gynecologist Recommendation CTA */}
            <div className="p-3.5 rounded-2xl bg-primary/10 border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-primary text-white flex items-center justify-center shrink-0">
                  <Stethoscope className="h-4 w-4" />
                </div>
                <div>
                  <span className="font-bold text-foreground block">
                    স্ত্রী ও প্রসূতি বিশেষজ্ঞ ডাক্তার
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    ফেনীর সেরা গাইনী বিশেষজ্ঞদের চেম্বার তালিকা দেখুন
                  </span>
                </div>
              </div>
              <Link
                href="/consultants"
                className={buttonVariants({
                  size: "sm",
                  variant: "default",
                  className: "w-full sm:w-auto font-bold text-xs shrink-0",
                })}
              >
                <span>ডাক্তার খুঁজুন</span>
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-14 space-y-3">
            <div className="h-16 w-16 rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center mx-auto">
              <Baby className="h-8 w-8" />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <h4 className="font-heading font-bold text-base text-secondary dark:text-white">
                আপনার প্রসবের সম্ভাব্য তারিখ জানুন
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                বামপাশের ফর্মে শেষ মাসিকের তারিখ (LMP) বা আল্ট্রাসনোগ্রাম তথ্য দিয়ে &apos;প্রসবের তারিখ দেখুন&apos; বাটনে ক্লিক করুন।
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
