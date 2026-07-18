"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { Partner } from "@/services/db";

interface PartnerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  editingPartner: Partner | null;
  newPartner: {
    name: string;
    category: Partner["category"];
    address: string;
    discount: string;
    phone: string;
    logoText: string;
    mapLink: string;
    imageUrl: string;
  };
  setNewPartner: (partner: {
    name: string;
    category: Partner["category"];
    address: string;
    discount: string;
    phone: string;
    logoText: string;
    mapLink: string;
    imageUrl: string;
  }) => void;
  onSubmit: (e: React.FormEvent) => void;
  t: (key: string) => string;
}

export function PartnerDialog({
  isOpen,
  onClose,
  editingPartner,
  newPartner,
  setNewPartner,
  onSubmit,
  t,
}: PartnerDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="border-border bg-background">
        <DialogHeader>
          <DialogTitle className="font-heading font-bold text-secondary">
            {editingPartner ? t("admin.dashboard.editPartnerTitle") : t("admin.dashboard.addNewPartnerTitle")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 pt-2">
          <ImageUpload
            value={newPartner.imageUrl || ""}
            onChange={(url) => setNewPartner({ ...newPartner, imageUrl: url })}
            label={t("admin.dashboard.partnerImageLabel")}
            fallbackType="building"
          />
          <div className="space-y-2">
            <label className="text-xs font-semibold text-secondary">{t("admin.dashboard.partnerNameLabel")}</label>
            <Input type="text" required placeholder={t("admin.dashboard.egPartnerName")} value={newPartner.name} onChange={e => setNewPartner({ ...newPartner, name: e.target.value })} className="border-border bg-background" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-secondary">{t("admin.dashboard.categoryLabel")}</label>
              <select value={newPartner.category} onChange={e => setNewPartner({ ...newPartner, category: e.target.value as Partner["category"] })} className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary">
                <option value="hospital">{t("admin.dashboard.categoryHospitalOption")}</option>
                <option value="diagnostic">{t("admin.dashboard.categoryDiagnosticOption")}</option>
                <option value="pharmacy">{t("admin.dashboard.categoryPharmacyOption")}</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-secondary">{t("admin.dashboard.discountLabel")}</label>
              <Input type="text" required placeholder={t("admin.dashboard.egDiscount")} value={newPartner.discount} onChange={e => setNewPartner({ ...newPartner, discount: e.target.value })} className="border-border bg-background" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-secondary">{t("admin.dashboard.addressLabelReq")}</label>
            <Input type="text" required placeholder={t("admin.dashboard.egAddress")} value={newPartner.address} onChange={e => setNewPartner({ ...newPartner, address: e.target.value })} className="border-border bg-background" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-secondary">{t("admin.dashboard.googleMapLinkLabel")}</label>
            <Input type="url" placeholder={t("admin.dashboard.egMapLink")} value={newPartner.mapLink} onChange={e => setNewPartner({ ...newPartner, mapLink: e.target.value })} className="border-border bg-background" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-secondary">{t("admin.dashboard.hotlineLabel")}</label>
              <Input type="text" required placeholder={t("admin.dashboard.egHotline")} value={newPartner.phone} onChange={e => setNewPartner({ ...newPartner, phone: e.target.value })} className="border-border bg-background" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-secondary">{t("admin.dashboard.logoTextLabel")}</label>
              <Input type="text" placeholder={t("admin.dashboard.egLogoText")} value={newPartner.logoText} onChange={e => setNewPartner({ ...newPartner, logoText: e.target.value })} className="border-border bg-background" />
            </div>
          </div>
          <Button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-semibold">
            {editingPartner ? t("admin.dashboard.saveChanges") : t("admin.dashboard.savePartnerButton")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
