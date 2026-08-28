"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Activity, Scale, Sparkles, RotateCcw } from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { formatNum } from "@/lib/i18n";
import { trackEvent } from "@/lib/analytics";

export function BmiCalculator() {
  const { locale, t } = useLanguage();
  const isEn = locale === "en";

  const [unit, setUnit] = useState<"ft" | "cm">("ft");
  const [feet, setFeet] = useState("");
  const [inches, setInches] = useState("");
  const [cm, setCm] = useState("");
  const [weightKg, setWeightKg] = useState("");

  const [bmiResult, setBmiResult] = useState<{
    bmi: number;
    category: "underweight" | "normal" | "overweight" | "obese";
    idealMin: number;
    idealMax: number;
  } | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();

    let heightInMeters = 0;
    if (unit === "ft") {
      const ftVal = parseFloat(feet) || 0;
      const inVal = parseFloat(inches) || 0;
      const totalInches = ftVal * 12 + inVal;
      if (totalInches <= 0) return;
      heightInMeters = totalInches * 0.0254;
    } else {
      const cmVal = parseFloat(cm) || 0;
      if (cmVal <= 0) return;
      heightInMeters = cmVal / 100;
    }

    const weight = parseFloat(weightKg) || 0;
    if (weight <= 0 || heightInMeters <= 0) return;

    const bmi = weight / (heightInMeters * heightInMeters);
    const idealMin = 18.5 * (heightInMeters * heightInMeters);
    const idealMax = 24.9 * (heightInMeters * heightInMeters);

    let category: "underweight" | "normal" | "overweight" | "obese" = "normal";
    if (bmi < 18.5) category = "underweight";
    else if (bmi < 25) category = "normal";
    else if (bmi < 30) category = "overweight";
    else category = "obese";

    setBmiResult({
      bmi: parseFloat(bmi.toFixed(1)),
      category,
      idealMin: Math.round(idealMin),
      idealMax: Math.round(idealMax),
    });

    trackEvent("health_tool_used", {
      tool_name: "bmi",
      result_status: category,
    });
  };

  const handleReset = () => {
    setFeet("");
    setInches("");
    setCm("");
    setWeightKg("");
    setBmiResult(null);
  };

  const getCategoryDetails = () => {
    if (!bmiResult) return null;
    switch (bmiResult.category) {
      case "underweight":
        return {
          title: t("healthTools.bmi.underweight"),
          color: "text-amber-500",
          bgColor: "bg-amber-500/10 border-amber-500/30",
          badgeBg: "bg-amber-500 text-white",
          advice: t("healthTools.bmi.underweightAdvice"),
        };
      case "normal":
        return {
          title: t("healthTools.bmi.normal"),
          color: "text-primary",
          bgColor: "bg-primary/10 border-primary/30",
          badgeBg: "bg-primary text-white",
          advice: t("healthTools.bmi.normalAdvice"),
        };
      case "overweight":
        return {
          title: t("healthTools.bmi.overweight"),
          color: "text-orange-500",
          bgColor: "bg-orange-500/10 border-orange-500/30",
          badgeBg: "bg-orange-500 text-white",
          advice: t("healthTools.bmi.overweightAdvice"),
        };
      case "obese":
        return {
          title: t("healthTools.bmi.obese"),
          color: "text-rose-500",
          bgColor: "bg-rose-500/10 border-rose-500/30",
          badgeBg: "bg-rose-600 text-white",
          advice: t("healthTools.bmi.obeseAdvice"),
        };
    }
  };

  const catDetails = getCategoryDetails();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Input Form Card */}
      <Card className="lg:col-span-6 border border-border/80 bg-background shadow-sm rounded-3xl">
        <CardContent className="p-5 sm:p-7 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Scale className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base sm:text-lg text-secondary dark:text-white">
                  {t("healthTools.bmi.title")}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {t("healthTools.bmi.subtitle")}
                </p>
              </div>
            </div>

            {/* Unit Toggle */}
            <div
              role="radiogroup"
              aria-label={isEn ? "Height measurement unit" : "উচ্চতা পরিমাপের একক"}
              className="flex bg-muted p-1 rounded-xl text-xs font-semibold"
            >
              <button
                type="button"
                role="radio"
                aria-checked={unit === "ft"}
                onClick={() => setUnit("ft")}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  unit === "ft" ? "bg-background text-foreground shadow-xs font-bold" : "text-muted-foreground"
                }`}
              >
                {t("healthTools.bmi.unitFt")}
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={unit === "cm"}
                onClick={() => setUnit("cm")}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  unit === "cm" ? "bg-background text-foreground shadow-xs font-bold" : "text-muted-foreground"
                }`}
              >
                {t("healthTools.bmi.unitCm")}
              </button>
            </div>
          </div>

          <form onSubmit={handleCalculate} className="space-y-4">
            {/* Height Fields */}
            {unit === "ft" ? (
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">
                  {t("healthTools.bmi.heightFtIn")}
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Input
                      id="height-feet"
                      aria-label={t("healthTools.bmi.heightFtIn")}
                      type="number"
                      step="1"
                      min="1"
                      max="8"
                      placeholder={t("healthTools.bmi.feetPlaceholder")}
                      value={feet}
                      onChange={(e) => setFeet(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Input
                      id="height-inches"
                      aria-label={t("healthTools.bmi.heightFtIn")}
                      type="number"
                      step="1"
                      min="0"
                      max="11"
                      placeholder={t("healthTools.bmi.inchesPlaceholder")}
                      value={inches}
                      onChange={(e) => setInches(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <Label htmlFor="height-cm" className="text-xs font-semibold">
                  {t("healthTools.bmi.heightCm")}
                </Label>
                <Input
                  id="height-cm"
                  type="number"
                  step="0.5"
                  min="50"
                  max="260"
                  placeholder={t("healthTools.bmi.cmPlaceholder")}
                  value={cm}
                  onChange={(e) => setCm(e.target.value)}
                  required
                />
              </div>
            )}

            {/* Weight Field */}
            <div className="space-y-1.5">
              <Label htmlFor="weight-kg" className="text-xs font-semibold">
                {t("healthTools.bmi.weight")}
              </Label>
              <Input
                id="weight-kg"
                type="number"
                step="0.5"
                min="10"
                max="250"
                placeholder={t("healthTools.bmi.weightPlaceholder")}
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                required
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="submit" className="flex-1 font-bold">
                <Activity className="mr-2 h-4 w-4" />
                {t("healthTools.bmi.calculate")}
              </Button>
              {bmiResult && (
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
      <Card className="lg:col-span-6 border border-border/80 bg-background shadow-sm rounded-3xl h-full flex flex-col justify-center">
        <CardContent className="p-5 sm:p-7">
          {bmiResult && catDetails ? (
            <div className="space-y-5">
              <div className="text-center space-y-2">
                <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                  {t("healthTools.bmi.scoreTitle")}
                </span>
                <div className="flex items-baseline justify-center gap-1">
                  <span className={`text-5xl sm:text-6xl font-black font-mono ${catDetails.color}`}>
                    {formatNum(bmiResult.bmi, locale)}
                  </span>
                  <span className="text-sm font-semibold text-muted-foreground">kg/m²</span>
                </div>
                <div className="pt-1">
                  <Badge className={`${catDetails.badgeBg} text-xs sm:text-sm font-bold px-3 py-1`}>
                    {catDetails.title}
                  </Badge>
                </div>
              </div>

              {/* Progress Gauge */}
              <div className="space-y-1.5 pt-2">
                <div className="h-3 w-full rounded-full bg-gradient-to-r from-amber-400 via-emerald-500 via-orange-400 to-rose-500 overflow-hidden relative" />
                <div className="flex justify-between text-[10px] text-muted-foreground font-mono font-semibold px-0.5">
                  <span>{formatNum(18.5, locale)}</span>
                  <span>{formatNum(25, locale)}</span>
                  <span>{formatNum(30, locale)}</span>
                </div>
              </div>

              {/* Ideal Weight Box */}
              <div className="p-3.5 rounded-2xl bg-muted/60 border border-border/60 flex items-center justify-between text-xs sm:text-sm">
                <span className="text-muted-foreground font-medium">
                  {t("healthTools.bmi.idealRange")}
                </span>
                <span className="font-bold text-foreground font-mono">
                  {formatNum(bmiResult.idealMin, locale)} - {formatNum(bmiResult.idealMax, locale)} {isEn ? "kg" : "কেজি"}
                </span>
              </div>

              {/* Health Advice Box */}
              <div className={`p-4 rounded-2xl border ${catDetails.bgColor} space-y-1.5`}>
                <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-foreground">
                  <Sparkles className="h-4 w-4 text-primary shrink-0" />
                  <span>{t("healthTools.bmi.recommendation")}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {catDetails.advice}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 space-y-3">
              <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                <Activity className="h-8 w-8" />
              </div>
              <div className="space-y-1 max-w-sm mx-auto">
                <h4 className="font-heading font-bold text-base text-secondary dark:text-white">
                  {t("healthTools.bmi.emptyTitle")}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t("healthTools.bmi.emptyDesc")}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
