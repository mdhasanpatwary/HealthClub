"use client";

import { Card, CardContent } from "@/components/ui/card";
import { BackupTableStats } from "@/services/db";
import { useLanguage } from "@/components/layout/LanguageProvider";
import {
  Users,
  Building2,
  Receipt,
  Stethoscope,
  ShieldCheck,
  Smartphone,
  Bell,
  Mail,
  SlidersHorizontal,
  HardDrive,
  UserCheck,
  FileCheck,
  Star,
  Radio,
  Droplet,
  Truck,
} from "lucide-react";

interface DbBackupTableStatsProps {
  stats: BackupTableStats | null;
  loading?: boolean;
}

export function DbBackupTableStats({ stats, loading }: DbBackupTableStatsProps) {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  if (loading || !stats) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 animate-pulse">
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={i} className="h-20 rounded-xl bg-muted/60 border border-border" />
        ))}
      </div>
    );
  }

  const items = [
    { label: isEn ? "Members" : "সদস্যগণ", count: stats.members, icon: Users, color: "text-blue-500 bg-blue-500/10" },
    { label: isEn ? "Partners" : "হাসপাতাল/ফার্মেসি", count: stats.partners, icon: Building2, color: "text-emerald-500 bg-emerald-500/10" },
    { label: isEn ? "Partner Staff" : "কাউন্টার স্টাফ", count: stats.partnerStaff, icon: UserCheck, color: "text-teal-500 bg-teal-500/10" },
    { label: isEn ? "Transactions" : "লেনদেন লগ", count: stats.transactions, icon: Receipt, color: "text-purple-500 bg-purple-500/10" },
    { label: isEn ? "Doctors" : "ডাক্তারগণ", count: stats.doctors, icon: Stethoscope, color: "text-rose-500 bg-rose-500/10" },
    { label: isEn ? "Partner Requests" : "পার্টনার আবেদন", count: stats.partnerRequests, icon: FileCheck, color: "text-amber-500 bg-amber-500/10" },
    { label: isEn ? "Contact Messages" : "গ্রাহক বার্তা", count: stats.contactMessages, icon: Mail, color: "text-cyan-500 bg-cyan-500/10" },
    { label: isEn ? "System Settings" : "সিস্টেম কনফিগ", count: stats.systemSettings, icon: SlidersHorizontal, color: "text-indigo-500 bg-indigo-500/10" },
    { label: isEn ? "PWA Installs" : "PWA ইনস্টলেশন", count: stats.pwaInstallations, icon: Smartphone, color: "text-orange-500 bg-orange-500/10" },
    { label: isEn ? "Notifications" : "নোটিফিকেশন", count: stats.memberNotifications, icon: Bell, color: "text-pink-500 bg-pink-500/10" },
    { label: isEn ? "Admin Users" : "এডমিন একাউন্ট", count: stats.adminUsers, icon: ShieldCheck, color: "text-violet-500 bg-violet-500/10" },
    { label: isEn ? "Snapshots" : "সংরক্ষিত ব্যাকআপ", count: stats.databaseSnapshots, icon: HardDrive, color: "text-primary bg-primary/10" },
    ...(stats.reviews !== undefined
      ? [{ label: isEn ? "Reviews" : "রিভিউ", count: stats.reviews, icon: Star, color: "text-amber-500 bg-amber-500/10" }]
      : []),
    ...(stats.pushSubscriptions !== undefined
      ? [{ label: isEn ? "Push Subs" : "পুশ সাবস্ক্রিপশন", count: stats.pushSubscriptions, icon: Radio, color: "text-sky-500 bg-sky-500/10" }]
      : []),
    ...(stats.bloodDonors !== undefined
      ? [{ label: isEn ? "Blood Donors" : "রক্তদাতা", count: stats.bloodDonors, icon: Droplet, color: "text-red-500 bg-red-500/10" }]
      : []),
    ...(stats.ambulanceServices !== undefined
      ? [{ label: isEn ? "Ambulances" : "অ্যাম্বুলেন্স", count: stats.ambulanceServices, icon: Truck, color: "text-blue-600 bg-blue-600/10" }]
      : []),
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {items.map((item, i) => {
        const Icon = item.icon;
        return (
          <Card key={i} className="border border-border/80 bg-card/60 backdrop-blur-xs shadow-xs hover:border-border transition-all">
            <CardContent className="p-3.5 flex items-center gap-3">
              <div className={`p-2 rounded-lg shrink-0 ${item.color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-muted-foreground font-medium truncate">{item.label}</p>
                <p className="text-base font-bold text-foreground font-mono leading-tight">{item.count}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
