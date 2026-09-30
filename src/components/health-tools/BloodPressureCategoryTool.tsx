"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  HeartPulse,
  Activity,
  RotateCcw,
  ArrowRight,
  ShieldAlert,
  Info,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { toBanglaNums } from "@/lib/utils";
import {
  evaluateBloodPressure,
  BpEvaluationResult,
} from "@/data/clinicalEvaluatorData";
import { trackEvent } from "@/lib/analytics";

export function BloodPressureCategoryTool() {
  const [systolic, setSystolic] = useState("120");
  const [diastolic, setDiastolic] = useState("80");
  const [result, setResult] = useState<BpEvaluationResult | null>(null);

  const handleEvaluate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const sys = parseFloat(systolic);
    const dia = parseFloat(diastolic);

    if (isNaN(sys) || isNaN(dia)) {
      toast.error("অনুগ্রহ করে সিস্টোলিক ও ডায়াস্টোলিক প্রেসারের সঠিক মান দিন।");
      return;
    }

    if (sys < 50 || sys > 260) {
      toast.error("সিস্টোলিক রক্তচাপ সাধারণত ৫০ থেকে ২৬০ mmHg হয়ে থাকে।");
      return;
    }

    if (dia < 30 || dia > 180) {
      toast.error("ডায়াস্টোলিক রক্তচাপ সাধারণত ৩০ থেকে ১৮০ mmHg হয়ে থাকে।");
      return;
    }

    if (sys <= dia) {
      toast.error("সিস্টোলিক প্রেসার অবশ্যই ডায়াস্টোলিকের চেয়ে বেশি হতে হবে।");
      return;
    }

    const evaluation = evaluateBloodPressure(sys, dia);
    setResult(evaluation);

    trackEvent("health_tool_used", {
      tool_name: "bp_diabetes",
      result_status: `BP_${evaluation.category}`,
    });

    toast.success("রক্তচাপ মূল্যায়ন সম্পন্ন হয়েছে!");
  };

  const handlePreset = (sys: number, dia: number) => {
    setSystolic(sys.toString());
    setDiastolic(dia.toString());
    const evaluation = evaluateBloodPressure(sys, dia);
    setResult(evaluation);
    trackEvent("health_tool_used", {
      tool_name: "bp_diabetes",
      result_status: `Preset_BP_${evaluation.category}`,
    });
  };

  const handleReset = () => {
    setSystolic("120");
    setDiastolic("80");
    setResult(null);
  };

  return (
    <Card className="border border-rose-500/20 bg-gradient-to-b from-rose-500/5 via-background to-background shadow-xs rounded-3xl overflow-hidden">
      <CardContent className="p-5 sm:p-7 space-y-6">
        {/* Header Title */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold">
              <HeartPulse className="h-3.5 w-3.5" />
              <span>ইন্টারেক্টিভ কার্ডিও টুল • AHA / DGHS Guidelines</span>
            </div>
            <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground">
              রক্তচাপ মূল্যায়ন ও স্টেজ নির্দেশক (BP Evaluator)
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              আপনার সিস্টোলিক ও ডায়াস্টোলিক প্রেসার দিয়ে বর্তমান হার্ট ও রক্তনালীর ঝুঁকির স্তর জানুন।
            </p>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleEvaluate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="embed-sys" className="text-xs sm:text-sm font-semibold text-foreground flex items-center justify-between">
                <span>সিস্টোলিক প্রেসার (Systolic - ওপরের)</span>
                <span className="text-[11px] text-muted-foreground">mmHg</span>
              </Label>
              <Input
                id="embed-sys"
                type="number"
                min="50"
                max="260"
                value={systolic}
                onChange={(e) => setSystolic(e.target.value)}
                placeholder="১২০"
                className="rounded-xl h-11 bg-background text-sm font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="embed-dia" className="text-xs sm:text-sm font-semibold text-foreground flex items-center justify-between">
                <span>ডায়াস্টোলিক প্রেসার (Diastolic - নিচের)</span>
                <span className="text-[11px] text-muted-foreground">mmHg</span>
              </Label>
              <Input
                id="embed-dia"
                type="number"
                min="30"
                max="180"
                value={diastolic}
                onChange={(e) => setDiastolic(e.target.value)}
                placeholder="৮০"
                className="rounded-xl h-11 bg-background text-sm font-mono"
              />
            </div>
          </div>

          {/* Quick Presets */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
              <Info className="h-3 w-3" />
              দ্রুত পরীক্ষার জন্য স্যাম্পল প্রেসার সিলেক্ট করুন:
            </span>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handlePreset(120, 80)}
                className="text-xs h-7 rounded-lg border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
              >
                ১২০/৮০ (স্বাভাবিক)
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handlePreset(128, 82)}
                className="text-xs h-7 rounded-lg border-amber-500/30 hover:bg-amber-500/10 text-amber-700 dark:text-amber-300"
              >
                ১২৮/৮২ (এলিভেটেড)
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handlePreset(142, 92)}
                className="text-xs h-7 rounded-lg border-orange-500/30 hover:bg-orange-500/10 text-orange-700 dark:text-orange-300"
              >
                ১৪২/৯২ (স্টেজ-১)
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handlePreset(165, 102)}
                className="text-xs h-7 rounded-lg border-rose-500/30 hover:bg-rose-500/10 text-rose-700 dark:text-rose-300"
              >
                ১৬৫/১০২ (স্টেজ-২)
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              type="submit"
              className="flex-1 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold h-11 shadow-xs"
            >
              <Activity className="h-4 w-4 mr-2" />
              মূল্যায়ন করুন
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

        {/* Evaluation Result */}
        {result && (
          <div className="pt-4 border-t border-border/80 space-y-4">
            <div className={`p-4 sm:p-5 rounded-2xl border ${result.borderColor} ${result.bgColor} space-y-3`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-muted-foreground">রক্তচাপ শ্রেণী:</span>
                    <Badge className={`${result.badgeBg} font-bold text-xs`}>
                      {result.badgeBn}
                    </Badge>
                  </div>
                  <h4 className={`text-lg sm:text-xl font-heading font-extrabold ${result.color}`}>
                    {result.titleBn}
                  </h4>
                </div>

                <div className="flex items-center gap-3 bg-background/80 px-3 py-1.5 rounded-xl border border-border/60 text-xs">
                  <div>
                    <span className="text-muted-foreground block text-[10px]">পালস প্রেসার:</span>
                    <span className="font-bold font-mono">{toBanglaNums(result.pulsePressure)} mmHg</span>
                  </div>
                  <div className="h-5 w-[1px] bg-border" />
                  <div>
                    <span className="text-muted-foreground block text-[10px]">গড় ধমনী চাপ (MAP):</span>
                    <span className="font-bold font-mono">{toBanglaNums(result.meanArterialPressure)} mmHg</span>
                  </div>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed pt-1">
                {result.summaryBn}
              </p>
            </div>

            {/* Hypertensive Crisis Warning Alert */}
            {result.category === "crisis" && (
              <div className="p-3.5 rounded-xl bg-rose-600/10 border border-rose-600/30 text-xs text-rose-700 dark:text-rose-300 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldAlert className="h-4 w-4 text-rose-600 shrink-0" />
                  <span>জরুরি মেডিকেল সতর্কতা!</span>
                </div>
                <p className="text-[11px] sm:text-xs leading-relaxed">
                  সিস্টোলিক ১৮০ বা ডায়াস্টোলিক ১২০ এর ওপর থাকা জরুরি ক্রাইসিস নির্দেশ করে। মাথা ঘোরা, বুকব্যথা বা দৃষ্টিবিভ্রম হলে কালবিলম্ব না করে ফেনী সদর হাসপাতালের জরুরি বিভাগ (০১৭৩০-৩২৪৭৮৪) বা জরুরি ৯৯৯ নম্বরে যোগাযোগ করুন।
                </p>
              </div>
            )}

            {/* Action Advice Checklist */}
            <div className="space-y-2 p-3.5 rounded-xl bg-muted/40 border border-border/60 text-xs">
              <span className="font-bold text-foreground flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                করণীয় ও বিশেষজ্ঞ পরামর্শ:
              </span>
              <ul className="space-y-1 text-muted-foreground text-[11px] sm:text-xs">
                {result.actionPlanBn.slice(0, 3).map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-primary font-bold">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Link to Full Health Tool */}
            <div className="pt-1 flex items-center justify-between gap-3 text-xs">
              <span className="text-muted-foreground hidden sm:inline">
                লিপিড প্রোফাইল ও ডায়াবেটিস গ্লুকোজ মূল্যায়ন করতে চান?
              </span>
              <Link
                href="/health-tools?tab=bp-evaluator"
                className="text-rose-600 dark:text-rose-400 font-bold hover:underline inline-flex items-center gap-1 ml-auto"
              >
                <span>সম্পূর্ণ রক্তচাপ ও ডায়াবেটিস টুলে যান</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
