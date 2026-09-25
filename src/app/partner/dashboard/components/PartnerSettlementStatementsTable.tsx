"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MonthlySettlementStatement } from "@/types/partnerAnalytics";
import { Partner } from "@/services/db";
import { toBanglaNums } from "@/lib/utils";
import { exportPartnerSettlementCsv } from "@/lib/exportUtils";
import { PartnerSettlementPrintModal } from "./PartnerSettlementPrintModal";
import {
  FileText,
  Download,
  Printer,
  CheckCircle2,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

interface PartnerSettlementStatementsTableProps {
  statements: MonthlySettlementStatement[];
  partner: Partner;
}

export function PartnerSettlementStatementsTable({
  statements,
  partner,
}: PartnerSettlementStatementsTableProps) {
  const [selectedStatement, setSelectedStatement] = useState<MonthlySettlementStatement | null>(null);
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const totalPages = Math.max(1, Math.ceil(statements.length / pageSize));
  const paginatedStatements = statements.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleOpenPrint = (statement: MonthlySettlementStatement) => {
    setSelectedStatement(statement);
    setPrintModalOpen(true);
  };

  const handleExportCsv = (statement: MonthlySettlementStatement) => {
    try {
      const exported = exportPartnerSettlementCsv(statement, partner.name);
      if (!exported) return;
      toast.success(
        `${statement.monthLabelBn} এর সেটেলমেন্ট CSV ডাউনলোড সফল হয়েছে!`
      );
    } catch {
      toast.error("CSV ডাউনলোড করতে সমস্যা হয়েছে।");
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
                মাসিক সেটেলমেন্ট ও বিলিং বিবরণী
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-muted-foreground">
              মাসিক বিলিং সারসংক্ষেপ, প্রদত্ত ডিসকাউন্ট অডিট ও অফিসিয়াল স্টেটমেন্ট ডাউনলোড
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="font-semibold text-secondary dark:text-slate-200 whitespace-nowrap">
                    বিলিং মাস
                  </TableHead>
                  <TableHead className="font-semibold text-secondary dark:text-slate-200 text-center whitespace-nowrap">
                    রোগী সংখ্যা
                  </TableHead>
                  <TableHead className="font-semibold text-secondary dark:text-slate-200 text-right whitespace-nowrap">
                    গ্রস বিল (৳)
                  </TableHead>
                  <TableHead className="font-semibold text-primary text-right whitespace-nowrap">
                    মোট ছাড় (৳)
                  </TableHead>
                  <TableHead className="font-semibold text-secondary dark:text-slate-200 text-right whitespace-nowrap">
                    পরিশোধিত (৳)
                  </TableHead>
                  <TableHead className="font-semibold text-secondary dark:text-slate-200 text-center whitespace-nowrap">
                    স্ট্যাটাস
                  </TableHead>
                  <TableHead className="font-semibold text-secondary dark:text-slate-200 text-right whitespace-nowrap">
                    অ্যাকশন
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody className="text-xs sm:text-sm">
                {statements.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground text-xs">
                      কোনো মাসিক সেটেলমেন্ট রেকর্ড পাওয়া যায়নি।
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedStatements.map((st) => (
                    <TableRow key={st.monthKey} className="hover:bg-muted/30 transition-colors">
                      {/* Month Column */}
                      <TableCell className="font-bold text-secondary dark:text-white whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary shrink-0" />
                          <span>{st.monthLabelBn}</span>
                        </div>
                      </TableCell>

                      {/* Patient Count */}
                      <TableCell className="text-center font-mono whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold text-xs">
                          {toBanglaNums(st.totalTransactions)} জন
                        </span>
                      </TableCell>

                      {/* Gross Bill */}
                      <TableCell className="text-right font-mono whitespace-nowrap font-medium text-slate-700 dark:text-slate-300">
                        ৳{toBanglaNums(st.grossAmount)}
                      </TableCell>

                      {/* Total Discount */}
                      <TableCell className="text-right font-mono text-primary font-bold whitespace-nowrap">
                        ৳{toBanglaNums(st.totalDiscountDispensed)}
                      </TableCell>

                      {/* Net Paid */}
                      <TableCell className="text-right font-mono font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        ৳{toBanglaNums(st.netPatientPaid)}
                      </TableCell>

                      {/* Status */}
                      <TableCell className="text-center whitespace-nowrap">
                        <Badge
                          variant="outline"
                          className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] px-2 py-0.5 font-semibold"
                        >
                          <CheckCircle2 className="h-3 w-3 mr-1 inline" />
                          রেকর্ড সম্পন্ন
                        </Badge>
                      </TableCell>

                      {/* Action Buttons */}
                      <TableCell className="text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleExportCsv(st)}
                            title="CSV ডাউনলোড করুন"
                            className="h-8 px-2.5 text-xs font-semibold rounded-xl border-border/80 text-muted-foreground hover:text-foreground cursor-pointer gap-1"
                          >
                            <Download className="h-3.5 w-3.5" />
                            <span className="hidden md:inline">CSV</span>
                          </Button>

                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleOpenPrint(st)}
                            title="স্টেটমেন্ট প্রিন্ট বা PDF হিসেবে সেভ করুন"
                            className="h-8 px-2.5 text-xs font-semibold rounded-xl bg-primary hover:bg-primary/90 text-white cursor-pointer gap-1 shadow-xs"
                          >
                            <Printer className="h-3.5 w-3.5" />
                            <span className="hidden md:inline">স্টেটমেন্ট</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls for Statements */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-muted/20">
              <p className="text-xs text-muted-foreground font-mono">
                পৃষ্ঠা {toBanglaNums(currentPage)} / {toBanglaNums(totalPages)} ({toBanglaNums(statements.length)} টি মাস)
              </p>
              <div className="flex items-center gap-1.5 self-start sm:self-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage <= 1}
                  className="text-xs rounded-xl h-8 px-2.5 cursor-pointer gap-1"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span>পূর্ববর্তী</span>
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Button
                    key={p}
                    variant={p === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(p)}
                    className={`text-xs rounded-xl h-8 w-8 p-0 cursor-pointer ${
                      p === currentPage ? "bg-primary text-white font-bold" : ""
                    }`}
                  >
                    {toBanglaNums(p)}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage >= totalPages}
                  className="text-xs rounded-xl h-8 px-2.5 cursor-pointer gap-1"
                >
                  <span>পরবর্তী</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Printable Statement Modal */}
      <PartnerSettlementPrintModal
        isOpen={printModalOpen}
        onClose={() => setPrintModalOpen(false)}
        statement={selectedStatement}
        partner={partner}
      />
    </>
  );
}
