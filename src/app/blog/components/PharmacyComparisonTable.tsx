import { PharmacyComparisonItem } from "@/types/pharmacyBlog";
import { toBanglaNums } from "@/lib/utils";
import { CheckCircle2, XCircle, ShieldCheck, Moon } from "lucide-react";
import {
  translateComparisonStatus,
  translateLocation,
} from "../utils/blogTranslations";

interface PharmacyComparisonTableProps {
  items: PharmacyComparisonItem[];
  locale?: string;
}

export function PharmacyComparisonTable({
  items,
  locale = "bn",
}: PharmacyComparisonTableProps) {
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
      <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium text-xs">
        <Moon className="h-3 w-3 shrink-0" />
        <span>{translateComparisonStatus(val, isEn)}</span>
      </span>
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground">
          {isEn
            ? "24/7 Pharmacies & Night Counters Comparison Matrix"
            : "একনজরে ফেনীর শীর্ষ ২৪ ঘণ্টা ফার্মেসি ও নাইট সার্ভিসের তুলনা"}
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
                {isEn ? "Pharmacy Name" : "ফার্মেসির নাম"}
              </th>
              <th className="py-3.5 px-3 sm:px-4 whitespace-nowrap text-center">
                {isEn ? "24/7 Night Service" : "২৪/৭ নাইট সার্ভিস"}
              </th>
              <th className="py-3.5 px-3 sm:px-4 whitespace-nowrap text-center">
                {isEn ? "Home Delivery" : "হোম ডেলিভারি"}
              </th>
              <th className="py-3.5 px-3 sm:px-4 whitespace-nowrap text-center">
                {isEn ? "Cold Chain (2-8°C)" : "কোল্ড চেইন ইনসুলিন"}
              </th>
              <th className="py-3.5 px-3 sm:px-4 whitespace-nowrap text-center">
                {isEn ? "Prescription Verification" : "প্রেসক্রিপশন ভেরিফিকেশন"}
              </th>
              <th className="py-3.5 px-3 sm:px-4 whitespace-nowrap text-center">
                {isEn ? "Member Benefit" : "মেম্বার সুবিধা"}
              </th>
              <th className="py-3.5 px-3 sm:px-4 min-w-[150px]">
                {isEn ? "Location" : "এলাকা ও অবস্থান"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {items.map((item) => (
              <tr
                key={item.rank}
                className={`hover:bg-muted/40 transition-colors ${
                  item.partnerStatus ? "bg-primary/5 font-medium" : ""
                }`}
              >
                <td className="py-3.5 px-3 sm:px-4 text-center font-bold text-muted-foreground whitespace-nowrap">
                  {isEn ? `#${item.rank}` : toBanglaNums(item.rank)}
                </td>
                <td className="py-3.5 px-3 sm:px-4">
                  <div className="font-semibold text-foreground flex items-center gap-1.5">
                    {item.partnerStatus && (
                      <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    )}
                    <span>{isEn ? item.nameEn : item.nameBn}</span>
                  </div>
                  <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium block">
                    {item.hubBn}
                  </span>
                </td>
                <td className="py-3.5 px-3 sm:px-4 text-center whitespace-nowrap">
                  {renderStatus(item.is24x7)}
                </td>
                <td className="py-3.5 px-3 sm:px-4 text-center whitespace-nowrap">
                  {renderStatus(item.homeDelivery)}
                </td>
                <td className="py-3.5 px-3 sm:px-4 text-center whitespace-nowrap">
                  {renderStatus(item.coldChainInsulin)}
                </td>
                <td className="py-3.5 px-3 sm:px-4 text-center whitespace-nowrap">
                  {renderStatus(item.prescriptionVerification)}
                </td>
                <td className="py-3.5 px-3 sm:px-4 text-center whitespace-nowrap">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    {isEn ? "10-30% Discount" : "১০-৩০% মেম্বার ছাড়"}
                  </span>
                </td>
                <td className="py-3.5 px-3 sm:px-4 text-muted-foreground text-xs">
                  {translateLocation(item.locationBn, isEn)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
