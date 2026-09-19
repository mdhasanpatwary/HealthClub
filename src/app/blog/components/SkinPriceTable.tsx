import Link from "next/link";
import { SkinCarePackageItem } from "@/types/blog";
import { Sparkles, Clock, ShieldCheck, ArrowRight } from "lucide-react";
import {
  formatBlogPriceRange,
  translateMedicalCategory,
  translateTurnaroundTime,
} from "../utils/blogTranslations";

interface SkinPriceTableProps {
  pricingData: {
    titleBn: string;
    subtitleBn: string;
    packages: SkinCarePackageItem[];
  };
  locale?: string;
}

export function SkinPriceTable({
  pricingData,
  locale = "bn",
}: SkinPriceTableProps) {
  const isEn = locale === "en";

  return (
    <section id="skin-price-guide" className="scroll-mt-24 space-y-5">
      <div className="space-y-1.5">
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
          {isEn ? "Skin Test, Allergy Panel & Dermatosurgery Cost Guide" : pricingData.titleBn}
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          {isEn
            ? "Estimated diagnostic fees for skin scraping (KOH), allergy tests, biopsy, and minor cosmetic procedures in Feni with 10-30% Health Club member savings."
            : pricingData.subtitleBn}
        </p>
      </div>

      <div className="relative overflow-x-auto rounded-2xl border border-border/80 bg-card shadow-xs">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-muted/80 text-foreground font-bold border-b border-border/80">
            <tr>
              <th className="py-3.5 px-3 sm:px-4 min-w-[200px]">
                {isEn ? "Procedure / Diagnostic Test" : "টেস্ট / প্রসিডিউরের নাম ও ধরন"}
              </th>
              <th className="py-3.5 px-3 sm:px-4 whitespace-nowrap text-center">
                {isEn ? "Standard Rate" : "সাধারণ বাজারদর"}
              </th>
              <th className="py-3.5 px-3 sm:px-4 whitespace-nowrap text-center">
                {isEn ? "Health Club Benefit" : "হেলথ ক্লাব সুবিধা"}
              </th>
              <th className="py-3.5 px-3 sm:px-4 whitespace-nowrap text-center">
                {isEn ? "Duration / Turnaround" : "সময়কাল / রিপোর্ট ডেলিভারি"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {pricingData.packages.map((item, idx) => {
              const name = isEn ? item.procedureOrTestNameEn : item.procedureOrTestNameBn;

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
                      <span>{isEn ? "10-30% Member Discount" : "১০-৩০% মেম্বার ছাড়"}</span>
                    </span>
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-center text-muted-foreground whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-xs">
                      <Clock className="h-3 w-3 text-muted-foreground/70" />
                      <span>{translateTurnaroundTime(item.durationOrTurnaroundBn, isEn)}</span>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
          <p className="text-foreground">
            {isEn
              ? "Health Club members enjoy direct discounts on fungal scraping, allergy panels, and biopsy tests at partner diagnostic centers."
              : "হেলথ ক্লাব মেম্বারশিপ থাকলে পার্টনার ডায়াগনস্টিক সেন্টারে স্কিন স্ক্র্যাপিং, এলার্জি প্যানেল ও বায়োপসি টেস্টে নিশ্চিত ছাড় পাওয়া যায়।"}
          </p>
        </div>
        <Link
          href="/membership"
          className="inline-flex items-center gap-1.5 font-bold text-primary hover:underline shrink-0"
        >
          <span>{isEn ? "Get Membership" : "মেম্বারশিপ গ্রহণ করুন"}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </section>
  );
}
