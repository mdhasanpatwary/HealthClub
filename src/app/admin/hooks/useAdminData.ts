import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { dbStore } from "@/services/dbStore";
import { Member, Partner, Transaction } from "@/services/db";
import { parseDiscountPercentage } from "@/lib/utils";
import { formatNum, Locale } from "@/lib/i18n";
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
import {
  approveMemberRenewalAction,
  rejectMemberRenewalAction,
} from "@/app/actions/memberAdminActions";
import { AdminStatsData } from "../components/AdminStatsGrid";

export function useAdminData(t: (key: string) => string, locale: Locale) {
  const router = useRouter();

  // Loading & Main States
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("members");
  const [stats, setStats] = useState<AdminStatsData>({
    totalMembers: 0,
    activeMembers: 0,
    inactiveMembers: 0,
    foundingMembers: 0,
    premiumMembers: 0,
    expiringMembers: 0,
    newMembersThisMonth: 0,
    partnerCount: 0,
    partnerHospitals: 0,
    partnerDiagnostics: 0,
    partnerPharmacies: 0,
    pendingPartnerRequests: 0,
    pendingRenewals: 0,
    contactMessagesCount: 0,
    totalSaved: 0,
    thisMonthSaved: 0,
    totalTransactions: 0,
    thisMonthTransactions: 0,
    revenue: 0,
    topPartners: [],
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
    profilePictureUrl: "",
  });
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [newPartner, setNewPartner] = useState({
    name: "",
    category: "hospital" as Partner["category"],
    address: "",
    discount: "",
    phone: "",
    logoText: "",
    mapLink: "",
    imageUrl: "",
  });
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
      const [
        statsRes,
        membersRes,
        partnersRes,
        transactionsRes,
        requestsRes,
        messagesRes,
        allowTxRes,
      ] = await Promise.all([
        dbStore.getStats(),
        dbStore.getMembers(),
        dbStore.getPartners(),
        dbStore.getTransactions(),
        getPartnerRequestsAction(),
        getContactMessagesAction(),
        dbStore.isMemberTxAllowed(),
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

  useEffect(() => {
    let isMounted = true;
    Promise.resolve().then(() => {
      if (isMounted) {
        loadData();
      }
    });
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

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
          profilePictureUrl: newMember.profilePictureUrl,
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
          profilePictureUrl: newMember.profilePictureUrl,
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
          imageUrl: newPartner.imageUrl,
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
          imageUrl: newPartner.imageUrl,
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

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setTxError("");
    setTxSuccess("");

    try {
      const member = members.find((m) => m.id === newTx.memberId || m.phone === newTx.memberId);
      if (!member) {
        setTxError(t("admin.dashboard.memberNotFound"));
        return;
      }

      if (member.status !== "active") {
        setTxError(t("admin.dashboard.memberNotActive"));
        return;
      }

      const partner = partners.find((p) => p.id === newTx.partnerId);
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
        saved: saved,
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

  const handleToggleMemberStatus = async (id: string) => {
    const member = members.find((m) => m.id === id);
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

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.id.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.phone.includes(memberSearch)
  );

  const filteredPartners = partners.filter(
    (p) =>
      p.name.toLowerCase().includes(partnerSearch.toLowerCase()) ||
      p.address.toLowerCase().includes(partnerSearch.toLowerCase())
  );

  return {
    loading,
    activeTab,
    setActiveTab,
    stats,
    members,
    partners,
    transactions,
    partnerRequests,
    contactMessages,
    allowMemberTx,
    togglingMemberTx,
    handleToggleMemberTx,
    memberSearch,
    setMemberSearch,
    partnerSearch,
    setPartnerSearch,
    filteredMembers,
    filteredPartners,
    newMember,
    setNewMember,
    editingMember,
    setEditingMember,
    newPartner,
    setNewPartner,
    editingPartner,
    setEditingPartner,
    newTx,
    setNewTx,
    txSuccess,
    txError,
    isMemberOpen,
    setIsMemberOpen,
    isPartnerOpen,
    setIsPartnerOpen,
    isTxOpen,
    setIsTxOpen,
    viewingMember,
    setViewingMember,
    handleSaveMember,
    handleDeleteMember,
    handleSavePartner,
    handleDeletePartner,
    handleApprovePartnerRequest,
    handleRejectPartnerRequest,
    handleDeleteContactMessage,
    handleAddTransaction,
    handleToggleMemberStatus,
    handleApproveRenewal,
    handleRejectRenewal,
  };
}
