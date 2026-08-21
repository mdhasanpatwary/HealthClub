"use client";

import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface EmergencyDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemName?: string;
  isEn: boolean;
  deleting: boolean;
  onConfirm: () => void;
}

export function EmergencyDeleteDialog({
  open,
  onOpenChange,
  itemName,
  isEn,
  deleting,
  onConfirm,
}: EmergencyDeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-destructive flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            <span>{isEn ? "Confirm Deletion" : "মুছে ফেলার নিশ্চিতকরণ"}</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {isEn
              ? `Are you sure you want to permanently remove "${itemName}"?`
              : `আপনি কি নিশ্চিত যে "${itemName}" স্থায়ীভাবে মুছে ফেলতে চান?`}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="pt-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={deleting}
          >
            {isEn ? "Cancel" : "বাতিল"}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={onConfirm}
            disabled={deleting}
            className="font-bold"
          >
            {deleting ? (
              <>
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                {isEn ? "Deleting..." : "মুছে ফেলা হচ্ছে..."}
              </>
            ) : (
              isEn ? "Delete Permanently" : "মুছে ফেলুন"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
