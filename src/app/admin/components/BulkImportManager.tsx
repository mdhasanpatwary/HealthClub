"use client";

import { useState, useCallback } from "react";
import {
  Stethoscope,
  Building2,
  Droplet,
  Truck,
  PhoneCall,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { ImportEntityType, RawParsedData, ProcessedRow } from "@/types/bulkImport";
import {
  ENTITY_CONFIGS,
  parseFileToRawData,
  autoMapColumns,
  processAndValidateRows,
} from "@/lib/bulkImportUtils";
import {
  bulkImportDoctorsAction,
  bulkImportPartnersAction,
} from "@/app/actions/bulkImportActions";
import {
  bulkImportBloodDonorsAction,
  bulkImportAmbulancesAction,
  bulkImportHotlinesAction,
} from "@/app/actions/bulkImportEmergencyActions";
import { BulkImportDropzone } from "./import/BulkImportDropzone";
import { BulkImportMapping } from "./import/BulkImportMapping";
import { BulkImportPreviewTable } from "./import/BulkImportPreviewTable";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useLanguage } from "@/components/layout/LanguageProvider";

interface BulkImportManagerProps {
  defaultEntity?: ImportEntityType;
  onSuccess?: () => void;
  isModal?: boolean;
}

export function BulkImportManager({
  defaultEntity = "doctors",
  onSuccess,
  isModal = false,
}: BulkImportManagerProps) {
  const { locale } = useLanguage();
  const isBn = locale === "bn";

  const [entityType, setEntityType] = useState<ImportEntityType>(defaultEntity);
  const [parsing, setParsing] = useState(false);
  const [importing, setImporting] = useState(false);

  // File & parsing states
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<number | null>(null);
  const [rawData, setRawData] = useState<RawParsedData | null>(null);
  const [mapping, setMapping] = useState<Record<string, string | null>>({});
  const [processedRows, setProcessedRows] = useState<ProcessedRow[]>([]);

  // Entity definitions
  const entities: {
    id: ImportEntityType;
    labelBn: string;
    labelEn: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: "doctors", labelBn: "ডাক্তার", labelEn: "Doctors", icon: Stethoscope },
    { id: "partners", labelBn: "পার্টনার", labelEn: "Partners", icon: Building2 },
    { id: "donors", labelBn: "রক্তদাতা", labelEn: "Blood Donors", icon: Droplet },
    { id: "ambulances", labelBn: "অ্যাম্বুলেন্স", labelEn: "Ambulances", icon: Truck },
    { id: "hotlines", labelBn: "জরুরি হটলাইন", labelEn: "Hotlines", icon: PhoneCall },
  ];

  const handleReset = useCallback(() => {
    setFileName(null);
    setFileSize(null);
    setRawData(null);
    setMapping({});
    setProcessedRows([]);
  }, []);

  const handleEntityChange = (type: ImportEntityType) => {
    setEntityType(type);
    handleReset();
  };

  const handleFileSelect = async (file: File) => {
    setParsing(true);
    try {
      const parsed = await parseFileToRawData(file);
      if (parsed.rows.length === 0) {
        toast.error(
          isBn ? "ফাইলে কোনো তথ্য পাওয়া যায়নি।" : "No data rows found in the uploaded file."
        );
        setParsing(false);
        return;
      }

      setFileName(file.name);
      setFileSize(file.size);
      setRawData(parsed);

      // Auto map columns based on headers
      const autoMapped = autoMapColumns(parsed.headers, entityType);
      setMapping(autoMapped);

      // Process & validate rows
      const processed = processAndValidateRows(parsed.rows, autoMapped, entityType);
      setProcessedRows(processed);

      const validCount = processed.filter((r) => r.isValid).length;
      toast.success(
        isBn
          ? `${parsed.rows.length} টি সারির মধ্যে ${validCount} টি সফলভাবে যাচাই হয়েছে।`
          : `Parsed ${parsed.rows.length} rows (${validCount} valid).`
      );
    } catch (err: unknown) {
      toast.error(
        (err as Error).message ||
          (isBn ? "ফাইল পড়তে সমস্যা হয়েছে।" : "Failed to parse spreadsheet.")
      );
    } finally {
      setParsing(false);
    }
  };

  const handleMappingChange = (targetKey: string, sourceHeader: string | null) => {
    const updatedMapping = { ...mapping, [targetKey]: sourceHeader };
    setMapping(updatedMapping);

    if (rawData) {
      const reprocessed = processAndValidateRows(rawData.rows, updatedMapping, entityType);
      setProcessedRows(reprocessed);
    }
  };

  const handleDeleteRow = (rowId: string) => {
    setProcessedRows((prev) => prev.filter((r) => r.id !== rowId));
    toast.info(isBn ? "সারিটি সরানো হয়েছে।" : "Row removed from import list.");
  };

  const handleExecuteImport = async () => {
    const validRows = processedRows.filter((r) => r.isValid);
    if (validRows.length === 0) {
      toast.error(
        isBn
          ? "ইম্পোর্ট করার জন্য কোনো বৈধ সারি পাওয়া যায়নি।"
          : "No valid rows available to import."
      );
      return;
    }

    setImporting(true);
    try {
      const dataPayload = validRows.map((r) => r.data);
      let result;

      switch (entityType) {
        case "doctors":
          result = await bulkImportDoctorsAction(dataPayload);
          break;
        case "partners":
          result = await bulkImportPartnersAction(dataPayload);
          break;
        case "donors":
          result = await bulkImportBloodDonorsAction(dataPayload);
          break;
        case "ambulances":
          result = await bulkImportAmbulancesAction(dataPayload);
          break;
        case "hotlines":
          result = await bulkImportHotlinesAction(dataPayload);
          break;
      }

      if (result.success) {
        toast.success(
          isBn
            ? `${result.totalImported} টি রেকর্ড সফলভাবে ডাটাবেজে যুক্ত হয়েছে!`
            : `Successfully imported ${result.totalImported} records into database!`
        );
        handleReset();
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.error(
          result.errors?.[0] ||
            (isBn ? "ইম্পোর্ট করতে সমস্যা হয়েছে।" : "Bulk import execution failed.")
        );
      }
    } catch {
      toast.error(isBn ? "সার্ভারে সমস্যা দেখা দিয়েছে।" : "Server error during bulk import.");
    } finally {
      setImporting(false);
    }
  };

  const currentConfig = ENTITY_CONFIGS[entityType];
  const validRowsCount = processedRows.filter((r) => r.isValid).length;

  return (
    <div className="space-y-6">
      {/* Entity Selector (Only if not fixed by modal or if multiple allowed) */}
      {!isModal && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {entities.map((item) => {
            const Icon = item.icon;
            const isSelected = entityType === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleEntityChange(item.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                  isSelected
                    ? "border-primary bg-primary/10 shadow-xs ring-1 ring-primary"
                    : "border-border bg-card hover:bg-muted/40 hover:border-primary/40"
                }`}
              >
                <div
                  className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                    isSelected
                      ? "bg-primary text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p
                    className={`text-xs font-bold ${
                      isSelected ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {isBn ? item.labelBn : item.labelEn}
                  </p>
                  <p className="text-[10px] text-muted-foreground line-clamp-1">
                    {isBn
                      ? ENTITY_CONFIGS[item.id].titleBn
                      : ENTITY_CONFIGS[item.id].titleEn}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Dropzone & Template Area */}
      <BulkImportDropzone
        entityType={entityType}
        fileName={fileName}
        fileSize={fileSize}
        rowCount={processedRows.length}
        onFileSelect={handleFileSelect}
        onReset={handleReset}
        loading={parsing}
      />

      {/* Auto-Mapping & Validation Area (When data is parsed) */}
      {rawData && processedRows.length > 0 && (
        <div className="space-y-5 animate-in fade-in-50 duration-200">
          <BulkImportMapping
            entityType={entityType}
            rawHeaders={rawData.headers}
            mapping={mapping}
            onMappingChange={handleMappingChange}
          />

          <BulkImportPreviewTable
            entityType={entityType}
            processedRows={processedRows}
            onDeleteRow={handleDeleteRow}
          />

          {/* Action Execution Footer */}
          <div className="p-4 rounded-xl bg-card border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div>
              <p className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>
                  {isBn
                    ? `${validRowsCount} টি রেকর্ড ইম্পোর্ট করার জন্য প্রস্তুত`
                    : `${validRowsCount} valid records ready for database import`}
                </span>
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isBn
                  ? `লক্ষ্য: ${currentConfig.titleBn}`
                  : `Target: ${currentConfig.titleEn}`}
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleReset}
                disabled={importing}
                className="text-xs font-semibold border-border flex-1 sm:flex-initial"
              >
                {isBn ? "বাতিল" : "Cancel"}
              </Button>

              <Button
                type="button"
                size="sm"
                onClick={handleExecuteImport}
                disabled={importing || validRowsCount === 0}
                className="bg-primary hover:bg-primary-dark text-white text-xs font-bold gap-2 flex-1 sm:flex-initial"
              >
                {importing && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                <span>
                  {importing
                    ? isBn
                      ? "ইম্পোর্ট হচ্ছে..."
                      : "Importing..."
                    : isBn
                    ? `${validRowsCount} টি ডাটা ইম্পোর্ট করুন`
                    : `Import ${validRowsCount} Records`}
                </span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
