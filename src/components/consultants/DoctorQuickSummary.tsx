import { Doctor, Partner } from "@/services/db";
import { Sparkles, MapPin, Calendar, Phone, Percent, ShieldCheck } from "lucide-react";
import { generateDoctorQuickSummary } from "@/data/doctorFaqData";

interface DoctorQuickSummaryProps {
  doctor: Doctor & { partner?: Partner | null };
}

/**
 * Direct Answer Capsule (BLUF — Bottom Line Up Front) for Doctor Profile.
 * Specifically engineered for Generative Engine Optimization (GEO) & Answer Engine Optimization (AEO),
 * targeting ChatGPT Search, PerplexityBot, Google Gemini AI Overviews, Siri and Google Assistant.
 */
export function DoctorQuickSummary({ doctor }: DoctorQuickSummaryProps) {
  const summaryText = generateDoctorQuickSummary(doctor);

  return (
    <section
      id="doctor-quick-summary"
      aria-label="ডাক্তারের দ্রুত তথ্য ও সংক্ষিপ্ত বিবরণ"
      className="geo-answer-capsule rounded-3xl border border-emerald-500/25 bg-gradient-to-br from-emerald-500/5 via-card to-emerald-500/5 p-4 sm:p-6 shadow-xs relative overflow-hidden space-y-3.5"
    >
      {/* Header Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-[11px] sm:text-xs font-bold tracking-wide">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span>তাৎক্ষণিক সারসংক্ষেপ ও ডিরেক্ট অ্যানসার (BLUF)</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          <span>যাচাইকৃত তথ্য • ফেনী সদর</span>
        </div>
      </div>

      {/* 40-60 Word Direct Answer Capsule for AI & Voice Search */}
      <p className="text-xs sm:text-sm text-foreground/90 font-medium leading-relaxed sm:leading-loose">
        {summaryText}
      </p>

      {/* Quick Signal Feature Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-border/60">
        <div className="flex items-center gap-2 p-2 rounded-xl bg-background/80 border border-border/50">
          <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
          <div className="min-w-0">
            <span className="text-[10px] text-muted-foreground block">চেম্বার লোকেশন</span>
            <span className="text-[11px] font-bold text-foreground truncate block">
              {doctor.chamberName}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-xl bg-background/80 border border-border/50">
          <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
          <div className="min-w-0">
            <span className="text-[10px] text-muted-foreground block">ভিজিটিং দিন</span>
            <span className="text-[11px] font-bold text-foreground truncate block">
              {doctor.visitingDays}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-xl bg-background/80 border border-border/50">
          <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
          <div className="min-w-0">
            <span className="text-[10px] text-muted-foreground block">সিরিয়াল হটলাইন</span>
            <span className="text-[11px] font-bold text-foreground truncate block font-mono">
              {doctor.serialPhone.split(/[,/|]+/)[0]?.trim() || doctor.serialPhone}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/25">
          <Percent className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div className="min-w-0">
            <span className="text-[10px] text-emerald-800 dark:text-emerald-300 block">টেস্ট ডিসকাউন্ট</span>
            <span className="text-[11px] font-extrabold text-emerald-700 dark:text-emerald-400 truncate block">
              ১০-৩০% মেম্বার ছাড়
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
