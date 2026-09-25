"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Users,
  UserPlus,
  Search,
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
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AddEditStaffModal,
  ResetStaffPasswordModal,
  DeleteStaffConfirmModal,
} from "./PartnerStaffModals";
import { PartnerStaffCard } from "./PartnerStaffCard";
import {
  PartnerStaffCredentialsModal,
  StaffCredentialsData,
} from "./PartnerStaffCredentialsModal";
import { PartnerStaffDetailsModal } from "./PartnerStaffDetailsModal";
import { toast } from "sonner";
import { toBanglaNums } from "@/lib/utils";

interface PartnerStaffTabProps {
  partner: Partner;
}

export function PartnerStaffTab({ partner }: PartnerStaffTabProps) {
  const [staffList, setStaffList] = useState<PartnerStaff[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDesk, setFilterDesk] = useState("all");

  // Modals state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<PartnerStaff | null>(null);
  const [resetPwStaff, setResetPwStaff] = useState<PartnerStaff | null>(null);
  const [deleteStaff, setDeleteStaff] = useState<PartnerStaff | null>(null);
  const [detailsStaff, setDetailsStaff] = useState<PartnerStaff | null>(null);
  const [credentialsModalData, setCredentialsModalData] =
    useState<StaffCredentialsData | null>(null);

  const loadStaff = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPartnerStaffListAction();
      setStaffList(data);
    } catch {
      toast.error("স্টাফ তালিকা লোড করতে সমস্যা হয়েছে");
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
  const totalStaffTxns = staffList.reduce(
    (sum, s) => sum + (s.transactionCount || 0),
    0
  );
  const totalStaffSavings = staffList.reduce(
    (sum, s) => sum + (s.totalSavedAmount || 0),
    0
  );

  const handleToggleStatus = async (staff: PartnerStaff) => {
    const newStatus = !staff.isActive;
    try {
      const res = await togglePartnerStaffStatusAction(staff.id, newStatus);
      if (res.success) {
        toast.success(res.message);
        setStaffList((prev) =>
          prev.map((s) =>
            s.id === staff.id ? { ...s, isActive: newStatus } : s
          )
        );
      } else {
        toast.error(res.message || "একটি সমস্যা হয়েছে");
      }
    } catch {
      toast.error("সার্ভারে ত্রুটি হয়েছে, অনুগ্রহ করে আবার চেষ্টা করুন");
    }
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
              কাউন্টার ও স্টাফ টিম
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            আপনার প্রতিষ্ঠান/হাসপাতালের কাউন্টার ও বিলিং স্টাফদের পরিচালনা করুন
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
          <span>নতুন স্টাফ যোগ করুন</span>
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
              <p className="text-[11px] font-medium text-muted-foreground">
                মোট স্টাফ
              </p>
              <h3 className="text-xl sm:text-2xl font-bold text-secondary dark:text-white font-mono">
                {toBanglaNums(totalStaff)}
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
              <p className="text-[11px] font-medium text-muted-foreground">
                সক্রিয় ডেস্ক
              </p>
              <h3 className="text-xl sm:text-2xl font-bold text-secondary dark:text-white font-mono">
                {toBanglaNums(activeStaff)}
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
              <p className="text-[11px] font-medium text-muted-foreground">
                মোট লেনদেন
              </p>
              <h3 className="text-xl sm:text-2xl font-bold text-secondary dark:text-white font-mono">
                {toBanglaNums(totalStaffTxns)}
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
              <p className="text-[11px] font-medium text-muted-foreground">
                মোট সাশ্রয়
              </p>
              <h3 className="text-xl sm:text-2xl font-bold text-primary font-mono">
                ৳{toBanglaNums(totalStaffSavings)}
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
            placeholder="স্টাফের নাম, ইউজারনেম, বা ফোন খুঁজুন..."
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
              সব ডেস্ক
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
            <Card
              key={i}
              className="p-5 space-y-4 rounded-3xl border-border animate-pulse"
            >
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
                ? "কোনো স্টাফ পাওয়া যায়নি"
                : "কোনো স্টাফ এখনো যোগ করা হয়নি"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {searchQuery || filterDesk !== "all"
                ? "অনুগ্রহ করে অনুসন্ধান পরিবর্তন করে আবার চেষ্টা করুন"
                : "কাউন্টার ও বিলিং কাজের সুবিধার্থে নতুন স্টাফ যোগ করুন"}
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
              প্রথম স্টাফ যোগ করুন
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredStaff.map((staff) => (
            <PartnerStaffCard
              key={staff.id}
              staff={staff}
              partnerName={partner.name}
              onViewDetails={(st) => setDetailsStaff(st)}
              onEdit={(st) => {
                setEditingStaff(st);
                setAddModalOpen(true);
              }}
              onResetPassword={(st) => setResetPwStaff(st)}
              onDelete={(st) => setDeleteStaff(st)}
              onToggleStatus={handleToggleStatus}
            />
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
        onSuccessWithCredentials={(creds) => setCredentialsModalData(creds)}
        partnerName={partner.name}
      />

      <ResetStaffPasswordModal
        isOpen={!!resetPwStaff}
        onClose={() => setResetPwStaff(null)}
        staff={resetPwStaff}
        onSuccess={loadStaff}
        onSuccessWithCredentials={(creds) => setCredentialsModalData(creds)}
        partnerName={partner.name}
      />

      <DeleteStaffConfirmModal
        isOpen={!!deleteStaff}
        onClose={() => setDeleteStaff(null)}
        staff={deleteStaff}
        onSuccess={loadStaff}
      />

      {/* Credentials Access Slip Modal */}
      <PartnerStaffCredentialsModal
        isOpen={!!credentialsModalData}
        onClose={() => setCredentialsModalData(null)}
        data={credentialsModalData}
      />

      {/* Staff Details & Transactions Modal */}
      <PartnerStaffDetailsModal
        isOpen={!!detailsStaff}
        onClose={() => setDetailsStaff(null)}
        staff={detailsStaff}
        partnerName={partner.name}
        onEdit={(st) => {
          setDetailsStaff(null);
          setEditingStaff(st);
          setAddModalOpen(true);
        }}
        onResetPassword={(st) => {
          setDetailsStaff(null);
          setResetPwStaff(st);
        }}
        onDelete={(st) => {
          setDetailsStaff(null);
          setDeleteStaff(st);
        }}
        onToggleStatus={(st) => {
          handleToggleStatus(st);
          setDetailsStaff((prev) =>
            prev && prev.id === st.id ? { ...prev, isActive: !prev.isActive } : prev
          );
        }}
        onOpenCredentials={(st) => {
          setCredentialsModalData({
            partnerName: partner.name,
            staffName: st.name,
            deskName: st.deskName,
            username: st.username,
            password: st.plainPassword,
            role: st.role,
            type: "view",
          });
        }}
      />
    </div>
  );
}

