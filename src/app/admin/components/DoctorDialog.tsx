"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { Doctor } from "@/services/db";

interface DoctorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  editingDoctor: Doctor | null;
  newDoctor: {
    name: string;
    specialty: string;
    department: string;
    degrees: string;
    designation: string;
    chamberName: string;
    chamberAddress: string;
    roomNo: string;
    visitingDays: string;
    visitingHours: string;
    serialPhone: string;
    consultationFee: string;
    imageUrl: string;
  };
  setNewDoctor: (doc: {
    name: string;
    specialty: string;
    department: string;
    degrees: string;
    designation: string;
    chamberName: string;
    chamberAddress: string;
    roomNo: string;
    visitingDays: string;
    visitingHours: string;
    serialPhone: string;
    consultationFee: string;
    imageUrl: string;
  }) => void;
  onSubmit: (e: React.FormEvent) => void;
  t?: (key: string) => string;
}

const DEPT_OPTIONS = [
  { value: "medicine", label: "মেডিসিন ও লিভার (Medicine & Gastro)" },
  { value: "cardiology", label: "কার্ডিওলজি (হৃদরোগ)" },
  { value: "gynecology", label: "স্ত্রী ও প্রসূতি রোগ (Gynaecology)" },
  { value: "orthopedics", label: "অর্থোপেডিকস (হাড় ও বাত)" },
  { value: "psychiatry", label: "মানসিক রোগ ও নিউরোসাইকিয়াট্রি" },
  { value: "nephrology", label: "কিডনি রোগ (Nephrology)" },
  { value: "hepatology", label: "লিভার রোগ (Hepatology)" },
  { value: "surgery", label: "সার্জারি ও ভাস্কুলার সার্জারি" },
  { value: "pediatrics", label: "শিশু রোগ (Pediatrics)" },
  { value: "rheumatology", label: "বাত, ব্যাথা ও রিউমাটোলজি" },
  { value: "nutrition", label: "খাদ্য ও পুষ্টি (Nutrition)" },
  { value: "dermatology", label: "চর্ম ও যৌন রোগ" },
  { value: "ent", label: "নাক, কান ও গলা (ENT)" },
  { value: "eye", label: "চক্ষু রোগ (Eye)" },
  { value: "dental", label: "দন্ত রোগ (Dental)" },
  { value: "other", label: "অন্যান্য (Other)" },
];

