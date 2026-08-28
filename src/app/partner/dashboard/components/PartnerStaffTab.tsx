"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Users,
  UserPlus,
  Search,
  Building2,
  Phone,
  KeyRound,
  Trash2,
  Edit2,
  Copy,
  Check,
  CreditCard,
  TrendingUp,
  Filter,
  CheckCircle2,
} from "lucide-react";
import { Partner, PartnerStaff } from "@/services/db";
import {
  getPartnerStaffListAction,
  togglePartnerStaffStatusAction,
} from "@/app/actions/partnerStaffActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AddEditStaffModal,
  ResetStaffPasswordModal,
  DeleteStaffConfirmModal,
} from "./PartnerStaffModals";
import { toast } from "sonner";
import { useLanguage } from "@/components/layout/LanguageProvider";

interface PartnerStaffTabProps {
  partner: Partner;
}

export function PartnerStaffTab({ partner }: PartnerStaffTabProps) {
  const { t } = useLanguage();
  const [staffList, setStaffList] = useState<PartnerStaff[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDesk, setFilterDesk] = useState("all");

  // Modals state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<PartnerStaff | null>(null);
  const [resetPwStaff, setResetPwStaff] = useState<PartnerStaff | null>(null);
  const [deleteStaff, setDeleteStaff] = useState<PartnerStaff | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadStaff = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPartnerStaffListAction();
      setStaffList(data);
    } catch {
      toast.error("স্টাফ তালিকা লোড করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadStaff();
  }, [loadStaff]);

  // Desk options for filtering
  const deskOptions = useMemo(() => {
    const set = new Set<string>();
    staffList.forEach((s) => {
      if (s.deskName) set.add(s.deskName);
    });
    return Array.from(set);
  }, [staffList]);

  // Filtered staff list
  const filteredStaff = useMemo(() => {
    return staffList.filter((s) => {
      const matchesSearch =
        searchQuery === "" ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.deskName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.phone && s.phone.includes(searchQuery));

      const matchesDesk = filterDesk === "all" || s.deskName === filterDesk;

      return matchesSearch && matchesDesk;
    });
  }, [staffList, searchQuery, filterDesk]);

  // Aggregate KPIs
  const totalStaff = staffList.length;
  const activeStaff = staffList.filter((s) => s.isActive).length;
  const totalStaffTxns = staffList.reduce((sum, s) => sum + (s.transactionCount || 0), 0);
  const totalStaffSavings = staffList.reduce((sum, s) => sum + (s.totalSavedAmount || 0), 0);

  const handleToggleStatus = async (staff: PartnerStaff) => {
    const newStatus = !staff.isActive;
    try {
      const res = await togglePartnerStaffStatusAction(staff.id, newStatus);
      if (res.success) {
        toast.success(res.message);
        setStaffList((prev) =>
          prev.map((s) => (s.id === staff.id ? { ...s, isActive: newStatus } : s))
        );
      } else {
        toast.error(res.message || "স্ট্যাটাস পরিবর্তন করা যায়নি।");
      }
    } catch {
      toast.error("সার্ভার ত্রুটি।");
    }
  };

  const handleCopyCredentials = (staff: PartnerStaff) => {
    const text = `🏥 প্রতিষ্ঠান: ${partner.name}\n📍 ডেস্ক: ${staff.deskName}\n👤 ইউজারনেম: ${staff.username}\n🔗 লগইন লিংক: ${window.location.origin}/login/partner`;
    navigator.clipboard.writeText(text);
    setCopiedId(staff.id);
    toast.success(`"${staff.name}" এর লগইন তথ্য কপি করা হয়েছে!`);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-5 sm:p-6 rounded-3xl border border-border shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Users className="h-5 w-5" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold font-heading text-secondary dark:text-white">
              {t("partner.staff.title")}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {t("partner.staff.subtitle")}
          </p>
        </div>

        <Button
          onClick={() => {
            setEditingStaff(null);
            setAddModalOpen(true);
          }}
          className="bg-primary hover:bg-primary-dark text-white font-semibold rounded-2xl gap-2 shadow-sm shrink-0 cursor-pointer h-11"
        >
          <UserPlus className="h-4 w-4" />
          <span>{t("partner.staff.addNew")}</span>
        </Button>
      </div>

      {/* 2. KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <Card className="border-border/80 shadow-xs rounded-2xl bg-slate-50/50 dark:bg-slate-900/40">
          <CardContent className="p-4 sm:p-5 flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-muted-foreground">{t("partner.staff.kpiTotalStaff")}</p>
              <h3 className="text-xl sm:text-2xl font-bold text-secondary dark:text-white font-mono">
                {totalStaff}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-xs rounded-2xl bg-slate-50/50 dark:bg-slate-900/40">
          <CardContent className="p-4 sm:p-5 flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-muted-foreground">{t("partner.staff.kpiActiveDesks")}</p>
              <h3 className="text-xl sm:text-2xl font-bold text-secondary dark:text-white font-mono">
                {activeStaff}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-xs rounded-2xl bg-slate-50/50 dark:bg-slate-900/40">
          <CardContent className="p-4 sm:p-5 flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 shrink-0">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-muted-foreground">{t("partner.staff.kpiStaffTxns")}</p>
              <h3 className="text-xl sm:text-2xl font-bold text-secondary dark:text-white font-mono">
                {totalStaffTxns}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-xs rounded-2xl bg-slate-50/50 dark:bg-slate-900/40">
          <CardContent className="p-4 sm:p-5 flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-muted-foreground">{t("partner.staff.kpiStaffSavings")}</p>
              <h3 className="text-xl sm:text-2xl font-bold text-primary font-mono">
                ৳{totalStaffSavings.toLocaleString("bn-BD")}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. Search & Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("partner.staff.searchPlaceholder")}
            className="pl-10 h-10 border-border rounded-xl bg-card"
          />
        </div>

        {deskOptions.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <Filter className="h-4 w-4 text-muted-foreground shrink-0 ml-1" />
            <button
              type="button"
              onClick={() => setFilterDesk("all")}
              className={`text-xs px-3 py-1.5 rounded-xl border whitespace-nowrap cursor-pointer transition-all ${
                filterDesk === "all"
                  ? "bg-primary text-white border-primary font-semibold"
                  : "bg-card hover:bg-muted text-muted-foreground border-border"
              }`}
            >
              সকল ডেস্ক
            </button>
            {deskOptions.map((desk) => (
              <button
                key={desk}
                type="button"
                onClick={() => setFilterDesk(desk)}
                className={`text-xs px-3 py-1.5 rounded-xl border whitespace-nowrap cursor-pointer transition-all ${
                  filterDesk === desk
                    ? "bg-primary text-white border-primary font-semibold"
                    : "bg-card hover:bg-muted text-muted-foreground border-border"
                }`}
              >
                {desk}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 4. Staff Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="p-5 space-y-4 rounded-3xl border-border animate-pulse">
              <div className="flex items-start justify-between">
                <Skeleton className="h-10 w-10 rounded-2xl" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-12 w-full rounded-xl" />
            </Card>
          ))}
        </div>
      ) : filteredStaff.length === 0 ? (
        <Card className="border-dashed border-2 border-border/80 rounded-3xl p-10 text-center space-y-4">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-muted/60 flex items-center justify-center text-muted-foreground">
            <Users className="h-7 w-7" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="font-bold text-secondary dark:text-white text-base">
              {searchQuery || filterDesk !== "all"
                ? "কোনো ক্যাশিয়ার পাওয়া যায়নি"
                : "এখনো কোনো ক্যাশিয়ার অ্যাকাউন্ট যুক্ত করা হয়নি"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {searchQuery || filterDesk !== "all"
                ? "অনুগ্রহ করে অন্য শব্দ দিয়ে অনুসন্ধান করুন।"
                : "আপনার হাসপাতাল বা ডায়াগনস্টিক সেন্টারের বিলিং কাউন্টারের জন্য প্রথম ক্যাশিয়ার যুক্ত করুন।"}
            </p>
          </div>
          {!searchQuery && filterDesk === "all" && (
            <Button
              onClick={() => {
                setEditingStaff(null);
                setAddModalOpen(true);
              }}
              className="bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold gap-1.5 cursor-pointer"
            >
              <UserPlus className="h-4 w-4" />
              নতুন ক্যাশিয়ার যুক্ত করুন
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredStaff.map((staff) => (
            <Card
              key={staff.id}
              className={`rounded-3xl border transition-all duration-200 hover:shadow-md flex flex-col justify-between ${
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
                    className="bg-primary/10 text-primary border-primary/20 text-xs font-semibold px-2.5 py-1 rounded-xl flex items-center gap-1.5"
                  >
                    <Building2 className="h-3.5 w-3.5" />
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
                      {staff.isActive ? t("partner.staff.statusActive") : t("partner.staff.statusInactive")}
                    </span>
                  </div>
                </div>

                {/* Staff Name and Role */}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-secondary dark:text-white font-heading truncate">
                      {staff.name}
                    </h3>
                    <Badge
                      variant="outline"
                      className="text-[10px] uppercase font-bold text-muted-foreground border-border px-1.5 py-0"
                    >
                      {staff.role === "manager" ? t("partner.staff.roleManager") : t("partner.staff.roleCashier")}
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
                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-2xl bg-muted/40 border border-border/50 text-center">
                  <div>
                    <span className="text-[10px] text-muted-foreground block">{t("partner.staff.colTxns")}</span>
                    <span className="text-sm font-bold text-secondary dark:text-white font-mono">
                      {staff.transactionCount || 0}
                    </span>
                  </div>
                  <div className="border-l border-border/60">
                    <span className="text-[10px] text-muted-foreground block">{t("partner.staff.colSavings")}</span>
                    <span className="text-sm font-bold text-primary font-mono">
                      ৳{(staff.totalSavedAmount || 0).toLocaleString("bn-BD")}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between gap-1 pt-1 border-t border-border/60">
                  <div className="flex items-center gap-1">
                    <Button
                      onClick={() => handleCopyCredentials(staff)}
                      variant="ghost"
                      size="sm"
                      title={t("partner.staff.searchPlaceholder") || "Copy"}
                      className="h-8 w-8 p-0 rounded-xl text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      {copiedId === staff.id ? (
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </Button>

                    <Button
                      onClick={() => setResetPwStaff(staff)}
                      variant="ghost"
                      size="sm"
                      title={t("partner.staff.resetPassword")}
                      className="h-8 w-8 p-0 rounded-xl text-muted-foreground hover:text-amber-600 cursor-pointer"
                    >
                      <KeyRound className="h-3.5 w-3.5" />
                    </Button>

                    <Button
                      onClick={() => {
                        setEditingStaff(staff);
                        setAddModalOpen(true);
                      }}
                      variant="ghost"
                      size="sm"
                      title={t("partner.staff.modalEditTitle")}
                      className="h-8 w-8 p-0 rounded-xl text-muted-foreground hover:text-blue-600 cursor-pointer"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>

                    <Button
                      onClick={() => setDeleteStaff(staff)}
                      variant="ghost"
                      size="sm"
                      title={t("partner.staff.deleteStaff")}
                      className="h-8 w-8 p-0 rounded-xl text-muted-foreground hover:text-destructive cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  <Button
                    onClick={() => handleToggleStatus(staff)}
                    variant="outline"
                    size="sm"
                    className={`h-7 px-2.5 rounded-xl text-[11px] font-semibold cursor-pointer ${
                      staff.isActive
                        ? "text-slate-600 hover:text-destructive border-border hover:border-destructive/30"
                        : "text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10"
                    }`}
                  >
                    {staff.isActive ? t("partner.staff.statusInactive") : t("partner.staff.statusActive")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modals */}
      <AddEditStaffModal
        isOpen={addModalOpen}
        onClose={() => {
          setAddModalOpen(false);
          setEditingStaff(null);
        }}
        staffToEdit={editingStaff}
        onSuccess={loadStaff}
        partnerName={partner.name}
      />

      <ResetStaffPasswordModal
        isOpen={!!resetPwStaff}
        onClose={() => setResetPwStaff(null)}
        staff={resetPwStaff}
        onSuccess={loadStaff}
      />

      <DeleteStaffConfirmModal
        isOpen={!!deleteStaff}
        onClose={() => setDeleteStaff(null)}
        staff={deleteStaff}
        onSuccess={loadStaff}
      />
    </div>
  );
}
