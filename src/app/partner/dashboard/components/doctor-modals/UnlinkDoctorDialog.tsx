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
  const [submitting, setSubmitting] = useState(false);

  if (!doctor) return null;

  const handleUnlink = async () => {
    setSubmitting(true);
    try {
      const res = await unlinkDoctorFromPartnerAction(doctor.id);
      if (res.success) {
        toast.success(`${doctor.name} সফলভাবে আনলিঙ্ক করা হয়েছে।`);
        onSuccess();
        onClose();
      } else {
        toast.error(res.error || "আনলিঙ্ক করতে সমস্যা হয়েছে।");
      }
    } catch {
      toast.error("সার্ভারে সমস্যা হয়েছে।");
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
            ডাক্তার আনলিঙ্ক নিশ্চিতকরণ
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed pt-1">
            আপনি কি নিশ্চিতভাবে <strong>{doctor.name}</strong>-কে আপনার হাসপাতাল চেম্বার তালিকা থেকে আনলিঙ্ক করতে চান? এর ফলে তিনি আপনার চেম্বারের তালিকায় প্রদর্শিত হবেন না।
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2 pt-4 border-t border-border w-full mt-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={submitting} className="rounded-xl w-full sm:w-auto">
            বাতিল
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleUnlink}
            disabled={submitting}
            className="rounded-xl w-full sm:w-auto cursor-pointer"
          >
            {submitting ? "আনলিঙ্ক হচ্ছে..." : "আনলিঙ্ক নিশ্চিত করুন"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
