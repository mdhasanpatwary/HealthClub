"use client";

import { useLanguage } from "@/components/layout/LanguageProvider";
import { PlusCircle, Settings } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

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
import { AdminStatsGrid } from "./components/AdminStatsGrid";
import { useAdminData } from "./hooks/useAdminData";

export default function AdminDashboardPage() {
  const { t, locale } = useLanguage();
  const adminData = useAdminData(t, locale);

  const {
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
  } = adminData;

  if (loading) {
    return (
      <div className="bg-muted/30 min-h-screen py-6 sm:py-10 animate-pulse">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6">
            <div className="space-y-2">
              <Skeleton className="h-8 w-64 animate-pulse" />
              <Skeleton className="h-4 w-96 animate-pulse" />
            </div>
            <Skeleton className="h-9 w-32 rounded-md" />
          </div>

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
              {t("admin.dashboard.logMemberDiscountTitle")}
            </Button>
          </div>
        </div>

        {/* Admin Stats Grid & Alerts */}
        <AdminStatsGrid
          stats={stats}
          onSelectTab={(tab) => setActiveTab(tab === "partnerRequests" ? "requests" : tab)}
        />

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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
