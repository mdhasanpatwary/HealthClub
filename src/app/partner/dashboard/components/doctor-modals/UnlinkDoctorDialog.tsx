"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Doctor } from "@/services/db";
import { unlinkDoctorFromPartnerAction } from "@/app/actions/partnerDoctorActions";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";

export interface UnlinkDoctorDialogProps {
  doctor: Doctor | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function UnlinkDoctorDialog({
  doctor,
  isOpen,
  onClose,
  onSuccess,
}: UnlinkDoctorDialogProps) {
  const { t } = useLanguage();
  const [submitting, setSubmitting] = useState(false);

  if (!doctor) return null;

  const handleUnlink = async () => {
    setSubmitting(true);
    try {
      const res = await unlinkDoctorFromPartnerAction(doctor.id);
      if (res.success) {
        toast.success(`${doctor.name} ${t("partner.doctors.unlinkedSuccess")}`);
        onSuccess();
        onClose();
      } else {
        toast.error(res.error || t("partner.doctors.unlinkFailed"));
      }
    } catch {
      toast.error(t("common.error.server"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="border-border bg-background max-w-[calc(100vw-2rem)] sm:max-w-md p-5 sm:p-6 overflow-x-hidden">
        <DialogHeader>
          <div className="h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mb-2">
            <AlertCircle className="h-6 w-6" />
          </div>
          <DialogTitle className="font-heading font-bold text-base sm:text-lg">
            {t("partner.doctors.unlinkConfirmTitle")}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed pt-1">
            {t("partner.doctors.unlinkConfirmDesc")} (<strong>{doctor.name}</strong>)
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2 pt-4 border-t border-border w-full mt-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={submitting} className="rounded-xl w-full sm:w-auto">
            {t("common.cancel")}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleUnlink}
            disabled={submitting}
            className="rounded-xl w-full sm:w-auto cursor-pointer"
          >
            {submitting ? t("partner.doctors.unlinking") : t("partner.doctors.unlinkConfirmBtn")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
