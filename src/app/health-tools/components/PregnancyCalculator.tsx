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
import { toast } from "sonner";
import {
  calculateEddFromLmp,
  calculateEddFromUltrasound,
  PregnancyCalculationResult,
} from "@/data/pregnancyMilestones";
import { trackEvent } from "@/lib/analytics";
import { PregnancyResultView } from "./PregnancyResultView";

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

export function PregnancyCalculator() {
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
        toast.error("অনুগ্রহ করে শেষ মাসিকের তারিখ সিলেক্ট করুন।");
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
        toast.error("মাসিক চক্র ২০ থেকে ৪৫ দিনের মধ্যে হওয়া উচিত।");
        return;
      }

      const calcResult = calculateEddFromLmp(lmp, cycle);
      setResult(calcResult);
      trackEvent("health_tool_used", {
        tool_name: "pregnancy_edd",
        result_status: `LMP_T${calcResult.trimester}`,
      });
      toast.success("প্রসবের সম্ভাব্য তারিখ হিসাব সম্পন্ন হয়েছে!");
    } else {
      // Ultrasound
      if (!scanDate) {
        toast.error("অনুগ্রহ করে আল্ট্রাসনোগ্রামের তারিখ সিলেক্ট করুন।");
        return;
      }

      const scan = parseLocalDate(scanDate);
      const now = new Date();
      const todayMid = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      if (scan > todayMid) {
        toast.error("আল্ট্রাসনোগ্রামের তারিখ ভবিষ্যতের হতে পারে না।");
        return;
      }

      const weeks = parseInt(scanWeeks, 10);
      const days = parseInt(scanDays, 10) || 0;

      if (isNaN(weeks) || weeks < 4 || weeks > 42) {
        toast.error("অনুগ্রহ করে শিশুর সঠিক গর্ভকালীন সপ্তাহ (৪-৪২) দিন।");
        return;
      }

      if (days < 0 || days > 6) {
        toast.error("অতিরিক্ত দিন ০ থেকে ৬ এর মধ্যে হতে হবে।");
        return;
      }

      const calcResult = calculateEddFromUltrasound(scan, weeks, days);
      setResult(calcResult);
      trackEvent("health_tool_used", {
        tool_name: "pregnancy_edd",
        result_status: `US_T${calcResult.trimester}`,
      });
      toast.success("প্রসবের সম্ভাব্য তারিখ হিসাব সম্পন্ন হয়েছে!");
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Input Form Card */}
      <Card className="lg:col-span-5 border border-border/80 bg-background shadow-sm rounded-3xl">
        <CardContent className="p-5 sm:p-7 space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-heading font-black text-secondary dark:text-white flex items-center gap-2">
              <Baby className="h-5 w-5 text-pink-600" />
              <span>গর্ভকালীন ক্যালকুলেটর (ইডিডি)</span>
            </h3>
            <p className="text-xs text-muted-foreground">
              শেষ মাসিকের তারিখ (LMP) বা আল্ট্রাসনোগ্রাম রিপোর্ট দিয়ে সম্ভাব্য প্রসবের তারিখ হিসাব করুন
            </p>
          </div>

          {/* Method Selection (LMP vs Ultrasound) */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground">
              গণনার পদ্ধতি
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
                শেষ মাসিকের তারিখ (LMP)
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
                আল্ট্রাসনোগ্রাম রিপোর্ট
              </button>
            </div>
          </div>

          <form onSubmit={handleCalculate} className="space-y-4">
            {method === "lmp" ? (
              <>
                {/* LMP Date Input */}
                <div className="space-y-1.5">
                  <Label htmlFor="lmp-date" className="text-xs font-semibold">
                    শেষ মাসিকের প্রথম দিন (LMP)
                  </Label>
                  <Input
                    id="lmp-date"
                    type="date"
                    value={lmpDate}
                    max={getTodayLocalDateString()}
                    onChange={(e) => setLmpDate(e.target.value)}
                    required
                    className="cursor-pointer"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    আপনার শেষ পিরিয়ড শুরুর প্রথম তারিখটি দিন
                  </p>
                </div>

                {/* Average Cycle Length */}
                <div className="space-y-1.5">
                  <Label htmlFor="cycle-length" className="text-xs font-semibold">
                    মাসিক চক্রের গড় স্থায়ীত্ব (দিন)
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
                    স্বাভাবিকভাবে মাসিক চক্র ২৮ দিনের হয়ে থাকে।
                  </p>
                </div>
              </>
            ) : (
              <>
                {/* Ultrasound Date */}
                <div className="space-y-1.5">
                  <Label htmlFor="scan-date" className="text-xs font-semibold">
                    আল্ট্রাসনোগ্রাম করার তারিখ
                  </Label>
                  <Input
                    id="scan-date"
                    type="date"
                    value={scanDate}
                    max={getTodayLocalDateString()}
                    onChange={(e) => setScanDate(e.target.value)}
                    required
                    className="cursor-pointer"
                  />
                </div>

                {/* Gestational Age at Scan */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">
                    রিপোর্ট অনুযায়ী গর্ভকালীন বয়স
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Input
                        id="scan-weeks"
                        aria-label="রিপোর্ট অনুযায়ী গর্ভকালীন বয়স (সপ্তাহ)"
                        type="number"
                        min="4"
                        max="42"
                        placeholder="সপ্তাহ (যেমন: ১২)"
                        value={scanWeeks}
                        onChange={(e) => setScanWeeks(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Input
                        id="scan-days"
                        aria-label="রিপোর্ট অনুযায়ী গর্ভকালীন বয়স (দিন)"
                        type="number"
                        min="0"
                        max="6"
                        placeholder="দিন (০-৬)"
                        value={scanDays}
                        onChange={(e) => setScanDays(e.target.value)}
                      />
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    আল্ট্রাসনোগ্রাম রিপোর্টে উল্লেখিত Gestational Age (GA) সপ্তাহ ও দিন দিন
                  </p>
                </div>
              </>
            )}

            <div className="flex gap-2 pt-2">
              <Button type="submit" className="flex-1 font-bold bg-pink-600 hover:bg-pink-700 text-white">
                <Calendar className="mr-2 h-4 w-4" />
                প্রসবের তারিখ দেখুন
              </Button>
              {result && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  size="icon"
                  aria-label="ক্যালকুলেটর রিসেট করুন"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Result Display Card */}
      <PregnancyResultView result={result} />
    </div>
  );
}
