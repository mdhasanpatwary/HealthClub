"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle, Trash2, Check, X, Filter } from "lucide-react";
import { ImportEntityType, ProcessedRow } from "@/types/bulkImport";
import { ENTITY_CONFIGS } from "@/lib/bulkImportUtils";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface BulkImportPreviewTableProps {
  entityType: ImportEntityType;
  processedRows: ProcessedRow[];
  onDeleteRow: (id: string) => void;
}

export function BulkImportPreviewTable({
  entityType,
  processedRows,
  onDeleteRow,
}: BulkImportPreviewTableProps) {
  const { locale } = useLanguage();
  const isBn = locale === "bn";
  const [filter, setFilter] = useState<"all" | "valid" | "error">("all");

  const config = ENTITY_CONFIGS[entityType];

  const totalCount = processedRows.length;
  const validCount = processedRows.filter((r) => r.isValid).length;
  const errorCount = totalCount - validCount;

  const filteredRows = processedRows.filter((r) => {
    if (filter === "valid") return r.isValid;
    if (filter === "error") return !r.isValid;
    return true;
  });

  // Display only first 5 primary columns in table preview to keep it readable
  const primaryColumns = config.columns.slice(0, 5);

  return (
    <div className="space-y-3">
      {/* Controls & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-2 bg-muted/40 rounded-xl border border-border">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <Button
            type="button"
            size="sm"
            variant={filter === "all" ? "default" : "ghost"}
            onClick={() => setFilter("all")}
            className="h-8 text-xs font-semibold rounded-lg gap-1.5"
          >
            <Filter className="h-3 w-3" />
            <span>{isBn ? "সকল সারি" : "All Rows"}</span>
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 ml-1">
              {totalCount}
            </Badge>
          </Button>

          <Button
            type="button"
            size="sm"
            variant={filter === "valid" ? "default" : "ghost"}
            onClick={() => setFilter("valid")}
            className="h-8 text-xs font-semibold rounded-lg gap-1.5 text-emerald-700 dark:text-emerald-400"
          >
            <Check className="h-3 w-3" />
            <span>{isBn ? "সঠিক ডেটা" : "Valid"}</span>
            <Badge variant="outline" className="bg-emerald-500/10 border-emerald-300 text-emerald-700 dark:text-emerald-400 text-[10px] px-1.5 py-0 ml-1">
              {validCount}
            </Badge>
          </Button>

          <Button
            type="button"
            size="sm"
            variant={filter === "error" ? "default" : "ghost"}
            onClick={() => setFilter("error")}
            className="h-8 text-xs font-semibold rounded-lg gap-1.5 text-rose-600 dark:text-rose-400"
          >
            <X className="h-3 w-3" />
            <span>{isBn ? "ত্রুটিপূর্ণ সারি" : "Has Errors"}</span>
            <Badge variant="outline" className="bg-rose-500/10 border-rose-300 text-rose-600 dark:text-rose-400 text-[10px] px-1.5 py-0 ml-1">
              {errorCount}
            </Badge>
          </Button>
        </div>

        <p className="text-[11px] text-muted-foreground self-end sm:self-center px-1">
          {isBn
            ? `${totalCount} টির মধ্যে ${validCount} টি রেকর্ড ইম্পোর্ট উপযোগী`
            : `${validCount} of ${totalCount} ready to import`}
        </p>
      </div>

      {/* Table Container */}
      <div className="border border-border rounded-xl bg-card overflow-hidden shadow-xs">
        <div className="max-h-[380px] overflow-y-auto overflow-x-auto scrollbar-thin">
          <Table>
            <TableHeader className="bg-muted/60 sticky top-0 z-10">
              <TableRow className="border-b border-border">
                <TableHead className="w-12 text-center text-xs font-bold">#</TableHead>
                <TableHead className="w-24 text-xs font-bold">{isBn ? "স্ট্যাটাস" : "Status"}</TableHead>
                {primaryColumns.map((col) => (
                  <TableHead key={col.key} className="text-xs font-bold whitespace-nowrap">
                    {isBn ? col.labelBn : col.labelEn}
                  </TableHead>
                ))}
                <TableHead className="text-xs font-bold">{isBn ? "ত্রুটির বিবরণ" : "Validation Issues"}</TableHead>
                <TableHead className="w-12 text-center text-xs font-bold">{isBn ? "অ্যাকশন" : "Action"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={primaryColumns.length + 3}
                    className="text-center py-8 text-xs text-muted-foreground"
                  >
                    {isBn ? "কোন সারি পাওয়া যায়নি।" : "No rows found for current filter."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredRows.map((row) => (
                  <TableRow
                    key={row.id}
                    className={`border-b border-border text-xs transition-colors ${
                      row.isValid ? "hover:bg-muted/30" : "bg-rose-500/5 hover:bg-rose-500/10"
                    }`}
                  >
                    <TableCell className="text-center font-mono font-bold text-muted-foreground">
                      {row.rowIndex}
                    </TableCell>

                    <TableCell>
                      {row.isValid ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[11px] font-semibold">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>{isBn ? "সঠিক" : "Valid"}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 text-[11px] font-semibold">
                          <AlertCircle className="h-3 w-3" />
                          <span>{isBn ? "ত্রুটি" : "Error"}</span>
                        </span>
                      )}
                    </TableCell>

                    {primaryColumns.map((col) => {
                      const val = (row.data as Record<string, unknown>)[col.key];
                      return (
                        <TableCell key={col.key} className="whitespace-nowrap max-w-[160px] truncate">
                          {val !== undefined && val !== null && String(val) !== "" ? (
                            <span className="text-foreground">{String(val)}</span>
                          ) : (
                            <span className="text-muted-foreground/40 italic">--</span>
                          )}
                        </TableCell>
                      );
                    })}

                    <TableCell className="min-w-[200px]">
                      {row.isValid ? (
                        <span className="text-[11px] text-emerald-600 font-medium">
                          {isBn ? "কোন ত্রুটি নেই" : "Ready to import"}
                        </span>
                      ) : (
                        <div className="space-y-1">
                          {row.errors.map((err, i) => (
                            <p key={i} className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">
                              • <span className="font-semibold">{err.field}:</span> {err.message}
                            </p>
                          ))}
                        </div>
                      )}
                    </TableCell>

                    <TableCell className="text-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteRow(row.id)}
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-rose-600 transition-colors"
                        title={isBn ? "সারিটি মুছে দিন" : "Remove row"}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
