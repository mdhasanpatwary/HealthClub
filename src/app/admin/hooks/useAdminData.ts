"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { getStatsAction, addTransactionAction } from "@/app/actions/transactionActions";
import { getPartnersAction } from "@/app/actions/partnerActions";
import { getMembersAction } from "@/app/actions/memberAdminActions";
import { Partner } from "@/services/db";
import { parseDiscountPercentage } from "@/lib/utils";
import { formatNum, Locale } from "@/lib/i18n";
import { AdminStatsData } from "../components/AdminStatsGrid";

export function useAdminData(t: (key: string) => string, locale: Locale) {
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
      const members = await getMembersAction();
      const member = members.find((m) => m.id === newTx.memberId || m.phone === newTx.memberId);
      if (!member) {
        toast.error(t("admin.dashboard.memberNotFound"));
        return;
      }

      if (member.status !== "active") {
        toast.error(t("admin.dashboard.memberNotActive"));
        return;
      }

      const partner = partners.find((p) => p.id === newTx.partnerId);
      if (!partner) {
        toast.error(t("admin.dashboard.selectedPartnerNotFound"));
        return;
      }

      const billAmount = Number(newTx.amount);
      if (isNaN(billAmount) || billAmount <= 0) {
        toast.error(t("admin.dashboard.enterValidBillAmount"));
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
        toast.error(res.error || t("admin.dashboard.txLogFailed"));
        return;
      }

      toast.success(t("admin.dashboard.txLoggedSuccess").replace("${saved}", formatNum(saved, locale)));
      setNewTx({ memberId: "", partnerId: "", amount: "" });
      setIsTxOpen(false);
      await loadData();
      window.dispatchEvent(new Event("admin-data-change"));
    } catch {
      toast.error(t("admin.dashboard.txLogFailed"));
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
