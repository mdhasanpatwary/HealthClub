"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Doctor } from "@/services/db";
import {
  getAvailableDoctorsToLinkAction,
  linkDoctorToPartnerAction,
} from "@/app/actions/partnerDoctorActions";
import { toast } from "sonner";
import { Search, Link as LinkIcon, X, Check, Stethoscope } from "lucide-react";
import { DAY_PRESETS, DEPT_OPTIONS } from "./doctorModalConstants";

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
  const [selectedDept, setSelectedDept] = useState("all");
  const [searching, setSearching] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [availableDoctors, setAvailableDoctors] = useState<Doctor[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
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
    setSelectedDept("all");
    setPage(1);
    setHasMore(false);
    onClose();
  };

  useEffect(() => {
    if (!isOpen) return;

    let isCancelled = false;
    const fetchInitial = async () => {
      setSearching(true);
      setPage(1);
      try {
        const res = await getAvailableDoctorsToLinkAction(searchTerm, 1, 50);
        if (!isCancelled) {
          if (res.success) {
            setAvailableDoctors(res.doctors);
            setHasMore(res.hasMore);
            setTotalCount(res.total);
          } else {
            toast.error(res.error || "ডাক্তার তালিকা পেতে সমস্যা হয়েছে।");
          }
        }
      } catch {
        if (!isCancelled) {
          toast.error("সার্ভার থেকে তথ্য লোড করা যায়নি।");
        }
      } finally {
        if (!isCancelled) {
          setSearching(false);
        }
      }
    };

    const timer = setTimeout(fetchInitial, 250);
    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [isOpen, searchTerm]);

  const loadMore = async () => {
    if (!hasMore || loadingMore || searching) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    try {
      const res = await getAvailableDoctorsToLinkAction(searchTerm, nextPage, 50);
      if (res.success) {
        setAvailableDoctors((prev) => [...prev, ...res.doctors]);
        setHasMore(res.hasMore);
        setTotalCount(res.total);
        setPage(nextPage);
      }
    } catch {
      toast.error("পরবর্তী ডাক্তার লোড করতে সমস্যা হয়েছে।");
    } finally {
      setLoadingMore(false);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (target.scrollHeight - target.scrollTop - target.clientHeight < 50) {
      if (hasMore && !loadingMore && !searching) {
        loadMore();
      }
    }
  };

  // Client-side filtering by department if chosen
  const displayedDoctors = availableDoctors.filter((doc) => {
    if (selectedDept === "all") return true;
    return doc.department === selectedDept;
  });

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
      <DialogContent className="border-border bg-background max-h-[90vh] overflow-y-auto overflow-x-hidden w-full max-w-[calc(100vw-2rem)] sm:max-w-2xl md:max-w-3xl p-4 sm:p-6">
        <DialogHeader className="space-y-1">
          <DialogTitle className="font-heading font-bold text-base sm:text-lg md:text-xl flex items-center gap-2">
            <LinkIcon className="h-5 w-5 text-primary shrink-0" />
            <span className="truncate">ডিরেক্টরি থেকে বিদ্যমান ডাক্তার লিঙ্ক করুন</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            হেলথ ক্লাব প্ল্যাটফর্মে থাকা রেজিস্টার্ড বিশেষজ্ঞ ডাক্তারকে আপনার হাসপাতাল চেম্বারে যুক্ত করুন।
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2 w-full max-w-full overflow-x-hidden">
          {!selectedDoctor ? (
            <>
              {/* Search & Department Filter */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full max-w-full">
                <div className="relative sm:col-span-2 w-full min-w-0">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="ডাক্তারের নাম, পদবি, বা ডিগ্রি দিয়ে খুঁজুন..."
                    className="pl-9 pr-8 h-10 rounded-xl text-xs sm:text-sm w-full"
                    autoFocus
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer p-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="w-full min-w-0">
                  <select
                    aria-label="বিশেষজ্ঞ বিভাগ ফিল্টার"
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="all">সকল বিভাগ ({totalCount > 0 ? totalCount : availableDoctors.length})</option>
                    {DEPT_OPTIONS.map((dept) => (
                      <option key={dept.value} value={dept.value}>
                        {dept.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Doctor Results List with Infinite Scroll */}
              <div
                onScroll={handleScroll}
                className="max-h-80 overflow-y-auto overflow-x-hidden space-y-2 border border-border/80 rounded-2xl p-2.5 bg-muted/20 w-full max-w-full"
              >
                {searching ? (
                  <div className="space-y-2 p-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="p-3 rounded-xl bg-card border border-border/50 flex items-center justify-between gap-3 w-full">
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <Skeleton className="h-4 w-48 max-w-full" />
                          <Skeleton className="h-3 w-32 max-w-full" />
                        </div>
                        <Skeleton className="h-8 w-20 rounded-xl shrink-0" />
                      </div>
                    ))}
                  </div>
                ) : displayedDoctors.length === 0 ? (
                  <div className="text-center py-8 px-4 space-y-2 w-full">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground mx-auto">
                      <Stethoscope className="h-5 w-5" />
                    </div>
                    <p className="text-xs font-semibold text-foreground">কোনো নতুন ডাক্তার পাওয়া যায়নি।</p>
                    <p className="text-[11px] text-muted-foreground">
                      {searchTerm
                        ? "অন্য শব্দ বা বিভাগ দিয়ে সার্চ করে দেখুন।"
                        : "উপরে 'নতুন ডাক্তার যুক্ত করুন' থেকে সরাসরি নতুন ডাক্তার যোগ করতে পারেন।"}
                    </p>
                  </div>
                ) : (
                  <>
                    {displayedDoctors.map((doc) => (
                      <div
                        key={doc.id}
                        onClick={() => handleSelectDoctor(doc)}
                        className="flex items-center justify-between p-3 rounded-xl bg-card border border-border/60 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group gap-3 w-full min-w-0 max-w-full"
                      >
                        <div className="min-w-0 flex-1 space-y-1 overflow-hidden">
                          <div className="flex items-center gap-2 flex-wrap max-w-full">
                            <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate max-w-full">
                              {doc.name}
                            </h4>
                            <Badge variant="outline" className="text-[10px] py-0 px-2 bg-primary/10 text-primary border-primary/20 shrink-0">
                              {doc.department}
                            </Badge>
                          </div>
                          <p className="text-xs text-foreground/80 font-medium truncate max-w-full">{doc.specialty}</p>
                          {doc.degrees && <p className="text-[11px] text-muted-foreground truncate max-w-full">{doc.degrees}</p>}
                          {doc.designation && (
                            <p className="text-[11px] text-slate-500 italic truncate max-w-full">{doc.designation}</p>
                          )}
                        </div>

                        <Button
                          size="sm"
                          variant="secondary"
                          className="shrink-0 text-xs rounded-xl font-semibold group-hover:bg-primary group-hover:text-white transition-colors"
                        >
                          <Check className="h-3.5 w-3.5 mr-1 hidden group-hover:inline" />
                          <span>নির্বাচন করুন</span>
                        </Button>
                      </div>
                    ))}

                    {/* Infinite Scroll Loading or End Indicator */}
                    {loadingMore && (
                      <div className="p-3 rounded-xl bg-card border border-border/50 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                        <div className="h-3.5 w-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        <span>পরবর্তী ডাক্তারদের লোড করা হচ্ছে...</span>
                      </div>
                    )}

                    {!hasMore && displayedDoctors.length >= 50 && (
                      <div className="text-center py-2 text-[11px] text-muted-foreground font-medium border-t border-border/40">
                        সকল ডাক্তার দেখানো হয়েছে (মোট: {totalCount || displayedDoctors.length} জন)
                      </div>
                    )}
                  </>
                )}
              </div>
            </>
          ) : (
            <form onSubmit={handleLink} className="space-y-4 w-full max-w-full overflow-x-hidden">
              <div className="p-3.5 rounded-2xl bg-primary/10 border border-primary/25 flex items-start justify-between gap-3 w-full min-w-0">
                <div className="min-w-0 flex-1 overflow-hidden">
                  <div className="flex items-center gap-2 flex-wrap max-w-full">
                    <h4 className="text-sm font-bold text-primary truncate max-w-full">{selectedDoctor.name}</h4>
                    <Badge variant="outline" className="text-[10px] bg-primary/20 text-primary border-primary/30 shrink-0">
                      {selectedDoctor.department}
                    </Badge>
                  </div>
                  <p className="text-xs text-foreground/80 truncate max-w-full">{selectedDoctor.specialty}</p>
                  {selectedDoctor.degrees && <p className="text-[11px] text-muted-foreground truncate max-w-full">{selectedDoctor.degrees}</p>}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedDoctor(null)}
                  className="text-xs text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
                >
                  পরিবর্তন করুন
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-full">
                <div className="space-y-1.5 w-full min-w-0">
                  <label htmlFor="link-room" className="text-xs font-semibold text-foreground">চেম্বার রুম / কক্ষ নং</label>
                  <Input
                    id="link-room"
                    value={chamberData.roomNo}
                    onChange={(e) => setChamberData({ ...chamberData, roomNo: e.target.value })}
                    placeholder="যেমন: রুম-৪০১"
                    className="h-10 text-sm w-full"
                  />
                </div>

                <div className="space-y-1.5 w-full min-w-0">
                  <label htmlFor="link-fee" className="text-xs font-semibold text-foreground">পরামর্শ ফি</label>
                  <Input
                    id="link-fee"
                    value={chamberData.consultationFee}
                    onChange={(e) => setChamberData({ ...chamberData, consultationFee: e.target.value })}
                    placeholder="যেমন: ৳১০০০"
                    className="h-10 text-sm w-full"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2 w-full min-w-0">
                  <label htmlFor="link-days" className="text-xs font-semibold text-foreground">সাক্ষাতের দিনসমূহ *</label>
                  <Input
                    id="link-days"
                    required
                    value={chamberData.visitingDays}
                    onChange={(e) => setChamberData({ ...chamberData, visitingDays: e.target.value })}
                    placeholder="যেমন: শনি - বৃহস্পতি"
                    className="h-10 text-sm w-full"
                  />
                  <div className="flex flex-wrap gap-1.5 pt-1 max-w-full">
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

                <div className="space-y-1.5 w-full min-w-0">
                  <label htmlFor="link-hours" className="text-xs font-semibold text-foreground">সাক্ষাতের সময় *</label>
                  <Input
                    id="link-hours"
                    required
                    value={chamberData.visitingHours}
                    onChange={(e) => setChamberData({ ...chamberData, visitingHours: e.target.value })}
                    placeholder="যেমন: বিকাল ৫:০০ - রাত ৯:০০"
                    className="h-10 text-sm w-full"
                  />
                </div>

                <div className="space-y-1.5 w-full min-w-0">
                  <label htmlFor="link-phone" className="text-xs font-semibold text-foreground">সিরিয়াল নম্বর *</label>
                  <Input
                    id="link-phone"
                    required
                    value={chamberData.serialPhone}
                    onChange={(e) => setChamberData({ ...chamberData, serialPhone: e.target.value })}
                    placeholder="যেমন: 017XXXXXXXX"
                    className="h-10 text-sm w-full"
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2 pt-4 border-t border-border w-full">
                <Button type="button" variant="outline" onClick={() => setSelectedDoctor(null)} className="rounded-xl w-full sm:w-auto">
                  পেছনে যান
                </Button>
                <Button type="submit" disabled={submitting} className="rounded-xl bg-primary text-white hover:bg-primary/90 cursor-pointer w-full sm:w-auto">
                  {submitting ? "লিঙ্ক হচ্ছে..." : "চেম্বারে লিঙ্ক নিশ্চিত করুন"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

