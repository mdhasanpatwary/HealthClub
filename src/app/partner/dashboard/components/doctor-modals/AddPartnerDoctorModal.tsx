"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { addPartnerDoctorAction } from "@/app/actions/partnerDoctorActions";
import { toast } from "sonner";
import { Stethoscope } from "lucide-react";
import { DEPT_OPTIONS, DAY_PRESETS } from "./doctorModalConstants";

export interface AddPartnerDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  partnerPhone?: string;
  onSuccess: () => void;
}

export function AddPartnerDoctorModal({
  isOpen,
  onClose,
  partnerPhone,
  onSuccess,
}: AddPartnerDoctorModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    specialty: "",
    department: "medicine",
    degrees: "",
    designation: "",
    roomNo: "",
    visitingDays: "শনি - বৃহস্পতি",
    visitingHours: "বিকাল ৫:০০ - রাত ৯:০০",
    serialPhone: partnerPhone || "",
    consultationFee: "৳৮০০",
    imageUrl: "",
    availableToday: true,
    onLeaveUntil: "",
    notice: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.specialty.trim() || !formData.visitingDays.trim() || !formData.visitingHours.trim() || !formData.serialPhone.trim()) {
      toast.error("সবগুলো প্রয়োজনীয় ফিল্ড পূরণ করুন।");
      return;
    }

    setSubmitting(true);
    try {
      const res = await addPartnerDoctorAction(formData);
      if (res.success) {
        toast.success("নতুন বিশেষজ্ঞ ডাক্তার চেম্বার তালিকায় যুক্ত করা হয়েছে।");
        onSuccess();
        onClose();
      } else {
        toast.error(res.error || "ডাক্তার যুক্ত করতে সমস্যা হয়েছে।");
      }
    } catch {
      toast.error("ডাক্তার যুক্ত করতে সমস্যা হয়েছে।");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="border-border bg-background max-h-[90vh] overflow-y-auto overflow-x-hidden w-full max-w-[calc(100vw-2rem)] sm:max-w-2xl md:max-w-3xl p-4 sm:p-6">
        <DialogHeader className="space-y-1">
          <DialogTitle className="font-heading font-bold text-base sm:text-lg md:text-xl flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-primary shrink-0" />
            <span className="truncate">নতুন বিশেষজ্ঞ ডাক্তার যুক্ত করুন</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            আপনার চেম্বার বা হাসপাতালের বিশেষজ্ঞ ডাক্তারের তথ্য পূরণ করে যুক্ত করুন
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2 w-full max-w-full overflow-x-hidden">
          <ImageUpload
            value={formData.imageUrl}
            onChange={(url) => setFormData({ ...formData, imageUrl: url })}
            label="ডাক্তারের ছবি (ঐচ্ছিক)"
            fallbackType="doctor"
            folder="doctors"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="add-doc-name" className="text-xs font-semibold text-foreground">ডাক্তারের নাম *</label>
              <Input
                id="add-doc-name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="ডাঃ মোঃ রফিকুল ইসলাম"
                className="h-10 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="add-doc-dept" className="text-xs font-semibold text-foreground">বিভাগ *</label>
              <select
                id="add-doc-dept"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {DEPT_OPTIONS.map((dept) => (
                  <option key={dept.value} value={dept.value}>{dept.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="add-doc-specialty" className="text-xs font-semibold text-foreground">বিশেষজ্ঞতা *</label>
              <Input
                id="add-doc-specialty"
                required
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                placeholder="মেডিসিন ও হৃদরোগ বিশেষজ্ঞ"
                className="h-10 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="add-doc-degrees" className="text-xs font-semibold text-foreground">ডিগ্রী / শিক্ষাগত যোগ্যতা</label>
              <Input
                id="add-doc-degrees"
                value={formData.degrees}
                onChange={(e) => setFormData({ ...formData, degrees: e.target.value })}
                placeholder="MBBS, FCPS (Medicine)"
                className="h-10 text-sm"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label htmlFor="add-doc-desig" className="text-xs font-semibold text-foreground">পদবী ও বর্তমান প্রতিষ্ঠান</label>
              <Input
                id="add-doc-desig"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                placeholder="সহকারী অধ্যাপক, ফেনী ডায়াবেটিক সমিতি"
                className="h-10 text-sm"
              />
            </div>

            {/* Chamber Specific Fields */}
            <div className="space-y-1.5">
              <label htmlFor="add-doc-room" className="text-xs font-semibold text-primary">রুম / চেম্বার নম্বর</label>
              <Input
                id="add-doc-room"
                value={formData.roomNo}
                onChange={(e) => setFormData({ ...formData, roomNo: e.target.value })}
                placeholder="রুম নং ২০৪, ২য় তলা"
                className="h-10 text-sm border-primary/40 focus-visible:ring-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="add-doc-fee" className="text-xs font-semibold text-foreground">পরামর্শ ফি</label>
              <Input
                id="add-doc-fee"
                value={formData.consultationFee}
                onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
                placeholder="৳৮০০"
                className="h-10 text-sm"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label htmlFor="add-doc-days" className="text-xs font-semibold text-foreground">রোগী দেখার দিনসমূহ *</label>
              <Input
                id="add-doc-days"
                required
                value={formData.visitingDays}
                onChange={(e) => setFormData({ ...formData, visitingDays: e.target.value })}
                placeholder="শনি - বৃহস্পতি"
                className="h-10 text-sm"
              />
              <div className="flex flex-wrap gap-1.5 pt-1">
                {DAY_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setFormData({ ...formData, visitingDays: preset })}
                    className="text-[11px] bg-muted hover:bg-muted/80 text-foreground px-2 py-0.5 rounded-md border border-border cursor-pointer transition-colors"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="add-doc-hours" className="text-xs font-semibold text-foreground">রোগী দেখার সময় *</label>
              <Input
                id="add-doc-hours"
                required
                value={formData.visitingHours}
                onChange={(e) => setFormData({ ...formData, visitingHours: e.target.value })}
                placeholder="বিকাল ৫:০০ - রাত ৯:০০"
                className="h-10 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="add-doc-phone" className="text-xs font-semibold text-foreground">সিরিয়ালের ফোন নম্বর *</label>
              <Input
                id="add-doc-phone"
                required
                value={formData.serialPhone}
                onChange={(e) => setFormData({ ...formData, serialPhone: e.target.value })}
                placeholder="০১৭১২-৩৪৫৬৭৮"
                className="h-10 text-sm"
              />
            </div>
          </div>

          {/* Availability & Notices in Add Modal */}
          <div className="p-3.5 bg-muted/20 border border-border/80 rounded-2xl space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              <div className="flex items-center justify-between p-2.5 bg-background border border-border/80 rounded-xl">
                <div>
                  <label htmlFor="add-doc-available" className="text-xs font-bold text-foreground block cursor-pointer">
                    আজ রোগী দেখবেন
                  </label>
                  <span className="text-[10px] text-muted-foreground">
                    {formData.availableToday ? "চেম্বারে রোগী দেখা চালু রয়েছে" : "আজ চেম্বার বন্ধ রয়েছে"}
                  </span>
                </div>
                <input
                  id="add-doc-available"
                  type="checkbox"
                  checked={formData.availableToday}
                  onChange={(e) => setFormData({ ...formData, availableToday: e.target.checked })}
                  className="h-5 w-5 rounded border-border text-primary focus:ring-primary cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="add-doc-leave" className="text-xs font-semibold text-foreground cursor-pointer">
                  কত তারিখ পর্যন্ত ছুটিতে আছেন
                </label>
                <Input
                  id="add-doc-leave"
                  type="date"
                  value={formData.onLeaveUntil}
                  onChange={(e) => setFormData({ ...formData, onLeaveUntil: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="add-doc-notice" className="text-xs font-semibold text-foreground cursor-pointer">
                বিশেষ জরুরি নোটিশ (ঐচ্ছিক)
              </label>
              <Input
                id="add-doc-notice"
                type="text"
                placeholder="আজ সন্ধ্যা ৬টার পর রোগী দেখা শুরু হবে"
                value={formData.notice}
                onChange={(e) => setFormData({ ...formData, notice: e.target.value })}
                className="h-9 text-xs"
              />
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2 pt-4 border-t border-border w-full">
            <Button type="button" variant="outline" onClick={onClose} disabled={submitting} className="rounded-xl w-full sm:w-auto">
              বাতিল
            </Button>
            <Button type="submit" disabled={submitting} className="rounded-xl bg-primary text-white hover:bg-primary/90 cursor-pointer w-full sm:w-auto">
              {submitting ? "যুক্ত করা হচ্ছে..." : "ডাক্তার যুক্ত করুন"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
