"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, AlertCircle, CheckCircle2, Copy, Check, Smartphone, User, ArrowLeft } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { submitBkashPaymentAction, getMemberForPaymentAction } from "@/app/actions/memberActions";
import { getPublicPaymentSettingsAction, PublicPaymentSettings } from "@/app/actions/systemSettingsActions";
import { Member } from "@/services/db";
import { Skeleton } from "@/components/ui/skeleton";
import { safeStorage } from "@/lib/safeStorage";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { formatNum } from "@/lib/i18n";

function PaymentForm() {
  const { t, locale } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramMemberId = searchParams.get("memberId") || "";

  const [member, setMember] = useState<Partial<Member> | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Dynamic payment settings from Admin
  const [paymentSettings, setPaymentSettings] = useState<PublicPaymentSettings>({
    bkashPersonal: "01886763849",
    bkashMerchant: "01886763849",
    premiumFee: "500",
    foundingFee: "0",
    paymentInstructions: "",
  });

  // Form states
  const [senderNumber, setSenderNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;

    Promise.resolve().then(async () => {
      if (!isMounted) return;

      // 1. Fetch dynamic settings
      try {
        const settings = await getPublicPaymentSettingsAction();
        if (isMounted && settings) {
          setPaymentSettings(settings);
        }
      } catch {
        // Fallback defaults remain
      }

      // 2. Resolve member ID (URL query param or local session)
      const cachedUser = safeStorage.getItem<Member | null>("hc_current_user", null);
      const targetMemberId = paramMemberId || cachedUser?.id || "";

      if (targetMemberId) {
        try {
          const m = await getMemberForPaymentAction(targetMemberId);
          if (!isMounted) return;
          if (m) {
            setMember(m as Partial<Member>);
            if (m.bkashSender) setSenderNumber(m.bkashSender);
            if (m.bkashTxnId) setTransactionId(m.bkashTxnId);
          } else if (cachedUser && cachedUser.id === targetMemberId) {
            setMember(cachedUser);
          } else {
            toast.error(t("auth.payment.notFoundDesc"));
          }
        } catch {
          if (isMounted) {
            if (cachedUser && cachedUser.id === targetMemberId) {
              setMember(cachedUser);
            } else {
              toast.error(t("auth.login.serverError"));
            }
          }
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      } else {
        if (isMounted) {
          setLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, [paramMemberId, t]);

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(paymentSettings.bkashPersonal);
    setCopied(true);
    toast.success(t("dashboard.card.copySuccess"));
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (!senderNumber || !transactionId) {
      toast.error(t("auth.login.fillAll"));
      return;
    }

    const cleanSender = senderNumber.trim();
    const bdPhoneRegex = /^(01)[3-9]\d{8}$/;
    if (!bdPhoneRegex.test(cleanSender)) {
      toast.error(t("auth.register.phoneLabel"));
      return;
    }

    const cleanTxnId = transactionId.trim().toUpperCase();
    if (cleanTxnId.length < 6 || cleanTxnId.length > 16) {
      toast.error(t("auth.payment.txnIdLabel"));
      return;
    }

    if (!member?.id) {
      toast.error(t("auth.payment.notFoundDesc"));
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await submitBkashPaymentAction(member.id, cleanSender, cleanTxnId);

      if (success) {
        setPaymentSuccess(true);
        trackEvent("membership_funnel", {
          step: "payment_submit",
          tier: member.tier || "premium",
        });

        // Sync local storage user state
        const updatedUser = {
          ...member,
          status: "pending_approval" as const,
          bkashSender: cleanSender,
          bkashTxnId: cleanTxnId,
        };
        safeStorage.setItem("hc_current_user", updatedUser);
        window.dispatchEvent(new Event("auth-change"));

        toast.success(t("auth.payment.successTitle"));
        setTimeout(() => {
          router.push("/dashboard");
        }, 2500);
      } else {
        toast.error(t("auth.login.serverError"));
      }
    } catch {
      toast.error(t("auth.login.serverError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <PaymentCardSkeleton />;
  }

  if (!member) {
    return (
      <Card className="w-full max-w-md border border-border shadow-xl text-center p-6 bg-background">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
        <CardTitle className="mt-4 text-secondary dark:text-white">{t("auth.payment.notFoundTitle")}</CardTitle>
        <CardDescription className="mt-2">{t("auth.payment.notFoundDesc")}</CardDescription>
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/register" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full">{t("auth.payment.tryAgain")}</Button>
          </Link>
          <Link href="/login" className="w-full sm:w-auto">
            <Button className="w-full">{t("auth.register.loginLink")}</Button>
          </Link>
        </div>
      </Card>
    );
  }

  const feeAmount = paymentSettings.premiumFee || "500";
  const displayFee = `৳${formatNum(Number(feeAmount), locale)}`;

  return (
    <div className="w-full max-w-md space-y-4">
      {/* Back button */}
      <div className="flex items-center justify-between px-1">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>{locale === "en" ? "Go to Dashboard" : "ড্যাশবোর্ডে ফিরে যান"}</span>
        </Link>
        {member.id && (
          <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
            {member.id}
          </span>
        )}
      </div>

      <Card className="w-full border border-border shadow-xl bg-background/80 backdrop-blur overflow-hidden">
        {/* bKash Themed Header */}
        <div className="bg-[#e2125d] text-white p-6 text-center space-y-2 relative">
          <div className="absolute top-3 left-3 bg-white/10 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-mono tracking-wider font-bold">
            Offline bKash
          </div>
          <Smartphone className="h-10 w-10 mx-auto animate-pulse" />
          <h1 className="font-heading text-xl font-bold">{t("auth.payment.title")}</h1>
          <p className="text-xs text-pink-100">{t("auth.payment.subtitle")}</p>
        </div>

        <CardContent className="p-6 space-y-6">
          {paymentSuccess ? (
            <div className="text-center py-8 space-y-4">
              <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto animate-bounce" />
              <h3 className="font-heading text-lg font-bold text-secondary dark:text-white">
                {t("auth.payment.successTitle")}
              </h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
                {t("auth.payment.successDesc")}
              </p>
              <p className="text-xs text-primary font-semibold">{t("auth.payment.redirecting")}</p>
            </div>
          ) : (
            <>
              {/* Member Brief Info Card */}
              {member.name && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-border text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                      <User className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <p className="font-bold text-secondary dark:text-white">{member.name}</p>
                      <p className="text-[11px] text-muted-foreground">{member.phone}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold text-[10px] uppercase tracking-wider">
                    {member.tier || "Premium"}
                  </span>
                </div>
              )}

              {/* Steps & Instructions */}
              <div className="space-y-4">
                <div className="bg-[#e2125d]/5 border border-[#e2125d]/20 rounded-xl p-4 space-y-3">
                  <h4 className="font-bold text-sm text-[#e2125d] font-heading flex items-center gap-1.5">
                    {t("auth.payment.step1Title")}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {t("auth.payment.step1Desc").replace("{amount}", formatNum(Number(feeAmount), locale))}
                  </p>
                  
                  {/* Dynamic bKash Personal Number */}
                  <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-border p-2.5 rounded-xl shadow-xs">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] text-muted-foreground font-semibold">
                        {t("auth.payment.bkashNumberLabel")}
                      </span>
                      <span className="font-mono font-extrabold text-sm text-secondary dark:text-white tracking-wide">
                        {paymentSettings.bkashPersonal}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      onClick={handleCopyNumber}
                      aria-label="Copy bKash number"
                      className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
                    </Button>
                  </div>

                  <div className="flex justify-between items-center text-xs pt-1 border-t border-[#e2125d]/10">
                    <span className="text-muted-foreground">{t("auth.payment.amountLabel")}</span>
                    <span className="font-extrabold text-secondary dark:text-white font-mono text-sm">
                      {displayFee} <span className="text-[11px] font-normal text-muted-foreground">({locale === "en" ? "Annual" : "বাৎসরিক"})</span>
                    </span>
                  </div>

                  {paymentSettings.paymentInstructions && (
                    <p className="text-[11px] text-[#e2125d] bg-[#e2125d]/10 p-2 rounded-lg leading-relaxed font-medium">
                      {paymentSettings.paymentInstructions}
                    </p>
                  )}
                </div>

                {/* Form Input Section */}
                <form onSubmit={handleSubmitPayment} className="space-y-4">
                  <h4 className="font-bold text-sm text-secondary dark:text-white font-heading border-b border-border pb-1">
                    {t("auth.payment.step2Title")}
                  </h4>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="bkash-sender-number"
                      className="text-xs font-semibold text-secondary dark:text-white flex items-center gap-1 cursor-pointer"
                    >
                      {t("auth.payment.senderNumberLabel")}
                    </label>
                    <Input
                      id="bkash-sender-number"
                      type="tel"
                      required
                      value={senderNumber}
                      onChange={(e) => setSenderNumber(e.target.value.replace(/\D/g, ""))}
                      placeholder={t("auth.payment.senderNumberPlaceholder")}
                      className="border-border bg-background h-10 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="bkash-txn-id"
                      className="text-xs font-semibold text-secondary dark:text-white flex items-center gap-1 cursor-pointer"
                    >
                      {t("auth.payment.txnIdLabel")}
                    </label>
                    <Input
                      id="bkash-txn-id"
                      type="text"
                      required
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder={t("auth.payment.txnIdPlaceholder")}
                      className="border-border bg-background uppercase font-mono h-10"
                    />
                  </div>

                  <div className="space-y-2.5 pt-2">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      size="lg"
                      className="w-full cursor-pointer font-bold"
                    >
                      <ShieldCheck className="h-5 w-5" />
                      {isSubmitting ? t("auth.payment.submitting") : t("auth.payment.submitButton")}
                    </Button>

                    <Link
                      href="/dashboard"
                      className={buttonVariants({
                        variant: "outline",
                        size: "lg",
                        className: "w-full text-muted-foreground cursor-pointer",
                      })}
                    >
                      <span>{t("auth.payment.skipLater")}</span>
                    </Link>
                  </div>
                </form>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function PaymentCardSkeleton() {
  return (
    <Card className="w-full max-w-md border border-border shadow-xl bg-background/80 backdrop-blur overflow-hidden rounded-3xl animate-pulse">
      <div className="bg-[#e2125d] p-6 text-center space-y-2">
        <Skeleton className="h-10 w-10 rounded-full mx-auto bg-white/20" />
        <Skeleton className="h-6 w-48 mx-auto bg-white/30" />
        <Skeleton className="h-3.5 w-36 mx-auto bg-white/20" />
      </div>
      <CardContent className="p-6 space-y-6">
        <div className="bg-[#e2125d]/5 border border-[#e2125d]/20 rounded-2xl p-4 space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-full" />
          <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-border p-2.5 rounded-xl">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-7 w-16 rounded-lg" />
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-4 w-36 border-b border-border pb-1" />
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-36" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
          <Skeleton className="h-11 w-full rounded-xl mt-4" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function PaymentPage() {
  return (
    <div className="bg-muted/30 min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<PaymentCardSkeleton />}>
        <PaymentForm />
      </Suspense>
    </div>
  );
}
