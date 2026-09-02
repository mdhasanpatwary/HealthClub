"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Heart, Mail, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { requestPasswordResetAction } from "@/app/actions/memberAuthActions";
import { requestPartnerPasswordResetAction } from "@/app/actions/partnerActions";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { toast } from "sonner";

function ForgotPasswordForm() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const isPartner = searchParams.get("type") === "partner";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!email) {
      toast.warning(t("auth.forgotPassword.emailLabel"));
      setLoading(false);
      return;
    }

    try {
      const res = isPartner
        ? await requestPartnerPasswordResetAction(email)
        : await requestPasswordResetAction(email);

      if (res.success) {
        toast.success(res.message);
        router.push(`/forgot-password/reset?email=${encodeURIComponent(email)}${isPartner ? "&type=partner" : ""}`);
      } else {
        const errMsg = res.message || t("auth.login.serverError");
        toast.error(errMsg);
      }
    } catch {
      toast.error(t("auth.login.serverError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-primary-light/40 via-emerald-50/20 to-background dark:from-slate-950 dark:via-slate-900 dark:to-background">
      {/* Background decoration */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-primary/8 dark:bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-emerald-200/40 dark:bg-emerald-900/15 rounded-full blur-3xl pointer-events-none" />

      {/* Dot-grid background */}
      <div
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #16a34a 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative w-full max-w-md">
        {/* Glass card container */}
        <div className="relative bg-background/90 dark:bg-slate-900/90 backdrop-blur-xl border border-border/60 rounded-3xl shadow-2xl overflow-hidden">
          {/* Accent border top */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />

          <div className="p-8 sm:p-10">
            {/* Header / Brand */}
            <div className="text-center mb-8">
              <Link href="/" className="inline-flex items-center justify-center space-x-2 group mb-5">
                <div className="relative">
                  <Heart className="h-8 w-8 fill-primary text-primary transition-transform duration-300 group-hover:scale-110" />
                  <span className="absolute inset-0 h-8 w-8 rounded-full bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <span className="font-heading text-2xl font-bold text-secondary dark:text-white">
                  {t("layout.header.health")} <span className="gradient-text">{t("layout.header.club")}</span>
                </span>
              </Link>
              <h1 className="font-heading text-xl font-bold text-secondary dark:text-white">
                {t("auth.forgotPassword.title")}
              </h1>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                {t("auth.forgotPassword.subtitle")}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="forgot-email" className="text-xs font-semibold text-secondary dark:text-white flex items-center gap-1.5 cursor-pointer">
                  <Mail className="h-3.5 w-3.5 text-primary" />
                  {t("auth.forgotPassword.emailLabel")}
                </label>
                <Input
                  id="forgot-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("auth.forgotPassword.emailPlaceholder")}
                  className="border-border/60 bg-background dark:bg-slate-800/60 rounded-xl h-11 focus:border-primary/40"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                size="lg"
                className="w-full"
              >
                {loading ? (
                  <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                ) : (
                  <>
                    {t("auth.forgotPassword.sendOtp")}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href={isPartner ? "/login/partner" : "/login"}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                {t("auth.forgotPassword.backToLogin")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ForgotPasswordSkeleton() {
  return (
    <div className="relative min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-light/40 via-emerald-50/20 to-background dark:from-slate-950 dark:via-slate-900 dark:to-background">
      <div className="w-full max-w-md">
        <Card className="p-8 sm:p-10 border border-border/60 bg-background/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl shadow-2xl space-y-6 animate-pulse">
          <div className="text-center space-y-3">
            <Skeleton className="h-10 w-36 mx-auto rounded-xl" />
            <Skeleton className="h-6 w-48 mx-auto" />
            <Skeleton className="h-4 w-64 mx-auto" />
          </div>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-36" />
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
            <Skeleton className="h-11 w-full rounded-xl mt-4" />
          </div>
          <div className="text-center pt-2">
            <Skeleton className="h-4 w-36 mx-auto" />
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<ForgotPasswordSkeleton />}>
      <ForgotPasswordForm />
    </Suspense>
  );
}
