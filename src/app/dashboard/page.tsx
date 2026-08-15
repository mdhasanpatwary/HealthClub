"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { History, LayoutDashboard } from "lucide-react";
import { toast } from "sonner";
import { dbStore } from "@/services/dbStore";
import { Member, Partner, Transaction } from "@/services/db";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/components/layout/LanguageProvider";

import { DashboardSkeleton } from "./components/DashboardSkeleton";
import { DashboardWelcomeHeader } from "./components/DashboardWelcomeHeader";
import { DashboardStatsCards } from "./components/DashboardStatsCards";
import { DashboardCardSection } from "./components/DashboardCardSection";
import { DashboardHistoryTab } from "./components/DashboardHistoryTab";
import { DashboardProfileTab } from "./components/DashboardProfileTab";
import { AddMemberTxDialog } from "./components/AddMemberTxDialog";

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

      const currentUser = dbStore.getCurrentUser();
      if (!currentUser) {
        router.push("/login");
        return;
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
          dbStore.getMemberById(currentUser.id).catch(() => null),
          dbStore.getTransactions(currentUser.id).catch(() => []),
          dbStore.isMemberTxAllowed().catch(() => false),
          dbStore.getPartners().catch(() => []),
        ]);

        if (!isMounted) return;
        const activeUser = freshUser || currentUser;
        setUser(activeUser);
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
      } catch (err) {
        console.error("Dashboard fresh data fetch failed:", err);
        if (isMounted) {
          toast.error("ড্যাশবোর্ডের কিছু তথ্য আপডেট করতে সমস্যা হয়েছে। ক্যাশড তথ্য প্রদর্শিত হচ্ছে।");
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, [router]);

  const handleAddMemberTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newTxPartnerId || !newTxAmount) return;

    const partner = partners.find((p) => p.id === newTxPartnerId);
    if (!partner) {
      toast.error(t("admin.dashboard.selectedPartnerNotFound"));
      return;
    }

    const billAmount = Number(newTxAmount);
    if (isNaN(billAmount) || billAmount <= 0) {
      toast.error(t("admin.dashboard.enterValidBillAmount"));
      return;
    }

    const parsedPercent = Number(newTxDiscountPercent);
    const discountRate = isNaN(parsedPercent) ? 0.10 : Math.min(Math.max(0, parsedPercent), 30) / 100;
    const saved = Math.round(billAmount * discountRate);

    setAddTxSubmitting(true);
    try {
      await dbStore.addTransaction({
        memberId: user.id,
        memberName: user.name,
        partnerId: partner.id,
        partnerName: partner.name,
        amount: billAmount,
        saved: saved,
      });

      toast.success(t("dashboard.history.txAddedSuccess"));
      setNewTxPartnerId("");
      setNewTxAmount("");
      setNewTxDiscountPercent("10");
      setIsAddTxOpen(false);

      // Refresh transactions and user stats
      const updatedTx = await dbStore.getTransactions(user.id);
      setTransactions(updatedTx);
      const freshUser = await dbStore.getMemberById(user.id);
      if (freshUser) setUser(freshUser);
    } catch (err) {
      console.error("Error adding member tx:", err);
      toast.error(t("admin.dashboard.txLogFailed"));
    } finally {
      setAddTxSubmitting(false);
    }
  };

  const handleDownloadCard = async () => {
    if (!cardRef.current) return;

    const loadingToast = toast.loading(
      locale === "bn" ? "কার্ড ডাউনলোড হচ্ছে..." : "Downloading card..."
    );

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
      toast.success(
        locale === "bn" ? "কার্ড সফলভাবে ডাউনলোড হয়েছে!" : "Card downloaded successfully!"
      );
    } catch (error) {
      console.error("Error downloading card:", error);
      toast.dismiss(loadingToast);
      toast.error(
        locale === "bn" ? "ডাউনলোড ব্যর্থ হয়েছে। আবার চেষ্টা করুন।" : "Failed to download card. Please try again."
      );
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    try {
      const success = await dbStore.updateMemberProfile(
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
        dbStore.setCurrentUser(updatedUser);
        setUser(updatedUser);
        toast.success(t("dashboard.profile.success"));
      } else {
        toast.error(t("dashboard.profile.error"));
      }
    } catch (err) {
      console.error(err);
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
