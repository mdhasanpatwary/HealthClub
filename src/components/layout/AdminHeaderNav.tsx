"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  RotateCcw,
  Receipt,
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

export default function AdminHeaderNav() {
  const pathname = usePathname();
  const { t, locale } = useLanguage();
  const {
    doctorsCount,
    pendingPartnerRequests,
    pendingRenewals,
    contactMessagesCount,
  } = useAdminCounts();

  const isMembersActive =
    pathname.startsWith("/admin/members") ||
    pathname.startsWith("/admin/renewals") ||
    pathname.startsWith("/admin/transactions");

  const isNetworkActive =
    pathname.startsWith("/admin/doctors") ||
    pathname.startsWith("/admin/partners") ||
    pathname.startsWith("/admin/partner-requests");

  const isServicesActive =
    pathname.startsWith("/admin/emergency") ||
    pathname.startsWith("/admin/health-tips");

  const isSystemActive =
    pathname.startsWith("/admin/notifications") ||
    pathname.startsWith("/admin/messages") ||
    pathname.startsWith("/admin/settings") ||
    pathname.startsWith("/admin/pwa");

  return (
    <nav className="hidden min-[992px]:flex items-center space-x-1">
      {/* 1. Dashboard Link */}
      <Link
        href="/admin"
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
          className="w-64 p-1.5 bg-background dark:bg-slate-900 border border-border shadow-xl rounded-2xl space-y-1 z-50"
        >
          {/* Member List */}
          <DropdownMenuItem className="p-0 rounded-xl focus:bg-transparent cursor-pointer focus:outline-hidden">
            <Link
              href="/admin/members"
              className={`flex items-center gap-3 w-full p-2.5 rounded-xl transition-colors duration-150 group ${
                pathname.startsWith("/admin/members")
                  ? "bg-primary/10 text-primary font-bold"
                  : "hover:bg-muted/70 text-foreground"
              }`}
            >
              <div className="h-8 w-8 rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Users className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="block text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                  {t("admin.nav.membersList") || "সদস্য তালিকা"}
                </span>
                <span className="block text-[11px] text-muted-foreground font-normal transition-colors truncate">
                  {t("admin.nav.membersListDesc") || "নিবন্ধিত সদস্যদের তথ্য ও কার্ড"}
                </span>
              </div>
            </Link>
          </DropdownMenuItem>

          {/* Renewal Requests */}
          <DropdownMenuItem className="p-0 rounded-xl focus:bg-transparent cursor-pointer focus:outline-hidden">
            <Link
              href="/admin/renewals"
              className={`flex items-center gap-3 w-full p-2.5 rounded-xl transition-colors duration-150 group ${
                pathname.startsWith("/admin/renewals")
                  ? "bg-primary/10 text-primary font-bold"
                  : "hover:bg-muted/70 text-foreground"
              }`}
            >
              <div className="h-8 w-8 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <RotateCcw className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="block text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                    {t("admin.nav.renewals") || "নবায়ন আবেদন"}
                  </span>
                  {pendingRenewals > 0 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                      {formatNum(pendingRenewals, locale)}
                    </span>
                  )}
                </div>
                <span className="block text-[11px] text-muted-foreground font-normal transition-colors truncate">
                  {t("admin.nav.renewalsDesc") || "মেম্বারশিপ নবায়ন আবেদন অনুমোদন"}
                </span>
              </div>
            </Link>
          </DropdownMenuItem>

          {/* Transaction Log */}
          <DropdownMenuItem className="p-0 rounded-xl focus:bg-transparent cursor-pointer focus:outline-hidden">
            <Link
              href="/admin/transactions"
              className={`flex items-center gap-3 w-full p-2.5 rounded-xl transition-colors duration-150 group ${
                pathname.startsWith("/admin/transactions")
                  ? "bg-primary/10 text-primary font-bold"
                  : "hover:bg-muted/70 text-foreground"
              }`}
            >
              <div className="h-8 w-8 rounded-xl bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Receipt className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="block text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                  {t("admin.nav.transactions") || "লেনদেন লগ"}
                </span>
                <span className="block text-[11px] text-muted-foreground font-normal transition-colors truncate">
                  {t("admin.nav.transactionsDesc") || "ডিসকাউন্ট ও সেভিংস ট্রানজেকশন"}
                </span>
              </div>
            </Link>
          </DropdownMenuItem>
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
          className="w-64 p-1.5 bg-background dark:bg-slate-900 border border-border shadow-xl rounded-2xl space-y-1 z-50"
        >
          {/* Doctors Directory */}
          <DropdownMenuItem className="p-0 rounded-xl focus:bg-transparent cursor-pointer focus:outline-hidden">
            <Link
              href="/admin/doctors"
              className={`flex items-center gap-3 w-full p-2.5 rounded-xl transition-colors duration-150 group ${
                pathname.startsWith("/admin/doctors")
                  ? "bg-primary/10 text-primary font-bold"
                  : "hover:bg-muted/70 text-foreground"
              }`}
            >
              <div className="h-8 w-8 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Stethoscope className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="block text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                    {t("admin.nav.doctors") || "ডাক্তার তালিকা"}
                  </span>
                  {doctorsCount > 0 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full font-bold bg-muted text-muted-foreground">
                      {formatNum(doctorsCount, locale)}
                    </span>
                  )}
                </div>
                <span className="block text-[11px] text-muted-foreground font-normal transition-colors truncate">
                  {t("admin.nav.doctorsDesc") || "বিশেষজ্ঞ ডাক্তার ও চেম্বার শিডিউল"}
                </span>
              </div>
            </Link>
          </DropdownMenuItem>

          {/* Partner Hospitals */}
          <DropdownMenuItem className="p-0 rounded-xl focus:bg-transparent cursor-pointer focus:outline-hidden">
            <Link
              href="/admin/partners"
              className={`flex items-center gap-3 w-full p-2.5 rounded-xl transition-colors duration-150 group ${
                pathname.startsWith("/admin/partners")
                  ? "bg-primary/10 text-primary font-bold"
                  : "hover:bg-muted/70 text-foreground"
              }`}
            >
              <div className="h-8 w-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Building2 className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="block text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                  {t("admin.nav.partners") || "পার্টনার হাসপাতাল"}
                </span>
                <span className="block text-[11px] text-muted-foreground font-normal transition-colors truncate">
                  {t("admin.nav.partnersDesc") || "চুক্তিবদ্ধ হাসপাতাল ও ল্যাব"}
                </span>
              </div>
            </Link>
          </DropdownMenuItem>

          {/* Partner Requests */}
          <DropdownMenuItem className="p-0 rounded-xl focus:bg-transparent cursor-pointer focus:outline-hidden">
            <Link
              href="/admin/partner-requests"
              className={`flex items-center gap-3 w-full p-2.5 rounded-xl transition-colors duration-150 group ${
                pathname.startsWith("/admin/partner-requests")
                  ? "bg-primary/10 text-primary font-bold"
                  : "hover:bg-muted/70 text-foreground"
              }`}
            >
              <div className="h-8 w-8 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <FileCheck className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="block text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                    {t("admin.nav.partnerRequests") || "অংশীদার আবেদন"}
                  </span>
                  {pendingPartnerRequests > 0 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                      {formatNum(pendingPartnerRequests, locale)}
                    </span>
                  )}
                </div>
                <span className="block text-[11px] text-muted-foreground font-normal transition-colors truncate">
                  {t("admin.nav.partnerRequestsDesc") || "নতুন ক্লিনিক ও ল্যাবের আবেদন"}
                </span>
              </div>
            </Link>
          </DropdownMenuItem>
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
          {/* Emergency Services */}
          <DropdownMenuItem className="p-0 rounded-xl focus:bg-transparent cursor-pointer focus:outline-hidden">
            <Link
              href="/admin/emergency"
              className={`flex items-center gap-3 w-full p-2.5 rounded-xl transition-colors duration-150 group ${
                pathname.startsWith("/admin/emergency")
                  ? "bg-primary/10 text-primary font-bold"
                  : "hover:bg-muted/70 text-foreground"
              }`}
            >
              <div className="h-8 w-8 rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Siren className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="block text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                  {t("admin.nav.emergency") || "জরুরি সেবা"}
                </span>
                <span className="block text-[11px] text-muted-foreground font-normal transition-colors truncate">
                  {t("admin.nav.emergencyDesc") || "রক্তদাতা, অ্যাম্বুলেন্স ও অক্সিজেন"}
                </span>
              </div>
            </Link>
          </DropdownMenuItem>

          {/* Health Tips & Blog */}
          <DropdownMenuItem className="p-0 rounded-xl focus:bg-transparent cursor-pointer focus:outline-hidden">
            <Link
              href="/admin/health-tips"
              className={`flex items-center gap-3 w-full p-2.5 rounded-xl transition-colors duration-150 group ${
                pathname.startsWith("/admin/health-tips")
                  ? "bg-primary/10 text-primary font-bold"
                  : "hover:bg-muted/70 text-foreground"
              }`}
            >
              <div className="h-8 w-8 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <BookOpen className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="block text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                  {t("admin.nav.healthTips") || "স্বাস্থ্য টিপস"}
                </span>
                <span className="block text-[11px] text-muted-foreground font-normal transition-colors truncate">
                  {t("admin.nav.healthTipsDesc") || "স্বাস্থ্য বিষয়ক ব্লগ ও আর্টিকেল"}
                </span>
              </div>
            </Link>
          </DropdownMenuItem>
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
          {/* Notifications & Alerts */}
          <DropdownMenuItem className="p-0 rounded-xl focus:bg-transparent cursor-pointer focus:outline-hidden">
            <Link
              href="/admin/notifications"
              className={`flex items-center gap-3 w-full p-2.5 rounded-xl transition-colors duration-150 group ${
                pathname.startsWith("/admin/notifications")
                  ? "bg-primary/10 text-primary font-bold"
                  : "hover:bg-muted/70 text-foreground"
              }`}
            >
              <div className="h-8 w-8 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Bell className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="block text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                  {t("admin.nav.notifications") || "বিজ্ঞপ্তি ও অ্যালার্ট"}
                </span>
                <span className="block text-[11px] text-muted-foreground font-normal transition-colors truncate">
                  {t("admin.nav.notificationsDesc") || "নতুন আবেদন, নবায়ন ও বার্তা অ্যালার্ট"}
                </span>
              </div>
            </Link>
          </DropdownMenuItem>

          {/* Contact Messages */}
          <DropdownMenuItem className="p-0 rounded-xl focus:bg-transparent cursor-pointer focus:outline-hidden">
            <Link
              href="/admin/messages"
              className={`flex items-center gap-3 w-full p-2.5 rounded-xl transition-colors duration-150 group ${
                pathname.startsWith("/admin/messages")
                  ? "bg-primary/10 text-primary font-bold"
                  : "hover:bg-muted/70 text-foreground"
              }`}
            >
              <div className="h-8 w-8 rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Mail className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="block text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                    {t("admin.nav.messages") || "যোগাযোগের বার্তা"}
                  </span>
                  {contactMessagesCount > 0 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full font-bold bg-primary/15 text-primary border border-primary/20">
                      {formatNum(contactMessagesCount, locale)}
                    </span>
                  )}
                </div>
                <span className="block text-[11px] text-muted-foreground font-normal transition-colors truncate">
                  {t("admin.nav.messagesDesc") || "ভিজিটর অনুসন্ধান ও বার্তা"}
                </span>
              </div>
            </Link>
          </DropdownMenuItem>

          {/* PWA Analytics */}
          <DropdownMenuItem className="p-0 rounded-xl focus:bg-transparent cursor-pointer focus:outline-hidden">
            <Link
              href="/admin/pwa"
              className={`flex items-center gap-3 w-full p-2.5 rounded-xl transition-colors duration-150 group ${
                pathname.startsWith("/admin/pwa")
                  ? "bg-primary/10 text-primary font-bold"
                  : "hover:bg-muted/70 text-foreground"
              }`}
            >
              <div className="h-8 w-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Smartphone className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="block text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                  {t("admin.nav.pwa") || "PWA অ্যানালিটিক্স"}
                </span>
                <span className="block text-[11px] text-muted-foreground font-normal transition-colors truncate">
                  {t("admin.nav.pwaDesc") || "অ্যাপ ইনস্টল ও সক্রিয় ইউজার পরিসংখ্যান"}
                </span>
              </div>
            </Link>
          </DropdownMenuItem>

          {/* System Settings */}
          <DropdownMenuItem className="p-0 rounded-xl focus:bg-transparent cursor-pointer focus:outline-hidden">
            <Link
              href="/admin/settings"
              className={`flex items-center gap-3 w-full p-2.5 rounded-xl transition-colors duration-150 group ${
                pathname.startsWith("/admin/settings")
                  ? "bg-primary/10 text-primary font-bold"
                  : "hover:bg-muted/70 text-foreground"
              }`}
            >
              <div className="h-8 w-8 rounded-xl bg-slate-500/15 text-slate-600 dark:text-slate-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Settings className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="block text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                  {t("admin.nav.settings") || "সিস্টেম সেটিংস"}
                </span>
                <span className="block text-[11px] text-muted-foreground font-normal transition-colors truncate">
                  {t("admin.nav.settingsDesc") || "ফি, পেমেন্ট নম্বর ও নোটিশ"}
                </span>
              </div>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}
