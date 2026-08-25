"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Flame, Sparkles, RotateCcw } from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { formatNum } from "@/lib/i18n";
import { trackEvent } from "@/lib/analytics";

export function CalorieCalculator() {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  const [gender, setGender] = useState<"male" | "female">("male");
  const [age, setAge] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [activity, setActivity] = useState<"sedentary" | "light" | "moderate" | "active">("sedentary");

  const [result, setResult] = useState<{
    bmr: number;
    maintenance: number;
    weightLoss: number;
    weightGain: number;
  } | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const a = parseFloat(age) || 0;
    const h = parseFloat(heightCm) || 0;
    const w = parseFloat(weightKg) || 0;

    if (a <= 0 || h <= 0 || w <= 0) return;

    // Mifflin-St Jeor Equation
    let bmr = 10 * w + 6.25 * h - 5 * a;
    if (gender === "male") {
      bmr += 5;
    } else {
      bmr -= 161;
    }

    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
    };

    const maintenance = Math.round(bmr * activityMultipliers[activity]);
    const weightLoss = Math.max(1200, maintenance - 500);
    const weightGain = maintenance + 400;

    setResult({
      bmr: Math.round(bmr),
      maintenance,
      weightLoss,
      weightGain,
    });

    trackEvent("health_tool_used", {
      tool_name: "calorie",
      result_status: `${maintenance}kcal`,
    });
  };

  const handleReset = () => {
    setAge("");
    setHeightCm("");
    setWeightKg("");
    setActivity("sedentary");
    setResult(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Form Card */}
      <Card className="lg:col-span-6 border border-border/80 bg-background shadow-sm rounded-3xl">
        <CardContent className="p-5 sm:p-7 space-y-5">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-600">
              <Flame className="h-5 w-5 fill-orange-500/20" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base sm:text-lg text-secondary dark:text-white">
                {isEn ? "Daily Calorie & BMR Calculator" : "দৈনিক ক্যালোরি ও BMR ক্যালকুলেটর"}
              </h3>
              <p className="text-xs text-muted-foreground">
                {isEn ? "Determine calories for weight maintenance/loss" : "ওজন নিয়ন্ত্রণ ও ফিটনেসের জন্য প্রয়োজনীয় ক্যালোরি"}
              </p>
            </div>
          </div>

          <form onSubmit={handleCalculate} className="space-y-4">
            {/* Gender */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">
                {isEn ? "Gender" : "লিঙ্গ"}
              </Label>
              <div
                role="radiogroup"
                aria-label={isEn ? "Gender" : "লিঙ্গ"}
                className="grid grid-cols-2 gap-2"
              >
                <button
                  type="button"
                  role="radio"
                  aria-checked={gender === "male"}
                  onClick={() => setGender("male")}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    gender === "male"
                      ? "bg-orange-600 text-white border-orange-600 shadow-xs"
                      : "bg-background hover:bg-muted text-muted-foreground border-border"
                  }`}
                >
                  {isEn ? "Male (পুরুষ)" : "পুরুষ"}
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={gender === "female"}
                  onClick={() => setGender("female")}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    gender === "female"
                      ? "bg-orange-600 text-white border-orange-600 shadow-xs"
                      : "bg-background hover:bg-muted text-muted-foreground border-border"
                  }`}
                >
                  {isEn ? "Female (নারী)" : "নারী"}
                </button>
              </div>
            </div>

            {/* Age, Height, Weight */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="cal-age" className="text-xs font-semibold">
                  {isEn ? "Age (Years)" : "বয়স (বছর)"}
                </Label>
                <Input
                  id="cal-age"
                  type="number"
                  placeholder="28"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cal-height" className="text-xs font-semibold">
                  {isEn ? "Height (CM)" : "উচ্চতা (CM)"}
                </Label>
                <Input
                  id="cal-height"
                  type="number"
                  placeholder="170"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cal-weight" className="text-xs font-semibold">
                  {isEn ? "Weight (KG)" : "ওজন (কেজি)"}
                </Label>
                <Input
                  id="cal-weight"
                  type="number"
                  placeholder="65"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Activity Level */}
            <div className="space-y-1.5">
              <Label htmlFor="cal-activity" className="text-xs font-semibold">
                {isEn ? "Activity Level" : "দৈনিক অ্যাক্টিভিটি লেভেল"}
              </Label>
              <select
                id="cal-activity"
                value={activity}
                onChange={(e) => setActivity(e.target.value as typeof activity)}
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-xs sm:text-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/20"
              >
                <option value="sedentary">
                  {isEn ? "Sedentary (Desk job, minimal exercise)" : "ডেস্ক জব / স্বাভাবিক চলাফেরা"}
                </option>
                <option value="light">
                  {isEn ? "Light Activity (1-3 days/week exercise)" : "হালকা ব্যায়াম (সপ্তাহে ১-৩ দিন)"}
                </option>
                <option value="moderate">
                  {isEn ? "Moderate (3-5 days/week exercise)" : "মাঝারি ব্যায়াম (সপ্তাহে ৩-৫ দিন)"}
                </option>
                <option value="active">
                  {isEn ? "Very Active (Daily intense workout)" : "ভারী শরীরচর্চা / সক্রিয় অ্যাথলেট"}
                </option>
              </select>
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="submit" className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold cursor-pointer">
                <Flame className="mr-2 h-4 w-4 fill-white" />
                {isEn ? "Calculate Calories" : "ক্যালোরি হিসেব করুন"}
              </Button>
              {result && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  size="icon"
                  aria-label={isEn ? "Reset calculator" : "ক্যালকুলেটর রিসেট করুন"}
                  className="cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Results Card */}
      <Card className="lg:col-span-6 border border-border/80 bg-background shadow-sm rounded-3xl h-full flex flex-col justify-center">
        <CardContent className="p-5 sm:p-7">
          {result ? (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                  {isEn ? "Maintenance Calories" : "ওজন ঠিক রাখতে দৈনিক ক্যালোরি"}
                </span>
                <div className="flex items-baseline justify-center gap-1.5">
                  <span className="text-5xl font-black font-mono text-orange-600">
                    {formatNum(result.maintenance, locale)}
                  </span>
                  <span className="text-sm font-semibold text-muted-foreground">kcal / day</span>
                </div>
              </div>

              {/* Breakdown Grid */}
              <div className="grid grid-cols-3 gap-2.5 pt-2">
                <div className="p-3 rounded-2xl bg-muted/60 border border-border/60 text-center space-y-1">
                  <span className="text-[10px] text-muted-foreground font-semibold block uppercase">
                    {isEn ? "Base BMR" : "বেসিক BMR"}
                  </span>
                  <span className="text-sm font-bold font-mono text-foreground">
                    {formatNum(result.bmr, locale)}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-1">
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-semibold block uppercase">
                    {isEn ? "Weight Loss" : "ওজন কমাতে"}
                  </span>
                  <span className="text-sm font-bold font-mono text-emerald-600">
                    {formatNum(result.weightLoss, locale)}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-center space-y-1">
                  <span className="text-[10px] text-blue-700 dark:text-blue-300 font-semibold block uppercase">
                    {isEn ? "Weight Gain" : "ওজন বাড়াতে"}
                  </span>
                  <span className="text-sm font-bold font-mono text-blue-600">
                    {formatNum(result.weightGain, locale)}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-muted/40 border border-border text-xs text-muted-foreground flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-orange-500 shrink-0" />
                <span>
                  {isEn
                    ? "Based on Mifflin-St Jeor scientific formula. For clinical nutrition, consult our listed doctors."
                    : "বিজ্ঞানের প্রখ্যাত মিফলিন ফর্মুলা দ্বারা গণনাকৃত। বিশেষ ডায়েট চার্টের জন্য পুষ্টিবিদের পরামর্শ নিন।"}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 space-y-3">
              <div className="h-16 w-16 rounded-full bg-orange-500/10 text-orange-600 flex items-center justify-center mx-auto">
                <Flame className="h-8 w-8 fill-orange-500/20" />
              </div>
              <div className="space-y-1 max-w-sm mx-auto">
                <h4 className="font-heading font-bold text-base text-secondary dark:text-white">
                  {isEn ? "Smart Calorie Calculator" : "স্মার্ট ক্যালোরি ট্র্যাকার"}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {isEn
                    ? "Find out how many calories your body needs every day to stay healthy, lose fat, or build muscle."
                    : "ফিটনেস ও সুস্বাস্থ্যের জন্য প্রতিদিন কত ক্যালোরি গ্রহণ করা উচিত তা সহজেই গণনা করুন।"}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
