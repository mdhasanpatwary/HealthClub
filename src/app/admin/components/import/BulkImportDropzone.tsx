"use client";

import { useRef, useState } from "react";
import { UploadCloud, FileSpreadsheet, Download, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImportEntityType } from "@/types/bulkImport";
import { ENTITY_CONFIGS, downloadSampleTemplate } from "@/lib/bulkImportUtils";
import { useLanguage } from "@/components/layout/LanguageProvider";

interface BulkImportDropzoneProps {
  entityType: ImportEntityType;
  fileName: string | null;
  fileSize: number | null;
  rowCount: number;
  onFileSelect: (file: File) => void;
  onReset: () => void;
  loading: boolean;
}

export function BulkImportDropzone({
  entityType,
  fileName,
  fileSize,
  rowCount,
  onFileSelect,
  onReset,
  loading,
}: BulkImportDropzoneProps) {
  const { locale } = useLanguage();
  const isBn = locale === "bn";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const config = ENTITY_CONFIGS[entityType];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4">
      {/* Template Download Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-muted/40 border border-border">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <FileSpreadsheet className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-foreground">
              {isBn ? `${config.titleBn} এর স্যাম্পল টেমপ্লেট` : `Sample Template for ${config.titleEn}`}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {isBn
                ? "সঠিক কলাম ফরম্যাট ও নমুনা ডেটা দেখতে টেমপ্লেট ডাউনলোড করুন"
                : "Download pre-formatted spreadsheet template with sample values"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => downloadSampleTemplate(entityType, "xlsx")}
            className="h-8 text-xs font-semibold gap-1.5 border-border flex-1 sm:flex-initial"
          >
            <Download className="h-3.5 w-3.5 text-emerald-600" />
            <span>{isBn ? "এক্সেল (.xlsx)" : "Excel (.xlsx)"}</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => downloadSampleTemplate(entityType, "csv")}
            className="h-8 text-xs font-semibold gap-1.5 border-border flex-1 sm:flex-initial"
          >
            <Download className="h-3.5 w-3.5 text-blue-600" />
            <span>{isBn ? "সিএসভি (.csv)" : "CSV (.csv)"}</span>
          </Button>
        </div>
      </div>

      {/* Dropzone Area */}
      {!fileName ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
            isDragOver
              ? "border-primary bg-primary/5 scale-[1.01]"
              : "border-border hover:border-primary/50 hover:bg-muted/30 bg-card"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx, .xls, .csv"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                onFileSelect(e.target.files[0]);
              }
            }}
          />

          <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-xs">
            <UploadCloud className="h-7 w-7" />
          </div>

          <div className="space-y-1 max-w-md">
            <p className="text-sm font-bold text-foreground">
              {isBn
                ? "এখানে এক্সেল বা সিএসভি ফাইল ড্রপ করুন অথবা ব্রাউজ করুন"
                : "Drag & drop your spreadsheet file here, or browse"}
            </p>
            <p className="text-xs text-muted-foreground">
              {isBn
                ? "সমর্থিত ফাইল ফরম্যাট: .xlsx, .xls, .csv (সর্বোচ্চ ১০ এমবি)"
                : "Supported file formats: .xlsx, .xls, .csv (up to 10MB)"}
            </p>
          </div>

          <Button
            type="button"
            size="sm"
            variant="secondary"
            disabled={loading}
            className="mt-2 text-xs font-semibold pointer-events-none"
          >
            {loading ? (isBn ? "প্রসেসিং হচ্ছে..." : "Processing...") : isBn ? "ফাইল নির্বাচন করুন" : "Select File"}
          </Button>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-card border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">{fileName}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                <span>{fileSize ? formatBytes(fileSize) : ""}</span>
                <span>•</span>
                <span className="font-semibold text-primary">
                  {isBn ? `${rowCount} টি সারি সনাক্ত হয়েছে` : `${rowCount} rows parsed`}
                </span>
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onReset}
            disabled={loading}
            className="text-xs font-semibold border-border shrink-0"
          >
            {isBn ? "অন্য ফাইল নির্বাচন করুন" : "Change File"}
          </Button>
        </div>
      )}
    </div>
  );
}
