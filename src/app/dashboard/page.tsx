"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Heart, CreditCard, History, LayoutDashboard, Save, CheckCircle2,
  TrendingUp, Wallet, ReceiptText
} from "lucide-react";
import { toast } from "sonner";
import { dbStore } from "@/services/dbStore";
import { Member, Transaction } from "@/services/db";
import MemberCard from "@/components/ui/MemberCard";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUpload } from "@/components/ui/ImageUpload";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<Member | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Profile Form States
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileAddress, setProfileAddress] = useState("");
  const [profileBirthDate, setProfileBirthDate] = useState("");
  const [profileProfession, setProfileProfession] = useState("");
  const [profilePictureUrl, setProfilePictureUrl] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load data on mount
  useEffect(() => {
    const currentUser = dbStore.getCurrentUser();
    if (!currentUser) {
      router.push("/login");
      return;
    }
    
    dbStore.getMemberById(currentUser.id).then((freshUser) => {
      const activeUser = freshUser || currentUser;
      setUser(activeUser);
      setProfileName(activeUser.name);
      setProfileEmail(activeUser.email || "");
      setProfilePhone(activeUser.phone);
      setProfileAddress(activeUser.address || "");
      setProfileBirthDate(activeUser.birthDate || "");
      setProfileProfession(activeUser.profession || "");
      setProfilePictureUrl(activeUser.profilePictureUrl || "");
    });

    dbStore.getTransactions().then((allTx) => {
      const userTx = allTx.filter(t => t.memberId === currentUser.id);
      setTransactions(userTx);
    });
  }, [router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(false);

    if (!user) return;

    try {
      const success = await dbStore.updateMemberProfile(
        user.id,
        profileName,
        profilePhone,
        profileEmail,
        profileAddress,
        profileBirthDate,
        profileProfession,
        profilePictureUrl
      );

      if (success) {
        const updatedUser = {
          ...user,
          name: profileName,
          email: profileEmail,
          phone: profilePhone,
          address: profileAddress,
          birthDate: profileBirthDate,
          profession: profileProfession,
          profilePictureUrl: profilePictureUrl
        };
        dbStore.setCurrentUser(updatedUser);
        setUser(updatedUser);
        toast.success("প্রোফাইল সফলভাবে আপডেট করা হয়েছে!");
      } else {
        toast.error("প্রোফাইল আপডেট করতে সমস্যা হয়েছে।");
      }
    } catch (err) {
      console.error(err);
      toast.error("সার্ভার ত্রুটি।");
    }

    setTimeout(() => setSaveSuccess(false), 3000);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm">লোডিং হচ্ছে...</p>
        </div>
      </div>
    );
  }

  const totalSaved = user.totalSaved || 0;
  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);

  const statusConfig = {
    active: {
      dot: "bg-emerald-500 animate-pulse",
      badge: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800",
      label: "মেম্বারশিপ সচল (ACTIVE)",
    },
    pending_payment: {
      dot: "bg-rose-500 animate-pulse",
      badge: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-800",
      label: "পেমেন্ট পেন্ডিং",
    },
    pending: {
      dot: "bg-amber-500 animate-bounce",
      badge: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800",
      label: "অনুমোদনের অপেক্ষায়",
    },
  };

  const status = statusConfig[user.status as keyof typeof statusConfig] || statusConfig.pending;

  return (
    <div className="bg-muted/30 dark:bg-slate-950/50 min-h-screen py-6 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">

        {/* ── Welcome Banner ── */}
        <div className="relative overflow-hidden bg-gradient-to-r from-secondary via-slate-800 to-slate-900 dark:from-slate-900 dark:via-slate-800 dark:to-secondary rounded-2xl p-6 sm:p-8 border border-slate-700/50 shadow-xl">
          {/* Background dot pattern */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
          {/* Top green accent line */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />

          <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="relative shrink-0">
                {user.profilePictureUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.profilePictureUrl}
                    alt={user.name}
                    className="h-14 w-14 rounded-2xl object-cover border-2 border-white/20 shadow-lg"
                  />
                ) : (
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center text-white font-bold text-xl font-heading shadow-lg border-2 border-white/20">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
                <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-slate-900 shadow" />
              </div>

              <div>
                <p className="text-xs text-slate-400 font-medium mb-0.5 flex items-center gap-1.5">
                  <Heart className="h-3 w-3 fill-primary text-primary" />
                  হেলথ ক্লাব ড্যাশবোর্ড
                </p>
                <h1 className="font-heading text-xl sm:text-2xl font-bold text-white">
                  স্বাগতম, {user.name}
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  মেম্বার আইডি:{" "}
                  <span className="font-mono font-semibold text-primary">{user.id}</span>
                  <span className="mx-1.5 text-slate-600">·</span>
                  <span className="capitalize font-semibold text-slate-300">{user.tier} Member</span>
                </p>
              </div>
            </div>

            {/* Status badge */}
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${status.dot}`} />
              <span className={`text-xs font-bold px-3.5 py-1.5 rounded-full border ${status.badge}`}>
                {status.label}
              </span>
            </div>
          </div>
        </div>

        {/* ── Overview Stats Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">

          <Card className="border-0 shadow-sm overflow-hidden bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/40 dark:to-slate-900">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70 uppercase font-mono tracking-wider font-bold">মোট চিকিৎসা সাশ্রয়</p>
                  <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums mt-2">৳{totalSaved.toLocaleString("bn-BD")}</p>
                  <p className="text-[11px] text-emerald-600/60 dark:text-emerald-400/60 mt-1">হেলথ ক্লাব ব্যবহারে সঞ্চয়</p>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-emerald-500/15 dark:bg-emerald-500/20 border border-emerald-500/20 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm overflow-hidden bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/40 dark:to-slate-900">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-blue-600/70 dark:text-blue-400/70 uppercase font-mono tracking-wider font-bold">মোট চিকিৎসা খরচ</p>
                  <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 font-mono tabular-nums mt-2">৳{totalSpent.toLocaleString("bn-BD")}</p>
                  <p className="text-[11px] text-blue-600/60 dark:text-blue-400/60 mt-1">পার্টনার হাসপাতালে ব্যয়</p>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-blue-500/15 dark:bg-blue-500/20 border border-blue-500/20 flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm overflow-hidden bg-gradient-to-br from-violet-50 to-white dark:from-violet-950/40 dark:to-slate-900">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-violet-600/70 dark:text-violet-400/70 uppercase font-mono tracking-wider font-bold">মোট ট্রানজেকশন</p>
                  <p className="text-3xl font-extrabold text-violet-600 dark:text-violet-400 font-mono tabular-nums mt-2">{transactions.length} টি</p>
                  <p className="text-[11px] text-violet-600/60 dark:text-violet-400/60 mt-1">সেবা কার্ড ব্যবহারের সংখ্যা</p>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-violet-500/15 dark:bg-violet-500/20 border border-violet-500/20 flex items-center justify-center">
                  <ReceiptText className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* ── Main Dashboard Panel ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Left Column: Digital Card */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="border-border/60 shadow-md overflow-hidden">
              <CardHeader className="border-b border-border/60 pb-4 bg-muted/30 dark:bg-slate-900/60">
                <CardTitle className="font-heading text-base font-bold text-secondary dark:text-white flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <CreditCard className="h-4 w-4 text-primary" />
                  </div>
                  ডিজিটাল মেম্বারশিপ কার্ড
                </CardTitle>
                <CardDescription>
                  হাসপাতালে ডিসকাউন্ট দাবি করতে এই কার্ডটি ও QR কোড কাউন্টারে দেখান।
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5">
                {user.status === "active" ? (
                  <MemberCard member={user} />
                ) : user.status === "pending_payment" ? (
                  <div className="relative w-full max-w-md mx-auto aspect-[1.586/1] rounded-2xl p-6 overflow-hidden border border-rose-500/20 bg-gradient-to-br from-slate-900 to-slate-950 flex flex-col justify-center items-center text-center space-y-3 shadow-lg">
                    <div className="absolute inset-0 bg-background/50 backdrop-blur-[3px]" />
                    <div className="z-10 bg-rose-500/10 p-2.5 rounded-full border border-rose-500/20">
                      <CreditCard className="h-6 w-6 text-rose-500 animate-pulse" />
                    </div>
                    <h4 className="z-10 font-heading text-white font-bold text-sm">মেম্বারশিপ ফি পরিশোধ করুন</h4>
                    <p className="z-10 text-[11px] text-slate-300 max-w-xs leading-relaxed">
                      অ্যাকাউন্ট সক্রিয় করতে ৫০০ টাকা বাৎসরিক মেম্বারশিপ ফি পরিশোধ করতে হবে।
                    </p>
                    <Link href={`/register/payment?memberId=${user.id}`} className="z-10">
                      <Button className="bg-[#e2125d] hover:bg-[#c20f4f] text-white text-xs font-semibold px-4 py-1.5 h-8 rounded-lg shadow-md">
                        পেমেন্ট করুন (৳৫০০)
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="relative w-full max-w-md mx-auto aspect-[1.586/1] rounded-2xl p-6 overflow-hidden border border-amber-500/20 bg-gradient-to-br from-slate-900 to-slate-950 flex flex-col justify-center items-center text-center space-y-2.5 shadow-lg">
                    <div className="absolute inset-0 bg-background/50 backdrop-blur-[3px]" />
                    <div className="z-10 bg-amber-500/10 p-2 rounded-full border border-amber-500/20">
                      <svg className="h-6 w-6 text-amber-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="z-10 font-heading text-white font-bold text-sm">অনুমোদন পেন্ডিং</h4>
                    <p className="z-10 text-[11px] text-slate-300 max-w-xs leading-relaxed">
                      আপনার মেম্বারশিপটি বর্তমানে অনুমোদনের অপেক্ষায় রয়েছে।
                    </p>
                    {user.bkashSender && user.bkashTxnId && (
                      <div className="z-10 bg-white/5 border border-white/10 rounded-lg p-2 text-left w-full text-[10px] text-slate-300 font-mono mt-1 space-y-0.5">
                        <p><span className="text-slate-400">বিকাশ নম্বর:</span> {user.bkashSender}</p>
                        <p><span className="text-slate-400">TxnID:</span> {user.bkashTxnId}</p>
                      </div>
                    )}
                  </div>
                )}
                <div className="text-center mt-5">
                  <p className="text-xs text-muted-foreground">
                    * QR কোডটি মেম্বার ভেরিফিকেশনের জন্য সুরক্ষিতভাবে স্ক্যানযোগ্য।
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Dynamic Tabs */}
          <div className="lg:col-span-7">
            <Tabs defaultValue="history" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-muted/60 dark:bg-slate-900/60 p-1.5 rounded-xl border border-border/60">
                <TabsTrigger value="history" className="rounded-lg text-xs font-semibold py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  <History className="h-3.5 w-3.5 mr-1.5" />
                  ব্যবহারের ইতিহাস
                </TabsTrigger>
                <TabsTrigger value="profile" className="rounded-lg text-xs font-semibold py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  <LayoutDashboard className="h-3.5 w-3.5 mr-1.5" />
                  প্রোফাইল সেটিংস
                </TabsTrigger>
              </TabsList>

              {/* Transactions History Tab */}
              <TabsContent value="history" className="mt-4">
                <Card className="border-border/60 shadow-sm">
                  <CardHeader className="border-b border-border/60 bg-muted/30 dark:bg-slate-900/40">
                    <CardTitle className="font-heading text-base font-bold text-secondary dark:text-white flex items-center gap-2">
                      <History className="h-4 w-4 text-primary" />
                      কার্ড ব্যবহারের লগ
                    </CardTitle>
                    <CardDescription>
                      অংশীদার হাসপাতালে কার্ড ব্যবহার করে খরচ ও মোট সঞ্চয় বিবরণী।
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    {transactions.length > 0 ? (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-muted/40 dark:bg-slate-900/40">
                              <TableHead className="font-semibold text-secondary dark:text-white whitespace-nowrap">চিকিৎসাকেন্দ্র</TableHead>
                              <TableHead className="font-semibold text-secondary dark:text-white whitespace-nowrap">তারিখ</TableHead>
                              <TableHead className="font-semibold text-secondary dark:text-white text-right whitespace-nowrap">মূল বিল</TableHead>
                              <TableHead className="font-semibold text-primary text-right whitespace-nowrap">সাশ্রয়</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody className="text-xs sm:text-sm">
                            {transactions.map((tx) => (
                              <TableRow key={tx.id} className="hover:bg-muted/40 dark:hover:bg-slate-800/40 transition-colors">
                                <TableCell className="font-medium text-secondary dark:text-white">{tx.partnerName}</TableCell>
                                <TableCell className="text-muted-foreground">{tx.date}</TableCell>
                                <TableCell className="text-right font-mono">৳{tx.amount.toLocaleString("bn-BD")}</TableCell>
                                <TableCell className="text-right font-mono text-emerald-600 dark:text-emerald-400 font-bold">৳{tx.saved.toLocaleString("bn-BD")}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-16 text-muted-foreground">
                        <ReceiptText className="h-10 w-10 mx-auto mb-3 text-muted-foreground/40" />
                        <p className="text-sm font-medium">কোনো ট্রানজেকশন রেকর্ড নেই</p>
                        <p className="text-xs mt-1">পার্টনার হাসপাতালে কার্ড ব্যবহার করলে এখানে দেখাবে।</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Profile Settings Tab */}
              <TabsContent value="profile" className="mt-4">
                <Card className="border-border/60 shadow-sm">
                  <CardHeader className="border-b border-border/60 bg-muted/30 dark:bg-slate-900/40">
                    <CardTitle className="font-heading text-base font-bold text-secondary dark:text-white flex items-center gap-2">
                      <LayoutDashboard className="h-4 w-4 text-primary" />
                      প্রোফাইল তথ্য আপডেট
                    </CardTitle>
                    <CardDescription>
                      আপনার নাম, মোবাইল নম্বর এবং ইমেইল সেটিংস আপডেট করুন।
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    {saveSuccess && (
                      <div className="mb-4 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-xs p-3 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        <span>প্রোফাইল সফলভাবে আপডেট করা হয়েছে!</span>
                      </div>
                    )}

                    <form onSubmit={handleUpdateProfile} className="space-y-5">

                      <ImageUpload
                        value={profilePictureUrl}
                        onChange={setProfilePictureUrl}
                        label="প্রোফাইল ছবি"
                      />

                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-secondary dark:text-white">আপনার নাম *</label>
                        <Input
                          type="text"
                          required
                          value={profileName}
                          onChange={(e) => setProfileName(e.target.value)}
                          className="border-border/60 rounded-xl focus:border-primary/40"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-secondary dark:text-white">মোবাইল নম্বর *</label>
                          <Input
                            type="tel"
                            required
                            value={profilePhone}
                            onChange={(e) => setProfilePhone(e.target.value)}
                            className="border-border/60 rounded-xl focus:border-primary/40"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-secondary dark:text-white">ইমেইল ঠিকানা</label>
                          <Input
                            type="email"
                            value={profileEmail}
                            onChange={(e) => setProfileEmail(e.target.value)}
                            className="border-border/60 rounded-xl focus:border-primary/40"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-secondary dark:text-white">ঠিকানা</label>
                        <Input
                          type="text"
                          value={profileAddress}
                          onChange={(e) => setProfileAddress(e.target.value)}
                          placeholder="যেমন: মিজান রোড, ফেনী"
                          className="border-border/60 rounded-xl focus:border-primary/40"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-secondary dark:text-white">জন্ম তারিখ</label>
                          <Input
                            type="date"
                            value={profileBirthDate}
                            onChange={(e) => setProfileBirthDate(e.target.value)}
                            className="border-border/60 rounded-xl focus:border-primary/40"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-secondary dark:text-white">পেশা</label>
                          <Input
                            type="text"
                            value={profileProfession}
                            onChange={(e) => setProfileProfession(e.target.value)}
                            placeholder="যেমন: চাকুরিজীবী, ব্যবসায়ী"
                            className="border-border/60 rounded-xl focus:border-primary/40"
                          />
                        </div>
                      </div>

                      <div className="pt-1">
                        <Button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-bold gap-2 rounded-xl py-3 btn-glow">
                          <Save className="h-4 w-4" />
                          পরিবর্তন সংরক্ষণ করুন
                        </Button>
                      </div>

                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

            </Tabs>
          </div>

        </div>

      </div>
    </div>
  );
}