export function DoctorDialog({
  isOpen,
  onClose,
  editingDoctor,
  newDoctor,
  setNewDoctor,
  onSubmit,
  t = (k) => k,
}: DoctorDialogProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="border-border bg-background max-h-[92vh] overflow-y-auto w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl p-5 sm:p-7">
        <DialogHeader>
          <DialogTitle className="font-heading font-bold text-secondary text-lg sm:text-xl">
            {editingDoctor ? t("admin.doctors.editTitle") : t("admin.doctors.addTitle")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 pt-2">
          <ImageUpload
            value={newDoctor.imageUrl || ""}
            onChange={(url) => setNewDoctor({ ...newDoctor, imageUrl: url })}
            label="ডাক্তারের ছবি"
            fallbackType="doctor"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="admin-doc-name" className="text-xs font-semibold text-secondary cursor-pointer">ডাক্তারের নাম *</label>
              <Input
                id="admin-doc-name"
                type="text"
                required
                placeholder="যেমন: ডাঃ মোঃ শাহাদাত হোসেন"
                value={newDoctor.name}
                onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
                className="border-border bg-background"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="admin-doc-dept" className="text-xs font-semibold text-secondary cursor-pointer">বিভাগ (Department) *</label>
              <select
                id="admin-doc-dept"
                value={newDoctor.department}
                onChange={(e) => setNewDoctor({ ...newDoctor, department: e.target.value })}
                className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary"
              >
                {DEPT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="admin-doc-specialty" className="text-xs font-semibold text-secondary cursor-pointer">স্পেশালিটি / পদ *</label>
              <Input
                id="admin-doc-specialty"
                type="text"
                required
                placeholder="যেমন: মেডিসিন ও পরিপাকতন্ত্র বিশেষজ্ঞ"
                value={newDoctor.specialty}
                onChange={(e) => setNewDoctor({ ...newDoctor, specialty: e.target.value })}
                className="border-border bg-background"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="admin-doc-degrees" className="text-xs font-semibold text-secondary cursor-pointer">ডিগ্রি ও যোগ্যতা *</label>
              <Input
                id="admin-doc-degrees"
                type="text"
                required
                placeholder="যেমন: MBBS, BCS, FCPS (Medicine)"
                value={newDoctor.degrees}
                onChange={(e) => setNewDoctor({ ...newDoctor, degrees: e.target.value })}
                className="border-border bg-background"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="admin-doc-designation" className="text-xs font-semibold text-secondary cursor-pointer">বর্তমান কর্মস্থল / পদবি *</label>
            <Input
              id="admin-doc-designation"
              type="text"
              required
              placeholder="যেমন: সহকারী অধ্যাপক, বিএসএমএমইউ (পিজি হাসপাতাল), ঢাকা"
              value={newDoctor.designation}
              onChange={(e) => setNewDoctor({ ...newDoctor, designation: e.target.value })}
              className="border-border bg-background"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="admin-doc-chambername" className="text-xs font-semibold text-secondary cursor-pointer">চেম্বারের নাম *</label>
              <Input
                id="admin-doc-chambername"
                type="text"
                required
                placeholder="যেমন: পপুলার ডায়াগনস্টিক সেন্টার"
                value={newDoctor.chamberName}
                onChange={(e) => setNewDoctor({ ...newDoctor, chamberName: e.target.value })}
                className="border-border bg-background"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="admin-doc-chamberaddress" className="text-xs font-semibold text-secondary cursor-pointer">চেম্বারের ঠিকানা *</label>
              <Input
                id="admin-doc-chamberaddress"
                type="text"
                required
                placeholder="যেমন: মা প্লাজা, শহীদ শহীদুল্লাহ কায়সার রোড, ফেনী"
                value={newDoctor.chamberAddress}
                onChange={(e) => setNewDoctor({ ...newDoctor, chamberAddress: e.target.value })}
                className="border-border bg-background"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="admin-doc-visitingdays" className="text-xs font-semibold text-secondary cursor-pointer">রোগী দেখার দিন *</label>
              <Input
                id="admin-doc-visitingdays"
                type="text"
                required
                placeholder="যেমন: শনি থেকে বৃহস্পতি"
                value={newDoctor.visitingDays}
                onChange={(e) => setNewDoctor({ ...newDoctor, visitingDays: e.target.value })}
                className="border-border bg-background"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="admin-doc-visitinghours" className="text-xs font-semibold text-secondary cursor-pointer">রোগী দেখার সময় *</label>
              <Input
                id="admin-doc-visitinghours"
                type="text"
                required
                placeholder="যেমন: বিকাল ৫:০০ - রাত ৯:০০"
                value={newDoctor.visitingHours}
                onChange={(e) => setNewDoctor({ ...newDoctor, visitingHours: e.target.value })}
                className="border-border bg-background"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="admin-doc-roomno" className="text-xs font-semibold text-secondary cursor-pointer">রুম নম্বর</label>
              <Input
                id="admin-doc-roomno"
                type="text"
                placeholder="যেমন: রুম নং: ২০৩"
                value={newDoctor.roomNo}
                onChange={(e) => setNewDoctor({ ...newDoctor, roomNo: e.target.value })}
                className="border-border bg-background"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="admin-doc-serialphone" className="text-xs font-semibold text-secondary cursor-pointer">সিরিয়াল হটলাইন নম্বর *</label>
              <Input
                id="admin-doc-serialphone"
                type="text"
                required
                placeholder="যেমন: 01898221111, 01898445555"
                value={newDoctor.serialPhone}
                onChange={(e) => setNewDoctor({ ...newDoctor, serialPhone: e.target.value })}
                className="border-border bg-background"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="admin-doc-fee" className="text-xs font-semibold text-secondary cursor-pointer">ভিজিট ফি</label>
              <Input
                id="admin-doc-fee"
                type="text"
                placeholder="যেমন: ৳৮০০"
                value={newDoctor.consultationFee}
                onChange={(e) => setNewDoctor({ ...newDoctor, consultationFee: e.target.value })}
                className="border-border bg-background"
              />
            </div>
          </div>

          <Button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-semibold h-11">
            {editingDoctor ? "পরিবর্তন সংরক্ষণ করুন" : "ডাক্তার যুক্ত করুন"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
