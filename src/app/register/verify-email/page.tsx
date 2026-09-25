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
import { toast } from "sonner";

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlEmail = searchParams.get("email") || "";
  const [email, setEmail] = useState(urlEmail);

  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [awaitingApproval, setAwaitingApproval] = useState(false);

  useEffect(() => {
    if (!email) {
      getPendingRegistrationEmailAction()
        .then((pendingEmail) => {
          if (pendingEmail) {
            setEmail(pendingEmail);
          }
        })
        .catch(() => {
          toast.error("সার্ভারে সমস্যা হয়েছে, কিছুক্ষণ পর আবার চেষ্টা করুন।");
        });
    }
  }, [email]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (code.length !== 6) {
      toast.warning("সঠিক ৬ সংখ্যার ওটিপি কোড দিন");
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
        
        toast.success("ইমেইল ভেরিফিকেশন সফল হয়েছে!");
        
        if (res.requiresPayment) {
          router.push(`/register/payment?memberId=${res.member.id}`);
        } else if (res.member.status === "pending_approval") {
          setAwaitingApproval(true);
        } else {
          router.push("/dashboard");
        }
      } else {
        const errMsg = res.message || "কোড পাঠানো সম্ভব হয়নি। আবার চেষ্টা করুন।";
        toast.error(errMsg);
      }
    } catch {
      toast.error("সার্ভারে সমস্যা হয়েছে, কিছুক্ষণ পর আবার চেষ্টা করুন।");
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
            ইমেইল ভেরিফিকেশন সফল হয়েছে!
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground pt-1 leading-relaxed">
            আপনার আবেদনটি সফলভাবে জমা হয়েছে। অ্যাডমিন পর্যালোচনার পর আপনার অ্যাকাউন্টটি সক্রিয় করা হবে।
          </CardDescription>
        </div>
        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl text-left border border-border text-xs text-muted-foreground space-y-2 leading-relaxed">
          <p className="font-semibold text-secondary dark:text-white text-center text-sm mb-1">পরবর্তী পদক্ষেপ:</p>
          <p>১. অ্যাডমিন আপনার তথ্য ও প্রেসক্রিপশন/কাগজপত্র যাচাই করবেন।</p>
          <p>২. মেম্বারশিপ অনুমোদিত হলে আপনাকে এসএমএস বা ইমেইলে জানানো হবে।</p>
          <p>৩. এরপর আপনি সরাসরি লগইন করে ডিজিটাল হেলথ কার্ড ব্যবহার করতে পারবেন।</p>
        </div>
        <Link
          href="/"
          className={buttonVariants({
            className: "w-full",
          })}
        >
          <span>হোমপেজে ফিরে যান</span>
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
            হেলথ <span className="text-primary">ক্লাব</span>
          </span>
        </Link>
        <CardTitle className="font-heading text-xl font-bold text-secondary dark:text-white pt-2">
          ইমেইল ওটিপি যাচাই
        </CardTitle>
        <CardDescription>
          {email ? `${email}-এ একটি ৬ সংখ্যার ওটিপি কোড পাঠানো হয়েছে।` : "আপনার ইমেইলে একটি ৬ সংখ্যার ওটিপি কোড পাঠানো হয়েছে।"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="verification-code" className="text-xs font-semibold text-secondary dark:text-white cursor-pointer">
              ৬ সংখ্যার ওটিপি (OTP)
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
              "ইমেইল যাচাই করুন"
            )}
          </Button>
        </form>

        <div className="space-y-3 text-center text-sm text-muted-foreground border-t border-border pt-4">
          <div>
            কোড পাননি?{" "}
            <button 
              type="button"
              disabled={isSubmitting}
              onClick={async () => {
                try {
                  const res = await resendVerificationCodeAction(email);
                  if (res.success) {
                    toast.success(res.message || "নতুন ওটিপি কোড পাঠানো হয়েছে।");
                  } else {
                    toast.error(res.message || "কোড পাঠানো সম্ভব হয়নি। আবার চেষ্টা করুন।");
                  }
                } catch {
                  toast.error("কোড পাঠানো সম্ভব হয়নি। আবার চেষ্টা করুন।");
                }
              }}
              className="text-primary hover:underline font-medium disabled:opacity-50 cursor-pointer inline-block"
            >
              নতুন কোড পাঠান
            </button>
          </div>

          <div className="text-xs text-muted-foreground pt-1">
            ভুল ইমেইল দিয়েছেন?{" "}
            <Link href="/register" className="text-primary hover:underline font-semibold">
              আবার নিবন্ধন করুন
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
