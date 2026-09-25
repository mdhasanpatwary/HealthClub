"use client";

import Link from "next/link";
import {
  PlusCircle,
  Users,
  Building2,
  Stethoscope,
  Receipt,
  FileCheck,
  RotateCcw,
  TrendingUp,
  Mail,
  Bell,
  ArrowRight,
  Activity,
  Pill,
  Siren,
  BookOpen,
  Smartphone,
  Radio,
  ShieldCheck,
  Star,
  Newspaper,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, toBanglaNums } from "@/lib/utils";
import { TransactionDialog } from "./components/TransactionDialog";
import { AdminStatsGrid } from "./components/AdminStatsGrid";
import { useAdminData } from "./hooks/useAdminData";
import { useAdminDoctors } from "./hooks/useAdminDoctors";
import { useAdminNotifications } from "./hooks/useAdminNotifications";

export default function AdminDashboardPage() {
  const adminData = useAdminData();
  const doctorData = useAdminDoctors();
  const notificationData = useAdminNotifications();

  const {
    loading,
    stats,
    partners,
    newTx,
    setNewTx,
    isTxOpen,
    setIsTxOpen,
    handleAddTransaction,
  } = adminData;

  const quickLinks = [
    {
      title: "সদস্য তালিকা",
      description: "নিবন্ধিত সদস্যদের তথ্য, স্ট্যাটাস ও কার্ড ম্যানেজমেন্ট",
      href: "/admin/members",
      icon: Users,
      count: stats.totalMembers,
      countLabel: "জন সদস্য",
      badge: null,
      color: "indigo",
    },
    {
      title: "পার্টনার হাসপাতাল",
      description: "চুক্তিবদ্ধ হাসপাতাল ও ক্লিনিকগুলোর তালিকা ও ছাড়ের হার",
      href: "/admin/partners?category=hospital",
      icon: Building2,
      count: stats.partnerHospitals,
      countLabel: "টি হাসপাতাল",
      badge: null,
      color: "emerald",
    },
    {
      title: "ডায়াগনস্টিক ও ল্যাব",
      description: "চুক্তিবদ্ধ ডায়াগনস্টিক সেন্টার ও প্যাথলজি ল্যাব নেটওয়ার্ক",
      href: "/admin/partners?category=diagnostic",
      icon: Activity,
      count: stats.partnerDiagnostics,
      countLabel: "টি ডায়াগনস্টিক",
      badge: null,
      color: "sky",
    },
    {
      title: "ফার্মেসি নেটওয়ার্ক",
      description: "চুক্তিবদ্ধ ঔষধের দোকান ও ডিসকাউন্ট সুবিধা",
      href: "/admin/partners?category=pharmacy",
      icon: Pill,
      count: stats.partnerPharmacies,
      countLabel: "টি ফার্মেসি",
      badge: null,
      color: "purple",
    },
    {
      title: "ডাক্তার তালিকা",
      description: "বিশেষজ্ঞ ডাক্তার ও কনসালট্যান্টদের তালিকা ও চেম্বার শিডিউল",
      href: "/admin/doctors",
      icon: Stethoscope,
      count: doctorData.doctors.length,
      countLabel: "জন ডাক্তার",
      badge: null,
      color: "blue",
    },
    {
      title: "লেনদেন লগ",
      description: "সদস্যদের চিকিৎসা সেবায় প্রাপ্ত ডিসকাউন্ট ও সেভিংস রেকর্ড",
      href: "/admin/transactions",
      icon: Receipt,
      count: stats.totalTransactions,
      countLabel: "টি এন্ট্রি",
      badge: null,
      color: "teal",
    },
    {
      title: "আর্থিক ও রাজস্ব অ্যানালিটিক্স",
      description: "সাবস্ক্রিপশন রাজস্ব, নবায়ন রিটেনশন রেট ও পার্টনার সেভিংস রিপোর্ট",
      href: "/admin/analytics",
      icon: TrendingUp,
      count: stats.revenue,
      countLabel: "টাকা রাজস্ব",
      badge: null,
      color: "emerald",
    },
    {
      title: "অংশীদার আবেদন",
      description: "নতুন হাসপাতাল ও ক্লিনিকগুলোর অংশীদারিত্ব আবেদন পর্যালোচনা",
      href: "/admin/partner-requests",
      icon: FileCheck,
      count: stats.pendingPartnerRequests,
      countLabel: "টি নতুন আবেদন",
      badge: stats.pendingPartnerRequests > 0 ? toBanglaNums(stats.pendingPartnerRequests) : null,
      badgeColor: "amber",
      color: "amber",
    },
    {
      title: "নবায়ন আবেদন",
      description: "মেম্বারদের বিকাশ ফি পরিশোধ সাপেক্ষে নবায়ন আবেদন অনুমোদন",
      href: "/admin/renewals",
      icon: RotateCcw,
      count: stats.pendingRenewals,
      countLabel: "টি নবায়ন আবেদন",
      badge: stats.pendingRenewals > 0 ? toBanglaNums(stats.pendingRenewals) : null,
      badgeColor: "amber",
      color: "purple",
    },
    {
      title: "সদস্যদের রিভিউ ও রেটিং",
      description: "পার্টনার হাসপাতালসমূহের জন্য সদস্যদের দেওয়া রেটিং ও রিভিউ মডারেশন",
      href: "/admin/reviews",
      icon: Star,
      count: 0,
      countLabel: "রিভিউ মডারেশন",
      color: "amber",
    },
    {
      title: "যোগাযোগের বার্তা",
      description: "ওয়েবসাইট থেকে আসা গ্রাহক ও দর্শনার্থীদের অনুসন্ধান বার্তা",
      href: "/admin/messages",
      icon: Mail,
      count: stats.contactMessagesCount,
      countLabel: "টি বার্তা",
      badge: stats.contactMessagesCount > 0 ? toBanglaNums(stats.contactMessagesCount) : null,
      badgeColor: "indigo",
      color: "rose",
    },
    {
      title: "বিজ্ঞপ্তি ও অ্যালার্ট",
      description: "মেম্বারশিপ নবায়ন, পার্টনার আবেদন ও অনুসন্ধান নোটিফিকেশন",
      href: "/admin/notifications",
      icon: Bell,
      count: notificationData.unreadCount,
      countLabel: "টি অপঠিত",
      badge:
        notificationData.unreadCount > 0
          ? toBanglaNums(notificationData.unreadCount)
          : null,
      badgeColor:
        notificationData.highPriorityCount > 0 ? "rose" : "amber",
      color: "amber",
    },
    {
      title: "জরুরি সেবা নেটওয়ার্ক",
      description: "রক্তদাতা তালিকা, অ্যাম্বুলেন্স সার্ভিস ও অক্সিজেন হটলাইন",
      href: "/admin/emergency",
      icon: Siren,
      count: stats.emergencyDonorsCount ?? 0,
      countLabel: "জন রক্তদাতা",
      badge:
        (stats.pendingDonorsCount ?? 0) > 0
          ? toBanglaNums(stats.pendingDonorsCount ?? 0)
          : null,
      badgeColor: "rose",
      color: "rose",
    },
    {
      title: "স্বাস্থ্য টিপস ও গাইড",
      description: "স্বাস্থ্য সচেতনতামূলক ব্লগ ও চিকিৎসা পরামর্শ আর্টিকেল",
      href: "/admin/health-tips",
      icon: BookOpen,
      count: stats.healthTipsCount ?? 0,
      countLabel: "টি আর্টিকেল",
      color: "emerald",
    },
    {
      title: "ব্লগ পোস্ট ও রিভিউ",
      description: "হাসপাতাল রিভিউ প্রোফাইল ও স্বাস্থ্য বিষয়ক ব্লগ আর্টিকেল ম্যানেজমেন্ট",
      href: "/admin/blogs",
      icon: Newspaper,
      count: 0,
      countLabel: "ব্লগ পরিচালনা",
      color: "indigo",
    },
    {
      title: "PWA অ্যাপ অ্যানালিটিক্স",
      description: "মোবাইল অ্যাপ ইনস্টল, অ্যাক্টিভেশন ও প্ল্যাটফর্ম পরিসংখ্যান",
      href: "/admin/pwa",
      icon: Smartphone,
      count: stats.pwaInstalls ?? 0,
      countLabel: "টি ইনস্টল",
      color: "teal",
    },
    {
      title: "ব্রডকাস্ট মেসেজিং",
      description: "সকল সদস্য, পার্টনার ও রক্তদাতাদের গণ এসএমএস ও ইমেইল নোটিশ",
      href: "/admin/broadcast",
      icon: Radio,
      count: stats.totalMembers,
      countLabel: "জন সম্ভাব্য প্রাপক",
      color: "emerald",
    },
    {
      title: "এডমিন ও স্টাফ (RBAC)",
      description: "সুপার এডমিন, কন্টেন্ট মডারেটর ও সাপোর্ট স্টাফ পারমিশন পরিচালনা",
      href: "/admin/staff",
      icon: ShieldCheck,
      count: 0,
      countLabel: "রোল পারমিশন",
      color: "purple",
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6 sm:space-y-8 animate-pulse">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-9 w-32 rounded-md" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="border-border shadow-sm bg-background dark:bg-slate-900">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-2 w-2/3">
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-3.5 w-24" />
                </div>
                <Skeleton className="h-12 w-12 rounded-xl" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-secondary dark:text-white">
            অ্যাডমিন অ্যানালিটিক্স ড্যাশবোর্ড
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            হেলথ ক্লাবের সামগ্রিক পরিসংখ্যান ও ব্যবস্থাপনা পর্যবেক্ষণ করুন
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mt-1 sm:mt-0">
          <Link
            href="/admin/notifications"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "relative rounded-xl text-xs font-semibold gap-1.5 shadow-2xs cursor-pointer"
            )}
          >
            <Bell className="h-4 w-4 text-amber-500" />
            <span>বিজ্ঞপ্তি</span>
            {notificationData.unreadCount > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow-xs">
                {toBanglaNums(notificationData.unreadCount)}
              </span>
            )}
          </Link>

          <Button
            onClick={() => setIsTxOpen(true)}
            className="bg-primary hover:bg-primary-dark text-white font-semibold gap-2 shadow-sm cursor-pointer"
            size="sm"
          >
            <PlusCircle className="h-4 w-4" />
            মেম্বার ছাড় এন্ট্রি করুন
          </Button>
        </div>
      </div>

      {/* Admin Stats Grid & Alerts */}
      <AdminStatsGrid stats={stats} />

      {/* Quick Management Hub */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold text-foreground">
            অ্যাডমিন ম্যানেজমেন্ট হাব
          </h2>
          <p className="text-xs text-muted-foreground">
            যেকোনো সেকশনে দ্রুত যেতে ক্লিক করুন
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {quickLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="block group">
                <Card className="border-border shadow-sm group-hover:shadow-md group-hover:border-primary/40 transition-all h-full bg-card">
                  <CardContent className="p-4 flex flex-col justify-between h-full space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:scale-105 group-hover:bg-primary group-hover:text-white transition-all">
                        <Icon className="h-5 w-5" />
                      </div>
                      {item.badge && (
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                          {item.badge} পেন্ডিং
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="font-heading text-sm font-bold text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                        <span>{item.title}</span>
                        <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-primary" />
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-border/50 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground font-medium">
                        {item.countLabel}:
                      </span>
                      <span className="font-mono font-bold text-foreground">
                        {toBanglaNums(item.count)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Transaction Dialog */}
      {isTxOpen && (
        <TransactionDialog
          isOpen={isTxOpen}
          onClose={setIsTxOpen}
          partners={partners}
          newTx={newTx}
          setNewTx={setNewTx}
          onSubmit={handleAddTransaction}
        />
      )}
    </div>
  );
}
