"use client";

import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Heart, ShieldCheck } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  verifyEmailOtpAction,
  resendVerificationCodeAction,
  getPendingRegistrationEmailAction,
} from "@/app/actions/memberAuthActions";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { toast } from "sonner";

function VerifyEmailForm() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlEmail = searchParams.get("email") || "";
  const [email, setEmail] = useState(urlEmail);

  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [awaitingApproval, setAwaitingApproval] = useState(false);

  useEffect(() => {
    if (!email) {
      getPendingRegistrationEmailAction().then((pendingEmail) => {
        if (pendingEmail) {
          setEmail(pendingEmail);
        }
      });
    }
  }, [email]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (code.length !== 6) {
      toast.warning(t("auth.verifyEmail.invalidOtp"));
      setIsSubmitting(false);
      return;
    }

    try {
      const pendingPhoto = typeof window !== "undefined" ? sessionStorage.getItem("hc_pending_photo") || undefined : undefined;
      const res = await verifyEmailOtpAction(email, code, pendingPhoto);
      if (res.success && res.member) {
        if (typeof window !== "undefined") {
          try {
            sessionStorage.removeItem("hc_pending_photo");
          } catch {
            // ignore
          }
        }

        // Sync local storage session
        localStorage.setItem("hc_current_user", JSON.stringify(res.member));
        
        toast.success(t("auth.verifyEmail.successTitle"));
        
        if (res.requiresPayment) {
          router.push(`/register/payment?memberId=${res.member.id}`);
        } else if (res.member.status === "pending_approval") {
          setAwaitingApproval(true);
        } else {
          router.push("/dashboard");
        }
      } else {
        const errMsg = res.message || t("auth.verifyEmail.resendError");
        toast.error(errMsg);
      }
    } catch {
      toast.error(t("auth.login.serverError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (awaitingApproval) {
    return (
      <Card className="w-full max-w-md border border-border shadow-xl bg-background/80 backdrop-blur text-center p-8 space-y-6">
        <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center border border-emerald-100 dark:border-emerald-900">
          <ShieldCheck className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="space-y-2">
          <CardTitle className="font-heading text-2xl font-bold text-secondary dark:text-white">
            {t("auth.verifyEmail.successTitle")}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground pt-1 leading-relaxed">
            {t("auth.verifyEmail.successDesc")}
          </CardDescription>
        </div>
        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl text-left border border-border text-xs text-muted-foreground space-y-2 leading-relaxed">
          <p className="font-semibold text-secondary dark:text-white text-center text-sm mb-1">{t("auth.verifyEmail.nextStepsTitle")}</p>
          <p>{t("auth.verifyEmail.step1")}</p>
          <p>{t("auth.verifyEmail.step2")}</p>
          <p>{t("auth.verifyEmail.step3")}</p>
        </div>
        <Link
          href="/"
          className={buttonVariants({
            className: "w-full",
          })}
        >
          <span>{t("auth.verifyEmail.backHome")}</span>
        </Link>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md border border-border shadow-xl bg-background/80 backdrop-blur">
      <CardHeader className="text-center space-y-2">
        <Link href="/" className="flex items-center justify-center space-x-2 text-primary mx-auto">
          <Heart className="h-7 w-7 fill-primary" />
          <span className="font-heading text-2xl font-bold text-secondary dark:text-white">
            {t("layout.header.health")} <span className="text-primary">{t("layout.header.club")}</span>
          </span>
        </Link>
        <CardTitle className="font-heading text-xl font-bold text-secondary dark:text-white pt-2">
          {t("auth.verifyEmail.title")}
        </CardTitle>
        <CardDescription>
          {t("auth.verifyEmail.subtitle").replace("{email}", email)}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="verification-code" className="text-xs font-semibold text-secondary dark:text-white cursor-pointer">
              {t("auth.verifyEmail.otpLabel")}
            </label>
            <Input
              id="verification-code"
              type="text"
              required
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="123456"
              className="text-center text-xl tracking-[0.75em] font-mono h-12 border-border bg-background"
            />
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting || code.length !== 6}
            className="w-full"
          >
            <ShieldCheck className="h-4 w-4" />
            {isSubmitting ? (
              <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              t("auth.verifyEmail.verifyButton")
            )}
          </Button>
        </form>

        <div className="space-y-3 text-center text-sm text-muted-foreground border-t border-border pt-4">
          <div>
            {t("auth.verifyEmail.noCode")}{" "}
            <button 
              type="button"
              disabled={isSubmitting}
              onClick={async () => {
                try {
                  const res = await resendVerificationCodeAction(email);
                  if (res.success) {
                    toast.success(res.message || t("auth.verifyEmail.resendSuccess"));
                  } else {
                    toast.error(res.message || t("auth.verifyEmail.resendError"));
                  }
                } catch {
                  toast.error(t("auth.verifyEmail.resendError"));
                }
              }}
              className="text-primary hover:underline font-medium disabled:opacity-50 cursor-pointer inline-block"
            >
              {t("auth.verifyEmail.resendCode")}
            </button>
          </div>

          <div className="text-xs text-muted-foreground pt-1">
            {t("auth.verifyEmail.wrongEmailPrompt")}{" "}
            <Link href="/register" className="text-primary hover:underline font-semibold">
              {t("auth.verifyEmail.reRegisterLink")}
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function VerifyEmailSkeleton() {
  return (
    <Card className="w-full max-w-md border border-border shadow-xl bg-background/80 backdrop-blur rounded-3xl animate-pulse">
      <CardHeader className="text-center space-y-3 pb-6">
        <Skeleton className="h-8 w-32 mx-auto rounded-lg" />
        <Skeleton className="h-6 w-44 mx-auto" />
        <Skeleton className="h-4 w-60 mx-auto" />
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-3.5 w-36" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
        <Skeleton className="h-11 w-full rounded-xl mt-4" />
        <div className="text-center border-t border-border pt-4">
          <Skeleton className="h-4 w-32 mx-auto" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="bg-muted/30 min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<VerifyEmailSkeleton />}>
        <VerifyEmailForm />
      </Suspense>
    </div>
  );
}
