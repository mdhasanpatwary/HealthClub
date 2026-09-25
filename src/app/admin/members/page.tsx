"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Member } from "@/services/db";
import {
  getPaginatedMembersAction,
  getMemberProfilePictureAction,
  updateMemberAction,
  deleteMemberAction,
  updateMemberStatusAction,
} from "@/app/actions/memberAdminActions";
import { addMemberAction } from "@/app/actions/memberActions";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { useDebounce } from "@/hooks/useDebounce";
import { MembersTab } from "../components/MembersTab";
import { MemberDialog } from "../components/MemberDialog";
import { MemberDetailsDialog } from "../components/MemberDetailsDialog";

export default function AdminMembersPage() {
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<Member[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [memberSearch, setMemberSearch] = useState("");
  const debouncedSearch = useDebounce(memberSearch, 300);

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
      const membersRes = await getPaginatedMembersAction({
        page,
        pageSize,
        search: debouncedSearch,
      });
      setMembers(membersRes.data);
      setTotalItems(membersRes.totalItems);
      setTotalPages(membersRes.totalPages);
    } catch {
      toast.error("সদস্য তালিকা লোড করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, debouncedSearch]);

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
        const success = await updateMemberAction(editingMember.id, {
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
        const res = await addMemberAction({
          name: newMember.name,
          phone: newMember.phone,
          email: newMember.email,
          tier: newMember.tier,
          address: newMember.address,
          birthDate: newMember.birthDate,
          profession: newMember.profession,
          profilePictureUrl: newMember.profilePictureUrl,
        });
        if ("error" in res) {
          toast.error(res.error || "নতুন মেম্বার যুক্ত করতে সমস্যা হয়েছে।");
          return;
        }
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
      toast.success(editingMember ? "মেম্বারের তথ্য সফলভাবে আপডেট করা হয়েছে।" : "নতুন মেম্বার সফলভাবে যুক্ত করা হয়েছে।");
    } catch {
      toast.error(editingMember ? "মেম্বারের তথ্য আপডেট করতে সমস্যা হয়েছে।" : "নতুন মেম্বার যুক্ত করতে সমস্যা হয়েছে।");
    }
  };

  const handleDeleteMember = async (id: string, name: string) => {
    if (confirm(`আপনি কি নিশ্চিত যে "${name}" মেম্বারকে মুছে ফেলতে চান?`)) {
      try {
        const success = await deleteMemberAction(id);
        if (success) {
          toast.success("মেম্বার সফলভাবে মুছে ফেলা হয়েছে।");
          await loadData();
          notifyChange();
        } else {
          toast.error("মেম্বার মুছতে সমস্যা হয়েছে।");
        }
      } catch {
        toast.error("মেম্বার মুছতে সমস্যা হয়েছে।");
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
      toast.error("পেন্ডিং মেম্বারকে সরাসরি সক্রিয় অথবা নিষ্ক্রিয় করা যাবে না।");
      return;
    }

    try {
      const success = await updateMemberStatusAction(id, newStatus);
      if (success) {
        toast.success("মেম্বার স্ট্যাটাস সফলভাবে আপডেট করা হয়েছে।");
        if (viewingMember && viewingMember.id === id) {
          setViewingMember({ ...viewingMember, status: newStatus });
        }
        await loadData();
        notifyChange();
      } else {
        toast.error("মেম্বার স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে।");
      }
    } catch {
      toast.error("মেম্বার স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে।");
    }
  };

  const handleOpenEditMember = async (m: Member) => {
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

    if (!m.profilePictureUrl) {
      try {
        const pic = await getMemberProfilePictureAction(m.id);
        if (pic) {
          setNewMember((prev) => ({
            ...prev,
            profilePictureUrl: pic,
          }));
        }
      } catch {
        // ignore background picture load error
      }
    }
  };

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
        members={members}
        totalItems={totalItems}
        totalPages={totalPages}
        currentPage={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPage(1);
        }}
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
        onEditClick={handleOpenEditMember}
        onDeleteClick={handleDeleteMember}
        loading={loading}
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
        />
      )}

      {viewingMember && (
        <MemberDetailsDialog
          viewingMember={viewingMember}
          onClose={() => setViewingMember(null)}
          onToggleStatus={handleToggleMemberStatus}
          onEditClick={(m) => {
            setViewingMember(null);
            handleOpenEditMember(m);
          }}
        />
      )}
    </div>
  );
}
