"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Baby,
  Calendar,
  RotateCcw,
} from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { toast } from "sonner";
import {
  calculateEddFromLmp,
  calculateEddFromUltrasound,
  PregnancyCalculationResult,
} from "@/data/pregnancyMilestones";
import { trackEvent } from "@/lib/analytics";
import { PregnancyResultView } from "./PregnancyResultView";

export function PregnancyCalculator() {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  const [method, setMethod] = useState<"lmp" | "ultrasound">("lmp");
  const [lmpDate, setLmpDate] = useState("");
  const [cycleLength, setCycleLength] = useState("28");

  const [scanDate, setScanDate] = useState("");
  const [scanWeeks, setScanWeeks] = useState("");
  const [scanDays, setScanDays] = useState("0");

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

      const weeks = parseInt(scanWeeks, 10);
      const days = parseInt(scanDays, 10) || 0;

      if (isNaN(weeks) || weeks < 4 || weeks > 42) {
        toast.error(isEn ? "Please enter valid gestational weeks (4-42)." : "অনুগ্রহ করে শিশুর সঠিক গর্ভকালীন সপ্তাহ (৪-৪২) দিন।");
        return;
      }

      if (days < 0 || days > 6) {
        toast.error(isEn ? "Gestational days should be between 0 and 6." : "অতিরিক্ত দিন ০ থেকে ৬ এর মধ্যে হতে হবে।");
        return;
      }

      const calcResult = calculateEddFromUltrasound(scan, weeks, days);
      setResult(calcResult);
      trackEvent("health_tool_used", {
        tool_name: "pregnancy_edd",
        result_status: `US_T${calcResult.trimester}`,
      });
      toast.success(isEn ? "Due date calculated successfully!" : "প্রসবের সম্ভাব্য তারিখ হিসাব সম্পন্ন হয়েছে!");
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
      {/* Form Input Card */}
      <Card className="lg:col-span-5 border border-border/80 bg-background shadow-sm rounded-3xl overflow-hidden">
        <CardContent className="p-5 sm:p-7 space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-heading font-black text-secondary dark:text-white flex items-center gap-2">
              <Baby className="h-5 w-5 text-pink-600" />
              <span>{isEn ? "Pregnancy EDD Calculator" : "প্রসবের তারিখ নির্ণায়ক"}</span>
            </h3>
            <p className="text-xs text-muted-foreground">
              {isEn
                ? "Calculate your estimated due date, fetal age, and weekly milestones."
                : "শেষ মাসিকের তারিখ (LMP) অথবা আল্ট্রাসনোগ্রাম রিপোর্টের সাহায্যে প্রসবের সম্ভাব্য তারিখ ও শিশুর বিকাশ জানুন।"}
            </p>
          </div>

          {/* Method Selection (LMP vs Ultrasound) */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground">
              {isEn ? "Calculation Method:" : "হিসাবের পদ্ধতি:"}
            </Label>
            <div className="grid grid-cols-2 gap-2 bg-muted p-1 rounded-2xl">
              <button
                type="button"
                onClick={() => setMethod("lmp")}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  method === "lmp"
                    ? "bg-background text-pink-600 shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {isEn ? "By Period (LMP)" : "শেষ পিরিয়ড (LMP)"}
              </button>
              <button
                type="button"
                onClick={() => setMethod("ultrasound")}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  method === "ultrasound"
                    ? "bg-background text-pink-600 shadow-sm"
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
      <PregnancyResultView result={result} locale={locale} />
    </div>
  );
}
