"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Heart, Lock, ShieldCheck, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { resetPasswordAction } from "@/app/actions/memberPasswordResetActions";
import { resetPartnerPasswordAction } from "@/app/actions/partnerActions";
import { toast } from "sonner";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const isPartner = searchParams.get("type") === "partner";

  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (code.length !== 6) {
      toast.warning("সঠিক ৬ সংখ্যার ওটিপি কোড দিন");
      setIsSubmitting(false);
      return;
    }

    if (newPassword.length < 6) {
      toast.warning("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে");
      setIsSubmitting(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.warning("পাসওয়ার্ড মেলেনি");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = isPartner
        ? await resetPartnerPasswordAction(email, code, newPassword)
        : await resetPasswordAction(email, code, newPassword);

      if (res.success) {
        toast.success(res.message);
        router.push(isPartner ? "/login/partner" : "/login");
      } else {
        const errMsg = res.message || "সার্ভারে সমস্যা হয়েছে, কিছুক্ষণ পর আবার চেষ্টা করুন।";
        toast.error(errMsg);
      }
    } catch {
      toast.error("সার্ভারে সমস্যা হয়েছে, কিছুক্ষণ পর আবার চেষ্টা করুন।");
    } finally {
      setIsSubmitting(false);
    }
  };

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
          নতুন পাসওয়ার্ড সেট করুন
        </CardTitle>
        <CardDescription>
          {email ? `${email}-এ পাঠানো ওটিপি কোড এবং নতুন পাসওয়ার্ড দিন` : "আপনার ইমেইলে পাঠানো ওটিপি কোড এবং নতুন পাসওয়ার্ড দিন"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={handleReset} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="reset-code" className="text-xs font-semibold text-secondary dark:text-white cursor-pointer">
              ৬ সংখ্যার ওটিপি (OTP)
            </label>
            <Input
              id="reset-code"
              type="text"
              required
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="123456"
              className="text-center text-xl tracking-[0.75em] font-mono h-12 border-border bg-background"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="reset-new-password" className="text-xs font-semibold text-secondary dark:text-white flex items-center gap-1 cursor-pointer">
              <Lock className="h-3.5 w-3.5 text-primary" />
              নতুন পাসওয়ার্ড
            </label>
            <Input
              id="reset-new-password"
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="border-border bg-background focus:border-primary/40 h-11"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="reset-confirm-password" className="text-xs font-semibold text-secondary dark:text-white flex items-center gap-1 cursor-pointer">
              <Lock className="h-3.5 w-3.5 text-primary" />
              পাসওয়ার্ড নিশ্চিত করুন
            </label>
            <Input
              id="reset-confirm-password"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="border-border bg-background focus:border-primary/40 h-11"
            />
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting || code.length !== 6 || !newPassword || !confirmPassword}
            size="lg"
            className="w-full mt-2"
          >
            <ShieldCheck className="h-4 w-4" />
            {isSubmitting ? (
              <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              "পাসওয়ার্ড পরিবর্তন করুন"
            )}
          </Button>
        </form>

        <div className="text-center border-t border-border pt-4">
          <Link
            href={isPartner ? "/login/partner" : "/login"}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            লগইনে ফিরে যান
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function ResetPasswordSkeleton() {
  return (
    <Card className="w-full max-w-md border border-border shadow-xl bg-background/80 backdrop-blur rounded-3xl animate-pulse">
      <CardHeader className="text-center space-y-3 pb-6">
        <Skeleton className="h-8 w-32 mx-auto rounded-lg" />
        <Skeleton className="h-6 w-44 mx-auto" />
        <Skeleton className="h-4 w-60 mx-auto" />
      </CardHeader>
      <CardContent className="p-6 sm:p-8 space-y-5">
        <div className="space-y-2">
          <Skeleton className="h-3.5 w-36" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3.5 w-36" />
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>
        <Skeleton className="h-11 w-full rounded-xl mt-4" />
        <div className="text-center border-t border-border pt-4">
          <Skeleton className="h-4 w-36 mx-auto" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="bg-muted/30 min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<ResetPasswordSkeleton />}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
