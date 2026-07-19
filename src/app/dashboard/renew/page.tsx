"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, AlertCircle, CheckCircle2, Copy, Check, Smartphone, ArrowLeft, Heart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle, CardDescription, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { requestRenewalAction } from "@/app/actions/memberActions";
import { dbStore } from "@/services/dbStore";
import { Member } from "@/services/db";
import { toast } from "sonner";

export default function RenewalPage() {
  const router = useRouter();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Form states
  const [senderNumber, setSenderNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [profession, setProfession] = useState("");
  const [formError, setFormError] = useState("");
  const [copied, setCopied] = useState(false);

  const bkashNumber = "01783721411";

  useEffect(() => {
    const currentUser = dbStore.getCurrentUser();
    if (!currentUser) {
      router.push("/login");
      return;
    }
    
    dbStore.getMemberById(currentUser.id).then((freshUser) => {
      const activeUser = freshUser || currentUser;
      setMember(activeUser);
      setProfession(activeUser.profession || "");
      setLoading(false);
    });
  }, [router]);

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(bkashNumber);
    setCopied(true);
    toast.success("বিকাশ নম্বরটি কপি করা হয়েছে!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRenewalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!senderNumber || !transactionId) {
      setFormError("অনুগ্রহ করে সবগুলো ঘর পূরণ করুন।");
      return;
    }

    const cleanSender = senderNumber.trim();
    const bdPhoneRegex = /^(01)[3-9]\d{8}$/;
    if (!bdPhoneRegex.test(cleanSender)) {
      setFormError("সঠিক ১১ সংখ্যার বাংলাদেশী বিকাশ নম্বর দিন (যেমন: 017XXXXXXXX)।");
      return;
    }

    const cleanTxnId = transactionId.trim().toUpperCase();
    if (cleanTxnId.length < 6 || cleanTxnId.length > 16) {
      setFormError("সঠিক ট্রানজেকশন আইডি দিন (সাধারণত ৮ থেকে ১২ অক্ষরের হয়)।");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await requestRenewalAction(cleanSender, cleanTxnId, profession || undefined);
      if (res.success) {
        setPaymentSuccess(true);
        if (member) {
          const updatedUser = {
            ...member,
            renewalStatus: "pending",
            renewalBkashSender: cleanSender,
            renewalBkashTxnId: cleanTxnId,
            profession: profession || member.profession,
          };
          dbStore.setCurrentUser(updatedUser);
        }
        toast.success(res.message);
        setTimeout(() => {
          router.push("/dashboard");
        }, 3000);
      } else {
        setFormError(res.message || "রিনিউয়াল সাবমিট করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।");
      }
    } catch {
      setFormError("সার্ভার ত্রুটি। অনুগ্রহ করে আবার চেষ্টা করুন।");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!member) return null;

  return (
    <div className="bg-muted/30 min-h-[85vh] py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl">
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary mb-5 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
          ড্যাশবোর্ডে ফিরে যান
        </Link>

        <Card className="border border-border shadow-xl bg-background/80 backdrop-blur">
          <CardHeader className="text-center space-y-2 pb-6 border-b border-border/60">
            <div className="flex items-center justify-center space-x-2 text-primary mx-auto">
              <Heart className="h-7 w-7 fill-primary" />
              <span className="font-heading text-2xl font-bold text-secondary">
                হেলথ <span className="text-primary">ক্লাব</span>
              </span>
            </div>
            <CardTitle className="font-heading text-xl font-bold text-secondary">
              মেম্বারশিপ নবায়ন (Membership Renewal)
            </CardTitle>
            <CardDescription>
              মেম্বারশিপ সচল রাখতে ৫০০ টাকা নবায়ন ফি বিকাশ সেন্ড মানি করুন।
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6 space-y-6">
            {paymentSuccess ? (
              <div className="text-center py-8 space-y-4 animate-in fade-in duration-300">
                <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h3 className="font-heading text-lg font-bold text-secondary">অনুরোধ সম্পন্ন হয়েছে!</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  আপনার নবায়ন পেমেন্ট ওটি ট্রানজেকশন সফলভাবে জমা দেওয়া হয়েছে। ২৪ ঘণ্টার মধ্যে এডমিন তথ্য যাচাই করে আপনার কার্ডের মেয়াদ ১ বছর বৃদ্ধি করে দেবে।
                </p>
                <p className="text-xs text-primary font-semibold">ড্যাশবোর্ডে রিডাইরেক্ট করা হচ্ছে...</p>
              </div>
            ) : (
              <>
                {formError && (
                  <div className="bg-destructive/10 text-destructive text-xs p-3.5 rounded-xl flex items-center gap-2 border border-destructive/20">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* bkash steps */}
                <div className="bg-[#e2125d]/5 rounded-2xl p-5 border border-[#e2125d]/10 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 bg-[#e2125d] text-white rounded-lg flex items-center justify-center font-bold shadow-md">
                      bKash
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#e2125d]">বিকাশ সেন্ড মানি করুন (Send Money)</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">নিচের ব্যক্তিগত নম্বরে ৫০০ টাকা পাঠান।</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-inner">
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-slate-400 tracking-wider font-mono">BKASH PERSONAL NUMBER</p>
                      <p className="text-sm font-extrabold text-secondary dark:text-white font-mono">{bkashNumber}</p>
                    </div>
                    <Button onClick={handleCopyNumber} variant="ghost" size="sm" className="h-9 gap-1.5 hover:bg-slate-100 text-xs">
                      {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
                      {copied ? "কপি হয়েছে" : "কপি করুন"}
                    </Button>
                  </div>

                  <div className="text-xs text-muted-foreground space-y-1.5 pl-1.5 border-l-2 border-[#e2125d]/20">
                    <p>১. আপনার বিকাশ অ্যাপে লগইন করে **Send Money** অপশনে যান।</p>
                    <p>২. উপরে দেওয়া নম্বরটি দিন এবং পরিমাণ **৳৫০০** নির্ধারণ করুন।</p>
                    <p>৩. পেমেন্ট সম্পন্ন করার পর বিকাশ থেকে পাওয়া **Transaction ID** কপি করুন।</p>
                  </div>
                </div>

                {/* Form inputs */}
                <form onSubmit={handleRenewalSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-secondary flex items-center gap-1.5">
                      <Smartphone className="h-3.5 w-3.5 text-primary" />
                      যে বিকাশ নম্বর থেকে টাকা পাঠিয়েছেন
                    </label>
                    <Input
                      type="text"
                      required
                      value={senderNumber}
                      onChange={(e) => setSenderNumber(e.target.value)}
                      placeholder="যেমন: 018XXXXXXXX"
                      className="h-11 border-border bg-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-secondary flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                      বিকাশ ট্রানজেকশন আইডি (Transaction ID)
                    </label>
                    <Input
                      type="text"
                      required
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder="যেমন: BGA678UHG"
                      className="h-11 border-border bg-background font-mono uppercase"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-secondary flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-primary" />
                      পেশা/কর্মক্ষেত্র (পরিবর্তন করতে চাইলে)
                    </label>
                    <Input
                      type="text"
                      value={profession}
                      onChange={(e) => setProfession(e.target.value)}
                      placeholder="যেমন: চাকুরিজীবী, ব্যবসায়ী, ছাত্র ইত্যাদি"
                      className="h-11 border-border bg-background"
                    />
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full h-11 bg-primary hover:bg-primary-dark text-white font-semibold shadow-md active:scale-[0.99] transition-transform">
                    {isSubmitting ? "অনুরোধ জমা দেওয়া হচ্ছে..." : "রিনিউয়াল অনুরোধ পাঠান (৳৫০০)"}
                  </Button>
                </form>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
