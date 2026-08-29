"use client";

import { useState } from "react";
import { Lock, KeyRound, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { changePartnerPasswordAction } from "@/app/actions/partnerActions";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { toast } from "sonner";

export function PartnerPasswordCard() {
  const { t } = useLanguage();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword.trim() || !newPassword.trim()) {
      toast.warning(t("partner.password.fillBoth"));
      return;
    }

    if (newPassword.length < 6) {
      toast.warning(t("partner.password.minLength"));
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error(t("partner.password.mismatch"));
      return;
    }

    setLoading(true);
    try {
      const res = await changePartnerPasswordAction(currentPassword.trim(), newPassword.trim());
      if (res.success) {
        toast.success(res.message || t("common.success"));
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
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
    <Card className="border-border shadow-sm rounded-3xl overflow-hidden">
      <CardHeader className="p-5 sm:p-6 pb-3 sm:pb-4">
        <CardTitle className="font-heading text-lg font-bold text-secondary dark:text-white flex items-center gap-2">
          <KeyRound className="h-5 w-5 text-primary" />
          {t("partner.password.title")}
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          {t("partner.password.description")}
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
                {t("partner.password.current")} *
              </label>
              <Input
                id="current-partner-password"
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder={t("partner.password.currentPlaceholder")}
                className="h-10 rounded-xl border-border bg-background text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="new-partner-password"
                className="text-xs font-semibold text-secondary dark:text-slate-200 flex items-center gap-1.5 cursor-pointer"
              >
                <Lock className="h-3.5 w-3.5 text-primary" />
                {t("partner.password.new")} *
              </label>
              <Input
                id="new-partner-password"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={t("partner.password.newPlaceholder")}
                className="h-10 rounded-xl border-border bg-background text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="confirm-partner-password"
                className="text-xs font-semibold text-secondary dark:text-slate-200 flex items-center gap-1.5 cursor-pointer"
              >
                <Lock className="h-3.5 w-3.5 text-primary" />
                {t("partner.password.confirm")} *
              </label>
              <Input
                id="confirm-partner-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t("partner.password.confirmPlaceholder")}
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
              {loading ? t("partner.password.updating") : t("partner.password.updateBtn")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
