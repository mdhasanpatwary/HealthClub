"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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
    if (!formData.name.trim() || !formData.specialty.trim()) {
      toast.error("ডাক্তারের নাম এবং বিশেষজ্ঞ পদবি পূরণ করুন।");
      return;
    }

    setSubmitting(true);
    try {
      const res = await addPartnerDoctorAction({
        name: formData.name.trim(),
        specialty: formData.specialty.trim(),
        department: formData.department,
        degrees: formData.degrees.trim(),
        designation: formData.designation.trim(),
        roomNo: formData.roomNo.trim() || undefined,
        visitingDays: formData.visitingDays.trim(),
        visitingHours: formData.visitingHours.trim(),
        serialPhone: formData.serialPhone.trim() || partnerPhone || "",
        consultationFee: formData.consultationFee.trim() || undefined,
        imageUrl: formData.imageUrl || undefined,
        isActive: true,
        availableToday: formData.availableToday,
        onLeaveUntil: formData.onLeaveUntil || undefined,
        notice: formData.notice.trim() || undefined,
      });

      if (res.success) {
        toast.success("নতুন বিশেষজ্ঞ ডাক্তার চেম্বার তালিকায় যুক্ত করা হয়েছে।");
        onSuccess();
        onClose();
      } else {
        toast.error(res.error || "ডাক্তার যুক্ত করতে সমস্যা হয়েছে।");
      }
    } catch {
      toast.error("সার্ভারে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="border-border bg-background max-h-[92vh] overflow-y-auto w-full sm:max-w-2xl md:max-w-3xl p-5 sm:p-7">
        <DialogHeader>
          <DialogTitle className="font-heading font-bold text-lg sm:text-xl flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-primary" />
            <span>নতুন বিশেষজ্ঞ ডাক্তার চেম্বারে যুক্ত করুন</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            আপনার হাসপাতাল চেম্বারে নতুন বিশেষজ্ঞ ডাক্তার অন্তর্ভুক্ত করুন এবং তার সাক্ষাতের সময়সূচি নির্ধারণ করুন।
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <ImageUpload
            value={formData.imageUrl}
            onChange={(url) => setFormData({ ...formData, imageUrl: url })}
            label="ডাক্তারের ছবি (ঐচ্ছিক)"
            fallbackType="doctor"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="add-doc-name" className="text-xs font-semibold text-foreground">ডাক্তারের নাম *</label>
              <Input
                id="add-doc-name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="যেমন: ডা. মোঃ রফিকুল ইসলাম"
                className="h-10 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="add-doc-dept" className="text-xs font-semibold text-foreground">চিকিৎসা বিভাগ *</label>
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
              <label htmlFor="add-doc-specialty" className="text-xs font-semibold text-foreground">বিশেষজ্ঞ পদবি / Specialty *</label>
              <Input
                id="add-doc-specialty"
                required
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                placeholder="যেমন: মেডিসিন ও হৃদরোগ বিশেষজ্ঞ"
                className="h-10 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="add-doc-degrees" className="text-xs font-semibold text-foreground">ডিগ্রি ও শিক্ষাগত যোগ্যতা</label>
              <Input
                id="add-doc-degrees"
                value={formData.degrees}
                onChange={(e) => setFormData({ ...formData, degrees: e.target.value })}
                placeholder="যেমন: MBBS, FCPS (Medicine), MD"
                className="h-10 text-sm"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label htmlFor="add-doc-desig" className="text-xs font-semibold text-foreground">পদবি ও বর্তমান কর্মস্থল</label>
              <Input
                id="add-doc-desig"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                placeholder="যেমন: সহযোগী অধ্যাপক, ঢাকা মেডিকেল কলেজ হাসপাতাল"
                className="h-10 text-sm"
              />
            </div>

            {/* Chamber Specific Fields */}
            <div className="space-y-1.5">
              <label htmlFor="add-doc-room" className="text-xs font-semibold text-primary">চেম্বার রুম / কক্ষ নং</label>
              <Input
                id="add-doc-room"
                value={formData.roomNo}
                onChange={(e) => setFormData({ ...formData, roomNo: e.target.value })}
                placeholder="যেমন: কক্ষ-৩০২ (৩য় তলা)"
                className="h-10 text-sm border-primary/40 focus-visible:ring-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="add-doc-fee" className="text-xs font-semibold text-foreground">পরামর্শ ফি / Consultation Fee</label>
              <Input
                id="add-doc-fee"
                value={formData.consultationFee}
                onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
                placeholder="যেমন: ৳১০০০ (পুরাতন ৳৫০০)"
                className="h-10 text-sm"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label htmlFor="add-doc-days" className="text-xs font-semibold text-foreground">সাক্ষাতের দিনসমূহ *</label>
              <Input
                id="add-doc-days"
                required
                value={formData.visitingDays}
                onChange={(e) => setFormData({ ...formData, visitingDays: e.target.value })}
                placeholder="যেমন: শনি - বৃহস্পতি"
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
              <label htmlFor="add-doc-hours" className="text-xs font-semibold text-foreground">সাক্ষাতের সময় *</label>
              <Input
                id="add-doc-hours"
                required
                value={formData.visitingHours}
                onChange={(e) => setFormData({ ...formData, visitingHours: e.target.value })}
                placeholder="যেমন: বিকাল ৫:০০ - রাত ৯:০০"
                className="h-10 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="add-doc-phone" className="text-xs font-semibold text-foreground">সিরিয়াল নেওয়ার ফোন নম্বর *</label>
              <Input
                id="add-doc-phone"
                required
                value={formData.serialPhone}
                onChange={(e) => setFormData({ ...formData, serialPhone: e.target.value })}
                placeholder="যেমন: 017XXXXXXXX, 018XXXXXXXX"
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
                    আজ চেম্বার খোলা আছে
                  </label>
                  <span className="text-[10px] text-muted-foreground">
                    {formData.availableToday ? "আজ চেম্বার খোলা দেখাবে" : "আজ চেম্বার বন্ধ দেখাবে"}
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
                  ছুটির শেষ তারিখ (ঐচ্ছিক)
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
                চেম্বার সংক্রান্ত বিশেষ বিজ্ঞপ্তি (ঐচ্ছিক)
              </label>
              <Input
                id="add-doc-notice"
                type="text"
                placeholder="যেমন: শুধুমাত্র অ্যাপয়েন্টমেন্ট সাপেক্ষে সিরিয়াল নেওয়া হবে"
                value={formData.notice}
                onChange={(e) => setFormData({ ...formData, notice: e.target.value })}
                className="h-9 text-xs"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose} disabled={submitting} className="rounded-xl">
              বাতিল
            </Button>
            <Button type="submit" disabled={submitting} className="rounded-xl bg-primary text-white hover:bg-primary/90">
              {submitting ? "যুক্ত হচ্ছে..." : "ডাক্তার যুক্ত করুন"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
