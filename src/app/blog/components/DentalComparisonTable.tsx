import { DentalComparisonItem } from "@/types/blog";
import { toBanglaNums } from "@/lib/utils";
import { CheckCircle2, XCircle, ShieldCheck } from "lucide-react";

interface DentalComparisonTableProps {
  items: DentalComparisonItem[];
}

export function DentalComparisonTable({
  items,
}: DentalComparisonTableProps) {
  const renderStatus = (val: boolean | string) => {
    if (val === true) {
      return (
        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>আছে</span>
        </span>
      );
    }
    if (val === false) {
      return (
        <span className="inline-flex items-center gap-1 text-muted-foreground text-xs">
          <XCircle className="h-3.5 w-3.5 text-slate-400" />
          <span>নেই</span>
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
          একনজরে ফেনীর সেরা ডেন্টাল ক্লিনিকসমূহের প্রযুক্তি ও সেবা তুলনা
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
              <th className="py-3.5 px-3 sm:px-4 min-w-[190px]">
                ডেন্টাল ক্লিনিক
              </th>
              <th className="py-3.5 px-3 sm:px-4 min-w-[170px]">
                ইনচার্জ দন্ত চিকিৎসক
              </th>
              <th className="py-3.5 px-3 sm:px-4 whitespace-nowrap text-center">
                ডিজিটাল আরভিজি
              </th>
              <th className="py-3.5 px-3 sm:px-4 whitespace-nowrap text-center">
                লেজার / ইমপ্লান্ট
              </th>
              <th className="py-3.5 px-3 sm:px-4 whitespace-nowrap text-center">
                ব্রেসেস
              </th>
              <th className="py-3.5 px-3 sm:px-4 min-w-[150px]">
                মেম্বার ডিসকাউন্ট
              </th>
              <th className="py-3.5 px-3 sm:px-4 min-w-[120px]">
                ঠিকানা / এলাকা
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {items.map((item) => {
              const name = item.nameBn || item.nameEn;
              const isPartner = item.partnerStatus ?? false;

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
                      href={`#dental-${item.rank}`}
                      className="font-bold text-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                    >
                      {isPartner && (
                        <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" />
                      )}
                      <span>{name}</span>
                    </a>
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-xs">
                    <div className="font-semibold text-foreground">{item.leadDentistBn}</div>
                    <div className="text-[11px] text-muted-foreground">{item.degreesBn}</div>
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-center whitespace-nowrap">
                    {renderStatus(item.digitalRvg)}
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-center whitespace-nowrap">
                    {renderStatus(item.laserImplants)}
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-center whitespace-nowrap">
                    {renderStatus(item.bracesOrthodontics)}
                  </td>
                  <td className="py-3 px-3 sm:px-4">
                    {isPartner ? (
                      <span className="inline-flex items-center gap-1 text-primary font-bold text-xs bg-primary/10 px-2 py-0.5 rounded-md">
                        <ShieldCheck className="h-3 w-3 shrink-0" />
                        <span>{item.discountBn}</span>
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-xs">
                        {item.discountBn}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-muted-foreground text-xs whitespace-nowrap">
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
