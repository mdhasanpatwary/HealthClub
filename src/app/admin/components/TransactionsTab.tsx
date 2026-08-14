"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Transaction } from "@/services/db";
import { formatNum, Locale } from "@/lib/i18n";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportToCsv } from "@/lib/exportUtils";

interface TransactionsTabProps {
  transactions: Transaction[];
  locale: Locale;
  t: (key: string) => string;
}

export function TransactionsTab({
  transactions,
  locale,
  t,
}: TransactionsTabProps) {
  return (
    <Card className="border-border shadow-md">
      <CardHeader className="flex flex-row justify-between items-center">
        <div>
          <CardTitle className="font-heading text-lg font-bold text-secondary">{t("admin.dashboard.recentTransactionsTitle")}</CardTitle>
          <CardDescription>{t("admin.dashboard.txDescLabel")}</CardDescription>
        </div>
        <Button
          onClick={() =>
            exportToCsv(transactions, "healthclub_transactions", [
              { header: "Transaction ID", accessor: "id" },
              { header: "Member ID", accessor: "memberId" },
              { header: "Member Name", accessor: "memberName" },
              { header: "Partner ID", accessor: "partnerId" },
              { header: "Partner Name", accessor: "partnerName" },
              { header: "Bill Amount (BDT)", accessor: "amount" },
              { header: "Saved Amount (BDT)", accessor: "saved" },
              { header: "Date", accessor: "date" },
            ])
          }
          variant="outline"
          size="sm"
          className="border-border gap-1.5 text-xs font-semibold"
        >
          <Download className="h-3.5 w-3.5" />
          <span>{locale === "en" ? "Export CSV" : "এক্সপোর্ট"}</span>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold text-secondary whitespace-nowrap">{t("admin.dashboard.memberName")}</TableHead>
                <TableHead className="font-semibold text-secondary whitespace-nowrap">{t("admin.dashboard.medicalCenter")}</TableHead>
                <TableHead className="font-semibold text-secondary whitespace-nowrap">{t("admin.dashboard.date")}</TableHead>
                <TableHead className="font-semibold text-secondary text-right whitespace-nowrap">{t("admin.dashboard.totalBill")}</TableHead>
                <TableHead className="font-semibold text-primary text-right whitespace-nowrap">{t("admin.dashboard.savings")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs sm:text-sm">
              {transactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className="font-semibold text-secondary whitespace-nowrap">
                    {tx.memberName}
                    <span className="block text-[10px] text-muted-foreground font-mono font-normal">{tx.memberId}</span>
                  </TableCell>
                  <TableCell className="text-secondary whitespace-nowrap">{tx.partnerName}</TableCell>
                  <TableCell className="text-muted-foreground whitespace-nowrap">{tx.date}</TableCell>
                  <TableCell className="text-right font-mono whitespace-nowrap">৳{formatNum(tx.amount, locale)}</TableCell>
                  <TableCell className="text-right font-mono text-primary font-bold whitespace-nowrap">৳{formatNum(tx.saved, locale)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
