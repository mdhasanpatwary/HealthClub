"use client";

import Link from "next/link";
import { useLanguage } from "@/components/layout/LanguageProvider";
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
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNum } from "@/lib/i18n";
import { TransactionDialog } from "./components/TransactionDialog";
import { AdminStatsGrid } from "./components/AdminStatsGrid";
import { useAdminData } from "./hooks/useAdminData";
import { useAdminDoctors } from "./hooks/useAdminDoctors";
import { useAdminNotifications } from "./hooks/useAdminNotifications";

export default function AdminDashboardPage() {
  const { t, locale } = useLanguage();
  const adminData = useAdminData(t, locale);
  const doctorData = useAdminDoctors();
  const notificationData = useAdminNotifications();
  const isBn = locale === "bn";

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
      title: t("admin.dashboard.membersList") || "সদস্য তালিকা",
      description: isBn
        ? "নিবন্ধিত সদস্যদের তথ্য, স্ট্যাটাস ও কার্ড ম্যানেজমেন্ট"
        : "Manage registered members, status and digital cards",
      href: "/admin/members",
      icon: Users,
      count: stats.totalMembers,
      countLabel: isBn ? "জন সদস্য" : "members",
      badge: null,
      color: "indigo",
    },
    {
      title: isBn ? "পার্টনার হাসপাতাল" : "Partner Hospitals",
      description: isBn
        ? "চুক্তিবদ্ধ হাসপাতাল ও ক্লিনিকগুলোর তালিকা ও ছাড়ের হার"
        : "Contracted hospitals, clinic network and discount rates",
      href: "/admin/partners?category=hospital",
      icon: Building2,
      count: stats.partnerHospitals,
      countLabel: isBn ? "টি হাসপাতাল" : "hospitals",
      badge: null,
      color: "emerald",
    },
    {
      title: isBn ? "ডায়াগনস্টিক ও ল্যাব" : "Diagnostic Centers",
      description: isBn
        ? "চুক্তিবদ্ধ ডায়াগনস্টিক সেন্টার ও প্যাথলজি ল্যাব নেটওয়ার্ক"
        : "Contracted pathology labs and diagnostic test centers",
      href: "/admin/partners?category=diagnostic",
      icon: Activity,
      count: stats.partnerDiagnostics,
      countLabel: isBn ? "টি ডায়াগনস্টিক" : "diagnostics",
      badge: null,
      color: "sky",
    },
    {
      title: isBn ? "ফার্মেসি নেটওয়ার্ক" : "Partner Pharmacies",
      description: isBn
        ? "চুক্তিবদ্ধ ঔষধের দোকান ও ডিসকাউন্ট সুবিধা"
        : "Contracted retail pharmacy network and medicine discounts",
      href: "/admin/partners?category=pharmacy",
      icon: Pill,
      count: stats.partnerPharmacies,
      countLabel: isBn ? "টি ফার্মেসি" : "pharmacies",
      badge: null,
      color: "purple",
    },
    {
      title: isBn ? "ডাক্তার তালিকা" : "Doctors Directory",
      description: isBn
        ? "বিশেষজ্ঞ ডাক্তার ও কনসালট্যান্টদের তালিকা ও চেম্বার শিডিউল"
        : "Specialist doctors, chamber info and serial phones",
      href: "/admin/doctors",
      icon: Stethoscope,
      count: doctorData.doctors.length,
      countLabel: isBn ? "জন ডাক্তার" : "doctors",
      badge: null,
      color: "blue",
    },
    {
      title: t("admin.dashboard.transactionLog") || "লেনদেন লগ",
      description: isBn
        ? "সদস্যদের চিকিৎসা সেবায় প্রাপ্ত ডিসকাউন্ট ও সেভিংস রেকর্ড"
        : "Track member discount savings and transaction histories",
      href: "/admin/transactions",
      icon: Receipt,
      count: stats.totalTransactions,
      countLabel: isBn ? "টি এন্ট্রি" : "transactions",
      badge: null,
      color: "teal",
    },
    {
      title: isBn ? "আর্থিক ও রাজস্ব অ্যানালিটিক্স" : "Revenue Analytics",
      description: isBn
        ? "সাবস্ক্রিপশন রাজস্ব, নবায়ন রিটেনশন রেট ও পার্টনার সেভিংস রিপোর্ট"
        : "Subscription revenue, retention rate and hospital performance",
      href: "/admin/analytics",
      icon: TrendingUp,
      count: stats.revenue,
      countLabel: isBn ? "টাকা রাজস্ব" : "BDT revenue",
      badge: null,
      color: "emerald",
    },
    {
      title: isBn ? "অংশীদার আবেদন" : "Partner Requests",
      description: isBn
        ? "নতুন হাসপাতাল ও ক্লিনিকগুলোর অংশীদারিত্ব আবেদন পর্যালোচনা"
        : "Review pending partner facility applications",
      href: "/admin/partner-requests",
      icon: FileCheck,
      count: stats.pendingPartnerRequests,
      countLabel: isBn ? "টি নতুন আবেদন" : "pending",
      badge: stats.pendingPartnerRequests > 0 ? `${stats.pendingPartnerRequests}` : null,
      badgeColor: "amber",
      color: "amber",
    },
    {
      title: isBn ? "নবায়ন আবেদন" : "Renewal Requests",
      description: isBn
        ? "মেম্বারদের বিকাশ ফি পরিশোধ সাপেক্ষে নবায়ন আবেদন অনুমোদন"
        : "Approve and extend member annual subscriptions",
      href: "/admin/renewals",
      icon: RotateCcw,
      count: stats.pendingRenewals,
      countLabel: isBn ? "টি নবায়ন আবেদন" : "pending",
      badge: stats.pendingRenewals > 0 ? `${stats.pendingRenewals}` : null,
      badgeColor: "amber",
      color: "purple",
    },
    {
      title: t("admin.dashboard.contactMessages") || "যোগাযোগের বার্তা",
      description: isBn
        ? "ওয়েবসাইট থেকে আসা গ্রাহক ও দর্শনার্থীদের অনুসন্ধান বার্তা"
        : "Review visitor feedback and general inquiries",
      href: "/admin/messages",
      icon: Mail,
      count: stats.contactMessagesCount,
      countLabel: isBn ? "টি বার্তা" : "messages",
      badge: stats.contactMessagesCount > 0 ? `${stats.contactMessagesCount}` : null,
      badgeColor: "indigo",
      color: "rose",
    },
    {
      title: isBn ? "বিজ্ঞপ্তি ও অ্যালার্ট" : "Notifications & Alerts",
      description: isBn
        ? "মেম্বারশিপ নবায়ন, পার্টনার আবেদন ও অনুসন্ধান নোটিফিকেশন"
        : "Real-time alerts for renewals, partner requests and inquiries",
      href: "/admin/notifications",
      icon: Bell,
      count: notificationData.unreadCount,
      countLabel: isBn ? "টি অপঠিত" : "unread",
      badge:
        notificationData.unreadCount > 0
          ? `${notificationData.unreadCount}`
          : null,
      badgeColor:
        notificationData.highPriorityCount > 0 ? "rose" : "amber",
      color: "amber",
    },
    {
      title: isBn ? "জরুরি সেবা নেটওয়ার্ক" : "Emergency Services",
      description: isBn
        ? "রক্তদাতা তালিকা, অ্যাম্বুলেন্স সার্ভিস ও অক্সিজেন হটলাইন"
        : "Blood donor registry, ambulance fleet & hotlines",
      href: "/admin/emergency",
      icon: Siren,
      count: stats.emergencyDonorsCount ?? 0,
      countLabel: isBn ? "জন রক্তদাতা" : "blood donors",
      badge:
        (stats.pendingDonorsCount ?? 0) > 0
          ? `${stats.pendingDonorsCount}`
          : null,
      badgeColor: "rose",
      color: "rose",
    },
    {
      title: isBn ? "স্বাস্থ্য টিপস ও গাইড" : "Health Tips & Guides",
      description: isBn
        ? "স্বাস্থ্য সচেতনতামূলক ব্লগ ও চিকিৎসা পরামর্শ আর্টিকেল"
        : "Health awareness blogs, guides & medical articles",
      href: "/admin/health-tips",
      icon: BookOpen,
      count: stats.healthTipsCount ?? 0,
      countLabel: isBn ? "টি আর্টিকেল" : "articles",
      color: "emerald",
    },
    {
      title: isBn ? "PWA অ্যাপ অ্যানালিটিক্স" : "PWA App Analytics",
      description: isBn
        ? "মোবাইল অ্যাপ ইনস্টল, অ্যাক্টিভেশন ও প্ল্যাটফর্ম পরিসংখ্যান"
        : "App installs, user retention & platform analytics",
      href: "/admin/pwa",
      icon: Smartphone,
      count: stats.pwaInstalls ?? 0,
      countLabel: isBn ? "টি ইনস্টল" : "installs",
      color: "teal",
    },
    {
      title: isBn ? "ব্রডকাস্ট মেসেজিং" : "Broadcast Campaigns",
      description: isBn
        ? "সকল সদস্য, পার্টনার ও রক্তদাতাদের গণ এসএমএস ও ইমেইল নোটিশ"
        : "Mass SMS, email & in-app announcements to user segments",
      href: "/admin/broadcast",
      icon: Radio,
      count: stats.totalMembers,
      countLabel: isBn ? "জন সম্ভাব্য প্রাপক" : "reach",
      color: "emerald",
    },
    {
      title: isBn ? "এডমিন ও স্টাফ (RBAC)" : "Staff & RBAC",
      description: isBn
        ? "সুপার এডমিন, কন্টেন্ট মডারেটর ও সাপোর্ট স্টাফ পারমিশন পরিচালনা"
        : "Manage admin users, granular access control and permissions",
      href: "/admin/staff",
      icon: ShieldCheck,
      count: 0,
      countLabel: isBn ? "রোল পারমিশন" : "access control",
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
            {t("admin.dashboard.adminAnalyticsDashboard")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t("admin.dashboard.manageStatsDesc")}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mt-1 sm:mt-0">
          <Link href="/admin/notifications">
            <Button
              variant="outline"
              size="sm"
              className="relative rounded-xl text-xs font-semibold gap-1.5 shadow-2xs cursor-pointer"
            >
              <Bell className="h-4 w-4 text-amber-500" />
              <span>{t("admin.nav.notifications") || "বিজ্ঞপ্তি"}</span>
              {notificationData.unreadCount > 0 && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow-xs">
                  {formatNum(notificationData.unreadCount, locale)}
                </span>
              )}
            </Button>
          </Link>

          <Button
            onClick={() => setIsTxOpen(true)}
            className="bg-primary hover:bg-primary-dark text-white font-semibold gap-2 shadow-sm cursor-pointer"
            size="sm"
          >
            <PlusCircle className="h-4 w-4" />
            {t("admin.dashboard.logMemberDiscountTitle")}
          </Button>
        </div>
      </div>

      {/* Admin Stats Grid & Alerts */}
      <AdminStatsGrid stats={stats} />

      {/* Quick Management Hub */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold text-foreground">
            {isBn ? "অ্যাডমিন ম্যানেজমেন্ট হাব" : "Management Sections"}
          </h2>
          <p className="text-xs text-muted-foreground">
            {isBn
              ? "যেকোনো সেকশনে দ্রুত যেতে ক্লিক করুন"
              : "Click to navigate directly to any section"}
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
                          {item.badge} {isBn ? "পেন্ডিং" : "pending"}
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
                        {formatNum(item.count, locale)}
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
          t={t}
        />
      )}
    </div>
  );
}
