"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import {
  WifiOff,
  ShieldCheck,
  PhoneCall,
  Ambulance,
  Heart,
  Clock,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  getOfflineSyncMetadata,
  getOfflineEmergencyDirectory,
  OfflineEmergencyDirectory,
} from "@/lib/safeStorage";
import { INITIAL_AMBULANCES, INITIAL_EMERGENCY_HOTLINES } from "@/data/emergencyData";

interface OfflineCardBannerProps {
  locale?: string;
}

function subscribeOffline(callback: () => void) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

function getOfflineSnapshot() {
  return !navigator.onLine;
}

function getServerOfflineSnapshot() {
  return false;
}

export function OfflineCardBanner({ locale = "bn" }: OfflineCardBannerProps) {
  const isEn = locale === "en";
  const isOffline = useSyncExternalStore(
    subscribeOffline,
    getOfflineSnapshot,
    getServerOfflineSnapshot
  );
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [offlineDirectory, setOfflineDirectory] = useState<OfflineEmergencyDirectory | null>(null);

  useEffect(() => {
    // Fetch offline sync metadata
    getOfflineSyncMetadata().then((meta) => {
      if (meta.memberCardLastSynced) {
        try {
          const date = new Date(meta.memberCardLastSynced);
          setLastSyncTime(
            date.toLocaleTimeString(isEn ? "en-US" : "bn-BD", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
          );
        } catch {
          // Ignored
        }
      }
    });

    // Fetch offline cached emergency directory
    getOfflineEmergencyDirectory().then((data) => {
      if (data) {
        setOfflineDirectory(data);
      }
    });
  }, [isEn]);

  if (!isOffline) {
    return null;
  }

  const ambulances =
    offlineDirectory?.ambulances && offlineDirectory.ambulances.length > 0
      ? offlineDirectory.ambulances
      : INITIAL_AMBULANCES.slice(0, 4);

  const hotlines =
    offlineDirectory?.hotlines && offlineDirectory.hotlines.length > 0
      ? offlineDirectory.hotlines
      : INITIAL_EMERGENCY_HOTLINES.slice(0, 4);

  return (
    <div className="w-full rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-emerald-500/10 p-4 sm:p-5 shadow-lg backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left Side: Status & Description */}
        <div className="flex items-start gap-3 min-w-0">
          <div className="h-10 w-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
            <WifiOff className="h-5 w-5 text-amber-500 animate-pulse" />
          </div>
          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-heading text-sm sm:text-base font-bold text-secondary dark:text-amber-100 flex items-center gap-1.5">
                {isEn ? "Offline Mode Active" : "অফলাইন মোড সক্রিয়"}
              </h3>
              <Badge
                variant="outline"
                className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] sm:text-xs font-semibold py-0.5 px-2 flex items-center gap-1"
              >
                <ShieldCheck className="h-3 w-3 shrink-0" />
                {isEn ? "ID Card Cached" : "কার্ড ও জরুরি সেবা ক্যাশড"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isEn
                ? "You have zero network connectivity. Your digital member card, QR code, and emergency hotlines are cached locally and 100% functional."
                : "ইন্টারনেট সংযোগ না থাকলেও আপনার ডিজিটাল মেম্বার কার্ড ও জরুরি অ্যাম্বুলেন্স হটলাইনসমূহ সম্পূর্ণ প্রস্তুত রয়েছে।"}
            </p>
            {lastSyncTime && (
              <p className="text-[11px] text-muted-foreground/80 flex items-center gap-1 font-mono">
                <Clock className="h-3 w-3 text-amber-500" />
                {isEn ? `Last synced: ${lastSyncTime}` : `সর্বশেষ সংরক্ষিত: ${lastSyncTime}`}
              </p>
            )}
          </div>
        </div>

        {/* Right Side: Emergency Quick Action Button */}
        <div className="w-full sm:w-auto shrink-0 flex items-center gap-2">
          <Dialog open={isEmergencyModalOpen} onOpenChange={setIsEmergencyModalOpen}>
            <DialogTrigger
              render={
                <Button
                  variant="destructive"
                  className="w-full sm:w-auto bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-md rounded-xl gap-2 active:scale-95"
                >
                  <PhoneCall className="h-3.5 w-3.5 animate-bounce" />
                  {isEn ? "Offline Emergency Call" : "অফলাইন জরুরি ডায়াল"}
                </Button>
              }
            />
            <DialogContent className="max-w-lg p-5 sm:p-6 rounded-2xl max-h-[85vh] overflow-y-auto">
              <DialogHeader className="space-y-1.5 pb-2 border-b border-border/50">
                <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                  <Ambulance className="h-5 w-5" />
                  <DialogTitle className="font-heading text-base sm:text-lg font-bold">
                    {isEn ? "Offline Emergency Directory" : "অফলাইন জরুরি মেডিকেল ডিরেক্টরি"}
                  </DialogTitle>
                </div>
                <DialogDescription className="text-xs text-muted-foreground">
                  {isEn
                    ? "Direct tap-to-call emergency services. Works without active internet via cellular network."
                    : "ইন্টারনেট ডাটা ছাড়াই সাধারণ মোবাইল নেটওয়ার্কে সরাসরি কল করতে নিচের নম্বরে ট্যাপ করুন।"}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 pt-3">
                {/* 1. National Emergency 999 Call Card */}
                <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                      {isEn ? "National Emergency" : "জাতীয় জরুরি হেল্পলাইন"}
                    </span>
                    <h4 className="font-heading text-base font-bold text-secondary dark:text-white">
                      999 Ambulance & Police
                    </h4>
                  </div>
                  <a
                    href="tel:999"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md active:scale-95 transition-transform"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    {isEn ? "Call 999" : "৯৯৯ কল দিন"}
                  </a>
                </div>

                {/* 2. Ambulance Services */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold font-heading text-secondary dark:text-white flex items-center gap-1.5">
                    <Ambulance className="h-3.5 w-3.5 text-primary" />
                    {isEn ? "Ambulance Services (Feni)" : "অ্যাম্বুলেন্স সার্ভিস (ফেনী)"}
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {ambulances.map((amb) => (
                      <div
                        key={amb.id}
                        className="rounded-xl border border-border/70 bg-muted/40 p-3 flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-secondary dark:text-white truncate">
                            {amb.name}
                          </p>
                          <p className="text-[11px] text-muted-foreground truncate">
                            {amb.location} • <span className="font-medium text-emerald-600 dark:text-emerald-400">{amb.type}</span>
                          </p>
                        </div>
                        <a
                          href={`tel:${amb.phone}`}
                          className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-white text-xs font-semibold shadow-sm active:scale-95"
                        >
                          <PhoneCall className="h-3 w-3" />
                          {amb.phone}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Hospital & Blood Bank Hotlines */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold font-heading text-secondary dark:text-white flex items-center gap-1.5">
                    <Heart className="h-3.5 w-3.5 text-rose-500" />
                    {isEn ? "Hospital ER & Blood Bank" : "হাসপাতাল জরুরি বিভাগ ও ব্লাড ব্যাংক"}
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {hotlines.map((hotline) => (
                      <div
                        key={hotline.id}
                        className="rounded-xl border border-border/70 bg-muted/40 p-3 flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-secondary dark:text-white truncate">
                            {isEn ? hotline.titleEn : hotline.titleBn}
                          </p>
                          <p className="text-[11px] text-muted-foreground truncate">
                            {isEn ? hotline.descriptionEn : hotline.descriptionBn}
                          </p>
                        </div>
                        <a
                          href={`tel:${hotline.phone}`}
                          className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 text-white text-xs font-semibold shadow-sm active:scale-95"
                        >
                          <PhoneCall className="h-3 w-3" />
                          {hotline.phone}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
