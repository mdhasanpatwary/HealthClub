import Link from "next/link";
import { Microscope, ArrowRight, ShieldCheck, Sparkles, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getDepartmentDiagnosticData } from "@/data/departmentDiagnosticData";

interface DepartmentDiagnosticGuidesProps {
  departmentId: string;
  departmentNameBn: string;
}

/**
 * Contextual diagnostic test pricing guides embedded inside specialty department landing pages.
 * Fulfills TODO-326:
 * - Direct BLUF answer capsule for GEO/AEO
 * - High information density structured test cards with Feni Sadar market ranges
 * - Strict 10-30% member discount badge compliance (no fixed taka discounts)
 * - Deep interlinking to diagnostic blog posts
 */
export function DepartmentDiagnosticGuides({
  departmentId,
  departmentNameBn,
}: DepartmentDiagnosticGuidesProps) {
  const diagnosticOverview = getDepartmentDiagnosticData(departmentId);

  return (
    <section
      aria-labelledby="dept-diagnostic-pricing-heading"
      className="max-w-5xl mx-auto space-y-4 sm:space-y-6 pt-4 border-t border-border/80"
    >
      {/* Section Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-emerald-800 dark:text-emerald-300 border border-primary/20 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
          <Microscope className="h-3.5 w-3.5" />
          <span>ডায়াগনস্টিক ও ল্যাব মূল্যতালিকা</span>
        </div>

        <h2
          id="dept-diagnostic-pricing-heading"
          className="text-lg sm:text-2xl font-bold text-foreground font-heading tracking-tight"
        >
          {diagnosticOverview.headlineBn || `${departmentNameBn} চিকিৎসায় প্রয়োজনীয় ডায়াগনস্টিক টেস্ট ও বাজারদর`}
        </h2>

        {/* Direct Answer Capsule (BLUF for Generative & Answer Engines) */}
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-4xl">
          {diagnosticOverview.blufAnswerBn}
        </p>
      </div>

      {/* Grid of Contextual Diagnostic Tests */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
        {diagnosticOverview.tests.map((test) => (
          <div
            key={test.slug}
            className="flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-card border border-border/80 hover:border-primary/40 hover:shadow-xs transition-all duration-200 group gap-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                {test.badgeBn && (
                  <Badge
                    variant="outline"
                    className="text-[10px] font-semibold bg-primary/10 text-primary border-primary/20 px-2 py-0.5 rounded-md"
                  >
                    <Sparkles className="h-2.5 w-2.5 mr-1" />
                    {test.badgeBn}
                  </Badge>
                )}
                <span className="text-[11px] text-muted-foreground font-medium">
                  {test.readTimeBn} গাইড
                </span>
              </div>

              <div>
                <h3 className="font-heading font-bold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors leading-snug">
                  <Link href={`/blog/${test.slug}`} className="hover:underline">
                    {test.testNameBn}
                  </Link>
                </h3>
                <p className="text-[11px] font-mono text-muted-foreground/80 mt-0.5">
                  {test.testNameEn}
                </p>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                {test.purposeBn}
              </p>
            </div>

            {/* Pricing & Member Discount Row */}
            <div className="pt-2 border-t border-border/60 space-y-2.5">
              <div className="flex items-center justify-between gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-muted-foreground block uppercase font-medium">
                    ফেনীর বাজারদর
                  </span>
                  <span className="font-bold text-foreground font-sans">
                    {test.regularPriceRangeBn}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-muted-foreground block uppercase font-medium">
                    হেলথ ক্লাব সুবিধা
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 font-bold text-[11px]">
                    {test.memberDiscountBn}
                  </span>
                </div>
              </div>

              {/* Action Link to Full Diagnostic Blog Post */}
              <Link
                href={`/blog/${test.slug}`}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-muted hover:bg-primary/10 text-foreground hover:text-primary border border-border/70 hover:border-primary/30 text-xs font-semibold transition-all group-hover:gap-2"
              >
                <span>{test.guideTitleBn} পড়ুন</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Reassurance & Universal Price List Hub Callout */}
      <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-primary/5 to-card p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
            <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
            <span>ফেনী সদর পার্টনার ডায়াগনস্টিক সেন্টারে কার্যকর</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            প্রেসক্রিপশন নিয়ে টেস্ট করানোর পূর্বেই আপনার ডিজিটাল মেম্বার কার্ড প্রস্তুত রাখুন এবং বিল পরিশোধের সময় ইনস্ট্যান্ট ১০-৩০% মেম্বার ছাড় উপভোগ করুন।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Link
            href="/blog/feni-medical-test-price-list"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-background border border-border/80 hover:bg-muted text-xs font-bold text-foreground transition-colors"
          >
            <FileText className="h-3.5 w-3.5 text-primary" />
            <span>৮০+ টেস্টের সম্পূর্ণ মূল্যতালিকা</span>
          </Link>
          <Link
            href="/membership"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold transition-all shadow-xs"
          >
            <span>ফ্রি মেম্বার কার্ড নিন</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
