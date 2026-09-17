import Link from "next/link";
import { PhysiotherapyTreatmentPriceItem } from "@/types/blog";
import { ShieldCheck, ArrowRight, Clock, Sparkles } from "lucide-react";

interface PhysiotherapyPriceTableProps {
  pricingData: {
    titleBn: string;
    subtitleBn: string;
    treatments: PhysiotherapyTreatmentPriceItem[];
  };
  locale?: string;
}

export function PhysiotherapyPriceTable({
  pricingData,
  locale = "bn",
}: PhysiotherapyPriceTableProps) {
  const isEn = locale === "en";

  return (
    <section id="price-guide" className="scroll-mt-24 space-y-5">
      <div className="space-y-1.5">
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
          {isEn ? "Physiotherapy Session Costs & Member Savings Guide" : pricingData.titleBn}
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          {isEn
            ? "Standard market fees for physiotherapy in Feni and 10-30% discount for Health Club members."
            : "ফেনীর বিভিন্ন প্রাইভেট ও পার্টনার হাসপাতালে ফিজিওথেরাপি সেশনের সাধারণ বাজারদর এবং হেলথ ক্লাব মেম্বারদের জন্য ১০-৩০% ডিসকাউন্ট সুবিধা।"}
        </p>
      </div>

      <div className="relative overflow-x-auto rounded-2xl border border-border/80 bg-card shadow-xs">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-muted/80 text-foreground font-bold border-b border-border/80">
            <tr>
              <th className="py-3.5 px-3 sm:px-4 min-w-[200px]">
                {isEn ? "Therapy & Category" : "থেরাপি সেশন ও বিভাগ"}
              </th>
              <th className="py-3.5 px-3 sm:px-4 whitespace-nowrap text-center">
                {isEn ? "Regular Market Fee" : "সাধারণ বাজারদর"}
              </th>
              <th className="py-3.5 px-3 sm:px-4 whitespace-nowrap text-center">
                {isEn ? "Health Club Discount" : "হেলথ ক্লাব মেম্বার সুবিধা"}
              </th>
              <th className="py-3.5 px-3 sm:px-4 whitespace-nowrap text-center">
                {isEn ? "Duration" : "সেশনের সময়"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {pricingData.treatments.map((item, idx) => {
              const name = isEn ? item.treatmentNameEn : item.treatmentNameBn;

              return (
                <tr key={idx} className="hover:bg-muted/40 transition-colors">
                  <td className="py-3 px-3 sm:px-4">
                    <div className="space-y-0.5">
                      <span className="font-bold text-foreground block">{name}</span>
                      <span className="text-[11px] text-muted-foreground block">
                        {item.categoryBn}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-center font-mono text-muted-foreground whitespace-nowrap">
                    {item.regularPriceRangeBn}
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-center whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                      <Sparkles className="h-3 w-3 shrink-0" />
                      <span>{isEn ? "10-30% Member Discount" : "মেম্বার হলে ১০-৩০% ডিসকাউন্ট"}</span>
                    </span>
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-center text-muted-foreground whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-xs">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span>{item.durationBn}</span>
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
                ? "10-30% member discount on physiotherapy sessions in Feni!"
                : "ফেনীর পার্টনার ফিজিওথেরাপি সেন্টারে ১০-৩০% মেম্বার ডিসকাউন্ট পান!"}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {isEn
              ? "Health Club members receive guaranteed 10-30% discounts on stroke rehab, PLID traction, and therapy sessions at verified partner clinics (Central Physiotherapy, Islamia Physiotherapy)."
              : "হেলথ ক্লাব মেম্বার হলে ফেনীর পার্টনার ফিজিওথেরাপি সেন্টারে (সেন্ট্রাল ফিজিওথেরাপি অ্যান্ড রিহ্যাবিলিটেশন সেন্টার, ইসলামিয়া ফিজিওথেরাপি অ্যান্ড রিহ্যাবিলিটেশন সেন্টার) প্রতিটি সেশনে ১০-৩০% ডিসকাউন্ট পাবেন।"}
          </p>
        </div>

        <Link
          href="/membership"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs sm:text-sm font-bold shadow-xs transition-colors shrink-0"
        >
          <span>{isEn ? "Get Health Card" : "মেম্বারশিপ কার্ড সংগ্রহ করুন"}</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
