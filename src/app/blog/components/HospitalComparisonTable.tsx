import { HospitalComparisonItem } from "@/types/blog";
import { toBanglaNums } from "@/lib/utils";
import { CheckCircle2, XCircle, ShieldCheck } from "lucide-react";

interface HospitalComparisonTableProps {
  items: HospitalComparisonItem[];
}

export function HospitalComparisonTable({
  items,
}: HospitalComparisonTableProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground">
          একনজরে ফেনীর সেরা ১০টি হাসপাতালের তুলনামূলক তালিকা
        </h3>
        <span className="text-xs text-muted-foreground hidden sm:inline">
          ডানে স্ক্রোল করে বিস্তারিত দেখুন →
        </span>
      </div>

      <div className="relative overflow-x-auto rounded-2xl border border-border/80 bg-card shadow-xs">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-muted/80 text-foreground font-bold border-b border-border/80">
            <tr>
              <th className="py-3.5 px-3 sm:px-4 whitespace-nowrap text-center">
                ক্রম
              </th>
              <th className="py-3.5 px-3 sm:px-4 min-w-[180px]">
                হাসপাতালের নাম
              </th>
              <th className="py-3.5 px-3 sm:px-4 whitespace-nowrap">
                ধরন
              </th>
              <th className="py-3.5 px-3 sm:px-4 whitespace-nowrap text-center">
                শয্যা সংখ্যা
              </th>
              <th className="py-3.5 px-3 sm:px-4 whitespace-nowrap text-center">
                আইসিইউ (ICU)
              </th>
              <th className="py-3.5 px-3 sm:px-4 whitespace-nowrap text-center">
                জরুরি বিভাগ
              </th>
              <th className="py-3.5 px-3 sm:px-4 min-w-[160px]">
                হেলথ ক্লাব সুবিধা
              </th>
              <th className="py-3.5 px-3 sm:px-4 min-w-[140px]">
                ঠিকানা / এলাকা
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {items.map((item) => {
              const name = item.nameBn || item.nameEn;
              const isPartner =
                item.partnerStatus !== undefined
                  ? item.partnerStatus
                  : item.discountBn.includes("হেলথ ক্লাব");

              return (
                <tr
                  key={item.rank}
                  className={`hover:bg-muted/40 transition-colors ${
                    isPartner ? "bg-primary/5 font-medium" : ""
                  }`}
                >
                  <td className="py-3 px-3 sm:px-4 text-center font-bold text-foreground">
                    {toBanglaNums(item.rank)}
                  </td>
                  <td className="py-3 px-3 sm:px-4">
                    <a
                      href={`#hospital-${item.rank}`}
                      className="font-bold text-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                    >
                      {isPartner && (
                        <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" />
                      )}
                      <span>{name}</span>
                    </a>
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-muted-foreground whitespace-nowrap">
                    {item.typeBn}
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-center font-medium whitespace-nowrap">
                    {item.bedCountBn}
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-center whitespace-nowrap">
                    {item.icu.toLowerCase().includes("নয়") || item.icu.toLowerCase().includes("নেই") ? (
                      <span className="inline-flex items-center gap-1 text-muted-foreground text-xs">
                        <XCircle className="h-3.5 w-3.5 text-slate-400" />
                        <span>নেই</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>{item.icu}</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-center whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-primary font-semibold text-xs">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>{item.emergency}</span>
                    </span>
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-xs">
                    {isPartner ? (
                      <span className="font-bold text-primary bg-primary/10 px-2 py-1 rounded-md inline-block">
                        {item.discountBn}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">
                        {item.discountBn}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-xs text-muted-foreground">
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
