"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Mail, AlertCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { requestPasswordResetAction } from "@/app/actions/memberActions";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email) {
      setError("অনুগ্রহ করে আপনার নিবন্ধিত ইমেইল অ্যাড্রেসটি লিখুন।");
      setLoading(false);
      return;
    }

    try {
      const res = await requestPasswordResetAction(email);
      if (res.success) {
        toast.success(res.message);
        router.push(`/forgot-password/reset?email=${encodeURIComponent(email)}`);
      } else {
        setError(res.message || "পাসওয়ার্ড রিসেট ওটিপি পাঠানো যায়নি।");
      }
    } catch {
      setError("সার্ভার ত্রুটি। অনুগ্রহ করে আবার চেষ্টা করুন।");
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
                  হেলথ <span className="gradient-text">ক্লাব</span>
                </span>
              </Link>
              <h1 className="font-heading text-xl font-bold text-secondary dark:text-white">
                পাসওয়ার্ড ভুলে গেছেন?
              </h1>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                আপনার মেম্বার অ্যাকাউন্টের নিবন্ধিত ইমেইল লিখুন। আমরা আপনাকে পাসওয়ার্ড পরিবর্তন করার জন্য ৬ সংখ্যার ভেরিফিকেশন ওটিপি পাঠাব।
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-5 bg-destructive/8 text-destructive text-xs p-3.5 rounded-xl flex items-center gap-2.5 border border-destructive/15">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-secondary dark:text-white flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-primary" />
                  নিবন্ধিত ইমেইল অ্যাড্রেস
                </label>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="যেমন: name@domain.com"
                  className="border-border/60 bg-background dark:bg-slate-800/60 rounded-xl h-11 focus:border-primary/40"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold rounded-xl h-11 btn-glow gap-2"
              >
                {loading ? (
                  <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                ) : (
                  <>
                    ওটিপি কোড পাঠান
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                লগইন পেজে ফিরে যান
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
