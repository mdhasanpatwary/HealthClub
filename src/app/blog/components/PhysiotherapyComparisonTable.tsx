import { PhysiotherapyComparisonItem } from "@/types/blog";
import { toBanglaNums } from "@/lib/utils";
import { CheckCircle2, XCircle, ShieldCheck } from "lucide-react";

interface PhysiotherapyComparisonTableProps {
  items: PhysiotherapyComparisonItem[];
  locale?: string;
}

export function PhysiotherapyComparisonTable({
  items,
  locale = "bn",
}: PhysiotherapyComparisonTableProps) {
  const isEn = locale === "en";

  const renderStatus = (val: boolean | string) => {
    if (val === true) {
      return (
        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>{isEn ? "Yes" : "আছে"}</span>
        </span>
      );
    }
    if (val === false) {
      return (
        <span className="inline-flex items-center gap-1 text-muted-foreground text-xs">
          <XCircle className="h-3.5 w-3.5 text-slate-400" />
          <span>{isEn ? "No" : "নেই"}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center text-amber-600 dark:text-amber-400 font-medium text-xs">
        {val}
      </span>
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground">
          {isEn
            ? "Quick Physiotherapy Comparison Matrix (At a Glance)"
            : "একনজরে ফেনীর সেরা ১০ ফিজিওথেরাপি সেন্টারের প্রযুক্তি ও সুবিধা তুলনা"}
        </h3>
        <span className="text-xs text-muted-foreground hidden sm:inline">
          {isEn ? "Swipe right to see more →" : "ডানে স্ক্রোল করে বিস্তারিত দেখুন →"}
        </span>
      </div>

      <div className="relative overflow-x-auto rounded-2xl border border-border/80 bg-card shadow-xs">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-muted/80 text-foreground font-bold border-b border-border/80">
            <tr>
              <th className="py-3.5 px-3 sm:px-4 whitespace-nowrap text-center">
                {isEn ? "Rank" : "ক্রম"}
              </th>
              <th className="py-3.5 px-3 sm:px-4 min-w-[200px]">
                {isEn ? "Physiotherapy Center" : "ফিজিওথেরাপি সেন্টার"}
              </th>
              <th className="py-3.5 px-3 sm:px-4 min-w-[170px]">
                {isEn ? "Lead Therapist" : "ইনচার্জ ফিজিওথেরাপিস্ট"}
              </th>
              <th className="py-3.5 px-3 sm:px-4 whitespace-nowrap text-center">
                {isEn ? "Traction & SWD" : "ট্র্যাকশন ও ডায়াথার্মি"}
              </th>
              <th className="py-3.5 px-3 sm:px-4 whitespace-nowrap text-center">
                {isEn ? "Stroke Rehab" : "স্ট্রোক রিহ্যাব"}
              </th>
              <th className="py-3.5 px-3 sm:px-4 whitespace-nowrap text-center">
                {isEn ? "Home Service" : "হোম সার্ভিস"}
              </th>
              <th className="py-3.5 px-3 sm:px-4 min-w-[160px]">
                {isEn ? "Member Perks" : "মেম্বার ডিসকাউন্ট"}
              </th>
              <th className="py-3.5 px-3 sm:px-4 min-w-[120px]">
                {isEn ? "Location" : "ঠিকানা / এলাকা"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {items.map((item) => {
              const name = isEn ? item.nameEn : item.nameBn;
              const isPartner = item.partnerStatus ?? false;

              return (
                <tr
                  key={item.rank}
                  className={`hover:bg-muted/40 transition-colors ${
                    isPartner ? "bg-primary/5 font-medium" : ""
                  }`}
                >
                  <td className="py-3 px-3 sm:px-4 text-center font-bold text-foreground">
                    {isEn ? `#${item.rank}` : toBanglaNums(item.rank)}
                  </td>
                  <td className="py-3 px-3 sm:px-4">
                    <a
                      href={`#physio-${item.rank}`}
                      className="font-bold text-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                    >
                      <span>{name}</span>
                      {isPartner && (
                        <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                      )}
                    </a>
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-muted-foreground">
                    <div>{item.leadTherapistBn}</div>
                    <div className="text-[11px] text-muted-foreground/80">{item.degreesBn}</div>
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-center whitespace-nowrap">
                    {renderStatus(item.tractionSwd)}
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-center whitespace-nowrap">
                    {renderStatus(item.strokeRehab)}
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-center whitespace-nowrap">
                    {renderStatus(item.homeService)}
                  </td>
                  <td className="py-3 px-3 sm:px-4">
                    {isPartner ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                        {item.discountBn}
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-xs">{item.discountBn}</span>
                    )}
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-muted-foreground whitespace-nowrap">
                    {item.locationBn}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
