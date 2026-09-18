import Link from "next/link";
import { CardiacPackagePriceItem } from "@/types/blog";
import { ShieldCheck, ArrowRight, Clock, Sparkles } from "lucide-react";
import {
  formatBlogPriceRange,
  translateMedicalCategory,
  translateTurnaroundTime,
} from "../utils/blogTranslations";

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
            ? "Standard market fees for cardiac diagnostic tests in Feni and 10-30% discount for Health Club members."
            : "ফেনীর শীর্ষ ডায়াগনস্টিক সেন্টারে কার্ডিয়াক পরীক্ষাগুলোর সাধারণ বাজারদর এবং হেলথ ক্লাব মেম্বারদের জন্য ১০-৩০% ডিসকাউন্ট সুবিধা।"}
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
                {isEn ? "Health Club Discount" : "হেলথ ক্লাব মেম্বার সুবিধা"}
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
                      {translateMedicalCategory(item.categoryBn, isEn)}
                    </span>
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-center font-mono text-muted-foreground whitespace-nowrap">
                    {formatBlogPriceRange(item.regularPriceRangeBn, isEn)}
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-center whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                      <Sparkles className="h-3 w-3 shrink-0" />
                      <span>{isEn ? "10-30% Member Discount" : "মেম্বার হলে ১০-৩০% ডিসকাউন্ট"}</span>
                    </span>
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-center text-muted-foreground whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-xs">
                      <Clock className="h-3 w-3 text-muted-foreground/70" />
                      <span>{translateTurnaroundTime(item.reportTimeBn, isEn)}</span>
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
              ? "Health Club members get a 10-30% discount on all cardiac diagnostic tests at verified partner centers across Feni (including Feni Heart Foundation Hospital, Popular, Chevron, and LabAid)."
              : "হেলথ ক্লাব মেম্বার হলে ফেনীর পার্টনার হাসপাতাল ও ডায়াগনস্টিক সেন্টারে (ফেনী হার্ট ফাউন্ডেশন, পপুলার, শেভরন ও ল্যাবএইড) সকল কার্ডিয়াক টেস্টে ১০-৩০% ডিসকাউন্ট পাবেন।"}
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
