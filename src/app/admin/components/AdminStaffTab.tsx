"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import { AdminRole, AdminUser } from "@/services/db";
import {
  getAdminUsersListAction,
  createAdminUserAction,
  updateAdminUserAction,
  toggleAdminUserStatusAction,
  resetAdminUserPasswordAction,
  deleteAdminUserAction,
  getCurrentAdminSessionAction,
} from "@/app/actions/adminUserActions";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { AdminStaffStats } from "./AdminStaffStats";
import { AdminStaffTable } from "./AdminStaffTable";
import { AdminStaffDialog } from "./AdminStaffDialog";
import { AdminStaffPasswordDialog } from "./AdminStaffPasswordDialog";
import { AdminStaffPermissionsModal } from "./AdminStaffPermissionsModal";
import {
  ShieldCheck,
  UserPlus,
  Users,
  Search,
  AlertTriangle,
  FileSpreadsheet,
} from "lucide-react";
import { toast } from "sonner";

export function AdminStaffTab() {
  const { locale } = useLanguage();
  const isBn = locale === "bn";

  const [staffList, setStaffList] = useState<AdminUser[]>([]);
  const [currentAdminId, setCurrentAdminId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");

  // Dialog States
  const [isStaffDialogOpen, setIsStaffDialogOpen] = useState(false);
  const [selectedStaffForEdit, setSelectedStaffForEdit] = useState<AdminUser | null>(null);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [selectedStaffForPass, setSelectedStaffForPass] = useState<AdminUser | null>(null);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<AdminUser | null>(null);
  const [isPending, startTransition] = useTransition();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [list, session] = await Promise.all([
        getAdminUsersListAction(),
        getCurrentAdminSessionAction(),
      ]);
      setStaffList(list);
      if (session.user?.id) {
        setCurrentAdminId(session.user.id);
      }
    } catch {
      toast.error(isBn ? "স্টাফ তথ্য লোড করতে ব্যর্থ হয়েছে।" : "Failed to load staff accounts.");
    } finally {
      setLoading(false);
    }
  }, [isBn]);

  useEffect(() => {
    let isMounted = true;
    Promise.resolve().then(() => {
      if (isMounted) {
        loadData();
      }
    });
    return () => {
      isMounted = false;
    };
  }, [loadData]);

  // Filtered List
  const filteredStaff = staffList.filter((s) => {
    const matchesRole = selectedRole === "all" || s.role === selectedRole;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      s.name.toLowerCase().includes(query) ||
      s.email.toLowerCase().includes(query) ||
      (s.phone && s.phone.includes(query));
    return matchesRole && matchesSearch;
  });

  // KPI Stats
  const totalStaff = staffList.length;
  const superAdminCount = staffList.filter((s) => s.role === "super_admin").length;
  const moderatorCount = staffList.filter((s) => s.role === "content_moderator").length;
  const supportCount = staffList.filter((s) => s.role === "support_staff").length;
  const activeCount = staffList.filter((s) => s.isActive).length;

  const handleSaveStaff = async (data: {
    id?: string;
    name: string;
    email?: string;
    phone?: string;
    password?: string;
    role: AdminRole;
    isActive?: boolean;
  }): Promise<boolean> => {
    if (data.id) {
      const res = await updateAdminUserAction(data.id, {
        name: data.name,
        phone: data.phone,
        role: data.role,
        isActive: data.isActive ?? true,
      });
      if (res.success && res.user) {
        toast.success(isBn ? "স্টাফের তথ্য সফলভাবে আপডেট করা হয়েছে!" : "Staff updated successfully!");
        setStaffList((prev) => prev.map((s) => (s.id === res.user!.id ? res.user! : s)));
        return true;
      } else {
        toast.error(res.error || (isBn ? "আপডেট করতে ব্যর্থ হয়েছে।" : "Update failed."));
        return false;
      }
    } else {
      const res = await createAdminUserAction({
        name: data.name,
        email: data.email || "",
        phone: data.phone,
        password: data.password || "",
        role: data.role,
      });
      if (res.success && res.user) {
        toast.success(isBn ? "নতুন এডমিন অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!" : "Staff account created!");
        setStaffList((prev) => [res.user!, ...prev]);
        return true;
      } else {
        toast.error(res.error || (isBn ? "অ্যাকাউন্ট তৈরি করতে ব্যর্থ হয়েছে।" : "Failed to create account."));
        return false;
      }
    }
  };

  const handleToggleStatus = async (staff: AdminUser) => {
    startTransition(async () => {
      const nextStatus = !staff.isActive;
      const res = await toggleAdminUserStatusAction(staff.id, nextStatus);
      if (res.success) {
        toast.success(res.message);
        setStaffList((prev) =>
          prev.map((s) => (s.id === staff.id ? { ...s, isActive: nextStatus } : s))
        );
      } else {
        toast.error(res.message);
      }
    });
  };

  const handleResetPassword = async (id: string, newPass: string): Promise<boolean> => {
    const res = await resetAdminUserPasswordAction(id, newPass);
    if (res.success) {
      toast.success(res.message);
      return true;
    } else {
      toast.error(res.message);
      return false;
    }
  };

  const handleDelete = async () => {
    if (!staffToDelete) return;
    startTransition(async () => {
      const res = await deleteAdminUserAction(staffToDelete.id);
      if (res.success) {
        toast.success(res.message);
        setStaffList((prev) => prev.filter((s) => s.id !== staffToDelete.id));
        setStaffToDelete(null);
      } else {
        toast.error(res.message);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header & Main Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-4 sm:p-6 rounded-3xl border border-border shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-[11px] font-bold bg-primary/10 text-primary border-primary/20">
              <ShieldCheck className="h-3.5 w-3.5 mr-1" />
              RBAC & Access Control
            </Badge>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-secondary dark:text-white">
            {isBn ? "এডমিন ও স্টাফ ব্যবস্থাপনা" : "Admin & Staff Management"}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isBn
              ? "সিস্টেম এডমিনিস্ট্রেটরদের তালিকা, রোল-বেসড এক্সেস এবং পারমিশন কনফিগার করুন"
              : "Manage admin accounts, assign granular RBAC roles and control system permissions"}
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPermissionsModalOpen(true)}
            className="text-xs font-semibold rounded-xl gap-1.5 h-9 flex-1 sm:flex-initial"
          >
            <FileSpreadsheet className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <span>{isBn ? "পারমিশন ম্যাট্রিক্স" : "Permissions"}</span>
          </Button>

          <Button
            size="sm"
            onClick={() => {
              setSelectedStaffForEdit(null);
              setIsStaffDialogOpen(true);
            }}
            className="text-xs font-bold rounded-xl bg-primary hover:bg-primary-dark text-white gap-1.5 h-9 shadow-xs flex-1 sm:flex-initial"
          >
            <UserPlus className="h-4 w-4" />
            <span>{isBn ? "নতুন স্টাফ যোগ করুন" : "Add Staff"}</span>
          </Button>
        </div>
      </div>

      {/* KPI Stats Overview */}
      <AdminStaffStats
        totalStaff={totalStaff}
        superAdminCount={superAdminCount}
        moderatorCount={moderatorCount}
        supportCount={supportCount}
        activeCount={activeCount}
        locale={locale}
      />

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-3 sm:p-4 rounded-2xl border border-border">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={isBn ? "নাম, ইমেইল বা ফোন নম্বর দিয়ে খুঁজুন..." : "Search by name, email or phone..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-background border-border h-9 text-xs rounded-xl"
          />
        </div>

        {/* Role Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { key: "all", labelBn: "সকল রোল", labelEn: "All Roles" },
            { key: "super_admin", labelBn: "সুপার এডমিন", labelEn: "Super Admin" },
            { key: "content_moderator", labelBn: "মডারেটর", labelEn: "Moderator" },
            { key: "support_staff", labelBn: "সাপোর্ট স্টাফ", labelEn: "Support" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setSelectedRole(item.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedRole === item.key
                  ? "bg-primary text-white shadow-2xs"
                  : "bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {isBn ? item.labelBn : item.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Staff List View */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-2xl bg-muted/40 animate-pulse border border-border" />
          ))}
        </div>
      ) : filteredStaff.length === 0 ? (
        <Card className="border-border text-center py-12 bg-card">
          <CardContent className="space-y-3">
            <div className="p-3.5 rounded-full bg-muted/60 text-muted-foreground w-fit mx-auto">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-foreground">
              {isBn ? "কোনো স্টাফ পাওয়া যায়নি" : "No staff accounts found"}
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              {searchQuery || selectedRole !== "all"
                ? isBn
                  ? "অনুসন্ধান ফিল্টার পরিবর্তন করে পুনরায় চেষ্টা করুন।"
                  : "Try modifying your search query or filter selection."
                : isBn
                ? "নতুন স্টাফ যোগ করতে উপরের বাটনে ক্লিক করুন।"
                : "Click the add button above to create a staff account."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <AdminStaffTable
          staffList={filteredStaff}
          currentAdminId={currentAdminId}
          isPending={isPending}
          onToggleStatus={handleToggleStatus}
          onEdit={(staff) => {
            setSelectedStaffForEdit(staff);
            setIsStaffDialogOpen(true);
          }}
          onResetPassword={(staff) => {
            setSelectedStaffForPass(staff);
            setIsPasswordDialogOpen(true);
          }}
          onDelete={(staff) => setStaffToDelete(staff)}
          locale={locale}
        />
      )}

      {/* Staff Dialog */}
      <AdminStaffDialog
        isOpen={isStaffDialogOpen}
        onClose={() => setIsStaffDialogOpen(false)}
        staff={selectedStaffForEdit}
        onSave={handleSaveStaff}
        locale={locale}
      />

      {/* Password Reset Dialog */}
      <AdminStaffPasswordDialog
        isOpen={isPasswordDialogOpen}
        onClose={() => setIsPasswordDialogOpen(false)}
        staff={selectedStaffForPass}
        onReset={handleResetPassword}
        locale={locale}
      />

      {/* Permissions Matrix Modal */}
      <AdminStaffPermissionsModal
        isOpen={isPermissionsModalOpen}
        onClose={() => setIsPermissionsModalOpen(false)}
        locale={locale}
      />

      {/* Delete Confirmation Modal */}
      <Dialog open={!!staffToDelete} onOpenChange={(open) => !open && setStaffToDelete(null)}>
        <DialogContent className="max-w-md p-6 bg-background/95 backdrop-blur-xl border border-border">
          <DialogHeader className="space-y-2">
            <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-600 w-fit">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <DialogTitle className="text-lg font-bold text-foreground">
              {isBn ? "এডমিন অ্যাকাউন্ট ডিলিট নিশ্চিতকরণ" : "Confirm Staff Deletion"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {isBn
                ? `আপনি কি নিশ্চিতভাবে "${staffToDelete?.name}" (${staffToDelete?.email}) এর এডমিন অ্যাকাউন্ট মুছে ফেলতে চান? এটি আর ফিরিয়ে আনা যাবে না।`
                : `Are you sure you want to delete the staff account for "${staffToDelete?.name}" (${staffToDelete?.email})? This action cannot be undone.`}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex items-center justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setStaffToDelete(null)}
              disabled={isPending}
              className="text-xs rounded-xl"
            >
              {isBn ? "বাতিল" : "Cancel"}
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={isPending}
              className="text-xs rounded-xl font-bold"
            >
              {isPending ? (isBn ? "মুছে ফেলা হচ্ছে..." : "Deleting...") : (isBn ? "হ্যাঁ, মুছে ফেলুন" : "Delete Account")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
