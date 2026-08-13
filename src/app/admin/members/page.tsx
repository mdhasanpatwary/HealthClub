"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { dbStore } from "@/services/dbStore";
import { Member, Transaction } from "@/services/db";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { MembersTab } from "../components/MembersTab";
import { MemberDialog } from "../components/MemberDialog";
import { MemberDetailsDialog } from "../components/MemberDetailsDialog";

export default function AdminMembersPage() {
  const { t, locale } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<Member[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [memberSearch, setMemberSearch] = useState("");

  // Dialog States
  const [isMemberOpen, setIsMemberOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [viewingMember, setViewingMember] = useState<Member | null>(null);
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

  const loadData = useCallback(async () => {
    try {
      const [membersRes, txRes] = await Promise.all([
        dbStore.getMembers(),
        dbStore.getTransactions(),
      ]);
      setMembers(membersRes);
      setTransactions(txRes);
    } catch (err) {
      console.error("Failed to load members:", err);
      toast.error("সদস্য তালিকা লোড করতে সমস্যা হয়েছে।");
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
    return () => {
      isMounted = false;
    };
  }, [loadData]);

  const notifyChange = () => {
    window.dispatchEvent(new Event("admin-data-change"));
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name || !newMember.phone) {
      toast.error("নাম ও ফোন নম্বর আবশ্যক।");
      return;
    }

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

      setNewMember({
        name: "",
        phone: "",
        email: "",
        tier: "founding",
        address: "",
        birthDate: "",
        profession: "",
        profilePictureUrl: "",
      });
      setEditingMember(null);
      setIsMemberOpen(false);
      await loadData();
      notifyChange();
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
          await loadData();
          notifyChange();
        } else {
          toast.error(t("admin.dashboard.memberDeletedFailed"));
        }
      } catch {
        toast.error(t("admin.dashboard.memberDeletedFailed"));
      }
    }
  };

  const handleToggleMemberStatus = async (id: string) => {
    const member = members.find((m) => m.id === id);
    if (!member) return;

    let newStatus: Member["status"];
    if (member.status === "pending_approval") {
      newStatus = "active";
    } else if (member.status === "active") {
      newStatus = "inactive";
    } else if (member.status === "inactive") {
      newStatus = "active";
    } else {
      toast.error(t("admin.dashboard.memberStatusPendingError") || "এই মেম্বারের স্ট্যাটাস পরিবর্তন করতে নবায়ন অনুমোদন ট্যাব ব্যবহার করুন।");
      return;
    }

    const success = await dbStore.updateMemberStatus(id, newStatus);
    if (success) {
      toast.success(t("admin.dashboard.memberStatusUpdatedSuccess"));
      if (viewingMember && viewingMember.id === id) {
        setViewingMember({ ...viewingMember, status: newStatus });
      }
      await loadData();
      notifyChange();
    } else {
      toast.error(t("admin.dashboard.memberStatusUpdatedFailed"));
    }
  };

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.id.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.phone.includes(memberSearch)
  );

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <Skeleton className="h-10 w-48 rounded-lg" />
        <Card className="border-border shadow-md">
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-border">
              <Skeleton className="h-9 w-48 rounded-md" />
              <Skeleton className="h-9 w-24 rounded-md" />
            </div>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center py-3 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
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
    );
  }

  return (
    <div className="space-y-6">
      <MembersTab
        filteredMembers={filteredMembers}
        memberSearch={memberSearch}
        setMemberSearch={setMemberSearch}
        onNewMemberClick={() => {
          setEditingMember(null);
          setNewMember({
            name: "",
            phone: "",
            email: "",
            tier: "founding",
            address: "",
            birthDate: "",
            profession: "",
            profilePictureUrl: "",
          });
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
            profilePictureUrl: m.profilePictureUrl || "",
          });
          setIsMemberOpen(true);
        }}
        onDeleteClick={handleDeleteMember}
        locale={locale}
        t={t}
      />

      {isMemberOpen && (
        <MemberDialog
          isOpen={isMemberOpen}
          onClose={() => {
            setIsMemberOpen(false);
            setEditingMember(null);
            setNewMember({
              name: "",
              phone: "",
              email: "",
              tier: "founding",
              address: "",
              birthDate: "",
              profession: "",
              profilePictureUrl: "",
            });
          }}
          editingMember={editingMember}
          newMember={newMember}
          setNewMember={setNewMember}
          onSubmit={handleSaveMember}
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
              profilePictureUrl: m.profilePictureUrl || "",
            });
            setViewingMember(null);
            setIsMemberOpen(true);
          }}
          locale={locale}
          t={t}
        />
      )}
    </div>
  );
}
