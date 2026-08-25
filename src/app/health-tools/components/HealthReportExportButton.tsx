"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  FileDown,
  Printer,
  Sparkles,
  Scale,
  Flame,
  Droplet,
  HeartPulse,
  Activity,
  RotateCcw,
  Stethoscope,
  X,
  SlidersHorizontal,
  Eye,
} from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { formatNum } from "@/lib/i18n";
import { toast } from "sonner";
import {
  HealthAssessmentInput,
  generateHealthAssessmentReport,
  printHealthAssessmentReport,
} from "@/lib/healthReportPdf";
import { trackEvent } from "@/lib/analytics";

export function HealthReportExportButton() {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  const [isOpen, setIsOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<"form" | "preview">("form");

  // Form State
  const [name, setName] = useState("");
  const [age, setAge] = useState("30");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [unit, setUnit] = useState<"ft" | "cm">("ft");
  const [feet, setFeet] = useState("5");
  const [inches, setInches] = useState("7");
  const [cm, setCm] = useState("170");
  const [weightKg, setWeightKg] = useState("65");
  const [activityLevel, setActivityLevel] = useState<"sedentary" | "light" | "moderate" | "active">("moderate");
  const [systolic, setSystolic] = useState("120");
  const [diastolic, setDiastolic] = useState("80");
  const [glucose, setGlucose] = useState("5.4");
  const [glucoseContext, setGlucoseContext] = useState<"fasting" | "post_meal">("fasting");

  // Calculate Height in cm
  const computedHeightCm = useMemo(() => {
    if (unit === "ft") {
      const ft = parseFloat(feet) || 0;
      const inch = parseFloat(inches) || 0;
      const totalInches = ft * 12 + inch;
      return Math.round(totalInches * 2.54);
    }
    return parseFloat(cm) || 170;
  }, [unit, feet, inches, cm]);

  // Real-time Assessment Report
  const currentReport = useMemo(() => {
    const inputData: HealthAssessmentInput = {
      name,
      age: parseFloat(age) || 30,
      gender,
      heightCm: computedHeightCm,
      weightKg: parseFloat(weightKg) || 65,
      activityLevel,
      systolicBp: parseFloat(systolic) || undefined,
      diastolicBp: parseFloat(diastolic) || undefined,
      bloodGlucose: parseFloat(glucose) || undefined,
      glucoseContext,
    };
    return generateHealthAssessmentReport(inputData);
  }, [
    name,
    age,
    gender,
    computedHeightCm,
    weightKg,
    activityLevel,
    systolic,
    diastolic,
    glucose,
    glucoseContext,
  ]);

  const handlePrintReport = () => {
    try {
      printHealthAssessmentReport(currentReport, locale);
      trackEvent("health_report_downloaded", {
        report_type: "full_health_assessment",
      });
      toast.success(
        isEn
          ? "Health Assessment report ready for print / PDF export!"
          : "হেলথ অ্যাসেসমেন্ট রিপোর্ট সফলভাবে তৈরি হয়েছে! সেভ বা প্রিন্ট করুন।"
      );
    } catch {
      toast.error(
        isEn
          ? "Failed to launch PDF print dialog."
          : "পিডিএফ প্রিন্ট ডায়ালগ চালু করতে সমস্যা হয়েছে।"
      );
    }
  };

  const handleReset = () => {
    setName("");
    setAge("30");
    setGender("male");
    setUnit("ft");
    setFeet("5");
    setInches("7");
    setCm("170");
    setWeightKg("65");
    setActivityLevel("moderate");
    setSystolic("120");
    setDiastolic("80");
    setGlucose("5.4");
    setGlucoseContext("fasting");
    toast.info(isEn ? "Form reset to defaults" : "ফর্ম রিসেট করা হয়েছে");
  };

  return (
    <>
      <Button
        onClick={() => {
          setIsOpen(true);
          setMobileTab("form");
        }}
        className="relative group overflow-hidden bg-gradient-to-r from-primary via-emerald-600 to-teal-600 hover:from-primary/90 hover:to-teal-600/90 text-white font-bold px-3.5 sm:px-6 py-2.5 sm:py-3 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 text-xs sm:text-sm cursor-pointer w-full sm:w-auto justify-center"
      >
        <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
          <FileDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
        </div>
        <span className="truncate font-semibold">
          {isEn ? "Generate Health Report (PDF)" : "পূর্ণাঙ্গ হেলথ রিপোর্ট (PDF)"}
        </span>
        <Badge
          variant="secondary"
          className="hidden xs:inline-flex bg-white/25 text-white border-0 text-[10px] py-0.5 px-1.5 font-mono shrink-0"
        >
          {isEn ? "Free PDF" : "ফ্রি PDF"}
        </Badge>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          showCloseButton={false}
          className="w-[95vw] sm:max-w-4xl max-h-[92vh] flex flex-col p-0 rounded-2xl sm:rounded-3xl border-border bg-background shadow-2xl overflow-hidden"
        >
          {/* Modal Header */}
          <div className="p-3.5 sm:p-5 border-b border-border/80 bg-muted/40 shrink-0 flex items-center justify-between gap-3">
            <div className="space-y-0.5 min-w-0">
              <DialogTitle className="text-xs sm:text-base font-bold font-heading text-secondary dark:text-white flex items-center gap-1.5 truncate">
                <Sparkles className="h-4 w-4 text-primary shrink-0" />
                <span className="truncate">{isEn ? "Health Assessment PDF" : "স্বাস্থ্য মূল্যায়ন PDF রিপোর্ট"}</span>
              </DialogTitle>
              <DialogDescription className="text-[11px] sm:text-xs text-muted-foreground truncate hidden xs:block">
                {isEn
                  ? "Combine BMI, Calories, Hydration, BP & Sugar into a branded PDF."
                  : "বিএমআই, ক্যালোরি, পানির চাহিদা ও ভাইটালস একত্রিত করে PDF রিপোর্ট তৈরি করুন।"}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="h-7 sm:h-8 px-2 text-[11px] sm:text-xs font-semibold rounded-lg sm:rounded-xl gap-1 cursor-pointer"
                title={isEn ? "Reset Form" : "রিসেট করুন"}
              >
                <RotateCcw className="h-3 w-3" />
                <span className="hidden sm:inline">{isEn ? "Reset" : "রিসেট"}</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-7 w-7 sm:h-8 sm:w-8 rounded-full text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Mobile Segmented Toggle */}
          <div className="lg:hidden px-3.5 pt-2 pb-1 bg-muted/20 border-b border-border/50 shrink-0">
            <div className="grid grid-cols-2 p-1 bg-muted/80 rounded-xl gap-1 text-xs">
              <button
                type="button"
                onClick={() => setMobileTab("form")}
                className={`py-1.5 px-3 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  mobileTab === "form"
                    ? "bg-background text-primary shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span>{isEn ? "1. Inputs" : "১. তথ্য এন্ট্রি"}</span>
              </button>
              <button
                type="button"
                onClick={() => setMobileTab("preview")}
                className={`py-1.5 px-3 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  mobileTab === "preview"
                    ? "bg-background text-primary shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Eye className="h-3.5 w-3.5" />
                <span>{isEn ? "2. Preview" : "২. প্রিভিউ"}</span>
                <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.2 rounded-full font-mono">
                  {currentReport.overallScore}
                </span>
              </button>
            </div>
          </div>

          {/* Modal Scrollable Body */}
          <div className="p-3.5 sm:p-6 overflow-y-auto flex-1 space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* Left Column: Input Form (Active on desktop OR when mobileTab === 'form') */}
              <div className={`lg:col-span-7 space-y-3.5 ${mobileTab === "form" ? "block" : "hidden lg:block"}`}>
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-bold text-foreground font-heading">
                    {isEn ? "Health Vitals & Parameters" : "শারীরিক তথ্য ও ভাইটালস"}
                  </h4>
                  <span className="text-[10px] text-muted-foreground">
                    {isEn ? "Real-time sync" : "লাইভ সিঙ্ক"}
                  </span>
                </div>

                {/* Name & Age & Gender */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="space-y-1">
                    <Label className="text-[11px] sm:text-xs font-semibold">
                      {isEn ? "Name (Optional)" : "আপনার নাম (ঐচ্ছিক)"}
                    </Label>
                    <Input
                      placeholder={isEn ? "e.g. Member" : "যেমন: মেম্বার"}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-8 sm:h-9 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] sm:text-xs font-semibold">
                      {isEn ? "Age (Yrs)" : "বয়স (বছর)"}
                    </Label>
                    <Input
                      type="number"
                      min="5"
                      max="120"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="h-8 sm:h-9 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] sm:text-xs font-semibold">
                      {isEn ? "Gender" : "লিঙ্গ"}
                    </Label>
                    <div className="grid grid-cols-2 gap-1 bg-muted p-0.5 rounded-lg h-8 sm:h-9 items-center">
                      <button
                        type="button"
                        onClick={() => setGender("male")}
                        className={`text-[11px] sm:text-xs py-1 rounded-md font-semibold transition-all ${
                          gender === "male"
                            ? "bg-background text-primary shadow-xs"
                            : "text-muted-foreground"
                        }`}
                      >
                        {isEn ? "Male" : "পুরুষ"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setGender("female")}
                        className={`text-[11px] sm:text-xs py-1 rounded-md font-semibold transition-all ${
                          gender === "female"
                            ? "bg-background text-pink-600 shadow-xs"
                            : "text-muted-foreground"
                        }`}
                      >
                        {isEn ? "Female" : "মহিলা"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Height & Weight */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-muted/30 p-2.5 sm:p-3 rounded-2xl border border-border/60">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <Label className="text-[11px] sm:text-xs font-semibold">
                        {isEn ? "Height" : "উচ্চতা"}
                      </Label>
                      <div className="inline-flex text-[9px] bg-muted rounded p-0.5">
                        <button
                          type="button"
                          onClick={() => setUnit("ft")}
                          className={`px-1.5 py-0.5 rounded ${unit === "ft" ? "bg-background text-primary font-bold shadow-xs" : "text-muted-foreground"}`}
                        >
                          ft/in
                        </button>
                        <button
                          type="button"
                          onClick={() => setUnit("cm")}
                          className={`px-1.5 py-0.5 rounded ${unit === "cm" ? "bg-background text-primary font-bold shadow-xs" : "text-muted-foreground"}`}
                        >
                          cm
                        </button>
                      </div>
                    </div>
                    {unit === "ft" ? (
                      <div className="grid grid-cols-2 gap-1.5">
                        <Input
                          type="number"
                          placeholder={isEn ? "Feet" : "ফুট"}
                          value={feet}
                          onChange={(e) => setFeet(e.target.value)}
                          className="h-8 sm:h-9 text-xs"
                        />
                        <Input
                          type="number"
                          placeholder={isEn ? "Inches" : "ইঞ্চি"}
                          value={inches}
                          onChange={(e) => setInches(e.target.value)}
                          className="h-8 sm:h-9 text-xs"
                        />
                      </div>
                    ) : (
                      <Input
                        type="number"
                        placeholder="cm"
                        value={cm}
                        onChange={(e) => setCm(e.target.value)}
                        className="h-8 sm:h-9 text-xs"
                      />
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px] sm:text-xs font-semibold">
                      {isEn ? "Weight (kg)" : "ওজন (কেজি)"}
                    </Label>
                    <Input
                      type="number"
                      step="0.5"
                      placeholder="kg"
                      value={weightKg}
                      onChange={(e) => setWeightKg(e.target.value)}
                      className="h-8 sm:h-9 text-xs"
                    />
                  </div>
                </div>

                {/* Activity Level */}
                <div className="space-y-1">
                  <Label className="text-[11px] sm:text-xs font-semibold">
                    {isEn ? "Daily Activity Level" : "দৈনিক কায়িক পরিশ্রম"}
                  </Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 text-[11px]">
                    {(
                      [
                        { id: "sedentary", bn: "বসে কাজ", en: "Sedentary" },
                        { id: "light", bn: "হালকা হাঁটা", en: "Light" },
                        { id: "moderate", bn: "মাঝারি", en: "Moderate" },
                        { id: "active", bn: "সক্রিয়", en: "Active" },
                      ] as const
                    ).map((lvl) => (
                      <button
                        key={lvl.id}
                        type="button"
                        onClick={() => setActivityLevel(lvl.id)}
                        className={`py-1.5 px-2 rounded-xl text-center border font-medium transition-all ${
                          activityLevel === lvl.id
                            ? "bg-primary/10 border-primary text-primary font-bold shadow-xs"
                            : "border-border/60 bg-muted/20 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {isEn ? lvl.en : lvl.bn}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Blood Pressure & Blood Sugar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-muted/30 p-2.5 sm:p-3 rounded-2xl border border-border/60">
                  <div className="space-y-1">
                    <Label className="text-[11px] sm:text-xs font-semibold flex items-center gap-1 text-rose-600 dark:text-rose-400">
                      <HeartPulse className="h-3 w-3" />
                      <span>{isEn ? "BP (Sys / Dia)" : "রক্তচাপ (Sys / Dia)"}</span>
                    </Label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <Input
                        type="number"
                        placeholder="Sys"
                        value={systolic}
                        onChange={(e) => setSystolic(e.target.value)}
                        className="h-8 sm:h-9 text-xs"
                      />
                      <Input
                        type="number"
                        placeholder="Dia"
                        value={diastolic}
                        onChange={(e) => setDiastolic(e.target.value)}
                        className="h-8 sm:h-9 text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <Label className="text-[11px] sm:text-xs font-semibold flex items-center gap-1 text-amber-600 dark:text-amber-400">
                        <Activity className="h-3 w-3" />
                        <span>{isEn ? "Sugar (mmol/L)" : "শর্করা (mmol/L)"}</span>
                      </Label>
                      <button
                        type="button"
                        onClick={() =>
                          setGlucoseContext((prev) => (prev === "fasting" ? "post_meal" : "fasting"))
                        }
                        className="text-[9px] text-primary hover:underline font-semibold"
                      >
                        {glucoseContext === "fasting"
                          ? isEn ? "Fasting" : "খালি পেট"
                          : isEn ? "Post-Meal" : "খাওয়ার পর"}
                      </button>
                    </div>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="5.5"
                      value={glucose}
                      onChange={(e) => setGlucose(e.target.value)}
                      className="h-8 sm:h-9 text-xs"
                    />
                  </div>
                </div>

                {/* Mobile Quick Proceed Button */}
                <div className="pt-1 lg:hidden">
                  <Button
                    type="button"
                    onClick={() => setMobileTab("preview")}
                    className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold py-2 rounded-xl text-xs gap-1.5"
                  >
                    <span>{isEn ? "View Report Summary & Print" : "রিপোর্ট প্রিভিউ ও প্রিন্ট দেখুন"}</span>
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* Right Column: Live Summary Preview (Active on desktop OR when mobileTab === 'preview') */}
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
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
