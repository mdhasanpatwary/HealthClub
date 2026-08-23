"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MonthlySettlementStatement } from "@/types/partnerAnalytics";
import { Partner } from "@/services/db";
import { formatNum, Locale } from "@/lib/i18n";
import { exportPartnerSettlementCsv } from "@/lib/exportUtils";
import { PartnerSettlementPrintModal } from "./PartnerSettlementPrintModal";
import {
  FileText,
  Download,
  Printer,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";

interface PartnerSettlementStatementsTableProps {
  statements: MonthlySettlementStatement[];
  partner: Partner;
  locale: Locale;
}

export function PartnerSettlementStatementsTable({
  statements,
  partner,
  locale,
}: PartnerSettlementStatementsTableProps) {
  const isBn = locale === "bn";
  const [selectedStatement, setSelectedStatement] = useState<MonthlySettlementStatement | null>(null);
  const [printModalOpen, setPrintModalOpen] = useState(false);

  const handleOpenPrint = (statement: MonthlySettlementStatement) => {
    setSelectedStatement(statement);
    setPrintModalOpen(true);
  };

  const handleExportCsv = (statement: MonthlySettlementStatement) => {
    try {
      exportPartnerSettlementCsv(statement, partner.name);
      toast.success(
        isBn
          ? `${statement.monthLabelBn} এর সেটেলমেন্ট CSV ডাউনলোড সফল হয়েছে!`
          : `Settlement CSV for ${statement.monthLabelEn} downloaded successfully!`
      );
    } catch {
      toast.error(isBn ? "CSV ডাউনলোড করতে সমস্যা হয়েছে।" : "Failed to download CSV.");
    }
  };

  return (
    <>
      <Card className="border-border/70 shadow-sm rounded-2xl bg-card">
        <CardHeader className="p-5 pb-3 sm:p-6 sm:pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/40">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
                <FileText className="h-4 w-4" />
              </div>
              <CardTitle className="text-base sm:text-lg font-bold font-heading text-secondary dark:text-white">
                {isBn ? "মাসিক সেটেলমেন্ট ও বিলিং বিবরণী" : "Monthly Settlement & Billing Statements"}
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-muted-foreground">
              {isBn
                ? "মাসিক বিলিং সারসংক্ষেপ, প্রদত্ত ডিসকাউন্ট অডিট ও অফিসিয়াল স্টেটমেন্ট ডাউনলোড"
                : "Monthly billing summaries, dispensed discount audits, and official statement downloads"}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="font-semibold text-secondary dark:text-slate-200 whitespace-nowrap">
                    {isBn ? "বিলিং মাস" : "Billing Month"}
                  </TableHead>
                  <TableHead className="font-semibold text-secondary dark:text-slate-200 text-center whitespace-nowrap">
                    {isBn ? "রোগী সংখ্যা" : "Patients"}
                  </TableHead>
                  <TableHead className="font-semibold text-secondary dark:text-slate-200 text-right whitespace-nowrap">
                    {isBn ? "গ্রস বিল (৳)" : "Gross Bill (BDT)"}
                  </TableHead>
                  <TableHead className="font-semibold text-primary text-right whitespace-nowrap">
                    {isBn ? "মোট ছাড় (৳)" : "Total Discount (BDT)"}
                  </TableHead>
                  <TableHead className="font-semibold text-secondary dark:text-slate-200 text-right whitespace-nowrap">
                    {isBn ? "পরিশোধিত (৳)" : "Net Paid (BDT)"}
                  </TableHead>
                  <TableHead className="font-semibold text-secondary dark:text-slate-200 text-center whitespace-nowrap">
                    {isBn ? "স্ট্যাটাস" : "Status"}
                  </TableHead>
                  <TableHead className="font-semibold text-secondary dark:text-slate-200 text-right whitespace-nowrap">
                    {isBn ? "অ্যাকশন" : "Actions"}
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody className="text-xs sm:text-sm">
                {statements.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground text-xs">
                      {isBn ? "কোনো মাসিক সেটেলমেন্ট রেকর্ড পাওয়া যায়নি।" : "No monthly settlement records found."}
                    </TableCell>
                  </TableRow>
                ) : (
                  statements.map((st) => (
                    <TableRow key={st.monthKey} className="hover:bg-muted/30 transition-colors">
                      {/* Month Column */}
                      <TableCell className="font-bold text-secondary dark:text-white whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary shrink-0" />
                          <span>{isBn ? st.monthLabelBn : st.monthLabelEn}</span>
                        </div>
                      </TableCell>

                      {/* Patient Count */}
                      <TableCell className="text-center font-mono whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold text-xs">
                          {formatNum(st.totalTransactions, locale)} {isBn ? "জন" : "visits"}
                        </span>
                      </TableCell>

                      {/* Gross Bill */}
                      <TableCell className="text-right font-mono whitespace-nowrap font-medium text-slate-700 dark:text-slate-300">
                        ৳{formatNum(st.grossAmount, locale)}
                      </TableCell>

                      {/* Total Discount */}
                      <TableCell className="text-right font-mono text-primary font-bold whitespace-nowrap">
                        ৳{formatNum(st.totalDiscountDispensed, locale)}
                      </TableCell>

                      {/* Net Paid */}
                      <TableCell className="text-right font-mono font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        ৳{formatNum(st.netPatientPaid, locale)}
                      </TableCell>

                      {/* Status */}
                      <TableCell className="text-center whitespace-nowrap">
                        <Badge
                          variant="outline"
                          className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] px-2 py-0.5 font-semibold"
                        >
                          <CheckCircle2 className="h-3 w-3 mr-1 inline" />
                          {isBn ? "রেকর্ড সম্পন্ন" : "Settled"}
                        </Badge>
                      </TableCell>

                      {/* Action Buttons */}
                      <TableCell className="text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleExportCsv(st)}
                            title={isBn ? "CSV ডাউনলোড করুন" : "Download CSV"}
                            className="h-8 px-2.5 text-xs font-semibold rounded-xl border-border/80 text-muted-foreground hover:text-foreground cursor-pointer gap-1"
                          >
                            <Download className="h-3.5 w-3.5" />
                            <span className="hidden md:inline">CSV</span>
                          </Button>

                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleOpenPrint(st)}
                            title={isBn ? "স্টেটমেন্ট প্রিন্ট বা PDF হিসেবে সেভ করুন" : "Print or Save as PDF"}
                            className="h-8 px-2.5 text-xs font-semibold rounded-xl bg-primary hover:bg-primary/90 text-white cursor-pointer gap-1 shadow-xs"
                          >
                            <Printer className="h-3.5 w-3.5" />
                            <span className="hidden md:inline">{isBn ? "স্টেটমেন্ট" : "Statement"}</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Printable Statement Modal */}
      <PartnerSettlementPrintModal
        isOpen={printModalOpen}
        onClose={() => setPrintModalOpen(false)}
        statement={selectedStatement}
        partner={partner}
        locale={locale}
      />
    </>
  );
}
