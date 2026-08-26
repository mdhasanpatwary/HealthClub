"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  FileDown,
  Printer,
  Sparkles,
  RotateCcw,
  X,
  SlidersHorizontal,
  Eye,
} from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { toast } from "sonner";
import {
  HealthAssessmentInput,
  generateHealthAssessmentReport,
  printHealthAssessmentReport,
} from "@/lib/healthReportPdf";
import { trackEvent } from "@/lib/analytics";
import { HealthReportInputForm } from "./HealthReportInputForm";
import { HealthReportLivePreview } from "./HealthReportLivePreview";

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
    trackEvent("health_report_downloaded", {
      report_type: "assessment_pdf",
    });

    printHealthAssessmentReport(currentReport, locale);
    toast.success(
      isEn
        ? "Generating official health report document..."
        : "স্বাস্থ্য রিপোর্ট ডকুমেন্ট প্রিন্ট করা হচ্ছে..."
    );
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
    setMobileTab("form");
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md h-10 px-4 rounded-xl gap-2 cursor-pointer transition-all hover:shadow-lg"
      >
        <FileDown className="h-4 w-4" />
        <span className="text-xs sm:text-sm">
          {isEn ? "Export Health Assessment (PDF)" : "সম্পূর্ণ হেলথ রিপোর্ট (PDF প্রিন্ট)"}
        </span>
        <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-pulse hidden sm:inline-block" />
      </Button>

      {/* Modal Dialog for Configuring and Previewing Report */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          showCloseButton={false}
          className="max-w-[96vw] sm:max-w-4xl max-h-[94vh] sm:max-h-[90vh] flex flex-col p-0 overflow-hidden rounded-2xl sm:rounded-3xl border-border bg-card"
        >
          {/* Modal Header */}
          <div className="p-4 sm:p-6 bg-gradient-to-r from-primary/10 via-background to-secondary/10 border-b border-border/80 flex items-center justify-between shrink-0">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-primary text-white flex items-center justify-center shadow-xs">
                  <Printer className="h-4 w-4" />
                </div>
                <DialogTitle className="text-sm sm:text-lg font-heading font-black text-foreground">
                  {isEn ? "Generate Comprehensive Health Assessment" : "পূর্ণাঙ্গ স্বাস্থ্য মূল্যায়ন রিপোর্ট তৈরি করুন"}
                </DialogTitle>
              </div>
              <DialogDescription className="text-[11px] sm:text-xs text-muted-foreground line-clamp-1">
                {isEn
                  ? "Instant multi-parameter health scorecard with BMI, BMR, Water, BP & Clinical Guidance."
                  : "বিএমআই, ক্যালোরি, রক্তচাপ, ডায়াবেটিস ও স্বাস্থ্য নির্দেশনাসহ অফিশিয়াল স্বাস্থ্য রিপোর্ট।"}
              </DialogDescription>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="h-8 px-2.5 text-xs rounded-xl hidden sm:flex items-center gap-1"
                title={isEn ? "Reset" : "রিসেট"}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span className="hidden md:inline">{isEn ? "Reset" : "রিসেট"}</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 rounded-xl"
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
              <HealthReportInputForm
                isEn={isEn}
                mobileTab={mobileTab}
                setMobileTab={setMobileTab}
                name={name}
                setName={setName}
                age={age}
                setAge={setAge}
                gender={gender}
                setGender={setGender}
                unit={unit}
                setUnit={setUnit}
                feet={feet}
                setFeet={setFeet}
                inches={inches}
                setInches={setInches}
                cm={cm}
                setCm={setCm}
                weightKg={weightKg}
                setWeightKg={setWeightKg}
                activityLevel={activityLevel}
                setActivityLevel={setActivityLevel}
                systolic={systolic}
                setSystolic={setSystolic}
                diastolic={diastolic}
                setDiastolic={setDiastolic}
                glucose={glucose}
                setGlucose={setGlucose}
                glucoseContext={glucoseContext}
                setGlucoseContext={setGlucoseContext}
              />

              <HealthReportLivePreview
                isEn={isEn}
                locale={locale}
                mobileTab={mobileTab}
                currentReport={currentReport}
                handlePrintReport={handlePrintReport}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
