"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, User, Lock, AlertCircle, ArrowRight } from "lucide-react";
import { dbStore } from "@/services/dbStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginMemberAction } from "@/app/actions/dbActions";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!identifier || !password) {
      setError("মোবাইল নম্বর/ইমেইল এবং পাসওয়ার্ড দিন।");
      setLoading(false);
      return;
    }

    if (identifier === "healthclubfeni@gmail.com") {
      setError("এডমিন লগইন করতে /login/admin এ যান।");
      setLoading(false);
      return;
    }

    try {
      const member = await loginMemberAction(identifier, password);
      if (member) {
        if (member.status === "inactive" && !member.emailVerified) {
          setError("আপনার ইমেইল ভেরিফাই করা হয়নি। ভেরিফিকেশন পেজে পাঠানো হচ্ছে...");
          setTimeout(() => {
            router.push(`/register/verify-email?email=${encodeURIComponent(member.email)}`);
          }, 2000);
          return;
        }
        dbStore.setCurrentUser(member);
        router.push("/dashboard");
      } else {
        setError("ভুল মোবাইল নম্বর/ইমেইল অথবা পাসওয়ার্ড। অনুগ্রহ করে আবার চেষ্টা করুন।");
      }
    } catch {
      setError("সার্ভার ত্রুটি। অনুগ্রহ করে আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-primary-light/40 via-emerald-50/20 to-background dark:from-slate-950 dark:via-slate-900 dark:to-background">
      {/* Background orbs */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-primary/8 dark:bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-emerald-200/40 dark:bg-emerald-900/15 rounded-full blur-3xl pointer-events-none" />

      {/* Dot-grid */}
      <div
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #16a34a 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative w-full max-w-md">
        {/* Glass card */}
        <div className="relative bg-background/90 dark:bg-slate-900/90 backdrop-blur-xl border border-border/60 rounded-3xl shadow-2xl overflow-hidden">
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />

          <div className="p-8 sm:p-10">
            {/* Logo */}
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
                অ্যাকাউন্টে লগইন করুন
              </h1>
              <p className="text-sm text-muted-foreground mt-1.5">
                আপনার মেম্বার আইডি দেখতে এবং ড্যাশবোর্ড অ্যাক্সেস করতে লগইন করুন।
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 bg-destructive/8 text-destructive text-xs p-3.5 rounded-xl flex items-center gap-2.5 border border-destructive/15">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-secondary dark:text-white flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-primary" />
                  মোবাইল নম্বর বা ইমেইল
                </label>
                <Input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="যেমন: 01711112222 বা test@example.com"
                  className="border-border/60 bg-background dark:bg-slate-800/60 rounded-xl h-11 focus:border-primary/40"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-secondary dark:text-white flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-primary" />
                  পাসওয়ার্ড
                </label>
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="border-border/60 bg-background dark:bg-slate-800/60 rounded-xl h-11 focus:border-primary/40"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold rounded-xl h-11 btn-glow gap-2 mt-1"
              >
                {loading ? (
                  <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                ) : (
                  <>
                    লগইন করুন
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground border-t border-border/60 pt-5 mt-6">
              নতুন সদস্য হতে চান?{" "}
              <Link href="/register" className="text-primary hover:text-primary-dark font-semibold transition-colors">
                ফ্রি রেজিস্ট্রেশন করুন →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom trust badge */}
        <p className="text-center text-xs text-muted-foreground mt-5 flex items-center justify-center gap-1.5">
          <Heart className="h-3 w-3 fill-primary text-primary" />
          হেলথ ক্লাব — স্বাস্থ্য সেবা হোক সহজ ও সাশ্রয়ী
        </p>
      </div>
    </div>
  );
}
