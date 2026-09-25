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
import { toBanglaNums } from "@/lib/utils";
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
        toast.error(res.error || "স্টাফ তথ্য লোড করতে সমস্যা হয়েছে");
      }
    } catch {
      toast.error("স্টাফ তথ্য লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  }, []);

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
    toast.success(`${label} কপি করা হয়েছে`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (!staff) return null;

  const roleText =
    activeStaff?.role === "manager"
      ? "ম্যানেজার"
      : "বিলিং স্টাফ";

  const formattedJoinDate = activeStaff?.createdAt
    ? new Date(activeStaff.createdAt).toLocaleDateString("bn-BD", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
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
                    {activeStaff?.isActive ? "সক্রিয়" : "নিষ্ক্রিয়"}
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
                title="লগইন তথ্য স্লিপ"
              >
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span className="hidden sm:inline">লগইন তথ্য স্লিপ</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => activeStaff && onEdit(activeStaff)}
                className="h-8 px-2.5 rounded-xl text-xs gap-1.5 border-border hover:text-blue-600 cursor-pointer"
                title="স্টাফ এডিট"
              >
                <Edit2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">স্টাফ এডিট</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => activeStaff && onResetPassword(activeStaff)}
                className="h-8 px-2.5 rounded-xl text-xs gap-1.5 border-border hover:text-amber-600 cursor-pointer"
                title="পাসওয়ার্ড রিসেট"
              >
                <KeyRound className="h-3.5 w-3.5" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => activeStaff && onDelete(activeStaff)}
                className="h-8 w-8 p-0 rounded-xl text-muted-foreground hover:text-destructive hover:border-destructive/30 cursor-pointer"
                title="স্টাফ মুছে ফেলুন"
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
                কাউন্টার / ডেস্ক
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
                  ইউজারনেম
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
                  "ইউজারনেম"
                )
              }
              className="h-6 w-6 p-0 rounded-md text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
              title="ইউজারনেম কপি করুন"
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
                  ফোন নম্বর
                </span>
                <span className="font-mono text-foreground truncate block">
                  {activeStaff?.phone ? toBanglaNums(activeStaff.phone) : "দেওয়া নেই"}
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
                    "ফোন নম্বর"
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
                    মোট লেনদেন
                  </span>
                  <Receipt className="h-3.5 w-3.5 text-blue-500" />
                </div>
                <div className="text-base sm:text-lg font-bold font-mono text-foreground">
                  {toBanglaNums(stats?.totalCount || 0)}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  আজকের লেনদেন: <span className="font-bold text-foreground">{toBanglaNums(stats?.todayCount || 0)}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/70 bg-card rounded-2xl shadow-none">
              <CardContent className="p-3 sm:p-3.5 space-y-1">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-[10px] sm:text-[11px] font-medium">
                    মোট বিল
                  </span>
                  <CircleDollarSign className="h-3.5 w-3.5 text-purple-500" />
                </div>
                <div className="text-base sm:text-lg font-bold font-mono text-foreground">
                  ৳{toBanglaNums(stats?.totalBill || 0)}
                </div>
                <div className="text-[10px] text-muted-foreground truncate">
                  গড় বিল: ৳{toBanglaNums(stats?.avgBill || 0)}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/70 bg-card rounded-2xl shadow-none">
              <CardContent className="p-3 sm:p-3.5 space-y-1">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-[10px] sm:text-[11px] font-medium">
                    মোট সাশ্রয়
                  </span>
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                </div>
                <div className="text-base sm:text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  ৳{toBanglaNums(stats?.totalSaved || 0)}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  আজকের সাশ্রয়: <span className="font-bold text-emerald-600">৳{toBanglaNums(stats?.todaySaved || 0)}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/70 bg-card rounded-2xl shadow-none">
              <CardContent className="p-3 sm:p-3.5 space-y-1">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-[10px] sm:text-[11px] font-medium">
                    যোগদানের তারিখ
                  </span>
                  <Calendar className="h-3.5 w-3.5 text-amber-500" />
                </div>
                <div className="text-xs sm:text-sm font-semibold text-foreground truncate">
                  {formattedJoinDate || "প্রযোজ্য নয়"}
                </div>
                <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{activeStaff?.isActive ? "সক্রিয়" : "নিষ্ক্রিয়"}</span>
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
            {activeStaff?.isActive ? "নিষ্ক্রিয় করুন" : "সক্রিয় করুন"}
          </Button>

          <Button
            type="button"
            onClick={onClose}
            className="bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl text-xs h-8 px-4 cursor-pointer"
          >
            বন্ধ করুন
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
