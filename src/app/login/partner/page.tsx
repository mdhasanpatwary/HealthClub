"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Lock, Building2 } from "lucide-react";
import { dbStore } from "@/services/dbStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { loginPartnerAction } from "@/app/actions/partnerActions";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { toast } from "sonner";

export default function PartnerLoginPage() {
  const { t } = useLanguage();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePartnerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!identifier || !password) {
      toast.warning(t("auth.login.fillAll"));
      setLoading(false);
      return;
    }

    try {
      const res = await loginPartnerAction(identifier, password);
      if (res.success && res.partner) {
        dbStore.setCurrentPartner(res.partner);
        dbStore.setCurrentStaff(res.staff || null);
        toast.success(t("auth.login.success"));
        router.push("/partner/dashboard");
        return;
      } else {
        toast.error(res.error || t("auth.login.invalidCredentials"));
      }
    } catch {
      toast.error(t("auth.login.serverError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-muted/30 min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md border border-border shadow-xl bg-background/80 backdrop-blur">
        <CardHeader className="text-center space-y-2">
          <Link href="/" className="flex items-center justify-center space-x-2 text-primary mx-auto">
            <Heart className="h-7 w-7 fill-primary" />
            <span className="font-heading text-2xl font-bold text-secondary dark:text-white">
              {t("layout.header.health")} <span className="text-primary">{t("layout.header.club")}</span>
            </span>
          </Link>
          <div className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mx-auto">
            <Building2 className="h-3 w-3" />
            {t("auth.partnerLogin.title")}
          </div>
          <CardTitle className="font-heading text-xl font-bold text-secondary dark:text-white pt-1">
            {t("auth.partnerLogin.title")}
          </CardTitle>
          <CardDescription>
            {t("auth.partnerLogin.subtitle")}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handlePartnerLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="partner-identifier" className="text-xs font-semibold text-secondary dark:text-white flex items-center gap-1.5 cursor-pointer">
                <Building2 className="h-3.5 w-3.5 text-primary" />
                {t("auth.partnerLogin.codeLabel")}
              </label>
              <Input
                id="partner-identifier"
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="partner@hospital.com / counter1"
                className="border-border bg-background"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="partner-password" className="text-xs font-semibold text-secondary dark:text-white flex items-center gap-1.5 cursor-pointer">
                  <Lock className="h-3.5 w-3.5 text-primary" />
                  {t("auth.partnerLogin.passwordLabel")}
                </label>
                <Link href="/forgot-password?type=partner" className="text-xs text-primary hover:underline font-semibold">
                  {t("auth.partnerLogin.forgotPassword")}
                </Link>
              </div>
              <Input
                id="partner-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="border-border bg-background"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                t("auth.partnerLogin.submitButton")
              )}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground border-t border-border pt-4">
            <Link href="/login" className="text-primary hover:underline font-semibold">
              {t("auth.adminLogin.backToSite")}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
