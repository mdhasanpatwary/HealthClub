"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  HeartPulse,
  Sparkles,
  RotateCcw,
  Activity,
} from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { toast } from "sonner";
import {
  evaluateBloodPressure,
  BpEvaluationResult,
} from "@/data/clinicalEvaluatorData";
import { trackEvent } from "@/lib/analytics";
import { BpResultView } from "./BpResultView";

export function BpEvaluatorTab() {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  const [systolic, setSystolic] = useState("120");
  const [diastolic, setDiastolic] = useState("80");
  const [result, setResult] = useState<BpEvaluationResult | null>(() =>
    evaluateBloodPressure(120, 80)
  );

  const handleEvaluate = (e: React.FormEvent) => {
    e.preventDefault();
    const sys = parseFloat(systolic);
    const dia = parseFloat(diastolic);

    if (isNaN(sys) || isNaN(dia)) {
      toast.error(
        isEn
          ? "Please enter valid numbers for Systolic and Diastolic blood pressure."
          : "অনুগ্রহ করে সিস্টোলিক এবং ডায়াস্টোলিক রক্তচাপের সঠিক মান প্রদান করুন।"
      );
      return;
    }

    if (sys < 50 || sys > 260) {
      toast.error(
        isEn
          ? "Systolic pressure typically ranges between 50 and 260 mmHg."
          : "সিস্টোলিক রক্তচাপ সাধারণত ৫০ থেকে ২৬০ mmHg এর মধ্যে হয়ে থাকে।"
      );
      return;
    }

    if (dia < 30 || dia > 180) {
      toast.error(
        isEn
          ? "Diastolic pressure typically ranges between 30 and 180 mmHg."
          : "ডায়াস্টোলিক রক্তচাপ সাধারণত ৩০ থেকে ১৮০ mmHg এর মধ্যে হয়ে থাকে।"
      );
      return;
    }

    if (sys <= dia) {
      toast.error(
        isEn
          ? "Systolic pressure must be strictly greater than Diastolic pressure."
          : "সিস্টোলিক রক্তচাপ অবশ্যই ডায়াস্টোলিক রক্তচাপের চেয়ে বেশি হতে হবে।"
      );
      return;
    }

    const evaluation = evaluateBloodPressure(sys, dia);
    setResult(evaluation);
    trackEvent("health_tool_used", {
      tool_name: "bp_diabetes",
      result_status: `BP_${evaluation.category}`,
    });
    toast.success(
      isEn ? "Blood pressure evaluated successfully!" : "রক্তচাপের মূল্যায়ন সম্পন্ন হয়েছে!"
    );
  };

  const handleReset = () => {
    setSystolic("120");
    setDiastolic("80");
    setResult(evaluateBloodPressure(120, 80));
  };

  const applyPreset = (sys: number, dia: number) => {
    setSystolic(sys.toString());
    setDiastolic(dia.toString());
    setResult(evaluateBloodPressure(sys, dia));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Form Input Section */}
      <Card className="lg:col-span-5 border border-border/80 bg-background shadow-sm rounded-3xl">
        <CardContent className="p-5 sm:p-7 space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
              <HeartPulse className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base sm:text-lg text-secondary dark:text-white">
                {isEn ? "Blood Pressure Evaluator" : "রক্তচাপ মূল্যায়ন (BP Evaluator)"}
              </h3>
              <p className="text-xs text-muted-foreground">
                {isEn ? "AHA/ACC clinical guideline categories" : "আন্তর্জাতিক হৃদরোগ গাইডলাইন অনুযায়ী শ্রেণীবিভাগ"}
              </p>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground">
              {isEn ? "Quick Example Values:" : "উদাহরণ মান:"}
            </Label>
            <div className="flex flex-wrap gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-[11px] h-7 px-2.5 rounded-lg border-primary/30 hover:bg-primary/10"
                onClick={() => applyPreset(118, 76)}
              >
                118/76 ({isEn ? "Normal" : "স্বাভাবিক"})
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-[11px] h-7 px-2.5 rounded-lg border-amber-500/30 hover:bg-amber-500/10"
                onClick={() => applyPreset(126, 78)}
              >
                126/78 ({isEn ? "Elevated" : "উত্তোলিত"})
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-[11px] h-7 px-2.5 rounded-lg border-orange-500/30 hover:bg-orange-500/10"
                onClick={() => applyPreset(136, 86)}
              >
                136/86 ({isEn ? "Stage 1" : "স্টেজ ১"})
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-[11px] h-7 px-2.5 rounded-lg border-red-500/30 hover:bg-red-500/10"
                onClick={() => applyPreset(150, 95)}
              >
                150/95 ({isEn ? "Stage 2" : "স্টেজ ২"})
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-[11px] h-7 px-2.5 rounded-lg border-rose-600/30 hover:bg-rose-600/10"
                onClick={() => applyPreset(188, 124)}
              >
                188/124 ({isEn ? "Crisis" : "ক্রাইসিস"})
              </Button>
            </div>
          </div>

          <form onSubmit={handleEvaluate} className="space-y-4">
            {/* Systolic */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="bp-systolic" className="text-xs font-bold text-secondary dark:text-white">
                  {isEn ? "Systolic Pressure (Top Number)" : "সিস্টোলিক রক্তচাপ (উপরের সংখ্যা)"}
                </Label>
                <span className="text-[11px] font-mono text-muted-foreground">mmHg</span>
              </div>
              <Input
                id="bp-systolic"
                type="number"
                min="50"
                max="260"
                step="1"
                placeholder={isEn ? "e.g. 120" : "যেমন: ১২০"}
                value={systolic}
                onChange={(e) => setSystolic(e.target.value)}
                required
                className="font-mono text-base font-semibold"
              />
              <p className="text-[11px] text-muted-foreground">
                {isEn ? "Heart contraction pressure (Ideal: < 120)" : "হৃৎপিণ্ডের সংকোচনকালীন চাপ (আদর্শ: ১২০ এর নিচে)"}
              </p>
            </div>

            {/* Diastolic */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="bp-diastolic" className="text-xs font-bold text-secondary dark:text-white">
                  {isEn ? "Diastolic Pressure (Bottom Number)" : "ডায়াস্টোলিক রক্তচাপ (নিচের সংখ্যা)"}
                </Label>
                <span className="text-[11px] font-mono text-muted-foreground">mmHg</span>
              </div>
              <Input
                id="bp-diastolic"
                type="number"
                min="30"
                max="180"
                step="1"
                placeholder={isEn ? "e.g. 80" : "যেমন: ৮০"}
                value={diastolic}
                onChange={(e) => setDiastolic(e.target.value)}
                required
                className="font-mono text-base font-semibold"
              />
              <p className="text-[11px] text-muted-foreground">
                {isEn ? "Heart relaxation pressure (Ideal: < 80)" : "হৃৎপিণ্ডের প্রসারণকালীন চাপ (আদর্শ: ৮০ এর নিচে)"}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <Button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md h-11"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                <span>{isEn ? "Evaluate Blood Pressure" : "রক্তচাপ মূল্যায়ন করুন"}</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                size="icon"
                className="h-11 w-11 shrink-0 rounded-xl"
                title={isEn ? "Reset Values" : "রিসেট করুন"}
              >
                <RotateCcw className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          </form>

          {/* Reference Info Card */}
          <div className="p-4 rounded-2xl bg-muted/50 border border-border/60 text-xs space-y-2">
            <div className="font-semibold text-secondary dark:text-white flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 text-primary" />
              <span>{isEn ? "Standard BP Classification Reference:" : "আদর্শ রক্তচাপের আন্তর্জাতিক রেফারেন্স:"}</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-[11px] text-muted-foreground">
              <div>🟢 {isEn ? "Normal:" : "স্বাভাবিক:"} &lt;120 / &lt;80</div>
              <div>🟡 {isEn ? "Elevated:" : "উত্তোলিত:"} 120-129 / &lt;80</div>
              <div>🟠 {isEn ? "Stage 1:" : "স্টেজ ১:"} 130-139 / 80-89</div>
              <div>🔴 {isEn ? "Stage 2:" : "স্টেজ ২:"} ≥140 / ≥90</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results & Guidelines Section */}
      <div className="lg:col-span-7 space-y-6">
        <BpResultView result={result} locale={locale} />
      </div>
    </div>
  );
}
