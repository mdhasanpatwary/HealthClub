"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Heart, Lock, ShieldCheck, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { resetPasswordAction } from "@/app/actions/memberActions";
import { toast } from "sonner";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (code.length !== 6) {
      setError("অনুগ্রহ করে ৬ সংখ্যার সঠিক ওটিপি কোডটি দিন।");
      setIsSubmitting(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে।");
      setIsSubmitting(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("নতুন পাসওয়ার্ড দুটি মেলেনি।");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await resetPasswordAction(email, code, newPassword);
      if (res.success) {
        toast.success(res.message);
        router.push("/login");
      } else {
        setError(res.message || "পাসওয়ার্ড পরিবর্তন করা যায়নি।");
      }
    } catch {
      setError("সার্ভার ত্রুটি। অনুগ্রহ করে আবার চেষ্টা করুন।");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md border border-border shadow-xl bg-background/80 backdrop-blur">
      <CardHeader className="text-center space-y-2">
        <Link href="/" className="flex items-center justify-center space-x-2 text-primary mx-auto">
          <Heart className="h-7 w-7 fill-primary" />
          <span className="font-heading text-2xl font-bold text-secondary">
            হেলথ <span className="text-primary">ক্লাব</span>
          </span>
        </Link>
        <CardTitle className="font-heading text-xl font-bold text-secondary pt-2">
          পাসওয়ার্ড রিসেট করুন
        </CardTitle>
        <CardDescription>
          ইমেইল <span className="font-semibold text-secondary">{email}</span> এ পাঠানো ওটিপি কোড এবং নতুন পাসওয়ার্ডটি দিন।
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {error && (
          <div className="bg-destructive/10 text-destructive text-xs p-3 rounded-lg border border-destructive/20 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-secondary">ভেরিফিকেশন কোড (OTP) *</label>
            <Input
              type="text"
              required
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="যেমন: ১২৩৪৫৬"
              className="text-center text-xl tracking-[0.75em] font-mono h-12 border-border bg-background"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-secondary flex items-center gap-1">
              <Lock className="h-3.5 w-3.5 text-primary" />
              নতুন পাসওয়ার্ড *
            </label>
            <Input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="অন্তত ৬ অক্ষরের পাসওয়ার্ড"
              className="border-border bg-background focus:border-primary/40 h-11"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-secondary flex items-center gap-1">
              <Lock className="h-3.5 w-3.5 text-primary" />
              নতুন পাসওয়ার্ড নিশ্চিত করুন *
            </label>
            <Input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="আবার টাইপ করুন"
              className="border-border bg-background focus:border-primary/40 h-11"
            />
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting || code.length !== 6 || !newPassword || !confirmPassword}
            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold gap-2 mt-2 h-11"
          >
            <ShieldCheck className="h-4 w-4" />
            {isSubmitting ? "রিসেট করা হচ্ছে..." : "পাসওয়ার্ড সংরক্ষণ করুন"}
          </Button>
        </form>

        <div className="text-center border-t border-border pt-4">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            লগইন পেজে ফিরে যান
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="bg-muted/30 min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={
        <div className="text-center py-12 text-muted-foreground">
          লোড হচ্ছে...
        </div>
      }>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
