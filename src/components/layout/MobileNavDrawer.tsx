"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  X,
  Globe,
  Sun,
  Moon,
  LayoutDashboard,
  LogOut,
  Users,
  RotateCcw,
  Receipt,
  Stethoscope,
  Building2,
  FileCheck,
  Siren,
  BookOpen,
  Mail,
  Settings,
  Smartphone,
  ExternalLink,
  Calculator,
} from "lucide-react";
import { Member, Partner } from "@/services/db";
import { dbStore } from "@/services/dbStore";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { useTheme } from "@/components/layout/ThemeProvider";
import { formatNum } from "@/lib/i18n";
import { useAdminCounts } from "@/app/admin/hooks/useAdminCounts";

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: Member | null;
  partner: Partner | null;
}

export default function MobileNavDrawer({
  isOpen,
  onClose,
  user,
  partner,
}: MobileNavDrawerProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { locale, setLocale, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const {
    doctorsCount,
    pendingPartnerRequests,
    pendingRenewals,
    contactMessagesCount,
  } = useAdminCounts();

  const isAdminMode = pathname.startsWith("/admin");
  const isBn = locale === "bn";

  const handleLogout = () => {
    dbStore.logout();
    onClose();
    router.push("/");
  };

  const handlePartnerLogout = () => {
    dbStore.logoutPartner();
    onClose();
    router.push("/");
  };

  const isActive = (path: string) => {
    if (path === "/" || path === "/admin") return pathname === path;
    return pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Drawer */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-50 min-[992px]:hidden flex flex-col bg-background/98 backdrop-blur-xl transition-all duration-300 ease-in-out ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
        aria-hidden={!isOpen}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-4 h-14 border-b border-border/60 shrink-0">
          <Link
            href={isAdminMode ? "/admin" : "/"}
            className="flex items-center space-x-2.5"
            onClick={onClose}
          >
            <Image
              src="/images/member-card-logo.png"
              alt="Health Club Logo"
              width={32}
              height={32}
              style={{ width: "auto", height: "auto" }}
              className="h-8 w-8 object-contain drop-shadow-[0_2px_8px_rgba(34,197,94,0.3)] shrink-0"
            />
            <span className="font-heading text-lg font-bold tracking-tight text-secondary dark:text-white">
              {t("layout.header.health")}{" "}
              <span className="gradient-text">{t("layout.header.club")}</span>
            </span>
          </Link>
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-hidden"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {isAdminMode ? (
            /* ADMIN MOBILE NAVIGATION — Grouped Menu > Submenu */
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
                    href="/admin/partners"
                    onClick={onClose}
                    className={`flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition-colors ${
                      isActive("/admin/partners")
                        ? "bg-primary/10 text-primary font-bold"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Building2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>{t("admin.nav.partners") || "পার্টনার হাসপাতাল"}</span>
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
          ) : (
            /* PUBLIC MOBILE NAVIGATION */
            <div className="space-y-5">
              {/* Main Links */}
              <div className="space-y-1">
                {[
                  { name: t("layout.header.home"), path: "/" },
                  { name: t("layout.header.consultants"), path: "/consultants" },
                  { name: t("layout.header.partnerHospitals"), path: "/partner-hospitals" },
                  { name: t("layout.header.membershipPlans"), path: "/membership" },
                ].map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    onClick={onClose}
                    className={`flex items-center rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors ${
                      isActive(link.path)
                        ? "bg-primary/10 text-primary font-bold"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* Services Group */}
              <div className="space-y-2">
                <div className="px-3.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  {t("layout.header.services") || "সেবাসমূহ"}
                </div>
                <div className="grid grid-cols-1 gap-1.5">
                  <Link
                    href="/emergency"
                    onClick={onClose}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs font-bold"
                  >
                    <div className="h-7 w-7 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0">
                      <Siren className="h-4 w-4" />
                    </div>
                    <span>{t("layout.header.emergency")} (রক্তদাতা ও অ্যাম্বুলেন্স)</span>
                  </Link>

                  <Link
                    href="/health-tools"
                    onClick={onClose}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-cyan-500/5 hover:bg-cyan-500/10 border border-cyan-500/20 text-cyan-700 dark:text-cyan-300 text-xs font-bold"
                  >
                    <div className="h-7 w-7 rounded-lg bg-cyan-500/10 text-cyan-600 flex items-center justify-center shrink-0">
                      <Calculator className="h-4 w-4" />
                    </div>
                    <span>{t("layout.header.healthTools")} (বিএমআই ও ক্যালোরি)</span>
                  </Link>

                  <Link
                    href="/health-tips"
                    onClick={onClose}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-primary/5 hover:bg-primary/10 border border-primary/20 text-primary text-xs font-bold"
                  >
                    <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <span>{t("layout.header.healthTips")} (ডাক্তারের পরামর্শ ও ব্লগ)</span>
                  </Link>
                </div>
              </div>

              {/* Company Links */}
              <div className="space-y-1 pt-1 border-t border-border/60">
                {[
                  { name: t("layout.header.aboutUs"), path: "/about-us" },
                  { name: t("layout.header.contact"), path: "/contact" },
                ].map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    onClick={onClose}
                    className={`flex items-center rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-colors ${
                      isActive(link.path)
                        ? "bg-primary/10 text-primary font-bold"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Footer controls: Language, Theme & Auth */}
          <div className="border-t border-border/60 pt-4 space-y-3">
            {/* Language Switcher */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <Globe className="h-4 w-4" />
                {t("layout.header.changeLanguage")}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLocale(locale === "bn" ? "en" : "bn")}
                className="text-xs h-8 border-border px-3 rounded-lg font-bold"
              >
                <span>{locale === "bn" ? "English" : "বাংলা"}</span>
              </Button>
            </div>

            {/* Theme Switcher */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                {theme === "light" ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4 text-amber-400" />
                )}
                {t("layout.header.darkMode")}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                className="text-xs h-8 border-border px-3 rounded-lg font-bold"
              >
                <span>
                  {theme === "light"
                    ? t("layout.header.enable")
                    : t("layout.header.disable")}
                </span>
              </Button>
            </div>

            {/* User / Partner Auth in Mobile Drawer */}
            {user ? (
              <div className="pt-2 border-t border-border/60 space-y-2">
                <div className="flex items-center gap-2.5 text-sm font-semibold text-foreground pb-1">
                  <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase shrink-0 border border-primary/20">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span className="truncate">{user.name}</span>
                </div>
                {user.email ===
                (process.env.NEXT_PUBLIC_ADMIN_EMAIL ||
                  "healthclubfeni@gmail.com") ? (
                  <Link
                    href="/admin"
                    className="block w-full"
                    onClick={onClose}
                  >
                    <Button
                      variant="outline"
                      className="w-full justify-start text-xs border-primary/30 text-primary"
                    >
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      {t("layout.header.adminPanel")}
                    </Button>
                  </Link>
                ) : (
                  <Link
                    href="/dashboard"
                    className="block w-full"
                    onClick={onClose}
                  >
                    <Button
                      variant="outline"
                      className="w-full justify-start text-xs border-primary/30 text-primary"
                    >
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      {t("layout.header.dashboard")}
                    </Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="w-full justify-start text-xs text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {t("layout.header.logout")}
                </Button>
              </div>
            ) : partner ? (
              <div className="pt-2 border-t border-border/60 space-y-2">
                <Link
                  href="/partner/dashboard"
                  className="block w-full"
                  onClick={onClose}
                >
                  <Button
                    variant="outline"
                    className="w-full justify-start text-xs border-emerald-500/30 text-emerald-600"
                  >
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    ড্যাশবোর্ড
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  onClick={handlePartnerLogout}
                  className="w-full justify-start text-xs text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {t("layout.header.logout")}
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/60">
                <Link href="/login" onClick={onClose}>
                  <Button
                    variant="outline"
                    className="w-full text-xs font-semibold"
                  >
                    {t("layout.header.login")}
                  </Button>
                </Link>
                <Link href="/register" onClick={onClose}>
                  <Button className="w-full text-xs font-bold">
                    {t("layout.header.becomeMember")}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 min-[992px]:hidden backdrop-blur-sm transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
    </>
  );
}
