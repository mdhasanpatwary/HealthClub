import { DiagnosticComparisonItem } from "@/types/blog";
import { toBanglaNums } from "@/lib/utils";
import { CheckCircle2, XCircle, ShieldCheck } from "lucide-react";
import {
  translateComparisonStatus,
  translateDiscount,
  translateLocation,
} from "../utils/blogTranslations";

interface DiagnosticComparisonTableProps {
  items: DiagnosticComparisonItem[];
  locale?: string;
}

export function DiagnosticComparisonTable({
  items,
  locale = "bn",
}: DiagnosticComparisonTableProps) {
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
        {translateComparisonStatus(val, isEn)}
      </span>
    );
  };

  const hasMri = items.some((item) => item.mriAvailable !== undefined);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground">
          {isEn
            ? "Quick Equipment Comparison Matrix (At a Glance)"
            : "একনজরে ফেনীর শীর্ষ ১০ ডায়াগনস্টিকের প্রযুক্তি ও সেবা তুলনা"}
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
              <th className="py-3.5 px-3 sm:px-4 min-w-[190px]">
                {isEn ? "Diagnostic Center" : "ডায়াগনস্টিক সেন্টার"}
              </th>
              {hasMri && (
                <th className="py-3.5 px-3 sm:px-4 whitespace-nowrap text-center">
                  {isEn ? "1.5T MRI" : "১.৫টি এমআরআই"}
                </th>
              )}
              <th className="py-3.5 px-3 sm:px-4 whitespace-nowrap text-center">
                {isEn ? "CT Scan" : "সিটি স্ক্যান"}
              </th>
              <th className="py-3.5 px-3 sm:px-4 whitespace-nowrap text-center">
                {isEn ? "4D USG" : "৪ডি ইউএসজি"}
              </th>
              <th className="py-3.5 px-3 sm:px-4 whitespace-nowrap text-center">
                {isEn ? "Digital X-Ray" : "ডিজিটাল এক্স-রে"}
              </th>
              <th className="py-3.5 px-3 sm:px-4 whitespace-nowrap text-center">
                {isEn ? "Automated Lab" : "অটো ল্যাব"}
              </th>
              <th className="py-3.5 px-3 sm:px-4 min-w-[160px]">
                {isEn ? "Health Club Discount" : "হেলথ ক্লাব সুবিধা"}
              </th>
              <th className="py-3.5 px-3 sm:px-4 min-w-[130px]">
                {isEn ? "Location" : "ঠিকানা / এলাকা"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {items.map((item) => {
              const name = isEn ? item.nameEn : item.nameBn;
              const isPartner = item.partnerStatus ?? (item.discountBn.includes("হেলথ ক্লাব") || item.discountBn.includes("১০-৩০%"));

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
                      href={`#diagnostic-${item.rank}`}
                      className="font-bold text-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                    >
                      {isPartner && (
                        <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" />
                      )}
                      <span>{name}</span>
                    </a>
                  </td>
                  {hasMri && (
                    <td className="py-3 px-3 sm:px-4 text-center whitespace-nowrap">
                      {renderStatus(item.mriAvailable)}
                    </td>
                  )}
                  <td className="py-3 px-3 sm:px-4 text-center whitespace-nowrap">
                    {renderStatus(item.ctScanAvailable)}
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-center whitespace-nowrap">
                    {renderStatus(item.ultrasound4D)}
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-center whitespace-nowrap">
                    {renderStatus(item.digitalXray)}
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-center whitespace-nowrap">
                    {renderStatus(item.automatedLab)}
                  </td>
                  <td className="py-3 px-3 sm:px-4">
                    {isPartner ? (
                      <span className="inline-flex items-center gap-1 text-primary font-bold text-xs bg-primary/10 px-2 py-0.5 rounded-md">
                        <ShieldCheck className="h-3 w-3 shrink-0" />
                        <span>{translateDiscount(item.discountBn, isEn)}</span>
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-xs">
                        {translateDiscount(item.discountBn, isEn)}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-muted-foreground text-xs whitespace-nowrap">
                    {translateLocation(item.locationBn, isEn)}
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
