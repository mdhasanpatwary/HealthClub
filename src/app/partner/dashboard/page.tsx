"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Building2, Camera, LogOut, Search, CheckCircle, XCircle, AlertTriangle, Receipt, CreditCard, History, KeyRound } from "lucide-react";
import { dbStore } from "@/services/dbStore";
import { Partner, Transaction } from "@/services/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { verifyMemberForPartnerAction } from "@/app/actions/memberActions";
import { addPartnerTransactionAction, getPartnerTransactionsAction, changePartnerPasswordAction } from "@/app/actions/partnerActions";
import { toast } from "sonner";
import { Html5Qrcode } from "html5-qrcode";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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

export default function PartnerDashboardPage() {
  const router = useRouter();
  const [partner, setPartner] = useState<Partner | null>(null);
  const [memberId, setMemberId] = useState("");
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [verifiedMember, setVerifiedMember] = useState<VerifiedMember | null>(null);
  
  // Transaction Form States
  const [billAmount, setBillAmount] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // Scanner States
  const [scanning, setScanning] = useState(false);

  // Transactions History
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Password Change States
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changeError, setChangeError] = useState("");
  const [loadingChange, setLoadingChange] = useState(false);

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangeError("");
    setLoadingChange(true);

    if (newPassword.length < 6) {
      setChangeError("নতুন পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে।");
      setLoadingChange(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setChangeError("নতুন পাসওয়ার্ড দুটি মেলেনি।");
      setLoadingChange(false);
      return;
    }

    try {
      const res = await changePartnerPasswordAction(currentPassword, newPassword);
      if (res.success) {
        toast.success(res.message);
        setDialogOpen(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setChangeError(res.message || "পাসওয়ার্ড পরিবর্তন করা যায়নি।");
      }
    } catch {
      setChangeError("সার্ভার ত্রুটি। অনুগ্রহ করে আবার চেষ্টা করুন।");
    } finally {
      setLoadingChange(false);
    }
  };

  const loadTransactions = async () => {
    try {
      const data = await getPartnerTransactionsAction();
      setTransactions(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const currentPartner = dbStore.getCurrentPartner();
    if (!currentPartner) {
      router.push("/login/partner");
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPartner(currentPartner);
    loadTransactions();
  }, [router]);

  const handleLogout = () => {
    dbStore.logoutPartner();
    toast.success("সফলভাবে লগআউট করা হয়েছে।");
    router.push("/login/partner");
  };

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

      // Small delay to ensure React commits the DOM update for #qr-reader
      await new Promise((resolve) => setTimeout(resolve, 100));

      const element = document.getElementById("qr-reader");
      if (!element) {
        console.error("qr-reader element not found in DOM");
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
            // Silently ignore camera parsing frame errors
          }
        );
        isStarted = true;
      } catch (err) {
        console.error("Scanner failed:", err);
        toast.error("ক্যামেরা চালু করতে সমস্যা হয়েছে। দয়া করে ম্যানুয়ালি মেম্বার আইডি টাইপ করুন।");
        setScanning(false);
      }
    };

    setupScanner();

    return () => {
      if (html5QrCode && isStarted) {
        isStarted = false;
        html5QrCode.stop().catch((err) => {
          console.error("Failed to stop scanner in cleanup", err);
        });
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
        loadTransactions();
      } else {
        toast.error(res.message || "লেনদেন রেকর্ড করতে সমস্যা হয়েছে।");
      }
    } catch {
      toast.error("সার্ভার ত্রুটি। দয়া করে আবার চেষ্টা করুন।");
    } finally {
      setLoadingSubmit(false);
    }
  };



  if (!partner) return null;

  const categoryLabels = {
    hospital: "হাসপাতাল",
    diagnostic: "ডায়াগনস্টিক",
    pharmacy: "ফার্মেসী",
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Profile card */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-secondary to-slate-900 text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-heading">{partner.name}</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              ক্যাটাগরি: {categoryLabels[partner.category]} | ডিসকাউন্ট হার: <span className="text-primary font-bold">{partner.discount}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 shrink-0 self-stretch sm:self-auto">
          {/* Change Password Dialog */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger
              render={
                <Button variant="outline" size="sm" className="gap-2 border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white">
                  <KeyRound className="h-4 w-4" />
                  পাসওয়ার্ড পরিবর্তন
                </Button>
              }
            />
            <DialogContent className="sm:max-w-md bg-background border border-border">
              <DialogHeader>
                <DialogTitle className="font-heading text-lg font-bold text-secondary dark:text-white flex items-center gap-1.5">
                  <KeyRound className="h-5 w-5 text-primary" />
                  পাসওয়ার্ড পরিবর্তন করুন
                </DialogTitle>
                <DialogDescription>
                  আপনার অ্যাকাউন্ট সুরক্ষিত রাখতে নিয়মিত পাসওয়ার্ড পরিবর্তন করুন।
                </DialogDescription>
              </DialogHeader>

              {changeError && (
                <div className="bg-destructive/10 text-destructive text-xs p-3 rounded-lg border border-destructive/20 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>{changeError}</span>
                </div>
              )}

              <form onSubmit={handleChangePasswordSubmit} className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-secondary dark:text-white">বর্তমান পাসওয়ার্ড *</label>
                  <Input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="border-border bg-background h-10 text-secondary dark:text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-secondary dark:text-white">নতুন পাসওয়ার্ড *</label>
                  <Input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="অন্তত ৬ অক্ষরের পাসওয়ার্ড"
                    className="border-border bg-background h-10 text-secondary dark:text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-secondary dark:text-white">নতুন পাসওয়ার্ড নিশ্চিত করুন *</label>
                  <Input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="আবার টাইপ করুন"
                    className="border-border bg-background h-10 text-secondary dark:text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="border-border text-secondary dark:text-white">
                    বাতিল
                  </Button>
                  <Button type="submit" disabled={loadingChange} className="bg-primary hover:bg-primary-dark text-white font-semibold">
                    {loadingChange ? "পরিবর্তন হচ্ছে..." : "পাসওয়ার্ড আপডেট করুন"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Button onClick={handleLogout} variant="destructive" size="sm" className="gap-2">
            <LogOut className="h-4 w-4" />
            লগআউট
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Scanner and validation */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border shadow-md">
            <CardHeader>
              <CardTitle className="font-heading text-lg font-bold text-secondary">
                মেম্বার ভেরিফিকেশন ও ডিসকাউন্ট এন্ট্রি
              </CardTitle>
              <CardDescription>
                ডিজিটাল কার্ডের কিউআর কোড স্ক্যান করুন অথবা মেম্বার আইডি ম্যানুয়ালি টাইপ করে যাচাই করুন।
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* QR Reader Area */}
              {scanning ? (
                <div className="space-y-4">
                  <div id="qr-reader" className="w-full max-w-sm mx-auto overflow-hidden rounded-xl border border-border bg-slate-950 aspect-square flex items-center justify-center"></div>
                  <div className="text-center">
                    <Button onClick={stopScanner} variant="outline" size="sm" className="text-destructive border-destructive/20 hover:bg-destructive/10">
                      স্ক্যানার বন্ধ করুন
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center py-4 border-2 border-dashed border-border rounded-xl">
                  <Button onClick={startScanner} className="bg-primary hover:bg-primary-dark text-white gap-2 font-semibold">
                    <Camera className="h-4 w-4" />
                    কিউআর কোড স্ক্যান করুন
                  </Button>
                  <span className="text-muted-foreground text-sm">অথবা ম্যানুয়ালি টাইপ করুন</span>
                </div>
              )}

              {/* Manual Input */}
              <form onSubmit={handleVerifySubmit} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    required
                    value={memberId}
                    onChange={(e) => setMemberId(e.target.value)}
                    placeholder="যেমন: HC-2026-F578E"
                    className="pl-10 h-11 border-border"
                  />
                </div>
                <Button type="submit" disabled={loadingVerify} className="h-11 bg-secondary text-white hover:bg-slate-800">
                  {loadingVerify ? "যাচাই হচ্ছে..." : "যাচাই করুন"}
                </Button>
              </form>

              {/* Verified Member Display */}
              {verifiedMember && (
                <div className="p-5 rounded-2xl border border-border bg-slate-50/50 dark:bg-slate-900/50 space-y-5 animate-in fade-in duration-200">
                  <div className="flex items-start gap-4">
                    {verifiedMember.profilePictureUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={verifiedMember.profilePictureUrl} alt="" className="h-14 w-14 rounded-full object-cover border border-border shadow-sm" />
                    ) : (
                      <div className="h-14 w-14 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-bold uppercase border border-border">
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
                          {verifiedMember.tier === "founding" ? "ফাউন্ডিং মেম্বার" : "প্রিমিয়াম মেম্বার"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">মেম্বার আইডি: {verifiedMember.id}</p>
                      <p className="text-xs text-muted-foreground">ফোন নম্বর: {verifiedMember.phone}</p>
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
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-secondary flex items-center gap-1.5">
                          <Receipt className="h-3.5 w-3.5 text-primary" />
                          মোট বিলের পরিমাণ (টাকা)
                        </label>
                        <Input
                          type="number"
                          required
                          min="1"
                          value={billAmount}
                          onChange={(e) => setBillAmount(e.target.value)}
                          placeholder="যেমন: ১৫০০"
                          className="h-11 border-border"
                        />
                      </div>
                      {billAmount && !isNaN(Number(billAmount)) && Number(billAmount) > 0 && (
                        <div className="bg-primary/5 border border-primary/15 rounded-xl p-3.5 flex justify-between items-center text-sm font-semibold text-primary">
                          <span>প্রাক্কলিত ডিসকাউন্ট ও সাশ্রয়:</span>
                          <span className="text-base font-extrabold font-mono">
                            ৳{Math.round((Number(billAmount) * (partner.discount.match(/\d+/) ? parseInt(partner.discount.match(/\d+/)![0]) : 10)) / 100)}
                          </span>
                        </div>
                      )}
                      <Button type="submit" disabled={loadingSubmit} className="w-full bg-primary hover:bg-primary-dark text-white font-semibold gap-1.5">
                        <CreditCard className="h-4 w-4" />
                        {loadingSubmit ? "সংরক্ষণ হচ্ছে..." : "ডিসকাউন্ট লেনদেন সম্পন্ন করুন"}
                      </Button>
                    </form>
                  ) : (
                    <div className="p-3.5 bg-destructive/5 border border-destructive/10 text-destructive rounded-xl text-xs flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                      <span>এই মেম্বার কার্ডটি সচল ও কার্যকর না হওয়ায় ডিসকাউন্ট ট্রানজেকশন রেকর্ড করা যাবে না।</span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Recent Transactions history */}
        <div>
          <Card className="border-border shadow-md h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="space-y-0.5">
                <CardTitle className="font-heading text-base font-bold text-secondary flex items-center gap-1.5">
                  <History className="h-4 w-4 text-primary" />
                  সাম্প্রতিক লেনদেনসমূহ
                </CardTitle>
                <CardDescription className="text-xs">
                  আপনার ফার্ম/প্রতিষ্ঠান থেকে প্রদানকৃত ছাড়।
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="px-0">
              {transactions.length === 0 ? (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  কোনো লেনদেন রেকর্ড করা হয়নি।
                </div>
              ) : (
                <div className="divide-y divide-border/60 max-h-[500px] overflow-y-auto">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="p-4 flex justify-between items-start text-xs hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                      <div className="space-y-1">
                        <p className="font-bold text-secondary dark:text-white">{tx.memberName}</p>
                        <p className="text-[10px] text-muted-foreground">আইডি: {tx.memberId}</p>
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
                      <div className="text-right space-y-1">
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
    </div>
  );
}
