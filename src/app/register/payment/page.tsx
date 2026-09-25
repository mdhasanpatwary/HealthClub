"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, AlertCircle, CheckCircle2, Copy, Check, Smartphone, User, ArrowLeft, Tag } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { submitBkashPaymentAction, getMemberForPaymentAction } from "@/app/actions/memberPaymentActions";
import { getPublicPaymentSettingsAction } from "@/app/actions/systemSettingsActions";
import type { PublicPaymentSettings } from "@/app/actions/systemSettingsActions";
import { Member } from "@/services/db";
import { Skeleton } from "@/components/ui/skeleton";
import { safeStorage } from "@/lib/safeStorage";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics";
import { toBanglaNums } from "@/lib/utils";

function PaymentForm() {
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
            toast.error("মেম্বার তথ্য পাওয়া যায়নি। অনুগ্রহ করে আবার নিবন্ধন করুন।");
          }
        } catch {
          if (isMounted) {
            if (cachedUser && cachedUser.id === targetMemberId) {
              setMember(cachedUser);
            } else {
              toast.error("সার্ভারে সমস্যা হয়েছে, কিছুক্ষণ পর আবার চেষ্টা করুন।");
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
  }, [paramMemberId]);

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(paymentSettings.bkashPersonal);
    setCopied(true);
    toast.success("কপি করা হয়েছে!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (!senderNumber || !transactionId) {
      toast.error("সবগুলো ঘর সঠিকভাবে পূরণ করুন।");
      return;
    }

    const cleanSender = senderNumber.trim();
    const bdPhoneRegex = /^(01)[3-9]\d{8}$/;
    if (!bdPhoneRegex.test(cleanSender)) {
      toast.error("সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন।");
      return;
    }

    const cleanTxnId = transactionId.trim().toUpperCase();
    if (cleanTxnId.length < 6 || cleanTxnId.length > 16) {
      toast.error("সঠিক বিকাশ ট্রানজেকশন আইডি দিন।");
      return;
    }

    if (!member?.id) {
      toast.error("মেম্বার তথ্য পাওয়া যায়নি। অনুগ্রহ করে আবার নিবন্ধন করুন।");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await submitBkashPaymentAction(member.id, cleanSender, cleanTxnId);

      if (res.success) {
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

        toast.success("পেমেন্ট তথ্য সফলভাবে জমা হয়েছে!");
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      } else {
        toast.error(res.error || "সার্ভারে সমস্যা হয়েছে, কিছুক্ষণ পর আবার চেষ্টা করুন।");
      }
    } catch {
      toast.error("সার্ভারে সমস্যা হয়েছে, কিছুক্ষণ পর আবার চেষ্টা করুন।");
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
        <CardTitle className="mt-4 text-secondary dark:text-white">মেম্বার তথ্য পাওয়া যায়নি</CardTitle>
        <CardDescription className="mt-2">মেম্বার তথ্য পাওয়া যায়নি। অনুগ্রহ করে আবার নিবন্ধন করুন।</CardDescription>
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/register"
            className={buttonVariants({
              variant: "outline",
              className: "w-full sm:w-auto",
            })}
          >
            আবার নিবন্ধন করুন
          </Link>
          <Link
            href="/login"
            className={buttonVariants({
              className: "w-full sm:w-auto",
            })}
          >
            লগইন করুন
          </Link>
        </div>
      </Card>
    );
  }

  const standardFee = Number(paymentSettings.premiumFee || "500");
  const discountAmount = member.discountAmount || 0;
  const netFee = Math.max(0, standardFee - discountAmount);
  const feeAmount = String(netFee);
  const displayFee = `৳${toBanglaNums(netFee)}`;

  return (
    <div className="w-full max-w-md space-y-4">
      {/* Back button */}
      <div className="flex items-center justify-between px-1">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>ড্যাশবোর্ডে ফিরে যান</span>
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
          <h1 className="font-heading text-xl font-bold">বিকাশ পেমেন্ট কনফার্মেশন</h1>
          <p className="text-xs text-pink-100">নির্ধারিত ফি পাঠিয়ে ট্রানজেকশন আইডি প্রদান করুন</p>
        </div>

        <CardContent className="p-6 space-y-6">
          {paymentSuccess ? (
            <div className="text-center py-8 space-y-4">
              <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto animate-bounce" />
              <h3 className="font-heading text-lg font-bold text-secondary dark:text-white">
                পেমেন্ট তথ্য সফলভাবে জমা হয়েছে!
              </h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
                আপনার পেমেন্ট তথ্য সফলভাবে গ্রহণ করা হয়েছে। অ্যাডমিন ভেরিফিকেশনের পর কার্ড সচল হবে।
              </p>
              <p className="text-xs text-primary font-semibold">ড্যাশবোর্ডে নিয়ে যাওয়া হচ্ছে...</p>
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

              {/* Reference Discount Breakdown Card */}
              {discountAmount > 0 && (
                <div className="p-3.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs space-y-1.5 shadow-xs">
                  <div className="flex items-center justify-between font-semibold text-emerald-800 dark:text-emerald-200">
                    <span className="flex items-center gap-1.5">
                      <Tag className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>রেফারেন্স ডিসকাউন্ট প্রযোজ্য</span>
                    </span>
                    {member.referenceCode && (
                      <span className="font-mono bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded text-[11px] font-bold">
                        {member.referenceCode}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between text-[11px] text-muted-foreground pt-1 border-t border-emerald-200/60 dark:border-emerald-800/40">
                    <span>নির্ধারিত বার্ষিক ফি: ৳{toBanglaNums(standardFee)}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                      ছাড়: -৳{toBanglaNums(discountAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold text-secondary dark:text-white pt-1">
                    <span>সর্বমোট প্রদেয় ফি:</span>
                    <span className="text-emerald-700 dark:text-emerald-300 font-extrabold text-sm font-mono">
                      {displayFee}
                    </span>
                  </div>
                </div>
              )}

              {/* Steps & Instructions */}
              <div className="space-y-4">
                <div className="bg-[#e2125d]/5 border border-[#e2125d]/20 rounded-xl p-4 space-y-3">
                  <h4 className="font-bold text-sm text-[#e2125d] font-heading flex items-center gap-1.5">
                    ১. Send Money করুন
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    নিচের বিকাশ নম্বরে ৳{toBanglaNums(Number(feeAmount))} Send Money করুন:
                  </p>
                  
                  {/* Dynamic bKash Personal Number */}
                  <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-border p-2.5 rounded-xl shadow-xs">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] text-muted-foreground font-semibold">
                        বিকাশ পার্সোনাল নম্বর
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
                    <span className="text-muted-foreground">প্রদেয় ফি:</span>
                    <span className="font-extrabold text-secondary dark:text-white font-mono text-sm">
                      {displayFee} <span className="text-[11px] font-normal text-muted-foreground">(বাৎসরিক)</span>
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
                    ২. পেমেন্ট তথ্য প্রদান করুন
                  </h4>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="bkash-sender-number"
                      className="text-xs font-semibold text-secondary dark:text-white flex items-center gap-1 cursor-pointer"
                    >
                      যে নম্বর থেকে পাঠিয়েছেন
                    </label>
                    <Input
                      id="bkash-sender-number"
                      type="tel"
                      required
                      value={senderNumber}
                      onChange={(e) => setSenderNumber(e.target.value.replace(/\D/g, ""))}
                      placeholder="01XXXXXXXXX"
                      className="border-border bg-background h-10 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="bkash-txn-id"
                      className="text-xs font-semibold text-secondary dark:text-white flex items-center gap-1 cursor-pointer"
                    >
                      বিকাশ ট্রানজেকশন আইডি (TxnID)
                    </label>
                    <Input
                      id="bkash-txn-id"
                      type="text"
                      required
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder="যেমন: 9J7A6B..."
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
                      {isSubmitting ? "যাচাই করা হচ্ছে..." : "পেমেন্ট নিশ্চিত করুন"}
                    </Button>

                    <Link
                      href="/dashboard"
                      className={buttonVariants({
                        variant: "outline",
                        size: "lg",
                        className: "w-full text-muted-foreground cursor-pointer",
                      })}
                    >
                      <span>পরে পেমেন্ট করব (ড্যাশবোর্ডে যান)</span>
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
