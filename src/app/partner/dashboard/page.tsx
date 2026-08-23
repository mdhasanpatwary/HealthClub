"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Receipt, Building2, Stethoscope } from "lucide-react";
import { dbStore } from "@/services/dbStore";
import { Partner, Transaction } from "@/services/db";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { PartnerDashboardSkeleton } from "./components/PartnerDashboardSkeleton";
import { PartnerDashboardHeader } from "./components/PartnerDashboardHeader";
import { PartnerBillingTab } from "./components/PartnerBillingTab";
import { PartnerDoctorsTab } from "./components/PartnerDoctorsTab";
import { PartnerProfileSettingsTab } from "./components/PartnerProfileSettingsTab";
import { toast } from "sonner";

export default function PartnerDashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const initialTab = tabParam === "profile" ? "profile" : tabParam === "doctors" ? "doctors" : "billing";

  const [activeTab, setActiveTab] = useState(initialTab);
  const [partner, setPartner] = useState<Partner | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const { t } = useLanguage();

  const loadTransactions = useCallback(async () => {
    setLoadingTransactions(true);
    try {
      const data = await dbStore.getPartnerTransactions();
      setTransactions(data);
    } catch {
      toast.error("লেনদেন তালিকা লোড করতে সমস্যা হয়েছে।");
    } finally {
      setLoadingTransactions(false);
    }
  }, []);

  const refreshPartnerProfile = useCallback(async () => {
    try {
      const res = await dbStore.getPartnerProfile();
      if (res.success && res.partner) {
        setPartner(res.partner);
        dbStore.setCurrentPartner(res.partner);
      }
    } catch {
      // Fallback to cached partner session
    }
  }, []);

  useEffect(() => {
    const currentPartner = dbStore.getCurrentPartner();
    if (!currentPartner) {
      router.push("/login/partner");
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPartner(currentPartner);
    loadTransactions();
    refreshPartnerProfile();
  }, [router, loadTransactions, refreshPartnerProfile]);

  const handleLogout = () => {
    dbStore.logoutPartner();
    toast.success("সফলভাবে লগআউট করা হয়েছে।");
    router.push("/login/partner");
  };

  const handleProfileUpdated = (updated: Partner) => {
    setPartner(updated);
  };

  if (!partner) {
    return <PartnerDashboardSkeleton />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Top Header Profile Card */}
      <PartnerDashboardHeader partner={partner} onLogout={handleLogout} />

      {/* Main Tabbed Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-2xl bg-muted/70 dark:bg-slate-900/70 p-1.5 rounded-2xl border border-border/60">
          <TabsTrigger
            value="billing"
            className="rounded-xl text-xs sm:text-sm font-semibold py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm cursor-pointer"
          >
            <Receipt className="h-4 w-4 mr-1.5" />
            <span className="hidden sm:inline">{t("partner.dashboard.tabs.billing")}</span>
            <span className="sm:hidden">বিলিং</span>
          </TabsTrigger>
          <TabsTrigger
            value="doctors"
            className="rounded-xl text-xs sm:text-sm font-semibold py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm cursor-pointer"
          >
            <Stethoscope className="h-4 w-4 mr-1.5 text-primary" />
            <span className="hidden sm:inline">{t("partner.dashboard.tabs.doctors")}</span>
            <span className="sm:hidden">ডাক্তার</span>
          </TabsTrigger>
          <TabsTrigger
            value="profile"
            className="rounded-xl text-xs sm:text-sm font-semibold py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm cursor-pointer"
          >
            <Building2 className="h-4 w-4 mr-1.5" />
            <span className="hidden sm:inline">{t("partner.dashboard.tabs.profileSettings")}</span>
            <span className="sm:hidden">প্রোফাইল</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Member Verification & POS Billing */}
        <TabsContent value="billing" className="space-y-6 focus-visible:outline-none">
          <PartnerBillingTab
            partner={partner}
            transactions={transactions}
            loadingTransactions={loadingTransactions}
            onTransactionComplete={loadTransactions}
          />
        </TabsContent>

        {/* Tab 2: Hospital Doctor Roster & Chamber Management */}
        <TabsContent value="doctors" className="space-y-6 focus-visible:outline-none">
          <PartnerDoctorsTab partner={partner} />
        </TabsContent>

        {/* Tab 3: Hospital Profile, Emergency Contact & Department Discounts */}
        <TabsContent value="profile" className="space-y-6 focus-visible:outline-none">
          <PartnerProfileSettingsTab
            partner={partner}
            onProfileUpdated={handleProfileUpdated}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
