"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Users, Building, DollarSign, Activity, Search, PlusCircle, 
  Heart, ShieldCheck, Check, Trash2, Edit3, HeartHandshake, Phone, ArrowUpRight 
} from "lucide-react";
import { dbStore } from "@/services/dbStore";
import { Member, Partner, Transaction } from "@/services/db";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function AdminDashboardPage() {
  const router = useRouter();
  
  // States
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    partnerCount: 0,
    totalSaved: 0,
    totalTransactions: 0,
    revenue: 0,
  });

  const [members, setMembers] = useState<Member[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  // Search states
  const [memberSearch, setMemberSearch] = useState("");
  const [partnerSearch, setPartnerSearch] = useState("");

  // Modals / Form states
  const [newMember, setNewMember] = useState({ name: "", phone: "", email: "", tier: "founding" as "founding" | "individual" | "family" });
  const [newPartner, setNewPartner] = useState({ name: "", category: "hospital" as Partner["category"], address: "", discount: "", phone: "", logoText: "" });
  const [newTx, setNewTx] = useState({ memberId: "", partnerId: "", amount: "" });
  const [txSuccess, setTxSuccess] = useState("");
  const [txError, setTxError] = useState("");

  // Modals open states
  const [isMemberOpen, setIsMemberOpen] = useState(false);
  const [isPartnerOpen, setIsPartnerOpen] = useState(false);
  const [isTxOpen, setIsTxOpen] = useState(false);

  // Load data
  const loadData = () => {
    // Validate if logged-in user is admin
    const currentUser = dbStore.getCurrentUser();
    if (!currentUser) {
      router.push("/login");
      return;
    }
    const isAdmin = currentUser.email === "admin@healthclub.com.bd" || currentUser.phone === "01700000000";
    if (!isAdmin) {
      router.push("/dashboard");
      return;
    }

    setStats(dbStore.getStats());
    setMembers(dbStore.getMembers());
    setPartners(dbStore.getPartners());
    setTransactions(dbStore.getTransactions());
  };

  useEffect(() => {
    loadData();
  }, [router]);

  // Handle Add Member
  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name || !newMember.phone) return;

    dbStore.addMember({
      name: newMember.name,
      phone: newMember.phone,
      email: newMember.email,
      tier: newMember.tier
    });

    setNewMember({ name: "", phone: "", email: "", tier: "founding" });
    setIsMemberOpen(false);
    loadData();
  };

  // Handle Add Partner
  const handleAddPartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartner.name || !newPartner.phone || !newPartner.discount) return;

    dbStore.addPartner({
      name: newPartner.name,
      category: newPartner.category,
      address: newPartner.address,
      discount: newPartner.discount,
      phone: newPartner.phone,
      logoText: newPartner.logoText || newPartner.name.substring(0, 5)
    });

    setNewPartner({ name: "", category: "hospital", address: "", discount: "", phone: "", logoText: "" });
    setIsPartnerOpen(false);
    loadData();
  };

  // Handle Log Transaction (Discount log)
  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    setTxSuccess("");
    setTxError("");

    if (!newTx.memberId || !newTx.partnerId || !newTx.amount) {
      setTxError("সবগুলো তথ্য প্রদান করুন।");
      return;
    }

    const member = dbStore.getMemberById(newTx.memberId);
    if (!member) {
      setTxError("প্রদত্ত সদস্য পাওয়া যায়নি (আইডি বা ফোন নম্বর পরীক্ষা করুন)।");
      return;
    }

    const partner = partners.find(p => p.id === newTx.partnerId);
    if (!partner) {
      setTxError("নির্বাচিত পার্টনার চিকিৎসাকেন্দ্র খুঁজে পাওয়া যায়নি।");
      return;
    }

    const billAmount = Number(newTx.amount);
    if (isNaN(billAmount) || billAmount <= 0) {
      setTxError("সঠিক বিলের পরিমাণ প্রদান করুন।");
      return;
    }

    // Determine savings (flat 10% discount)
    const discountRate = 0.10;
    const saved = Math.round(billAmount * discountRate);

    dbStore.addTransaction({
      memberId: member.id,
      memberName: member.name,
      partnerId: partner.id,
      partnerName: partner.name,
      amount: billAmount,
      saved: saved
    });

    setTxSuccess(`৳${saved} ডিসকাউন্ট সফলভাবে লগ করা হয়েছে।`);
    setNewTx({ memberId: "", partnerId: "", amount: "" });
    loadData();
    
    setTimeout(() => {
      setTxSuccess("");
      setIsTxOpen(false);
    }, 2000);
  };

  // Toggle member status
  const handleToggleMemberStatus = (id: string) => {
    const updated = members.map(m => {
      if (m.id === id) {
        return { ...m, status: (m.status === "active" ? "inactive" : "active") as "active" | "inactive" };
      }
      return m;
    });
    localStorage.setItem("hc_members", JSON.stringify(updated));
    loadData();
  };

  // Filter lists
  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
    m.id.toLowerCase().includes(memberSearch.toLowerCase()) ||
    m.phone.includes(memberSearch)
  );

  const filteredPartners = partners.filter(p => 
    p.name.toLowerCase().includes(partnerSearch.toLowerCase()) ||
    p.address.toLowerCase().includes(partnerSearch.toLowerCase())
  );

  return (
    <div className="bg-muted/30 min-h-screen py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-secondary dark:text-white">
              এডমিন অ্যানালিটিক্স ড্যাশবোর্ড
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              হেলথ ক্লাব মেম্বারশিপের সকল পরিসংখ্যান ও সেটিংস পরিচালনা করুন।
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={() => setIsTxOpen(true)} className="bg-primary hover:bg-primary-dark text-white font-semibold gap-2">
              <PlusCircle className="h-4 w-4" />
              ডিসকাউন্ট লগ করুন
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-border shadow-sm">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-mono tracking-wider">মোট নিবন্ধিত সদস্য</p>
                <p className="text-3xl font-extrabold text-secondary dark:text-white font-mono mt-1">{stats.totalMembers}</p>
                <p className="text-[10px] text-green-600 mt-1 font-semibold">{stats.activeMembers} জন সচল সদস্য</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Users className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-mono tracking-wider">মোট অংশীদার হাসপাতাল</p>
                <p className="text-3xl font-extrabold text-secondary dark:text-white font-mono mt-1">{stats.partnerCount}</p>
                <p className="text-[10px] text-muted-foreground mt-1">অংশীদার চিকিৎসাকেন্দ্র তালিকা</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Building className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-mono tracking-wider">মোট চিকিৎসা ছাড়</p>
                <p className="text-3xl font-extrabold text-primary font-mono mt-1">৳{stats.totalSaved.toLocaleString("bn-BD")}</p>
                <p className="text-[10px] text-muted-foreground mt-1">সদস্যদের সর্বমোট সাশ্রয়</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-primary-light text-primary flex items-center justify-center">
                <Heart className="h-6 w-6 fill-primary/10" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-mono tracking-wider">আনুমানিক রাজস্ব</p>
                <p className="text-3xl font-extrabold text-secondary dark:text-white font-mono mt-1">৳{stats.revenue.toLocaleString("bn-BD")}</p>
                <p className="text-[10px] text-muted-foreground mt-1">Individual / Family মেম্বারশিপ ফি</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <DollarSign className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dynamic SVG Analytics Chart */}
        <Card className="border-border shadow-md">
          <CardHeader>
            <CardTitle className="font-heading text-lg font-bold text-secondary">মাসিক প্রবৃদ্ধি ও অ্যানালিটিক্স</CardTitle>
            <CardDescription>২০২৬ সালের নিবন্ধিত সদস্য ও ট্রানজেকশন প্রবৃদ্ধির চিত্র রূপরেখা (SVG-based Chart)।</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="w-full h-48 bg-muted/30 rounded-xl relative border border-border/50 flex items-end p-4">
              {/* Simulated bars */}
              <div className="w-full flex justify-around items-end h-full pt-4 relative">
                
                {/* Y-axis labels */}
                <div className="absolute left-0 bottom-4 top-4 flex flex-col justify-between text-[10px] text-muted-foreground border-r border-border pr-2 pointer-events-none">
                  <span>১২০</span>
                  <span>৮০</span>
                  <span>৪০</span>
                  <span>০</span>
                </div>

                <div className="flex flex-col items-center gap-1.5 h-full justify-end w-12 ml-8">
                  <div className="w-6 bg-primary rounded-t-md transition-all duration-500 hover:opacity-90" style={{ height: "45%" }} />
                  <span className="text-[10px] font-bold font-mono">Jan</span>
                </div>

                <div className="flex flex-col items-center gap-1.5 h-full justify-end w-12">
                  <div className="w-6 bg-primary rounded-t-md transition-all duration-500 hover:opacity-90" style={{ height: "65%" }} />
                  <span className="text-[10px] font-bold font-mono">Feb</span>
                </div>

                <div className="flex flex-col items-center gap-1.5 h-full justify-end w-12">
                  <div className="w-6 bg-primary rounded-t-md transition-all duration-500 hover:opacity-90" style={{ height: "55%" }} />
                  <span className="text-[10px] font-bold font-mono">Mar</span>
                </div>

                <div className="flex flex-col items-center gap-1.5 h-full justify-end w-12">
                  <div className="w-6 bg-primary rounded-t-md transition-all duration-500 hover:opacity-90" style={{ height: "80%" }} />
                  <span className="text-[10px] font-bold font-mono">Apr</span>
                </div>

                <div className="flex flex-col items-center gap-1.5 h-full justify-end w-12">
                  <div className="w-6 bg-primary rounded-t-md transition-all duration-500 hover:opacity-90" style={{ height: "95%" }} />
                  <span className="text-[10px] font-bold font-mono">May</span>
                </div>

                <div className="flex flex-col items-center gap-1.5 h-full justify-end w-12">
                  <div className="w-6 bg-primary rounded-t-md transition-all duration-500 hover:opacity-90" style={{ height: "70%" }} />
                  <span className="text-[10px] font-bold font-mono">Jun</span>
                </div>

                <div className="flex flex-col items-center gap-1.5 h-full justify-end w-12">
                  <div className="w-6 bg-primary rounded-t-md transition-all duration-500 hover:opacity-90" style={{ height: "85%" }} />
                  <span className="text-[10px] font-bold font-mono">Jul</span>
                </div>

              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tab Interfaces */}
        <Tabs defaultValue="members" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted p-1 rounded-xl">
            <TabsTrigger value="members" className="rounded-lg text-xs font-semibold py-2">সদস্য তালিকা</TabsTrigger>
            <TabsTrigger value="partners" className="rounded-lg text-xs font-semibold py-2">পার্টনার হাসপাতালসমূহ</TabsTrigger>
            <TabsTrigger value="txs" className="rounded-lg text-xs font-semibold py-2">সাম্প্রতিক লেনদেন লগ</TabsTrigger>
          </TabsList>

          {/* 1. Members Management Tab */}
          <TabsContent value="members" className="mt-4">
            <Card className="border-border shadow-md">
              <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="font-heading text-lg font-bold text-secondary">নিবন্ধিত স্বাস্থ্য কার্ড সদস্যসমূহ</CardTitle>
                  <CardDescription>গ্রাহক তালিকা পরিচালনা, সচল/অচল অবস্থা নির্ধারণ করুন।</CardDescription>
                </div>
                
                <div className="flex gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-60">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="সদস্য খুঁজুন..."
                      value={memberSearch}
                      onChange={(e) => setMemberSearch(e.target.value)}
                      className="pl-9 h-9 border-border bg-background"
                    />
                  </div>
                  <Button onClick={() => setIsMemberOpen(true)} size="sm" className="bg-primary hover:bg-primary-dark text-white">
                    নতুন সদস্য যুক্ত করুন
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0 sm:p-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-semibold text-secondary">মেম্বার আইডি</TableHead>
                      <TableHead className="font-semibold text-secondary">নাম</TableHead>
                      <TableHead className="font-semibold text-secondary">ফোন নম্বর</TableHead>
                      <TableHead className="font-semibold text-secondary">প্ল্যান</TableHead>
                      <TableHead className="font-semibold text-secondary">মোট সাশ্রয়</TableHead>
                      <TableHead className="font-semibold text-secondary">অবস্থা</TableHead>
                      <TableHead className="font-semibold text-secondary text-right">অ্যাকশন</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="text-xs sm:text-sm">
                    {filteredMembers.map((m) => (
                      <TableRow key={m.id}>
                        <TableCell className="font-mono text-primary font-bold">{m.id}</TableCell>
                        <TableCell className="font-bold text-secondary">{m.name}</TableCell>
                        <TableCell className="font-mono">{m.phone}</TableCell>
                        <TableCell className="capitalize text-xs font-semibold">{m.tier}</TableCell>
                        <TableCell className="font-mono font-semibold">৳{(m.totalSaved || 0).toLocaleString("bn-BD")}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            m.status === "active" ? "bg-green-50 text-green-600 border border-green-200" : "bg-rose-50 text-rose-600 border border-rose-200"
                          }`}>
                            {m.status === "active" ? "সচল" : "অচল"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleToggleMemberStatus(m.id)}
                            className={`text-xs ${m.status === "active" ? "text-destructive hover:bg-destructive/10" : "text-primary hover:bg-primary-light"}`}
                          >
                            {m.status === "active" ? "অচল করুন" : "সচল করুন"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 2. Partners Management Tab */}
          <TabsContent value="partners" className="mt-4">
            <Card className="border-border shadow-md">
              <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="font-heading text-lg font-bold text-secondary">অংশীদার স্বাস্থ্যসেবা ডিরেক্টরি</CardTitle>
                  <CardDescription>চুক্তিভুক্ত হাসপাতাল, ল্যাব ও ফার্মেসী তালিকা।</CardDescription>
                </div>
                
                <div className="flex gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-60">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="পার্টনার হাসপাতাল খুঁজুন..."
                      value={partnerSearch}
                      onChange={(e) => setPartnerSearch(e.target.value)}
                      className="pl-9 h-9 border-border bg-background"
                    />
                  </div>
                  <Button onClick={() => setIsPartnerOpen(true)} size="sm" className="bg-primary hover:bg-primary-dark text-white">
                    নতুন পার্টনার হাসপাতাল
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0 sm:p-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-semibold text-secondary">নাম</TableHead>
                      <TableHead className="font-semibold text-secondary">ক্যাটাগরি</TableHead>
                      <TableHead className="font-semibold text-secondary">ঠিকানা</TableHead>
                      <TableHead className="font-semibold text-primary">ডিসকাউন্ট হার</TableHead>
                      <TableHead className="font-semibold text-secondary">হটলাইন নম্বর</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="text-xs sm:text-sm">
                    {filteredPartners.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-bold text-secondary">{p.name}</TableCell>
                        <TableCell className="capitalize text-xs font-semibold">{p.category}</TableCell>
                        <TableCell className="text-muted-foreground">{p.address}</TableCell>
                        <TableCell className="font-bold text-primary font-heading">{p.discount}</TableCell>
                        <TableCell className="font-mono text-xs">{p.phone}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 3. Transactions Log Tab */}
          <TabsContent value="txs" className="mt-4">
            <Card className="border-border shadow-md">
              <CardHeader>
                <CardTitle className="font-heading text-lg font-bold text-secondary">সাম্প্রতিক ডিসকাউন্ট ট্রানজেকশন</CardTitle>
                <CardDescription>হাসপাতাল ভ্যালিডেশন কোড ও ডিসকাউন্ট সাশ্রয় বিবরণী লগ।</CardDescription>
              </CardHeader>
              <CardContent className="p-0 sm:p-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-semibold text-secondary">সদস্যের নাম</TableHead>
                      <TableHead className="font-semibold text-secondary">চিকিৎসাকেন্দ্র</TableHead>
                      <TableHead className="font-semibold text-secondary">তারিখ</TableHead>
                      <TableHead className="font-semibold text-secondary text-right">মোট বিল</TableHead>
                      <TableHead className="font-semibold text-primary text-right">সাশ্রয়</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="text-xs sm:text-sm">
                    {transactions.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell className="font-semibold text-secondary">
                          {t.memberName}
                          <span className="block text-[10px] text-muted-foreground font-mono font-normal">{t.memberId}</span>
                        </TableCell>
                        <TableCell className="text-secondary">{t.partnerName}</TableCell>
                        <TableCell className="text-muted-foreground">{t.date}</TableCell>
                        <TableCell className="text-right font-mono">৳{t.amount.toLocaleString("bn-BD")}</TableCell>
                        <TableCell className="text-right font-mono text-primary font-bold">৳{t.saved.toLocaleString("bn-BD")}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>

        {/* --- MODAL DIALOGS --- */}

        {/* Add Member Modal */}
        {isMemberOpen && (
          <Dialog open={isMemberOpen} onOpenChange={setIsMemberOpen}>
            <DialogContent className="border-border bg-background">
              <DialogHeader>
                <DialogTitle className="font-heading font-bold text-secondary">নতুন সদস্য যুক্ত করুন</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddMember} className="space-y-4 pt-2">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-secondary">নাম *</label>
                  <Input type="text" required placeholder="যেমন: মোঃ আব্দুর রহমান" value={newMember.name} onChange={e => setNewMember({...newMember, name: e.target.value})} className="border-border bg-background" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-secondary">মোবাইল নম্বর *</label>
                  <Input type="tel" required placeholder="যেমন: 017XXXXXXXX" value={newMember.phone} onChange={e => setNewMember({...newMember, phone: e.target.value})} className="border-border bg-background" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-secondary">ইমেইল ঠিকানা</label>
                  <Input type="email" placeholder="যেমন: arahman@gmail.com" value={newMember.email} onChange={e => setNewMember({...newMember, email: e.target.value})} className="border-border bg-background" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-secondary">মেম্বারশিপ প্ল্যান *</label>
                  <select value={newMember.tier} onChange={e => setNewMember({...newMember, tier: e.target.value as any})} className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary">
                    <option value="founding">Founding Member (ফ্রী ১ বছর)</option>
                    <option value="individual">Individual Plan (৳৫০০ / বাৎসরিক)</option>
                    <option value="family">Family Plan (৳১,৫০০ / বাৎসরিক)</option>
                  </select>
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-semibold">সংরক্ষণ করুন</Button>
              </form>
            </DialogContent>
          </Dialog>
        )}

        {/* Add Partner Modal */}
        {isPartnerOpen && (
          <Dialog open={isPartnerOpen} onOpenChange={setIsPartnerOpen}>
            <DialogContent className="border-border bg-background">
              <DialogHeader>
                <DialogTitle className="font-heading font-bold text-secondary">নতুন পার্টনার হাসপাতাল যুক্ত করুন</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddPartner} className="space-y-4 pt-2">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-secondary">হাসপাতাল/ল্যাবের নাম *</label>
                  <Input type="text" required placeholder="যেমন: ইবনে সিনা ল্যাব" value={newPartner.name} onChange={e => setNewPartner({...newPartner, name: e.target.value})} className="border-border bg-background" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-secondary">ক্যাটাগরি *</label>
                    <select value={newPartner.category} onChange={e => setNewPartner({...newPartner, category: e.target.value as any})} className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary">
                      <option value="hospital">হাসপাতাল (Hospital)</option>
                      <option value="diagnostic">ডায়াগনস্টিক সেন্টার</option>
                      <option value="pharmacy">ফার্মেসী (Pharmacy)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-secondary">ডিসকাউন্টের হার *</label>
                    <Input type="text" required placeholder="যেমন: ১৫% ল্যাব টেস্টে" value={newPartner.discount} onChange={e => setNewPartner({...newPartner, discount: e.target.value})} className="border-border bg-background" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-secondary">ঠিকানা *</label>
                  <Input type="text" required placeholder="যেমন: মিজান রোড, ফেনী" value={newPartner.address} onChange={e => setNewPartner({...newPartner, address: e.target.value})} className="border-border bg-background" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-secondary">হটলাইন নম্বর *</label>
                    <Input type="text" required placeholder="যেমন: ০৯৬১৩৭৮৭৮০১" value={newPartner.phone} onChange={e => setNewPartner({...newPartner, phone: e.target.value})} className="border-border bg-background" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-secondary">লোগো সংক্ষিপ্ত টেক্সট</label>
                    <Input type="text" placeholder="যেমন: Ibn Sina" value={newPartner.logoText} onChange={e => setNewPartner({...newPartner, logoText: e.target.value})} className="border-border bg-background" />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-semibold">পার্টনার সংরক্ষণ করুন</Button>
              </form>
            </DialogContent>
          </Dialog>
        )}

        {/* Log Transaction (Log Discount) Modal */}
        {isTxOpen && (
          <Dialog open={isTxOpen} onOpenChange={setIsTxOpen}>
            <DialogContent className="border-border bg-background">
              <DialogHeader>
                <DialogTitle className="font-heading font-bold text-secondary">সদস্য ডিসকাউন্ট লগ করুন</DialogTitle>
              </DialogHeader>
              
              {txSuccess && (
                <div className="bg-green-50 text-green-600 text-xs p-3 rounded-lg border border-green-200">
                  {txSuccess}
                </div>
              )}
              {txError && (
                <div className="bg-rose-50 text-rose-600 text-xs p-3 rounded-lg border border-rose-200">
                  {txError}
                </div>
              )}

              <form onSubmit={handleAddTransaction} className="space-y-4 pt-2">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-secondary">সদস্যের মেম্বার আইডি বা মোবাইল নম্বর *</label>
                  <Input type="text" required placeholder="যেমন: HC-1001 বা 01711112222" value={newTx.memberId} onChange={e => setNewTx({...newTx, memberId: e.target.value})} className="border-border bg-background" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-secondary">অংশীদার চিকিৎসাকেন্দ্র *</label>
                  <select value={newTx.partnerId} onChange={e => setNewTx({...newTx, partnerId: e.target.value})} className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary">
                    <option value="">হাসপাতাল/ল্যাব নির্বাচন করুন</option>
                    {partners.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.discount})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-secondary">মূল বিলের পরিমাণ (BDT) *</label>
                  <Input type="number" required placeholder="যেমন: ৫০০০" value={newTx.amount} onChange={e => setNewTx({...newTx, amount: e.target.value})} className="border-border bg-background" />
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-semibold">ডিসকাউন্ট কার্যকর ও লগ করুন</Button>
              </form>
            </DialogContent>
          </Dialog>
        )}

      </div>
    </div>
  );
}
