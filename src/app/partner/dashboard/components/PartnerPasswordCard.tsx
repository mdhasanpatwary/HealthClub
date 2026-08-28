"use client";

import { useState } from "react";
import { Lock, KeyRound, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { changePartnerPasswordAction } from "@/app/actions/partnerActions";
import { toast } from "sonner";

export function PartnerPasswordCard() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword.trim() || !newPassword.trim()) {
      toast.warning("বর্তমান ও নতুন পাসওয়ার্ড পূরণ করুন।");
      return;
    }

    if (newPassword.length < 6) {
      toast.warning("নতুন পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে।");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("নতুন পাসওয়ার্ড এবং নিশ্চিতকরণ পাসওয়ার্ড মিলছে না।");
      return;
    }

    setLoading(true);
    try {
      const res = await changePartnerPasswordAction(currentPassword.trim(), newPassword.trim());
      if (res.success) {
        toast.success(res.message || "পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে।");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(res.message || "পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে।");
      }
    } catch {
      toast.error("সার্ভার ত্রুটি। অনুগ্রহ করে আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-border shadow-sm rounded-3xl overflow-hidden">
      <CardHeader className="p-5 sm:p-6 pb-3 sm:pb-4">
        <CardTitle className="font-heading text-lg font-bold text-secondary dark:text-white flex items-center gap-2">
          <KeyRound className="h-5 w-5 text-primary" />
          পাসওয়ার্ড ও নিরাপত্তা সেটিংস
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          আপনার পার্টনার অ্যাকাউন্টের লগইন পাসওয়ার্ড পরিবর্তন করুন। (প্রথমবার লগইন করার পর ডিফল্ট পাসওয়ার্ড <span className="font-mono font-bold text-primary">123456</span> পরিবর্তন করে নিন)।
        </CardDescription>
      </CardHeader>

      <CardContent className="p-5 sm:p-6 pt-0">
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label
                htmlFor="current-partner-password"
                className="text-xs font-semibold text-secondary dark:text-slate-200 flex items-center gap-1.5 cursor-pointer"
              >
                <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                বর্তমান পাসওয়ার্ড *
              </label>
              <Input
                id="current-partner-password"
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="যেমন: 123456"
                className="h-10 rounded-xl border-border bg-background text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="new-partner-password"
                className="text-xs font-semibold text-secondary dark:text-slate-200 flex items-center gap-1.5 cursor-pointer"
              >
                <Lock className="h-3.5 w-3.5 text-primary" />
                নতুন পাসওয়ার্ড *
              </label>
              <Input
                id="new-partner-password"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="কমপক্ষে ৬ অক্ষর"
                className="h-10 rounded-xl border-border bg-background text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="confirm-partner-password"
                className="text-xs font-semibold text-secondary dark:text-slate-200 flex items-center gap-1.5 cursor-pointer"
              >
                <Lock className="h-3.5 w-3.5 text-primary" />
                নতুন পাসওয়ার্ড নিশ্চিত করুন *
              </label>
              <Input
                id="confirm-partner-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="পুনরায় পাসওয়ার্ড লিখুন"
                className="h-10 rounded-xl border-border bg-background text-sm"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              disabled={loading}
              className="rounded-xl px-6 h-10 bg-primary hover:bg-primary-dark text-white font-semibold gap-1.5 cursor-pointer text-xs sm:text-sm"
            >
              <CheckCircle2 className="h-4 w-4" />
              {loading ? "পরিবর্তন হচ্ছে..." : "পাসওয়ার্ড আপডেট করুন"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
