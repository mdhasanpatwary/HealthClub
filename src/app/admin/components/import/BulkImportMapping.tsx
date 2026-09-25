"use client";

import { useState } from "react";
import { SlidersHorizontal, CheckCircle, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { ImportEntityType } from "@/types/bulkImport";
import { ENTITY_CONFIGS } from "@/lib/bulkImportUtils";
import { toBanglaNums } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface BulkImportMappingProps {
  entityType: ImportEntityType;
  rawHeaders: string[];
  mapping: Record<string, string | null>;
  onMappingChange: (targetKey: string, sourceHeader: string | null) => void;
}

export function BulkImportMapping({
  entityType,
  rawHeaders,
  mapping,
  onMappingChange,
}: BulkImportMappingProps) {
  const [isOpen, setIsOpen] = useState(false);

  const config = ENTITY_CONFIGS[entityType];

  const totalFields = config.columns.length;
  const mappedRequiredFields = config.columns
    .filter((c) => c.required)
    .every((c) => Boolean(mapping[c.key]));

  const mappedCount = Object.values(mapping).filter(Boolean).length;

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-secondary/10 text-secondary dark:text-white flex items-center justify-center">
            <SlidersHorizontal className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xs font-bold text-foreground">
                কলাম ম্যাপিং ও ফিল্ড কনফিগারেশন
              </p>
              {mappedRequiredFields ? (
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-200 text-[10px] py-0">
                  <CheckCircle className="h-2.5 w-2.5 mr-1" />
                  সকল প্রয়োজনীয় ফিল্ড প্রস্তুত
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-200 text-[10px] py-0">
                  <AlertTriangle className="h-2.5 w-2.5 mr-1" />
                  প্রয়োজনীয় ফিল্ড ম্যাপিং বাকি
                </Badge>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {`${toBanglaNums(totalFields)} টির মধ্যে ${toBanglaNums(mappedCount)} টি কলাম সফলভাবে ম্যাচ হয়েছে`}
            </p>
          </div>
        </div>

        <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>

      {isOpen && (
        <div className="border-t border-border p-4 bg-muted/10 space-y-3">
          <p className="text-[11px] text-muted-foreground">
            অটো-ম্যাপিং ভুল হলে নিচে থেকে সঠিক স্প্রেডশিট কলাম নির্বাচন করে দিন:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {config.columns.map((col) => {
              const selectedValue = mapping[col.key] || "";
              const isMatched = Boolean(selectedValue);

              return (
                <div
                  key={col.key}
                  className={`p-2.5 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs transition-colors ${
                    col.required && !isMatched
                      ? "border-amber-400 bg-amber-500/5"
                      : "border-border bg-background"
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-foreground">
                        {col.labelBn}
                      </span>
                      {col.required && (
                        <span className="text-[10px] font-bold text-rose-500">*</span>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {col.key}
                    </span>
                  </div>

                  <select
                    value={selectedValue}
                    onChange={(e) =>
                      onMappingChange(col.key, e.target.value ? e.target.value : null)
                    }
                    className="h-8 px-2 text-xs rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary min-w-[140px]"
                  >
                    <option value="">-- নির্বাচন করুন --</option>
                    {rawHeaders.map((header) => (
                      <option key={header} value={header}>
                        {header}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
