import Link from "next/link";
import { CardiacPackagePriceItem } from "@/types/blog";
import { ShieldCheck, ArrowRight, Clock, Sparkles } from "lucide-react";

interface CardiacPriceTableProps {
  pricingData: {
    titleBn: string;
    subtitleBn: string;
    packages: CardiacPackagePriceItem[];
  };
  locale?: string;
}

export function CardiacPriceTable({
  pricingData,
  locale = "bn",
}: CardiacPriceTableProps) {
  const isEn = locale === "en";

  return (
    <section id="cardiac-price-guide" className="scroll-mt-24 space-y-5">
      <div className="space-y-1.5">
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
          {isEn ? "Cardiac Diagnostic Costs & Member Savings Guide" : pricingData.titleBn}
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          {isEn
            ? "Estimated charges for heart tests in Feni and guaranteed discounts with Health Club membership."
            : pricingData.subtitleBn}
        </p>
      </div>

      <div className="relative overflow-x-auto rounded-2xl border border-border/80 bg-card shadow-xs">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-muted/80 text-foreground font-bold border-b border-border/80">
            <tr>
              <th className="py-3.5 px-3 sm:px-4 min-w-[200px]">
                {isEn ? "Test & Category" : "হৃদরোগ পরীক্ষা ও বিভাগ"}
              </th>
              <th className="py-3.5 px-3 sm:px-4 whitespace-nowrap text-center">
                {isEn ? "Regular Market Fee" : "সাধারণ বাজারদর"}
              </th>
              <th className="py-3.5 px-3 sm:px-4 whitespace-nowrap text-center">
                {isEn ? "Member Price" : "হেলথ ক্লাব সদস্য মূল্য"}
              </th>
              <th className="py-3.5 px-3 sm:px-4 whitespace-nowrap text-center">
                {isEn ? "Member Savings" : "ডিসকাউন্ট / সাশ্রয়"}
              </th>
              <th className="py-3.5 px-3 sm:px-4 whitespace-nowrap text-center">
                {isEn ? "Report Time" : "রিপোর্ট পাওয়ার সময়"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {pricingData.packages.map((item, idx) => {
              const name = isEn ? item.testOrPackageNameEn : item.testOrPackageNameBn;

              return (
                <tr key={idx} className="hover:bg-muted/40 transition-colors">
                  <td className="py-3 px-3 sm:px-4">
                    <span className="font-semibold text-foreground block">
                      {name}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {item.categoryBn}
                    </span>
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-center font-mono text-muted-foreground line-through whitespace-nowrap">
                    {item.regularPriceRangeBn}
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-center font-semibold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                    {item.memberPriceRangeBn}
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-center whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                      <Sparkles className="h-3 w-3" />
                      {item.discountPercentageBn}
                    </span>
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-center text-muted-foreground whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-xs">
                      <Clock className="h-3 w-3 text-muted-foreground/70" />
                      <span>{item.reportTimeBn}</span>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-start gap-2.5">
          <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <p className="text-muted-foreground">
            {isEn
              ? "All cardiac diagnostic discounts are directly redeemable at verified Health Club partner centers across Feni (including Feni Heart Foundation Hospital, Popular, Chevron, and LabAid)."
              : "সকল কার্ডিয়াক টেস্ট ও হৃদরোগ চেকআপে নির্ধারিত ছাড় হেলথ ক্লাবের নিবন্ধিত পার্টনার হাসপাতাল ও ডায়াগনস্টিক সেন্টারে (ফেনী হার্ট ফাউন্ডেশন, পপুলার, শেভরন ও ল্যাবএইড) ডিজিটাল কার্ড প্রদর্শনে সরাসরি উপভোগ্য।"}
          </p>
        </div>
        <Link
          href="/membership"
          className="inline-flex items-center gap-1.5 font-bold text-primary hover:underline shrink-0 text-xs sm:text-sm self-end sm:self-center"
        >
          <span>{isEn ? "Join Health Club" : "সদস্যপদ নিন"}</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
