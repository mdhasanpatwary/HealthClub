"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Heart, CreditCard, History, LayoutDashboard, Save, CheckCircle2 
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
    
    // Refresh user state from database to ensure up-to-date details
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

    // Load user specific transactions
    dbStore.getTransactions().then((allTx) => {
      const userTx = allTx.filter(t => t.memberId === currentUser.id);
      setTransactions(userTx);
    });
  }, [router]);

  // Handle Profile Update
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
        // Update active session
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
        toast.error("প্রোফাইল আপডেট করতে সমস্যা হয়েছে।");
      }
    } catch (err) {
      console.error(err);
      toast.error("সার্ভার ত্রুটি।");
    }

    setTimeout(() => setSaveSuccess(false), 3000);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-muted-foreground">
        লোডিং হচ্ছে...
      </div>
    );
  }

  // Stats Computations
  const totalSaved = user.totalSaved || 0;
  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="bg-muted/30 min-h-screen py-6 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* Welcome Banner */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-border pb-5">
          <div>
            <h1 className="font-heading text-xl sm:text-3xl font-bold text-secondary dark:text-white">
              স্বাগতম, {user.name}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              মেম্বার আইডি: <span className="font-mono font-semibold text-primary">{user.id}</span>
              <span className="mx-1.5 text-border">|</span>
              প্ল্যান: <span className="capitalize font-semibold text-secondary">{user.tier} Member</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${
              user.status === 'active' 
                ? 'bg-green-500 animate-pulse' 
                : user.status === 'pending_payment'
                ? 'bg-rose-500 animate-pulse'
                : 'bg-amber-500 animate-bounce'
            }`} />
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
              user.status === 'active' 
                ? 'bg-green-50 text-green-600 border-green-200' 
                : user.status === 'pending_payment'
                ? 'bg-rose-50 text-rose-600 border-rose-200'
                : 'bg-amber-50 text-amber-600 border-amber-200'
            }`}>
              {user.status === 'active' 
                ? 'মেম্বারশিপ সচল (ACTIVE)' 
                : user.status === 'pending_payment'
                ? 'পেমেন্ট পেন্ডিং (PENDING PAYMENT)'
                : 'অনুমোদনের অপেক্ষায় (PENDING APPROVAL)'}
            </span>
          </div>
        </div>

        {/* Overview Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          
          <Card className="border-border shadow-sm">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-mono tracking-wider">মোট চিকিৎসা সাশ্রয়</p>
                <p className="text-3xl font-extrabold text-primary font-mono mt-1">৳{totalSaved.toLocaleString("bn-BD")}</p>
                <p className="text-[10px] text-muted-foreground mt-1">হেলথ ক্লাব ব্যবহারে সঞ্চয়</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-primary-light text-primary flex items-center justify-center">
                <Heart className="h-6 w-6 fill-primary/10" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-mono tracking-wider">মোট চিকিৎসা খরচ</p>
                <p className="text-3xl font-extrabold text-secondary dark:text-white font-mono mt-1">৳{totalSpent.toLocaleString("bn-BD")}</p>
                <p className="text-[10px] text-muted-foreground mt-1">পার্টনার হাসপাতালে ব্যয়</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-secondary flex items-center justify-center">
                <History className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-mono tracking-wider">মোট ট্রানজেকশন</p>
                <p className="text-3xl font-extrabold text-secondary dark:text-white font-mono mt-1">{transactions.length} টি</p>
                <p className="text-[10px] text-muted-foreground mt-1">সেবা কার্ড ব্যবহারের সংখ্যা</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-secondary flex items-center justify-center">
                <LayoutDashboard className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Main Dashboard Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Digital Card (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="border-border shadow-md overflow-hidden bg-background">
              <CardHeader className="border-b border-border pb-4">
                <CardTitle className="font-heading text-lg font-bold text-secondary flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  ডিজিটাল মেম্বারশিপ কার্ড
                </CardTitle>
                <CardDescription>
                  হাসপাতালে ডিসকাউন্ট দাবি করতে এই কার্ডটি ও এর কিউআর কোড কাউন্টারে প্রদর্শন করুন।
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
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
                      অ্যাকাউন্ট সক্রিয় করতে ৫০০ টাকা বাৎসরিক মেম্বারশিপ ফি পরিশোধ করতে হবে।
                    </p>
                    <Link href={`/register/payment?memberId=${user.id}`} className="z-10">
                      <Button className="bg-[#e2125d] hover:bg-[#c20f4f] text-white text-xs font-semibold px-4 py-1.5 h-8 rounded-lg shadow-md transition-all">
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
                      আপনার মেম্বারশিপটি বর্তমানে অনুমোদনের অপেক্ষায় রয়েছে। এডমিন এটি যাচাই করে সক্রিয় করার পর আপনার মেম্বারশিপ কার্ড ও কিউআর কোড সচল হবে।
                    </p>
                    {user.bkashSender && user.bkashTxnId && (
                      <div className="z-10 bg-white/5 border border-white/10 rounded-lg p-2 text-left w-full text-[10px] text-slate-300 font-mono mt-1 space-y-0.5">
                        <p><span className="text-slate-400">বিকাশ নম্বর:</span> {user.bkashSender}</p>
                        <p><span className="text-slate-400">TxnID:</span> {user.bkashTxnId}</p>
                      </div>
                    )}
                  </div>
                )}
                <div className="text-center mt-6">
                  <p className="text-xs text-muted-foreground">
                    * মেম্বার ভেরিফিকেশনের জন্য কিউআর কোডটি সুরক্ষিতভাবে স্ক্যানযোগ্য।
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Dynamic Tabs (7 cols) */}
          <div className="lg:col-span-7">
            <Tabs defaultValue="history" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-muted p-1 rounded-xl">
                <TabsTrigger value="history" className="rounded-lg text-xs font-semibold py-2">
                  ব্যবহারের ইতিহাস
                </TabsTrigger>
                <TabsTrigger value="profile" className="rounded-lg text-xs font-semibold py-2">
                  প্রোফাইল সেটিংস
                </TabsTrigger>
              </TabsList>

              {/* Transactions History Tab */}
              <TabsContent value="history" className="mt-4">
                <Card className="border-border shadow-md">
                  <CardHeader>
                    <CardTitle className="font-heading text-lg font-bold text-secondary">
                      কার্ড ব্যবহারের লগ (Usage History)
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
                            <TableRow>
                              <TableHead className="font-semibold text-secondary whitespace-nowrap">চিকিৎসাকেন্দ্র</TableHead>
                              <TableHead className="font-semibold text-secondary whitespace-nowrap">তারিখ</TableHead>
                              <TableHead className="font-semibold text-secondary text-right whitespace-nowrap">মূল বিল</TableHead>
                              <TableHead className="font-semibold text-primary text-right whitespace-nowrap">ডিসকাউন্ট/সাশ্রয়</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody className="text-xs sm:text-sm">
                            {transactions.map((tx) => (
                              <TableRow key={tx.id}>
                                <TableCell className="font-medium text-secondary">{tx.partnerName}</TableCell>
                                <TableCell className="text-muted-foreground">{tx.date}</TableCell>
                                <TableCell className="text-right font-mono">৳{tx.amount.toLocaleString("bn-BD")}</TableCell>
                                <TableCell className="text-right font-mono text-primary font-bold">৳{tx.saved.toLocaleString("bn-BD")}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground text-sm">
                        কোনো পূর্ববর্তী ট্রানজেকশন রেকর্ড পাওয়া যায়নি।
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Profile Settings Tab */}
              <TabsContent value="profile" className="mt-4">
                <Card className="border-border shadow-md">
                  <CardHeader>
                    <CardTitle className="font-heading text-lg font-bold text-secondary">
                      প্রোফাইল তথ্য আপডেট
                    </CardTitle>
                    <CardDescription>
                      আপনার নাম, মোবাইল নম্বর এবং ইমেইল সেটিংস আপডেট করুন।
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    {saveSuccess && (
                      <div className="mb-4 bg-green-50 text-green-600 text-xs p-3 rounded-lg border border-green-200 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />
                        <span>প্রোফাইল সফলভাবে আপডেট করা হয়েছে!</span>
                      </div>
                    )}

                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                      
                      <ImageUpload
                        value={profilePictureUrl}
                        onChange={setProfilePictureUrl}
                        label="প্রোফাইল ছবি"
                      />

                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-secondary">আপনার নাম *</label>
                        <Input
                          type="text"
                          required
                          value={profileName}
                          onChange={(e) => setProfileName(e.target.value)}
                          className="border-border"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-secondary">মোবাইল নম্বর *</label>
                          <Input
                            type="tel"
                            required
                            value={profilePhone}
                            onChange={(e) => setProfilePhone(e.target.value)}
                            className="border-border"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-secondary">ইমেইল ঠিকানা</label>
                          <Input
                            type="email"
                            value={profileEmail}
                            onChange={(e) => setProfileEmail(e.target.value)}
                            className="border-border"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-secondary">ঠিকানা</label>
                        <Input
                          type="text"
                          value={profileAddress}
                          onChange={(e) => setProfileAddress(e.target.value)}
                          placeholder="যেমন: মিজান রোড, ফেনী"
                          className="border-border"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-secondary">জন্ম তারিখ</label>
                          <Input
                            type="date"
                            value={profileBirthDate}
                            onChange={(e) => setProfileBirthDate(e.target.value)}
                            className="border-border"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-secondary">পেশা</label>
                          <Input
                            type="text"
                            value={profileProfession}
                            onChange={(e) => setProfileProfession(e.target.value)}
                            placeholder="যেমন: চাকুরিজীবী, ব্যবসায়ী, শিক্ষার্থী"
                            className="border-border"
                          />
                        </div>
                      </div>

                      <div className="pt-2">
                        <Button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-semibold gap-2">
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
