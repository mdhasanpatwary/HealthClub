"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Lock, Building2 } from "lucide-react";
import { dbStore } from "@/services/dbStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { loginPartnerAction } from "@/app/actions/partnerActions";
import { toast } from "sonner";

export default function PartnerLoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePartnerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!identifier || !password) {
      toast.warning("মোবাইল নম্বর/ইমেইল এবং পাসওয়ার্ড দিন।");
      setLoading(false);
      return;
    }

    try {
      const res = await loginPartnerAction(identifier, password);
      if (res.success && res.partner) {
        dbStore.setCurrentPartner(res.partner);
        toast.success("পার্টনার ড্যাশবোর্ডে সফলভাবে লগইন হয়েছে!");
        router.push("/partner/dashboard");
        return;
      } else {
        toast.error(res.error || "ভুল ক্রেডেনশিয়ালস। অনুগ্রহ করে সঠিক তথ্য প্রদান করুন।");
      }
    } catch (err) {
      console.error(err);
      toast.error("সার্ভার ত্রুটি। অনুগ্রহ করে আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
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
          <div className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mx-auto">
            <Building2 className="h-3 w-3" />
            পার্টনার পোর্টাল
          </div>
          <CardTitle className="font-heading text-xl font-bold text-secondary pt-1">
            পার্টনার লগইন
          </CardTitle>
          <CardDescription>
            লেনদেন যাচাই ও রেকর্ড করতে আপনার পার্টনার অ্যাকাউন্ট দিয়ে প্রবেশ করুন।
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handlePartnerLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-secondary flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-primary" />
                পার্টনার মোবাইল বা ইমেইল
              </label>
              <Input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="যেমন: popular@healthclub.com বা ০১৭০০০০০০০০"
                className="border-border bg-background"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-secondary flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-primary" />
                  পাসওয়ার্ড
                </label>
                <Link href="/forgot-password?type=partner" className="text-xs text-primary hover:underline font-semibold">
                  পাসওয়ার্ড ভুলে গেছেন?
                </Link>
              </div>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="border-border bg-background"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "লগইন হচ্ছে..." : "পার্টনার হিসেবে প্রবেশ করুন"}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground border-t border-border pt-4">
            সদস্য ড্যাশবোর্ডে যেতে চান?{" "}
            <Link href="/login" className="text-primary hover:underline font-semibold">
              সাধারণ মেম্বার লগইন করুন
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
