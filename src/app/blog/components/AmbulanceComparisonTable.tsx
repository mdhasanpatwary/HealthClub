import Link from "next/link";
import { AmbulanceComparisonItem } from "@/types/ambulanceBlog";
import { toBanglaNums } from "@/lib/utils";
import { CheckCircle2, XCircle, AlertCircle, Truck } from "lucide-react";
import {
  translateComparisonStatus,
  translateLocation,
} from "../utils/blogTranslations";

interface AmbulanceComparisonTableProps {
  items: AmbulanceComparisonItem[];
  locale?: string;
}

export function AmbulanceComparisonTable({
  items,
  locale = "bn",
}: AmbulanceComparisonTableProps) {
  const isEn = locale === "en";

  const renderStatus = (val: boolean | string) => {
    if (val === true) {
      return (
        <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold text-xs">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>{isEn ? "Yes" : "আছে"}</span>
        </span>
      );
    }
    if (val === false) {
      return (
        <span className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-400 text-xs">
          <XCircle className="h-3.5 w-3.5 text-slate-400" />
          <span>{isEn ? "No" : "নেই"}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-400 font-semibold text-xs">
        <Truck className="h-3 w-3 shrink-0" />
        <span>{translateComparisonStatus(val, isEn)}</span>
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Emergency Notice & Conversion Banner */}
      <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-3.5 sm:p-4 text-xs sm:text-sm text-foreground/90 space-y-2">
        <div className="flex items-start gap-2.5">
          <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-rose-900 dark:text-rose-200">
              {isEn
                ? "Emergency Advisory: Open Public Directory (Direct Driver Calling)"
                : "জরুরি সতর্কতা: উন্মুক্ত পাবলিক ডিরেক্টরি (দালাল এড়িয়ে সরাসরি চালকের সাথে কথা বলুন)"}
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isEn ? (
                <>
                  This is an open public emergency directory connecting patients directly with verified ambulance and oxygen providers across Feni. All fares are standard public rates negotiated and paid directly to drivers. Avoid hospital middlemen who inflate charges by 30% to 50%; always call verified drivers directly. Need an immediate ambulance? Search real-time available drivers on Health Club&apos;s live{" "}
                  <Link
                    href="/emergency?tab=ambulances"
                    className="text-primary font-bold underline inline-flex items-center gap-0.5"
                  >
                    Emergency Ambulance Directory (/emergency)
                  </Link>
                  .
                </>
              ) : (
                <>
                  এটি সবার জন্য উন্মুক্ত একটি জরুরি পাবলিক ডিরেক্টরি — যেখানে সরাসরি ভেরিফায়েড চালক ও এজেন্সির সাথে যোগাযোগ করে সাধারণ প্রমিত ভাড়ায় দ্রুত সেবা নিশ্চিত করা যায়। হাসপাতালের জরুরি গেটে থাকা দালাল চক্র এড়িয়ে সরাসরি চালকের সাথে কথা বলে অতিরিক্ত ৩০-৫০% কমিশন ছাড়া দ্রুত গাড়ি বুকিং করুন। তাৎক্ষণিক অ্যাম্বুলেন্স পেতে হেলথ ক্লাবের লাইভ{" "}
                  <Link
                    href="/emergency?tab=ambulances"
                    className="text-primary font-bold underline inline-flex items-center gap-0.5"
                  >
                    জরুরি অ্যাম্বুলেন্স তালিকা (/emergency?tab=ambulances)
                  </Link>{" "}
                  থেকে সরাসরি যাচাইকৃত চালকের সাথে কথা বলুন।
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground">
          {isEn
            ? "Feni 24/7 Ambulance Fleet Comparison Matrix"
            : "একনজরে ফেনীর শীর্ষ ১২টি অ্যাম্বুলেন্স সার্ভিসের সুবিধা তুলনা"}
        </h3>
        <span className="text-xs text-muted-foreground hidden sm:inline-block">
          {isEn
            ? "Swipe horizontally to view all features"
            : "সব তথ্য দেখতে ডানে-বামে স্ক্রোল করুন"}
        </span>
      </div>

      <div className="relative overflow-x-auto rounded-2xl border border-border/80 bg-card shadow-xs">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-muted/80 text-foreground font-bold border-b border-border/80">
            <tr>
              <th className="py-3 px-3 sm:px-4 min-w-[180px]">
                {isEn ? "Ambulance / Service" : "অ্যাম্বুলেন্স / সার্ভিস"}
              </th>
              <th className="py-3 px-3 sm:px-4 text-center min-w-[90px]">
                {isEn ? "24/7 Service" : "২৪/৭ সার্ভিস"}
              </th>
              <th className="py-3 px-3 sm:px-4 text-center min-w-[110px]">
                {isEn ? "ICU Ventilator" : "আইসিইউ ভেন্টিলেটর"}
              </th>
              <th className="py-3 px-3 sm:px-4 text-center min-w-[100px]">
                {isEn ? "Oxygen Support" : "অক্সিজেন লাইন"}
              </th>
              <th className="py-3 px-3 sm:px-4 text-center min-w-[120px]">
                {isEn ? "Dhaka/Ctg Route" : "ঢাকা-চট্টগ্রাম রুট"}
              </th>
              <th className="py-3 px-3 sm:px-4 text-center min-w-[100px]">
                {isEn ? "Freezer Van" : "ফ্রিজিং ভ্যান"}
              </th>
              <th className="py-3 px-3 sm:px-4 min-w-[130px]">
                {isEn ? "Service Status" : "সার্ভিস স্ট্যাটাস"}
              </th>
              <th className="py-3 px-3 sm:px-4 min-w-[160px]">
                {isEn ? "Standby Location" : "স্ট্যান্ডবাই অবস্থান"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {items.map((item) => {
              const name = isEn ? item.nameEn : item.nameBn;
              const location = isEn
                ? item.locationEn || translateLocation(item.locationBn, true)
                : item.locationBn;

              return (
                <tr
                  key={item.rank}
                  className="hover:bg-muted/40 transition-colors"
                >
                  <td className="py-3 px-3 sm:px-4 font-medium text-foreground">
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-primary/10 text-primary font-bold text-[11px] shrink-0">
                        {isEn ? item.rank : toBanglaNums(item.rank)}
                      </span>
                      <a
                        href={`#ambulance-${item.rank}`}
                        className="hover:text-primary transition-colors hover:underline"
                      >
                        {name}
                      </a>
                    </div>
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-center">
                    {renderStatus(item.is24x7)}
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-center">
                    {renderStatus(item.icuVentilator)}
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-center">
                    {renderStatus(item.oxygenSupply)}
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-center">
                    {renderStatus(item.dhakaCtgTransfer)}
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-center">
                    {renderStatus(item.freezingVan)}
                  </td>
                  <td className="py-3 px-3 sm:px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-sky-500/10 text-sky-800 dark:text-sky-300 border border-sky-500/20">
                      {isEn ? item.discountEn || "Public Directory (Direct Booking)" : item.discountBn || "পাবলিক ডিরেক্টরি (সরাসরি বুকিং)"}
                    </span>
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-slate-600 dark:text-slate-300 text-xs">
                    {location}
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
