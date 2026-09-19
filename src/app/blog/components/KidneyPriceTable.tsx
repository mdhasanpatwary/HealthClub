import Link from "next/link";
import { KidneyPackagePriceItem } from "@/types/blog";
import { ShieldCheck, ArrowRight, Clock, Sparkles } from "lucide-react";
import {
  formatBlogPriceRange,
  translateMedicalCategory,
  translateTurnaroundTime,
} from "../utils/blogTranslations";

interface KidneyPriceTableProps {
  pricingData: {
    titleBn: string;
    subtitleBn: string;
    packages: KidneyPackagePriceItem[];
  };
  locale?: string;
}

export function KidneyPriceTable({
  pricingData,
  locale = "bn",
}: KidneyPriceTableProps) {
  const isEn = locale === "en";

  return (
    <section id="kidney-price-guide" className="scroll-mt-24 space-y-5">
      <div className="space-y-1.5">
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
          {isEn ? "Dialysis & Kidney Diagnostic Cost Guide" : pricingData.titleBn}
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          {isEn
            ? "Subsidized government hospital vs private dialysis rates in Feni, routine renal panel costs, and 10-30% Health Club member discounts."
            : pricingData.subtitleBn}
        </p>
      </div>

      <div className="relative overflow-x-auto rounded-2xl border border-border/80 bg-card shadow-xs">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-muted/80 text-foreground font-bold border-b border-border/80">
            <tr>
              <th className="py-3.5 px-3 sm:px-4 min-w-[200px]">
                {isEn ? "Procedure / Investigation & Category" : "ডায়ালাইসিস ও পরীক্ষা এবং বিভাগ"}
              </th>
              <th className="py-3.5 px-3 sm:px-4 whitespace-nowrap text-center">
                {isEn ? "Standard Fee Range" : "সাধারণ বাজারদর"}
              </th>
              <th className="py-3.5 px-3 sm:px-4 whitespace-nowrap text-center">
                {isEn ? "Health Club Benefit" : "হেলথ ক্লাব সুবিধা"}
              </th>
              <th className="py-3.5 px-3 sm:px-4 whitespace-nowrap text-center">
                {isEn ? "Duration / Report Time" : "সময়কাল / রিপোর্ট"}
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
                      <span>
                        {item.memberPriceRangeBn
                          ? isEn
                            ? formatBlogPriceRange(item.memberPriceRangeBn, true)
                            : item.memberPriceRangeBn
                          : isEn
                          ? "10-30% Member Discount"
                          : "১০-৩০% মেম্বার ছাড়"}
                      </span>
                    </span>
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-center text-muted-foreground whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-xs">
                      <Clock className="h-3 w-3 text-muted-foreground/70" />
                      <span>{translateTurnaroundTime(item.turnaroundOrDurationBn, isEn)}</span>
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
              ? "Health Club members save 10-30% on all renal diagnostic tests (Serum Creatinine, Electrolytes, Urine ACR, USG KUB) at verified partner centers including DD Lab, Ibn Sina, Chevron, and Labaid in Feni."
              : "হেলথ ক্লাব মেম্বার হলে ফেনীর পার্টনার ডায়াগনস্টিক ও হাসপাতালে (ডিডি ল্যাব, নিউ ইবনে সিনা, শেভরন ও ল্যাবএইড) সিরাম ক্রিয়েটিনিন, ইলেক্ট্রোলাইটস, ইউরিন এসিআর ও ইউএসজিসহ সকল কিডনি পরীক্ষায় ১০-৩০% ডিসকাউন্ট পাবেন।"}
          </p>
        </div>
        <Link
          href="/membership"
          className="inline-flex items-center gap-1.5 font-bold text-primary hover:underline shrink-0 text-xs sm:text-sm self-end sm:self-center"
        >
          <span>{isEn ? "Join Health Club" : "মেম্বারশিপ কার্ড নিন"}</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
