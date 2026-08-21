"use client";

import { EmergencyHotline } from "@/data/emergencyData";
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

interface EmergencyHotlinesListProps {
  hotlines: EmergencyHotline[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  isEn: boolean;
  onEdit: (hotline: EmergencyHotline) => void;
  onDelete: (id: string, name: string) => void;
  loading?: boolean;
}

export function EmergencyHotlinesList({
  hotlines,
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
}: EmergencyHotlinesListProps) {
  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-border overflow-hidden bg-background">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="w-[100px]">{isEn ? "Category" : "ক্যাটাগরি"}</TableHead>
              <TableHead>{isEn ? "Title / Organization" : "সংস্থা / সেবার নাম"}</TableHead>
              <TableHead>{isEn ? "Phone Number" : "হটলাইন নম্বর"}</TableHead>
              <TableHead>{isEn ? "Description" : "বিবরণ"}</TableHead>
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
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-40" />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Skeleton className="h-7 w-7 rounded-md" />
                      <Skeleton className="h-7 w-7 rounded-md" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : hotlines.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground text-xs">
                  {isEn ? "No hotlines found." : "কোনো হটলাইন পাওয়া যায়নি।"}
                </TableCell>
              </TableRow>
            ) : (
              hotlines.map((h) => (
                <TableRow key={h.id} className="hover:bg-muted/30">
                  <TableCell>
                    <Badge className="bg-primary/10 text-primary font-bold border-primary/20 text-[10px] capitalize">
                      {h.category.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-bold text-xs text-foreground">
                    {isEn ? h.titleEn : h.titleBn}
                  </TableCell>
                  <TableCell className="text-xs font-mono">
                    <a href={`tel:${h.phone}`} className="text-primary hover:underline flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {h.phone}
                    </a>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[250px] truncate">
                    {isEn ? h.descriptionEn : h.descriptionBn}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onEdit(h)}
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onDelete(h.id, isEn ? h.titleEn : h.titleBn)}
                        className="h-7 w-7 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30"
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
          itemLabel={isEn ? "hotlines" : "টি হটলাইন"}
          disabled={loading}
        />
      )}
    </div>
  );
}


