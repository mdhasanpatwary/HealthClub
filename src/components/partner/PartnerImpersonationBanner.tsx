"use client";

import { useState } from "react";
import { Crown, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authStore } from "@/services/authStore";
import { stopImpersonatingPartnerAction } from "@/app/actions/partnerActions";
import { toast } from "sonner";

interface PartnerImpersonationBannerProps {
  adminName?: string;
  partnerName?: string;
}

export function PartnerImpersonationBanner({
  adminName = "সুপার অ্যাডমিন",
  partnerName,
}: PartnerImpersonationBannerProps) {
  const [isExiting, setIsExiting] = useState(false);

  const handleExit = async () => {
    setIsExiting(true);
    try {
      const res = await stopImpersonatingPartnerAction();
      if (!res.success) {
        toast.error(res.error || "অ্যাডমিন প্যানেলে ফিরে যেতে সমস্যা হয়েছে।");
        setIsExiting(false);
        return;
      }

      await authStore.logoutPartner();
      toast.success("অ্যাডমিন প্যানেলে সফলভাবে ফিরে এসেছেন");
      window.location.href = "/admin/partners";
    } catch {
      toast.error("প্রক্রিয়াটি সম্পন্ন করতে সমস্যা হয়েছে।");
      setIsExiting(false);
    }
  };

  return (
    <aside
      aria-label="সুপার অ্যাডমিন ইম্পার্সোনেশন নোটিফিকেশন"
      className="sticky top-0 z-50 w-full bg-gradient-to-r from-amber-600 via-amber-700 to-orange-700 text-white shadow-md border-b border-amber-500/40"
    >
      <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-black/20 text-amber-200 shadow-inner">
            <Crown className="h-4 w-4" />
          </span>
          <p className="truncate font-medium">
            <strong className="font-bold text-amber-100">সুপার অ্যাডমিন অ্যাক্সেস:</strong>{" "}
            <span>
              আপনি {partnerName ? `“${partnerName}”` : "পার্টনার"}-এর ড্যাশবোর্ড মোডে আছেন
            </span>
            {adminName && (
              <span className="hidden md:inline text-amber-200/90 ml-1.5 font-normal">
                ({adminName})
              </span>
            )}
          </p>
        </div>

        <Button
          onClick={handleExit}
          disabled={isExiting}
          size="sm"
          variant="secondary"
          className="h-8 px-3 rounded-lg bg-white/95 text-amber-950 hover:bg-white hover:text-black font-semibold text-xs shadow-sm gap-1.5 cursor-pointer ml-auto"
        >
          {isExiting ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <ArrowLeft className="h-3.5 w-3.5" />
          )}
          <span>{isExiting ? "অ্যাডমিনে ফিরছেন..." : "অ্যাডমিন প্যানেলে ফিরুন"}</span>
        </Button>
      </div>
    </aside>
  );
}
