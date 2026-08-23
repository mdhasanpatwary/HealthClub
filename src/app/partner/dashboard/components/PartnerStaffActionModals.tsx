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
import { dbStore } from "@/services/dbStore";
import { toast } from "sonner";
import { KeyRound, Trash2 } from "lucide-react";

// --- RESET PASSWORD MODAL ---
interface ResetStaffPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: PartnerStaff | null;
  onSuccess: () => void;
}

export function ResetStaffPasswordModal({
  isOpen,
  onClose,
  staff,
  onSuccess,
}: ResetStaffPasswordModalProps) {
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
      toast.error("নতুন পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে।");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("নতুন পাসওয়ার্ড দুটি মেলেনি।");
      return;
    }

    setLoading(true);
    try {
      const res = await dbStore.resetPartnerStaffPassword(staff.id, newPassword);
      if (res.success) {
        toast.success(res.message);
        onSuccess();
        onClose();
      } else {
        toast.error(res.message || "পাসওয়ার্ড রিসেট করা যায়নি।");
      }
    } catch {
      toast.error("সার্ভার ত্রুটি। অনুগ্রহ করে আবার চেষ্টা করুন।");
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
            ক্যাশিয়ারের পাসওয়ার্ড রিসেট করুন
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {staff ? `"${staff.name}" (${staff.deskName}) এর জন্য নতুন পাসওয়ার্ড নির্ধারণ করুন।` : ""}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleResetSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label htmlFor="staff-new-pw" className="text-xs font-semibold text-foreground cursor-pointer">
              নতুন পাসওয়ার্ড (অন্তত ৬ অক্ষর)
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
              নতুন পাসওয়ার্ড পুনরায় লিখুন
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
              বাতিল
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl cursor-pointer"
            >
              {loading ? "রিসেট হচ্ছে..." : "পাসওয়ার্ড রিসেট করুন"}
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
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!staff) return;
    setLoading(true);
    try {
      const res = await dbStore.deletePartnerStaff(staff.id);
      if (res.success) {
        toast.success(res.message);
        onSuccess();
        onClose();
      } else {
        toast.error(res.message || "অ্যাকাউন্টটি মোছা যায়নি।");
      }
    } catch {
      toast.error("সার্ভার ত্রুটি।");
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
            স্টাফ অ্যাকাউন্ট মুছতে চান?
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground pt-1">
            আপনি কি নিশ্চিত যে <strong>&quot;{staff?.name}&quot;</strong> ({staff?.deskName}) এর অ্যাকাউন্টটি স্থায়ীভাবে মুছে ফেলতে চান? পূর্বে সম্পন্ন লেনদেনের রেকর্ড বহাল থাকবে।
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-end gap-2 pt-3 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="border-border rounded-xl cursor-pointer"
          >
            বাতিল
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={loading}
            onClick={handleDelete}
            className="rounded-xl cursor-pointer"
          >
            {loading ? "মুছে ফেলা হচ্ছে..." : "হ্যাঁ, মুছে ফেলুন"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
