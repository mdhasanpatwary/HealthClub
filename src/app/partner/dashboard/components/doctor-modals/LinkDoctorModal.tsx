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
import { Doctor } from "@/services/db";
import {
  getAvailableDoctorsToLinkAction,
  linkDoctorToPartnerAction,
} from "@/app/actions/partnerDoctorActions";
import { toast } from "sonner";
import { Search, Link as LinkIcon } from "lucide-react";
import { DAY_PRESETS } from "./doctorModalConstants";

export interface LinkDoctorModalProps {
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
        const res = await getAvailableDoctorsToLinkAction(searchTerm);
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
      const res = await linkDoctorToPartnerAction(selectedDoctor.id, {
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
