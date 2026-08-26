"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Activity,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { toast } from "sonner";
import {
  evaluateBloodGlucose,
  convertGlucose,
  GlucoseContext,
  GlucoseUnit,
  GlucoseEvaluationResult,
} from "@/data/clinicalEvaluatorData";
import { trackEvent } from "@/lib/analytics";
import { DiabetesResultView } from "./DiabetesResultView";

export function DiabetesEvaluatorTab() {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  const [context, setContext] = useState<GlucoseContext>("fasting");
  const [unit, setUnit] = useState<GlucoseUnit>("mmol");
  const [inputValue, setInputValue] = useState("5.2");

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
      if (val < 20.0 || val > 800.0) {
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
      result_status: `GLUCOSE_${evaluation.category}_${context}`,
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
  };

  const applyPreset = (val: number, ctx: GlucoseContext, u: GlucoseUnit) => {
    setContext(ctx);
    setUnit(u);
    setInputValue(val.toString());
    setResult(evaluateBloodGlucose(val, ctx, u));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
      {/* Form Input Section */}
      <Card className="lg:col-span-5 border border-border/80 bg-background shadow-sm rounded-3xl overflow-hidden">
        <CardContent className="p-5 sm:p-7 space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-heading font-black text-secondary dark:text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <span>{isEn ? "Blood Sugar Entry" : "রক্তের শর্করার তথ্য দিন"}</span>
            </h3>
            <p className="text-xs text-muted-foreground">
              {isEn
                ? "Select test condition (Fasting/RBS/HbA1c) and enter your reading."
                : "খালি পেট, খাওয়ার পর বা ৩ মাসের গড় (HbA1c) রিপোর্ট অনুযায়ী মান দিন।"}
            </p>
          </div>

          {/* Test Context Selector */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-secondary dark:text-white">
              {isEn ? "Test Condition / Type:" : "টেস্টের ধরন / সময়:"}
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
                  {isEn ? "Fasting Sugar (FBS)" : "খালি পেটে (FBS)"}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {isEn ? "8+ hrs no food" : "৮ ঘণ্টা অভুক্ত অবস্থায়"}
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
                  {isEn ? "2-Hrs Post-Meal (2ABF)" : "খাওয়ার ২ ঘণ্টা পর"}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {isEn ? "After main meal" : "মূল খাবারের ২ ঘণ্টা পর"}
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
          <DiabetesResultView
            result={result}
            context={context}
            locale={locale}
          />
        )}
      </div>
    </div>
  );
}
