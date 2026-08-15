"use client";

import { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const totalPages = Math.ceil(transactions.length / pageSize) || 1;
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedTransactions = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * pageSize;
    return transactions.slice(startIndex, startIndex + pageSize);
  }, [transactions, safeCurrentPage, pageSize]);

  const isEn = locale === "en";

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
          className="border-border gap-1.5 text-xs font-semibold shrink-0"
        >
          <Download className="h-3.5 w-3.5" />
          <span>{isEn ? "Export CSV" : "এক্সপোর্ট"}</span>
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
              {paginatedTransactions.length > 0 ? (
                paginatedTransactions.map((tx) => (
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
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground text-xs">
                    {t("admin.dashboard.noTxsFound") || (isEn ? "No transaction records found." : "কোনো লেনদেনের রেকর্ড পাওয়া যায়নি।")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Footer */}
        {transactions.length > 0 && (
          <Pagination
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={transactions.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
            pageSizeOptions={[10, 20, 50, 100]}
            locale={locale}
            t={t}
            itemLabel={isEn ? "transactions" : "টি লেনদেন"}
          />
        )}
      </CardContent>
    </Card>
  );
}
