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
  t: (key: string) => string;
}

export function MemberDialog({
  isOpen,
  onClose,
  editingMember,
  newMember,
  setNewMember,
  onSubmit,
  t,
}: MemberDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="border-border bg-background">
        <DialogHeader>
          <DialogTitle className="font-heading font-bold text-secondary">
            {editingMember ? t("admin.dashboard.editMemberTitle") : t("admin.dashboard.addNewMemberTitle")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 pt-2">
          <ImageUpload
            value={newMember.profilePictureUrl || ""}
            onChange={(url) => setNewMember({ ...newMember, profilePictureUrl: url })}
            label={t("admin.dashboard.profilePictureLabel")}
          />
          <div className="space-y-2">
            <label className="text-xs font-semibold text-secondary">{t("admin.dashboard.nameLabel")}</label>
            <Input type="text" required placeholder={t("admin.dashboard.egName")} value={newMember.name} onChange={e => setNewMember({ ...newMember, name: e.target.value })} className="border-border bg-background" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-secondary">{t("admin.dashboard.phoneLabel")}</label>
            <Input type="tel" required placeholder={t("admin.dashboard.egPhone")} value={newMember.phone} onChange={e => setNewMember({ ...newMember, phone: e.target.value })} className="border-border bg-background" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-secondary">{t("admin.dashboard.emailLabel")}</label>
            <Input type="email" placeholder={t("admin.dashboard.egEmail")} value={newMember.email} onChange={e => setNewMember({ ...newMember, email: e.target.value })} className="border-border bg-background" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-secondary">{t("admin.dashboard.membershipPlanLabel")}</label>
            <select value={newMember.tier} onChange={e => setNewMember({ ...newMember, tier: e.target.value as Member["tier"] })} className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary">
              <option value="founding">{t("admin.dashboard.planFoundingOption")}</option>
              <option value="premium">{t("admin.dashboard.planPremiumOption")}</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-secondary">{t("admin.dashboard.addressLabel")}</label>
            <Input type="text" placeholder={t("admin.dashboard.egAddress")} value={newMember.address} onChange={e => setNewMember({ ...newMember, address: e.target.value })} className="border-border bg-background" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-secondary">{t("admin.dashboard.birthDateLabel")}</label>
              <Input type="date" value={newMember.birthDate} onChange={e => setNewMember({ ...newMember, birthDate: e.target.value })} className="border-border bg-background" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-secondary">{t("admin.dashboard.professionLabel")}</label>
              <Input type="text" placeholder={t("admin.dashboard.egProfession")} value={newMember.profession} onChange={e => setNewMember({ ...newMember, profession: e.target.value })} className="border-border bg-background" />
            </div>
          </div>
          <Button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-semibold">
            {editingMember ? t("admin.dashboard.saveChanges") : t("admin.dashboard.saveButton")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
