"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { formatNum } from "@/lib/i18n";
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
import { ImageUpload } from "@/components/ui/ImageUpload";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { t, locale } = useLanguage();

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
  const [newPartner, setNewPartner] = useState({ name: "", category: "hospital" as Partner["category"], address: "", discount: "", phone: "", logoText: "", mapLink: "", imageUrl: "" });
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
    const isAdmin = currentUser.email === "healthclubfeni@gmail.com";
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
      toast.success(editingMember ? t("admin.dashboard.memberUpdatedSuccess") : t("admin.dashboard.memberAddedSuccess"));
    } catch {
      toast.error(editingMember ? t("admin.dashboard.memberUpdatedFailed") : t("admin.dashboard.memberAddedFailed"));
    }
  };

  // Handle Delete Member
  const handleDeleteMember = async (id: string, name: string) => {
    if (confirm(t("admin.dashboard.confirmDeleteMember").replace("${name}", name))) {
      try {
        const success = await dbStore.deleteMember(id);
        if (success) {
          toast.success(t("admin.dashboard.memberDeletedSuccess"));
          loadData();
        } else {
          toast.error(t("admin.dashboard.memberDeletedFailed"));
        }
      } catch {
        toast.error(t("admin.dashboard.memberDeletedFailed"));
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
          mapLink: newPartner.mapLink,
          imageUrl: newPartner.imageUrl
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
          mapLink: newPartner.mapLink,
          imageUrl: newPartner.imageUrl
        });
      }

      setNewPartner({ name: "", category: "hospital", address: "", discount: "", phone: "", logoText: "", mapLink: "", imageUrl: "" });
      setEditingPartner(null);
      setIsPartnerOpen(false);
      loadData();
      toast.success(editingPartner ? t("admin.dashboard.partnerUpdatedSuccess") : t("admin.dashboard.partnerAddedSuccess"));
    } catch {
      toast.error(editingPartner ? t("admin.dashboard.partnerUpdatedFailed") : t("admin.dashboard.partnerAddedFailed"));
    }
  };

  // Handle Delete Partner
  const handleDeletePartner = async (id: string, name: string) => {
    if (confirm(t("admin.dashboard.confirmDeletePartner").replace("${name}", name))) {
      try {
        const success = await dbStore.deletePartner(id);
        if (success) {
          toast.success(t("admin.dashboard.partnerDeletedSuccess"));
          loadData();
        } else {
          toast.error(t("admin.dashboard.partnerDeletedFailed"));
        }
      } catch {
        toast.error(t("admin.dashboard.partnerDeletedFailed"));
      }
    }
  };

  // Handle Log Transaction (Discount log)
  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setTxSuccess("");
    setTxError("");

    if (!newTx.memberId || !newTx.partnerId || !newTx.amount) {
      setTxError(t("admin.dashboard.fillAllFields"));
      return;
    }

    try {
      const member = await dbStore.getMemberById(newTx.memberId);
      if (!member) {
        setTxError(t("admin.dashboard.memberNotFound"));
        return;
      }

      const partner = partners.find(p => p.id === newTx.partnerId);
      if (!partner) {
        setTxError(t("admin.dashboard.selectedPartnerNotFound"));
        return;
      }

      const billAmount = Number(newTx.amount);
      if (isNaN(billAmount) || billAmount <= 0) {
        setTxError(t("admin.dashboard.enterValidBillAmount"));
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

      setTxSuccess(t("admin.dashboard.txLoggedSuccess").replace("${saved}", formatNum(saved, locale)));
      setNewTx({ memberId: "", partnerId: "", amount: "" });
      loadData();

      setTimeout(() => {
        setTxSuccess("");
        setIsTxOpen(false);
      }, 2000);
    } catch {
      setTxError(t("admin.dashboard.txLogFailed"));
    }
  };

  // Toggle member status
  const handleToggleMemberStatus = async (id: string) => {
    const member = members.find(m => m.id === id);
    if (!member) return;

    const newStatus = member.status === "active" ? "inactive" : "active";
    const success = await dbStore.updateMemberStatus(id, newStatus);
    if (success) {
      toast.success(t("admin.dashboard.memberStatusUpdatedSuccess"));
      loadData();
    } else {
      toast.error(t("admin.dashboard.memberStatusUpdatedFailed"));
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
              {t("admin.dashboard.adminAnalyticsDashboard")}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {t("admin.dashboard.manageStatsDesc")}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mt-1 sm:mt-0">
            <Button onClick={() => setIsTxOpen(true)} className="bg-primary hover:bg-primary-dark text-white font-semibold gap-2" size="sm">
              <PlusCircle className="h-4 w-4" />
              <span className="hidden xs:inline">{t("admin.dashboard.discount")}</span> {t("admin.dashboard.log")}
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-border shadow-sm">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-mono tracking-wider">{t("admin.dashboard.totalRegisteredMembers")}</p>
                <p className="text-3xl font-extrabold text-secondary dark:text-white font-mono mt-1">{formatNum(stats.totalMembers, locale)}</p>
                <p className="text-[10px] text-green-600 mt-1 font-semibold">{formatNum(stats.activeMembers, locale)} {t("admin.dashboard.activeMembersSuffix")}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Users className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-mono tracking-wider">{t("admin.dashboard.totalPartnerHospitals")}</p>
                <p className="text-3xl font-extrabold text-secondary dark:text-white font-mono mt-1">{formatNum(stats.partnerCount, locale)}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{t("admin.dashboard.partnerFacilitiesList")}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Building className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-mono tracking-wider">{t("admin.dashboard.totalMedicalDiscounts")}</p>
                <p className="text-3xl font-extrabold text-primary font-mono mt-1">৳{formatNum(stats.totalSaved, locale)}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{t("admin.dashboard.totalMemberSavings")}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-primary-light text-primary flex items-center justify-center">
                <Heart className="h-6 w-6 fill-primary/10" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-mono tracking-wider">{t("admin.dashboard.estimatedRevenue")}</p>
                <p className="text-3xl font-extrabold text-secondary dark:text-white font-mono mt-1">৳{formatNum(stats.revenue, locale)}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{t("admin.dashboard.membershipFeeSource")}</p>
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
            <CardTitle className="font-heading text-lg font-bold text-secondary">{t("admin.dashboard.monthlyGrowthAnalytics")}</CardTitle>
            <CardDescription>{t("admin.dashboard.svgChartDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="w-full h-48 bg-muted/30 rounded-xl relative border border-border/50 flex items-end p-4">
              {/* Simulated bars */}
              <div className="w-full flex justify-around items-end h-full pt-4 relative">

                {/* Y-axis labels */}
                <div className="absolute left-0 bottom-4 top-4 flex flex-col justify-between text-[10px] text-muted-foreground border-r border-border pr-2 pointer-events-none">
                  <span>{t("admin.dashboard.oneTwenty")}</span>
                  <span>{t("admin.dashboard.eighty")}</span>
                  <span>{t("admin.dashboard.forty")}</span>
                  <span>{t("admin.dashboard.zero")}</span>
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
            <TabsTrigger value="members" className="rounded-lg text-xs font-semibold py-2">{t("admin.dashboard.membersList")}</TabsTrigger>
            <TabsTrigger value="partners" className="rounded-lg text-xs font-semibold py-2">{t("admin.dashboard.partnerHospitals")}</TabsTrigger>
            <TabsTrigger value="txs" className="rounded-lg text-xs font-semibold py-2">{t("admin.dashboard.transactionLog")}</TabsTrigger>
          </TabsList>

          {/* 1. Members Management Tab */}
          <TabsContent value="members" className="mt-4">
            <Card className="border-border shadow-md">
              <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="font-heading text-lg font-bold text-secondary">{t("admin.dashboard.registeredMembers")}</CardTitle>
                  <CardDescription>{t("admin.dashboard.manageCustomersDesc")}</CardDescription>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-60">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder={t("admin.dashboard.searchMemberPlaceholder")}
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
                    {t("admin.dashboard.newMember")}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-semibold text-secondary whitespace-nowrap">{t("admin.dashboard.memberId")}</TableHead>
                        <TableHead className="font-semibold text-secondary whitespace-nowrap">{t("admin.dashboard.name")}</TableHead>
                        <TableHead className="font-semibold text-secondary whitespace-nowrap">{t("admin.dashboard.phoneNumber")}</TableHead>
                        <TableHead className="font-semibold text-secondary whitespace-nowrap">{t("admin.dashboard.plan")}</TableHead>
                        <TableHead className="font-semibold text-secondary whitespace-nowrap">{t("admin.dashboard.totalSavings")}</TableHead>
                        <TableHead className="font-semibold text-secondary whitespace-nowrap">{t("admin.dashboard.status")}</TableHead>
                        <TableHead className="font-semibold text-secondary text-right whitespace-nowrap">{t("admin.dashboard.action")}</TableHead>
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
                            {m.tier === "founding" ? t("admin.dashboard.tierFounding") : m.tier === "individual" ? t("admin.dashboard.tierIndividual") : t("admin.dashboard.tierFamily")}
                          </TableCell>
                          <TableCell className="font-mono font-semibold whitespace-nowrap">৳{formatNum(m.totalSaved || 0, locale)}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${m.status === "active" ? "bg-green-50 text-green-600 border border-green-200" : "bg-rose-50 text-rose-600 border border-rose-200"
                              }`}>
                              {m.status === "active" ? t("admin.dashboard.active") : t("admin.dashboard.inactive")}
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
                                {m.status === "active" ? t("admin.dashboard.deactivate") : t("admin.dashboard.activate")}
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
                  <CardTitle className="font-heading text-lg font-bold text-secondary">{t("admin.dashboard.partnerHealthcareDirectory")}</CardTitle>
                  <CardDescription>{t("admin.dashboard.contractedFacilitiesDesc")}</CardDescription>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-60">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder={t("admin.dashboard.searchPartnerPlaceholder")}
                      value={partnerSearch}
                      onChange={(e) => setPartnerSearch(e.target.value)}
                      className="pl-9 h-9 border-border bg-background"
                    />
                  </div>
                  <Button onClick={() => {
                    setEditingPartner(null);
                    setNewPartner({ name: "", category: "hospital", address: "", discount: "", phone: "", logoText: "", mapLink: "", imageUrl: "" });
                    setIsPartnerOpen(true);
                  }} size="sm" className="bg-primary hover:bg-primary-dark text-white">
                    {t("admin.dashboard.newPartnerTitle")}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-semibold text-secondary whitespace-nowrap">{t("admin.dashboard.name")}</TableHead>
                        <TableHead className="font-semibold text-secondary whitespace-nowrap">{t("admin.dashboard.category")}</TableHead>
                        <TableHead className="font-semibold text-secondary">{t("admin.dashboard.addressLabel")}</TableHead>
                        <TableHead className="font-semibold text-primary whitespace-nowrap">{t("admin.dashboard.discountRate")}</TableHead>
                        <TableHead className="font-semibold text-secondary whitespace-nowrap">{t("admin.dashboard.hotline")}</TableHead>
                        <TableHead className="font-semibold text-secondary text-right whitespace-nowrap">{t("admin.dashboard.action")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="text-xs sm:text-sm">
                      {filteredPartners.map((p) => (
                        <TableRow key={p.id}>
                          <TableCell className="font-bold text-secondary whitespace-nowrap">{p.name}</TableCell>
                          <TableCell className="capitalize text-xs font-semibold whitespace-nowrap">
                            {p.category === "hospital" ? t("admin.dashboard.hospital") : p.category === "diagnostic" ? t("admin.dashboard.diagnostic") : t("admin.dashboard.pharmacy")}
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
                                    mapLink: p.mapLink || "",
                                    imageUrl: p.imageUrl || ""
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
                <CardTitle className="font-heading text-lg font-bold text-secondary">{t("admin.dashboard.recentTransactionsTitle")}</CardTitle>
                <CardDescription>{t("admin.dashboard.txDescLabel")}</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-semibold text-secondary whitespace-nowrap">{t("admin.dashboard.memberName")}</TableHead>
                        <TableHead className="font-semibold text-secondary whitespace-nowrap">{t("admin.dashboard.medicalCenter")}</TableHead>
                        <TableHead className="font-semibold text-secondary whitespace-nowrap">{t("admin.dashboard.date")}</TableHead>
                        <TableHead className="font-semibold text-secondary text-right whitespace-nowrap">{t("admin.dashboard.totalBill")}</TableHead>
                        <TableHead className="font-semibold text-primary text-right whitespace-nowrap">{t("admin.dashboard.savings")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="text-xs sm:text-sm">
                      {transactions.map((tx) => (
                        <TableRow key={tx.id}>
                          <TableCell className="font-semibold text-secondary whitespace-nowrap">
                            {tx.memberName}
                            <span className="block text-[10px] text-muted-foreground font-mono font-normal">{tx.memberId}</span>
                          </TableCell>
                          <TableCell className="text-secondary whitespace-nowrap">{tx.partnerName}</TableCell>
                          <TableCell className="text-muted-foreground whitespace-nowrap">{tx.date}</TableCell>
                          <TableCell className="text-right font-mono whitespace-nowrap">৳{formatNum(tx.amount, locale)}</TableCell>
                          <TableCell className="text-right font-mono text-primary font-bold whitespace-nowrap">৳{formatNum(tx.saved, locale)}</TableCell>
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
                  {editingMember ? t("admin.dashboard.editMemberTitle") : t("admin.dashboard.addNewMemberTitle")}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSaveMember} className="space-y-4 pt-2">
                <ImageUpload
                  value={newMember.profilePictureUrl || ""}
                  onChange={(url) => setNewMember({ ...newMember, profilePictureUrl: url })}
                  label={t("admin.dashboard.profilePictureLabel")}
                />
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-secondary">{t("admin.dashboard.nameLabel")}</label>
                  <Input type="text" required placeholder={t("admin.dashboard.egName")} value={newMember.name} onChange={e => setNewMember({ ...newMember, name: e.target.value })} className="border-border bg-background" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-secondary">{t("admin.dashboard.phoneLabel")}</label>
                  <Input type="tel" required placeholder={t("admin.dashboard.egPhone")} value={newMember.phone} onChange={e => setNewMember({ ...newMember, phone: e.target.value })} className="border-border bg-background" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-secondary">{t("admin.dashboard.emailLabel")}</label>
                  <Input type="email" placeholder={t("admin.dashboard.egEmail")} value={newMember.email} onChange={e => setNewMember({ ...newMember, email: e.target.value })} className="border-border bg-background" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-secondary">{t("admin.dashboard.membershipPlanLabel")}</label>
                  <select value={newMember.tier} onChange={e => setNewMember({ ...newMember, tier: e.target.value as Member["tier"] })} className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary">
                    <option value="founding">{t("admin.dashboard.planFoundingOption")}</option>
                    <option value="individual">{t("admin.dashboard.planIndividualOption")}</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-secondary">{t("admin.dashboard.addressLabel")}</label>
                  <Input type="text" placeholder={t("admin.dashboard.egAddress")} value={newMember.address} onChange={e => setNewMember({ ...newMember, address: e.target.value })} className="border-border bg-background" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-secondary">{t("admin.dashboard.birthDateLabel")}</label>
                    <Input type="date" value={newMember.birthDate} onChange={e => setNewMember({ ...newMember, birthDate: e.target.value })} className="border-border bg-background" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-secondary">{t("admin.dashboard.professionLabel")}</label>
                    <Input type="text" placeholder={t("admin.dashboard.egProfession")} value={newMember.profession} onChange={e => setNewMember({ ...newMember, profession: e.target.value })} className="border-border bg-background" />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-semibold">
                  {editingMember ? t("admin.dashboard.saveChanges") : t("admin.dashboard.saveButton")}
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
              setNewPartner({ name: "", category: "hospital", address: "", discount: "", phone: "", logoText: "", mapLink: "", imageUrl: "" });
            }
          }}>
            <DialogContent className="border-border bg-background">
              <DialogHeader>
                <DialogTitle className="font-heading font-bold text-secondary">
                  {editingPartner ? t("admin.dashboard.editPartnerTitle") : t("admin.dashboard.addNewPartnerTitle")}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSavePartner} className="space-y-4 pt-2">
                <ImageUpload
                  value={newPartner.imageUrl || ""}
                  onChange={(url) => setNewPartner({ ...newPartner, imageUrl: url })}
                  label={t("admin.dashboard.partnerImageLabel")}
                  fallbackType="building"
                />
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-secondary">{t("admin.dashboard.partnerNameLabel")}</label>
                  <Input type="text" required placeholder={t("admin.dashboard.egPartnerName")} value={newPartner.name} onChange={e => setNewPartner({ ...newPartner, name: e.target.value })} className="border-border bg-background" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-secondary">{t("admin.dashboard.categoryLabel")}</label>
                    <select value={newPartner.category} onChange={e => setNewPartner({ ...newPartner, category: e.target.value as Partner["category"] })} className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary">
                      <option value="hospital">{t("admin.dashboard.categoryHospitalOption")}</option>
                      <option value="diagnostic">{t("admin.dashboard.categoryDiagnosticOption")}</option>
                      <option value="pharmacy">{t("admin.dashboard.categoryPharmacyOption")}</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-secondary">{t("admin.dashboard.discountLabel")}</label>
                    <Input type="text" required placeholder={t("admin.dashboard.egDiscount")} value={newPartner.discount} onChange={e => setNewPartner({ ...newPartner, discount: e.target.value })} className="border-border bg-background" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-secondary">{t("admin.dashboard.addressLabelReq")}</label>
                  <Input type="text" required placeholder={t("admin.dashboard.egAddress")} value={newPartner.address} onChange={e => setNewPartner({ ...newPartner, address: e.target.value })} className="border-border bg-background" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-secondary">{t("admin.dashboard.googleMapLinkLabel")}</label>
                  <Input type="url" placeholder={t("admin.dashboard.egMapLink")} value={newPartner.mapLink} onChange={e => setNewPartner({ ...newPartner, mapLink: e.target.value })} className="border-border bg-background" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-secondary">{t("admin.dashboard.hotlineLabel")}</label>
                    <Input type="text" required placeholder={t("admin.dashboard.egHotline")} value={newPartner.phone} onChange={e => setNewPartner({ ...newPartner, phone: e.target.value })} className="border-border bg-background" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-secondary">{t("admin.dashboard.logoTextLabel")}</label>
                    <Input type="text" placeholder={t("admin.dashboard.egLogoText")} value={newPartner.logoText} onChange={e => setNewPartner({ ...newPartner, logoText: e.target.value })} className="border-border bg-background" />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-semibold">
                  {editingPartner ? t("admin.dashboard.saveChanges") : t("admin.dashboard.savePartnerButton")}
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
                <DialogTitle className="font-heading font-bold text-secondary">{t("admin.dashboard.logMemberDiscountTitle")}</DialogTitle>
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
                  <label className="text-xs font-semibold text-secondary">{t("admin.dashboard.memberSearchLabel")}</label>
                  <Input type="text" required placeholder={t("admin.dashboard.egMemberSearch")} value={newTx.memberId} onChange={e => setNewTx({ ...newTx, memberId: e.target.value })} className="border-border bg-background" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-secondary">{t("admin.dashboard.partnerMedicalCenterLabelReq")}</label>
                  <select value={newTx.partnerId} onChange={e => setNewTx({ ...newTx, partnerId: e.target.value })} className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary">
                    <option value="">{t("admin.dashboard.selectPartnerLabel")}</option>
                    {partners.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.discount})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-secondary">{t("admin.dashboard.billAmountLabel")}</label>
                  <Input type="number" required placeholder={t("admin.dashboard.egBillAmount")} value={newTx.amount} onChange={e => setNewTx({ ...newTx, amount: e.target.value })} className="border-border bg-background" />
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-semibold">{t("admin.dashboard.applyLogDiscountButton")}</Button>
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
                      {t("admin.dashboard.memberProfileDetailsTitle")}
                    </DialogTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {t("admin.dashboard.memberIdLabel")} <span className="font-mono font-bold text-primary">{viewingMember.id}</span>
                    </p>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6 pt-4">
                {/* Status Badges */}
                <div className="flex items-center justify-between bg-muted/40 p-3 rounded-xl border border-border">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider">{t("admin.dashboard.planTypeLabel")}</span>
                    <span className="text-xs font-bold text-secondary capitalize">
                      {viewingMember.tier === "founding" ? t("admin.dashboard.tierFounding1Year") : viewingMember.tier === "individual" ? t("admin.dashboard.tierIndividual") : t("admin.dashboard.tierFamily")}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-0.5">
                    <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider">{t("admin.dashboard.membershipStatusLabel")}</span>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      viewingMember.status === "active" 
                        ? "bg-green-50 text-green-600 border border-green-200" 
                        : "bg-rose-50 text-rose-600 border border-rose-200"
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${viewingMember.status === "active" ? "bg-green-500" : "bg-rose-500"}`} />
                      {viewingMember.status === "active" ? t("admin.dashboard.active") : t("admin.dashboard.inactive")}
                    </span>
                  </div>
                </div>

                {/* Profile Information Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <User className="h-3.5 w-3.5" />
                      <span>{t("admin.dashboard.name")}</span>
                    </div>
                    <p className="text-sm font-bold text-secondary">{viewingMember.name}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Phone className="h-3.5 w-3.5" />
                      <span>{t("admin.dashboard.mobileNumberLabel")}</span>
                    </div>
                    <p className="text-sm font-semibold text-secondary font-mono">{viewingMember.phone}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Mail className="h-3.5 w-3.5" />
                      <span>{t("admin.dashboard.emailLabel")}</span>
                    </div>
                    <p className="text-sm text-secondary font-mono break-all">{viewingMember.email || t("admin.dashboard.notProvided")}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Heart className="h-3.5 w-3.5" />
                      <span>{t("admin.dashboard.totalMedicalSavings")}</span>
                    </div>
                    <p className="text-sm font-extrabold text-primary font-mono">৳{formatNum(viewingMember.totalSaved || 0, locale)}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{t("admin.dashboard.joinedDateLabel")}</span>
                    </div>
                    <p className="text-sm font-semibold text-secondary font-mono">{viewingMember.joinedDate || "N/A"}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{t("admin.dashboard.expiryDateLabel")}</span>
                    </div>
                    <p className="text-sm font-semibold text-secondary font-mono">{viewingMember.expiryDate || "N/A"}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{t("admin.dashboard.addressLabel")}</span>
                    </div>
                    <p className="text-sm text-secondary">{viewingMember.address || t("admin.dashboard.notProvided")}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{t("admin.dashboard.birthDateLabel")}</span>
                    </div>
                    <p className="text-sm font-semibold text-secondary font-mono">{viewingMember.birthDate || t("admin.dashboard.notProvided")}</p>
                  </div>

                  <div className="space-y-1 col-span-1 sm:col-span-2">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Briefcase className="h-3.5 w-3.5" />
                      <span>{t("admin.dashboard.professionLabel")}</span>
                    </div>
                    <p className="text-sm text-secondary">{viewingMember.profession || t("admin.dashboard.notProvided")}</p>
                  </div>
                </div>

                {/* Member Transactions */}
                <div className="border-t border-border pt-4">
                  <h4 className="text-xs font-bold text-secondary uppercase font-mono tracking-wider mb-2 flex items-center gap-1">
                    <HistoryIcon className="h-4 w-4 text-primary" />
                    {t("admin.dashboard.txLogDesc")}
                  </h4>
                  {transactions.filter(t => t.memberId === viewingMember.id).length > 0 ? (
                    <div className="overflow-x-auto border border-border rounded-xl">
                      <Table>
                        <TableHeader className="bg-muted/40">
                          <TableRow>
                            <TableHead className="text-[10px] font-semibold text-secondary whitespace-nowrap py-2">{t("admin.dashboard.medicalCenter")}</TableHead>
                            <TableHead className="text-[10px] font-semibold text-secondary whitespace-nowrap py-2">{t("admin.dashboard.date")}</TableHead>
                            <TableHead className="text-[10px] font-semibold text-secondary text-right whitespace-nowrap py-2">{t("admin.dashboard.bill")}</TableHead>
                            <TableHead className="text-[10px] font-semibold text-primary text-right whitespace-nowrap py-2">{t("admin.dashboard.savings")}</TableHead>
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
                      {t("admin.dashboard.noTxsFound")}
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
                    {t("admin.dashboard.editButton")}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setViewingMember(null)}
                    className="flex-1 border-border text-secondary font-semibold"
                  >
                    {t("admin.dashboard.closeButton")}
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
