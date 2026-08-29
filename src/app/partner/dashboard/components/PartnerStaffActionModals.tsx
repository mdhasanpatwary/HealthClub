"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PartnerStaff } from "@/services/db";
import {
  resetPartnerStaffPasswordAction,
  deletePartnerStaffAction,
} from "@/app/actions/partnerStaffActions";
import { toast } from "sonner";
import { KeyRound, Trash2 } from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";

import { StaffCredentialsData } from "./PartnerStaffCredentialsModal";

// --- RESET PASSWORD MODAL ---
interface ResetStaffPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: PartnerStaff | null;
  onSuccess: () => void;
  onSuccessWithCredentials?: (credentials: StaffCredentialsData) => void;
  partnerName?: string;
}

export function ResetStaffPasswordModal({
  isOpen,
  onClose,
  staff,
  onSuccess,
  onSuccessWithCredentials,
  partnerName = "",
}: ResetStaffPasswordModalProps) {
  const { t } = useLanguage();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNewPassword("");
    setConfirmPassword("");
  }, [isOpen]);

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!staff) return;

    if (newPassword.length < 6) {
      toast.error(t("partner.password.minLength"));
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error(t("partner.password.mismatch"));
      return;
    }

    setLoading(true);
    try {
      const res = await resetPartnerStaffPasswordAction(staff.id, newPassword);
      if (res.success) {
        toast.success(res.message || t("common.success"));
        onSuccess();
        onClose();
        if (onSuccessWithCredentials) {
          onSuccessWithCredentials({
            partnerName: partnerName || "",
            staffName: staff.name,
            deskName: staff.deskName,
            username: staff.username,
            password: newPassword,
            role: staff.role,
            type: "reset",
          });
        }
      } else {
        toast.error(res.message || t("common.error"));
      }
    } catch {
      toast.error(t("common.error.server"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-background border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground font-heading">
            <KeyRound className="h-5 w-5 text-amber-500" />
            {t("partner.staff.resetPassword")}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {staff ? `"${staff.name}" (${staff.deskName})` : ""}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleResetSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label htmlFor="staff-new-pw" className="text-xs font-semibold text-foreground cursor-pointer">
              {t("partner.staff.passwordMinLength")}
            </label>
            <Input
              id="staff-new-pw"
              type="password"
              required
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border-border bg-background"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="staff-confirm-pw" className="text-xs font-semibold text-foreground cursor-pointer">
              {t("partner.password.confirm")}
            </label>
            <Input
              id="staff-confirm-pw"
              type="password"
              required
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border-border bg-background"
            />
          </div>

          <DialogFooter className="flex justify-end gap-2 pt-2 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-border rounded-xl cursor-pointer"
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl cursor-pointer"
            >
              {loading ? t("partner.staff.resetting") : t("partner.staff.resetBtn")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// --- DELETE CONFIRMATION MODAL ---
interface DeleteStaffConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: PartnerStaff | null;
  onSuccess: () => void;
}

export function DeleteStaffConfirmModal({
  isOpen,
  onClose,
  staff,
  onSuccess,
}: DeleteStaffConfirmModalProps) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!staff) return;
    setLoading(true);
    try {
      const res = await deletePartnerStaffAction(staff.id);
      if (res.success) {
        toast.success(res.message || t("common.success"));
        onSuccess();
        onClose();
      } else {
        toast.error(res.message || t("common.error"));
      }
    } catch {
      toast.error(t("common.error.server"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-background border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive font-heading">
            <Trash2 className="h-5 w-5" />
            {t("partner.staff.deleteConfirmTitle")}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground pt-1">
            {t("partner.staff.deleteConfirmDesc")} <strong>&quot;{staff?.name}&quot;</strong> {t("partner.staff.deletePermanentlyDesc")}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-end gap-2 pt-3 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="border-border rounded-xl cursor-pointer"
          >
            {t("common.cancel")}
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={loading}
            onClick={handleDelete}
            className="rounded-xl cursor-pointer"
          >
            {loading ? t("partner.staff.deleting") : t("partner.staff.deleteConfirmBtn")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
