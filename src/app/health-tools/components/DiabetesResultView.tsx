"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  HeartHandshake,
  Apple,
  ArrowRight,
  ShieldAlert,
  Stethoscope,
  CheckCircle2,
  Salad,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { formatNum, Locale } from "@/lib/i18n";
import {
  GlucoseEvaluationResult,
  GlucoseContext,
} from "@/data/clinicalEvaluatorData";

interface DiabetesResultViewProps {
  result: GlucoseEvaluationResult;
  context: GlucoseContext;
  locale: Locale;
}

export function DiabetesResultView({
  result,
  context,
  locale,
}: DiabetesResultViewProps) {
  const isEn = locale === "en";
  const [activeSubTab, setActiveSubTab] = useState<"action" | "diet" | "warnings">("action");

  return (
    <div className="space-y-6">
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
    </div>
  );
}
