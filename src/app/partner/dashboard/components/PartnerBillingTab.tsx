"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Camera, Search, CheckCircle, XCircle, AlertTriangle, Receipt, CreditCard, History, Download } from "lucide-react";
import { Partner, Transaction } from "@/services/db";
import { authStore } from "@/services/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { verifyMemberForPartnerAction } from "@/app/actions/memberActions";
import { addPartnerTransactionAction } from "@/app/actions/partnerActions";
import { parseDiscountPercentage } from "@/lib/utils";
import { exportToCsv } from "@/lib/exportUtils";
import { toast } from "sonner";
import type { Html5Qrcode } from "html5-qrcode";

interface VerifiedMember {
  id: string;
  name: string;
  phone: string;
  email: string;
  tier: string;
  status: string;
  expiryDate: string;
  totalSaved: number;
  profilePictureUrl: string;
  isExpired: boolean;
}

interface PartnerBillingTabProps {
  partner: Partner;
  transactions: Transaction[];
  loadingTransactions: boolean;
  onTransactionComplete: () => void;
}

export function PartnerBillingTab({
  partner,
  transactions,
  loadingTransactions,
  onTransactionComplete,
}: PartnerBillingTabProps) {
  const [memberId, setMemberId] = useState("");
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [verifiedMember, setVerifiedMember] = useState<VerifiedMember | null>(null);

  // Transaction Form States
  const [billAmount, setBillAmount] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // Scanner States
  const [scanning, setScanning] = useState(false);

  const startScanner = () => {
    setScanning(true);
    setVerifiedMember(null);
  };

  const stopScanner = () => {
    setScanning(false);
  };

  const handleVerifyDirect = async (idToVerify: string) => {
    if (!idToVerify) return;
    setLoadingVerify(true);
    setVerifiedMember(null);
    try {
      const res = await verifyMemberForPartnerAction(idToVerify);
      if (res.success && res.member) {
        setVerifiedMember(res.member);
        toast.success("মেম্বার আইডিটি ভেরিফাই করা হয়েছে!");
      } else {
        toast.error(res.message || "মেম্বার আইডিটি সঠিক নয়।");
      }
    } catch {
      toast.error("যাচাই করতে সমস্যা হয়েছে।");
    } finally {
      setLoadingVerify(false);
    }
  };

  // Scanner mount/start effect
  useEffect(() => {
    let html5QrCode: Html5Qrcode | null = null;
    let isStarted = false;

    const setupScanner = async () => {
      if (!scanning) return;

      await new Promise((resolve) => setTimeout(resolve, 100));

      const element = document.getElementById("qr-reader");
      if (!element) {
        toast.error("ক্যামেরা রিডারটি লোড করা যায়নি।");
        setScanning(false);
        return;
      }

      const { Html5Qrcode } = await import("html5-qrcode");
      try {
        html5QrCode = new Html5Qrcode("qr-reader");

        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            setMemberId(decodedText);
            handleVerifyDirect(decodedText);
            setScanning(false);
          },
          () => {
            // Silently ignore frame errors
          }
        );
        isStarted = true;
      } catch {
        toast.error("ক্যামেরা চালু করতে সমস্যা হয়েছে। ম্যানুয়ালি মেম্বার আইডি টাইপ করুন।");
        setScanning(false);
      }
    };

    setupScanner();

    return () => {
      if (html5QrCode && isStarted) {
        isStarted = false;
        html5QrCode.stop().catch(() => {});
      }
    };
  }, [scanning]);

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleVerifyDirect(memberId);
  };

  const handleTransactionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifiedMember || !billAmount || isNaN(Number(billAmount))) {
      toast.error("সঠিক বিলের পরিমাণ ইনপুট দিন।");
      return;
    }

    setLoadingSubmit(true);
    try {
      const res = await addPartnerTransactionAction({
        memberId: verifiedMember.id,
        amount: Math.round(Number(billAmount)),
      });

      if (res.success) {
        toast.success(res.message);
        setBillAmount("");
        setVerifiedMember(null);
        setMemberId("");
        onTransactionComplete();
      } else {
        toast.error(res.message || "লেনদেন রেকর্ড করতে সমস্যা হয়েছে।");
      }
    } catch {
      toast.error("সার্ভার ত্রুটি। দয়া করে আবার চেষ্টা করুন।");
    } finally {
      setLoadingSubmit(false);
    }
  };

  const currentStaff = typeof window !== "undefined" ? authStore.getCurrentStaff() : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
      {/* Left 2 Cols: Scanner and validation */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="border-border shadow-sm rounded-3xl">
          <CardHeader className="p-5 sm:p-6 pb-2 sm:pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <CardTitle className="font-heading text-lg sm:text-xl font-bold text-secondary dark:text-white">
                  মেম্বার ভেরিফিকেশন ও ডিসকাউন্ট এন্ট্রি
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  ডিজিটাল কার্ডের কিউআর কোড স্ক্যান করুন অথবা মেম্বার আইডি টাইপ করে ছাড়ের লেনদেন রেকর্ড করুন।
                </CardDescription>
              </div>
              {currentStaff && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-xs text-emerald-800 dark:text-emerald-300 font-semibold self-start sm:self-auto shrink-0">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>{currentStaff.deskName}</span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-5 sm:p-6 pt-0 space-y-6">
            {/* QR Reader Area */}
            {scanning ? (
              <div className="space-y-4">
                <div id="qr-reader" className="w-full max-w-sm mx-auto overflow-hidden rounded-2xl border border-border bg-slate-950 aspect-square flex items-center justify-center"></div>
                <div className="text-center">
                  <Button onClick={stopScanner} variant="outline" size="sm" className="text-destructive border-destructive/20 hover:bg-destructive/10 rounded-xl cursor-pointer">
                    স্ক্যানার বন্ধ করুন
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-center py-6 border-2 border-dashed border-border rounded-2xl bg-muted/20">
                <Button onClick={startScanner} className="bg-primary hover:bg-primary-dark text-white gap-2 font-semibold rounded-xl cursor-pointer">
                  <Camera className="h-4 w-4" />
                  কিউআর কোড স্ক্যান করুন
                </Button>
                <span className="text-muted-foreground text-xs sm:text-sm">অথবা নিচে আইডি লিখুন</span>
              </div>
            )}

            {/* Manual Input */}
            <form onSubmit={handleVerifySubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  required
                  aria-label="মেম্বার আইডি লিখুন"
                  value={memberId}
                  onChange={(e) => setMemberId(e.target.value)}
                  placeholder="যেমন: HC-2026-F578E"
                  className="pl-10 h-11 border-border rounded-xl"
                />
              </div>
              <Button type="submit" disabled={loadingVerify} className="h-11 bg-secondary text-white hover:bg-slate-800 rounded-xl font-medium cursor-pointer">
                {loadingVerify ? "যাচাই হচ্ছে..." : "যাচাই করুন"}
              </Button>
            </form>

            {/* Verified Member Display */}
            {verifiedMember && (
              <div className="p-5 rounded-2xl border border-border bg-slate-50/60 dark:bg-slate-900/60 space-y-4 animate-in fade-in duration-200">
                <div className="flex items-start gap-4">
                  {verifiedMember.profilePictureUrl ? (
                    <Image
                      src={verifiedMember.profilePictureUrl}
                      alt={verifiedMember.name}
                      width={56}
                      height={56}
                      unoptimized
                      className="h-14 w-14 rounded-full object-cover border border-border shadow-sm shrink-0"
                    />
                  ) : (
                    <div className="h-14 w-14 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-bold uppercase border border-border shrink-0">
                      {verifiedMember.name.substring(0, 2)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-secondary dark:text-white truncate">{verifiedMember.name}</h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        verifiedMember.tier === "founding" 
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-500 border border-amber-500/20" 
                          : "bg-primary/10 text-primary border border-primary/20"
                      }`}>
                        {verifiedMember.tier === "founding" ? "ফাউন্ডিং মেম্বার" : "প্রিমিয়াম মেম্বার"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">মেম্বার আইডি: {verifiedMember.id}</p>
                    <p className="text-xs text-muted-foreground">ফোন: {verifiedMember.phone}</p>
                  </div>

                  <div className="shrink-0 text-right">
                    {verifiedMember.isExpired ? (
                      <div className="inline-flex items-center gap-1.5 bg-destructive/10 text-destructive text-xs font-semibold px-2.5 py-1 rounded-full border border-destructive/20">
                        <XCircle className="h-3.5 w-3.5" />
                        মেয়াদোত্তীর্ণ
                      </div>
                    ) : verifiedMember.status === "active" ? (
                      <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1 rounded-full border border-primary/20">
                        <CheckCircle className="h-3.5 w-3.5" />
                        সক্রিয় কার্ড
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-600 text-xs font-semibold px-2.5 py-1 rounded-full border border-amber-500/20">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        অচল কার্ড
                      </div>
                    )}
                  </div>
                </div>

                {/* Transaction submission form if card is active & valid */}
                {!verifiedMember.isExpired && verifiedMember.status === "active" ? (
                  <form onSubmit={handleTransactionSubmit} className="pt-4 border-t border-border space-y-4">
                    <div className="space-y-1.5">
                      <label htmlFor="partner-bill-amount" className="text-xs font-semibold text-secondary dark:text-slate-200 flex items-center gap-1.5 cursor-pointer">
                        <Receipt className="h-3.5 w-3.5 text-primary" />
                        মোট বিলের পরিমাণ (টাকা)
                      </label>
                      <Input
                        id="partner-bill-amount"
                        type="number"
                        required
                        min="1"
                        value={billAmount}
                        onChange={(e) => setBillAmount(e.target.value)}
                        placeholder="যেমন: ১৫০০"
                        className="h-11 border-border rounded-xl"
                      />
                    </div>
                    {billAmount && !isNaN(Number(billAmount)) && Number(billAmount) > 0 && (
                      <div className="bg-primary/5 border border-primary/20 rounded-xl p-3.5 flex justify-between items-center text-sm font-semibold text-primary">
                        <span>প্রাক্কলিত সাশ্রয় (ছাড়):</span>
                        <span className="text-base font-extrabold font-mono">
                          ৳{Math.round(Number(billAmount) * parseDiscountPercentage(partner.discount))}
                        </span>
                      </div>
                    )}
                    <Button type="submit" disabled={loadingSubmit} className="w-full bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl h-11 gap-1.5 cursor-pointer">
                      <CreditCard className="h-4 w-4" />
                      {loadingSubmit ? "সংরক্ষণ হচ্ছে..." : "ডিসকাউন্ট লেনদেন সম্পন্ন করুন"}
                    </Button>
                  </form>
                ) : (
                  <div className="p-3.5 bg-destructive/5 border border-destructive/10 text-destructive rounded-xl text-xs flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span>এই কার্ডটি সচল ও কার্যকর না হওয়ায় ডিসকাউন্ট ট্রানজেকশন সম্পন্ন করা যাবে না।</span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right 1 Col: Recent Transactions history */}
      <div>
        <Card className="border-border shadow-sm rounded-3xl h-full flex flex-col justify-between">
          <CardHeader className="flex flex-row items-center justify-between pb-3 p-5 sm:p-6">
            <div className="space-y-0.5">
              <CardTitle className="font-heading text-base font-bold text-secondary dark:text-white flex items-center gap-1.5">
                <History className="h-4 w-4 text-primary" />
                সাম্প্রতিক লেনদেনসমূহ
              </CardTitle>
              <CardDescription className="text-xs">
                আপনার প্রতিষ্ঠান থেকে প্রদানকৃত ছাড়।
              </CardDescription>
            </div>
            {transactions.length > 0 && (
              <Button
                onClick={() =>
                  exportToCsv(transactions, "partner_transactions", [
                    { header: "Transaction ID", accessor: "id" },
                    { header: "Member ID", accessor: "memberId" },
                    { header: "Member Name", accessor: "memberName" },
                    { header: "Counter Desk", accessor: "deskName" },
                    { header: "Processed By", accessor: "staffName" },
                    { header: "Bill Amount (BDT)", accessor: "amount" },
                    { header: "Saved Amount (BDT)", accessor: "saved" },
                    { header: "Date", accessor: "date" },
                  ])
                }
                variant="outline"
                size="sm"
                className="border-border gap-1.5 text-xs font-semibold h-8 rounded-xl cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>এক্সপোর্ট</span>
              </Button>
            )}
          </CardHeader>
          <CardContent className="px-0 flex-1">
            {loadingTransactions ? (
              <div className="divide-y divide-border/60 p-4 space-y-4 animate-pulse">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="py-2 flex justify-between items-start">
                    <div className="space-y-1.5">
                      <Skeleton className="h-3.5 w-28" />
                      <Skeleton className="h-2.5 w-16" />
                    </div>
                    <div className="space-y-1.5 text-right">
                      <Skeleton className="h-3.5 w-14 ml-auto" />
                      <Skeleton className="h-2.5 w-10 ml-auto" />
                    </div>
                  </div>
                ))}
              </div>
            ) : transactions.length === 0 ? (
              <div className="py-16 text-center text-xs sm:text-sm text-muted-foreground px-4">
                কোনো লেনদেন রেকর্ড করা হয়নি।
              </div>
            ) : (
              <div className="divide-y divide-border/60 max-h-[500px] overflow-y-auto">
                {transactions.map((tx) => (
                  <div key={tx.id} className="p-4 flex justify-between items-start text-xs hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                    <div className="space-y-0.5">
                      <p className="font-bold text-secondary dark:text-white">{tx.memberName}</p>
                      <div className="flex items-center gap-1.5 flex-wrap text-[10px] text-muted-foreground">
                        <span>আইডি: {tx.memberId}</span>
                        {tx.deskName && (
                          <span className="bg-primary/10 text-primary font-medium px-1.5 py-0.2 rounded">
                            {tx.deskName}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground font-mono">
                        {new Date(tx.date).toLocaleDateString("bn-BD", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div className="text-right space-y-0.5">
                      <p className="font-bold text-secondary dark:text-white font-mono">বিল: ৳{tx.amount}</p>
                      <p className="font-extrabold text-primary font-mono">ছাড়: ৳{tx.saved}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
