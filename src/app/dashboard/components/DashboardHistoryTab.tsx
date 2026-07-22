import { History, PlusCircle, ReceiptText } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Transaction, Member } from "@/services/db";
import { Locale } from "@/lib/i18n";

interface DashboardHistoryTabProps {
  transactions: Transaction[];
  allowMemberTx: boolean;
  user: Member;
  setIsAddTxOpen: (open: boolean) => void;
  t: (key: string) => string;
  locale: Locale;
}

export function DashboardHistoryTab({
  transactions,
  allowMemberTx,
  user,
  setIsAddTxOpen,
  t,
  locale,
}: DashboardHistoryTabProps) {
  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="border-b border-border/60 bg-muted/30 dark:bg-slate-900/40 flex flex-row items-center justify-between gap-2 flex-wrap">
        <div>
          <CardTitle className="font-heading text-base font-bold text-secondary dark:text-white flex items-center gap-2">
            <History className="h-4 w-4 text-primary" />
            {t("dashboard.history.title")}
          </CardTitle>
          <CardDescription>
            {t("dashboard.history.description")}
          </CardDescription>
        </div>
        {allowMemberTx && user.status === "active" && (
          <Button
            onClick={() => setIsAddTxOpen(true)}
            size="sm"
            className="bg-primary hover:bg-primary-dark text-white text-xs font-semibold gap-1.5 shrink-0 w-full sm:w-auto"
          >
            <PlusCircle className="h-4 w-4" />
            <span>{t("dashboard.history.addTxButton")}</span>
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-0">
        {transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 dark:bg-slate-900/40">
                  <TableHead className="font-semibold text-secondary dark:text-white whitespace-nowrap">{t("dashboard.history.table.hospital")}</TableHead>
                  <TableHead className="font-semibold text-secondary dark:text-white whitespace-nowrap">{t("dashboard.history.table.date")}</TableHead>
                  <TableHead className="font-semibold text-secondary dark:text-white text-right whitespace-nowrap">{t("dashboard.history.table.bill")}</TableHead>
                  <TableHead className="font-semibold text-primary text-right whitespace-nowrap">{t("dashboard.history.table.saved")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-xs sm:text-sm">
                {transactions.map((tx) => (
                  <TableRow key={tx.id} className="hover:bg-muted/40 dark:hover:bg-slate-800/40 transition-colors">
                    <TableCell className="font-medium text-secondary dark:text-white">{tx.partnerName}</TableCell>
                    <TableCell className="text-muted-foreground">{tx.date}</TableCell>
                    <TableCell className="text-right font-mono">৳{tx.amount.toLocaleString(locale === "en" ? "en-US" : "bn-BD")}</TableCell>
                    <TableCell className="text-right font-mono text-emerald-600 dark:text-emerald-400 font-bold">৳{tx.saved.toLocaleString(locale === "en" ? "en-US" : "bn-BD")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <ReceiptText className="h-10 w-10 mx-auto mb-3 text-muted-foreground/40" />
            <p className="text-sm font-medium">{t("dashboard.history.noRecords")}</p>
            <p className="text-xs mt-1">{t("dashboard.history.noRecordsDesc")}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
