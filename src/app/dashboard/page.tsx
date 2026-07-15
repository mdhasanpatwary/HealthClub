"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Heart, CreditCard, History, LayoutDashboard, Save, CheckCircle2 
} from "lucide-react";
import { dbStore } from "@/services/dbStore";
import { Member, Transaction } from "@/services/db";
import MemberCard from "@/components/ui/MemberCard";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<Member | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Profile Form States
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
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
        profileEmail
      );

      if (success) {
        // Update active session
        const updatedUser = {
          ...user,
          name: profileName,
          email: profileEmail,
          phone: profilePhone
        };
        dbStore.setCurrentUser(updatedUser);
        setUser(updatedUser);
        setSaveSuccess(true);
      } else {
        alert("প্রোফাইল আপডেট করতে সমস্যা হয়েছে।");
      }
    } catch (err) {
      console.error(err);
      alert("সার্ভার ত্রুটি।");
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
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200">
              মেম্বারশিপ সচল (ACTIVE)
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
                <MemberCard member={user} />
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
