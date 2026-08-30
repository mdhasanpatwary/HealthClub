"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { History, LayoutDashboard } from "lucide-react";
import { toast } from "sonner";
import { authStore } from "@/services/authStore";
import { Member, Partner, Transaction } from "@/services/db";
import { getMemberByIdAction, updateMemberProfileAction } from "@/app/actions/memberActions";
import { getTransactionsAction, addTransactionAction } from "@/app/actions/transactionActions";
import { isMemberTxAllowedAction } from "@/app/actions/systemSettingsActions";
import { getPartnersAction } from "@/app/actions/partnerActions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/components/layout/LanguageProvider";

import { DashboardSkeleton } from "./components/DashboardSkeleton";
import { DashboardWelcomeHeader } from "./components/DashboardWelcomeHeader";
import { DashboardStatsCards } from "./components/DashboardStatsCards";
import { DashboardCardSection } from "./components/DashboardCardSection";
import { DashboardHistoryTab } from "./components/DashboardHistoryTab";
import { DashboardProfileTab } from "./components/DashboardProfileTab";
import { AddMemberTxDialog } from "./components/AddMemberTxDialog";
import { OfflineCardBanner } from "./components/OfflineCardBanner";
import {
  saveOfflineMemberCard,
  getOfflineMemberCard,
  saveOfflineEmergencyDirectory,
} from "@/lib/safeStorage";
import { INITIAL_AMBULANCES, INITIAL_EMERGENCY_HOTLINES } from "@/data/emergencyData";

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedTab = searchParams.get("tab") === "profile" ? "profile" : "history";
  const [activeTab, setActiveTab] = useState(requestedTab);
  const { t, locale } = useLanguage();
  const [user, setUser] = useState<Member | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const cardRef = useRef<HTMLDivElement>(null);

  // Profile Form States
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileAddress, setProfileAddress] = useState("");
  const [profileBirthDate, setProfileBirthDate] = useState("");
  const [profileProfession, setProfileProfession] = useState("");
  const [profilePictureUrl, setProfilePictureUrl] = useState("");

  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  // Add Member Transaction States
  const [allowMemberTx, setAllowMemberTx] = useState(false);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isAddTxOpen, setIsAddTxOpen] = useState(false);
  const [newTxPartnerId, setNewTxPartnerId] = useState("");
  const [newTxAmount, setNewTxAmount] = useState("");
  const [newTxDiscountPercent, setNewTxDiscountPercent] = useState("10");
  const [addTxSubmitting, setAddTxSubmitting] = useState(false);

  // Load data on mount — all independent requests fire in parallel
  useEffect(() => {
    let isMounted = true;

    Promise.resolve().then(async () => {
      if (!isMounted) return;

      let currentUser = authStore.getCurrentUser();
      // If not in local storage (e.g. offline cold start), attempt to recover from IndexedDB
      if (!currentUser) {
        const offlineCard = await getOfflineMemberCard();
        if (offlineCard) {
          currentUser = offlineCard;
        } else {
          router.push("/login");
          return;
        }
      }

      // Set initial cached state immediately for fast response
      setUser(currentUser);
      setProfileName(currentUser.name);
      setProfileEmail(currentUser.email || "");
      setProfilePhone(currentUser.phone);
      setProfileAddress(currentUser.address || "");
      setProfileBirthDate(currentUser.birthDate || "");
      setProfileProfession(currentUser.profession || "");
      setProfilePictureUrl(currentUser.profilePictureUrl || "");

      // Ensure active member card and emergency directory are safely cached in IndexedDB
      saveOfflineMemberCard(currentUser).catch(() => {});
      saveOfflineEmergencyDirectory({
        ambulances: INITIAL_AMBULANCES,
        hotlines: INITIAL_EMERGENCY_HOTLINES,
      }).catch(() => {});

      const expiry = new Date(currentUser.expiryDate);
      const today = new Date();
      expiry.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      const diffTime = expiry.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDaysRemaining(diffDays);
      setIsExpired(diffDays < 0);

      try {
        const [freshUser, userTx, allowed, pts] = await Promise.all([
          getMemberByIdAction(currentUser.id).catch(() => null),
          getTransactionsAction(currentUser.id).catch(() => []),
          isMemberTxAllowedAction().catch(() => false),
          getPartnersAction().catch(() => []),
        ]);

        if (!isMounted) return;
        const activeUser = freshUser || currentUser;
        setUser(activeUser);
        saveOfflineMemberCard(activeUser).catch(() => {});

        setProfileName(activeUser.name);
        setProfileEmail(activeUser.email || "");
        setProfilePhone(activeUser.phone);
        setProfileAddress(activeUser.address || "");
        setProfileBirthDate(activeUser.birthDate || "");
        setProfileProfession(activeUser.profession || "");
        setProfilePictureUrl(activeUser.profilePictureUrl || "");

        const freshExpiry = new Date(activeUser.expiryDate);
        freshExpiry.setHours(0, 0, 0, 0);
        const freshDiffTime = freshExpiry.getTime() - today.getTime();
        const freshDiffDays = Math.ceil(freshDiffTime / (1000 * 60 * 60 * 24));
        setDaysRemaining(freshDiffDays);
        setIsExpired(freshDiffDays < 0);

        setTransactions(userTx);
        setAllowMemberTx(allowed);
        setPartners(pts);
      } catch {
        if (isMounted) {
          toast.error(t("dashboard.syncError"));
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, [router, t]);

  const handleAddMemberTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newTxPartnerId || !newTxAmount) return;

    const partner = partners.find((p) => p.id === newTxPartnerId);
    if (!partner) {
      toast.error(t("dashboard.history.selectedPartnerNotFound"));
      return;
    }

    const billAmount = Number(newTxAmount);
    if (isNaN(billAmount) || billAmount <= 0) {
      toast.error(t("dashboard.history.enterValidBillAmount"));
      return;
    }

    const parsedPercent = Number(newTxDiscountPercent);
    const discountRate = isNaN(parsedPercent) ? 0.10 : Math.min(Math.max(0, parsedPercent), 70) / 100;
    const saved = Math.round(billAmount * discountRate);

    setAddTxSubmitting(true);
    try {
      const res = await addTransactionAction({
        memberId: user.id,
        memberName: user.name,
        partnerId: partner.id,
        partnerName: partner.name,
        amount: billAmount,
        saved: saved,
      });

      if ("error" in res) {
        toast.error(res.error || t("dashboard.history.txAddFailed"));
        return;
      }

      // Sync totalSaved in localStorage
      const currentUser = authStore.getCurrentUser();
      if (currentUser && currentUser.id === user.id) {
        authStore.setCurrentUser({
          ...currentUser,
          totalSaved: currentUser.totalSaved + saved,
        });
      }

      toast.success(t("dashboard.history.txAddedSuccess"));
      setNewTxPartnerId("");
      setNewTxAmount("");
      setNewTxDiscountPercent("10");
      setIsAddTxOpen(false);

      // Refresh transactions and user stats
      const updatedTx = await getTransactionsAction(user.id);
      setTransactions(updatedTx);
      const freshUser = await getMemberByIdAction(user.id);
      if (freshUser) {
        setUser(freshUser);
        authStore.setCurrentUser(freshUser);
      }
    } catch {
      toast.error(t("dashboard.history.txAddFailed"));
    } finally {
      setAddTxSubmitting(false);
    }
  };

  const handleDownloadCard = async () => {
    if (!cardRef.current) return;

    const loadingToast = toast.loading(t("dashboard.card.downloading"));

    try {
      const { toCanvas } = await import("html-to-image");

      const cardElement = cardRef.current;
      const originalCanvas = await toCanvas(cardElement, {
        cacheBust: true,
        pixelRatio: 3,
        style: {
          transform: "scale(1)",
          transformOrigin: "top left",
        },
      });

      const computedStyle = window.getComputedStyle(cardElement);
      const borderRadiusPx = parseFloat(computedStyle.borderRadius) || 16;
      const scale = originalCanvas.width / cardElement.offsetWidth;
      const radius = borderRadiusPx * scale;

      const outputCanvas = document.createElement("canvas");
      outputCanvas.width = originalCanvas.width;
      outputCanvas.height = originalCanvas.height;

      const ctx = outputCanvas.getContext("2d");
      if (ctx) {
        ctx.beginPath();
        if (typeof ctx.roundRect === "function") {
          ctx.roundRect(0, 0, outputCanvas.width, outputCanvas.height, radius);
        } else {
          ctx.moveTo(radius, 0);
          ctx.lineTo(outputCanvas.width - radius, 0);
          ctx.arcTo(outputCanvas.width, 0, outputCanvas.width, radius, radius);
          ctx.lineTo(outputCanvas.width, outputCanvas.height - radius);
          ctx.arcTo(outputCanvas.width, outputCanvas.height, outputCanvas.width - radius, outputCanvas.height, radius);
          ctx.lineTo(radius, outputCanvas.height);
          ctx.arcTo(0, outputCanvas.height, 0, outputCanvas.height - radius, radius);
          ctx.lineTo(0, radius);
          ctx.arcTo(0, 0, radius, 0, radius);
          ctx.closePath();
        }
        ctx.clip();
        ctx.fillStyle = "#020617";
        ctx.fillRect(0, 0, outputCanvas.width, outputCanvas.height);
        ctx.drawImage(originalCanvas, 0, 0);
      }

      const dataUrl = outputCanvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.download = `health-club-card-${user?.id || "member"}.png`;
      link.href = dataUrl;
      link.click();

      toast.dismiss(loadingToast);
      toast.success(t("dashboard.card.downloadSuccess"));
    } catch {
      toast.dismiss(loadingToast);
      toast.error(t("dashboard.card.downloadFailed"));
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    try {
      const success = await updateMemberProfileAction(
        user.id,
        profileName,
        profilePhone,
        profileEmail,
        profileAddress,
        profileBirthDate,
        profileProfession,
        profilePictureUrl
      );

      if (success) {
        const updatedUser = {
          ...user,
          name: profileName,
          email: profileEmail,
          phone: profilePhone,
          address: profileAddress,
          birthDate: profileBirthDate,
          profession: profileProfession,
          profilePictureUrl: profilePictureUrl,
        };
        authStore.setCurrentUser(updatedUser);
        setUser(updatedUser);
        toast.success(t("dashboard.profile.success"));
      } else {
        toast.error(t("dashboard.profile.error"));
      }
    } catch {
      toast.error(t("dashboard.profile.serverError"));
    }
  };

  if (!user) {
    return <DashboardSkeleton />;
  }

  const totalSaved = user.totalSaved || 0;
  const totalSpent = transactions.reduce((acc, tx) => acc + tx.amount, 0);

  return (
    <div className="bg-muted/30 dark:bg-slate-950/50 min-h-screen py-6 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">

        {/* Offline Status & Emergency Call Banner */}
        <OfflineCardBanner locale={locale} />

        {/* Welcome Banner */}
        <DashboardWelcomeHeader
          user={user}
          t={t}
          locale={locale}
          daysRemaining={daysRemaining}
          isExpired={isExpired}
        />

        {/* Overview Stats Cards */}
        <DashboardStatsCards
          totalSaved={totalSaved}
          totalSpent={totalSpent}
          transactions={transactions}
          t={t}
          locale={locale}
        />

        {/* Main Dashboard Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Digital Card Section */}
          <DashboardCardSection
            user={user}
            cardRef={cardRef}
            handleDownloadCard={handleDownloadCard}
            t={t}
          />

          {/* Right Column: Dynamic Tabs */}
          <div className="lg:col-span-7">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-muted/60 dark:bg-slate-900/60 p-1.5 rounded-xl border border-border/60">
                <TabsTrigger value="history" className="rounded-lg text-xs font-semibold py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  <History className="h-3.5 w-3.5 mr-1.5" />
                  {t("dashboard.tabs.history")}
                </TabsTrigger>
                <TabsTrigger value="profile" className="rounded-lg text-xs font-semibold py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  <LayoutDashboard className="h-3.5 w-3.5 mr-1.5" />
                  {t("dashboard.tabs.profile")}
                </TabsTrigger>
              </TabsList>

              {/* Transactions History Tab */}
              <TabsContent value="history" className="mt-4">
                <DashboardHistoryTab
                  transactions={transactions}
                  allowMemberTx={allowMemberTx}
                  user={user}
                  setIsAddTxOpen={setIsAddTxOpen}
                  t={t}
                  locale={locale}
                />
              </TabsContent>

              {/* Profile Settings Tab */}
              <TabsContent value="profile" className="mt-4">
                <DashboardProfileTab
                  handleUpdateProfile={handleUpdateProfile}
                  profilePictureUrl={profilePictureUrl}
                  setProfilePictureUrl={setProfilePictureUrl}
                  profileName={profileName}
                  setProfileName={setProfileName}
                  profilePhone={profilePhone}
                  setProfilePhone={setProfilePhone}
                  profileEmail={profileEmail}
                  setProfileEmail={setProfileEmail}
                  profileAddress={profileAddress}
                  setProfileAddress={setProfileAddress}
                  profileBirthDate={profileBirthDate}
                  setProfileBirthDate={setProfileBirthDate}
                  profileProfession={profileProfession}
                  setProfileProfession={setProfileProfession}
                  t={t}
                />
              </TabsContent>

            </Tabs>
          </div>

        </div>

      </div>

      {/* Member Add Transaction Dialog */}
      {allowMemberTx && (
        <AddMemberTxDialog
          isAddTxOpen={isAddTxOpen}
          setIsAddTxOpen={setIsAddTxOpen}
          handleAddMemberTransaction={handleAddMemberTransaction}
          newTxPartnerId={newTxPartnerId}
          setNewTxPartnerId={setNewTxPartnerId}
          newTxAmount={newTxAmount}
          setNewTxAmount={setNewTxAmount}
          newTxDiscountPercent={newTxDiscountPercent}
          setNewTxDiscountPercent={setNewTxDiscountPercent}
          partners={partners}
          addTxSubmitting={addTxSubmitting}
          t={t}
          locale={locale}
        />
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
