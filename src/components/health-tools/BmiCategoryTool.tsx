"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Scale,
  RotateCcw,
  Activity,
  ArrowRight,
  Info,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { toBanglaNums } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

export function BmiCategoryTool() {
  const [unit, setUnit] = useState<"ft" | "cm">("ft");
  const [feet, setFeet] = useState("5");
  const [inches, setInches] = useState("6");
  const [cm, setCm] = useState("168");
  const [weightKg, setWeightKg] = useState("65");

  const [result, setResult] = useState<{
    bmi: number;
    category: "underweight" | "normal" | "overweight" | "obese";
    idealMin: number;
    idealMax: number;
    diffKg: number;
  } | null>(null);

  const handleCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    let heightInMeters = 0;
    if (unit === "ft") {
      const ftVal = parseFloat(feet) || 0;
      const inVal = parseFloat(inches) || 0;
      const totalInches = ftVal * 12 + inVal;
      if (totalInches <= 0) {
        toast.error("অনুগ্রহ করে সঠিক উচ্চতা প্রদান করুন।");
        return;
      }
      heightInMeters = totalInches * 0.0254;
    } else {
      const cmVal = parseFloat(cm) || 0;
      if (cmVal <= 0) {
        toast.error("অনুগ্রহ করে সঠিক সেন্টিমিটার মান প্রদান করুন।");
        return;
      }
      heightInMeters = cmVal / 100;
    }

    const weight = parseFloat(weightKg) || 0;
    if (weight <= 0 || heightInMeters <= 0) {
      toast.error("অনুগ্রহ করে সঠিক ওজন (কেজি) প্রদান করুন।");
      return;
    }

    const bmiRaw = weight / (heightInMeters * heightInMeters);
    const bmi = parseFloat(bmiRaw.toFixed(1));
    const idealMin = Math.round(18.5 * (heightInMeters * heightInMeters));
    const idealMax = Math.round(24.9 * (heightInMeters * heightInMeters));

    let category: "underweight" | "normal" | "overweight" | "obese" = "normal";
    if (bmi < 18.5) category = "underweight";
    else if (bmi < 25) category = "normal";
    else if (bmi < 30) category = "overweight";
    else category = "obese";

    let diffKg = 0;
    if (weight < idealMin) diffKg = idealMin - weight;
    else if (weight > idealMax) diffKg = weight - idealMax;

    setResult({
      bmi,
      category,
      idealMin,
      idealMax,
      diffKg: Math.round(diffKg),
    });

    trackEvent("health_tool_used", {
      tool_name: "bmi",
      result_status: category,
    });

    toast.success("বিএমআই হিসাব সম্পন্ন হয়েছে!");
  };

  const handlePreset = (ft: string, inc: string, wt: string) => {
    setUnit("ft");
    setFeet(ft);
    setInches(inc);
    setWeightKg(wt);

    const totalInches = parseFloat(ft) * 12 + parseFloat(inc);
    const heightInMeters = totalInches * 0.0254;
    const weight = parseFloat(wt);
    const bmi = parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));
    const idealMin = Math.round(18.5 * (heightInMeters * heightInMeters));
    const idealMax = Math.round(24.9 * (heightInMeters * heightInMeters));

    let category: "underweight" | "normal" | "overweight" | "obese" = "normal";
    if (bmi < 18.5) category = "underweight";
    else if (bmi < 25) category = "normal";
    else if (bmi < 30) category = "overweight";
    else category = "obese";

    let diffKg = 0;
    if (weight < idealMin) diffKg = idealMin - weight;
    else if (weight > idealMax) diffKg = weight - idealMax;

    setResult({ bmi, category, idealMin, idealMax, diffKg: Math.round(diffKg) });
    trackEvent("health_tool_used", {
      tool_name: "bmi",
      result_status: `Preset_${category}`,
    });
  };

  const handleReset = () => {
    setFeet("5");
    setInches("6");
    setCm("168");
    setWeightKg("65");
    setResult(null);
  };

  const getCategoryDetails = () => {
    if (!result) return null;
    switch (result.category) {
      case "underweight":
        return {
          titleBn: "কম ওজন (আন্ডারওয়েট)",
          color: "text-amber-500",
          bgColor: "bg-amber-500/10",
          borderColor: "border-amber-500/30",
          badgeBg: "bg-amber-500 text-white",
          advice: "আপনার ওজন স্বাভাবিকের চেয়ে কম। স্বাস্থ্যসম্মত পুষ্টিকর প্রোটিন, বাদাম, দুধ ও ক্যালোরিযুক্ত সুষম খাদ্য গ্রহণ করুন।",
        };
      case "normal":
        return {
          titleBn: "স্বাভাবিক ও আদর্শ ওজন",
          color: "text-primary",
          bgColor: "bg-primary/10",
          borderColor: "border-primary/30",
          badgeBg: "bg-primary text-white",
          advice: "অভিনন্দন! আপনার বডি ম্যাস ইনডেক্স সম্পূর্ণ আদর্শ সীমার মধ্যে রয়েছে। নিয়মিত ব্যায়াম ও স্বাস্থ্যকর খাদ্যাভ্যাস বজায় রাখুন।",
        };
      case "overweight":
        return {
          titleBn: "অতিরিক্ত ওজন (ওভারওয়েট)",
          color: "text-orange-500",
          bgColor: "bg-orange-500/10",
          borderColor: "border-orange-500/30",
          badgeBg: "bg-orange-500 text-white",
          advice: "আপনার ওজন আদর্শের চেয়ে সামান্য বেশি। মিষ্টি, অতিরিক্ত ভাজাপোড়া কমিয়ে প্রতিদিন ৩০ মিনিট নিয়মিত হাঁটার অভ্যাস গড়ে তুলুন।",
        };
      case "obese":
        return {
          titleBn: "স্থূলতা / ওবেসিটি (Obesity)",
          color: "text-rose-600 dark:text-rose-400",
          bgColor: "bg-rose-500/10",
          borderColor: "border-rose-500/30",
          badgeBg: "bg-rose-600 text-white",
          advice: "স্থূলতা হৃদরোগ, উচ্চ রক্তচাপ ও ডায়াবেটিসের ঝুঁকি বাড়ায়। একজন পুষ্টিবিদ বা ডাক্তারের পরামর্শে সুষম ডায়েট চার্ট অনুসরণ করুন।",
        };
    }
  };

  const catDetails = getCategoryDetails();

  return (
    <Card className="border border-emerald-500/20 bg-gradient-to-b from-emerald-500/5 via-background to-background shadow-xs rounded-3xl overflow-hidden">
      <CardContent className="p-5 sm:p-7 space-y-6">
        {/* Header Title */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
              <Scale className="h-3.5 w-3.5" />
              <span>ইন্টারেক্টিভ ফিটনেস টুল • WHO BMI Standards</span>
            </div>
            <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground">
              বডি ম্যাস ইনডেক্স ক্যালকুলেটর (BMI Calculator)
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              আপনার উচ্চতা ও ওজন দিয়ে তাৎক্ষণিক স্বাস্থ্য সূচক ও আদর্শ ওজনের সীমা জানুন।
            </p>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleCalculate} className="space-y-4">
          {/* Unit Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">উচ্চতার একক:</span>
            <div className="inline-flex rounded-xl p-0.5 bg-muted border border-border">
              <button
                type="button"
                onClick={() => setUnit("ft")}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  unit === "ft" ? "bg-background shadow-xs text-foreground" : "text-muted-foreground"
                }`}
              >
                ফিট / ইঞ্চি
              </button>
              <button
                type="button"
                onClick={() => setUnit("cm")}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  unit === "cm" ? "bg-background shadow-xs text-foreground" : "text-muted-foreground"
                }`}
              >
                সেন্টিমিটার (CM)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {unit === "ft" ? (
              <div className="space-y-2">
                <Label className="text-xs sm:text-sm font-semibold text-foreground">
                  উচ্চতা (ফিট ও ইঞ্চি)
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    min="3"
                    max="7"
                    value={feet}
                    onChange={(e) => setFeet(e.target.value)}
                    placeholder="ফিট"
                    className="rounded-xl h-11 bg-background text-sm font-mono"
                  />
                  <Input
                    type="number"
                    min="0"
                    max="11"
                    value={inches}
                    onChange={(e) => setInches(e.target.value)}
                    placeholder="ইঞ্চি"
                    className="rounded-xl h-11 bg-background text-sm font-mono"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="embed-cm" className="text-xs sm:text-sm font-semibold text-foreground">
                  উচ্চতা (সেন্টিমিটার)
                </Label>
                <Input
                  id="embed-cm"
                  type="number"
                  min="90"
                  max="240"
                  value={cm}
                  onChange={(e) => setCm(e.target.value)}
                  placeholder="১৬৮"
                  className="rounded-xl h-11 bg-background text-sm font-mono"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="embed-weight" className="text-xs sm:text-sm font-semibold text-foreground flex items-center justify-between">
                <span>ওজন (Weight)</span>
                <span className="text-[11px] text-muted-foreground">কেজি (KG)</span>
              </Label>
              <Input
                id="embed-weight"
                type="number"
                min="20"
                max="250"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                placeholder="৬৫"
                className="rounded-xl h-11 bg-background text-sm font-mono"
              />
            </div>
          </div>

          {/* Presets */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
              <Info className="h-3 w-3" />
              দ্রুত পরীক্ষার উদাহরণ:
            </span>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handlePreset("5", "6", "64")}
                className="text-xs h-7 rounded-lg border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
              >
                ৫&apos;৬&quot; / ৬৪ কেজি (আদর্শ)
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handlePreset("5", "3", "72")}
                className="text-xs h-7 rounded-lg border-orange-500/30 hover:bg-orange-500/10 text-orange-700 dark:text-orange-300"
              >
                ৫&apos;৩&quot; / ৭২ কেজি (ওভারওয়েট)
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handlePreset("5", "8", "50")}
                className="text-xs h-7 rounded-lg border-amber-500/30 hover:bg-amber-500/10 text-amber-700 dark:text-amber-300"
              >
                ৫&apos;৮&quot; / ৫০ কেজি (কম ওজন)
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              type="submit"
              className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 shadow-xs"
            >
              <Activity className="h-4 w-4 mr-2" />
              বিএমআই হিসাব করুন
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
        {result && catDetails && (
          <div className="pt-4 border-t border-border/80 space-y-4">
            <div className={`p-4 sm:p-5 rounded-2xl border ${catDetails.borderColor} ${catDetails.bgColor} space-y-3`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-muted-foreground">বিএমআই সূচক:</span>
                    <Badge className={`${catDetails.badgeBg} font-bold text-xs`}>
                      {catDetails.titleBn}
                    </Badge>
                  </div>
                  <h4 className="text-2xl sm:text-3xl font-heading font-extrabold text-foreground">
                    {toBanglaNums(result.bmi)} <span className="text-xs font-normal text-muted-foreground">kg/m²</span>
                  </h4>
                </div>

                <div className="bg-background/80 px-4 py-2 rounded-xl border border-border/60 text-xs">
                  <span className="text-muted-foreground block text-[10px]">আপনার আদর্শ ওজনের সীমা:</span>
                  <span className="font-bold text-primary font-mono text-sm">
                    {toBanglaNums(result.idealMin)} - {toBanglaNums(result.idealMax)} কেজি
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed pt-1">
                {catDetails.advice}
              </p>
            </div>

            {/* Target Advice */}
            <div className="space-y-1.5 p-3.5 rounded-xl bg-muted/40 border border-border/60 text-xs">
              <span className="font-bold text-foreground flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                ওজন নিয়ন্ত্রণ লক্ষ্যমাত্রা:
              </span>
              <p className="text-muted-foreground text-[11px] sm:text-xs">
                {result.category === "normal"
                  ? "আপনার ওজন পুরোপুরি কাঙ্ক্ষিত সীমার মধ্যে রয়েছে। ওজন স্থিতিশীল রাখতে সুষম খাবার ও ব্যায়াম চালিয়ে যান।"
                  : result.category === "underweight"
                  ? `আদর্শ ওজনে পৌঁছাতে আপনার অন্তত ${toBanglaNums(result.diffKg)} কেজি স্বাস্থ্যকর ওজন বৃদ্ধি করা প্রয়োজন।`
                  : `আদর্শ ওজনের স্বাভাবিক সীমায় পৌঁছাতে আপনার আনুমানিক ${toBanglaNums(result.diffKg)} কেজি ওজন কমানো উপকারী হবে।`}
              </p>
            </div>

            {/* Link to Full Health Tool */}
            <div className="pt-1 flex items-center justify-between gap-3 text-xs">
              <span className="text-muted-foreground hidden sm:inline">
                দৈনিক ক্যালোরি ও পানি পানের হিসাব জানতে চান?
              </span>
              <Link
                href="/health-tools?tab=bmi"
                className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline inline-flex items-center gap-1 ml-auto"
              >
                <span>সম্পূর্ণ বিএমআই ও ক্যালোরি টুলে যান</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
