"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Sparkles,
  RotateCcw,
  AlertTriangle,
  HeartHandshake,
  Apple,
  ArrowRight,
  ShieldAlert,
  Stethoscope,
  CheckCircle2,
  Salad,
} from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { formatNum } from "@/lib/i18n";
import { toast } from "sonner";
import Link from "next/link";
import {
  evaluateBloodGlucose,
  convertGlucose,
  GlucoseContext,
  GlucoseUnit,
  GlucoseEvaluationResult,
} from "@/data/clinicalEvaluatorData";
import { trackEvent } from "@/lib/analytics";

export function DiabetesEvaluatorTab() {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  const [context, setContext] = useState<GlucoseContext>("fasting");
  const [unit, setUnit] = useState<GlucoseUnit>("mmol");
  const [inputValue, setInputValue] = useState("5.2");
  const [activeSubTab, setActiveSubTab] = useState<"action" | "diet" | "warnings">("action");

  const [result, setResult] = useState<GlucoseEvaluationResult | null>(() =>
    evaluateBloodGlucose(5.2, "fasting", "mmol")
  );

  const handleUnitChange = (newUnit: GlucoseUnit) => {
    if (newUnit === unit || context === "hba1c") return;
    const num = parseFloat(inputValue);
    if (!isNaN(num) && num > 0) {
      const converted = convertGlucose(num, unit, newUnit);
      setInputValue(converted.toString());
      setResult(evaluateBloodGlucose(converted, context, newUnit));
    }
    setUnit(newUnit);
  };

  const handleContextChange = (newContext: GlucoseContext) => {
    setContext(newContext);
    if (newContext === "hba1c") {
      setInputValue("5.4");
      setResult(evaluateBloodGlucose(5.4, "hba1c", "mmol"));
    } else {
      const defaultVal = unit === "mmol" ? "5.2" : "94";
      setInputValue(defaultVal);
      setResult(evaluateBloodGlucose(parseFloat(defaultVal), newContext, unit));
    }
  };

  const handleEvaluate = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(inputValue);

    if (isNaN(val) || val <= 0) {
      toast.error(
        isEn
          ? "Please enter a valid positive number for blood glucose."
          : "অনুগ্রহ করে রক্তের শর্করার সঠিক মান প্রদান করুন।"
      );
      return;
    }

    if (context === "hba1c") {
      if (val < 3.0 || val > 20.0) {
        toast.error(
          isEn
            ? "HbA1c level typically ranges between 3.0% and 20.0%."
            : "HbA1c মাত্রা সাধারণত ৩.০% থেকে ২০.০% এর মধ্যে হয়ে থাকে।"
        );
        return;
      }
    } else if (unit === "mmol") {
      if (val < 1.0 || val > 45.0) {
        toast.error(
          isEn
            ? "Glucose in mmol/L typically ranges between 1.0 and 45.0."
            : "mmol/L এককে শর্করার মান সাধারণত ১.০ থেকে ৪৫.০ এর মধ্যে থাকে।"
        );
        return;
      }
    } else {
      if (val < 20 || val > 800) {
        toast.error(
          isEn
            ? "Glucose in mg/dL typically ranges between 20 and 800."
            : "mg/dL এককে শর্করার মান সাধারণত ২০ থেকে ৮০০ এর মধ্যে থাকে।"
        );
        return;
      }
    }

    const evaluation = evaluateBloodGlucose(val, context, unit);
    setResult(evaluation);
    trackEvent("health_tool_used", {
      tool_name: "bp_diabetes",
      result_status: `GLUCOSE_${evaluation.category}`,
    });
    toast.success(
      isEn ? "Blood sugar evaluated successfully!" : "রক্তের শর্করার মূল্যায়ন সম্পন্ন হয়েছে!"
    );
  };

  const handleReset = () => {
    setContext("fasting");
    setUnit("mmol");
    setInputValue("5.2");
    setResult(evaluateBloodGlucose(5.2, "fasting", "mmol"));
    setActiveSubTab("action");
  };

  const applyPreset = (val: number, ctx: GlucoseContext, u: GlucoseUnit) => {
    setContext(ctx);
    setUnit(u);
    setInputValue(val.toString());
    setResult(evaluateBloodGlucose(val, ctx, u));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Input Section */}
      <Card className="lg:col-span-5 border border-border/80 bg-background shadow-sm rounded-3xl">
        <CardContent className="p-5 sm:p-7 space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base sm:text-lg text-secondary dark:text-white">
                {isEn ? "Diabetes & Blood Sugar Evaluator" : "ডায়াবেটিস ও রক্তের শর্করা মূল্যায়ন"}
              </h3>
              <p className="text-xs text-muted-foreground">
                {isEn ? "ADA & WHO clinical diagnostic ranges" : "আন্তর্জাতিক ডায়াবেটিস গাইডলাইন অনুযায়ী শ্রেণীবিভাগ"}
              </p>
            </div>
          </div>

          {/* Test Type Selection */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-secondary dark:text-white">
              {isEn ? "Select Test Timing / Method:" : "টেস্টের সময় ও ধরন নির্বাচন করুন:"}
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleContextChange("fasting")}
                className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-left ${
                  context === "fasting"
                    ? "border-primary bg-primary/10 text-primary shadow-sm"
                    : "border-border/80 hover:bg-muted text-muted-foreground"
                }`}
              >
                <div className="font-bold text-secondary dark:text-white">
                  {isEn ? "Fasting (FBG)" : "খালি পেটে (Fasting)"}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {isEn ? ">= 8 hrs fasting" : "কমপক্ষে ৮ ঘণ্টা না খেয়ে"}
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleContextChange("post_meal")}
                className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-left ${
                  context === "post_meal"
                    ? "border-primary bg-primary/10 text-primary shadow-sm"
                    : "border-border/80 hover:bg-muted text-muted-foreground"
                }`}
              >
                <div className="font-bold text-secondary dark:text-white">
                  {isEn ? "2h Post-Meal (2ABF/OGTT)" : "খাবারের ২ ঘণ্টা পর (2ABF)"}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {isEn ? "2 hrs after breakfast/meal" : "নাস্তার ঠিক ২ ঘণ্টা পর"}
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleContextChange("random")}
                className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-left ${
                  context === "random"
                    ? "border-primary bg-primary/10 text-primary shadow-sm"
                    : "border-border/80 hover:bg-muted text-muted-foreground"
                }`}
              >
                <div className="font-bold text-secondary dark:text-white">
                  {isEn ? "Random Sugar (RBS)" : "র‍্যান্ডম সুগার (RBS)"}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {isEn ? "Any time of day" : "দিনের যেকোনো সময়"}
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleContextChange("hba1c")}
                className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-left ${
                  context === "hba1c"
                    ? "border-primary bg-primary/10 text-primary shadow-sm"
                    : "border-border/80 hover:bg-muted text-muted-foreground"
                }`}
              >
                <div className="font-bold text-secondary dark:text-white">
                  {isEn ? "HbA1c Test (%)" : "HbA1c টেস্ট (%)"}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {isEn ? "3-month average sugar" : "গত ৩ মাসের গড় শর্করা"}
                </div>
              </button>
            </div>
          </div>

          {/* Unit Toggle (If not HbA1c) */}
          {context !== "hba1c" && (
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-secondary dark:text-white">
                {isEn ? "Measurement Unit:" : "পরিমাপের একক:"}
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleUnitChange("mmol")}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                    unit === "mmol"
                      ? "border-primary bg-primary text-white shadow-sm"
                      : "border-border/80 hover:bg-muted text-muted-foreground"
                  }`}
                >
                  <span>mmol/L</span>
                  <span className="text-[10px] opacity-80">({isEn ? "Standard BD" : "বাংলাদেশে প্রচলিত"})</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleUnitChange("mgdl")}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                    unit === "mgdl"
                      ? "border-primary bg-primary text-white shadow-sm"
                      : "border-border/80 hover:bg-muted text-muted-foreground"
                  }`}
                >
                  <span>mg/dL</span>
                  <span className="text-[10px] opacity-80">({isEn ? "US / Int'l" : "আন্তর্জাতিক"})</span>
                </button>
              </div>
            </div>
          )}

          {/* Presets */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground">
              {isEn ? "Quick Presets:" : "উদাহরণ মান:"}
            </Label>
            <div className="flex flex-wrap gap-1.5">
              {context === "hba1c" ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-[11px] h-7 px-2.5 rounded-lg border-primary/30 hover:bg-primary/10"
                    onClick={() => applyPreset(5.3, "hba1c", "mmol")}
                  >
                    5.3% ({isEn ? "Normal" : "স্বাভাবিক"})
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-[11px] h-7 px-2.5 rounded-lg border-orange-500/30 hover:bg-orange-500/10"
                    onClick={() => applyPreset(6.0, "hba1c", "mmol")}
                  >
                    6.0% ({isEn ? "Pre-diabetic" : "প্রাক-ডায়াবেটিস"})
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-[11px] h-7 px-2.5 rounded-lg border-red-500/30 hover:bg-red-500/10"
                    onClick={() => applyPreset(7.8, "hba1c", "mmol")}
                  >
                    7.8% ({isEn ? "Diabetes" : "ডায়াবেটিস"})
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-[11px] h-7 px-2.5 rounded-lg border-primary/30 hover:bg-primary/10"
                    onClick={() => applyPreset(unit === "mmol" ? 5.1 : 92, context, unit)}
                  >
                    {unit === "mmol" ? "5.1" : "92"} ({isEn ? "Normal" : "স্বাভাবিক"})
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-[11px] h-7 px-2.5 rounded-lg border-orange-500/30 hover:bg-orange-500/10"
                    onClick={() => applyPreset(unit === "mmol" ? 6.4 : 115, "fasting", unit)}
                  >
                    {unit === "mmol" ? "6.4" : "115"} ({isEn ? "Pre-diabetic" : "প্রাক-ডায়াবেটিস"})
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-[11px] h-7 px-2.5 rounded-lg border-red-500/30 hover:bg-red-500/10"
                    onClick={() => applyPreset(unit === "mmol" ? 8.9 : 160, "fasting", unit)}
                  >
                    {unit === "mmol" ? "8.9" : "160"} ({isEn ? "Diabetes" : "ডায়াবেটিস"})
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-[11px] h-7 px-2.5 rounded-lg border-amber-600/30 hover:bg-amber-600/10"
                    onClick={() => applyPreset(unit === "mmol" ? 3.4 : 61, context, unit)}
                  >
                    {unit === "mmol" ? "3.4" : "61"} ({isEn ? "Low Sugar" : "লো সুগার"})
                  </Button>
                </>
              )}
            </div>
          </div>

          <form onSubmit={handleEvaluate} className="space-y-4">
            {/* Input Value */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="glucose-val" className="text-xs font-bold text-secondary dark:text-white">
                  {context === "hba1c"
                    ? isEn
                      ? "HbA1c Value (%)"
                      : "HbA1c এর মান (%)"
                    : isEn
                    ? `Glucose Reading (${unit === "mmol" ? "mmol/L" : "mg/dL"})`
                    : `রক্তের সুগারের মান (${unit === "mmol" ? "mmol/L" : "mg/dL"})`}
                </Label>
                <span className="text-[11px] font-mono text-muted-foreground">
                  {context === "hba1c" ? "%" : unit === "mmol" ? "mmol/L" : "mg/dL"}
                </span>
              </div>
              <Input
                id="glucose-val"
                type="number"
                step="0.1"
                min="0.5"
                max={context === "hba1c" ? 25 : unit === "mmol" ? 50 : 900}
                placeholder={isEn ? "e.g. 5.5" : "যেমন: ৫.৫"}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                required
                className="font-mono text-base font-semibold"
              />
              <p className="text-[11px] text-muted-foreground">
                {isEn
                  ? `Target Range: ${result ? result.targetRangeEn : ""}`
                  : `কাঙ্ক্ষিত স্বাভাবিক মাত্রা: ${result ? result.targetRangeBn : ""}`}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <Button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md h-11"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                <span>{isEn ? "Evaluate Blood Sugar" : "শর্করার মাত্রা মূল্যায়ন করুন"}</span>
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
        </CardContent>
      </Card>

      {/* Results Section */}
      <div className="lg:col-span-7 space-y-6">
        {result && (
          <>
            {/* Main Result Card */}
            <Card
              className={`border shadow-sm rounded-3xl overflow-hidden transition-all duration-300 ${result.bgColor} ${result.borderColor}`}
            >
              <CardContent className="p-5 sm:p-7 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">
                      {isEn ? "Clinical Evaluation Result" : "ক্লিনিক্যাল ফলাফল"}
                    </span>
                    <h4 className="text-xl sm:text-2xl font-heading font-black text-secondary dark:text-white">
                      {isEn ? result.titleEn : result.titleBn}
                    </h4>
                  </div>
                  <Badge className={`${result.badgeBg} font-bold text-xs py-1.5 px-3 rounded-full shrink-0 shadow-sm`}>
                    {isEn ? result.badgeEn : result.badgeBn}
                  </Badge>
                </div>

                {/* Numbers Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {context === "hba1c" ? (
                    <div className="p-3.5 rounded-2xl bg-background/80 backdrop-blur-sm border border-border/60 text-center col-span-2 sm:col-span-1">
                      <span className="text-[11px] text-muted-foreground font-medium block">
                        {isEn ? "HbA1c Level" : "HbA1c মাত্রা"}
                      </span>
                      <div className="text-2xl font-black font-mono text-secondary dark:text-white">
                        {formatNum(result.valueMmol, locale)}%
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="p-3.5 rounded-2xl bg-background/80 backdrop-blur-sm border border-border/60 text-center">
                        <span className="text-[11px] text-muted-foreground font-medium block">
                          {isEn ? "mmol/L Value" : "mmol/L মান"}
                        </span>
                        <div className="text-xl sm:text-2xl font-black font-mono text-secondary dark:text-white">
                          {formatNum(result.valueMmol, locale)}
                          <span className="text-xs font-normal text-muted-foreground ml-1">mmol/L</span>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-background/80 backdrop-blur-sm border border-border/60 text-center">
                        <span className="text-[11px] text-muted-foreground font-medium block">
                          {isEn ? "mg/dL Equivalent" : "mg/dL সমমান"}
                        </span>
                        <div className="text-xl sm:text-2xl font-black font-mono text-secondary dark:text-white">
                          {formatNum(result.valueMgDl, locale)}
                          <span className="text-xs font-normal text-muted-foreground ml-1">mg/dL</span>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="p-3.5 rounded-2xl bg-background/80 backdrop-blur-sm border border-border/60 text-center col-span-2 sm:col-span-1">
                    <span className="text-[11px] text-muted-foreground font-medium block">
                      {isEn ? "Target Standard" : "আদর্শ লক্ষ্যমাত্রা"}
                    </span>
                    <div className="text-xs font-bold text-secondary dark:text-white pt-1">
                      {isEn ? result.targetRangeEn : result.targetRangeBn}
                    </div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-secondary/90 dark:text-white/90 leading-relaxed font-medium">
                  {isEn ? result.summaryEn : result.summaryBn}
                </p>

                {/* Spectrum Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-[10px] font-bold text-muted-foreground">
                    <span>{isEn ? "Hypo" : "লো সুগার"}</span>
                    <span>{isEn ? "Normal" : "স্বাভাবিক"}</span>
                    <span>{isEn ? "Pre-diabetes" : "প্রাক-ডায়াবেটিস"}</span>
                    <span>{isEn ? "Diabetes" : "ডায়াবেটিস"}</span>
                    <span>{isEn ? "Severe High" : "অত্যন্ত উচ্চ"}</span>
                  </div>
                  <div className="h-3.5 w-full bg-muted rounded-full overflow-hidden flex gap-0.5 p-0.5 border border-border/80">
                    <div
                      className={`h-full flex-1 rounded-l-full ${
                        result.category === "hypoglycemia" ? "bg-amber-600 ring-2 ring-amber-300" : "bg-amber-500/40"
                      }`}
                    />
                    <div
                      className={`h-full flex-1 ${
                        result.category === "normal" ? "bg-primary ring-2 ring-emerald-300" : "bg-primary/40"
                      }`}
                    />
                    <div
                      className={`h-full flex-1 ${
                        result.category === "prediabetes" ? "bg-orange-500 ring-2 ring-orange-300" : "bg-orange-400/40"
                      }`}
                    />
                    <div
                      className={`h-full flex-1 ${
                        result.category === "diabetes" ? "bg-red-500 ring-2 ring-red-300" : "bg-red-400/40"
                      }`}
                    />
                    <div
                      className={`h-full flex-1 rounded-r-full ${
                        result.category === "severe_hyperglycemia"
                          ? "bg-rose-600 ring-2 ring-rose-300 animate-pulse"
                          : "bg-rose-600/40"
                      }`}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sub-Tabs for Clinical Care & Diet */}
            <Card className="border border-border/80 bg-background shadow-sm rounded-3xl overflow-hidden">
              <CardContent className="p-5 sm:p-7 space-y-6">
                <div className="flex border-b border-border/80 pb-3 gap-2 overflow-x-auto scrollbar-none">
                  <button
                    type="button"
                    onClick={() => setActiveSubTab("action")}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                      activeSubTab === "action"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <HeartHandshake className="h-4 w-4" />
                    <span>{isEn ? "Action Plan" : "অ্যাকশন প্ল্যান"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveSubTab("diet")}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                      activeSubTab === "diet"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <Salad className="h-4 w-4" />
                    <span>{isEn ? "Diabetic Nutrition" : "খাদ্যাভ্যাস ও পুষ্টি"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveSubTab("warnings")}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                      activeSubTab === "warnings"
                        ? "bg-rose-600 text-white shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <ShieldAlert className="h-4 w-4" />
                    <span>{isEn ? "Warning Symptoms" : "বিপদ লক্ষণ"}</span>
                  </button>
                </div>

                {activeSubTab === "action" && (
                  <div className="space-y-3 animate-in fade-in-50 duration-200">
                    <h5 className="text-xs font-bold text-secondary dark:text-white uppercase tracking-wider">
                      {isEn ? "Medical Care & Lifestyle Steps:" : "করণীয় পদক্ষেপ ও চিকিৎসা নির্দেশনা:"}
                    </h5>
                    <ul className="space-y-2.5">
                      {(isEn ? result.actionPlanEn : result.actionPlanBn).map((act, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-muted-foreground leading-relaxed">
                          <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeSubTab === "diet" && (
                  <div className="space-y-3 animate-in fade-in-50 duration-200">
                    <h5 className="text-xs font-bold text-secondary dark:text-white uppercase tracking-wider">
                      {isEn ? "Diabetic Meal & Carbohydrate Advice:" : "ডায়াবেটিস খাদ্যতালিকা ও পুষ্টি পরামর্শ:"}
                    </h5>
                    <ul className="space-y-2.5">
                      {(isEn ? result.dietTipsEn : result.dietTipsBn).map((diet, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-muted-foreground leading-relaxed">
                          <Apple className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                          <span>{diet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeSubTab === "warnings" && (
                  <div className="space-y-3 animate-in fade-in-50 duration-200">
                    <h5 className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                      {isEn ? "Emergency Symptoms to Watch For:" : "জরুরি লক্ষণ বা বিপদচিহ্ন:"}
                    </h5>
                    <ul className="space-y-2.5">
                      {(isEn ? result.warningSignsEn : result.warningSignsBn).map((warn, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-muted-foreground leading-relaxed">
                          <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                          <span>{warn}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Doctor Referral Link */}
                <div className="pt-2 border-t border-border/60">
                  <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-primary text-white flex items-center justify-center shrink-0">
                        <Stethoscope className="h-5 w-5" />
                      </div>
                      <div className="text-xs">
                        <div className="font-bold text-secondary dark:text-white">
                          {isEn ? "Recommended Consultation:" : "পরামর্শযোগ্য বিশেষজ্ঞ:"}
                        </div>
                        <div className="text-muted-foreground font-medium">
                          {isEn ? result.recommendedDoctorEn : result.recommendedDoctorBn}
                        </div>
                      </div>
                    </div>
                    <Link
                      href="/consultants"
                      className={buttonVariants({
                        size: "sm",
                        className: "w-full sm:w-auto text-xs font-bold shrink-0",
                      })}
                    >
                      <span>{isEn ? "Find Diabetologist in Feni" : "ডায়াবেটিস ডাক্তার খুঁজুন"}</span>
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
