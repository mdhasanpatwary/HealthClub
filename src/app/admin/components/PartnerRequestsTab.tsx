"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { PartnerRequest } from "@/services/db";
import { Trash2 } from "lucide-react";

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
  onDelete?: (req: PartnerRequest) => void;
  onDeleteAllRejected?: () => void;
  statusFilter?: string;
  onStatusFilterChange?: (status: string) => void;
  hasRejectedRequests?: boolean;
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
  onDelete,
  onDeleteAllRejected,
  statusFilter = "all",
  onStatusFilterChange,
  hasRejectedRequests = false,
  loading = false,
  processingId = null,
}: PartnerRequestsTabProps) {
  return (
    <Card className="border-border shadow-md">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
        <div>
          <CardTitle className="font-heading text-lg font-bold text-secondary">
            পার্টনার আবেদন তালিকা
          </CardTitle>
          <CardDescription>
            নতুন পার্টনার হতে আগ্রহী ডায়াগনস্টিক, হাসপাতাল ও ক্লিনিকের আবেদন পর্যালোচনা ও অনুমোদন করুন
          </CardDescription>
        </div>

        {hasRejectedRequests && onDeleteAllRejected && (
          <Button
            size="sm"
            variant="outline"
            onClick={onDeleteAllRejected}
            disabled={loading || Boolean(processingId)}
            className="text-destructive border-destructive/30 hover:bg-destructive/10 text-xs h-8 px-3 font-semibold inline-flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shrink-0"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>বাতিলকৃত সব মুছুন</span>
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Filters */}
        {onStatusFilterChange && (
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-muted/40 rounded-xl border border-border/60 w-fit max-w-full overflow-x-auto">
            <Button
              type="button"
              variant={statusFilter === "all" ? "default" : "ghost"}
              size="sm"
              onClick={() => onStatusFilterChange("all")}
              className={`text-xs h-7 px-3 rounded-lg cursor-pointer transition-colors ${
                statusFilter === "all" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              সকল আবেদন
            </Button>
            <Button
              type="button"
              variant={statusFilter === "pending" ? "default" : "ghost"}
              size="sm"
              onClick={() => onStatusFilterChange("pending")}
              className={`text-xs h-7 px-3 rounded-lg cursor-pointer transition-colors ${
                statusFilter === "pending" ? "bg-amber-600 text-white hover:bg-amber-700" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              পেন্ডিং
            </Button>
            <Button
              type="button"
              variant={statusFilter === "approved" ? "default" : "ghost"}
              size="sm"
              onClick={() => onStatusFilterChange("approved")}
              className={`text-xs h-7 px-3 rounded-lg cursor-pointer transition-colors ${
                statusFilter === "approved" ? "bg-green-600 text-white hover:bg-green-700" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              অনুমোদিত
            </Button>
            <Button
              type="button"
              variant={statusFilter === "rejected" ? "default" : "ghost"}
              size="sm"
              onClick={() => onStatusFilterChange("rejected")}
              className={`text-xs h-7 px-3 rounded-lg cursor-pointer transition-colors ${
                statusFilter === "rejected" ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              বাতিলকৃত
            </Button>
          </div>
        )}
        <div className="overflow-hidden border border-border rounded-xl bg-background">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow className="hover:bg-transparent border-b border-border">
                <TableHead className="font-semibold text-secondary">প্রতিষ্ঠান ও ঠিকানা</TableHead>
                <TableHead className="font-semibold text-secondary">ক্যাটাগরি</TableHead>
                <TableHead className="font-semibold text-secondary">ডিসকাউন্ট অফার</TableHead>
                <TableHead className="font-semibold text-secondary">যোগাযোগ</TableHead>
                <TableHead className="font-semibold text-secondary">স্ট্যাটাস</TableHead>
                <TableHead className="font-semibold text-secondary text-right">অ্যাকশন</TableHead>
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
                    কোনো আবেদন পাওয়া যায়নি
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
                      {req.category === "hospital" ? "হাসপাতাল" : req.category === "diagnostic" ? "ডায়াগনস্টিক" : "ফার্মেসি"}
                    </TableCell>
                    <TableCell className="font-mono text-xs font-bold text-primary">
                      {req.discount}
                    </TableCell>
                    <TableCell className="text-xs space-y-0.5">
                      {req.contactName && <div className="font-semibold text-secondary dark:text-white">{req.contactName}</div>}
                      <div>মোবাইল: <span className="font-semibold">{req.phone}</span></div>
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
                        {req.status === "pending" ? "পেন্ডিং" : req.status === "approved" ? "অনুমোদিত" : "বাতিলকৃত"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {req.status === "pending" && (
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            disabled={loading || Boolean(processingId)}
                            onClick={() => onApprove(req.id)}
                            className="bg-primary hover:bg-primary-dark text-white text-xs h-7 py-1 px-3 animate-pulse disabled:opacity-50 cursor-pointer"
                          >
                            {processingId === req.id
                              ? "অনুমোদন হচ্ছে..."
                              : "অনুমোদন"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={loading || Boolean(processingId)}
                            onClick={() => onReject(req.id)}
                            className="text-destructive border-destructive/20 hover:bg-destructive/10 text-xs h-7 py-1 px-3 disabled:opacity-50 cursor-pointer"
                          >
                            {processingId === req.id
                              ? "প্রক্রিয়া হচ্ছে..."
                              : "বাতিল"}
                          </Button>
                        </div>
                      )}
                      {req.status === "rejected" && onDelete && (
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={loading || Boolean(processingId)}
                            onClick={() => onDelete(req)}
                            className="text-destructive border-destructive/30 hover:bg-destructive/10 text-xs h-7 py-1 px-2.5 disabled:opacity-50 inline-flex items-center gap-1 cursor-pointer"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>মুছে ফেলুন</span>
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
            itemLabel="টি আবেদন"
          />
        )}
      </CardContent>
    </Card>
  );
}

