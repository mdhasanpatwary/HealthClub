"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, AlertCircle, CheckCircle2, Copy, Check, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { submitBkashPaymentAction, getMemberByIdAction } from "@/app/actions/memberActions";
import { Member } from "@/services/db";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

function PaymentForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const memberId = searchParams.get("memberId") || "";

  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Form states
  const [senderNumber, setSenderNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [copied, setCopied] = useState(false);

  const bkashNumber = "01783721411";

  useEffect(() => {
    if (memberId) {
      getMemberByIdAction(memberId).then((m) => {
        if (m) {
          setMember(m);
        }
        setLoading(false);
      });
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
    }
  }, [memberId]);

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(bkashNumber);
    setCopied(true);
    toast.success("বিকাশ নম্বরটি কপি করা হয়েছে!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (!senderNumber || !transactionId) {
      toast.error("অনুগ্রহ করে সবগুলো ঘর পূরণ করুন।");
      return;
    }

    const cleanSender = senderNumber.trim();
    const bdPhoneRegex = /^(01)[3-9]\d{8}$/;
    if (!bdPhoneRegex.test(cleanSender)) {
      toast.error("সঠিক ১১ সংখ্যার বাংলাদেশী বিকাশ নম্বর দিন (যেমন: 017XXXXXXXX)।");
      return;
    }

    const cleanTxnId = transactionId.trim().toUpperCase();
    if (cleanTxnId.length < 6 || cleanTxnId.length > 16) {
      toast.error("সঠিক ট্রানজেকশন আইডি দিন (সাধারণত ৮ থেকে ১২ অক্ষরের হয়)।");
      return;
    }

    setIsSubmitting(true);

    try {
      if (!member) return;
      const success = await submitBkashPaymentAction(member.id, cleanSender, cleanTxnId);
      
      if (success) {
        setPaymentSuccess(true);
        // Sync local storage user state
        const updatedUser = { 
          ...member, 
          status: "pending_approval" as const,
          bkashSender: cleanSender,
          bkashTxnId: cleanTxnId
        };
        localStorage.setItem("hc_current_user", JSON.stringify(updatedUser));
        
        toast.success("পেমেন্ট তথ্য সফলভাবে সাবমিট করা হয়েছে!");
        setTimeout(() => {
          router.push("/");
        }, 3000);
      } else {
        toast.error("পেমেন্ট তথ্য সাবমিট করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।");
      }
    } catch {
      toast.error("সার্ভার ত্রুটি।");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <PaymentCardSkeleton />;
  }

  if (!member) {
    return (
      <Card className="w-full max-w-md border border-border shadow-xl text-center p-6 bg-background">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
        <CardTitle className="mt-4 text-secondary">ত্রুটি</CardTitle>
        <CardDescription className="mt-2">নিবন্ধিত সদস্যের তথ্য পাওয়া যায়নি।</CardDescription>
        <Link href="/register" className="mt-4 inline-block">
          <Button variant="outline">আবার চেষ্টা করুন</Button>
        </Link>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md border border-border shadow-xl bg-background/80 backdrop-blur overflow-hidden">
      {/* bKash Themed Header */}
      <div className="bg-[#e2125d] text-white p-6 text-center space-y-2 relative">
        <div className="absolute top-3 left-3 bg-white/10 px-2 py-0.5 rounded-full text-[10px] uppercase font-mono tracking-wider">
          Offline Mode
        </div>
        <Smartphone className="h-12 w-12 mx-auto animate-pulse" />
        <h2 className="font-heading text-xl font-bold">বিকাশ অফলাইন পেমেন্ট</h2>
        <p className="text-xs text-pink-100">নিরাপদ বিকাশ পেমেন্ট ভেরিফিকেশন</p>
      </div>

      <CardContent className="p-6 space-y-6">
        {paymentSuccess ? (
          <div className="text-center py-8 space-y-4">
            <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto animate-bounce" />
            <h3 className="font-heading text-lg font-bold text-secondary">পেমেন্ট তথ্য সাবমিট করা হয়েছে!</h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
              আপনার পেমেন্ট সফলভাবে প্রাপ্ত হয়েছে। এডমিন ম্যানুয়ালি যাচাই করে আপনার অ্যাকাউন্টটি ২৪ ঘণ্টার মধ্যে সক্রিয় করবে।
            </p>
            <p className="text-xs text-primary font-semibold">আপনাকে হোমপেজে রিডাইরেক্ট করা হচ্ছে...</p>
          </div>
        ) : (
          <>
            {/* Steps & Instructions */}
            <div className="space-y-4">
              <div className="bg-[#e2125d]/5 border border-[#e2125d]/20 rounded-xl p-4 space-y-3">
                <h4 className="font-bold text-sm text-[#e2125d] font-heading flex items-center gap-1.5">
                  ধাপ ১: টাকা পাঠানোর নিয়ম
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  আপনার বিকাশ অ্যাপ বা ডায়াল কোড ব্যবহার করে নিচে দেওয়া নম্বরে <strong>৳৫০০</strong> সেন্ড মানি (Send Money) করুন:
                </p>
                <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-border p-2.5 rounded-xl">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-muted-foreground">বিকাশ পার্সোনাল নম্বর:</span>
                    <span className="font-mono font-bold text-secondary">{bkashNumber}</span>
                  </div>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon-xs" 
                    onClick={handleCopyNumber}
                  >
                    {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
                  </Button>
                </div>
                <div className="flex justify-between text-xs pt-1">
                  <span className="text-muted-foreground">টাকার পরিমাণ:</span>
                  <span className="font-bold text-secondary">৳৫০০ (বাৎসরিক ফি)</span>
                </div>
              </div>

              {/* Form Input Section */}
              <form onSubmit={handleSubmitPayment} className="space-y-4">
                <h4 className="font-bold text-sm text-secondary dark:text-white font-heading border-b border-border pb-1">
                  ধাপ ২: পেমেন্ট তথ্য দিন
                </h4>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-secondary dark:text-white flex items-center gap-1">
                    বিকাশ নম্বর (যে নম্বর থেকে পাঠিয়েছেন) *
                  </label>
                  <Input 
                    type="tel"
                    required
                    value={senderNumber}
                    onChange={(e) => setSenderNumber(e.target.value.replace(/\D/g, ""))}
                    placeholder="যেমন: 01711112222"
                    className="border-border bg-background"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-secondary flex items-center gap-1">
                    ট্রানজেকশন আইডি (Transaction ID / TxnID) *
                  </label>
                  <Input 
                    type="text"
                    required
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="যেমন: 9I4A1B2C3D"
                    className="border-border bg-background uppercase font-mono"
                  />
                </div>

                <div className="space-y-3 pt-2">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    size="lg"
                    className="w-full"
                  >
                    <ShieldCheck className="h-5 w-5" />
                    {isSubmitting ? "তথ্য সাবমিট করা হচ্ছে..." : "পেমেন্ট তথ্য সাবমিট করুন"}
                  </Button>
                  
                  <Link href="/" className="block w-full">
                    <Button variant="outline" size="lg" className="w-full text-muted-foreground">
                      পরে সাবমিট করব
                    </Button>
                  </Link>
                </div>
              </form>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function PaymentCardSkeleton() {
  return (
    <Card className="w-full max-w-md border border-border shadow-xl bg-background/80 backdrop-blur overflow-hidden rounded-3xl animate-pulse">
      <div className="bg-[#e2125d] p-6 text-center space-y-2">
        <Skeleton className="h-12 w-12 rounded-full mx-auto bg-white/20" />
        <Skeleton className="h-6 w-48 mx-auto bg-white/30" />
        <Skeleton className="h-3.5 w-36 mx-auto bg-white/20" />
      </div>
      <CardContent className="p-6 space-y-6">
        <div className="bg-[#e2125d]/5 border border-[#e2125d]/20 rounded-2xl p-4 space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-full" />
          <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-border p-2.5 rounded-xl">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-7 w-16 rounded-lg" />
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-4 w-36 border-b border-border pb-1" />
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-36" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
          <Skeleton className="h-11 w-full rounded-xl mt-4" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function PaymentPage() {
  return (
    <div className="bg-muted/30 min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<PaymentCardSkeleton />}>
        <PaymentForm />
      </Suspense>
    </div>
  );
}
