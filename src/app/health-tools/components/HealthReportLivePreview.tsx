"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Printer,
  Scale,
  Flame,
  Droplet,
  HeartPulse,
  Stethoscope,
} from "lucide-react";
import { formatNum, Locale } from "@/lib/i18n";
import { HealthAssessmentReport } from "@/lib/healthReportPdf";

interface HealthReportLivePreviewProps {
  isEn: boolean;
  locale: Locale;
  mobileTab: "form" | "preview";
  currentReport: HealthAssessmentReport;
  handlePrintReport: () => void;
}

export function HealthReportLivePreview({
  isEn,
  locale,
  mobileTab,
  currentReport,
  handlePrintReport,
}: HealthReportLivePreviewProps) {
  return (
    <div className={`lg:col-span-5 space-y-3.5 ${mobileTab === "preview" ? "block" : "hidden lg:block"}`}>
      <div className="space-y-3 bg-gradient-to-br from-muted/50 to-primary/5 p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl border border-border/80">
        <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
          <div>
            <h5 className="font-heading font-bold text-xs sm:text-sm text-foreground">
              {isEn ? "Live Assessment Summary" : "লাইভ মূল্যায়ন সামারি"}
            </h5>
            <p className="text-[10px] text-muted-foreground font-mono">
              {currentReport.reportId}
            </p>
          </div>
          <div className="text-right">
            <span className="text-lg sm:text-xl font-extrabold text-primary font-heading">
              {currentReport.overallScore}
              <span className="text-[10px] font-normal text-muted-foreground">/100</span>
            </span>
            <p className="text-[9px] font-bold text-emerald-600">
              {isEn ? "Health Score" : "হেলথ স্কোর"}
            </p>
          </div>
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 sm:p-2.5 rounded-xl bg-background border border-border/60 space-y-0.5">
            <div className="flex items-center gap-1 text-muted-foreground text-[10px]">
              <Scale className="h-3 w-3 text-primary" />
              <span>BMI</span>
            </div>
            <div className="font-bold text-xs sm:text-sm text-foreground">
              {currentReport.bmi}{" "}
              <span className="text-[9px] font-normal text-muted-foreground">kg/m²</span>
            </div>
            <Badge variant="outline" className="text-[8.5px] py-0 px-1 font-semibold truncate max-w-full">
              {isEn ? currentReport.bmiCategoryEn : currentReport.bmiCategoryBn}
            </Badge>
          </div>

          <div className="p-2 sm:p-2.5 rounded-xl bg-background border border-border/60 space-y-0.5">
            <div className="flex items-center gap-1 text-muted-foreground text-[10px]">
              <Flame className="h-3 w-3 text-orange-500" />
              <span>{isEn ? "Calories" : "ক্যালোরি"}</span>
            </div>
            <div className="font-bold text-xs sm:text-sm text-foreground">
              {formatNum(currentReport.maintenanceCalories, locale)}{" "}
              <span className="text-[9px] font-normal text-muted-foreground">kcal</span>
            </div>
            <p className="text-[9px] text-muted-foreground truncate">
              {isEn ? "Daily target" : "দৈনিক চাহিদা"}
            </p>
          </div>

          <div className="p-2 sm:p-2.5 rounded-xl bg-background border border-border/60 space-y-0.5">
            <div className="flex items-center gap-1 text-muted-foreground text-[10px]">
              <Droplet className="h-3 w-3 text-cyan-500" />
              <span>{isEn ? "Hydration" : "পানি"}</span>
            </div>
            <div className="font-bold text-xs sm:text-sm text-foreground">
              {formatNum(currentReport.dailyWaterLiters, locale)} L
            </div>
            <p className="text-[9px] text-muted-foreground truncate">
              {isEn
                ? `~${currentReport.dailyGlasses} glasses`
                : `~${formatNum(currentReport.dailyGlasses, locale)} গ্লাস`}
            </p>
          </div>

          <div className="p-2 sm:p-2.5 rounded-xl bg-background border border-border/60 space-y-0.5">
            <div className="flex items-center gap-1 text-muted-foreground text-[10px]">
              <HeartPulse className="h-3 w-3 text-rose-500" />
              <span>BP & Sugar</span>
            </div>
            <div className="font-bold text-xs text-foreground">
              {currentReport.bpEvaluation
                ? `${currentReport.bpEvaluation.systolic}/${currentReport.bpEvaluation.diastolic}`
                : "120/80"}
            </div>
            <p className="text-[9px] font-medium text-primary truncate">
              {currentReport.bpEvaluation
                ? isEn
                  ? currentReport.bpEvaluation.badgeEn
                  : currentReport.bpEvaluation.badgeBn
                : isEn
                ? "Optimal"
                : "স্বাভাবিক"}
            </p>
          </div>
        </div>

        {/* Specialist Referral Note */}
        <div className="p-2 sm:p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[10.5px] text-emerald-800 dark:text-emerald-300 flex items-start gap-1.5">
          <Stethoscope className="h-3.5 w-3.5 shrink-0 text-emerald-600 mt-0.5" />
          <div className="min-w-0">
            <span className="font-bold block">
              {isEn ? "Recommended Doctor:" : "পরামর্শযোগ্য বিশেষজ্ঞ:"}
            </span>
            <span className="truncate block">
              {isEn ? currentReport.doctorReferralEn : currentReport.doctorReferralBn}
            </span>
          </div>
        </div>
      </div>

      {/* Print CTA */}
      <div className="pt-1">
        <Button
          onClick={handlePrintReport}
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-2.5 sm:py-3 rounded-xl sm:rounded-2xl gap-2 shadow-md hover:shadow-lg transition-all text-xs sm:text-sm cursor-pointer"
        >
          <Printer className="h-4 w-4 shrink-0" />
          <span>{isEn ? "Print / Save PDF Report" : "রিপোর্ট প্রিন্ট / PDF সংরক্ষণ করুন"}</span>
        </Button>
      </div>
    </div>
  );
}
