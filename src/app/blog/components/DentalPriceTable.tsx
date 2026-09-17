import Link from "next/link";
import { DentalProcedurePriceItem } from "@/types/blog";
import { ShieldCheck, ArrowRight, Clock } from "lucide-react";

interface DentalPriceTableProps {
  pricingData: {
    titleBn: string;
    subtitleBn: string;
    procedures: DentalProcedurePriceItem[];
  };
  locale?: string;
}

export function DentalPriceTable({
  pricingData,
  locale = "bn",
}: DentalPriceTableProps) {
  const isEn = locale === "en";

  return (
    <section id="price-guide" className="scroll-mt-24 space-y-5">
      <div className="space-y-1.5">
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
          {isEn ? "Dental Treatment Cost & Member Savings Guide" : pricingData.titleBn}
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          {isEn
            ? "Estimated dental procedure charges in Feni and guaranteed savings with Health Club membership."
            : pricingData.subtitleBn}
        </p>
      </div>

      <div className="relative overflow-x-auto rounded-2xl border border-border/80 bg-card shadow-xs">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-muted/80 text-foreground font-bold border-b border-border/80">
            <tr>
              <th className="py-3.5 px-3 sm:px-4 min-w-[200px]">
                {isEn ? "Procedure & Category" : "চিকিৎসা ও পদ্ধতির নাম"}
              </th>
              <th className="py-3.5 px-3 sm:px-4 whitespace-nowrap text-center">
                {isEn ? "Regular Market Fee" : "সাধারণ বাজারদর"}
              </th>
              <th className="py-3.5 px-3 sm:px-4 whitespace-nowrap text-center">
                {isEn ? "Health Club Discount" : "হেলথ ক্লাব মেম্বার সুবিধা"}
              </th>
              <th className="py-3.5 px-3 sm:px-4 whitespace-nowrap text-center">
                {isEn ? "Duration" : "চিকিৎসার সময়"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {pricingData.procedures.map((proc, idx) => {
              const procName = isEn ? proc.procedureNameEn : proc.procedureNameBn;

              return (
                <tr key={idx} className="hover:bg-muted/40 transition-colors">
                  <td className="py-3 px-3 sm:px-4">
                    <div className="space-y-0.5">
                      <span className="font-bold text-foreground block">{procName}</span>
                      <span className="text-[11px] text-muted-foreground block">
                        {proc.categoryBn}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-center text-muted-foreground whitespace-nowrap font-medium">
                    {proc.regularPriceRangeBn}
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-center whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>{isEn ? "10-30% Special Discount" : "১০-৩০% বিশেষ ছাড়"}</span>
                    </span>
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-center text-muted-foreground whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-xs">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span>{proc.durationBn}</span>
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
                ? "Special member savings on dental procedures & surgeries in Feni!"
                : "ফেনীর সেরা ডেন্টাল ক্লিনিকে চিকিৎসায় বিশেষ মেম্বার ছাড় পান!"}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {isEn
              ? "Get your digital Health Club membership card today and save thousands on dental care."
              : "আজই হেলথ ক্লাবের মেম্বারশিপ কার্ড সংগ্রহ করে রুট ক্যানেল, স্কেলিং ও ক্যাপের বিল সাশ্রয়ী করুন।"}
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
