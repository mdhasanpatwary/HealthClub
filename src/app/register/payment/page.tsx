"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, AlertCircle, CheckCircle2, Copy, Check, Smartphone } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { submitBkashPaymentAction, getMemberByIdAction } from "@/app/actions/memberActions";
import { Member } from "@/services/db";
import { Skeleton } from "@/components/ui/skeleton";
import { safeStorage } from "@/lib/safeStorage";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics";
import { useLanguage } from "@/components/layout/LanguageProvider";

function PaymentForm() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const memberId = searchParams.get("memberId") || "";

  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Form states
  const [senderNumber, setSenderNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [copied, setCopied] = useState(false);

  const bkashNumber = "01886763849";

  useEffect(() => {
    let isMounted = true;

    Promise.resolve().then(async () => {
      if (!isMounted) return;

      if (memberId) {
        try {
          const m = await getMemberByIdAction(memberId);
          if (!isMounted) return;
          if (m) {
            setMember(m);
          } else {
            toast.error(t("auth.payment.notFoundDesc"));
          }
        } catch {
          if (isMounted) {
            toast.error(t("auth.login.serverError"));
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
  }, [memberId, t]);

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(bkashNumber);
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

    setIsSubmitting(true);

    try {
      if (!member) return;
      const success = await submitBkashPaymentAction(member.id, cleanSender, cleanTxnId);
      
      if (success) {
        setPaymentSuccess(true);
        trackEvent("membership_funnel", {
          step: "payment_submit",
          tier: member.tier,
        });
        // Sync local storage user state
        const updatedUser = { 
          ...member, 
          status: "pending_approval" as const,
          bkashSender: cleanSender,
          bkashTxnId: cleanTxnId
        };
        safeStorage.setItem("hc_current_user", updatedUser);
        window.dispatchEvent(new Event("auth-change"));
        
        toast.success(t("auth.payment.successTitle"));
        setTimeout(() => {
          router.push("/");
        }, 3000);
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
        <Link href="/register" className="mt-4 inline-block">
          <Button variant="outline">{t("auth.payment.tryAgain")}</Button>
        </Link>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md border border-border shadow-xl bg-background/80 backdrop-blur overflow-hidden">
      {/* bKash Themed Header */}
      <div className="bg-[#e2125d] text-white p-6 text-center space-y-2 relative">
        <div className="absolute top-3 left-3 bg-white/10 px-2 py-0.5 rounded-full text-[10px] uppercase font-mono tracking-wider">
          Offline Mode
        </div>
        <Smartphone className="h-12 w-12 mx-auto animate-pulse" />
        <h2 className="font-heading text-xl font-bold">{t("auth.payment.title")}</h2>
        <p className="text-xs text-pink-100">{t("auth.payment.subtitle")}</p>
      </div>

      <CardContent className="p-6 space-y-6">
        {paymentSuccess ? (
          <div className="text-center py-8 space-y-4">
            <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto animate-bounce" />
            <h3 className="font-heading text-lg font-bold text-secondary dark:text-white">{t("auth.payment.successTitle")}</h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
              {t("auth.payment.successDesc")}
            </p>
            <p className="text-xs text-primary font-semibold">{t("auth.payment.redirecting")}</p>
          </div>
        ) : (
          <>
            {/* Steps & Instructions */}
            <div className="space-y-4">
              <div className="bg-[#e2125d]/5 border border-[#e2125d]/20 rounded-xl p-4 space-y-3">
                <h4 className="font-bold text-sm text-[#e2125d] font-heading flex items-center gap-1.5">
                  {t("auth.payment.step1Title")}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t("auth.payment.step1Desc").replace("{amount}", "500")}
                </p>
                <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-border p-2.5 rounded-xl">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-muted-foreground">{t("auth.payment.bkashNumberLabel")}</span>
                    <span className="font-mono font-bold text-secondary dark:text-white">{bkashNumber}</span>
                  </div>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon-xs" 
                    onClick={handleCopyNumber}
                    aria-label="Copy bKash number"
                    className="cursor-pointer"
                  >
                    {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
                  </Button>
                </div>
                <div className="flex justify-between text-xs pt-1">
                  <span className="text-muted-foreground">{t("auth.payment.amountLabel")}</span>
                  <span className="font-bold text-secondary dark:text-white">{t("auth.payment.amountValue")}</span>
                </div>
              </div>

              {/* Form Input Section */}
              <form onSubmit={handleSubmitPayment} className="space-y-4">
                <h4 className="font-bold text-sm text-secondary dark:text-white font-heading border-b border-border pb-1">
                  {t("auth.payment.step2Title")}
                </h4>

                <div className="space-y-1.5">
                  <label htmlFor="bkash-sender-number" className="text-xs font-semibold text-secondary dark:text-white flex items-center gap-1 cursor-pointer">
                    {t("auth.payment.senderNumberLabel")}
                  </label>
                  <Input 
                    id="bkash-sender-number"
                    type="tel"
                    required
                    value={senderNumber}
                    onChange={(e) => setSenderNumber(e.target.value.replace(/\D/g, ""))}
                    placeholder={t("auth.payment.senderNumberPlaceholder")}
                    className="border-border bg-background"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="bkash-txn-id" className="text-xs font-semibold text-secondary dark:text-white flex items-center gap-1 cursor-pointer">
                    {t("auth.payment.txnIdLabel")}
                  </label>
                  <Input 
                    id="bkash-txn-id"
                    type="text"
                    required
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder={t("auth.payment.txnIdPlaceholder")}
                    className="border-border bg-background uppercase font-mono"
                  />
                </div>

                <div className="space-y-3 pt-2">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    size="lg"
                    className="w-full cursor-pointer"
                  >
                    <ShieldCheck className="h-5 w-5" />
                    {isSubmitting ? t("auth.payment.submitting") : t("auth.payment.submitButton")}
                  </Button>
                  
                  <Link
                    href="/"
                    className={buttonVariants({
                      variant: "outline",
                      size: "lg",
                      className: "w-full text-muted-foreground",
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
  );
}

function PaymentCardSkeleton() {
  return (
    <Card className="w-full max-w-md border border-border shadow-xl bg-background/80 backdrop-blur overflow-hidden rounded-3xl animate-pulse">
      <div className="bg-[#e2125d] p-6 text-center space-y-2">
        <Skeleton className="h-12 w-12 rounded-full mx-auto bg-white/20" />
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
