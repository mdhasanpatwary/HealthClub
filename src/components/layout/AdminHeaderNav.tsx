"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  RotateCcw,
  Receipt,
  TrendingUp,
  Stethoscope,
  Building2,
  FileCheck,
  Siren,
  BookOpen,
  Mail,
  Bell,
  Settings,
  Smartphone,
  ChevronDown,
  Activity,
  Pill,
  Radio,
  ShieldCheck,
} from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { formatNum } from "@/lib/i18n";
import { useAdminCounts } from "@/app/admin/hooks/useAdminCounts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AdminNavItemProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
  badge?: string | number | null;
  badgeVariant?: "primary" | "amber" | "muted";
  active: boolean;
}

function AdminNavDropdownItem({
  href,
  icon: Icon,
  iconBg,
  iconColor,
  title,
  description,
  badge,
  badgeVariant = "muted",
  active,
}: AdminNavItemProps) {
  return (
    <DropdownMenuItem className="p-0 rounded-xl focus:bg-transparent cursor-pointer focus:outline-hidden">
      <Link
        href={href}
        className={`flex items-center gap-3 w-full p-2.5 rounded-xl transition-colors duration-150 group ${
          active
            ? "bg-primary/10 text-primary font-bold"
            : "hover:bg-muted/70 text-foreground"
        }`}
      >
        <div
          className={`h-8 w-8 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}
        >
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <span className="block text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
              {title}
            </span>
            {badge !== undefined && badge !== null && (
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full font-bold ${
                  badgeVariant === "amber"
                    ? "bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30"
                    : badgeVariant === "primary"
                    ? "bg-primary/15 text-primary border border-primary/20"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {badge}
              </span>
            )}
          </div>
          <span className="block text-[11px] text-muted-foreground font-normal transition-colors truncate">
            {description}
          </span>
        </div>
      </Link>
    </DropdownMenuItem>
  );
}

export default function AdminHeaderNav() {
  const pathname = usePathname();
  const { t, locale } = useLanguage();
  const isBn = locale === "bn";
  const {
    doctorsCount,
    pendingPartnerRequests,
    pendingRenewals,
    contactMessagesCount,
  } = useAdminCounts();

  const isMembersActive =
    pathname.startsWith("/admin/members") ||
    pathname.startsWith("/admin/renewals") ||
    pathname.startsWith("/admin/transactions") ||
    pathname.startsWith("/admin/analytics");

  const isNetworkActive =
    pathname.startsWith("/admin/doctors") ||
    pathname.startsWith("/admin/partners") ||
    pathname.startsWith("/admin/partner-requests");

  const isServicesActive =
    pathname.startsWith("/admin/emergency") ||
    pathname.startsWith("/admin/health-tips");

  const isSystemActive =
    pathname.startsWith("/admin/staff") ||
    pathname.startsWith("/admin/broadcast") ||
    pathname.startsWith("/admin/notifications") ||
    pathname.startsWith("/admin/messages") ||
    pathname.startsWith("/admin/settings") ||
    pathname.startsWith("/admin/pwa");

  return (
    <nav aria-label="Admin Navigation" className="hidden min-[992px]:flex items-center space-x-1">
      {/* 1. Dashboard Link */}
      <Link
        href="/admin"
        aria-current={pathname === "/admin" ? "page" : undefined}
        className={`relative inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200 ${
          pathname === "/admin"
            ? "text-primary font-bold bg-primary/10"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
        }`}
      >
        <LayoutDashboard className="h-3.5 w-3.5" />
        <span>{t("admin.nav.dashboard") || "ড্যাশবোর্ড"}</span>
        {pathname === "/admin" && (
          <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-primary" />
        )}
      </Link>

      {/* 2. Members & Billing Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger
          className={`relative inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200 outline-hidden cursor-pointer select-none ${
            isMembersActive
              ? "text-primary font-bold bg-primary/10"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
          }`}
        >
          <Users className="h-3.5 w-3.5" />
          <span>{t("admin.nav.membersAndTx") || "সদস্য ও লেনদেন"}</span>
          {pendingRenewals > 0 && (
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
          )}
          <ChevronDown className="h-3 w-3 opacity-70" />
          {isMembersActive && (
            <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-primary" />
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="w-68 p-1.5 bg-background dark:bg-slate-900 border border-border shadow-xl rounded-2xl space-y-1 z-50"
        >
          <AdminNavDropdownItem
            href="/admin/members"
            icon={Users}
            iconBg="bg-indigo-500/15"
            iconColor="text-indigo-600 dark:text-indigo-400"
            title={t("admin.nav.membersList") || "সদস্য তালিকা"}
            description={t("admin.nav.membersListDesc") || "নিবন্ধিত সদস্যদের তথ্য ও কার্ড"}
            active={pathname.startsWith("/admin/members")}
          />
          <AdminNavDropdownItem
            href="/admin/renewals"
            icon={RotateCcw}
            iconBg="bg-purple-500/15"
            iconColor="text-purple-600 dark:text-purple-400"
            title={t("admin.nav.renewals") || "নবায়ন আবেদন"}
            description={t("admin.nav.renewalsDesc") || "মেম্বারশিপ নবায়ন অনুমোদন"}
            badge={pendingRenewals > 0 ? formatNum(pendingRenewals, locale) : null}
            badgeVariant="amber"
            active={pathname.startsWith("/admin/renewals")}
          />
          <AdminNavDropdownItem
            href="/admin/transactions"
            icon={Receipt}
            iconBg="bg-teal-500/15"
            iconColor="text-teal-600 dark:text-teal-400"
            title={t("admin.nav.transactions") || "লেনদেন লগ"}
            description={t("admin.nav.transactionsDesc") || "ডিসকাউন্ট ও সেভিংস ট্রানজেকশন"}
            active={pathname.startsWith("/admin/transactions")}
          />
          <AdminNavDropdownItem
            href="/admin/analytics"
            icon={TrendingUp}
            iconBg="bg-emerald-500/15"
            iconColor="text-emerald-600 dark:text-emerald-400"
            title={isBn ? "আর্থিক ও রাজস্ব অ্যানালিটিক্স" : "Revenue Analytics"}
            description={isBn ? "সাবস্ক্রিপশন ফি, রিটেনশন ও পার্টনার সাশ্রয়" : "Subscription revenue & hospital metrics"}
            active={pathname.startsWith("/admin/analytics")}
          />
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 3. Medical Network Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger
          className={`relative inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200 outline-hidden cursor-pointer select-none ${
            isNetworkActive
              ? "text-primary font-bold bg-primary/10"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
          }`}
        >
          <Building2 className="h-3.5 w-3.5" />
          <span>{t("admin.nav.medicalNetwork") || "মেডিকেল নেটওয়ার্ক"}</span>
          {pendingPartnerRequests > 0 && (
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
          )}
          <ChevronDown className="h-3 w-3 opacity-70" />
          {isNetworkActive && (
            <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-primary" />
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="w-68 p-1.5 bg-background dark:bg-slate-900 border border-border shadow-xl rounded-2xl space-y-1 z-50"
        >
          <AdminNavDropdownItem
            href="/admin/doctors"
            icon={Stethoscope}
            iconBg="bg-blue-500/15"
            iconColor="text-blue-600 dark:text-blue-400"
            title={t("admin.nav.doctors") || "ডাক্তার তালিকা"}
            description={t("admin.nav.doctorsDesc") || "বিশেষজ্ঞ ডাক্তার ও চেম্বার শিডিউল"}
            badge={doctorsCount > 0 ? formatNum(doctorsCount, locale) : null}
            active={pathname.startsWith("/admin/doctors")}
          />
          <AdminNavDropdownItem
            href="/admin/partners?category=hospital"
            icon={Building2}
            iconBg="bg-emerald-500/15"
            iconColor="text-emerald-600 dark:text-emerald-400"
            title={isBn ? "পার্টনার হাসপাতাল" : "Partner Hospitals"}
            description={isBn ? "চুক্তিবদ্ধ হাসপাতাল ও ক্লিনিক নেটওয়ার্ক" : "Contracted hospitals & clinics"}
            active={pathname.startsWith("/admin/partners")}
          />
          <AdminNavDropdownItem
            href="/admin/partners?category=diagnostic"
            icon={Activity}
            iconBg="bg-sky-500/15"
            iconColor="text-sky-600 dark:text-sky-400"
            title={isBn ? "ডায়াগনস্টিক সেন্টার" : "Diagnostic Centers"}
            description={isBn ? "ল্যাব ও প্যাথলজি টেস্ট সুবিধা" : "Pathology labs & test centers"}
            active={false}
          />
          <AdminNavDropdownItem
            href="/admin/partners?category=pharmacy"
            icon={Pill}
            iconBg="bg-purple-500/15"
            iconColor="text-purple-600 dark:text-purple-400"
            title={isBn ? "ফার্মেসি নেটওয়ার্ক" : "Partner Pharmacies"}
            description={isBn ? "চুক্তিবদ্ধ ঔষধের দোকান ও ডিসকাউন্ট" : "Contracted retail pharmacy network"}
            active={false}
          />
          <AdminNavDropdownItem
            href="/admin/partner-requests"
            icon={FileCheck}
            iconBg="bg-amber-500/15"
            iconColor="text-amber-600 dark:text-amber-400"
            title={t("admin.nav.partnerRequests") || "অংশীদার আবেদন"}
            description={t("admin.nav.partnerRequestsDesc") || "নতুন চিকিৎসাকেন্দ্রের আবেদন"}
            badge={pendingPartnerRequests > 0 ? formatNum(pendingPartnerRequests, locale) : null}
            badgeVariant="amber"
            active={pathname.startsWith("/admin/partner-requests")}
          />
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 4. Services & Content Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger
          className={`relative inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200 outline-hidden cursor-pointer select-none ${
            isServicesActive
              ? "text-primary font-bold bg-primary/10"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
          }`}
        >
          <Siren className="h-3.5 w-3.5" />
          <span>{t("admin.nav.servicesAndContent") || "সেবা ও কন্টেন্ট"}</span>
          <ChevronDown className="h-3 w-3 opacity-70" />
          {isServicesActive && (
            <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-primary" />
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="w-64 p-1.5 bg-background dark:bg-slate-900 border border-border shadow-xl rounded-2xl space-y-1 z-50"
        >
          <AdminNavDropdownItem
            href="/admin/emergency"
            icon={Siren}
            iconBg="bg-rose-500/15"
            iconColor="text-rose-600 dark:text-rose-400"
            title={t("admin.nav.emergency") || "জরুরি সেবা"}
            description={t("admin.nav.emergencyDesc") || "রক্তদাতা, অ্যাম্বুলেন্স ও অক্সিজেন"}
            active={pathname.startsWith("/admin/emergency")}
          />
          <AdminNavDropdownItem
            href="/admin/health-tips"
            icon={BookOpen}
            iconBg="bg-primary/15"
            iconColor="text-primary"
            title={t("admin.nav.healthTips") || "স্বাস্থ্য টিপস"}
            description={t("admin.nav.healthTipsDesc") || "স্বাস্থ্য বিষয়ক ব্লগ ও আর্টিকেল"}
            active={pathname.startsWith("/admin/health-tips")}
          />
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 5. System & Support Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger
          className={`relative inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200 outline-hidden cursor-pointer select-none ${
            isSystemActive
              ? "text-primary font-bold bg-primary/10"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
          }`}
        >
          <Settings className="h-3.5 w-3.5" />
          <span>{t("admin.nav.system") || "সিস্টেম ও সাপোর্ট"}</span>
          {contactMessagesCount > 0 && (
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          )}
          <ChevronDown className="h-3 w-3 opacity-70" />
          {isSystemActive && (
            <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-primary" />
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="w-64 p-1.5 bg-background dark:bg-slate-900 border border-border shadow-xl rounded-2xl space-y-1 z-50"
        >
          <AdminNavDropdownItem
            href="/admin/broadcast"
            icon={Radio}
            iconBg="bg-primary/15"
            iconColor="text-primary"
            title={t("admin.nav.broadcast") || "ব্রডকাস্ট ক্যাম্পেইন"}
            description={t("admin.nav.broadcastDesc") || "এসএমএস ও ইমেইল নোটিশ প্রেরণ"}
            active={pathname.startsWith("/admin/broadcast")}
          />
          <AdminNavDropdownItem
            href="/admin/notifications"
            icon={Bell}
            iconBg="bg-amber-500/15"
            iconColor="text-amber-600 dark:text-amber-400"
            title={t("admin.nav.notifications") || "বিজ্ঞপ্তি ও অ্যালার্ট"}
            description={t("admin.nav.notificationsDesc") || "নতুন আবেদন ও নোটিফিকেশন"}
            active={pathname.startsWith("/admin/notifications")}
          />
          <AdminNavDropdownItem
            href="/admin/messages"
            icon={Mail}
            iconBg="bg-rose-500/15"
            iconColor="text-rose-600 dark:text-rose-400"
            title={t("admin.nav.messages") || "যোগাযোগের বার্তা"}
            description={t("admin.nav.messagesDesc") || "ভিজিটর অনুসন্ধান ও বার্তা"}
            badge={contactMessagesCount > 0 ? formatNum(contactMessagesCount, locale) : null}
            badgeVariant="primary"
            active={pathname.startsWith("/admin/messages")}
          />
          <AdminNavDropdownItem
            href="/admin/pwa"
            icon={Smartphone}
            iconBg="bg-emerald-500/15"
            iconColor="text-emerald-600 dark:text-emerald-400"
            title={t("admin.nav.pwa") || "PWA অ্যানালিটিক্স"}
            description={t("admin.nav.pwaDesc") || "অ্যাপ ইনস্টল ও সক্রিয় পরিসংখ্যান"}
            active={pathname.startsWith("/admin/pwa")}
          />
          <AdminNavDropdownItem
            href="/admin/staff"
            icon={ShieldCheck}
            iconBg="bg-purple-500/15"
            iconColor="text-purple-600 dark:text-purple-400"
            title={isBn ? "এডমিন ও স্টাফ (RBAC)" : "Staff & RBAC"}
            description={isBn ? "রোল পারমিশন ও এক্সেস কন্ট্রোল" : "Role permissions & access control"}
            active={pathname.startsWith("/admin/staff")}
          />
          <AdminNavDropdownItem
            href="/admin/settings"
            icon={Settings}
            iconBg="bg-slate-500/15"
            iconColor="text-slate-600 dark:text-slate-400"
            title={t("admin.nav.settings") || "সিস্টেম সেটিংস"}
            description={t("admin.nav.settingsDesc") || "ফি, পেমেন্ট নম্বর ও নোটিশ"}
            active={pathname.startsWith("/admin/settings")}
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}
