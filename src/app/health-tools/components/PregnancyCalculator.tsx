"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Baby,
  Calendar,
  Sparkles,
  RotateCcw,
  AlertTriangle,
  HeartHandshake,
  Apple,
  Clock,
  ArrowRight,
  ShieldAlert,
  Stethoscope,
} from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { formatNum } from "@/lib/i18n";
import { toast } from "sonner";
import Link from "next/link";
import {
  calculateEddFromLmp,
  calculateEddFromUltrasound,
  PregnancyCalculationResult,
} from "@/data/pregnancyMilestones";
import { trackEvent } from "@/lib/analytics";

export function PregnancyCalculator() {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  const [method, setMethod] = useState<"lmp" | "ultrasound">("lmp");
  const [lmpDate, setLmpDate] = useState("");
  const [cycleLength, setCycleLength] = useState("28");

  const [scanDate, setScanDate] = useState("");
  const [scanWeeks, setScanWeeks] = useState("");
  const [scanDays, setScanDays] = useState("0");

  const [activeTab, setActiveTab] = useState<"milestone" | "nutrition" | "care" | "warnings">("milestone");
  const [result, setResult] = useState<PregnancyCalculationResult | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();

    if (method === "lmp") {
      if (!lmpDate) {
        toast.error(isEn ? "Please select your last menstrual period (LMP) date." : "অনুগ্রহ করে শেষ মাসিকের তারিখ সিলেক্ট করুন।");
        return;
      }

      const lmp = new Date(lmpDate);
      const now = new Date();
      const todayMid = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      if (lmp > todayMid) {
        toast.error(isEn ? "LMP date cannot be in the future." : "শেষ মাসিকের তারিখ ভবিষ্যতের হতে পারে না।");
        return;
      }

      const daysDiff = (todayMid.getTime() - lmp.getTime()) / (24 * 60 * 60 * 1000);
      if (daysDiff > 310) {
        toast.error(
          isEn
            ? "LMP date exceeds 44 weeks. Please verify the date."
            : "শেষ মাসিকের তারিখ ৪৪ সপ্তাহের বেশি অতীত। অনুগ্রহ করে সঠিক তারিখ দিন।"
        );
        return;
      }

      const cycle = parseInt(cycleLength, 10) || 28;
      if (cycle < 20 || cycle > 45) {
        toast.error(isEn ? "Cycle length should be between 20 and 45 days." : "মাসিক চক্র ২০ থেকে ৪৫ দিনের মধ্যে হওয়া উচিত।");
        return;
      }

      const calcResult = calculateEddFromLmp(lmp, cycle);
      setResult(calcResult);
      trackEvent("health_tool_used", {
        tool_name: "pregnancy_edd",
        result_status: `LMP_T${calcResult.trimester}`,
      });
      toast.success(isEn ? "Due date calculated successfully!" : "প্রসবের সম্ভাব্য তারিখ হিসাব সম্পন্ন হয়েছে!");
    } else {
      // Ultrasound
      if (!scanDate) {
        toast.error(isEn ? "Please select the ultrasound scan date." : "অনুগ্রহ করে আল্ট্রাসনোগ্রামের তারিখ সিলেক্ট করুন।");
        return;
      }

      const scan = new Date(scanDate);
      const now = new Date();
      const todayMid = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      if (scan > todayMid) {
        toast.error(isEn ? "Scan date cannot be in the future." : "আল্ট্রাসনোগ্রামের তারিখ ভবিষ্যতের হতে পারে না।");
        return;
      }

      const w = parseInt(scanWeeks, 10);
      const d = parseInt(scanDays, 10) || 0;

      if (isNaN(w) || w < 4 || w > 42) {
        toast.error(isEn ? "Please enter valid scan weeks (4 - 42 weeks)." : "অনুগ্রহ করে সঠিক স্ক্যান সপ্তাহ (৪-৪২ সপ্তাহ) দিন।");
        return;
      }

      if (d < 0 || d > 6) {
        toast.error(isEn ? "Days must be between 0 and 6." : "দিন ০ থেকে ৬ এর মধ্যে হতে হবে।");
        return;
      }

      const calcResult = calculateEddFromUltrasound(scan, w, d);
      setResult(calcResult);
      trackEvent("health_tool_used", {
        tool_name: "pregnancy_edd",
        result_status: `USG_T${calcResult.trimester}`,
      });
      toast.success(isEn ? "Due date calculated from ultrasound!" : "আল্ট্রাসনোগ্রাম অনুযায়ী সম্ভাব্য তারিখ হিসাব করা হয়েছে!");
    }
  };

  const handleReset = () => {
    setLmpDate("");
    setCycleLength("28");
    setScanDate("");
    setScanWeeks("");
    setScanDays("0");
    setResult(null);
  };

  const formatDisplayDate = (d: Date) => {
    return d.toLocaleDateString(isEn ? "en-US" : "bn-BD", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Input Form Card */}
      <Card className="lg:col-span-5 border border-border/80 bg-background shadow-sm rounded-3xl">
        <CardContent className="p-5 sm:p-7 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-600 dark:text-pink-400">
                <Baby className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base sm:text-lg text-secondary dark:text-white">
                  {isEn ? "Pregnancy Due Date (EDD)" : "গর্ভকালীন ইডিডি (EDD) ক্যালকুলেটর"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {isEn ? "Expected Delivery Date & Progress" : "প্রসবের সম্ভাব্য তারিখ ও সাপ্তাহিক অগ্রগতি"}
                </p>
              </div>
            </div>
          </div>

          {/* Calculation Method Toggle */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">
              {isEn ? "Calculation Method" : "হিসাবের পদ্ধতি"}
            </Label>
            <div
              role="radiogroup"
              aria-label={isEn ? "Pregnancy calculation method" : "গর্ভকালীন হিসাব পদ্ধতি"}
              className="grid grid-cols-2 bg-muted p-1 rounded-2xl text-xs font-semibold"
            >
              <button
                type="button"
                role="radio"
                aria-checked={method === "lmp"}
                onClick={() => setMethod("lmp")}
                className={`py-2 px-3 rounded-xl transition-all cursor-pointer text-center truncate ${
                  method === "lmp"
                    ? "bg-background text-foreground shadow-xs font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {isEn ? "By LMP Date" : "শেষ মাসিক (LMP)"}
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={method === "ultrasound"}
                onClick={() => setMethod("ultrasound")}
                className={`py-2 px-3 rounded-xl transition-all cursor-pointer text-center truncate ${
                  method === "ultrasound"
                    ? "bg-background text-foreground shadow-xs font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {isEn ? "By Ultrasound" : "আল্ট্রাসনোগ্রাম স্ক্যান"}
              </button>
            </div>
          </div>

          <form onSubmit={handleCalculate} className="space-y-4">
            {method === "lmp" ? (
              <>
                {/* LMP Date Input */}
                <div className="space-y-1.5">
                  <Label htmlFor="lmp-date" className="text-xs font-semibold">
                    {isEn ? "First Day of Last Period (LMP)" : "শেষ মাসিকের প্রথম দিন (LMP)"}
                  </Label>
                  <Input
                    id="lmp-date"
                    type="date"
                    value={lmpDate}
                    max={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setLmpDate(e.target.value)}
                    required
                    className="cursor-pointer"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    {isEn
                      ? "Select the date when your last menstrual cycle started."
                      : "আপনার শেষ পিরিয়ড যেদিন শুরু হয়েছিল সেই তারিখটি দিন।"}
                  </p>
                </div>

                {/* Average Cycle Length */}
                <div className="space-y-1.5">
                  <Label htmlFor="cycle-length" className="text-xs font-semibold">
                    {isEn ? "Average Menstrual Cycle (Days)" : "মাসিক চক্রের গড় স্থায়ীত্ব (দিন)"}
                  </Label>
                  <Input
                    id="cycle-length"
                    type="number"
                    min="20"
                    max="45"
                    value={cycleLength}
                    placeholder="28"
                    onChange={(e) => setCycleLength(e.target.value)}
                  />
                  <p className="text-[11px] text-muted-foreground">
                    {isEn ? "Standard normal cycle is usually 28 days." : "স্বাভাবিকভাবে মাসিক চক্র ২৮ দিনের হয়ে থাকে।"}
                  </p>
                </div>
              </>
            ) : (
              <>
                {/* Ultrasound Date */}
                <div className="space-y-1.5">
                  <Label htmlFor="scan-date" className="text-xs font-semibold">
                    {isEn ? "Date of Ultrasound Scan" : "আল্ট্রাসনোগ্রাম করার তারিখ"}
                  </Label>
                  <Input
                    id="scan-date"
                    type="date"
                    value={scanDate}
                    max={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setScanDate(e.target.value)}
                    required
                    className="cursor-pointer"
                  />
                </div>

                {/* Gestational Age at Scan */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">
                    {isEn ? "Gestational Age at Scan Time" : "স্ক্যানের সময় শিশুর বয়স (সপ্তাহ ও দিন)"}
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Input
                        id="scan-weeks"
                        aria-label={isEn ? "Gestational weeks at scan" : "স্ক্যানের সময় সপ্তাহ"}
                        type="number"
                        min="4"
                        max="42"
                        placeholder={isEn ? "Weeks (e.g. 12)" : "সপ্তাহ (যেমন: ১২)"}
                        value={scanWeeks}
                        onChange={(e) => setScanWeeks(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Input
                        id="scan-days"
                        aria-label={isEn ? "Gestational days at scan" : "স্ক্যানের সময় দিন"}
                        type="number"
                        min="0"
                        max="6"
                        placeholder={isEn ? "Days (0-6)" : "দিন (০-৬)"}
                        value={scanDays}
                        onChange={(e) => setScanDays(e.target.value)}
                      />
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    {isEn
                      ? "Found on your ultrasound report (e.g. 12w 3d / GA)."
                      : "আপনার আল্ট্রাসনোগ্রাম রিপোর্টে উল্লেখিত GA (যেমন: 12w 3d) অনুযায়ী লিখুন।"}
                  </p>
                </div>
              </>
            )}

            <div className="flex gap-2 pt-2">
              <Button type="submit" className="flex-1 font-bold bg-pink-600 hover:bg-pink-700 text-white">
                <Calendar className="mr-2 h-4 w-4" />
                {isEn ? "Calculate Due Date" : "প্রসবের তারিখ দেখুন"}
              </Button>
              {result && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  size="icon"
                  aria-label={isEn ? "Reset calculator" : "ক্যালকুলেটর রিসেট করুন"}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Result Display Card */}
      <Card className="lg:col-span-7 border border-border/80 bg-background shadow-sm rounded-3xl min-h-[460px] flex flex-col justify-between">
        <CardContent className="p-5 sm:p-7 space-y-6">
          {result ? (
            <div className="space-y-6">
              {/* Hero EDD Display */}
              <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-pink-500/10 via-purple-500/5 to-primary/10 border border-pink-500/20 text-center space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400 text-xs font-bold">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{isEn ? "Expected Delivery Date (EDD)" : "প্রসবের সম্ভাব্য তারিখ (ইডিডি)"}</span>
                </div>

                <div className="text-2xl sm:text-4xl font-extrabold text-foreground font-heading">
                  {formatDisplayDate(result.edd)}
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs">
                  <Badge variant="secondary" className="font-mono font-semibold px-3 py-1 bg-background/80">
                    <Clock className="mr-1.5 h-3.5 w-3.5 text-pink-500" />
                    {result.daysRemaining > 0
                      ? isEn
                        ? `${formatNum(result.daysRemaining, locale)} days left`
                        : `${formatNum(result.daysRemaining, locale)} দিন বাকি`
                      : isEn
                      ? "Full Term / Delivered"
                      : "পূর্ণ মেয়াদ সম্পন্ন"}
                  </Badge>
                  <Badge variant="secondary" className="font-mono font-semibold px-3 py-1 bg-background/80">
                    <Calendar className="mr-1.5 h-3.5 w-3.5 text-purple-500" />
                    {isEn ? "Conception: " : "সম্ভাব্য গর্ভধারণ: "}
                    {formatDisplayDate(result.conceptionDate)}
                  </Badge>
                </div>
              </div>

              {/* Trimester & Gestational Age Progress */}
              <div className="space-y-3 p-4 rounded-2xl bg-muted/40 border border-border/60">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <span className="text-xs text-muted-foreground font-semibold">
                      {isEn ? "Current Gestational Age:" : "গর্ভকালীন বর্তমান বয়স:"}
                    </span>
                    <div className="text-base sm:text-lg font-bold text-foreground font-mono">
                      {isEn
                        ? `${formatNum(result.weeks, locale)} Weeks ${formatNum(result.days, locale)} Days`
                        : `${formatNum(result.weeks, locale)} সপ্তাহ ${formatNum(result.days, locale)} দিন`}
                    </div>
                  </div>
                  <Badge className="self-start sm:self-center bg-pink-600 text-white font-bold text-xs px-3 py-1">
                    {result.trimester === 1 && (isEn ? "1st Trimester" : "১ম ট্রাইমেস্টার")}
                    {result.trimester === 2 && (isEn ? "2nd Trimester" : "২য় ট্রাইমেস্টার")}
                    {result.trimester === 3 && (isEn ? "3rd Trimester" : "৩য় ট্রাইমেস্টার")}
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
                      {isEn ? "1st (W 1-13)" : "১ম (১-১৩ সপ্তাহ)"}
                    </span>
                    <span className={result.trimester === 2 ? "text-pink-600 font-bold" : ""}>
                      {isEn ? "2nd (W 14-27)" : "২য় (১৪-২৭ সপ্তাহ)"}
                    </span>
                    <span className={result.trimester === 3 ? "text-pink-600 font-bold" : ""}>
                      {isEn ? "3rd (W 28-40+)" : "৩য় (২৮-৪০+ সপ্তাহ)"}
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
                    <span>{isEn ? "Baby Size Milestone" : "শিশুর বৃদ্ধি ও সাইজ"}</span>
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
                    <span>{isEn ? "Maternal Nutrition" : "মাতৃ পুষ্টি"}</span>
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
                    <span>{isEn ? "Care & Prep" : "প্রসবপূর্ব প্রস্তুতি"}</span>
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
                    <span>{isEn ? "Warning Signs" : "বিপদচিহ্ন"}</span>
                  </button>
                </div>

                {/* Tab Content 1: Baby Size Milestone */}
                {activeTab === "milestone" && (
                  <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-3 animate-in fade-in">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl sm:text-4xl">{result.milestone.iconEmoji}</span>
                      <div className="space-y-0.5">
                        <div className="text-xs text-muted-foreground font-semibold">
                          {isEn ? `Week ${formatNum(result.weeks, locale)} Comparison:` : `${formatNum(result.weeks, locale)} সপ্তাহের তুলনা:`}
                        </div>
                        <h4 className="font-bold text-sm sm:text-base text-foreground">
                          {isEn ? result.milestone.fruitEn : result.milestone.fruitBn}
                        </h4>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-background border border-border/60">
                        <span className="text-muted-foreground block text-[11px]">{isEn ? "Est. Length:" : "আনুমানিক দৈর্ঘ্য:"}</span>
                        <span className="font-bold text-foreground font-mono">{result.milestone.sizeCm}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-background border border-border/60">
                        <span className="text-muted-foreground block text-[11px]">{isEn ? "Est. Weight:" : "আনুমানিক ওজন:"}</span>
                        <span className="font-bold text-foreground font-mono">{result.milestone.weightG}</span>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {isEn ? result.milestone.developmentEn : result.milestone.developmentBn}
                    </p>
                  </div>
                )}

                {/* Tab Content 2: Maternal Nutrition */}
                {activeTab === "nutrition" && (
                  <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-2.5 animate-in fade-in">
                    <div className="font-bold text-xs sm:text-sm text-foreground flex items-center gap-2">
                      <Apple className="h-4 w-4 text-pink-600" />
                      <span>
                        {isEn ? result.trimesterInfo.titleEn : result.trimesterInfo.titleBn} - {isEn ? "Nutrition Advice" : "পুষ্টি পরামর্শ"}
                      </span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-muted-foreground">
                      {(isEn ? result.trimesterInfo.nutritionEn : result.trimesterInfo.nutritionBn).map((tip, idx) => (
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
                      <span>{isEn ? "Antenatal Care & Precautions" : "প্রসবপূর্ব যত্ন ও স্বাস্থ্য পরামর্শ"}</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-muted-foreground">
                      {(isEn ? result.trimesterInfo.careTipsEn : result.trimesterInfo.careTipsBn).map((tip, idx) => (
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
                      <span>{isEn ? "Emergency Red Flags (Consult Doctor Immediately)" : "জরুরি বিপদচিহ্ন (অবিলম্বে ডাক্তারের শরণাপন্ন হোন)"}</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-rose-700 dark:text-rose-300">
                      {(isEn ? result.trimesterInfo.warningSignsEn : result.trimesterInfo.warningSignsBn).map((warning, idx) => (
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
                      {isEn ? "Consult Gynecologists & Obstetricians" : "স্ত্রী ও প্রসূতি বিশেষজ্ঞ ডাক্তার"}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {isEn ? "View chamber schedules and serial booking in Feni" : "ফেনীর সেরা গাইনী বিশেষজ্ঞদের চেম্বার তালিকা দেখুন"}
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
                  <span>{isEn ? "Find Doctor" : "ডাক্তার খুঁজুন"}</span>
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
                  {isEn ? "Calculate Your Expected Due Date" : "আপনার প্রসবের সম্ভাব্য তারিখ জানুন"}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {isEn
                    ? "Enter your Last Menstrual Period (LMP) or Ultrasound date on the left to view your trimester milestones and baby development."
                    : "বামপাশের ফর্মে শেষ মাসিকের তারিখ (LMP) বা আল্ট্রাসনোগ্রাম তথ্য দিয়ে 'প্রসবের তারিখ দেখুন' বাটনে ক্লিক করুন।"}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
