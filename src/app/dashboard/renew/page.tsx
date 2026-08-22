"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, CheckCircle2, Copy, Check, Smartphone, ArrowLeft, Heart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle, CardDescription, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { requestRenewalAction } from "@/app/actions/memberActions";
import { dbStore } from "@/services/dbStore";
import { Member } from "@/services/db";
import { toast } from "sonner";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { Skeleton } from "@/components/ui/skeleton";

export default function RenewalPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Form states
  const [senderNumber, setSenderNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [profession, setProfession] = useState("");
  const [copied, setCopied] = useState(false);

  const bkashNumber = "01886763849";

  useEffect(() => {
    let isMounted = true;

    Promise.resolve().then(async () => {
      if (!isMounted) return;

      const currentUser = dbStore.getCurrentUser();
      if (!currentUser) {
        router.push("/login");
        return;
      }
      
      // Set cached user immediately
      setMember(currentUser);
      setProfession(currentUser.profession || "");

      try {
        const freshUser = await dbStore.getMemberById(currentUser.id);
        if (!isMounted) return;
        const activeUser = freshUser || currentUser;
        setMember(activeUser);
        setProfession(activeUser.profession || "");
      } catch {
        // Fallback to existing cached member state silently
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, [router]);

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(bkashNumber);
    setCopied(true);
    toast.success(t("dashboard.renew.toastCopy"));
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRenewalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!senderNumber || !transactionId) {
      toast.error(t("dashboard.renew.errorAllFields"));
      return;
    }

    const cleanSender = senderNumber.trim();
    const bdPhoneRegex = /^(01)[3-9]\d{8}$/;
    if (!bdPhoneRegex.test(cleanSender)) {
      toast.error(t("dashboard.renew.errorPhone"));
      return;
    }

    const cleanTxnId = transactionId.trim().toUpperCase();
    if (cleanTxnId.length < 6 || cleanTxnId.length > 16) {
      toast.error(t("dashboard.renew.errorTxn"));
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await requestRenewalAction(cleanSender, cleanTxnId, profession || undefined);
      if (res.success) {
        setPaymentSuccess(true);
        if (member) {
          const updatedUser = {
            ...member,
            renewalStatus: "pending",
            renewalBkashSender: cleanSender,
            renewalBkashTxnId: cleanTxnId,
            profession: profession || member.profession,
          };
          dbStore.setCurrentUser(updatedUser);
        }
        toast.success(res.message);
        setTimeout(() => {
          router.push("/dashboard");
        }, 3000);
      } else {
        toast.error(res.message || t("dashboard.renew.errorFailed"));
      }
    } catch {
      toast.error(t("dashboard.renew.errorServerError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !member) {
    return (
      <div className="bg-muted/30 min-h-[85vh] py-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl space-y-5">
          <Skeleton className="h-4 w-32" />
          <Card className="border border-border shadow-xl bg-background/80 backdrop-blur rounded-3xl animate-pulse">
            <CardHeader className="text-center space-y-3 pb-6 border-b border-border/60">
              <Skeleton className="h-8 w-32 mx-auto rounded-lg" />
              <Skeleton className="h-6 w-44 mx-auto" />
              <Skeleton className="h-4 w-60 mx-auto" />
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="bg-[#e2125d]/5 rounded-2xl p-5 border border-[#e2125d]/10 space-y-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-9 w-9 rounded-lg" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                </div>
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-3.5 w-28" />
                  <Skeleton className="h-11 w-full rounded-md" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3.5 w-36" />
                  <Skeleton className="h-11 w-full rounded-md" />
                </div>
                <Skeleton className="h-11 w-full rounded-xl mt-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-muted/30 min-h-[85vh] py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl">
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary mb-5 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
          {t("dashboard.renew.backToDashboard")}
        </Link>

        <Card className="border border-border shadow-xl bg-background/80 backdrop-blur">
          <CardHeader className="text-center space-y-2 pb-6 border-b border-border/60">
            <div className="flex items-center justify-center space-x-2 text-primary mx-auto">
              <Heart className="h-7 w-7 fill-primary" />
              <span className="font-heading text-2xl font-bold text-secondary">
                {t("layout.footer.health")} <span className="text-primary">{t("layout.footer.club")}</span>
              </span>
            </div>
            <CardTitle className="font-heading text-xl font-bold text-secondary">
              {t("dashboard.renew.title")}
            </CardTitle>
            <CardDescription>
              {t("dashboard.renew.description")}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6 space-y-6">
            {paymentSuccess ? (
              <div className="text-center py-8 space-y-4 animate-in fade-in duration-300">
                <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h3 className="font-heading text-lg font-bold text-secondary dark:text-white">{t("dashboard.renew.successTitle")}</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  {t("dashboard.renew.successDesc")}
                </p>
                <p className="text-xs text-primary font-semibold">{t("dashboard.renew.redirecting")}</p>
              </div>
            ) : (
              <>
                {/* bkash steps */}
                <div className="bg-[#e2125d]/5 rounded-2xl p-5 border border-[#e2125d]/10 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 bg-[#e2125d] text-white rounded-lg flex items-center justify-center font-bold shadow-md">
                      bKash
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#e2125d]">{t("dashboard.renew.bkashTitle")}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{t("dashboard.renew.bkashSubtitle")}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-inner">
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-slate-400 tracking-wider font-mono">BKASH PERSONAL NUMBER</p>
                      <p className="text-sm font-extrabold text-secondary dark:text-white font-mono">{bkashNumber}</p>
                    </div>
                    <Button
                      type="button"
                      onClick={handleCopyNumber}
                      variant="ghost"
                      size="sm"
                      aria-label="Copy bKash personal number"
                      className="hover:bg-slate-100 text-xs cursor-pointer"
                    >
                      {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
                      {copied ? t("dashboard.renew.copied") : t("dashboard.renew.copy")}
                    </Button>
                  </div>

                  <div className="text-xs text-muted-foreground space-y-1.5 pl-1.5 border-l-2 border-[#e2125d]/20">
                    <p>{t("dashboard.renew.step1")}</p>
                    <p>{t("dashboard.renew.step2")}</p>
                    <p>{t("dashboard.renew.step3")}</p>
                  </div>
                </div>

                {/* Form inputs */}
                <form onSubmit={handleRenewalSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="renew-sender" className="text-xs font-semibold text-secondary flex items-center gap-1.5 cursor-pointer">
                      <Smartphone className="h-3.5 w-3.5 text-primary" />
                      {t("dashboard.renew.senderLabel")}
                    </label>
                    <Input
                      id="renew-sender"
                      type="text"
                      required
                      value={senderNumber}
                      onChange={(e) => setSenderNumber(e.target.value)}
                      placeholder={t("landing.contactform.eg017xxxxxxxx")}
                      className="h-11 border-border bg-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="renew-txn" className="text-xs font-semibold text-secondary flex items-center gap-1.5 cursor-pointer">
                      <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                      {t("dashboard.renew.txnLabel")}
                    </label>
                    <Input
                      id="renew-txn"
                      type="text"
                      required
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder={t("dashboard.renew.txnPlaceholder") || "e.g., BGA678UHG"}
                      className="h-11 border-border bg-background font-mono uppercase"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="renew-profession" className="text-xs font-semibold text-secondary flex items-center gap-1.5 cursor-pointer">
                      <User className="h-3.5 w-3.5 text-primary" />
                      {t("dashboard.renew.professionLabel")}
                    </label>
                    <Input
                      id="renew-profession"
                      type="text"
                      value={profession}
                      onChange={(e) => setProfession(e.target.value)}
                      placeholder={t("dashboard.renew.professionPlaceholder")}
                      className="h-11 border-border bg-background"
                    />
                  </div>

                  <Button type="submit" disabled={isSubmitting} size="lg" className="w-full active:scale-[0.99] cursor-pointer">
                    {isSubmitting ? t("dashboard.renew.submittingButton") : t("dashboard.renew.submitButton")}
                  </Button>
                </form>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
