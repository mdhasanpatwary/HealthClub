"use client";

import React from "react";
import { History, Download } from "lucide-react";
import { Transaction } from "@/services/db";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { exportToCsv } from "@/lib/exportUtils";
import { Locale } from "@/lib/i18n";

interface PartnerRecentTransactionsCardProps {
  transactions: Transaction[];
  loadingTransactions: boolean;
  locale: Locale;
  t: (key: string) => string;
}

export function PartnerRecentTransactionsCard({
  transactions,
  loadingTransactions,
  locale,
  t,
}: PartnerRecentTransactionsCardProps) {
  return (
    <Card className="border-border shadow-sm rounded-3xl h-full flex flex-col justify-between">
      <CardHeader className="flex flex-row items-center justify-between pb-3 p-5 sm:p-6">
        <div className="space-y-0.5">
          <CardTitle className="font-heading text-base font-bold text-secondary dark:text-white flex items-center gap-1.5">
            <History className="h-4 w-4 text-primary" />
            {t("partner.billing.recentTxTitle")}
          </CardTitle>
          <CardDescription className="text-xs">
            {t("partner.billing.recentTxSubtitle")}
          </CardDescription>
        </div>
        {transactions.length > 0 && (
          <Button
            onClick={() =>
              exportToCsv(transactions, "partner_transactions", [
                { header: "Transaction ID", accessor: "id" },
                { header: "Member ID", accessor: "memberId" },
                { header: "Member Name", accessor: "memberName" },
                { header: "Counter Desk", accessor: "deskName" },
                { header: "Processed By", accessor: "staffName" },
                { header: "Bill Amount (BDT)", accessor: "amount" },
                { header: "Saved Amount (BDT)", accessor: "saved" },
                { header: "Date", accessor: "date" },
              ])
            }
            variant="outline"
            size="sm"
            className="border-border gap-1.5 text-xs font-semibold h-8 rounded-xl cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>{t("partner.billing.export")}</span>
          </Button>
        )}
      </CardHeader>
      <CardContent className="px-0 flex-1">
        {loadingTransactions ? (
          <div className="divide-y divide-border/60 p-4 space-y-4 animate-pulse">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="py-2 flex justify-between items-start">
                <div className="space-y-1.5">
                  <Skeleton className="h-3.5 w-28" />
                  <Skeleton className="h-2.5 w-16" />
                </div>
                <div className="space-y-1.5 text-right">
                  <Skeleton className="h-3.5 w-14 ml-auto" />
                  <Skeleton className="h-2.5 w-10 ml-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="py-16 text-center text-xs sm:text-sm text-muted-foreground px-4">
            {t("partner.billing.noTxRecorded")}
          </div>
        ) : (
          <div className="divide-y divide-border/60 max-h-[500px] overflow-y-auto">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="p-4 flex justify-between items-start text-xs hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors"
              >
                <div className="space-y-0.5">
                  <p className="font-bold text-secondary dark:text-white">{tx.memberName}</p>
                  <div className="flex items-center gap-1.5 flex-wrap text-[10px] text-muted-foreground">
                    <span>{t("partner.billing.idPrefix")}: {tx.memberId}</span>
                    {tx.deskName && (
                      <span className="bg-primary/10 text-primary font-medium px-1.5 py-0.2 rounded">
                        {tx.deskName}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground font-mono">
                    {new Date(tx.date).toLocaleDateString(locale === "bn" ? "bn-BD" : "en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="text-right space-y-0.5">
                  <p className="font-bold text-secondary dark:text-white font-mono">
                    {t("partner.billing.bill")}: ৳{tx.amount}
                  </p>
                  <p className="font-extrabold text-primary font-mono">
                    {t("partner.billing.discount")}: ৳{tx.saved}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
