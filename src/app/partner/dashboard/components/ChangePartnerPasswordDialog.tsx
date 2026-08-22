import React, { useState } from "react";
import { KeyRound } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { changePartnerPasswordAction } from "@/app/actions/partnerActions";
import { toast } from "sonner";

export function ChangePartnerPasswordDialog() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loadingChange, setLoadingChange] = useState(false);

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingChange(true);

    if (newPassword.length < 6) {
      toast.error("নতুন পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে।");
      setLoadingChange(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("নতুন পাসওয়ার্ড দুটি মেলেনি।");
      setLoadingChange(false);
      return;
    }

    try {
      const res = await changePartnerPasswordAction(currentPassword, newPassword);
      if (res.success) {
        toast.success(res.message);
        setDialogOpen(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(res.message || "পাসওয়ার্ড পরিবর্তন করা যায়নি।");
      }
    } catch {
      toast.error("সার্ভার ত্রুটি। অনুগ্রহ করে আবার চেষ্টা করুন।");
    } finally {
      setLoadingChange(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm" className="gap-1.5 border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white">
            <KeyRound className="h-4 w-4" />
            <span>পাসওয়ার্ড পরিবর্তন</span>
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md bg-background border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground font-heading">
            <KeyRound className="h-5 w-5 text-amber-500" />
            পাসওয়ার্ড পরিবর্তন করুন
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs">
            আপনার অ্যাকাউন্ট সুরক্ষিত রাখতে নিয়মিত পাসওয়ার্ড পরিবর্তন করুন।
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleChangePasswordSubmit} className="space-y-4 pt-2">

          <div className="space-y-1.5">
            <label htmlFor="partner-current-pw" className="text-xs font-semibold text-foreground cursor-pointer">বর্তমান পাসওয়ার্ড</label>
            <Input
              id="partner-current-pw"
              type="password"
              required
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="border-border bg-background"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="partner-new-pw" className="text-xs font-semibold text-foreground cursor-pointer">নতুন পাসওয়ার্ড</label>
            <Input
              id="partner-new-pw"
              type="password"
              required
              placeholder="অন্তত ৬ অক্ষর"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border-border bg-background"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="partner-confirm-pw" className="text-xs font-semibold text-foreground cursor-pointer">নতুন পাসওয়ার্ড পুনরায় লিখুন</label>
            <Input
              id="partner-confirm-pw"
              type="password"
              required
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border-border bg-background"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="border-border text-foreground"
            >
              বাতিল
            </Button>
            <Button
              type="submit"
              disabled={loadingChange}
              className="bg-primary hover:bg-primary-dark text-white font-semibold"
            >
              {loadingChange ? "পরিবর্তন হচ্ছে..." : "পাসওয়ার্ড আপডেট করুন"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
