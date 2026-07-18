"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Heart, ShieldCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { verifyEmailOtpAction, resendVerificationCodeAction } from "@/app/actions/memberActions";
import { toast } from "sonner";

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [awaitingApproval, setAwaitingApproval] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (code.length !== 6) {
      setError("অনুগ্রহ করে ৬ সংখ্যার সঠিক ভেরিফিকেশন কোডটি দিন।");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await verifyEmailOtpAction(email, code);
      if (res.success && res.member) {
        // Sync local storage session
        localStorage.setItem("hc_current_user", JSON.stringify(res.member));
        
        toast.success("ইমেইল সফলভাবে ভেরিফাই করা হয়েছে!");
        
        if (res.requiresPayment) {
          router.push(`/register/payment?memberId=${res.member.id}`);
        } else if (res.member.status === "pending_approval") {
          setAwaitingApproval(true);
        } else {
          router.push("/dashboard");
        }
      } else {
        setError(res.message || "ভেরিফিকেশন সম্পন্ন করা যায়নি।");
      }
    } catch {
      setError("সার্ভার ত্রুটি। অনুগ্রহ করে আবার চেষ্টা করুন।");
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
            রেজিস্ট্রেশন সম্পূর্ণ হয়েছে!
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground pt-1 leading-relaxed">
            আপনার ইমেইল ভেরিফিকেশন সফলভাবে সম্পন্ন হয়েছে। আপনার মেম্বারশিপ অ্যাকাউন্টটি বর্তমানে <strong>এডমিন অনুমোদনের জন্য অপেক্ষমাণ</strong> রয়েছে।
          </CardDescription>
        </div>
        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl text-left border border-border text-xs text-muted-foreground space-y-2 leading-relaxed">
          <p className="font-semibold text-secondary dark:text-white text-center text-sm mb-1">পরবর্তী ধাপসমূহ:</p>
          <p>১. হেলথ ক্লাব এডমিন আপনার তথ্য যাচাই করবেন।</p>
          <p>২. অ্যাকাউন্ট অনুমোদিত হওয়ার পর আপনার ফোনে/ইমেইলে নিশ্চিতকরণ বার্তা পাঠানো হবে।</p>
          <p>৩. এরপর আপনি আপনার মেম্বার আইডি এবং পাসওয়ার্ড দিয়ে লগইন করে ড্যাশবোর্ড ও মেম্বারশিপ কার্ড ব্যবহার করতে পারবেন।</p>
        </div>
        <Link href="/" className="block">
          <Button className="w-full bg-primary hover:bg-primary-dark text-white font-semibold">
            হোমপেজে ফিরে যান
          </Button>
        </Link>
      </Card>
    );
  }

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
          ইমেইল ভেরিফিকেশন
        </CardTitle>
        <CardDescription>
          আপনার নিবন্ধিত ইমেইল <span className="font-semibold text-secondary">{email}</span> এ পাঠানো ৬-সংখ্যার কোডটি লিখুন।
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {error && (
          <div className="bg-destructive/10 text-destructive text-xs p-3 rounded-lg border border-destructive/20 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-4">
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

          <Button 
            type="submit" 
            disabled={isSubmitting || code.length !== 6}
            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold gap-2"
          >
            <ShieldCheck className="h-4 w-4" />
            {isSubmitting ? "যাচাই করা হচ্ছে..." : "কোড যাচাই করুন"}
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground border-t border-border pt-4">
          কোড পাননি?{" "}
          <button 
            disabled={isSubmitting}
            onClick={async () => {
              if (!email) return;
              try {
                const res = await resendVerificationCodeAction(email);
                if (res.success) {
                  toast.success(res.message);
                } else {
                  toast.error(res.message);
                }
              } catch {
                toast.error("কোড পুনরায় পাঠাতে সমস্যা হয়েছে।");
              }
            }}
            className="text-primary hover:underline font-semibold bg-transparent border-0 cursor-pointer disabled:opacity-50"
          >
            পুনরায় কোড পাঠান
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="bg-muted/30 min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={
        <div className="text-center py-12 text-muted-foreground">
          লোড হচ্ছে...
        </div>
      }>
        <VerifyEmailForm />
      </Suspense>
    </div>
  );
}
