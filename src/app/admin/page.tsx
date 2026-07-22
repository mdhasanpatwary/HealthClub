"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { formatNum } from "@/lib/i18n";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Users, Building, DollarSign, PlusCircle, Heart, Settings
} from "lucide-react";
import { dbStore } from "@/services/dbStore";
import { Member, Partner, Transaction } from "@/services/db";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getPartnerRequestsAction,
  updatePartnerRequestStatusAction,
  PartnerRequest,
} from "@/app/actions/partnerActions";
import {
  getContactMessagesAction,
  deleteContactMessageAction,
  ContactMessage,
} from "@/app/actions/contactActions";

import { MemberDialog } from "./components/MemberDialog";
import { PartnerDialog } from "./components/PartnerDialog";
import { TransactionDialog } from "./components/TransactionDialog";
import { MemberDetailsDialog } from "./components/MemberDetailsDialog";
import { MembersTab } from "./components/MembersTab";
import { PartnersTab } from "./components/PartnersTab";
import { TransactionsTab } from "./components/TransactionsTab";
import { PartnerRequestsTab } from "./components/PartnerRequestsTab";
import { ContactMessagesTab } from "./components/ContactMessagesTab";
import { RenewalsTab } from "./components/RenewalsTab";
import { approveMemberRenewalAction, rejectMemberRenewalAction } from "@/app/actions/memberAdminActions";
import { Skeleton } from "@/components/ui/skeleton";

