"use client";

import { AmbulanceService } from "@/data/emergencyData";
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
import { Edit3, Trash2, Phone } from "lucide-react";

interface EmergencyAmbulancesListProps {
  ambulances: AmbulanceService[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  isEn: boolean;
  onEdit: (ambulance: AmbulanceService) => void;
  onDelete: (id: string, name: string) => void;
  loading?: boolean;
}

export function EmergencyAmbulancesList({
  ambulances,
  totalItems,
  totalPages,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  isEn,
  onEdit,
  onDelete,
  loading = false,
}: EmergencyAmbulancesListProps) {
  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-border overflow-hidden bg-background">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="w-[100px]">{isEn ? "Type" : "ধরন"}</TableHead>
              <TableHead>{isEn ? "Service / Agency" : "অ্যাম্বুলেন্স / এজেন্সি"}</TableHead>
              <TableHead>{isEn ? "Stand / Location" : "স্ট্যান্ড / এলাকা"}</TableHead>
              <TableHead>{isEn ? "Phone" : "মোবাইল"}</TableHead>
              <TableHead>{isEn ? "Hours" : "সময়"}</TableHead>
              <TableHead className="text-right">{isEn ? "Actions" : "অ্যাকশন"}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: Math.min(pageSize, 10) }).map((_, i) => (
                <TableRow key={`skeleton-${i}`} className="hover:bg-transparent">
                  <TableCell>
                    <Skeleton className="h-5 w-14 rounded-md" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-36" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-28" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Skeleton className="h-7 w-7 rounded-md" />
                      <Skeleton className="h-7 w-7 rounded-md" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : ambulances.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-xs">
                  {isEn ? "No ambulance services found." : "কোনো অ্যাম্বুলেন্স পাওয়া যায়নি।"}
                </TableCell>
              </TableRow>
            ) : (

              ambulances.map((a) => (
                <TableRow key={a.id} className="hover:bg-muted/30">
                  <TableCell>
                    <Badge
                      className={`font-bold border text-[10px] ${
                        a.type === "ICU"
                          ? "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20"
                          : a.type === "AC"
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
                          : a.type === "Freezer"
                          ? "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/20"
                          : "bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      {a.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-bold text-xs text-foreground">
                    {a.name}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {a.location}
                  </TableCell>
                  <TableCell className="text-xs font-mono">
                    <a href={`tel:${a.phone}`} className="text-primary hover:underline flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {a.phone}
                    </a>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {a.availableHours}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onEdit(a)}
                        aria-label={isEn ? `Edit ambulance ${a.name}` : `অ্যাম্বুলেন্স ${a.name} এর তথ্য এডিট করুন`}
                        className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onDelete(a.id, a.name)}
                        aria-label={isEn ? `Delete ambulance ${a.name}` : `অ্যাম্বুলেন্স ${a.name} ডিলিট করুন`}
                        className="h-7 w-7 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
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
          locale={isEn ? "en" : "bn"}
          itemLabel={isEn ? "ambulances" : "টি অ্যাম্বুলেন্স"}
          disabled={loading}
        />
      )}

    </div>
  );
}

