"use client";

import { BloodDonor, UPAZILAS_FENI } from "@/data/emergencyData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { Edit3, Trash2, Phone, CheckCircle2 } from "lucide-react";

interface EmergencyDonorsListProps {
  donors: BloodDonor[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  isEn: boolean;
  onEdit: (donor: BloodDonor) => void;
  onDelete: (id: string, name: string) => void;
  onToggleStatus: (id: string) => void;
  onApprove?: (id: string) => void;
  loading?: boolean;
}

export function EmergencyDonorsList({
  donors,
  totalItems,
  totalPages,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  isEn,
  onEdit,
  onDelete,
  onToggleStatus,
  onApprove,
  loading = false,
}: EmergencyDonorsListProps) {
  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-border overflow-hidden bg-background">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="w-[60px]">{isEn ? "Group" : "গ্রুপ"}</TableHead>
              <TableHead>{isEn ? "Name" : "নাম"}</TableHead>
              <TableHead>{isEn ? "Upazila" : "উপজেলা"}</TableHead>
              <TableHead>{isEn ? "Phone" : "মোবাইল"}</TableHead>
              <TableHead>{isEn ? "Last Donated" : "সর্বশেষ দান"}</TableHead>
              <TableHead>{isEn ? "Available" : "প্রস্তুত"}</TableHead>
              <TableHead>{isEn ? "Approval" : "অনুমোদন"}</TableHead>
              <TableHead className="text-right">{isEn ? "Actions" : "অ্যাকশন"}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: Math.min(pageSize, 10) }).map((_, i) => (
                <TableRow key={`skeleton-${i}`} className="hover:bg-transparent">
                  <TableCell>
                    <Skeleton className="h-8 w-8 rounded-lg" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-28" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Skeleton className="h-7 w-7 rounded-md" />
                      <Skeleton className="h-7 w-7 rounded-md" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : donors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground text-xs">
                  {isEn ? "No blood donors found matching criteria." : "কোনো রক্তদাতার তথ্য পাওয়া যায়নি।"}
                </TableCell>
              </TableRow>
            ) : (
              donors.map((d) => {
                const upazilaObj = UPAZILAS_FENI.find((u) => u.id === d.upazila);
                const isPending = d.status === "pending";

                return (
                  <TableRow key={d.id} className="hover:bg-muted/30">
                    <TableCell>
                      <span className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 font-extrabold text-xs">
                        {d.bloodGroup}
                      </span>
                    </TableCell>
                    <TableCell className="font-bold text-xs text-foreground">
                      {d.name}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {isEn ? upazilaObj?.nameEn || d.upazila : upazilaObj?.nameBn || d.upazila}
                    </TableCell>
                    <TableCell className="text-xs font-mono">
                      <a href={`tel:${d.phone}`} className="text-primary hover:underline flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {d.phone}
                      </a>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {d.lastDonated}
                    </TableCell>
                    <TableCell>
                      <button
                        type="button"
                        onClick={() => onToggleStatus(d.id)}
                        className={`px-2 py-0.5 rounded-full text-[11px] font-bold transition-colors cursor-pointer ${
                          d.isAvailable
                            ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                            : "bg-rose-500/10 text-rose-600 hover:bg-rose-500/20"
                        }`}
                      >
                        {d.isAvailable ? (isEn ? "Available" : "প্রস্তুত") : (isEn ? "Unavailable" : "অপ্রস্তুত")}
                      </button>
                    </TableCell>
                    <TableCell>
                      {isPending ? (
                        <Badge variant="outline" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[10px] font-bold">
                          {isEn ? "Pending" : "অপেক্ষমাণ"}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-bold">
                          {isEn ? "Approved" : "অনুমোদিত"}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {isPending && onApprove && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => onApprove(d.id)}
                            title={isEn ? "Approve Donor" : "অনুমোদন করুন"}
                            aria-label={isEn ? `Approve donor ${d.name}` : `রক্তদাতা ${d.name} অনুমোদন করুন`}
                            className="h-7 w-7 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 cursor-pointer"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => onEdit(d)}
                          aria-label={isEn ? `Edit donor ${d.name}` : `রক্তদাতা ${d.name} এর তথ্য এডিট করুন`}
                          className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => onDelete(d.id, `${d.name} (${d.bloodGroup})`)}
                          aria-label={isEn ? `Delete donor ${d.name}` : `রক্তদাতা ${d.name} ডিলিট করুন`}
                          className="h-7 w-7 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
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
          locale={isEn ? "en" : "bn"}
          itemLabel={isEn ? "donors" : "জন রক্তদাতা"}
          disabled={loading}
        />
      )}

    </div>
  );
}

