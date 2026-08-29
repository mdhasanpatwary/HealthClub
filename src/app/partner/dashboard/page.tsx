"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Receipt, Building2, Stethoscope, BarChart3, Users } from "lucide-react";
import { authStore, StaffSessionUser } from "@/services/authStore";
import { Partner, Transaction } from "@/services/db";
import { getPartnerTransactionsAction, getPartnerProfileAction } from "@/app/actions/partnerActions";
import { getCurrentPartnerStaffSessionAction } from "@/app/actions/partnerStaffActions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { PartnerDashboardSkeleton } from "./components/PartnerDashboardSkeleton";
import { PartnerDashboardHeader } from "./components/PartnerDashboardHeader";
import { PartnerBillingTab } from "./components/PartnerBillingTab";
import { PartnerDoctorsTab } from "./components/PartnerDoctorsTab";
import { PartnerProfileSettingsTab } from "./components/PartnerProfileSettingsTab";
import { PartnerAnalyticsTab } from "./components/PartnerAnalyticsTab";
import { PartnerStaffTab } from "./components/PartnerStaffTab";
import { toast } from "sonner";

export default function PartnerDashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const initialTab =
    tabParam === "profile"
      ? "profile"
      : tabParam === "doctors"
      ? "doctors"
      : tabParam === "analytics"
      ? "analytics"
      : tabParam === "staff"
      ? "staff"
      : "billing";

  const [activeTab, setActiveTab] = useState(initialTab);
  const [partner, setPartner] = useState<Partner | null>(null);
  const [currentStaff, setCurrentStaff] = useState<StaffSessionUser | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const { t, locale } = useLanguage();

  const loadTransactions = useCallback(async () => {
    setLoadingTransactions(true);
    try {
      const data = await getPartnerTransactionsAction();
      setTransactions(data);
    } catch {
      toast.error(t("partner.errors.loadTransactionsError"));
    } finally {
      setLoadingTransactions(false);
    }
  }, [t]);

  useEffect(() => {
    let isMounted = true;

    async function initPartnerDashboard() {
      // 1. Initial cached render
      let activePartner = authStore.getCurrentPartner();
      const activeStaff = authStore.getCurrentStaff();
      if (activePartner && isMounted) {
        setPartner(activePartner);
      }
      if (activeStaff && isMounted) {
        setCurrentStaff(activeStaff);
      }

      // 2. Hydrate from server session in parallel
      try {
        const [profileRes, txs, staffSessionRes] = await Promise.all([
          getPartnerProfileAction().catch(() => null),
          getPartnerTransactionsAction().catch(() => []),
          getCurrentPartnerStaffSessionAction().catch(() => null),
        ]);

        if (!isMounted) return;

        if (profileRes?.success && profileRes.partner) {
          activePartner = profileRes.partner;
          setPartner(activePartner);
          authStore.setCurrentPartner(activePartner);
        }

        if (staffSessionRes?.isStaff && staffSessionRes.staff) {
          const staffObj: StaffSessionUser = {
            id: staffSessionRes.staff.id,
            name: staffSessionRes.staff.name,
            deskName: staffSessionRes.staff.deskName,
            role: "cashier",
            username: staffSessionRes.staff.username || "",
          };
          setCurrentStaff(staffObj);
          authStore.setCurrentStaff(staffObj);
        } else if (staffSessionRes && !staffSessionRes.isStaff) {
          setCurrentStaff(null);
          authStore.setCurrentStaff(null);
        }

        if (txs) {
          setTransactions(txs);
        }
      } catch {
        // Retain cached session on network glitch
      } finally {
        if (isMounted) {
          setLoadingTransactions(false);
        }
      }

      // 3. Only redirect if partner is completely missing from both cache and server
      if (!activePartner && isMounted) {
        router.push("/login/partner");
      }
    }

    initPartnerDashboard();

    return () => {
      isMounted = false;
    };
  }, [router]);

  const handleLogout = () => {
    authStore.logoutPartner();
    toast.success(t("auth.logoutSuccess"));
    window.location.href = "/login/partner";
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
      <PartnerDashboardHeader partner={partner} currentStaff={currentStaff} onLogout={handleLogout} />

      {/* Main Tabbed Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
        <TabsList className="flex flex-wrap items-center justify-start sm:justify-center w-full h-auto group-data-horizontal/tabs:h-auto p-1.5 bg-muted/70 dark:bg-slate-900/80 rounded-2xl border border-border/60 gap-1.5">
          <TabsTrigger
            value="billing"
            className="flex-1 sm:flex-initial min-w-[140px] sm:min-w-[160px] h-auto min-h-[44px] py-2.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all data-active:bg-background data-active:text-foreground data-active:shadow-md data-active:border-border/80 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-md cursor-pointer whitespace-nowrap justify-center"
          >
            <Receipt className="h-4 w-4 mr-2 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>{locale === "bn" ? "বিলিং ও ভেরিফিকেশন" : (t("partner.dashboard.tabs.billing") || "POS Billing")}</span>
          </TabsTrigger>
          <TabsTrigger
            value="doctors"
            className="flex-1 sm:flex-initial min-w-[140px] sm:min-w-[160px] h-auto min-h-[44px] py-2.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all data-active:bg-background data-active:text-foreground data-active:shadow-md data-active:border-border/80 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-md cursor-pointer whitespace-nowrap justify-center"
          >
            <Stethoscope className="h-4 w-4 mr-2 shrink-0 text-teal-600 dark:text-teal-400" />
            <span>{locale === "bn" ? "ডাক্তার ও চেম্বার" : (t("partner.dashboard.tabs.doctors") || "Doctor Roster")}</span>
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="flex-1 sm:flex-initial min-w-[140px] sm:min-w-[160px] h-auto min-h-[44px] py-2.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all data-active:bg-background data-active:text-foreground data-active:shadow-md data-active:border-border/80 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-md cursor-pointer whitespace-nowrap justify-center"
          >
            <BarChart3 className="h-4 w-4 mr-2 shrink-0 text-amber-500 dark:text-amber-400" />
            <span>{locale === "bn" ? "অ্যানালিটিক্স ও রিপোর্ট" : (t("partner.dashboard.tabs.analytics") || "Analytics")}</span>
          </TabsTrigger>
          <TabsTrigger
            value="staff"
            className="flex-1 sm:flex-initial min-w-[140px] sm:min-w-[160px] h-auto min-h-[44px] py-2.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all data-active:bg-background data-active:text-foreground data-active:shadow-md data-active:border-border/80 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-md cursor-pointer whitespace-nowrap justify-center"
          >
            <Users className="h-4 w-4 mr-2 shrink-0 text-blue-500 dark:text-blue-400" />
            <span>{locale === "bn" ? "স্টাফ ও কাউন্টার" : (t("partner.dashboard.tabs.staff") || "Staff & Counters")}</span>
          </TabsTrigger>
          <TabsTrigger
            value="profile"
            className="flex-1 sm:flex-initial min-w-[140px] sm:min-w-[160px] h-auto min-h-[44px] py-2.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all data-active:bg-background data-active:text-foreground data-active:shadow-md data-active:border-border/80 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-md cursor-pointer whitespace-nowrap justify-center"
          >
            <Building2 className="h-4 w-4 mr-2 shrink-0 text-indigo-500 dark:text-indigo-400" />
            <span>{locale === "bn" ? "হাসপাতাল প্রোফাইল" : (t("partner.dashboard.tabs.profileSettings") || "Profile Settings")}</span>
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

        {/* Tab 3: Monthly Settlement Statements & Analytics */}
        <TabsContent value="analytics" className="space-y-6 focus-visible:outline-none">
          <PartnerAnalyticsTab partner={partner} />
        </TabsContent>

        {/* Tab 4: Hospital Multi-Cashier & Counter Staff Accounts */}
        <TabsContent value="staff" className="space-y-6 focus-visible:outline-none">
          <PartnerStaffTab partner={partner} />
        </TabsContent>

        {/* Tab 5: Hospital Profile, Emergency Contact & Department Discounts */}
        <TabsContent value="profile" className="space-y-6 focus-visible:outline-none">
          <PartnerProfileSettingsTab
            partner={partner}
            isStaff={Boolean(currentStaff)}
            onProfileUpdated={handleProfileUpdated}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

