import Link from "next/link";
import { MaternityCarePackageItem } from "@/types/blog";
import { ShieldCheck, ArrowRight, Clock, Sparkles } from "lucide-react";

interface MaternityPriceTableProps {
  pricingData: {
    titleBn: string;
    subtitleBn: string;
    packages: MaternityCarePackageItem[];
  };
  locale?: string;
}

export function MaternityPriceTable({
  pricingData,
  locale = "bn",
}: MaternityPriceTableProps) {
  const isEn = locale === "en";

  return (
    <section id="maternity-price-guide" className="scroll-mt-24 space-y-5">
      <div className="space-y-1.5">
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
          {isEn ? "Maternity & Delivery Cost Guide with Member Discounts" : pricingData.titleBn}
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          {isEn
            ? "Estimated delivery, ANC, and baby care charges in Feni with exclusive Health Club member savings."
            : pricingData.subtitleBn}
        </p>
      </div>

      <div className="relative overflow-x-auto rounded-2xl border border-border/80 bg-card shadow-xs">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-muted/80 text-foreground font-bold border-b border-border/80">
            <tr>
              <th className="py-3.5 px-3 sm:px-4 min-w-[200px]">
                {isEn ? "Package & Care Type" : "প্রসূতি সেবা ও প্যাকেজ"}
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
                {isEn ? "Stay / Validity" : "হাসপাতাল অবস্থান"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {pricingData.packages.map((item, idx) => {
              const name = isEn ? item.packageNameEn : item.packageNameBn;

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
                      <span>{item.stayOrDurationBn}</span>
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
              ? "All maternity discounts are applicable at Health Club partner hospitals (including Z.U Model Hospital, Al-Kamy Hospital Ltd.) upon presenting your digital member card."
              : "সকল প্রসূতি ও ডেলিভারি ছাড় হেলথ ক্লাবের নিবন্ধিত পার্টনার হাসপাতালগুলোতে (যেমন: জেড.ইউ মডেল হাসপাতাল, আল-কেমি হাসপাতাল ইত্যাদি) ডিজিটাল মেম্বার কার্ড প্রদর্শন করে তাৎক্ষণিক উপভোগ করা যায়।"}
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
