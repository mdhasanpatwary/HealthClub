"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  RotateCcw,
  Receipt,
  TrendingUp,
  Stethoscope,
  Building2,
  Activity,
  Pill,
  FileCheck,
  Siren,
  BookOpen,
  Radio,
  Bell,
  Mail,
  Smartphone,
  ShieldCheck,
  Settings,
  Globe,
  ExternalLink,
} from "lucide-react";
import { formatNum } from "@/lib/i18n";

interface MobileNavAdminLinksProps {
  pathname: string;
  onClose: () => void;
  locale: "bn" | "en";
  t: (key: string) => string;
  doctorsCount: number;
  pendingPartnerRequests: number;
  pendingRenewals: number;
  contactMessagesCount: number;
}

export function MobileNavAdminLinks({
  pathname,
  onClose,
  locale,
  t,
  doctorsCount,
  pendingPartnerRequests,
  pendingRenewals,
  contactMessagesCount,
}: MobileNavAdminLinksProps) {
  const isBn = locale === "bn";

  const isActive = (path: string) => {
    if (path === "/admin") return pathname === path;
    return pathname.startsWith(path);
  };

  return (
    <div className="space-y-4">
      {/* Dashboard */}
      <Link
        href="/admin"
        onClick={onClose}
        className={`flex items-center gap-3 p-2.5 rounded-xl text-sm font-semibold transition-colors ${
          isActive("/admin")
            ? "bg-primary text-white shadow-sm font-bold"
            : "text-foreground hover:bg-muted/70"
        }`}
      >
        <LayoutDashboard className="h-4 w-4 shrink-0" />
        <span>{t("admin.nav.dashboard") || "ড্যাশবোর্ড"}</span>
      </Link>

      {/* Category 1: Members & Billing */}
      <div className="space-y-1.5">
        <div className="px-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          {t("admin.nav.membersAndTx") || "সদস্য ও লেনদেন"}
        </div>
        <div className="space-y-1 pl-1">
          <Link
            href="/admin/members"
            onClick={onClose}
            className={`flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition-colors ${
              isActive("/admin/members")
                ? "bg-primary/10 text-primary font-bold"
                : "text-foreground hover:bg-muted"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Users className="h-4 w-4 text-indigo-500 shrink-0" />
              <span>{t("admin.nav.membersList") || "সদস্য তালিকা"}</span>
            </div>
          </Link>

          <Link
            href="/admin/renewals"
            onClick={onClose}
            className={`flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition-colors ${
              isActive("/admin/renewals")
                ? "bg-primary/10 text-primary font-bold"
                : "text-foreground hover:bg-muted"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <RotateCcw className="h-4 w-4 text-purple-500 shrink-0" />
              <span>{t("admin.nav.renewals") || "নবায়ন আবেদন"}</span>
            </div>
            {pendingRenewals > 0 && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                {formatNum(pendingRenewals, locale)} {isBn ? "পেন্ডিং" : "pending"}
              </span>
            )}
          </Link>

          <Link
            href="/admin/transactions"
            onClick={onClose}
            className={`flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition-colors ${
              isActive("/admin/transactions")
                ? "bg-primary/10 text-primary font-bold"
                : "text-foreground hover:bg-muted"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Receipt className="h-4 w-4 text-teal-500 shrink-0" />
              <span>{t("admin.nav.transactions") || "লেনদেন লগ"}</span>
            </div>
          </Link>

          <Link
            href="/admin/analytics"
            onClick={onClose}
            className={`flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition-colors ${
              isActive("/admin/analytics")
                ? "bg-primary/10 text-primary font-bold"
                : "text-foreground hover:bg-muted"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <TrendingUp className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>{isBn ? "আর্থিক ও রাজস্ব অ্যানালিটিক্স" : "Revenue Analytics"}</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Category 2: Medical Network */}
      <div className="space-y-1.5">
        <div className="px-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          {t("admin.nav.medicalNetwork") || "মেডিকেল নেটওয়ার্ক"}
        </div>
        <div className="space-y-1 pl-1">
          <Link
            href="/admin/doctors"
            onClick={onClose}
            className={`flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition-colors ${
              isActive("/admin/doctors")
                ? "bg-primary/10 text-primary font-bold"
                : "text-foreground hover:bg-muted"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Stethoscope className="h-4 w-4 text-blue-500 shrink-0" />
              <span>{t("admin.nav.doctors") || "ডাক্তার তালিকা"}</span>
            </div>
            {doctorsCount > 0 && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold bg-muted text-muted-foreground">
                {formatNum(doctorsCount, locale)}
              </span>
            )}
          </Link>

          <Link
            href="/admin/partners?category=hospital"
            onClick={onClose}
            className={`flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition-colors ${
              pathname === "/admin/partners" || pathname.startsWith("/admin/partners")
                ? "bg-primary/10 text-primary font-bold"
                : "text-foreground hover:bg-muted"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Building2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>{isBn ? "পার্টনার হাসপাতাল" : "Partner Hospitals"}</span>
            </div>
          </Link>

          <Link
            href="/admin/partners?category=diagnostic"
            onClick={onClose}
            className="flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition-colors text-foreground hover:bg-muted"
          >
            <div className="flex items-center gap-2.5">
              <Activity className="h-4 w-4 text-sky-500 shrink-0" />
              <span>{isBn ? "ডায়াগনস্টিক সেন্টার" : "Diagnostic Centers"}</span>
            </div>
          </Link>

          <Link
            href="/admin/partners?category=pharmacy"
            onClick={onClose}
            className="flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition-colors text-foreground hover:bg-muted"
          >
            <div className="flex items-center gap-2.5">
              <Pill className="h-4 w-4 text-purple-500 shrink-0" />
              <span>{isBn ? "ফার্মেসি নেটওয়ার্ক" : "Partner Pharmacies"}</span>
            </div>
          </Link>

          <Link
            href="/admin/partner-requests"
            onClick={onClose}
            className={`flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition-colors ${
              isActive("/admin/partner-requests")
                ? "bg-primary/10 text-primary font-bold"
                : "text-foreground hover:bg-muted"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FileCheck className="h-4 w-4 text-amber-500 shrink-0" />
              <span>{t("admin.nav.partnerRequests") || "অংশীদার আবেদন"}</span>
            </div>
            {pendingPartnerRequests > 0 && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                {formatNum(pendingPartnerRequests, locale)} {isBn ? "পেন্ডিং" : "pending"}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Category 3: Services & Content */}
      <div className="space-y-1.5">
        <div className="px-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          {t("admin.nav.servicesAndContent") || "সেবা ও কন্টেন্ট"}
        </div>
        <div className="space-y-1 pl-1">
          <Link
            href="/admin/emergency"
            onClick={onClose}
            className={`flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition-colors ${
              isActive("/admin/emergency")
                ? "bg-primary/10 text-primary font-bold"
                : "text-foreground hover:bg-muted"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Siren className="h-4 w-4 text-rose-500 shrink-0" />
              <span>{t("admin.nav.emergency") || "জরুরি সেবা"}</span>
            </div>
          </Link>

          <Link
            href="/admin/health-tips"
            onClick={onClose}
            className={`flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition-colors ${
              isActive("/admin/health-tips")
                ? "bg-primary/10 text-primary font-bold"
                : "text-foreground hover:bg-muted"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <BookOpen className="h-4 w-4 text-primary shrink-0" />
              <span>{t("admin.nav.healthTips") || "স্বাস্থ্য টিপস"}</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Category 4: System & Support */}
      <div className="space-y-1.5">
        <div className="px-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          {t("admin.nav.system") || "সিস্টেম ও সাপোর্ট"}
        </div>
        <div className="space-y-1 pl-1">
          <Link
            href="/admin/broadcast"
            onClick={onClose}
            className={`flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition-colors ${
              isActive("/admin/broadcast")
                ? "bg-primary/10 text-primary font-bold"
                : "text-foreground hover:bg-muted"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Radio className="h-4 w-4 text-primary shrink-0" />
              <span>{t("admin.nav.broadcast") || "ব্রডকাস্ট ক্যাম্পেইন"}</span>
            </div>
          </Link>

          <Link
            href="/admin/notifications"
            onClick={onClose}
            className={`flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition-colors ${
              isActive("/admin/notifications")
                ? "bg-primary/10 text-primary font-bold"
                : "text-foreground hover:bg-muted"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Bell className="h-4 w-4 text-amber-500 shrink-0" />
              <span>{t("admin.nav.notifications") || "বিজ্ঞপ্তি ও অ্যালার্ট"}</span>
            </div>
          </Link>

          <Link
            href="/admin/messages"
            onClick={onClose}
            className={`flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition-colors ${
              isActive("/admin/messages")
                ? "bg-primary/10 text-primary font-bold"
                : "text-foreground hover:bg-muted"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 text-rose-500 shrink-0" />
              <span>{t("admin.nav.messages") || "যোগাযোগের বার্তা"}</span>
            </div>
            {contactMessagesCount > 0 && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold bg-primary/15 text-primary border border-primary/20">
                {formatNum(contactMessagesCount, locale)}
              </span>
            )}
          </Link>

          <Link
            href="/admin/pwa"
            onClick={onClose}
            className={`flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition-colors ${
              isActive("/admin/pwa")
                ? "bg-primary/10 text-primary font-bold"
                : "text-foreground hover:bg-muted"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Smartphone className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>{t("admin.nav.pwa") || "PWA অ্যানালিটিক্স"}</span>
            </div>
          </Link>

          <Link
            href="/admin/staff"
            onClick={onClose}
            className={`flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition-colors ${
              isActive("/admin/staff")
                ? "bg-primary/10 text-primary font-bold"
                : "text-foreground hover:bg-muted"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="h-4 w-4 text-purple-500 shrink-0" />
              <span>{isBn ? "এডমিন ও স্টাফ (RBAC)" : "Staff & RBAC"}</span>
            </div>
          </Link>

          <Link
            href="/admin/settings"
            onClick={onClose}
            className={`flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition-colors ${
              isActive("/admin/settings")
                ? "bg-primary/10 text-primary font-bold"
                : "text-foreground hover:bg-muted"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Settings className="h-4 w-4 text-slate-500 shrink-0" />
              <span>{t("admin.nav.settings") || "সিস্টেম সেটিংস"}</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Exit to Public Website */}
      <div className="pt-2 border-t border-border/60">
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center justify-between p-2.5 rounded-xl bg-muted/60 hover:bg-muted text-foreground text-xs font-semibold transition-colors border border-border"
        >
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>{t("admin.nav.viewSite") || "পাবলিক ওয়েবসাইট দেখুন"}</span>
          </div>
          <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
        </Link>
      </div>
    </div>
  );
}
