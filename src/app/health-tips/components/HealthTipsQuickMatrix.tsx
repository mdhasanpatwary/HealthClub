"use client";

import Link from "next/link";
import {
  Flame,
  HeartPulse,
  Activity,
  AlertTriangle,
  Baby,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/layout/LanguageProvider";

interface MatrixItem {
  id: string;
  icon: React.ElementType;
  colorClass: string;
  badgeBg: string;
  symptomBn: string;
  symptomEn: string;
  quickActionBn: string;
  quickActionEn: string;
  redFlagBn: string;
  redFlagEn: string;
  guideSlug: string;
}

const QUICK_MATRIX_ITEMS: MatrixItem[] = [
  {
    id: "fever-dengue",
    icon: Flame,
    colorClass: "text-amber-500",
    badgeBg: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    symptomBn: "তীব্র জ্বর ও শরীর ব্যথা (ডেঙ্গু সতর্কতা)",
    symptomEn: "High Fever & Body Ache (Dengue Alert)",
    quickActionBn: "শুধুমাত্র প্যারাসিটামল ও দৈনিক ৩ লিটার খাবার স্যালাইন/ডাবের পানি পান করুন। কোনো ব্যথানাশক ওষুধ খাবেন না।",
    quickActionEn: "Administer only Paracetamol and oral hydration (ORS, coconut water). Strictly avoid NSAID painkillers.",
    redFlagBn: "মাড়ি দিয়ে রক্তপাত, তীব্র পেটব্যথা বা ক্রমাগত বমি হলে অবিলম্বে হাসপাতালে ভর্তি হোন।",
    redFlagEn: "Mucosal bleeding, severe abdominal pain, or continuous vomiting requires immediate hospital admission.",
    guideSlug: "dengue-fever-prevention-treatment",
  },
  {
    id: "chest-pain",
    icon: HeartPulse,
    colorClass: "text-rose-500",
    badgeBg: "bg-rose-500/10 text-rose-600 border-rose-500/20",
    symptomBn: "বুকে ভারী চাপ ও বাম বাহুতে ব্যথা (হার্ট অ্যালার্ট)",
    symptomEn: "Heavy Chest Pressure & Left Arm Pain (Heart Alert)",
    quickActionBn: "রোগীকে বসিয়ে দিন। একটি ৩০০ মিগ্রা অ্যাসপিরিন চিবিয়ে খাওয়ান এবং দ্রুত অ্যাম্বুলেন্স ডাকুন।",
    quickActionEn: "Keep patient seated upright, administer 300mg chewable Aspirin, and dispatch an emergency ambulance.",
    redFlagBn: "প্রচুর ঠাণ্ডা ঘাম, শ্বাসকষ্ট ও মাথা ঘুরে পড়ে যাওয়ার মতো অবস্থা হলে প্রথম ৬০ মিনিটে হাসপাতালে নিন।",
    redFlagEn: "Cold sweating, dyspnea, or dizziness indicates acute infarction requiring golden-hour emergency care.",
    guideSlug: "heart-attack-warning-signs-first-aid",
  },
  {
    id: "high-bp-stroke",
    icon: Activity,
    colorClass: "text-emerald-600",
    badgeBg: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    symptomBn: "মুখ বাঁকা হওয়া বা হাত অবশ (স্ট্রোক সতর্কতা)",
    symptomEn: "Facial Droop or Arm Weakness (Stroke Warning)",
    quickActionBn: "FAST পদ্ধতি চেক করুন। মুখে পানি বা ওষুধ না দিয়ে রোগীকে একদিকে কাত করে শুইয়ে রাখুন।",
    quickActionEn: "Check FAST protocol. Never give oral fluids or medicines; position in recovery lateral posture.",
    redFlagBn: "লক্ষণ শুরুর ৪.৫ ঘণ্টার মধ্যে সিটি স্ক্যানযুক্ত হাসপাতালে পৌঁছালে রক্ত জমাট গলানো সম্ভব।",
    redFlagEn: "Reaching a CT-ready hospital within 4.5 hours enables life-saving clot-dissolving thrombolysis.",
    guideSlug: "stroke-symptoms-fast-action",
  },
  {
    id: "pediatric-fever",
    icon: Baby,
    colorClass: "text-blue-500",
    badgeBg: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    symptomBn: "শিশুর হঠাৎ তীব্র জ্বর বা নিস্তেজ ভাব",
    symptomEn: "Sudden Pediatric High Fever or Lethargy",
    quickActionBn: "স্বাভাবিক তাপমাত্রার ভেজা সুতি কাপড় দিয়ে সারা শরীর মুছিয়ে দিন। নিয়ম অনুযায়ী প্যারাসিটামল দিন।",
    quickActionEn: "Tepid sponge with normal water across the torso. Give weight-appropriate paracetamol drops/syrup.",
    redFlagBn: "খিঁচুনি, শ্বাস নিতে কষ্ট (বুকের খাঁচা ডেবে যাওয়া) বা বুকের দুধ না টানলে অবিলম্বে শিশু বিশেষজ্ঞ দেখান।",
    redFlagEn: "Seizures, chest indrawing, or refusal to breastfeed are dangerous signs requiring emergency triage.",
    guideSlug: "child-nutrition-immunity-boost",
  },
];

export function HealthTipsQuickMatrix() {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  return (
    <section
      aria-labelledby="quick-matrix-heading"
      className="rounded-3xl border border-primary/20 bg-gradient-to-b from-primary/5 via-background to-background p-6 sm:p-8 space-y-6 shadow-xs"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>{isEn ? "Emergency Quick Decision Matrix" : "জরুরি প্রাথমিক লক্ষণ ও করণীয় গাইড"}</span>
          </div>
          <h2
            id="quick-matrix-heading"
            className="font-heading text-lg sm:text-2xl font-bold text-secondary dark:text-white"
          >
            {isEn ? "Quick Symptom & First-Aid Decision Guide" : "জরুরি স্বাস্থ্য সহায়িকা ও দ্রুত লক্ষণ নির্দেশিকা"}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {isEn
              ? "Immediate actionable medical advice for urgent symptoms before reaching a hospital."
              : "হাসপাতালে যাওয়ার পূর্বে জরুরি লক্ষণ চেনা ও তাৎক্ষণিক জীবনরক্ষাকারী করণীয়।"}
          </p>
        </div>

        <Link
          href="/emergency"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 dark:bg-rose-950/30 px-3.5 py-2 rounded-xl border border-rose-200 dark:border-rose-900/40 shrink-0 transition-colors"
        >
          <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
          <span>{isEn ? "24/7 Emergency Contacts" : "২৪/৭ জরুরি সেবা ও অ্যাম্বুলেন্স"}</span>
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {QUICK_MATRIX_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="p-4 sm:p-5 rounded-2xl bg-card border border-border/80 hover:border-primary/40 transition-all duration-200 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl bg-muted/60 ${item.colorClass}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-heading font-bold text-sm sm:text-base text-foreground leading-tight">
                    {isEn ? item.symptomEn : item.symptomBn}
                  </h3>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="p-2.5 rounded-xl bg-primary/5 border border-primary/15 text-foreground/90">
                    <span className="font-bold text-primary mr-1">
                      {isEn ? "Immediate Step:" : "তাৎক্ষণিক করণীয়:"}
                    </span>
                    {isEn ? item.quickActionEn : item.quickActionBn}
                  </div>

                  <div className="p-2.5 rounded-xl bg-rose-500/5 border border-rose-500/15 text-rose-800 dark:text-rose-300">
                    <span className="font-bold text-rose-600 mr-1">
                      {isEn ? "Hospital Red Flag:" : "হাসপাতাল সতর্কতা:"}
                    </span>
                    {isEn ? item.redFlagEn : item.redFlagBn}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                <Badge variant="outline" className={`text-[10px] font-bold ${item.badgeBg}`}>
                  {isEn ? "Verified Medical Protocol" : "যাচাইকৃত প্রটোকল"}
                </Badge>

                <Link
                  href={`/health-tips/${item.guideSlug}`}
                  className="text-xs font-bold text-primary hover:text-primary-dark inline-flex items-center gap-1 group"
                >
                  <span>{isEn ? "Full Guide" : "পূর্ণাঙ্গ গাইড"}</span>
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
