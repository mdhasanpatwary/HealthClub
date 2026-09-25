"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { Member } from "@/services/db";

interface MemberDialogProps {
  isOpen: boolean;
  onClose: () => void;
  editingMember: Member | null;
  newMember: {
    name: string;
    phone: string;
    email: string;
    tier: "founding" | "premium";
    address: string;
    birthDate: string;
    profession: string;
    profilePictureUrl: string;
  };
  setNewMember: (member: {
    name: string;
    phone: string;
    email: string;
    tier: "founding" | "premium";
    address: string;
    birthDate: string;
    profession: string;
    profilePictureUrl: string;
  }) => void;
  onSubmit: (e: React.FormEvent) => void;
  t?: (key: string) => string;
}

export function MemberDialog({
  isOpen,
  onClose,
  editingMember,
  newMember,
  setNewMember,
  onSubmit,
}: MemberDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="border-border bg-background">
        <DialogHeader>
          <DialogTitle className="font-heading font-bold text-secondary">
            {editingMember ? "মেম্বার তথ্য সম্পাদনা করুন" : "নতুন মেম্বার যুক্ত করুন"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 pt-2">
          <ImageUpload
            value={newMember.profilePictureUrl || ""}
            onChange={(url) => setNewMember({ ...newMember, profilePictureUrl: url })}
            label="প্রোফাইল ছবি"
            folder="members"
          />
          <div className="space-y-2">
            <label htmlFor="admin-member-name" className="text-xs font-semibold text-secondary cursor-pointer">পূর্ণ নাম *</label>
            <Input id="admin-member-name" type="text" required placeholder="যেমন: মো: আরিফুল ইসলাম" value={newMember.name} onChange={e => setNewMember({ ...newMember, name: e.target.value })} className="border-border bg-background" />
          </div>
          <div className="space-y-2">
            <label htmlFor="admin-member-phone" className="text-xs font-semibold text-secondary cursor-pointer">মোবাইল নম্বর *</label>
            <Input id="admin-member-phone" type="tel" required placeholder="যেমন: 01811..." value={newMember.phone} onChange={e => setNewMember({ ...newMember, phone: e.target.value })} className="border-border bg-background" />
          </div>
          <div className="space-y-2">
            <label htmlFor="admin-member-email" className="text-xs font-semibold text-secondary cursor-pointer">ইমেইল ঠিকানা</label>
            <Input id="admin-member-email" type="email" placeholder="যেমন: example@gmail.com" value={newMember.email} onChange={e => setNewMember({ ...newMember, email: e.target.value })} className="border-border bg-background" />
          </div>
          <div className="space-y-2">
            <label htmlFor="admin-member-tier" className="text-xs font-semibold text-secondary cursor-pointer">মেম্বারশিপ প্ল্যান</label>
            <select id="admin-member-tier" value={newMember.tier} onChange={e => setNewMember({ ...newMember, tier: e.target.value as Member["tier"] })} className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary">
              <option value="founding">ফাউন্ডিং মেম্বার (১ বছর)</option>
              <option value="premium">প্রিমিয়াম মেম্বার</option>
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="admin-member-address" className="text-xs font-semibold text-secondary cursor-pointer">ঠিকানা</label>
            <Input id="admin-member-address" type="text" placeholder="যেমন: শান্তি কোম্পানি মোড়, ফেনী সদর" value={newMember.address} onChange={e => setNewMember({ ...newMember, address: e.target.value })} className="border-border bg-background" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="admin-member-birthdate" className="text-xs font-semibold text-secondary cursor-pointer">জন্ম তারিখ</label>
              <Input id="admin-member-birthdate" type="date" value={newMember.birthDate} onChange={e => setNewMember({ ...newMember, birthDate: e.target.value })} className="border-border bg-background" />
            </div>
            <div className="space-y-2">
              <label htmlFor="admin-member-profession" className="text-xs font-semibold text-secondary cursor-pointer">পেশা</label>
              <Input id="admin-member-profession" type="text" placeholder="যেমন: ব্যবসায়ী / চাকরিজীবী / শিক্ষার্থী" value={newMember.profession} onChange={e => setNewMember({ ...newMember, profession: e.target.value })} className="border-border bg-background" />
            </div>
          </div>
          <Button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-semibold">
            {editingMember ? "পরিবর্তন সংরক্ষণ করুন" : "মেম্বার যুক্ত করুন"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
