"use client";

import { useState } from "react";
import { LogIn, Loader2, ShieldCheck, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Partner } from "@/services/db";
import { authStore } from "@/services/authStore";
import { impersonatePartnerAction } from "@/app/actions/partnerActions";
import { toast } from "sonner";

interface PartnerImpersonateDialogProps {
  partner: Partner | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PartnerImpersonateDialog({
  partner,
  open,
  onOpenChange,
}: PartnerImpersonateDialogProps) {
  const [loading, setLoading] = useState(false);

  if (!partner) return null;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const res = await impersonatePartnerAction(partner.id);
      if (!res.success || !res.partner) {
        toast.error(res.error || "পার্টনার প্যানেলে প্রবেশ করতে ব্যর্থ হয়েছে।");
        setLoading(false);
        return;
      }

      authStore.setCurrentPartner(res.partner);
      authStore.setCurrentStaff(null);
      toast.success(`${partner.name}-এর পার্টনার প্যানেলে প্রবেশ করা হয়েছে`);
      window.location.href = "/partner/dashboard";
    } catch {
      toast.error("সার্ভার ত্রুটি। দয়া করে আবার চেষ্টা করুন।");
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 mb-1">
            <ShieldCheck className="h-5 w-5" />
            <DialogTitle className="text-base sm:text-lg font-bold font-heading">
              পার্টনার প্যানেলে প্রবেশ (১-ক্লিক অ্যাক্সেস)
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            আপনি কি সুপার অ্যাডমিন হিসেবে <strong className="text-foreground font-semibold">“{partner.name}”</strong> এর পার্টনার প্যানেলে প্রবেশ করতে চান?
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-xl bg-sky-500/10 border border-sky-500/20 p-3.5 space-y-2 text-xs text-slate-700 dark:text-slate-300">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
            <p>
              প্রবেশ করার পর আপনি এই হাসপাতালের ডিসকাউন্ট বিলিং, ডাক্তার ম্যানেজমেন্ট ও অ্যানালিটিক্স হুবহু পার্টনারের মতো দেখতে ও পরিচালনা করতে পারবেন।
            </p>
          </div>
          <p className="text-[11px] text-muted-foreground pl-6">
            💡 যেকোনো সময় স্ক্রিনের উপরে থাকা <strong>“অ্যাডমিন প্যানেলে ফিরুন”</strong> বাটনে ক্লিক করে এক ক্লিকে অ্যাডমিনে ফিরে আসতে পারবেন।
          </p>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 mt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="cursor-pointer"
          >
            বাতিল
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="bg-sky-600 hover:bg-sky-700 text-white gap-1.5 cursor-pointer font-semibold shadow-sm"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogIn className="h-4 w-4" />
            )}
            <span>{loading ? "প্রবেশ করা হচ্ছে..." : "প্যানেলে প্রবেশ করুন"}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
