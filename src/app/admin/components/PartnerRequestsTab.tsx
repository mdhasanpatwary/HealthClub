"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { PartnerRequest } from "@/services/db";
import { Locale } from "@/lib/i18n";

import { Skeleton } from "@/components/ui/skeleton";

interface PartnerRequestsTabProps {
  partnerRequests: PartnerRequest[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  locale?: Locale;
  t?: (key: string) => string;
  loading?: boolean;
  processingId?: string | null;
}

export function PartnerRequestsTab({
  partnerRequests,
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
  processingId = null,
}: PartnerRequestsTabProps) {
  const isEn = locale === "en";


  return (
    <Card className="border-border shadow-md">
      <CardHeader>
        <CardTitle className="font-heading text-lg font-bold text-secondary">
          {t("admin.partnerRequests.title")}
        </CardTitle>
        <CardDescription>
          {t("admin.partnerRequests.desc")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="overflow-hidden border border-border rounded-xl bg-background">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow className="hover:bg-transparent border-b border-border">
                <TableHead className="font-semibold text-secondary">{t("admin.partnerRequests.orgAddress")}</TableHead>
                <TableHead className="font-semibold text-secondary">{t("admin.partnerRequests.category")}</TableHead>
                <TableHead className="font-semibold text-secondary">{t("admin.partnerRequests.discountRate")}</TableHead>
                <TableHead className="font-semibold text-secondary">{t("admin.partnerRequests.contact")}</TableHead>
                <TableHead className="font-semibold text-secondary">{t("admin.partnerRequests.status")}</TableHead>
                <TableHead className="font-semibold text-secondary text-right">{t("admin.partnerRequests.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: Math.min(pageSize, 10) }).map((_, i) => (
                  <TableRow key={`skeleton-${i}`} className="hover:bg-transparent border-b border-border/60">
                    <TableCell>
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-36" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-12 font-bold" />
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Skeleton className="h-3.5 w-24" />
                        <Skeleton className="h-3 w-28 font-mono" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Skeleton className="h-7 w-16 rounded-md" />
                        <Skeleton className="h-7 w-16 rounded-md" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : partnerRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-xs">
                    {t("admin.partnerRequests.noRequests")}
                  </TableCell>
                </TableRow>
              ) : (
                partnerRequests.map((req) => (
                  <TableRow key={req.id} className="hover:bg-muted/20 border-b border-border/60">
                    <TableCell>
                      <div className="font-bold text-secondary">{req.orgName}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{req.address}</div>
                    </TableCell>
                    <TableCell className="capitalize text-xs font-semibold">
                      {req.category === "hospital" ? (isEn ? "Hospital" : "হাসপাতাল") : req.category === "diagnostic" ? (isEn ? "Diagnostic" : "ডায়াগনস্টিক") : (isEn ? "Pharmacy" : "ফার্মেসি")}
                    </TableCell>
                    <TableCell className="font-mono text-xs font-bold text-primary">
                      {req.discount}
                    </TableCell>
                    <TableCell className="text-xs space-y-0.5">
                      {req.contactName && <div className="font-semibold text-secondary dark:text-white">{req.contactName}</div>}
                      <div>{isEn ? "Mobile" : "মোবাইল"}: <span className="font-semibold">{req.phone}</span></div>
                      {req.email && <div className="text-muted-foreground">{req.email}</div>}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        req.status === "pending"
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                          : req.status === "approved"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                      }`}>
                        {req.status === "pending" ? (isEn ? "Pending" : "পেন্ডিং") : req.status === "approved" ? (isEn ? "Approved" : "অনুমোদিত") : (isEn ? "Rejected" : "বাতিলকৃত")}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {req.status === "pending" && (
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            disabled={loading || Boolean(processingId)}
                            onClick={() => onApprove(req.id)}
                            className="bg-primary hover:bg-primary-dark text-white text-xs h-7 py-1 px-3 animate-pulse disabled:opacity-50"
                          >
                            {processingId === req.id
                              ? (isEn ? "Approving..." : "অনুমোদন হচ্ছে...")
                              : t("admin.partnerRequests.approve")}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={loading || Boolean(processingId)}
                            onClick={() => onReject(req.id)}
                            className="text-destructive border-destructive/20 hover:bg-destructive/10 text-xs h-7 py-1 px-3 disabled:opacity-50"
                          >
                            {processingId === req.id
                              ? (isEn ? "Processing..." : "প্রক্রিয়া হচ্ছে...")
                              : t("admin.partnerRequests.reject")}
                          </Button>
                        </div>
                      )}
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
            locale={locale}
            t={t}
            itemLabel={isEn ? "requests" : "টি আবেদন"}
          />
        )}
      </CardContent>
    </Card>
  );
}

