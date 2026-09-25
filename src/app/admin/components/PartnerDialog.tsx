"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { Partner } from "@/services/db";
import { generatePartnerSlug } from "@/lib/slugify";

export interface PartnerFormData {
  name: string;
  slug?: string;
  category: Partner["category"];
  address: string;
  discount: string;
  phone: string;
  logoText: string;
  mapLink: string;
  imageUrl: string;
  upazila: string;
}

interface PartnerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  editingPartner: Partner | null;
  newPartner: PartnerFormData;
  setNewPartner: (partner: PartnerFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  t?: (key: string) => string;
}

export function PartnerDialog({
  isOpen,
  onClose,
  editingPartner,
  newPartner,
  setNewPartner,
  onSubmit,
}: PartnerDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="w-full sm:max-w-xl md:max-w-2xl max-h-[90vh] overflow-y-auto p-5 sm:p-6 border-border bg-background">
        <DialogHeader>
          <DialogTitle className="font-heading font-bold text-secondary">
            {editingPartner ? "পার্টনার সম্পাদনা করুন" : "নতুন পার্টনার যোগ করুন"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 pt-2">
          <ImageUpload
            value={newPartner.imageUrl || ""}
            onChange={(url) => setNewPartner({ ...newPartner, imageUrl: url })}
            label="পার্টনার লোগো বা ছবি"
            fallbackType="building"
            folder="partners"
          />
          <div className="space-y-2">
            <label htmlFor="admin-partner-name" className="text-xs font-semibold text-secondary cursor-pointer">হাসপাতাল / সেন্টারের নাম *</label>
            <Input
              id="admin-partner-name"
              type="text"
              required
              placeholder="যেমন: গ্রীন লাইফ ডায়াগনস্টিক সেন্টার"
              value={newPartner.name}
              onChange={(e) => {
                const newName = e.target.value;
                setNewPartner({
                  ...newPartner,
                  name: newName,
                  ...(!editingPartner && !newPartner.slug ? { slug: generatePartnerSlug(newName) } : {}),
                });
              }}
              className="border-border bg-background"
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="admin-partner-slug" className="text-xs font-semibold text-secondary cursor-pointer">
                URL Slug / লিংক পাথ (ঐচ্ছিক)
              </label>
              {newPartner.slug && (
                <span className="text-[10px] text-primary font-mono truncate max-w-[200px]">
                  /partner-hospitals/{newPartner.slug}
                </span>
              )}
            </div>
            <Input
              id="admin-partner-slug"
              type="text"
              placeholder="যেমন: mojumdar-dental-clinic বা মজুমদার-ডেন্টাল-ক্লিনিক"
              value={newPartner.slug || ""}
              onChange={(e) => setNewPartner({ ...newPartner, slug: e.target.value })}
              className="border-border bg-background font-mono text-xs"
            />
            <p className="text-[10px] text-muted-foreground">
              খালি রাখলে পার্টনারের নাম থেকে স্বয়ংক্রিয়ভাবে ক্লিন URL তৈরি হবে।
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="admin-partner-category" className="text-xs font-semibold text-secondary cursor-pointer">ক্যাটাগরি *</label>
              <select id="admin-partner-category" value={newPartner.category} onChange={e => setNewPartner({ ...newPartner, category: e.target.value as Partner["category"] })} className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary">
                <option value="hospital">হাসপাতাল / ক্লিনিক</option>
                <option value="diagnostic">ডায়াগনস্টিক সেন্টার</option>
                <option value="pharmacy">ফার্মেসি</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="admin-partner-discount" className="text-xs font-semibold text-secondary cursor-pointer">ডিসকাউন্ট বিবরণ *</label>
              <Input id="admin-partner-discount" type="text" required placeholder="যেমন: ১০-৩০% মেম্বার ছাড়" value={newPartner.discount} onChange={e => setNewPartner({ ...newPartner, discount: e.target.value })} className="border-border bg-background" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="admin-partner-address" className="text-xs font-semibold text-secondary cursor-pointer">ঠিকানা *</label>
              <Input id="admin-partner-address" type="text" required placeholder="যেমন: এসএসকে রোড, ট্রাংক রোড সংলগ্ন, ফেনী" value={newPartner.address} onChange={e => setNewPartner({ ...newPartner, address: e.target.value })} className="border-border bg-background" />
            </div>
            <div className="space-y-2">
              <label htmlFor="admin-partner-upazila" className="text-xs font-semibold text-secondary cursor-pointer">উপজেলা / এলাকা *</label>
              <select
                id="admin-partner-upazila"
                value={newPartner.upazila || "feni-sadar"}
                onChange={(e) => setNewPartner({ ...newPartner, upazila: e.target.value })}
                className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary"
              >
                <option value="feni-sadar">ফেনী সদর (Feni Sadar)</option>
                <option value="chhagalnaiya">ছাগলনাইয়া (Chhagalnaiya)</option>
                <option value="daganbhuiyan">দাগনভূঞা (Daganbhuiyan)</option>
                <option value="sonagazi">সোনাগাজী (Sonagazi)</option>
                <option value="parshuram">পরশুরাম (Parshuram)</option>
                <option value="fulgazi">ফুলগাজী (Fulgazi)</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="admin-partner-maplink" className="text-xs font-semibold text-secondary cursor-pointer">গুগল ম্যাপ লোকেশন লিংক (ঐচ্ছিক)</label>
            <Input id="admin-partner-maplink" type="url" placeholder="https://maps.app.goo.gl/..." value={newPartner.mapLink} onChange={e => setNewPartner({ ...newPartner, mapLink: e.target.value })} className="border-border bg-background" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="admin-partner-phone" className="text-xs font-semibold text-secondary cursor-pointer">হটলাইন / মোবাইল নম্বর *</label>
              <Input id="admin-partner-phone" type="text" required placeholder="যেমন: 01811..." value={newPartner.phone} onChange={e => setNewPartner({ ...newPartner, phone: e.target.value })} className="border-border bg-background" />
            </div>
            <div className="space-y-2">
              <label htmlFor="admin-partner-logotext" className="text-xs font-semibold text-secondary cursor-pointer">সংক্ষিপ্ত নাম / ট্যাগ (ঐচ্ছিক)</label>
              <Input id="admin-partner-logotext" type="text" placeholder="যেমন: Green Life" value={newPartner.logoText} onChange={e => setNewPartner({ ...newPartner, logoText: e.target.value })} className="border-border bg-background" />
            </div>
          </div>
          <Button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-semibold">
            {editingPartner ? "পরিবর্তন সংরক্ষণ করুন" : "পার্টনার যুক্ত করুন"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
