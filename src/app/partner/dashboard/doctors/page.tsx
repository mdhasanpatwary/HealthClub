"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authStore } from "@/services/authStore";
import { Partner } from "@/services/db";
import { getPartnerProfileAction } from "@/app/actions/partnerActions";
import { PartnerDashboardSkeleton } from "../components/PartnerDashboardSkeleton";
import { PartnerDashboardHeader } from "../components/PartnerDashboardHeader";
import { PartnerDoctorsTab } from "../components/PartnerDoctorsTab";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useLanguage } from "@/components/layout/LanguageProvider";

export default function PartnerDoctorsPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [partner, setPartner] = useState<Partner | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function initPartner() {
      let activePartner = authStore.getCurrentPartner();
      if (activePartner && isMounted) {
        setPartner(activePartner);
      }

      try {
        const res = await getPartnerProfileAction();
        if (res.success && res.partner && isMounted) {
          activePartner = res.partner;
          setPartner(activePartner);
          authStore.setCurrentPartner(activePartner);
        }
      } catch {
        // Fallback
      }

      if (!activePartner && isMounted) {
        router.push("/login/partner");
      }
    }

    initPartner();

    return () => {
      isMounted = false;
    };
  }, [router]);

  const handleLogout = () => {
    authStore.logoutPartner();
    toast.success(t("auth.logoutSuccess"));
    window.location.href = "/login/partner";
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
        <Link
          href="/partner/dashboard"
          className={buttonVariants({
            variant: "ghost",
            size: "sm",
            className: "gap-2 text-xs font-semibold rounded-xl text-muted-foreground hover:text-foreground cursor-pointer",
          })}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t("partner.dashboard.backToDashboard")}</span>
        </Link>
      </div>

      {/* Dedicated Doctor Roster Tab Content */}
      <PartnerDoctorsTab partner={partner} />
    </div>
  );
}
