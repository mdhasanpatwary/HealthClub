"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Baby,
  Calendar,
  Sparkles,
  RotateCcw,
  Clock,
  ArrowRight,
  Stethoscope,
  Info,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { toBanglaNums } from "@/lib/utils";
import {
  calculateEddFromLmp,
  PregnancyCalculationResult,
} from "@/data/pregnancyMilestones";
import { trackEvent } from "@/lib/analytics";

function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function getTodayLocalDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDisplayDate(date: Date): string {
  return date.toLocaleDateString("bn-BD", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getDateNDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function PregnancyDueDateTool() {
  const [lmpDate, setLmpDate] = useState("");
  const [cycleLength, setCycleLength] = useState("28");
  const [result, setResult] = useState<PregnancyCalculationResult | null>(null);

  const handleCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!lmpDate) {
      toast.error("অনুগ্রহ করে শেষ মাসিকের তারিখ (LMP) নির্বাচন করুন।");
      return;
    }

    const lmp = parseLocalDate(lmpDate);
    const now = new Date();
    const todayMid = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (lmp > todayMid) {
      toast.error("শেষ মাসিকের তারিখ ভবিষ্যতের হতে পারে না।");
      return;
    }

    const daysDiff = (todayMid.getTime() - lmp.getTime()) / (24 * 60 * 60 * 1000);
    if (daysDiff > 310) {
      toast.error("শেষ মাসিকের তারিখ ৪৪ সপ্তাহের বেশি অতীত। অনুগ্রহ করে সঠিক তারিখ দিন।");
      return;
    }

    const cycle = parseInt(cycleLength, 10) || 28;
    if (cycle < 20 || cycle > 45) {
      toast.error("মাসিক চক্র সাধারণত ২০ থেকে ৪৫ দিনের মধ্যে হয়ে থাকে।");
      return;
    }

    const calcResult = calculateEddFromLmp(lmp, cycle);
    setResult(calcResult);

    trackEvent("health_tool_used", {
      tool_name: "pregnancy_edd",
      result_status: `LMP_T${calcResult.trimester}`,
    });

    toast.success("প্রসবের সম্ভাব্য তারিখ হিসাব সম্পন্ন হয়েছে!");
  };

  const handlePreset = (daysAgo: number) => {
    const presetDate = getDateNDaysAgo(daysAgo);
    setLmpDate(presetDate);
    const lmp = parseLocalDate(presetDate);
    const calcResult = calculateEddFromLmp(lmp, 28);
    setResult(calcResult);
    trackEvent("health_tool_used", {
      tool_name: "pregnancy_edd",
      result_status: `Preset_T${calcResult.trimester}`,
    });
  };

  const handleReset = () => {
    setLmpDate("");
    setCycleLength("28");
    setResult(null);
  };

  return (
    <Card className="border border-pink-500/20 bg-gradient-to-b from-pink-500/5 via-background to-background shadow-xs rounded-3xl overflow-hidden">
      <CardContent className="p-5 sm:p-7 space-y-6">
        {/* Header Title */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400 text-xs font-bold">
              <Baby className="h-3.5 w-3.5" />
              <span>ইন্টারেক্টিভ গর্ভাবস্থা টুল • Naegele&apos;s Rule</span>
            </div>
            <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground">
              সম্ভাব্য প্রসবের তারিখ (EDD) ও ট্রাইমেস্টার ক্যালকুলেটর
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              শেষ মাসিকের প্রথম দিন (LMP) দিয়ে আপনার গর্ভধারণ সপ্তাহ ও গুরুত্বপূর্ণ স্ক্যানের সময় জানুন।
            </p>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleCalculate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="embed-lmp-date" className="text-xs sm:text-sm font-semibold text-foreground flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-pink-500" />
                <span>শেষ মাসিকের তারিখ (LMP)</span>
              </Label>
              <Input
                id="embed-lmp-date"
                type="date"
                value={lmpDate}
                max={getTodayLocalDateString()}
                onChange={(e) => setLmpDate(e.target.value)}
                className="rounded-xl h-11 bg-background text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="embed-cycle-length" className="text-xs sm:text-sm font-semibold text-foreground flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-purple-500" />
                <span>মাসিক চক্রের গড় দিন (Cycle Length)</span>
              </Label>
              <select
                id="embed-cycle-length"
                value={cycleLength}
                onChange={(e) => setCycleLength(e.target.value)}
                className="w-full h-11 px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {[24, 25, 26, 27, 28, 29, 30, 31, 32, 35].map((d) => (
                  <option key={d} value={d}>
                    {toBanglaNums(d)} দিন {d === 28 ? "(স্বাভাবিক গড়)" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
              <Info className="h-3 w-3" />
              দ্রুত পরীক্ষার জন্য উদাহরণ নির্বাচন করুন:
            </span>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handlePreset(56)}
                className="text-xs h-7 rounded-lg border-pink-500/30 hover:bg-pink-500/10"
              >
                ৮ সপ্তাহ (১ম ট্রাইমেস্টার)
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handlePreset(140)}
                className="text-xs h-7 rounded-lg border-purple-500/30 hover:bg-purple-500/10"
              >
                ২০ সপ্তাহ (অ্যানোমালি স্ক্যান উইন্ডো)
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handlePreset(231)}
                className="text-xs h-7 rounded-lg border-primary/30 hover:bg-primary/10"
              >
                ৩৩ সপ্তাহ (৩য় ট্রাইমেস্টার)
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              type="submit"
              className="flex-1 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold h-11 shadow-xs"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              হিসাব করুন
            </Button>
            {result && (
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="rounded-xl h-11 px-4 text-xs font-semibold"
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                রিসেট
              </Button>
            )}
          </div>
        </form>

        {/* Calculation Result */}
        {result && (
          <div className="pt-4 border-t border-border/80 space-y-4">
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-pink-500/10 via-purple-500/5 to-primary/10 border border-pink-500/20 text-center space-y-2">
              <span className="text-xs font-bold text-pink-600 dark:text-pink-400 block">
                সম্ভাব্য প্রসবের তারিখ (Estimated Due Date - EDD)
              </span>
              <div className="text-xl sm:text-3xl font-extrabold text-foreground font-heading">
                {formatDisplayDate(result.edd)}
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs">
                <Badge variant="secondary" className="font-semibold bg-background/80">
                  <Clock className="mr-1 h-3 w-3 text-pink-500" />
                  {result.daysRemaining > 0
                    ? `${toBanglaNums(result.daysRemaining)} দিন বাকি`
                    : "পূর্ণ মেয়াদ সম্পন্ন"}
                </Badge>
                <Badge variant="secondary" className="font-semibold bg-background/80">
                  বর্তমান বয়স: {toBanglaNums(result.weeks)} সপ্তাহ {toBanglaNums(result.days)} দিন
                </Badge>
                <Badge
                  className={
                    result.trimester === 1
                      ? "bg-amber-500 text-white"
                      : result.trimester === 2
                      ? "bg-purple-600 text-white"
                      : "bg-pink-600 text-white"
                  }
                >
                  {result.trimester === 1
                    ? "১ম ট্রাইমেস্টার (১-১৩ সপ্তাহ)"
                    : result.trimester === 2
                    ? "২য় ট্রাইমেস্টার (১৪-২৭ সপ্তাহ)"
                    : "৩য় ট্রাইমেস্টার (২৮-৪০ সপ্তাহ)"}
                </Badge>
              </div>
            </div>

            {/* Baby Milestone & Size Highlight */}
            {result.milestone && (
              <div className="p-4 rounded-2xl bg-card border border-border/70 flex items-start gap-3">
                <span className="text-2xl p-2 rounded-xl bg-pink-500/10 shrink-0">
                  {result.milestone.iconEmoji}
                </span>
                <div className="space-y-1 text-xs sm:text-sm">
                  <div className="font-bold text-foreground flex items-center gap-2">
                    <span>শিশুর বর্তমান আকার: {result.milestone.fruitBn}</span>
                    <span className="text-[11px] font-normal text-muted-foreground">
                      (দৈর্ঘ্য: {result.milestone.sizeCm}, ওজন: {result.milestone.weightG})
                    </span>
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {result.milestone.developmentBn}
                  </p>
                </div>
              </div>
            )}

            {/* Recommended Scan Window Clinical Alert */}
            <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 text-xs text-foreground space-y-1">
              <div className="font-bold text-primary flex items-center gap-1.5">
                <Stethoscope className="h-3.5 w-3.5" />
                <span>ক্লিনিক্যাল সোনোলজি ও চেকআপ পরামর্শ</span>
              </div>
              <p className="text-muted-foreground text-[11px] sm:text-xs leading-relaxed">
                {result.weeks < 14
                  ? "গর্ভধারণের প্রথম ট্রাইমেস্টারে ডেটিং আল্ট্রাসনো ও ফলিক এসিড নিশ্চিত করুন।"
                  : result.weeks >= 18 && result.weeks <= 22
                  ? "১৮ থেকে ২২ সপ্তাহ হলো ৪ডি অ্যানোমালি স্ক্যান (Anomaly Scan) করার সুবর্ণ সময় (Golden Window)। জন্মগত ত্রুটি নির্ণয়ে অভিজ্ঞ সনোলজিস্টের অ্যাপয়েন্টমেন্ট নিন।"
                  : result.weeks >= 28
                  ? "তৃতীয় ট্রাইমেস্টারে ফিটাল গ্রোথ আল্ট্রাসাউন্ড, কালার ডপলার ও প্রসবের প্রস্তুতি পরিকল্পনা চূড়ান্ত করুন।"
                  : "নিয়মিত এন্টিনেটাল চেকআপ (ANC), রক্তচাপ ও ব্লাড সুগার পরীক্ষা বজায় রাখুন।"}
              </p>
            </div>

            {/* Link to Full Health Tool */}
            <div className="pt-1 flex items-center justify-between gap-3 text-xs">
              <span className="text-muted-foreground hidden sm:inline">
                সাপ্তাহিক ডায়েট ও বিস্তারিত আল্ট্রাসনো ক্যালেন্ডার চান?
              </span>
              <Link
                href="/health-tools?tab=pregnancy"
                className="text-pink-600 dark:text-pink-400 font-bold hover:underline inline-flex items-center gap-1 ml-auto"
              >
                <span>সম্পূর্ণ প্রেগন্যান্সি ক্যালকুলেটরে যান</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
