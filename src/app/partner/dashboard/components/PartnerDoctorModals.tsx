"use client";

import { useState, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { Doctor } from "@/services/db";
import { dbStore } from "@/services/dbStore";
import { toast } from "sonner";
import {
  Search,
  Stethoscope,
  Building2,
  Link as LinkIcon,
  AlertCircle,
} from "lucide-react";

export const DEPT_OPTIONS = [
  { value: "medicine", label: "মেডিসিন ও লিভার (Medicine & Gastro)" },
  { value: "cardiology", label: "কার্ডিওলজি (হৃদরোগ)" },
  { value: "gynecology", label: "স্ত্রী ও প্রসূতি রোগ (Gynaecology)" },
  { value: "orthopedics", label: "অর্থোপেডিকস (হাড় ও বাত)" },
  { value: "pediatrics", label: "শিশু রোগ (Pediatrics)" },
  { value: "neurology", label: "নিউরোমেডিসিন ও ব্রেন" },
  { value: "surgery", label: "সার্জারি ও ভাস্কুলার" },
  { value: "dermatology", label: "চর্ম ও যৌন রোগ" },
  { value: "ent", label: "নাক, কান ও গলা (ENT)" },
  { value: "eye", label: "চক্ষু রোগ (Eye)" },
  { value: "psychiatry", label: "মানসিক রোগ ও নিউরোসাইকিয়াট্রি" },
  { value: "nephrology", label: "কিডনি রোগ (Nephrology)" },
  { value: "hepatology", label: "লিভার রোগ (Hepatology)" },
  { value: "rheumatology", label: "বাত ও রিউমাটোলজি" },
  { value: "nutrition", label: "খাদ্য ও পুষ্টি (Nutrition)" },
  { value: "dental", label: "দন্ত রোগ (Dental)" },
  { value: "other", label: "অন্যান্য (Other)" },
];

export const DAY_PRESETS = [
  "শনি - বৃহস্পতি",
  "প্রতিদিন",
  "রবি - বৃহস্পতি",
  "শুক্র ও শনি",
  "সোম - বৃহস্পতি",
  "রবি, মঙ্গল, বৃহস্পতি",
];

// --- ADD NEW DOCTOR MODAL ---
interface AddPartnerDoctorModalProps {
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
      const res = await dbStore.addPartnerDoctor({
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

// --- LINK EXISTING DOCTOR MODAL ---
interface LinkDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  partnerPhone?: string;
  onSuccess: () => void;
}

export function LinkDoctorModal({
  isOpen,
  onClose,
  partnerPhone,
  onSuccess,
}: LinkDoctorModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searching, setSearching] = useState(false);
  const [availableDoctors, setAvailableDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [chamberData, setChamberData] = useState({
    roomNo: "",
    visitingDays: "শনি - বৃহস্পতি",
    visitingHours: "বিকাল ৫:০০ - রাত ৯:০০",
    serialPhone: partnerPhone || "",
    consultationFee: "৳১০০০",
  });

  const handleClose = () => {
    setSelectedDoctor(null);
    setSearchTerm("");
    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const fetchAvailable = async () => {
      setSearching(true);
      try {
        const res = await dbStore.getAvailableDoctorsToLink(searchTerm);
        if (res.success) {
          setAvailableDoctors(res.doctors);
        }
      } catch {
        // search failed quietly
      } finally {
        setSearching(false);
      }
    };

    const timer = setTimeout(fetchAvailable, 250);
    return () => clearTimeout(timer);
  }, [isOpen, searchTerm]);

  const handleSelectDoctor = (doc: Doctor) => {
    setSelectedDoctor(doc);
    setChamberData({
      roomNo: doc.roomNo || "",
      visitingDays: doc.visitingDays || "শনি - বৃহস্পতি",
      visitingHours: doc.visitingHours || "বিকাল ৫:০০ - রাত ৯:০০",
      serialPhone: doc.serialPhone || partnerPhone || "",
      consultationFee: doc.consultationFee || "৳১০০০",
    });
  };

  const handleLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor) {
      toast.error("অনুগ্রহ করে একজন ডাক্তার নির্বাচন করুন।");
      return;
    }

    setSubmitting(true);
    try {
      const res = await dbStore.linkDoctorToPartner(selectedDoctor.id, {
        roomNo: chamberData.roomNo.trim() || undefined,
        visitingDays: chamberData.visitingDays.trim() || undefined,
        visitingHours: chamberData.visitingHours.trim() || undefined,
        serialPhone: chamberData.serialPhone.trim() || partnerPhone,
        consultationFee: chamberData.consultationFee.trim() || undefined,
      });

      if (res.success) {
        toast.success(`${selectedDoctor.name} সফলভাবে আপনার চেম্বারে যুক্ত হয়েছেন।`);
        onSuccess();
        handleClose();
      } else {
        toast.error(res.error || "ডাক্তার লিঙ্ক করতে সমস্যা হয়েছে।");
      }
    } catch {
      toast.error("সার্ভারে সমস্যা হয়েছে।");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="border-border bg-background max-h-[92vh] overflow-y-auto w-full sm:max-w-2xl md:max-w-3xl p-5 sm:p-7">
        <DialogHeader>
          <DialogTitle className="font-heading font-bold text-lg sm:text-xl flex items-center gap-2">
            <LinkIcon className="h-5 w-5 text-primary" />
            <span>ডিরেক্টরি থেকে বিদ্যমান ডাক্তার লিঙ্ক করুন</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            হেলথ ক্লাব প্ল্যাটফর্মে থাকা রেজিস্টার্ড বিশেষজ্ঞ ডাক্তারকে আপনার হাসপাতাল চেম্বারে যুক্ত করুন।
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {!selectedDoctor ? (
            <>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="ডাক্তারের নাম, পদবি বা বিভাগ লিখে খুঁজুন..."
                  className="pl-9 h-10 rounded-xl"
                  autoFocus
                />
              </div>

              <div className="max-h-72 overflow-y-auto space-y-2 border border-border/80 rounded-2xl p-2 bg-muted/20">
                {searching ? (
                  <p className="text-xs text-center py-6 text-muted-foreground">খোঁজা হচ্ছে...</p>
                ) : availableDoctors.length === 0 ? (
                  <p className="text-xs text-center py-6 text-muted-foreground">কোনো নতুন ডাক্তার পাওয়া যায়নি।</p>
                ) : (
                  availableDoctors.map((doc) => (
                    <div
                      key={doc.id}
                      onClick={() => handleSelectDoctor(doc)}
                      className="flex items-center justify-between p-3 rounded-xl bg-card border border-border/60 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group"
                    >
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                            {doc.name}
                          </h4>
                          <Badge variant="outline" className="text-[10px] py-0 px-2 bg-muted">
                            {doc.department}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{doc.specialty}</p>
                        {doc.degrees && <p className="text-[11px] text-slate-500 truncate">{doc.degrees}</p>}
                      </div>

                      <Button size="sm" variant="secondary" className="shrink-0 text-xs rounded-xl font-semibold">
                        নির্বাচন করুন
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            <form onSubmit={handleLink} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-primary/10 border border-primary/25 flex items-start justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-primary">{selectedDoctor.name}</h4>
                  <p className="text-xs text-foreground/80">{selectedDoctor.specialty}</p>
                  {selectedDoctor.degrees && <p className="text-[11px] text-muted-foreground">{selectedDoctor.degrees}</p>}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedDoctor(null)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  পরিবর্তন করুন
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="link-room" className="text-xs font-semibold text-primary">চেম্বার রুম / কক্ষ নং</label>
                  <Input
                    id="link-room"
                    value={chamberData.roomNo}
                    onChange={(e) => setChamberData({ ...chamberData, roomNo: e.target.value })}
                    placeholder="যেমন: রুম-৪০১"
                    className="h-10 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="link-fee" className="text-xs font-semibold text-foreground">পরামর্শ ফি</label>
                  <Input
                    id="link-fee"
                    value={chamberData.consultationFee}
                    onChange={(e) => setChamberData({ ...chamberData, consultationFee: e.target.value })}
                    placeholder="যেমন: ৳১০০০"
                    className="h-10 text-sm"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label htmlFor="link-days" className="text-xs font-semibold text-foreground">সাক্ষাতের দিনসমূহ *</label>
                  <Input
                    id="link-days"
                    required
                    value={chamberData.visitingDays}
                    onChange={(e) => setChamberData({ ...chamberData, visitingDays: e.target.value })}
                    placeholder="যেমন: শনি - বৃহস্পতি"
                    className="h-10 text-sm"
                  />
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {DAY_PRESETS.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setChamberData({ ...chamberData, visitingDays: preset })}
                        className="text-[11px] bg-muted hover:bg-muted/80 text-foreground px-2 py-0.5 rounded-md border border-border cursor-pointer transition-colors"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="link-hours" className="text-xs font-semibold text-foreground">সাক্ষাতের সময় *</label>
                  <Input
                    id="link-hours"
                    required
                    value={chamberData.visitingHours}
                    onChange={(e) => setChamberData({ ...chamberData, visitingHours: e.target.value })}
                    placeholder="যেমন: বিকাল ৫:০০ - রাত ৯:০০"
                    className="h-10 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="link-phone" className="text-xs font-semibold text-foreground">সিরিয়াল নম্বর *</label>
                  <Input
                    id="link-phone"
                    required
                    value={chamberData.serialPhone}
                    onChange={(e) => setChamberData({ ...chamberData, serialPhone: e.target.value })}
                    placeholder="যেমন: 017XXXXXXXX"
                    className="h-10 text-sm"
                  />
                </div>
              </div>

              <DialogFooter className="gap-2 pt-4 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setSelectedDoctor(null)} className="rounded-xl">
                  পেছনে যান
                </Button>
                <Button type="submit" disabled={submitting} className="rounded-xl bg-primary text-white hover:bg-primary/90">
                  {submitting ? "লিঙ্ক হচ্ছে..." : "চেম্বারে লিঙ্ক নিশ্চিত করুন"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// --- EDIT CHAMBER & SCHEDULE MODAL ---
interface EditChamberModalProps {
  doctor: Doctor | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

function EditChamberForm({
  doctor,
  onClose,
  onSuccess,
}: {
  doctor: Doctor;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: doctor.name || "",
    specialty: doctor.specialty || "",
    department: doctor.department || "medicine",
    degrees: doctor.degrees || "",
    designation: doctor.designation || "",
    roomNo: doctor.roomNo || "",
    visitingDays: doctor.visitingDays || "",
    visitingHours: doctor.visitingHours || "",
    serialPhone: doctor.serialPhone || "",
    consultationFee: doctor.consultationFee || "",
    isActive: doctor.isActive ?? true,
    availableToday: doctor.availableToday !== false,
    onLeaveUntil: doctor.onLeaveUntil ? doctor.onLeaveUntil.slice(0, 10) : "",
    notice: doctor.notice || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await dbStore.updatePartnerDoctorChamber(doctor.id, {
        name: formData.name.trim(),
        specialty: formData.specialty.trim(),
        department: formData.department,
        degrees: formData.degrees.trim(),
        designation: formData.designation.trim(),
        roomNo: formData.roomNo.trim() || undefined,
        visitingDays: formData.visitingDays.trim(),
        visitingHours: formData.visitingHours.trim(),
        serialPhone: formData.serialPhone.trim(),
        consultationFee: formData.consultationFee.trim() || undefined,
        isActive: formData.isActive,
        availableToday: formData.availableToday,
        onLeaveUntil: formData.onLeaveUntil || undefined,
        notice: formData.notice.trim() || undefined,
      });

      if (res.success) {
        toast.success("চেম্বার ও সময়সূচি তথ্য সফলভাবে আপডেট করা হয়েছে।");
        onSuccess();
        onClose();
      } else {
        toast.error(res.error || "আপডেট করতে সমস্যা হয়েছে।");
      }
    } catch {
      toast.error("সার্ভারে সমস্যা হয়েছে।");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DialogContent className="border-border bg-background max-h-[92vh] overflow-y-auto w-full sm:max-w-2xl md:max-w-3xl p-5 sm:p-7">
      <DialogHeader>
        <DialogTitle className="font-heading font-bold text-lg sm:text-xl flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          <span>চেম্বার ও সময়সূচি এডিট করুন</span>
        </DialogTitle>
        <DialogDescription className="text-xs text-muted-foreground">
          {doctor.name} - এর চেম্বারের রুম নম্বর, সময়সূচি এবং সিরিয়াল তথ্য আপডেট করুন।
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="edit-doc-name" className="text-xs font-semibold text-foreground">ডাক্তারের নাম</label>
            <Input
              id="edit-doc-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="h-10 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="edit-doc-dept" className="text-xs font-semibold text-foreground">বিভাগ</label>
            <select
              id="edit-doc-dept"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {DEPT_OPTIONS.map((dept) => (
                <option key={dept.value} value={dept.value}>{dept.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label htmlFor="edit-doc-spec" className="text-xs font-semibold text-foreground">বিশেষজ্ঞ পদবি ও ডিগ্রি</label>
            <Input
              id="edit-doc-spec"
              value={formData.specialty}
              onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
              placeholder="যেমন: বিশেষজ্ঞ সার্জন"
              className="h-10 text-sm"
            />
          </div>

          {/* Chamber Fields */}
          <div className="space-y-1.5">
            <label htmlFor="edit-doc-room" className="text-xs font-semibold text-primary">চেম্বার রুম / কক্ষ নং</label>
            <Input
              id="edit-doc-room"
              value={formData.roomNo}
              onChange={(e) => setFormData({ ...formData, roomNo: e.target.value })}
              placeholder="যেমন: রুম-২০৫ (২য় তলা)"
              className="h-10 text-sm border-primary/40 focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="edit-doc-fee" className="text-xs font-semibold text-foreground">পরামর্শ ফি</label>
            <Input
              id="edit-doc-fee"
              value={formData.consultationFee}
              onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
              placeholder="যেমন: ৳১০০০"
              className="h-10 text-sm"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label htmlFor="edit-doc-days" className="text-xs font-semibold text-foreground">সাক্ষাতের দিনসমূহ *</label>
            <Input
              id="edit-doc-days"
              required
              value={formData.visitingDays}
              onChange={(e) => setFormData({ ...formData, visitingDays: e.target.value })}
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
            <label htmlFor="edit-doc-hours" className="text-xs font-semibold text-foreground">সাক্ষাতের সময় *</label>
            <Input
              id="edit-doc-hours"
              required
              value={formData.visitingHours}
              onChange={(e) => setFormData({ ...formData, visitingHours: e.target.value })}
              className="h-10 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="edit-doc-phone" className="text-xs font-semibold text-foreground">সিরিয়াল নম্বর *</label>
            <Input
              id="edit-doc-phone"
              required
              value={formData.serialPhone}
              onChange={(e) => setFormData({ ...formData, serialPhone: e.target.value })}
              className="h-10 text-sm"
            />
          </div>
        </div>

        {/* Availability & Notices in Edit Modal */}
        <div className="p-3.5 bg-muted/20 border border-border/80 rounded-2xl space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            <div className="flex items-center justify-between p-2.5 bg-background border border-border/80 rounded-xl">
              <div>
                <label htmlFor="edit-doc-available" className="text-xs font-bold text-foreground block cursor-pointer">
                  আজ চেম্বার খোলা আছে
                </label>
                <span className="text-[10px] text-muted-foreground">
                  {formData.availableToday ? "আজ চেম্বার খোলা দেখাবে" : "আজ চেম্বার বন্ধ দেখাবে"}
                </span>
              </div>
              <input
                id="edit-doc-available"
                type="checkbox"
                checked={formData.availableToday}
                onChange={(e) => setFormData({ ...formData, availableToday: e.target.checked })}
                className="h-5 w-5 rounded border-border text-primary focus:ring-primary cursor-pointer accent-primary"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="edit-doc-leave" className="text-xs font-semibold text-foreground cursor-pointer">
                ছুটির শেষ তারিখ (ঐচ্ছিক)
              </label>
              <Input
                id="edit-doc-leave"
                type="date"
                value={formData.onLeaveUntil}
                onChange={(e) => setFormData({ ...formData, onLeaveUntil: e.target.value })}
                className="h-9 text-xs"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="edit-doc-notice" className="text-xs font-semibold text-foreground cursor-pointer">
              চেম্বার সংক্রান্ত বিশেষ বিজ্ঞপ্তি (ঐচ্ছিক)
            </label>
            <Input
              id="edit-doc-notice"
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
            {submitting ? "সংরক্ষণ হচ্ছে..." : "পরিবর্তন সংরক্ষণ করুন"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

export function EditChamberScheduleDialog({
  doctor,
  isOpen,
  onClose,
  onSuccess,
}: EditChamberModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {doctor && (
        <EditChamberForm
          key={doctor.id}
          doctor={doctor}
          onClose={onClose}
          onSuccess={onSuccess}
        />
      )}
    </Dialog>
  );
}

// --- UNLINK CONFIRMATION MODAL ---
interface UnlinkDoctorDialogProps {
  doctor: Doctor | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function UnlinkDoctorDialog({
  doctor,
  isOpen,
  onClose,
  onSuccess,
}: UnlinkDoctorDialogProps) {
  const [submitting, setSubmitting] = useState(false);

  if (!doctor) return null;

  const handleUnlink = async () => {
    setSubmitting(true);
    try {
      const res = await dbStore.unlinkDoctorFromPartner(doctor.id);
      if (res.success) {
        toast.success(`${doctor.name} সফলভাবে আনলিঙ্ক করা হয়েছে।`);
        onSuccess();
        onClose();
      } else {
        toast.error(res.error || "আনলিঙ্ক করতে সমস্যা হয়েছে।");
      }
    } catch {
      toast.error("সার্ভারে সমস্যা হয়েছে।");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="border-border bg-background max-w-md p-6">
        <DialogHeader>
          <div className="h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mb-2">
            <AlertCircle className="h-6 w-6" />
          </div>
          <DialogTitle className="font-heading font-bold text-lg">
            ডাক্তার আনলিঙ্ক নিশ্চিতকরণ
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed pt-1">
            আপনি কি নিশ্চিতভাবে <strong>{doctor.name}</strong>-কে আপনার হাসপাতাল চেম্বার তালিকা থেকে আনলিঙ্ক করতে চান? এর ফলে তিনি আপনার চেম্বারের তালিকায় প্রদর্শিত হবেন না।
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 pt-4 border-t border-border mt-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={submitting} className="rounded-xl">
            বাতিল
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleUnlink}
            disabled={submitting}
            className="rounded-xl"
          >
            {submitting ? "আনলিঙ্ক হচ্ছে..." : "আনলিঙ্ক নিশ্চিত করুন"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
