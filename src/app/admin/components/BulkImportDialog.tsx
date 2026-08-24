"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ImportEntityType } from "@/types/bulkImport";
import { ENTITY_CONFIGS } from "@/lib/bulkImportUtils";
import { BulkImportManager } from "./BulkImportManager";
import { UploadCloud } from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";

interface BulkImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  entityType?: ImportEntityType;
  onSuccess?: () => void;
}

export function BulkImportDialog({
  isOpen,
  onClose,
  entityType = "doctors",
  onSuccess,
}: BulkImportDialogProps) {
  const { locale } = useLanguage();
  const isBn = locale === "bn";

  const config = ENTITY_CONFIGS[entityType];

  const handleSuccess = () => {
    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 rounded-2xl">
        <DialogHeader className="pb-3 border-b border-border">
          <DialogTitle className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <UploadCloud className="h-4 w-4" />
            </div>
            <div>
              <span>
                {isBn
                  ? `${config.titleBn} বাল্ক ইম্পোর্ট (Excel/CSV)`
                  : `Bulk Import ${config.titleEn} (Excel/CSV)`}
              </span>
              <p className="text-xs font-normal text-muted-foreground mt-0.5">
                {isBn ? config.descBn : config.descEn}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="pt-2">
          <BulkImportManager
            defaultEntity={entityType}
            onSuccess={handleSuccess}
            isModal={true}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
