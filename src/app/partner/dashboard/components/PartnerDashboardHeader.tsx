"use client";

import { Building2, LogOut, PhoneCall, Clock, ShieldCheck } from "lucide-react";
import { Partner } from "@/services/db";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChangePartnerPasswordDialog } from "./ChangePartnerPasswordDialog";
import { useLanguage } from "@/components/layout/LanguageProvider";

import { dbStore } from "@/services/dbStore";

interface PartnerDashboardHeaderProps {
  partner: Partner;
  currentStaff?: { id: string; name: string; deskName: string } | null;
  onLogout: () => void;
}

export function PartnerDashboardHeader({ partner, currentStaff: propStaff, onLogout }: PartnerDashboardHeaderProps) {
  const { t } = useLanguage();
  const currentStaff = propStaff !== undefined ? propStaff : dbStore.getCurrentStaff();

  const getCategoryLabel = (category: Partner["category"]) => {
    switch (category) {
      case "hospital":
        return t("partner.dashboard.category.hospital");
      case "diagnostic":
        return t("partner.dashboard.category.diagnostic");
      case "pharmacy":
        return t("partner.dashboard.category.pharmacy");
      default:
        return category;
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-secondary to-slate-950 text-white shadow-xl border border-slate-800">
      <div className="flex items-start sm:items-center gap-4 min-w-0">
        <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary shrink-0 shadow-inner">
          <Building2 className="h-7 w-7 sm:h-8 sm:w-8" />
        </div>
        <div className="min-w-0 space-y-1.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-lg sm:text-2xl font-bold font-heading text-white tracking-tight truncate">
              {partner.name}
            </h1>
            <Badge variant="outline" className="bg-primary/15 text-primary border-primary/30 text-xs font-semibold px-2.5 py-0.5">
              <ShieldCheck className="h-3 w-3 mr-1 inline" />
              {getCategoryLabel(partner.category)}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-300">
            <span className="flex items-center gap-1">
              {t("admin.dashboard.discountRate")}: <strong className="text-primary font-bold">{partner.discount}</strong>
            </span>
            {currentStaff && (
              <span className="inline-flex items-center gap-1.5 text-emerald-300 font-semibold bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>{currentStaff.deskName}</span>
                <span className="text-slate-400">|</span>
                <span className="text-white font-normal">{currentStaff.name}</span>
              </span>
            )}
            {partner.emergencyPhone && (
              <span className="inline-flex items-center gap-1 text-amber-300 font-medium bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                <PhoneCall className="h-3 w-3" />
                {partner.emergencyPhone}
              </span>
            )}
            {partner.workingHours && (
              <span className="inline-flex items-center gap-1 text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700">
                <Clock className="h-3 w-3 text-slate-400" />
                {partner.workingHours}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2.5 shrink-0 self-stretch sm:self-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-800/80 w-full sm:w-auto">
        <ChangePartnerPasswordDialog />

        <Button
          onClick={onLogout}
          variant="destructive"
          size="sm"
          className="gap-1.5 rounded-xl font-semibold shadow-sm cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          <span>{t("layout.header.logout")}</span>
        </Button>
      </div>
    </div>
  );
}
