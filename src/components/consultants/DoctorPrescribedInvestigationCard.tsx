import Link from "next/link";
import { Microscope, ArrowRight, ShieldCheck, Sparkles, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Doctor, Partner } from "@/services/db";
import { getDepartmentDiagnosticData } from "@/data/departmentDiagnosticData";

interface DoctorPrescribedInvestigationCardProps {
  doctor: Doctor & { partner?: Partner | null };
  className?: string;
}

/**
 * Contextual prescribed lab investigations & diagnostic test savings card on doctor profile pages.
 * Fulfills TODO-326:
 * - Emphasizes 10-30% Health Club member discount on prescribed lab tests
 * - Provides factual Feni Sadar market price ranges
 * - Contextually cross-links to in-depth diagnostic cost guides
 * - Direct BLUF answer capsule for GEO/AEO
 */
export function DoctorPrescribedInvestigationCard({
  doctor,
  className = "",
}: DoctorPrescribedInvestigationCardProps) {
  const diagnosticOverview = getDepartmentDiagnosticData(doctor.department);
  // Pick top 3 most relevant tests for concise profile view
  const displayTests = diagnosticOverview.tests.slice(0, 3);

  return (
    <section
      aria-labelledby="doctor-investigations-heading"
      className={`rounded-3xl border border-emerald-500/25 bg-gradient-to-br from-emerald-500/5 via-card to-card p-5 sm:p-7 shadow-xs space-y-5 ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Microscope className="h-4 w-4" />
            </div>
            <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              প্রেসক্রিপশন টেস্ট সেভিংস
            </span>
          </div>

          <h2
            id="doctor-investigations-heading"
            className="font-heading font-bold text-base sm:text-lg text-foreground pt-1"
          >
            {doctor.name}-এর প্রেসক্রিপশনের টেস্টে ১০-৩০% মেম্বার ছাড়
          </h2>
        </div>

        <Badge
          variant="outline"
          className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 px-2.5 py-1 rounded-full gap-1 self-start sm:self-auto shrink-0"
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>ফেনী সদর পার্টনার ল্যাব</span>
        </Badge>
      </div>

      {/* Direct Answer Capsule (BLUF) */}
      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
        {doctor.name} ({doctor.specialty}) চেম্বারে কনসাল্টেশনের পর যেসব প্যাথলজি বা রেডিওলজি টেস্ট প্রেসক্রাইব করতে পারেন, হেলথ ক্লাব ডিজিটাল মেম্বার কার্ডধারীরা ফেনী সদরের অনুমোদিত পার্টনার ডায়াগনস্টিক সেন্টারে সেসব পরীক্ষায় নিশ্চিত <strong>১০-৩০% মেম্বার ছাড়</strong> পান।
      </p>

      {/* Structured List of Investigations */}
      <div className="space-y-3">
        {displayTests.map((test) => (
          <div
            key={test.slug}
            className="p-3 sm:p-4 rounded-2xl bg-card border border-border/80 hover:border-primary/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
          >
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-heading font-bold text-xs sm:text-sm text-foreground">
                  <Link href={`/blog/${test.slug}`} className="hover:text-primary hover:underline">
                    {test.testNameBn}
                  </Link>
                </h3>
                {test.badgeBn && (
                  <span className="text-[10px] font-medium px-2 py-0.2 rounded-md bg-muted text-muted-foreground border border-border/60">
                    {test.badgeBn}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground line-clamp-1">
                {test.purposeBn}
              </p>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-border/50">
              <div className="text-left sm:text-right">
                <span className="text-[10px] text-muted-foreground block">বাজারদর</span>
                <span className="text-xs font-bold text-foreground font-sans">
                  {test.regularPriceRangeBn}
                </span>
              </div>

              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 font-bold text-[11px]">
                {test.memberDiscountBn}
              </span>

              <Link
                href={`/blog/${test.slug}`}
                aria-label={`${test.testNameBn} এর খরচ গাইড`}
                className="hidden md:inline-flex items-center justify-center h-8 w-8 rounded-lg bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors shrink-0"
              >
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        <Link
          href="/blog/feni-medical-test-price-list"
          className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1.5"
        >
          <FileText className="h-3.5 w-3.5" />
          <span>ফেনীর ৮০+ টেস্টের সম্পূর্ণ মূল্যতালিকা ও প্রস্তুতি</span>
          <ArrowRight className="h-3 w-3" />
        </Link>

        <Link
          href="/membership"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold transition-all shadow-xs shrink-0"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>ফ্রি মেম্বার কার্ড নিয়ে ১০-৩০% সাশ্রয় করুন</span>
        </Link>
      </div>
    </section>
  );
}
