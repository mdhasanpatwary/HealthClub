"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminUser } from "@/services/db";
import { KeyRound, Lock } from "lucide-react";
import { toast } from "sonner";

interface AdminStaffPasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  staff: AdminUser | null;
  onReset: (id: string, newPass: string) => Promise<boolean>;
  locale?: "bn" | "en";
}

export function AdminStaffPasswordDialog({
  isOpen,
  onClose,
  staff,
  onReset,
  locale = "bn",
}: AdminStaffPasswordDialogProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const isBn = locale === "bn";

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!staff) return;

    if (!newPassword || newPassword.length < 6) {
      toast.warning(isBn ? "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।" : "Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error(isBn ? "পাসওয়ার্ড দুটি মেলেনি।" : "Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const success = await onReset(staff.id, newPassword);
      if (success) {
        setNewPassword("");
        setConfirmPassword("");
        onClose();
      }
    } finally {
      setLoading(false);
    }
  };

  if (!staff) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-4 sm:p-6 bg-background/95 backdrop-blur-xl border border-border">
        <DialogHeader className="space-y-2 border-b border-border/60 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg sm:text-xl font-bold font-heading text-secondary dark:text-white">
                {isBn ? "পাসওয়ার্ড রিসেট করুন" : "Reset Password"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {staff.name} ({staff.email})
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleReset} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-primary" />
              {isBn ? "নতুন পাসওয়ার্ড" : "New Password"} *
            </label>
            <Input
              type="password"
              required
              placeholder="•••••••• (কমপক্ষে ৬ অক্ষর)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="bg-card border-border h-10 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-primary" />
              {isBn ? "পাসওয়ার্ড নিশ্চিত করুন" : "Confirm Password"} *
            </label>
            <Input
              type="password"
              required
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-card border-border h-10 text-sm"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/60">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={loading}
              className="text-xs rounded-xl"
            >
              {isBn ? "বাতিল" : "Cancel"}
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={loading}
              className="text-xs rounded-xl bg-amber-600 hover:bg-amber-700 font-bold text-white px-5"
            >
              {loading
                ? isBn
                  ? "পরিবর্তন হচ্ছে..."
                  : "Updating..."
                : isBn
                ? "পাসওয়ার্ড আপডেট করুন"
                : "Reset Password"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
