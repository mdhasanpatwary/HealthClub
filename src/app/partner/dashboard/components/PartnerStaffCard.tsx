"use client";

import { useState } from "react";
import {
  Building2,
  Phone,
  KeyRound,
  Trash2,
  Edit2,
  Copy,
  Check,
} from "lucide-react";
import { PartnerStaff } from "@/services/db";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { toast } from "sonner";

interface PartnerStaffCardProps {
  staff: PartnerStaff;
  partnerName?: string;
  onViewDetails?: (staff: PartnerStaff) => void;
  onEdit: (staff: PartnerStaff) => void;
  onResetPassword: (staff: PartnerStaff) => void;
  onDelete: (staff: PartnerStaff) => void;
  onToggleStatus: (staff: PartnerStaff) => void;
}

export function PartnerStaffCard({
  staff,
  onViewDetails,
  onEdit,
  onResetPassword,
  onDelete,
  onToggleStatus,
}: PartnerStaffCardProps) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const loginUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/login/partner`
      : "https://healthclub.com.bd/login/partner";

  const roleText =
    staff.role === "manager"
      ? t("partner.staff.roleManager")
      : t("partner.staff.roleCashier");

  const fullTextToCopy = `🔐 ${t("partner.staff.accessDetails")}:
🔗 ${t("partner.staff.loginUrlLabel")}: ${loginUrl}
👤 ${t("partner.staff.usernameLabel").replace(" *", "")}: ${staff.username}
🔑 ${t("partner.staff.passwordLabel").replace(" *", "")}: ${
    staff.plainPassword || t("partner.staff.passwordAssignedNote")
  }`;

  const handleCopyCredentials = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(fullTextToCopy);
    setCopied(true);
    toast.success(`"${staff.name}" ${t("partner.staff.credentialsCopied")}`);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <Card
      onClick={() => onViewDetails?.(staff)}
      className={`rounded-3xl border transition-all duration-200 hover:shadow-lg flex flex-col justify-between cursor-pointer group hover:border-primary/50 active:scale-[0.99] ${
        staff.isActive
          ? "bg-card border-border/80"
          : "bg-muted/30 border-dashed border-border/60 opacity-80"
      }`}
    >
      <CardHeader className="p-5 pb-3 space-y-3">
        {/* Desk Identifier & Status */}
        <div className="flex items-start justify-between gap-2">
          <Badge
            variant="outline"
            className="bg-primary/10 text-primary border-primary/20 text-xs font-semibold px-2.5 py-1 rounded-xl flex items-center gap-1.5 group-hover:bg-primary/15 transition-colors"
          >
            <Building2 className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate max-w-[170px]">{staff.deskName}</span>
          </Badge>

          <div className="flex items-center gap-1.5 shrink-0">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                staff.isActive
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                  : "bg-slate-500/10 text-slate-500 border-slate-500/20"
              }`}
            >
              {staff.isActive
                ? t("partner.staff.statusActive")
                : t("partner.staff.statusInactive")}
            </span>
          </div>
        </div>

        {/* Staff Name and Role */}
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base text-secondary dark:text-white font-heading truncate group-hover:text-primary transition-colors">
              {staff.name}
            </h3>
            <Badge
              variant="outline"
              className="text-[10px] uppercase font-bold text-muted-foreground border-border px-1.5 py-0"
            >
              {roleText}
            </Badge>
          </div>

          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            <span className="font-mono bg-muted/60 px-2 py-0.5 rounded-md text-[11px] text-foreground">
              @{staff.username}
            </span>
            {staff.phone && (
              <span className="flex items-center gap-1 text-[11px]">
                <Phone className="h-3 w-3" />
                {staff.phone}
              </span>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-0 space-y-4">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 gap-2 p-2.5 rounded-2xl bg-muted/40 border border-border/50 text-center group-hover:bg-muted/60 transition-colors">
          <div>
            <span className="text-[10px] text-muted-foreground block">
              {t("partner.staff.colTxns")}
            </span>
            <span className="text-sm font-bold text-secondary dark:text-white font-mono">
              {staff.transactionCount || 0}
            </span>
          </div>
          <div className="border-l border-border/60">
            <span className="text-[10px] text-muted-foreground block">
              {t("partner.staff.colSavings")}
            </span>
            <span className="text-sm font-bold text-primary font-mono">
              ৳{(staff.totalSavedAmount || 0).toLocaleString("bn-BD")}
            </span>
          </div>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex items-center justify-between gap-1 pt-1 border-t border-border/60">
          <div className="flex items-center gap-1">
            {/* Copy Login Credentials for Staff */}
            <Button
              onClick={handleCopyCredentials}
              variant="ghost"
              size="sm"
              title={t("partner.staff.copyAllCredentials") || "Copy Login Credentials"}
              className="h-8 w-8 p-0 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 cursor-pointer"
            >
              {copied ? (
                <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>

            {/* Reset Password */}
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onResetPassword(staff);
              }}
              variant="ghost"
              size="sm"
              title={t("partner.staff.resetPassword")}
              className="h-8 w-8 p-0 rounded-xl text-muted-foreground hover:text-amber-600 cursor-pointer"
            >
              <KeyRound className="h-4 w-4" />
            </Button>

            {/* Edit Staff Details */}
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(staff);
              }}
              variant="ghost"
              size="sm"
              title={t("partner.staff.modalEditTitle")}
              className="h-8 w-8 p-0 rounded-xl text-muted-foreground hover:text-blue-600 cursor-pointer"
            >
              <Edit2 className="h-4 w-4" />
            </Button>

            {/* Delete Staff */}
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(staff);
              }}
              variant="ghost"
              size="sm"
              title={t("partner.staff.deleteStaff")}
              className="h-8 w-8 p-0 rounded-xl text-muted-foreground hover:text-destructive cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Toggle Active / Inactive */}
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onToggleStatus(staff);
            }}
            variant="outline"
            size="sm"
            className={`h-7 px-2.5 rounded-xl text-[11px] font-semibold cursor-pointer ${
              staff.isActive
                ? "text-slate-600 hover:text-destructive border-border hover:border-destructive/30"
                : "text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10"
            }`}
          >
            {staff.isActive
              ? t("partner.staff.statusInactive")
              : t("partner.staff.statusActive")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

