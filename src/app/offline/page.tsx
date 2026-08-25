"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  WifiOff,
  RotateCw,
  PhoneCall,
  Ambulance,
  CreditCard,
  Phone,
  ShieldCheck,
  LayoutDashboard,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import MemberCard from "@/components/ui/MemberCard";
import {
  getOfflineMemberCard,
  getOfflineEmergencyDirectory,
  OfflineEmergencyDirectory,
} from "@/lib/safeStorage";
import { Member } from "@/services/db";
import { INITIAL_AMBULANCES, INITIAL_EMERGENCY_HOTLINES } from "@/data/emergencyData";

export default function OfflinePage() {
  const [offlineMember, setOfflineMember] = useState<Member | null>(null);
  const [offlineDir, setOfflineDir] = useState<OfflineEmergencyDirectory | null>(null);

  useEffect(() => {
    Promise.all([getOfflineMemberCard(), getOfflineEmergencyDirectory()]).then(
      ([member, directory]) => {
        setOfflineMember(member);
        setOfflineDir(directory);
      }
    );
  }, []);

  const ambulances =
    offlineDir?.ambulances && offlineDir.ambulances.length > 0
      ? offlineDir.ambulances.slice(0, 3)
      : INITIAL_AMBULANCES.slice(0, 3);

  const hotlines =
    offlineDir?.hotlines && offlineDir.hotlines.length > 0
      ? offlineDir.hotlines.slice(0, 3)
      : INITIAL_EMERGENCY_HOTLINES.slice(0, 3);

  return (
    <div className="min-h-screen bg-muted/30 dark:bg-slate-950 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 text-foreground">
      <div className="mx-auto max-w-2xl space-y-6 sm:space-y-8">
        {/* Offline Notification Header */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shadow-inner">
            <WifiOff className="w-8 h-8 sm:w-10 sm:h-10 text-amber-500 animate-pulse" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold font-heading text-secondary dark:text-white">
                আপনি অফলাইনে আছেন
              </h1>
              <Badge
                variant="outline"
                className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 text-xs font-semibold"
              >
                Offline Mode
              </Badge>
            </div>
            <p className="text-muted-foreground text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
              ইন্টারনেট সংযোগ নেই, তবে আপনার সংরক্ষিত ডিজিটাল মেম্বার কার্ড ও জরুরি মেডিকেল নম্বর নিচে প্রস্তুত রয়েছে।
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <Button
              onClick={() => window.location.reload()}
              size="sm"
              className="bg-primary hover:bg-primary/90 text-white rounded-xl gap-2 font-semibold shadow-sm text-xs"
            >
              <RotateCw className="h-3.5 w-3.5" />
              পুনরায় সংযোগ চেষ্টা করুন
            </Button>
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="rounded-xl gap-2 text-xs">
                <LayoutDashboard className="h-3.5 w-3.5 text-primary" />
                ড্যাশবোর্ড
              </Button>
            </Link>
          </div>
        </div>

        {/* 1. Offline Cached Member ID Card */}
        {offlineMember && (
          <Card className="border-border/60 shadow-lg overflow-hidden bg-card">
            <CardHeader className="border-b border-border/50 pb-3 bg-muted/40 flex flex-row items-center justify-between">
              <div className="space-y-0.5">
                <CardTitle className="font-heading text-sm sm:text-base font-bold flex items-center gap-2 text-secondary dark:text-white">
                  <CreditCard className="h-4 w-4 text-emerald-500" />
                  ডিজিটাল মেম্বার আইডি কার্ড (অফলাইন)
                </CardTitle>
                <p className="text-[11px] text-muted-foreground">
                  হাসপাতাল ডিসকাউন্ট পেতে এই কার্ডটি প্রদর্শন করুন
                </p>
              </div>
              <Badge
                variant="outline"
                className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-bold shrink-0"
              >
                <ShieldCheck className="h-3 w-3 mr-1" />
                Cached & Valid
              </Badge>
            </CardHeader>
            <CardContent className="p-3 sm:p-5 flex justify-center">
              <MemberCard member={offlineMember} />
            </CardContent>
          </Card>
        )}

        {/* 2. Offline Emergency Quick Dial Directory */}
        <Card className="border-rose-500/30 shadow-lg overflow-hidden bg-gradient-to-br from-card via-card to-rose-500/5">
          <CardHeader className="border-b border-border/50 pb-3 bg-rose-500/10 flex flex-row items-center justify-between">
            <div className="space-y-0.5">
              <CardTitle className="font-heading text-sm sm:text-base font-bold text-rose-700 dark:text-rose-400 flex items-center gap-2">
                <Ambulance className="h-4 w-4 text-rose-600" />
                জরুরি অ্যাম্বুলেন্স ও হটলাইন (ট্যাপ-টু-কল)
              </CardTitle>
              <p className="text-[11px] text-muted-foreground">
                ইন্টারনেট ছাড়াই সাধারণ মোবাইল নেটওয়ার্কে সরাসরি কল দিন
              </p>
            </div>
            <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest bg-rose-500/10 px-2 py-1 rounded-md border border-rose-500/20">
              Direct Dial
            </span>
          </CardHeader>
          <CardContent className="p-4 sm:p-5 space-y-4">
            {/* National 999 */}
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wide">
                  জাতীয় জরুরি সেবা
                </p>
                <p className="text-sm font-bold text-secondary dark:text-white">
                  ৯৯৯ (অ্যাম্বুলেন্স ও পুলিশ)
                </p>
              </div>
              <a
                href="tel:999"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm active:scale-95 transition-transform"
              >
                <Phone className="h-3.5 w-3.5" />
                ৯৯৯ ডায়াল
              </a>
            </div>

            {/* Ambulances */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-secondary dark:text-white flex items-center gap-1.5">
                <Ambulance className="h-3.5 w-3.5 text-primary" />
                ফেনী অ্যাম্বুলেন্স সেবা
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ambulances.map((amb) => (
                  <div
                    key={amb.id}
                    className="p-2.5 rounded-xl border border-border/70 bg-muted/40 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate text-secondary dark:text-white">
                        {amb.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {amb.location} • <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{amb.type}</span>
                      </p>
                    </div>
                    <a
                      href={`tel:${amb.phone}`}
                      className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary hover:bg-primary/90 text-white text-[11px] font-semibold active:scale-95"
                    >
                      <PhoneCall className="h-3 w-3" />
                      কল
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Hospital Hotlines */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-secondary dark:text-white flex items-center gap-1.5">
                <Heart className="h-3.5 w-3.5 text-rose-500" />
                হাসপাতাল জরুরি বিভাগ ও ব্লাড ব্যাংক
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {hotlines.map((hotline) => (
                  <div
                    key={hotline.id}
                    className="p-2.5 rounded-xl border border-border/70 bg-muted/40 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate text-secondary dark:text-white">
                        {hotline.titleBn}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {hotline.descriptionBn}
                      </p>
                    </div>
                    <a
                      href={`tel:${hotline.phone}`}
                      className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-secondary hover:bg-secondary/90 text-white text-[11px] font-semibold active:scale-95"
                    >
                      <PhoneCall className="h-3 w-3" />
                      কল
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
