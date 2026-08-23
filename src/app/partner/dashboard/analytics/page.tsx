"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { dbStore } from "@/services/dbStore";
import { Partner } from "@/services/db";
import { PartnerDashboardSkeleton } from "../components/PartnerDashboardSkeleton";
import { PartnerDashboardHeader } from "../components/PartnerDashboardHeader";
import { PartnerAnalyticsTab } from "../components/PartnerAnalyticsTab";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function PartnerAnalyticsPage() {
  const router = useRouter();
  const [partner, setPartner] = useState<Partner | null>(null);

  const refreshPartnerProfile = useCallback(async () => {
    try {
      const res = await dbStore.getPartnerProfile();
      if (res.success && res.partner) {
        setPartner(res.partner);
        dbStore.setCurrentPartner(res.partner);
      }
    } catch {
      // Fallback
    }
  }, []);

  useEffect(() => {
    const currentPartner = dbStore.getCurrentPartner();
    if (!currentPartner) {
      router.push("/login/partner");
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPartner(currentPartner);
    refreshPartnerProfile();
  }, [router, refreshPartnerProfile]);

  const handleLogout = () => {
    dbStore.logoutPartner();
    toast.success("সফলভাবে লগআউট করা হয়েছে।");
    router.push("/login/partner");
  };

  if (!partner) {
    return <PartnerDashboardSkeleton />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Top Header */}
      <PartnerDashboardHeader partner={partner} onLogout={handleLogout} />

      {/* Navigation Breadcrumb / Back Button */}
      <div className="flex items-center justify-between">
        <Link href="/partner/dashboard">
          <Button variant="ghost" size="sm" className="gap-2 text-xs font-semibold rounded-xl text-muted-foreground hover:text-foreground cursor-pointer">
            <ArrowLeft className="h-4 w-4" />
            <span>ড্যাশবোর্ডে ফিরে যান</span>
          </Button>
        </Link>
      </div>

      {/* Dedicated Analytics & Settlement Tab Content */}
      <PartnerAnalyticsTab partner={partner} />
    </div>
  );
}
