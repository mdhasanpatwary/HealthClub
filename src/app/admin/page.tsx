"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Users, Building, DollarSign, Search, PlusCircle,
  Heart, Trash2, Edit3, User, Mail, Phone, Calendar,
  History as HistoryIcon, MapPin, Briefcase
} from "lucide-react";
import { dbStore } from "@/services/dbStore";
import { Member, Partner, Transaction } from "@/services/db";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
  const [newMember, setNewMember] = useState({
    name: "",
    phone: "",
    email: "",
    tier: "founding" as "founding" | "individual" | "family",
    address: "",
    birthDate: "",
    profession: "",
    profilePictureUrl: ""
  });
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [newPartner, setNewPartner] = useState({ name: "", category: "hospital" as Partner["category"], address: "", discount: "", phone: "", logoText: "", mapLink: "" });
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [newTx, setNewTx] = useState({ memberId: "", partnerId: "", amount: "" });
  const [txSuccess, setTxSuccess] = useState("");
  const [txError, setTxError] = useState("");

  // Modals open states
  const [isMemberOpen, setIsMemberOpen] = useState(false);
  const [isPartnerOpen, setIsPartnerOpen] = useState(false);
  const [isTxOpen, setIsTxOpen] = useState(false);
  const [viewingMember, setViewingMember] = useState<Member | null>(null);

  // Load data
  const loadData = async () => {
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

    try {
      const [statsRes, membersRes, partnersRes, transactionsRes] = await Promise.all([
        dbStore.getStats(),
        dbStore.getMembers(),
        dbStore.getPartners(),
        dbStore.getTransactions()
      ]);
      setStats(statsRes);
      setMembers(membersRes);
      setPartners(partnersRes);
      setTransactions(transactionsRes);
    } catch (error) {
      console.error("Error loading data in admin dashboard:", error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  // Handle Save Member (Add/Edit)
  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name || !newMember.phone) return;

    try {
      if (editingMember) {
        // Edit mode
        const success = await dbStore.updateMember(editingMember.id, {
          name: newMember.name,
          phone: newMember.phone,
          email: newMember.email,
          tier: newMember.tier,
          address: newMember.address,
          birthDate: newMember.birthDate,
          profession: newMember.profession,
          profilePictureUrl: newMember.profilePictureUrl
        });
        if (!success) throw new Error("Update failed");
      } else {
        // Add mode
        await dbStore.addMember({
          name: newMember.name,
          phone: newMember.phone,
          email: newMember.email,
          tier: newMember.tier,
          address: newMember.address,
          birthDate: newMember.birthDate,
          profession: newMember.profession,
          profilePictureUrl: newMember.profilePictureUrl
        });
      }

      setNewMember({ name: "", phone: "", email: "", tier: "founding", address: "", birthDate: "", profession: "", profilePictureUrl: "" });
      setEditingMember(null);
      setIsMemberOpen(false);
      loadData();
      toast.success(editingMember ? "সদস্য তথ্য সফলভাবে আপডেট করা হয়েছে।" : "সদস্য সফলভাবে যোগ করা হয়েছে।");
    } catch {
      toast.error(editingMember ? "সদস্য তথ্য আপডেট করতে ব্যর্থ হয়েছে।" : "সদস্য যোগ করতে ব্যর্থ হয়েছে।");
    }
  };

  // Handle Delete Member
  const handleDeleteMember = async (id: string, name: string) => {
    if (confirm(`আপনি কি নিশ্চিতভাবে "${name}" সদস্যকে ডিলিট করতে চান? ডিলিট করলে তার সকল ডিসকাউন্ট ট্রানজেকশনও মুছে যাবে।`)) {
      try {
        const success = await dbStore.deleteMember(id);
        if (success) {
          toast.success("সদস্য সফলভাবে ডিলিট করা হয়েছে।");
          loadData();
        } else {
          toast.error("সদস্য ডিলিট করতে ব্যর্থ হয়েছে।");
        }
      } catch {
        toast.error("সদস্য ডিলিট করতে ব্যর্থ হয়েছে।");
      }
    }
  };

  // Handle Save Partner (Add/Edit)
  const handleSavePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartner.name || !newPartner.phone || !newPartner.discount) return;

    try {
      if (editingPartner) {
        // Edit mode
        const success = await dbStore.updatePartner(editingPartner.id, {
          name: newPartner.name,
          category: newPartner.category,
          address: newPartner.address,
          discount: newPartner.discount,
          phone: newPartner.phone,
          logoText: newPartner.logoText || newPartner.name.substring(0, 5),
          mapLink: newPartner.mapLink
        });
        if (!success) throw new Error("Update failed");
      } else {
        // Add mode
        await dbStore.addPartner({
          name: newPartner.name,
          category: newPartner.category,
          address: newPartner.address,
          discount: newPartner.discount,
          phone: newPartner.phone,
          logoText: newPartner.logoText || newPartner.name.substring(0, 5),
          mapLink: newPartner.mapLink
        });
      }

      setNewPartner({ name: "", category: "hospital", address: "", discount: "", phone: "", logoText: "", mapLink: "" });
      setEditingPartner(null);
      setIsPartnerOpen(false);
      loadData();
      toast.success(editingPartner ? "পার্টনার সফলভাবে আপডেট করা হয়েছে।" : "পার্টনার সফলভাবে যোগ করা হয়েছে।");
    } catch {
      toast.error(editingPartner ? "পার্টনার আপডেট করতে ব্যর্থ হয়েছে।" : "পার্টনার যোগ করতে ব্যর্থ হয়েছে।");
    }
  };

  // Handle Delete Partner
  const handleDeletePartner = async (id: string, name: string) => {
    if (confirm(`আপনি কি নিশ্চিতভাবে "${name}" পার্টনারটি ডিলিট করতে চান?`)) {
      try {
        const success = await dbStore.deletePartner(id);
        if (success) {
          toast.success("পার্টনার সফলভাবে ডিলিট করা হয়েছে।");
          loadData();
        } else {
          toast.error("পার্টনার ডিলিট করতে ব্যর্থ হয়েছে।");
        }
      } catch {
        toast.error("পার্টনার ডিলিট করতে ব্যর্থ হয়েছে।");
      }
    }
  };

  // Handle Log Transaction (Discount log)
  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setTxSuccess("");
    setTxError("");

    if (!newTx.memberId || !newTx.partnerId || !newTx.amount) {
      setTxError("সবগুলো তথ্য প্রদান করুন।");
      return;
    }

    try {
      const member = await dbStore.getMemberById(newTx.memberId);
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

      await dbStore.addTransaction({
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
    } catch {
      setTxError("ট্রানজেকশন লগ করতে সমস্যা হয়েছে।");
    }
  };

  // Toggle member status
  const handleToggleMemberStatus = async (id: string) => {
    const member = members.find(m => m.id === id);
    if (!member) return;

    const newStatus = member.status === "active" ? "inactive" : "active";
    const success = await dbStore.updateMemberStatus(id, newStatus);
    if (success) {
      toast.success("সদস্যের স্ট্যাটাস সফলভাবে আপডেট করা হয়েছে।");
      loadData();
    } else {
      toast.error("সদস্যের স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে।");
    }
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
    <div className="bg-muted/30 min-h-screen py-6 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">

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

          <div className="flex flex-wrap gap-2 mt-1 sm:mt-0">
            <Button onClick={() => setIsTxOpen(true)} className="bg-primary hover:bg-primary-dark text-white font-semibold gap-2" size="sm">
              <PlusCircle className="h-4 w-4" />
              <span className="hidden xs:inline">ডিসকাউন্ট</span> লগ করুন
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
            <TabsTrigger value="partners" className="rounded-lg text-xs font-semibold py-2">পার্টনার হাসপাতাল</TabsTrigger>
            <TabsTrigger value="txs" className="rounded-lg text-xs font-semibold py-2">লেনদেন লগ</TabsTrigger>
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
                  <Button onClick={() => {
                    setEditingMember(null);
                    setNewMember({ name: "", phone: "", email: "", tier: "founding", address: "", birthDate: "", profession: "", profilePictureUrl: "" });
                    setIsMemberOpen(true);
                  }} size="sm" className="bg-primary hover:bg-primary-dark text-white">
                    নতুন সদস্য
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-semibold text-secondary whitespace-nowrap">মেম্বার আইডি</TableHead>
                        <TableHead className="font-semibold text-secondary whitespace-nowrap">নাম</TableHead>
                        <TableHead className="font-semibold text-secondary whitespace-nowrap">ফোন নম্বর</TableHead>
                        <TableHead className="font-semibold text-secondary whitespace-nowrap">প্ল্যান</TableHead>
                        <TableHead className="font-semibold text-secondary whitespace-nowrap">মোট সাশ্রয়</TableHead>
                        <TableHead className="font-semibold text-secondary whitespace-nowrap">অবস্থা</TableHead>
                        <TableHead className="font-semibold text-secondary text-right whitespace-nowrap">অ্যাকশন</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="text-xs sm:text-sm">
                      {filteredMembers.map((m) => (
                        <TableRow 
                          key={m.id} 
                          onClick={() => setViewingMember(m)} 
                          className="cursor-pointer hover:bg-muted/50 transition-colors"
                        >
                          <TableCell className="font-mono text-primary font-bold whitespace-nowrap">{m.id}</TableCell>
                          <TableCell className="font-bold text-secondary whitespace-nowrap">
                            <div className="flex items-center gap-2.5">
                              <div className="h-8 w-8 rounded-full border border-border bg-muted/40 overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
                                {m.profilePictureUrl ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={m.profilePictureUrl} alt={m.name} className="h-full w-full object-cover" />
                                ) : (
                                  <User className="h-4 w-4 text-muted-foreground" />
                                )}
                              </div>
                              <div>
                                <span>{m.name}</span>
                                {m.email && <span className="block text-[10px] text-muted-foreground font-normal font-mono">{m.email}</span>}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono whitespace-nowrap">{m.phone}</TableCell>
                          <TableCell className="capitalize text-xs font-semibold whitespace-nowrap">
                            {m.tier === "founding" ? "Founding (ফ্রী)" : m.tier === "individual" ? "Individual" : "Family"}
                          </TableCell>
                          <TableCell className="font-mono font-semibold whitespace-nowrap">৳{(m.totalSaved || 0).toLocaleString("bn-BD")}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${m.status === "active" ? "bg-green-50 text-green-600 border border-green-200" : "bg-rose-50 text-rose-600 border border-rose-200"
                              }`}>
                              {m.status === "active" ? "সচল" : "অচল"}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleMemberStatus(m.id);
                                }}
                                className={`text-[10px] h-8 px-2.5 font-bold ${m.status === "active" ? "text-rose-600 hover:bg-rose-50" : "text-primary hover:bg-primary-light"}`}
                              >
                                {m.status === "active" ? "অচল করুন" : "সচল করুন"}
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingMember(m);
                                  setNewMember({
                                    name: m.name,
                                    phone: m.phone,
                                    email: m.email || "",
                                    tier: m.tier,
                                    address: m.address || "",
                                    birthDate: m.birthDate || "",
                                    profession: m.profession || "",
                                    profilePictureUrl: m.profilePictureUrl || ""
                                  });
                                  setIsMemberOpen(true);
                                }}
                                className="h-8 w-8 text-primary hover:text-primary-dark hover:bg-primary-light"
                              >
                                <Edit3 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteMember(m.id, m.name);
                                }}
                                className="h-8 w-8 text-destructive hover:text-rose-600 hover:bg-rose-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
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
                  <Button onClick={() => {
                    setEditingPartner(null);
                    setNewPartner({ name: "", category: "hospital", address: "", discount: "", phone: "", logoText: "", mapLink: "" });
                    setIsPartnerOpen(true);
                  }} size="sm" className="bg-primary hover:bg-primary-dark text-white">
                    নতুন পার্টনার হাসপাতাল
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-semibold text-secondary whitespace-nowrap">নাম</TableHead>
                        <TableHead className="font-semibold text-secondary whitespace-nowrap">ক্যাটাগরি</TableHead>
                        <TableHead className="font-semibold text-secondary">ঠিকানা</TableHead>
                        <TableHead className="font-semibold text-primary whitespace-nowrap">ডিসকাউন্ট হার</TableHead>
                        <TableHead className="font-semibold text-secondary whitespace-nowrap">হটলাইন নম্বর</TableHead>
                        <TableHead className="font-semibold text-secondary text-right whitespace-nowrap">অ্যাকশন</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="text-xs sm:text-sm">
                      {filteredPartners.map((p) => (
                        <TableRow key={p.id}>
                          <TableCell className="font-bold text-secondary whitespace-nowrap">{p.name}</TableCell>
                          <TableCell className="capitalize text-xs font-semibold whitespace-nowrap">
                            {p.category === "hospital" ? "হাসপাতাল" : p.category === "diagnostic" ? "ডায়াগনস্টিক" : "ফার্মেসী"}
                          </TableCell>
                          <TableCell className="text-muted-foreground">{p.address}</TableCell>
                          <TableCell className="font-bold text-primary font-heading whitespace-nowrap">{p.discount}</TableCell>
                          <TableCell className="font-mono text-xs whitespace-nowrap">{p.phone}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setEditingPartner(p);
                                  setNewPartner({
                                    name: p.name,
                                    category: p.category,
                                    address: p.address,
                                    discount: p.discount,
                                    phone: p.phone,
                                    logoText: p.logoText || "",
                                    mapLink: p.mapLink || ""
                                  });
                                  setIsPartnerOpen(true);
                                }}
                                className="h-8 w-8 text-primary hover:text-primary-dark hover:bg-primary-light"
                              >
                                <Edit3 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeletePartner(p.id, p.name)}
                                className="h-8 w-8 text-destructive hover:text-rose-600 hover:bg-rose-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
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
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-semibold text-secondary whitespace-nowrap">সদস্যের নাম</TableHead>
                        <TableHead className="font-semibold text-secondary whitespace-nowrap">চিকিৎসাকেন্দ্র</TableHead>
                        <TableHead className="font-semibold text-secondary whitespace-nowrap">তারিখ</TableHead>
                        <TableHead className="font-semibold text-secondary text-right whitespace-nowrap">মোট বিল</TableHead>
                        <TableHead className="font-semibold text-primary text-right whitespace-nowrap">সাশ্রয়</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="text-xs sm:text-sm">
                      {transactions.map((t) => (
                        <TableRow key={t.id}>
                          <TableCell className="font-semibold text-secondary whitespace-nowrap">
                            {t.memberName}
                            <span className="block text-[10px] text-muted-foreground font-mono font-normal">{t.memberId}</span>
                          </TableCell>
                          <TableCell className="text-secondary whitespace-nowrap">{t.partnerName}</TableCell>
                          <TableCell className="text-muted-foreground whitespace-nowrap">{t.date}</TableCell>
                          <TableCell className="text-right font-mono whitespace-nowrap">৳{t.amount.toLocaleString("bn-BD")}</TableCell>
                          <TableCell className="text-right font-mono text-primary font-bold whitespace-nowrap">৳{t.saved.toLocaleString("bn-BD")}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>

        {/* --- MODAL DIALOGS --- */}

        {/* Add/Edit Member Modal */}
        {isMemberOpen && (
          <Dialog open={isMemberOpen} onOpenChange={(open) => {
            setIsMemberOpen(open);
            if (!open) {
              setEditingMember(null);
              setNewMember({ name: "", phone: "", email: "", tier: "founding", address: "", birthDate: "", profession: "", profilePictureUrl: "" });
            }
          }}>
            <DialogContent className="border-border bg-background">
              <DialogHeader>
                <DialogTitle className="font-heading font-bold text-secondary">
                  {editingMember ? "সদস্য তথ্য পরিবর্তন করুন" : "নতুন সদস্য যুক্ত করুন"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSaveMember} className="space-y-4 pt-2">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-secondary">প্রোফাইল ছবি</label>
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-xl border border-border bg-muted/40 overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
                      {newMember.profilePictureUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={newMember.profilePictureUrl} alt="Preview" className="h-full w-full object-cover" />
                      ) : (
                        <User className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 2 * 1024 * 1024) {
                              toast.error("ছবির সাইজ ২ মেগাবাইটের বেশি হওয়া যাবে না।");
                              e.target.value = "";
                              return;
                            }
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setNewMember({ ...newMember, profilePictureUrl: reader.result as string });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="border-border bg-background text-xs cursor-pointer file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                      />
                      {newMember.profilePictureUrl && (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setNewMember({ ...newMember, profilePictureUrl: "" })}
                          className="text-[10px] text-rose-600 hover:text-rose-700 p-0 h-auto mt-1"
                        >
                          ছবি মুছে ফেলুন
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-secondary">নাম *</label>
                  <Input type="text" required placeholder="যেমন: মোঃ আব্দুর রহমান" value={newMember.name} onChange={e => setNewMember({ ...newMember, name: e.target.value })} className="border-border bg-background" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-secondary">মোবাইল নম্বর *</label>
                  <Input type="tel" required placeholder="যেমন: 017XXXXXXXX" value={newMember.phone} onChange={e => setNewMember({ ...newMember, phone: e.target.value })} className="border-border bg-background" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-secondary">ইমেইল ঠিকানা</label>
                  <Input type="email" placeholder="যেমন: arahman@gmail.com" value={newMember.email} onChange={e => setNewMember({ ...newMember, email: e.target.value })} className="border-border bg-background" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-secondary">মেম্বারশিপ প্ল্যান *</label>
                  <select value={newMember.tier} onChange={e => setNewMember({ ...newMember, tier: e.target.value as Member["tier"] })} className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary">
                    <option value="founding">Founding Member (ফ্রী ১ বছর)</option>
                    <option value="individual">Individual Plan (৳৫০০ / বাৎসরিক)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-secondary">ঠিকানা</label>
                  <Input type="text" placeholder="যেমন: মিজান রোড, ফেনী" value={newMember.address} onChange={e => setNewMember({ ...newMember, address: e.target.value })} className="border-border bg-background" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-secondary">জন্ম তারিখ</label>
                    <Input type="date" value={newMember.birthDate} onChange={e => setNewMember({ ...newMember, birthDate: e.target.value })} className="border-border bg-background" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-secondary">পেশা</label>
                    <Input type="text" placeholder="যেমন: চাকুরিজীবী, ব্যবসায়ী, শিক্ষার্থী" value={newMember.profession} onChange={e => setNewMember({ ...newMember, profession: e.target.value })} className="border-border bg-background" />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-semibold">
                  {editingMember ? "পরিবর্তন সংরক্ষণ করুন" : "সংরক্ষণ করুন"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}

        {/* Add/Edit Partner Modal */}
        {isPartnerOpen && (
          <Dialog open={isPartnerOpen} onOpenChange={(open) => {
            setIsPartnerOpen(open);
            if (!open) {
              setEditingPartner(null);
              setNewPartner({ name: "", category: "hospital", address: "", discount: "", phone: "", logoText: "", mapLink: "" });
            }
          }}>
            <DialogContent className="border-border bg-background">
              <DialogHeader>
                <DialogTitle className="font-heading font-bold text-secondary">
                  {editingPartner ? "পার্টনার হাসপাতাল তথ্য পরিবর্তন করুন" : "নতুন পার্টনার হাসপাতাল যুক্ত করুন"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSavePartner} className="space-y-4 pt-2">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-secondary">হাসপাতাল/ল্যাবের নাম *</label>
                  <Input type="text" required placeholder="যেমন: ইবনে সিনা ল্যাব" value={newPartner.name} onChange={e => setNewPartner({ ...newPartner, name: e.target.value })} className="border-border bg-background" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-secondary">ক্যাটাগরি *</label>
                    <select value={newPartner.category} onChange={e => setNewPartner({ ...newPartner, category: e.target.value as Partner["category"] })} className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary">
                      <option value="hospital">হাসপাতাল (Hospital)</option>
                      <option value="diagnostic">ডায়াগনস্টিক সেন্টার</option>
                      <option value="pharmacy">ফার্মেসী (Pharmacy)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-secondary">ডিসকাউন্টের হার *</label>
                    <Input type="text" required placeholder="যেমন: ১৫% ল্যাব টেস্টে" value={newPartner.discount} onChange={e => setNewPartner({ ...newPartner, discount: e.target.value })} className="border-border bg-background" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-secondary">ঠিকানা *</label>
                  <Input type="text" required placeholder="যেমন: মিজান রোড, ফেনী" value={newPartner.address} onChange={e => setNewPartner({ ...newPartner, address: e.target.value })} className="border-border bg-background" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-secondary">গুগল ম্যাপ লোকেশন লিংক (Google Map Link)</label>
                  <Input type="url" placeholder="যেমন: https://maps.app.goo.gl/..." value={newPartner.mapLink} onChange={e => setNewPartner({ ...newPartner, mapLink: e.target.value })} className="border-border bg-background" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-secondary">হটলাইন নম্বর *</label>
                    <Input type="text" required placeholder="যেমন: ০৯৬১৩৭৮৭৮০১" value={newPartner.phone} onChange={e => setNewPartner({ ...newPartner, phone: e.target.value })} className="border-border bg-background" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-secondary">লোগো সংক্ষিপ্ত টেক্সট</label>
                    <Input type="text" placeholder="যেমন: Ibn Sina" value={newPartner.logoText} onChange={e => setNewPartner({ ...newPartner, logoText: e.target.value })} className="border-border bg-background" />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-semibold">
                  {editingPartner ? "পরিবর্তন সংরক্ষণ করুন" : "পার্টনার সংরক্ষণ করুন"}
                </Button>
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
                  <Input type="text" required placeholder="যেমন: HC-1001 বা 01711112222" value={newTx.memberId} onChange={e => setNewTx({ ...newTx, memberId: e.target.value })} className="border-border bg-background" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-secondary">অংশীদার চিকিৎসাকেন্দ্র *</label>
                  <select value={newTx.partnerId} onChange={e => setNewTx({ ...newTx, partnerId: e.target.value })} className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary">
                    <option value="">হাসপাতাল/ল্যাব নির্বাচন করুন</option>
                    {partners.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.discount})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-secondary">মূল বিলের পরিমাণ (BDT) *</label>
                  <Input type="number" required placeholder="যেমন: ৫০০০" value={newTx.amount} onChange={e => setNewTx({ ...newTx, amount: e.target.value })} className="border-border bg-background" />
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-semibold">ডিসকাউন্ট কার্যকর ও লগ করুন</Button>
              </form>
            </DialogContent>
          </Dialog>
        )}

        {/* Member Details Modal */}
        {viewingMember && (
          <Dialog open={!!viewingMember} onOpenChange={(open) => {
            if (!open) setViewingMember(null);
          }}>
            <DialogContent className="max-w-md md:max-w-lg border-border bg-background max-h-[90vh] overflow-y-auto">
              <DialogHeader className="border-b border-border pb-4">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-xl border border-border bg-muted/40 overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
                    {viewingMember.profilePictureUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={viewingMember.profilePictureUrl} alt={viewingMember.name} className="h-full w-full object-cover" />
                    ) : (
                      <User className="h-7 w-7 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <DialogTitle className="font-heading font-bold text-lg text-secondary">
                      সদস্যের প্রোফাইল বিবরণ
                    </DialogTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      মেম্বার আইডি: <span className="font-mono font-bold text-primary">{viewingMember.id}</span>
                    </p>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6 pt-4">
                {/* Status Badges */}
                <div className="flex items-center justify-between bg-muted/40 p-3 rounded-xl border border-border">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider">প্ল্যান টাইপ</span>
                    <span className="text-xs font-bold text-secondary capitalize">
                      {viewingMember.tier === "founding" ? "Founding (ফ্রী ১ বছর)" : viewingMember.tier === "individual" ? "Individual" : "Family"}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-0.5">
                    <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider">মেম্বারশিপ অবস্থা</span>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      viewingMember.status === "active" 
                        ? "bg-green-50 text-green-600 border border-green-200" 
                        : "bg-rose-50 text-rose-600 border border-rose-200"
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${viewingMember.status === "active" ? "bg-green-500" : "bg-rose-500"}`} />
                      {viewingMember.status === "active" ? "সচল" : "অচল"}
                    </span>
                  </div>
                </div>

                {/* Profile Information Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <User className="h-3.5 w-3.5" />
                      <span>নাম</span>
                    </div>
                    <p className="text-sm font-bold text-secondary">{viewingMember.name}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Phone className="h-3.5 w-3.5" />
                      <span>মোবাইল নম্বর</span>
                    </div>
                    <p className="text-sm font-semibold text-secondary font-mono">{viewingMember.phone}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Mail className="h-3.5 w-3.5" />
                      <span>ইমেইল ঠিকানা</span>
                    </div>
                    <p className="text-sm text-secondary font-mono break-all">{viewingMember.email || "প্রদান করা হয়নি"}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Heart className="h-3.5 w-3.5" />
                      <span>মোট চিকিৎসা সাশ্রয়</span>
                    </div>
                    <p className="text-sm font-extrabold text-primary font-mono">৳{(viewingMember.totalSaved || 0).toLocaleString("bn-BD")}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>যোগদানের তারিখ</span>
                    </div>
                    <p className="text-sm font-semibold text-secondary font-mono">{viewingMember.joinedDate || "N/A"}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>মেয়াদ উত্তীর্ণের তারিখ</span>
                    </div>
                    <p className="text-sm font-semibold text-secondary font-mono">{viewingMember.expiryDate || "N/A"}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>ঠিকানা</span>
                    </div>
                    <p className="text-sm text-secondary">{viewingMember.address || "প্রদান করা হয়নি"}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>জন্ম তারিখ</span>
                    </div>
                    <p className="text-sm font-semibold text-secondary font-mono">{viewingMember.birthDate || "প্রদান করা হয়নি"}</p>
                  </div>

                  <div className="space-y-1 col-span-1 sm:col-span-2">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Briefcase className="h-3.5 w-3.5" />
                      <span>পেশা</span>
                    </div>
                    <p className="text-sm text-secondary">{viewingMember.profession || "প্রদান করা হয়নি"}</p>
                  </div>
                </div>

                {/* Member Transactions */}
                <div className="border-t border-border pt-4">
                  <h4 className="text-xs font-bold text-secondary uppercase font-mono tracking-wider mb-2 flex items-center gap-1">
                    <HistoryIcon className="h-4 w-4 text-primary" />
                    ডিসকাউন্ট ব্যবহারের বিবরণ
                  </h4>
                  {transactions.filter(t => t.memberId === viewingMember.id).length > 0 ? (
                    <div className="overflow-x-auto border border-border rounded-xl">
                      <Table>
                        <TableHeader className="bg-muted/40">
                          <TableRow>
                            <TableHead className="text-[10px] font-semibold text-secondary whitespace-nowrap py-2">চিকিৎসাকেন্দ্র</TableHead>
                            <TableHead className="text-[10px] font-semibold text-secondary whitespace-nowrap py-2">তারিখ</TableHead>
                            <TableHead className="text-[10px] font-semibold text-secondary text-right whitespace-nowrap py-2">বিল</TableHead>
                            <TableHead className="text-[10px] font-semibold text-primary text-right whitespace-nowrap py-2">সাশ্রয়</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody className="text-[11px]">
                          {transactions
                            .filter(t => t.memberId === viewingMember.id)
                            .map((tx) => (
                              <TableRow key={tx.id}>
                                <TableCell className="font-semibold text-secondary py-2">{tx.partnerName}</TableCell>
                                <TableCell className="text-muted-foreground py-2 font-mono">{tx.date.split(" ")[0]}</TableCell>
                                <TableCell className="text-right font-mono py-2">৳{tx.amount}</TableCell>
                                <TableCell className="text-right font-mono text-primary font-bold py-2">৳{tx.saved}</TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground text-center py-4 bg-muted/20 border border-dashed border-border rounded-xl">
                      কোনো পূর্ববর্তী ট্রানজেকশন রেকর্ড পাওয়া যায়নি।
                    </p>
                  )}
                </div>

                {/* Modal Footer Buttons */}
                <div className="flex gap-2 border-t border-border pt-4">
                  <Button 
                    onClick={() => {
                      setEditingMember(viewingMember);
                      setNewMember({
                        name: viewingMember.name,
                        phone: viewingMember.phone,
                        email: viewingMember.email || "",
                        tier: viewingMember.tier,
                        address: viewingMember.address || "",
                        birthDate: viewingMember.birthDate || "",
                        profession: viewingMember.profession || "",
                        profilePictureUrl: viewingMember.profilePictureUrl || ""
                      });
                      setViewingMember(null);
                      setIsMemberOpen(true);
                    }}
                    className="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold gap-1.5"
                  >
                    <Edit3 className="h-4 w-4" />
                    সম্পাদনা করুন
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setViewingMember(null)}
                    className="flex-1 border-border text-secondary font-semibold"
                  >
                    বন্ধ করুন
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

      </div>
    </div>
  );
}
