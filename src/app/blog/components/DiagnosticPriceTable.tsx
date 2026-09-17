import Link from "next/link";
import { DiagnosticTestPriceItem } from "@/types/blog";
import { ShieldCheck, ArrowRight, Clock, Sparkles } from "lucide-react";

interface DiagnosticPriceTableProps {
  pricingData: {
    titleBn: string;
    subtitleBn: string;
    tests: DiagnosticTestPriceItem[];
  };
  locale?: string;
}

export function DiagnosticPriceTable({
  pricingData,
  locale = "bn",
}: DiagnosticPriceTableProps) {
  const isEn = locale === "en";

  return (
    <section id="price-guide" className="scroll-mt-24 space-y-5">
      <div className="space-y-1.5">
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
          {isEn ? "Common Diagnostic Tests & Cost Guide" : `৪. ${pricingData.titleBn}`}
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          {isEn
            ? "Estimated diagnostic test charges in Feni and guaranteed savings with Health Club membership."
            : pricingData.subtitleBn}
        </p>
      </div>

      <div className="relative overflow-x-auto rounded-2xl border border-border/80 bg-card shadow-xs">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-muted/80 text-foreground font-bold border-b border-border/80">
            <tr>
              <th className="py-3.5 px-3 sm:px-4 min-w-[200px]">
                {isEn ? "Test Name & Department" : "পরীক্ষার নাম ও বিভাগ"}
              </th>
              <th className="py-3.5 px-3 sm:px-4 whitespace-nowrap text-center">
                {isEn ? "Regular Price Range" : "সাধারণ বাজারদর"}
              </th>
              <th className="py-3.5 px-3 sm:px-4 whitespace-nowrap text-center">
                {isEn ? "Health Club Member Price" : "হেলথ ক্লাব মূল্য"}
              </th>
              <th className="py-3.5 px-3 sm:px-4 whitespace-nowrap text-center">
                {isEn ? "Savings" : "সাশ্রয়"}
              </th>
              <th className="py-3.5 px-3 sm:px-4 whitespace-nowrap text-center">
                {isEn ? "Report Time" : "রিপোর্ট সময়"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {pricingData.tests.map((test, idx) => {
              const testName = isEn ? test.testNameEn : test.testNameBn;

              return (
                <tr key={idx} className="hover:bg-muted/40 transition-colors">
                  <td className="py-3 px-3 sm:px-4">
                    <div className="space-y-0.5">
                      <span className="font-bold text-foreground block">{testName}</span>
                      <span className="text-[11px] text-muted-foreground block">
                        {test.categoryBn}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-center text-muted-foreground line-through whitespace-nowrap">
                    {test.regularPriceRangeBn}
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-center font-bold text-primary whitespace-nowrap">
                    {test.memberPriceRangeBn}
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-center whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                      <Sparkles className="h-3 w-3" />
                      <span>{test.discountPercentageBn}</span>
                    </span>
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-center text-muted-foreground whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-xs">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span>{test.turnaroundTimeBn}</span>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Bottom Conversion Prompt */}
      <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-bold text-sm sm:text-base">
            <ShieldCheck className="h-5 w-5 shrink-0" />
            <span>
              {isEn
                ? "Special member savings on diagnostic & pathology tests in Feni!"
                : "ফেনীর সেরা ডায়াগনস্টিকে টেস্টে বিশেষ মেম্বার ছাড় ও সাশ্রয় পান!"}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {isEn
              ? "Get your digital Health Club membership card today for you and your entire family."
              : "আজই হেলথ ক্লাবের মেম্বারশিপ কার্ড সংগ্রহ করে পরিবারের ডায়াগনস্টিক খরচ সাশ্রয় করুন।"}
          </p>
        </div>

        <Link
          href="/membership"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs sm:text-sm font-bold shadow-xs transition-colors shrink-0"
        >
          <span>{isEn ? "Get Membership Card" : "মেম্বারশিপ কার্ড সংগ্রহ করুন"}</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
