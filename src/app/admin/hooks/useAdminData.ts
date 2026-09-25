"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { getStatsAction, addTransactionAction } from "@/app/actions/transactionActions";
import { getPartnersAction } from "@/app/actions/partnerActions";
import { getMemberByIdOrPhoneAction } from "@/app/actions/memberAdminActions";
import { Partner } from "@/services/db";
import { parseDiscountPercentage, toBanglaNums } from "@/lib/utils";
import { AdminStatsData } from "../components/AdminStatsGrid";

export function useAdminData() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStatsData>({
    totalMembers: 0,
    activeMembers: 0,
    inactiveMembers: 0,
    pendingMembers: 0,
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
    pwaInstalls: 0,
    pwaActive: 0,
    topPartners: [],
  });

  const [partners, setPartners] = useState<Partner[]>([]);

  // Quick transaction modal states
  const [newTx, setNewTx] = useState({ memberId: "", partnerId: "", amount: "" });
  const [isTxOpen, setIsTxOpen] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [statsRes, partnersRes] = await Promise.all([
        getStatsAction(),
        getPartnersAction(),
      ]);
      setStats(statsRes);
      setPartners(partnersRes);
    } catch {
      toast.error("ড্যাশবোর্ড ডেটা লোড করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    Promise.resolve().then(() => {
      if (isMounted) {
        loadData();
      }
    });

    const handleDataChange = () => {
      loadData();
    };

    window.addEventListener("admin-data-change", handleDataChange);
    return () => {
      isMounted = false;
      window.removeEventListener("admin-data-change", handleDataChange);
    };
  }, [loadData]);

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const member = await getMemberByIdOrPhoneAction(newTx.memberId);
      if (!member) {
        toast.error("সদস্য খুঁজে পাওয়া যায়নি।");
        return;
      }

      if (member.status !== "active") {
        toast.error("সদস্যের অ্যাকাউন্টটি সক্রিয় নয়।");
        return;
      }

      const partner = partners.find((p) => p.id === newTx.partnerId);
      if (!partner) {
        toast.error("নির্বাচিত পার্টনার পাওয়া যায়নি।");
        return;
      }

      const billAmount = Number(newTx.amount);
      if (isNaN(billAmount) || billAmount <= 0) {
        toast.error("অনুগ্রহ করে সঠিক বিলের পরিমাণ লিখুন।");
        return;
      }

      const discountRate = parseDiscountPercentage(partner.discount);
      const safeRate = Math.min(discountRate, 0.70);
      const saved = Math.round(billAmount * safeRate);

      const res = await addTransactionAction({
        memberId: member.id,
        memberName: member.name,
        partnerId: partner.id,
        partnerName: partner.name,
        amount: billAmount,
        saved: saved,
      });

      if ("error" in res) {
        toast.error(res.error || "লেনদেন সংরক্ষণ করতে সমস্যা হয়েছে।");
        return;
      }

      toast.success(`সদস্যের চিকিৎসা ছাড় ৳${toBanglaNums(saved)} সফলভাবে এন্ট্রি হয়েছে!`);
      setNewTx({ memberId: "", partnerId: "", amount: "" });
      setIsTxOpen(false);
      await loadData();
      window.dispatchEvent(new Event("admin-data-change"));
    } catch {
      toast.error("লেনদেন সংরক্ষণ করতে সমস্যা হয়েছে।");
    }
  };

  return {
    loading,
    stats,
    partners,
    newTx,
    setNewTx,
    isTxOpen,
    setIsTxOpen,
    handleAddTransaction,
    loadData,
  };
}
