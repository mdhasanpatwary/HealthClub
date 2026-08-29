"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Building2,
  Phone,
  KeyRound,
  Trash2,
  Edit2,
  Copy,
  Check,
  TrendingUp,
  Receipt,
  Calendar,
  ShieldCheck,
  Sparkles,
  Clock,
  CircleDollarSign,
} from "lucide-react";
import { PartnerStaff, Transaction } from "@/services/db";
import {
  getPartnerStaffDetailsAction,
  PartnerStaffStats,
} from "@/app/actions/partnerStaffActions";
import {
  PartnerStaffTransactionsList,
  FilterPeriod,
} from "./PartnerStaffTransactionsList";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { toast } from "sonner";

interface PartnerStaffDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: PartnerStaff | null;
  partnerName: string;
  onEdit: (staff: PartnerStaff) => void;
  onResetPassword: (staff: PartnerStaff) => void;
  onDelete: (staff: PartnerStaff) => void;
  onToggleStatus: (staff: PartnerStaff) => void;
  onOpenCredentials: (staff: PartnerStaff) => void;
}

export function PartnerStaffDetailsModal({
  isOpen,
  onClose,
  staff,
  partnerName,
  onEdit,
  onResetPassword,
  onDelete,
  onToggleStatus,
  onOpenCredentials,
}: PartnerStaffDetailsModalProps) {
  const { t, locale } = useLanguage();
  const isBn = locale === "bn";

  const [loading, setLoading] = useState(true);
  const [detailsStaff, setDetailsStaff] = useState<PartnerStaff | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<PartnerStaffStats | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>("all");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const activeStaff = detailsStaff || staff;
  const staffId = staff?.id;

  const loadDetails = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const res = await getPartnerStaffDetailsAction(id);
      if (res.success && res.staff) {
        setDetailsStaff(res.staff);
        setTransactions(res.transactions || []);
        setStats(res.stats || null);
      } else {
        toast.error(res.error || t("partner.staff.loadError"));
      }
    } catch {
      toast.error(t("partner.staff.loadError"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    if (isOpen && staffId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadDetails(staffId);
    }
  }, [isOpen, staffId, loadDetails]);

  // Copy helper
  const handleCopy = (text: string, key: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success(`${label} ${t("partner.staff.credentialsCopied")}`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (!staff) return null;

  const roleText =
    activeStaff?.role === "manager"
      ? t("partner.staff.roleManager")
      : t("partner.staff.roleCashier");

  const formattedJoinDate = activeStaff?.createdAt
    ? new Date(activeStaff.createdAt).toLocaleDateString(
        isBn ? "bn-BD" : "en-GB",
        { day: "numeric", month: "short", year: "numeric" }
      )
    : "";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-full max-w-[calc(100vw-1.5rem)] sm:max-w-3xl md:max-w-4xl lg:max-w-5xl max-h-[90vh] overflow-y-auto overflow-x-hidden bg-background border-border p-4 sm:p-6 space-y-4 rounded-3xl">
        <DialogHeader className="pb-1 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/70 pb-3.5">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg shrink-0 border border-primary/20">
                {activeStaff?.name?.charAt(0) || "S"}
              </div>
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <DialogTitle className="text-lg sm:text-xl font-bold font-heading text-secondary dark:text-white truncate">
                    {activeStaff?.name}
                  </DialogTitle>
                  <Badge variant="outline" className="text-[10px] uppercase font-bold px-2 py-0.5 shrink-0">
                    {roleText}
                  </Badge>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                      activeStaff?.isActive
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                        : "bg-slate-500/10 text-slate-500 border-slate-500/20"
                    }`}
                  >
                    {activeStaff?.isActive
                      ? t("partner.staff.statusActive")
                      : t("partner.staff.statusInactive")}
                  </span>
                </div>
                <DialogDescription className="text-xs text-muted-foreground truncate">
                  {partnerName} &bull; {activeStaff?.deskName}
                </DialogDescription>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-1.5 flex-wrap shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => activeStaff && onOpenCredentials(activeStaff)}
                className="h-8 px-2.5 rounded-xl text-xs gap-1.5 border-border bg-card hover:bg-muted font-medium cursor-pointer"
                title={t("partner.staff.viewCredentialsSlip")}
              >
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span className="hidden sm:inline">{t("partner.staff.viewCredentialsSlip")}</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => activeStaff && onEdit(activeStaff)}
                className="h-8 px-2.5 rounded-xl text-xs gap-1.5 border-border hover:text-blue-600 cursor-pointer"
                title={t("partner.staff.modalEditTitle")}
              >
                <Edit2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t("partner.staff.modalEditTitle")}</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => activeStaff && onResetPassword(activeStaff)}
                className="h-8 px-2.5 rounded-xl text-xs gap-1.5 border-border hover:text-amber-600 cursor-pointer"
                title={t("partner.staff.resetPassword")}
              >
                <KeyRound className="h-3.5 w-3.5" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => activeStaff && onDelete(activeStaff)}
                className="h-8 w-8 p-0 rounded-xl text-muted-foreground hover:text-destructive hover:border-destructive/30 cursor-pointer"
                title={t("partner.staff.deleteStaff")}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Staff Profile Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3 rounded-2xl bg-muted/40 border border-border/70 text-xs">
          <div className="flex items-center gap-2 p-2 rounded-xl bg-card border border-border/50">
            <Building2 className="h-4 w-4 text-primary shrink-0" />
            <div className="truncate min-w-0">
              <span className="text-[10px] text-muted-foreground block">
                {t("partner.staff.counterDesk")}
              </span>
              <span className="font-semibold text-foreground truncate block">
                {activeStaff?.deskName}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-1 p-2 rounded-xl bg-card border border-border/50">
            <div className="flex items-center gap-2 truncate min-w-0">
              <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
              <div className="truncate min-w-0">
                <span className="text-[10px] text-muted-foreground block">
                  {t("partner.staff.usernameLabel").replace(" *", "")}
                </span>
                <span className="font-mono font-bold text-foreground truncate block">
                  @{activeStaff?.username}
                </span>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() =>
                handleCopy(
                  activeStaff?.username || "",
                  "username",
                  t("partner.staff.usernameLabel").replace(" *", "")
                )
              }
              className="h-6 w-6 p-0 rounded-md text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
              title={t("partner.staff.copyUsername")}
            >
              {copiedKey === "username" ? (
                <Check className="h-3 w-3 text-emerald-600" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          </div>

          <div className="flex items-center justify-between gap-1 p-2 rounded-xl bg-card border border-border/50">
            <div className="flex items-center gap-2 truncate min-w-0">
              <Phone className="h-4 w-4 text-primary shrink-0" />
              <div className="truncate min-w-0">
                <span className="text-[10px] text-muted-foreground block">
                  {t("partner.staff.phoneLabel")}
                </span>
                <span className="font-mono text-foreground truncate block">
                  {activeStaff?.phone || t("partner.staff.phoneNotSet")}
                </span>
              </div>
            </div>
            {activeStaff?.phone && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() =>
                  handleCopy(
                    activeStaff.phone || "",
                    "phone",
                    t("partner.staff.phoneLabel")
                  )
                }
                className="h-6 w-6 p-0 rounded-md text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
              >
                {copiedKey === "phone" ? (
                  <Check className="h-3 w-3 text-emerald-600" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            )}
          </div>
        </div>

        {/* KPI Performance Summary */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <Card className="border-border/70 bg-card rounded-2xl shadow-none">
              <CardContent className="p-3 sm:p-3.5 space-y-1">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-[10px] sm:text-[11px] font-medium">
                    {t("partner.staff.colTxns")}
                  </span>
                  <Receipt className="h-3.5 w-3.5 text-blue-500" />
                </div>
                <div className="text-base sm:text-lg font-bold font-mono text-foreground">
                  {(stats?.totalCount || 0).toLocaleString(isBn ? "bn-BD" : "en-US")}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {t("partner.staff.todayTxns")}: <span className="font-bold text-foreground">{stats?.todayCount || 0}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/70 bg-card rounded-2xl shadow-none">
              <CardContent className="p-3 sm:p-3.5 space-y-1">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-[10px] sm:text-[11px] font-medium">
                    {t("partner.staff.totalBilled")}
                  </span>
                  <CircleDollarSign className="h-3.5 w-3.5 text-purple-500" />
                </div>
                <div className="text-base sm:text-lg font-bold font-mono text-foreground">
                  ৳{(stats?.totalBill || 0).toLocaleString(isBn ? "bn-BD" : "en-US")}
                </div>
                <div className="text-[10px] text-muted-foreground truncate">
                  {t("partner.staff.avgBill")}: ৳{(stats?.avgBill || 0).toLocaleString(isBn ? "bn-BD" : "en-US")}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/70 bg-card rounded-2xl shadow-none">
              <CardContent className="p-3 sm:p-3.5 space-y-1">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-[10px] sm:text-[11px] font-medium">
                    {t("partner.staff.colSavings")}
                  </span>
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                </div>
                <div className="text-base sm:text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  ৳{(stats?.totalSaved || 0).toLocaleString(isBn ? "bn-BD" : "en-US")}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {t("partner.staff.todaySavings")}: <span className="font-bold text-emerald-600">৳{stats?.todaySaved || 0}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/70 bg-card rounded-2xl shadow-none">
              <CardContent className="p-3 sm:p-3.5 space-y-1">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-[10px] sm:text-[11px] font-medium">
                    {t("partner.staff.joinedDate")}
                  </span>
                  <Calendar className="h-3.5 w-3.5 text-amber-500" />
                </div>
                <div className="text-xs sm:text-sm font-semibold text-foreground truncate">
                  {formattedJoinDate || "N/A"}
                </div>
                <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{activeStaff?.isActive ? t("partner.staff.statusActive") : t("partner.staff.statusInactive")}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Transactions Section */}
        <PartnerStaffTransactionsList
          transactions={transactions}
          loading={loading}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterPeriod={filterPeriod}
          onFilterPeriodChange={setFilterPeriod}
        />

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => activeStaff && onToggleStatus(activeStaff)}
            className={`rounded-xl text-xs h-8 cursor-pointer ${
              activeStaff?.isActive
                ? "text-slate-600 hover:text-destructive border-border"
                : "text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10"
            }`}
          >
            {activeStaff?.isActive
              ? t("partner.staff.statusInactive")
              : t("partner.staff.statusActive")}
          </Button>

          <Button
            type="button"
            onClick={onClose}
            className="bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl text-xs h-8 px-4 cursor-pointer"
          >
            {t("common.close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
