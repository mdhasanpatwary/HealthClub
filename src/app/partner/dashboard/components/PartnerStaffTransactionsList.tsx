"use client";

import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { CreditCard, Receipt, Search } from "lucide-react";
import { toBanglaNums } from "@/lib/utils";
import { Transaction } from "@/services/db";

export type FilterPeriod = "all" | "today" | "week" | "month";

interface PartnerStaffTransactionsListProps {
  transactions: Transaction[];
  loading: boolean;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  filterPeriod: FilterPeriod;
  onFilterPeriodChange: (period: FilterPeriod) => void;
}

export function PartnerStaffTransactionsList({
  transactions,
  loading,
  searchQuery,
  onSearchChange,
  filterPeriod,
  onFilterPeriodChange,
}: PartnerStaffTransactionsListProps) {
  const filteredTransactions = useMemo(() => {
    if (!transactions.length) return [];
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);

    return transactions.filter((tx) => {
      const txDate = new Date(tx.date);

      if (filterPeriod === "today" && txDate < todayStart) return false;
      if (filterPeriod === "week" && txDate < weekStart) return false;
      if (filterPeriod === "month" && txDate < monthStart) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = tx.memberName?.toLowerCase().includes(q);
        const matchesId = tx.memberId?.toLowerCase().includes(q);
        const matchesDate = tx.date?.toLowerCase().includes(q);
        if (!matchesName && !matchesId && !matchesDate) return false;
      }

      return true;
    });
  }, [transactions, filterPeriod, searchQuery]);

  return (
    <div className="space-y-3 pt-1 border-t border-border/70">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-primary" />
          <h4 className="text-sm font-bold font-heading text-secondary dark:text-white">
            লেনদেন ইতিহাস ({toBanglaNums(filteredTransactions.length)})
          </h4>
        </div>

        {/* Timeframe Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          {(
            [
              { id: "all", label: "সকল" },
              { id: "today", label: "আজ" },
              { id: "week", label: "এই সপ্তাহ" },
              { id: "month", label: "এই মাস" },
            ] as const
          ).map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onFilterPeriodChange(p.id)}
              className={`text-[11px] px-2.5 py-1 rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                filterPeriod === p.id
                  ? "bg-primary text-white border-primary font-semibold shadow-xs"
                  : "bg-muted/40 text-muted-foreground border-border hover:bg-muted"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="সদস্য নাম, কার্ড নম্বর বা তারিখ দিয়ে খুঁজুন..."
          className="pl-9 h-9 text-xs rounded-xl bg-card border-border"
        />
      </div>

      {/* Transactions List */}
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-xl" />
          ))}
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="p-8 text-center rounded-2xl border border-dashed border-border/80 bg-muted/20 space-y-2">
          <Receipt className="h-8 w-8 text-muted-foreground mx-auto opacity-50" />
          <div className="space-y-0.5">
            <p className="text-xs font-semibold text-foreground">
              কোনো লেনদেন পাওয়া যায়নি
            </p>
            <p className="text-[11px] text-muted-foreground">
              নির্বাচিত ফিল্টারের সাথে কোনো রেকর্ড মেলেনি
            </p>
          </div>
        </div>
      ) : (
        <div className="border border-border rounded-2xl overflow-hidden overflow-x-hidden bg-card divide-y divide-border/60 max-h-60 sm:max-h-72 overflow-y-auto">
          {filteredTransactions.map((tx) => {
            const txDate = new Date(tx.date);
            const dateStr = txDate.toLocaleDateString("bn-BD", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });
            const timeStr = txDate.toLocaleTimeString("bn-BD", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            });
            const netPayable = tx.amount - tx.saved;

            return (
              <div
                key={tx.id}
                className="p-3 sm:px-4 flex items-center justify-between gap-3 hover:bg-muted/30 transition-colors"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-xs text-foreground truncate">
                      {tx.memberName}
                    </span>
                    <Badge
                      variant="outline"
                      className="text-[10px] font-mono px-1.5 py-0 border-border text-muted-foreground"
                    >
                      {tx.memberId}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    {dateStr} &bull; {timeStr}
                  </p>
                </div>

                <div className="text-right shrink-0 space-y-0.5">
                  <div className="text-xs font-mono font-bold text-foreground">
                    ৳{toBanglaNums(tx.amount.toLocaleString("bn-BD"))}
                  </div>
                  <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                    -ছাড়: ৳{toBanglaNums(tx.saved.toLocaleString("bn-BD"))}
                  </div>
                  <div className="text-[10px] text-muted-foreground font-mono">
                    পরিশোধিত: ৳{toBanglaNums(netPayable.toLocaleString("bn-BD"))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
