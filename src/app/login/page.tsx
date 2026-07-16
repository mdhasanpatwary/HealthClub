"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, User, Lock, AlertCircle } from "lucide-react";
import { dbStore } from "@/services/dbStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { loginMemberAction } from "@/app/actions/dbActions";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!identifier || !password) {
      setError("মোবাইল নম্বর/ইমেইল এবং পাসওয়ার্ড দিন।");
      return;
    }

    // Prevent Admin login on this page and prompt to use the admin login page
    if (identifier === "healthclubfeni@gmail.com") {
      setError("এডমিন লগইন করতে /login/admin এ যান।");
      return;
    }

    try {
      const member = await loginMemberAction(identifier, password);
      if (member) {
        if (member.status === "inactive" && !member.emailVerified) {
          setError("আপনার ইমেইল ভেরিফাই করা হয়নি। ভেরিফিকেশন পেজে পাঠানো হচ্ছে...");
          setTimeout(() => {
            router.push(`/register/verify-email?email=${encodeURIComponent(member.email)}`);
          }, 2000);
          return;
        }

        dbStore.setCurrentUser(member);
        router.push("/dashboard");
      } else {
        setError("ভুল মোবাইল নম্বর/ইমেইল অথবা পাসওয়ার্ড। অনুগ্রহ করে আবার চেষ্টা করুন।");
      }
    } catch {
      setError("সার্ভার ত্রুটি। অনুগ্রহ করে আবার চেষ্টা করুন।");
    }
  };

  return (
    <div className="bg-muted/30 min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md border border-border shadow-xl bg-background/80 backdrop-blur">
        
        <CardHeader className="text-center space-y-2">
          <Link href="/" className="flex items-center justify-center space-x-2 text-primary mx-auto">
            <Heart className="h-7 w-7 fill-primary" />
            <span className="font-heading text-2xl font-bold text-secondary">
              হেলথ <span className="text-primary">ক্লাব</span>
            </span>
          </Link>
          <CardTitle className="font-heading text-xl font-bold text-secondary pt-2">
            অ্যাকাউন্টে লগইন করুন
          </CardTitle>
          <CardDescription>
            আপনার মেম্বার আইডি দেখতে এবং ড্যাশবোর্ড অ্যাক্সেস করতে লগইন করুন।
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <div className="bg-destructive/10 text-destructive text-xs p-3 rounded-lg flex items-center gap-2 border border-destructive/20">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            
            <div className="space-y-2">
              <label className="text-xs font-semibold text-secondary flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-primary" />
                মোবাইল নম্বর বা ইমেইল
              </label>
              <Input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="যেমন: 01711112222 বা test@example.com"
                className="border-border bg-background"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-secondary flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-primary" />
                পাসওয়ার্ড
              </label>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="border-border bg-background"
              />
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-semibold">
              লগইন করুন
            </Button>

          </form>



          <div className="text-center text-sm text-muted-foreground border-t border-border pt-4">
            নতুন সদস্য হতে চান?{" "}
            <Link href="/register" className="text-primary hover:underline font-semibold">
              ফ্রি রেজিস্ট্রেশন করুন
            </Link>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
