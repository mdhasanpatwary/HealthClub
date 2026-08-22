"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Lock, Shield } from "lucide-react";
import { dbStore } from "@/services/dbStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { loginAdminAction } from "@/app/actions/memberActions";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!identifier || !password) {
      toast.warning("মোবাইল নম্বর/ইমেইল এবং পাসওয়ার্ড দিন।");
      return;
    }

    setLoading(true);
    try {
      const adminMember = await loginAdminAction(identifier, password);
      if (adminMember) {
        dbStore.setCurrentUser(adminMember);
        toast.success("এডমিন পোর্টালে সফলভাবে লগইন করা হয়েছে!");
        router.push("/admin");
        return;
      }
    } catch {
      // Login failed handled by error toast below
    } finally {
      setLoading(false);
    }

    toast.error("ভুল এডমিন ক্রেডেনশিয়ালস। অনুগ্রহ করে সঠিক তথ্য প্রদান করুন।");
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
          <div className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-500 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mx-auto">
            <Shield className="h-3 w-3" />
            এডমিন পোর্টাল
          </div>
          <CardTitle className="font-heading text-xl font-bold text-secondary pt-1">
            এডমিন লগইন
          </CardTitle>
          <CardDescription>
            হেলথ ক্লাব ম্যানেজমেন্ট সিস্টেম অ্যাক্সেস করতে আপনার এডমিন অ্যাকাউন্ট তথ্য দিন।
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="admin-identifier" className="text-xs font-semibold text-secondary flex items-center gap-1.5 cursor-pointer">
                <Shield className="h-3.5 w-3.5 text-primary" />
                এডমিন ইমেইল বা মোবাইল নম্বর
              </label>
              <Input
                id="admin-identifier"
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="যেমন: admin@healthclub.com বা 017XXXXXXXX"
                className="border-border bg-background"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="admin-password" className="text-xs font-semibold text-secondary flex items-center gap-1.5 cursor-pointer">
                <Lock className="h-3.5 w-3.5 text-primary" />
                পাসওয়ার্ড
              </label>
              <Input
                id="admin-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="border-border bg-background"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "লগইন হচ্ছে..." : "এডমিন হিসেবে প্রবেশ করুন"}
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
