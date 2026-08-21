"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { Check, X } from "lucide-react";
import { Member } from "@/services/db";
import { Locale } from "@/lib/i18n";

import { Skeleton } from "@/components/ui/skeleton";

interface RenewalsTabProps {
  members: Member[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  locale: Locale | string;
  t?: (key: string) => string;
  loading?: boolean;
}

export function RenewalsTab({
  members,
  totalItems,
  totalPages,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onApprove,
  onReject,
  locale = "bn",
  t = (k) => k,
  loading = false,
}: RenewalsTabProps) {
  const isEn = locale === "en";


  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(locale === "bn" ? "bn-BD" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <Card className="border-border shadow-md">
      <CardHeader>
        <CardTitle className="font-heading text-lg font-bold text-secondary">
          {t("admin.renewals.title")}
        </CardTitle>
        <CardDescription>
          {t("admin.renewals.desc")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="overflow-hidden border border-border rounded-xl bg-background">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow className="hover:bg-transparent border-b border-border">
                <TableHead className="font-semibold text-secondary w-[180px]">
                  {t("admin.renewals.memberName")}
                </TableHead>
                <TableHead className="font-semibold text-secondary w-[140px]">
                  {t("admin.renewals.memberId")}
                </TableHead>
                <TableHead className="font-semibold text-secondary w-[140px]">
                  {t("admin.renewals.paymentDetails")}
                </TableHead>
                <TableHead className="font-semibold text-secondary w-[160px]">
                  {t("admin.renewals.txnId")}
                </TableHead>
                <TableHead className="font-semibold text-secondary w-[150px]">
                  {t("admin.renewals.currentExpiry")}
                </TableHead>
                <TableHead className="font-semibold text-secondary text-right w-[150px]">
                  {t("admin.renewals.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: Math.min(pageSize, 10) }).map((_, i) => (
                  <TableRow key={`skeleton-${i}`} className="hover:bg-transparent border-b border-border/60">
                    <TableCell>
                      <Skeleton className="h-4 w-28" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20 font-mono" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24 font-mono" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-28 font-mono" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Skeleton className="h-8 w-16 rounded-lg" />
                        <Skeleton className="h-8 w-16 rounded-lg" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : members.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-muted-foreground text-sm">
                    {t("admin.renewals.noPending")}
                  </TableCell>
                </TableRow>
              ) : (
                members.map((m) => (
                  <TableRow key={m.id} className="hover:bg-muted/20 border-b border-border/60">
                    <TableCell className="font-bold text-secondary">{m.name}</TableCell>
                    <TableCell className="font-mono text-xs text-primary font-semibold">{m.id}</TableCell>
                    <TableCell className="font-mono text-xs text-secondary">{m.renewalBkashSender || "-"}</TableCell>
                    <TableCell className="font-mono text-xs text-secondary uppercase font-bold">{m.renewalBkashTxnId || "-"}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{formatDate(m.expiryDate)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="sm"
                          onClick={() => onApprove(m.id)}
                          className="bg-primary hover:bg-primary-dark text-white font-bold h-8 text-[11px] gap-1 rounded-lg shadow-sm"
                        >
                          <Check className="h-3.5 w-3.5" />
                          {t("admin.renewals.approve")}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => onReject(m.id)}
                          className="h-8 text-[11px] gap-1 rounded-lg shadow-sm"
                        >
                          <X className="h-3.5 w-3.5" />
                          {t("admin.renewals.reject")}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Footer */}
        {totalItems > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
            pageSizeOptions={[10, 20, 50, 100]}
            locale={locale as Locale}
            t={t}
            itemLabel={isEn ? "renewals" : "টি নবায়ন আবেদন"}
          />
        )}
      </CardContent>
    </Card>
  );
}

