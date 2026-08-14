"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Droplet, Sparkles, GlassWater, RotateCcw } from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { formatNum } from "@/lib/i18n";

export function WaterIntakeCalculator() {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  const [weightKg, setWeightKg] = useState("");
  const [activityLevel, setActivityLevel] = useState<"sedentary" | "moderate" | "heavy">("sedentary");
  const [weather, setWeather] = useState<"normal" | "hot">("normal");

  const [result, setResult] = useState<{
    liters: number;
    glasses: number;
  } | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const weight = parseFloat(weightKg) || 0;
    if (weight <= 0) return;

    // Base: 35ml per kg of body weight
    let totalMl = weight * 35;

    // Activity adjustment
    if (activityLevel === "moderate") totalMl += 500;
    if (activityLevel === "heavy") totalMl += 1000;

    // Weather adjustment
    if (weather === "hot") totalMl += 500;

    const liters = totalMl / 1000;
    const glasses = Math.round(totalMl / 250);

    setResult({
      liters: parseFloat(liters.toFixed(1)),
      glasses,
    });
  };

  const handleReset = () => {
    setWeightKg("");
    setActivityLevel("sedentary");
    setWeather("normal");
    setResult(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Input Form */}
      <Card className="lg:col-span-6 border border-border/80 bg-background shadow-sm rounded-3xl">
        <CardContent className="p-5 sm:p-7 space-y-5">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-600">
              <Droplet className="h-5 w-5 fill-cyan-500/20" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base sm:text-lg text-secondary dark:text-white">
                {isEn ? "Daily Water Intake Calculator" : "দৈনিক পানির চাহিদা ক্যালকুলেটর"}
              </h3>
              <p className="text-xs text-muted-foreground">
                {isEn ? "Hydration requirement by body weight" : "শরীরের ওজন ও কাজের মাত্রা অনুযায়ী পানির পরিমাণ"}
              </p>
            </div>
          </div>

          <form onSubmit={handleCalculate} className="space-y-4">
            {/* Weight */}
            <div className="space-y-1.5">
              <Label htmlFor="water-weight" className="text-xs font-semibold">
                {isEn ? "Your Weight (Kilograms)" : "আপনার ওজন (কেজি - KG)"}
              </Label>
              <Input
                id="water-weight"
                type="number"
                step="0.5"
                min="10"
                max="250"
                placeholder={isEn ? "e.g. 65" : "যেমন: ৬৫"}
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                required
              />
            </div>

            {/* Activity */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">
                {isEn ? "Daily Physical Activity" : "দৈনিক কাজের / শারীরিক সক্রিয়তার মাত্রা"}
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "sedentary", bn: "স্বাভাবিক / কম", en: "Light" },
                  { id: "moderate", bn: "মাঝারি পরিশ্রম", en: "Moderate" },
                  { id: "heavy", bn: "ভারী ব্যায়াম", en: "Heavy" },
                ].map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setActivityLevel(item.id as typeof activityLevel)}
                    className={`py-2 px-1 text-xs font-bold rounded-xl border transition-all text-center ${
                      activityLevel === item.id
                        ? "bg-cyan-600 text-white border-cyan-600 shadow-xs"
                        : "bg-background hover:bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    {isEn ? item.en : item.bn}
                  </button>
                ))}
              </div>
            </div>

            {/* Climate / Weather */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">
                {isEn ? "Climate / Season" : "আবহাওয়া ও পরিবেশ"}
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setWeather("normal")}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    weather === "normal"
                      ? "bg-cyan-600 text-white border-cyan-600 shadow-xs"
                      : "bg-background hover:bg-muted text-muted-foreground border-border"
                  }`}
                >
                  {isEn ? "Normal / Winter" : "স্বাভাবিক / শীতকাল"}
                </button>
                <button
                  type="button"
                  onClick={() => setWeather("hot")}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    weather === "hot"
                      ? "bg-cyan-600 text-white border-cyan-600 shadow-xs"
                      : "bg-background hover:bg-muted text-muted-foreground border-border"
                  }`}
                >
                  {isEn ? "Hot / Summer" : "গরম / অতিরিক্ত ঘাম"}
                </button>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="submit" className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-bold">
                <Droplet className="mr-2 h-4 w-4 fill-white" />
                {isEn ? "Calculate Water" : "পানির পরিমাণ হিসেব করুন"}
              </Button>
              {result && (
                <Button type="button" variant="outline" onClick={handleReset} size="icon">
                  <RotateCcw className="h-4 w-4" />
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Result Card */}
      <Card className="lg:col-span-6 border border-border/80 bg-background shadow-sm rounded-3xl h-full flex flex-col justify-center">
        <CardContent className="p-5 sm:p-7">
          {result ? (
            <div className="space-y-5 text-center">
              <div className="space-y-2">
                <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                  {isEn ? "Daily Recommended Hydration" : "আপনার দৈনিক পানির লক্ষ্যমাত্রা"}
                </span>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl sm:text-6xl font-black font-mono text-cyan-600">
                    {formatNum(result.liters, locale)}
                  </span>
                  <span className="text-lg font-bold text-muted-foreground">
                    {isEn ? "Liters / Day" : "লিটার / দিন"}
                  </span>
                </div>
              </div>

              {/* Glass Visualizer */}
              <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center gap-3">
                <GlassWater className="h-6 w-6 text-cyan-600" />
                <span className="text-sm sm:text-base font-bold text-secondary dark:text-white">
                  {isEn ? "Approximately" : "আনুমানিক"}{" "}
                  <strong className="text-cyan-600 font-mono text-lg">{formatNum(result.glasses, locale)}</strong>{" "}
                  {isEn ? "glasses of 250ml water" : "গ্লাস (২৫০ মি.লি.) পানি"}
                </span>
              </div>

              {/* Hydration Tips */}
              <div className="p-4 rounded-2xl bg-muted/60 border border-border text-left space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                  <Sparkles className="h-3.5 w-3.5 text-cyan-600" />
                  <span>{isEn ? "Healthy Hydration Tips" : "সুস্থ থাকার হাইড্রেশন টিপস"}</span>
                </div>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside leading-relaxed">
                  <li>
                    {isEn
                      ? "Drink a glass of water right after waking up in the morning."
                      : "ঘুম থেকে উঠে সকালে ১ গ্লাস স্বাভাবিক তাপমাত্রার পানি পান করুন।"}
                  </li>
                  <li>
                    {isEn
                      ? "Avoid drinking excessive water during heavy meals; drink 30 mins before or after."
                      : "ভারী খাবার খাওয়ার ঠিক সাথে সাথে অতিরিক্ত পানি না খেয়ে ৩০ মিনিট আগে বা পরে পান করুন।"}
                  </li>
                  <li>
                    {isEn
                      ? "Carry a water bottle when heading out during sunny weather."
                      : "বাইরে বের হলে সব সময় সাথে পানির বোতল রাখুন।"}
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 space-y-3">
              <div className="h-16 w-16 rounded-full bg-cyan-500/10 text-cyan-600 flex items-center justify-center mx-auto">
                <Droplet className="h-8 w-8 fill-cyan-500/20" />
              </div>
              <div className="space-y-1 max-w-sm mx-auto">
                <h4 className="font-heading font-bold text-base text-secondary dark:text-white">
                  {isEn ? "Know Your Hydration Level" : "জানুন দৈনিক কতটুকু পানি প্রয়োজন"}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {isEn
                    ? "Proper hydration boosts immunity and organ health. Calculate your body's specific need."
                    : "পর্যাপ্ত পানি পানে কিডনি ও ত্বক সুস্থ থাকে। আপনার শরীরের ওজন দিয়ে সঠিক চাহিদা বের করুন।"}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
