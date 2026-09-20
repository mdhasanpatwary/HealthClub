import Link from "next/link";
import { BloodBankComparisonItem } from "@/types/bloodBankBlog";
import { toBanglaNums } from "@/lib/utils";
import { CheckCircle2, XCircle, Droplet, AlertCircle, Search } from "lucide-react";
import {
  translateComparisonStatus,
  translateLocation,
} from "../utils/blogTranslations";

interface BloodBankComparisonTableProps {
  items: BloodBankComparisonItem[];
  locale?: string;
}

export function BloodBankComparisonTable({
  items,
  locale = "bn",
}: BloodBankComparisonTableProps) {
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
        <Droplet className="h-3 w-3 shrink-0" />
        <span>{translateComparisonStatus(val, isEn)}</span>
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Non-profit & Directory Disclaimer Banner */}
      <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-3.5 sm:p-4 text-xs sm:text-sm text-foreground/90 space-y-2">
        <div className="flex items-start gap-2.5">
          <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-rose-900 dark:text-rose-200">
              {isEn
                ? "Important Non-Profit Notice: Blood is 100% Free"
                : "জরুরি তথ্য ও নীতি: রক্তদান সম্পূর্ণ বিনামূল্যে ও অলাভজনক মানবিক সেবা"}
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isEn ? (
                <>
                  Commercial blood trading is strictly prohibited by law. Health Club has no commercial affiliation with external blood banks—all voluntary clubs operate purely for humanitarian assistance. Need voluntary blood donors right now? Search verified voluntary donors by blood group and upazila directly on Health Club&apos;s free{" "}
                  <Link
                    href="/emergency"
                    className="text-primary font-bold underline inline-flex items-center gap-0.5"
                  >
                    Emergency Blood Donor Directory (/emergency)
                  </Link>
                  .
                </>
              ) : (
                <>
                  রক্ত কেনাবেচা বা রক্ত নিয়ে আর্থিক লেনদেন আইনত সম্পূর্ণ নিষিদ্ধ ও দণ্ডনীয় অপরাধ। ফেনীর কোনো ব্লাড ব্যাংক বা রক্তদান সংগঠনের সাথে হেলথ ক্লাবের কোনো বাণিজ্যিক চুক্তি বা ছাড়ের সম্পর্ক নেই—সংগঠনগুলো সম্পূর্ণ অলাভজনকভাবে রোগীদের রক্তদাতা পেতে নিঃস্বার্থ সহায়তা দেয়। তাৎক্ষণিক রক্তদাতার প্রয়োজনে আপনি হেলথ ক্লাবের নিজস্ব ফ্রি{" "}
                  <Link
                    href="/emergency"
                    className="text-primary font-bold underline inline-flex items-center gap-0.5"
                  >
                    জরুরি রক্তদাতা ডিরেক্টরি (/emergency)
                  </Link>{" "}
                  থেকে সরাসরি রক্তের গ্রুপ ও উপজেলা অনুযায়ী ভেরিফায়েড রক্তদাতাদের সাথে সম্পূর্ণ বিনামূল্যে ফোনে যোগাযোগ করতে পারেন।
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground">
          {isEn
            ? "Feni Blood Banks & Voluntary Donor Networks Comparison Matrix"
            : "একনজরে ফেনী ব্লাড ব্যাংক ও স্বেচ্ছাসেবী রক্তদান সংগঠনের তুলনা"}
        </h3>
        <Link
          href="/emergency"
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          <Search className="h-3.5 w-3.5" />
          <span>{isEn ? "Open Live Directory" : "লাইভ ডিরেক্টরি"}</span>
        </Link>
      </div>

      <div className="relative overflow-x-auto rounded-2xl border border-border/80 bg-card shadow-xs">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-muted/80 text-foreground font-bold border-b border-border/80">
            <tr>
              <th className="py-3.5 px-3 sm:px-4 whitespace-nowrap text-center">
                {isEn ? "Rank" : "ক্রম"}
              </th>
              <th className="py-3.5 px-3 sm:px-4 min-w-[200px]">
                {isEn ? "Blood Center / Organization" : "ব্লাড ব্যাংক ও সংগঠনের নাম"}
              </th>
              <th className="py-3.5 px-3 sm:px-4 whitespace-nowrap text-center">
                {isEn ? "24/7 Availability" : "২৪/৭ সার্ভিস"}
              </th>
              <th className="py-3.5 px-3 sm:px-4 whitespace-nowrap text-center">
                {isEn ? "TTI Lab Screening" : "৫-পয়েন্ট স্ক্রিনিং"}
              </th>
              <th className="py-3.5 px-3 sm:px-4 whitespace-nowrap text-center">
                {isEn ? "Voluntary Network" : "স্বেচ্ছাসেবী নেটওয়ার্ক"}
              </th>
              <th className="py-3.5 px-3 sm:px-4 whitespace-nowrap text-center">
                {isEn ? "Rare Negative Desk" : "নেগেটিভ রক্তের সেল"}
              </th>
              <th className="py-3.5 px-3 sm:px-4 whitespace-nowrap text-center">
                {isEn ? "Service Fee / Blood Cost" : "সেবামূল্য (রক্তদান)"}
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
                className="hover:bg-muted/40 transition-colors"
              >
                <td className="py-3.5 px-3 sm:px-4 text-center font-bold text-muted-foreground whitespace-nowrap">
                  {isEn ? `#${item.rank}` : toBanglaNums(item.rank)}
                </td>
                <td className="py-3.5 px-3 sm:px-4">
                  <div className="font-semibold text-foreground">
                    {isEn ? item.nameEn : item.nameBn}
                  </div>
                  <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium block">
                    {item.hubBn}
                  </span>
                </td>
                <td className="py-3.5 px-3 sm:px-4 text-center whitespace-nowrap">
                  {renderStatus(item.is24x7)}
                </td>
                <td className="py-3.5 px-3 sm:px-4 text-center whitespace-nowrap">
                  {renderStatus(item.testingScreening)}
                </td>
                <td className="py-3.5 px-3 sm:px-4 text-center whitespace-nowrap">
                  {renderStatus(item.voluntaryNetwork)}
                </td>
                <td className="py-3.5 px-3 sm:px-4 text-center whitespace-nowrap">
                  {renderStatus(item.rareNegativeDesk)}
                </td>
                <td className="py-3.5 px-3 sm:px-4 text-center whitespace-nowrap">
                  <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                    {isEn
                      ? item.serviceFeeEn || item.discountEn || "100% Free Volunteer Service"
                      : item.serviceFeeBn || item.discountBn || "১০০% সম্পূর্ণ বিনামূল্যে"}
                  </span>
                </td>
                <td className="py-3.5 px-3 sm:px-4 text-muted-foreground text-xs">
                  {translateLocation(isEn ? item.locationEn || item.locationBn : item.locationBn, isEn)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