function parseDiscountPercentage(discountStr: string): number {
  const banglaToEnglishMap: { [key: string]: string } = {
    "০": "0", "১": "1", "২": "2", "৩": "3", "৪": "4",
    "৫": "5", "৬": "6", "৭": "7", "৮": "8", "৯": "9"
  };

  let converted = discountStr;
  for (const [bangla, english] of Object.entries(banglaToEnglishMap)) {
    converted = converted.replaceAll(bangla, english);
  }

  const match = converted.match(/(\d+(?:\.\d+)?)\s*%/);
  if (match) {
    return parseFloat(match[1]) / 100;
  }

  const fallbackMatch = converted.match(/(\d+(?:\.\d+)?)/);
  if (fallbackMatch) {
    const num = parseFloat(fallbackMatch[1]);
    return num > 1 ? num / 100 : num;
  }

  return 0.10;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { t, locale } = useLanguage();

  // States
  const [loading, setLoading] = useState(true);
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
  const [partnerRequests, setPartnerRequests] = useState<PartnerRequest[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [allowMemberTx, setAllowMemberTx] = useState<boolean>(false);
  const [togglingMemberTx, setTogglingMemberTx] = useState<boolean>(false);

  // Search states
  const [memberSearch, setMemberSearch] = useState("");
  const [partnerSearch, setPartnerSearch] = useState("");

  // Modals / Form states
  const [newMember, setNewMember] = useState({
    name: "",
    phone: "",
    email: "",
    tier: "founding" as "founding" | "premium",
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
      const [statsRes, membersRes, partnersRes, transactionsRes, requestsRes, messagesRes, allowTxRes] = await Promise.all([
        dbStore.getStats(),
        dbStore.getMembers(),
        dbStore.getPartners(),
        dbStore.getTransactions(),
        getPartnerRequestsAction(),
        getContactMessagesAction(),
        dbStore.isMemberTxAllowed()
      ]);
      setStats(statsRes);
      setMembers(membersRes);
      setPartners(partnersRes);
      setTransactions(transactionsRes);
      setPartnerRequests(requestsRes);
      setContactMessages(messagesRes);
      setAllowMemberTx(allowTxRes);
    } catch (error) {
      console.error("Error loading data in admin dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMemberTx = async (newVal: boolean) => {
    setTogglingMemberTx(true);
    try {
      const success = await dbStore.setMemberTxAllowed(newVal);
      if (success) {
        setAllowMemberTx(newVal);
        toast.success(newVal ? t("admin.dashboard.memberTxEnabled") : t("admin.dashboard.memberTxDisabled"));
      } else {
        toast.error(t("admin.dashboard.txLogFailed"));
      }
    } catch (err) {
      console.error("Error toggling member tx setting:", err);
      toast.error(t("admin.dashboard.txLogFailed"));
    } finally {
      setTogglingMemberTx(false);
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

  // Handle Approve Partner Request
  const handleApprovePartnerRequest = async (id: string) => {
    try {
      const success = await updatePartnerRequestStatusAction(id, "approved");
      if (success) {
        toast.success("অংশীদার আবেদন সফলভাবে অনুমোদিত হয়েছে এবং ডিরেক্টরিতে যুক্ত করা হয়েছে!");
        loadData();
      } else {
        toast.error("আবেদন অনুমোদন করতে সমস্যা হয়েছে।");
      }
    } catch {
      toast.error("সার্ভার ত্রুটি।");
    }
  };

  // Handle Reject Partner Request
  const handleRejectPartnerRequest = async (id: string) => {
    if (confirm("আপনি কি নিশ্চিতভাবে এই আবেদনটি বাতিল করতে চান?")) {
      try {
        const success = await updatePartnerRequestStatusAction(id, "rejected");
        if (success) {
          toast.success("আবেদনটি সফলভাবে বাতিল করা হয়েছে।");
          loadData();
        } else {
          toast.error("আবেদন বাতিল করতে সমস্যা হয়েছে।");
        }
      } catch {
        toast.error("সার্ভার ত্রুটি।");
      }
    }
  };

  // Handle Delete Contact Message
  const handleDeleteContactMessage = async (id: string) => {
    if (confirm(t("admin.dashboard.deleteMessageConfirm"))) {
      try {
        const success = await deleteContactMessageAction(id);
        if (success) {
          toast.success(t("admin.dashboard.messageDeletedSuccess"));
          loadData();
        } else {
          toast.error(t("admin.dashboard.messageDeletedFailed"));
        }
      } catch {
        toast.error(t("admin.dashboard.messageDeletedFailed"));
      }
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

  // Handle Log Transaction
  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setTxError("");
    setTxSuccess("");

    try {
      const member = members.find(m => m.id === newTx.memberId || m.phone === newTx.memberId);
      if (!member) {
        setTxError(t("admin.dashboard.memberNotFound"));
        return;
      }

      if (member.status !== "active") {
        setTxError(t("admin.dashboard.memberNotActive"));
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

      const discountRate = parseDiscountPercentage(partner.discount);
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
      if (viewingMember && viewingMember.id === id) {
        setViewingMember({ ...viewingMember, status: newStatus });
      }
      loadData();
    } else {
      toast.error(t("admin.dashboard.memberStatusUpdatedFailed"));
    }
  };

  // Handle member renewal approval
  const handleApproveRenewal = async (memberId: string) => {
    try {
      const success = await approveMemberRenewalAction(memberId);
      if (success) {
        toast.success("মেম্বারশিপ নবায়ন আবেদন সফলভাবে অনুমোদিত হয়েছে!");
        loadData();
      } else {
        toast.error("অনুমোদন করা যায়নি।");
      }
    } catch (err) {
      console.error(err);
      toast.error("সার্ভার ত্রুটি।");
    }
  };

  // Handle member renewal rejection
  const handleRejectRenewal = async (memberId: string) => {
    try {
      const success = await rejectMemberRenewalAction(memberId);
      if (success) {
        toast.success("নবায়ন আবেদন বাতিল করা হয়েছে।");
        loadData();
      } else {
        toast.error("বাতিল করা যায়নি।");
      }
    } catch (err) {
      console.error(err);
      toast.error("সার্ভার ত্রুটি।");
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

  if (loading) {
    return (
      <div className="bg-muted/30 min-h-screen py-6 sm:py-10 animate-pulse">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
          {/* Header Skeleton */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6">
            <div className="space-y-2">
              <Skeleton className="h-8 w-64 animate-pulse" />
              <Skeleton className="h-4 w-96 animate-pulse" />
            </div>
            <Skeleton className="h-9 w-32 rounded-md" />
          </div>

          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="border-border shadow-sm bg-background dark:bg-slate-900">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="space-y-2 w-2/3">
                    <Skeleton className="h-3 w-32 animate-pulse" />
                    <Skeleton className="h-8 w-20 animate-pulse" />
                    <Skeleton className="h-3.5 w-24 animate-pulse" />
                  </div>
                  <Skeleton className="h-12 w-12 rounded-xl" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Chart Placeholder Skeleton */}
          <Card className="border-border shadow-md bg-background dark:bg-slate-900">
            <CardHeader className="space-y-2">
              <Skeleton className="h-5 w-48 animate-pulse" />
              <Skeleton className="h-3.5 w-72 animate-pulse" />
            </CardHeader>
            <CardContent className="p-6">
              <div className="w-full h-48 bg-muted/30 rounded-xl border border-border/50 flex items-end p-4">
                <div className="w-full flex justify-around items-end h-full pt-4">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className="flex flex-col items-center gap-1.5 h-full justify-end w-12">
                      <Skeleton className="w-6 rounded-t-md animate-pulse" style={{ height: `${30 + (i * 10)}%` }} />
                      <Skeleton className="h-3 w-8 animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-10 w-full rounded-xl animate-pulse" />
            <Card className="border-border shadow-md bg-background dark:bg-slate-900">
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-border">
                  <Skeleton className="h-9 w-48 rounded-md animate-pulse" />
                  <Skeleton className="h-9 w-24 rounded-md animate-pulse" />
                </div>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex justify-between items-center py-3 border-b border-border last:border-0">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-32 animate-pulse" />
                        <Skeleton className="h-3 w-24 animate-pulse" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-16 rounded-md" />
                      <Skeleton className="h-8 w-16 rounded-md" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

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

        {/* Feature Settings Card */}
        <Card className="border-border shadow-sm bg-gradient-to-r from-slate-900 via-secondary to-slate-900 text-white overflow-hidden">
          <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className={`h-11 w-11 rounded-2xl flex items-center justify-center border shrink-0 ${
                allowMemberTx
                  ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                  : "bg-slate-800 border-slate-700 text-slate-400"
              }`}>
                <Settings className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-heading text-base font-bold text-white flex items-center gap-2">
                  {t("admin.dashboard.memberTxToggleTitle")}
                  <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    allowMemberTx
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-slate-800 text-slate-400 border border-slate-700"
                  }`}>
                    {allowMemberTx ? (locale === "bn" ? "চালু রয়েছে" : "Enabled") : (locale === "bn" ? "বন্ধ রয়েছে" : "Disabled")}
                  </span>
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  {t("admin.dashboard.memberTxToggleDesc")}
                </p>
              </div>
            </div>

            <Button
              onClick={() => handleToggleMemberTx(!allowMemberTx)}
              disabled={togglingMemberTx}
              variant={allowMemberTx ? "destructive" : "default"}
              size="sm"
              className={!allowMemberTx ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md font-semibold shrink-0" : "font-semibold shrink-0"}
            >
              {allowMemberTx
                ? (locale === "bn" ? "সুবিধা বন্ধ করুন" : "Disable Feature")
                : (locale === "bn" ? "সুবিধা চালু করুন" : "Enable Feature")
              }
            </Button>
          </CardContent>
        </Card>

        {/* Dynamic SVG Analytics Chart */}
        <Card className="border-border shadow-md">
          <CardHeader>
            <CardTitle className="font-heading text-lg font-bold text-secondary">{t("admin.dashboard.monthlyGrowthAnalytics")}</CardTitle>
            <CardDescription>{t("admin.dashboard.svgChartDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="w-full h-48 bg-muted/30 rounded-xl relative border border-border/50 flex items-end p-4">
              <div className="w-full flex justify-around items-end h-full pt-4 relative">
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

        <Tabs defaultValue="members" className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-muted p-1 rounded-xl">
            <TabsTrigger value="members" className="rounded-lg text-xs font-semibold py-2">{t("admin.dashboard.membersList")}</TabsTrigger>
            <TabsTrigger value="partners" className="rounded-lg text-xs font-semibold py-2">{t("admin.dashboard.partnerHospitals")}</TabsTrigger>
            <TabsTrigger value="txs" className="rounded-lg text-xs font-semibold py-2">{t("admin.dashboard.transactionLog")}</TabsTrigger>
            <TabsTrigger value="requests" className="rounded-lg text-xs font-semibold py-2">
              অংশীদার আবেদন ({partnerRequests.filter(r => r.status === "pending").length})
            </TabsTrigger>
            <TabsTrigger value="renewals" className="rounded-lg text-xs font-semibold py-2">
              নবায়ন আবেদন ({members.filter(m => m.renewalStatus === "pending").length})
            </TabsTrigger>
            <TabsTrigger value="messages" className="rounded-lg text-xs font-semibold py-2">
              {t("admin.dashboard.contactMessages")} ({contactMessages.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="members" className="mt-4">
            <MembersTab
              filteredMembers={filteredMembers}
              memberSearch={memberSearch}
              setMemberSearch={setMemberSearch}
              onNewMemberClick={() => {
                setEditingMember(null);
                setNewMember({ name: "", phone: "", email: "", tier: "founding", address: "", birthDate: "", profession: "", profilePictureUrl: "" });
                setIsMemberOpen(true);
              }}
              onViewMemberClick={setViewingMember}
              onToggleStatus={handleToggleMemberStatus}
              onEditClick={(m) => {
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
              onDeleteClick={handleDeleteMember}
              locale={locale}
              t={t}
            />
          </TabsContent>

          <TabsContent value="partners" className="mt-4">
            <PartnersTab
              filteredPartners={filteredPartners}
              partnerSearch={partnerSearch}
              setPartnerSearch={setPartnerSearch}
              onNewPartnerClick={() => {
                setEditingPartner(null);
                setNewPartner({ name: "", category: "hospital", address: "", discount: "", phone: "", logoText: "", mapLink: "", imageUrl: "" });
                setIsPartnerOpen(true);
              }}
              onEditClick={(p) => {
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
              onDeleteClick={handleDeletePartner}
              t={t}
            />
          </TabsContent>

          <TabsContent value="txs" className="mt-4">
            <TransactionsTab
              transactions={transactions}
              locale={locale}
              t={t}
            />
          </TabsContent>

          <TabsContent value="requests" className="mt-4">
            <PartnerRequestsTab
              partnerRequests={partnerRequests}
              onApprove={handleApprovePartnerRequest}
              onReject={handleRejectPartnerRequest}
            />
          </TabsContent>

          <TabsContent value="messages" className="mt-4">
            <ContactMessagesTab
              messages={contactMessages}
              onDelete={handleDeleteContactMessage}
              t={t}
              locale={locale}
            />
          </TabsContent>

          <TabsContent value="renewals" className="mt-4">
            <RenewalsTab
              members={members}
              onApprove={handleApproveRenewal}
              onReject={handleRejectRenewal}
              locale={locale}
            />
          </TabsContent>
        </Tabs>

        {/* --- MODAL DIALOGS --- */}

        {isMemberOpen && (
          <MemberDialog
            isOpen={isMemberOpen}
            onClose={() => {
              setIsMemberOpen(false);
              setEditingMember(null);
              setNewMember({ name: "", phone: "", email: "", tier: "founding", address: "", birthDate: "", profession: "", profilePictureUrl: "" });
            }}
            editingMember={editingMember}
            newMember={newMember}
            setNewMember={setNewMember}
            onSubmit={handleSaveMember}
            t={t}
          />
        )}

        {isPartnerOpen && (
          <PartnerDialog
            isOpen={isPartnerOpen}
            onClose={() => {
              setIsPartnerOpen(false);
              setEditingPartner(null);
              setNewPartner({ name: "", category: "hospital", address: "", discount: "", phone: "", logoText: "", mapLink: "", imageUrl: "" });
            }}
            editingPartner={editingPartner}
            newPartner={newPartner}
            setNewPartner={setNewPartner}
            onSubmit={handleSavePartner}
            t={t}
          />
        )}

        {isTxOpen && (
          <TransactionDialog
            isOpen={isTxOpen}
            onClose={setIsTxOpen}
            partners={partners}
            newTx={newTx}
            setNewTx={setNewTx}
            onSubmit={handleAddTransaction}
            txSuccess={txSuccess}
            txError={txError}
            t={t}
          />
        )}

        {viewingMember && (
          <MemberDetailsDialog
            viewingMember={viewingMember}
            onClose={() => setViewingMember(null)}
            transactions={transactions}
            onToggleStatus={handleToggleMemberStatus}
            onEditClick={(m) => {
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
              setViewingMember(null);
              setIsMemberOpen(true);
            }}
            locale={locale}
            t={t}
          />
        )}

      </div>
    </div>
  );
}
