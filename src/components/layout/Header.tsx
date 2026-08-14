"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  Globe,
  Sun,
  Moon,
  LayoutDashboard,
  ChevronDown,
  Siren,
  Calculator,
  BookOpen,
  LogOut,
} from "lucide-react";
import Image from "next/image";
import { dbStore } from "@/services/dbStore";
import { Member, Partner } from "@/services/db";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { useTheme } from "@/components/layout/ThemeProvider";
import UserDropdown from "./UserDropdown";
import PartnerDropdown from "./PartnerDropdown";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<Member | null>(null);
  const [partner, setPartner] = useState<Partner | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { locale, setLocale, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const syncUser = () => {
      setUser(dbStore.getCurrentUser());
      setPartner(dbStore.getCurrentPartner());
    };
    syncUser();

    window.addEventListener("auth-change", syncUser);
    return () => {
      window.removeEventListener("auth-change", syncUser);
    };
  }, [pathname]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled((prev) => (prev !== isScrolled ? isScrolled : prev));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleOpenMenu = () => setIsOpen(true);
    window.addEventListener("open-mobile-menu", handleOpenMenu);
    return () => {
      window.removeEventListener("open-mobile-menu", handleOpenMenu);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleLogout = () => {
    dbStore.logout();
    setIsOpen(false);
    router.push("/");
  };

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  const isServicesActive =
    isActive("/emergency") || isActive("/health-tools") || isActive("/health-tips");

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full pt-[env(safe-area-inset-top,0px)] transition-all duration-300 ${
          scrolled
            ? "border-b border-border/60 bg-background/80 backdrop-blur-xl shadow-sm"
            : "border-b border-transparent bg-background/60 backdrop-blur-md"
        }`}
      >
        <div className="mx-auto flex h-14 min-[992px]:h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 group"
            onClick={() => setIsOpen(false)}
          >
            <div className="relative shrink-0">
              <Image
                src="/images/member-card-logo.png"
                alt="Health Club Logo"
                width={36}
                height={36}
                priority
                style={{ height: "auto" }}
                className="h-8 w-8 sm:h-9 sm:w-9 object-contain drop-shadow-[0_2px_8px_rgba(34,197,94,0.3)] transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <span className="font-heading text-lg sm:text-xl font-bold tracking-tight text-secondary dark:text-white">
              {t("layout.header.health")}{" "}
              <span className="gradient-text">{t("layout.header.club")}</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden min-[992px]:flex items-center space-x-1">
            {/* 1. Home */}
            <Link
              href="/"
              className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                isActive("/")
                  ? "text-primary font-bold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              {t("layout.header.home")}
              {isActive("/") && (
                <span className="absolute bottom-1 left-3 right-3 h-0.5 rounded-full bg-primary animate-scale-in" />
              )}
            </Link>

            {/* 2. Consultants / Doctors */}
            <Link
              href="/consultants"
              className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                isActive("/consultants")
                  ? "text-primary font-bold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              {t("layout.header.consultants")}
              {isActive("/consultants") && (
                <span className="absolute bottom-1 left-3 right-3 h-0.5 rounded-full bg-primary animate-scale-in" />
              )}
            </Link>

            {/* 3. Partner Hospitals */}
            <Link
              href="/partner-hospitals"
              className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                isActive("/partner-hospitals")
                  ? "text-primary font-bold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              {t("layout.header.partnerHospitals")}
              {isActive("/partner-hospitals") && (
                <span className="absolute bottom-1 left-3 right-3 h-0.5 rounded-full bg-primary animate-scale-in" />
              )}
            </Link>

            {/* 4. Services Dropdown (Emergency, Calculators, Health Tips) */}
            <DropdownMenu>
              <DropdownMenuTrigger
                className={`relative inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 outline-none cursor-pointer ${
                  isServicesActive
                    ? "text-primary font-bold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
              >
                <span>{t("layout.header.services") || "সেবাসমূহ"}</span>
                <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                {isServicesActive && (
                  <span className="absolute bottom-1 left-3 right-3 h-0.5 rounded-full bg-primary animate-scale-in" />
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-64 p-1.5 bg-background dark:bg-slate-900 border border-border shadow-xl rounded-2xl space-y-1 z-50"
              >
                <DropdownMenuItem className="p-0 rounded-xl focus:bg-transparent cursor-pointer focus:outline-none">
                  <Link
                    href="/emergency"
                    className="flex items-center gap-3 w-full p-2.5 rounded-xl transition-colors duration-150 hover:bg-rose-500/10 dark:hover:bg-rose-950/40 text-foreground group"
                  >
                    <div className="h-8 w-8 rounded-xl bg-rose-500/15 dark:bg-rose-500/25 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Siren className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="block text-xs font-bold text-foreground group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors truncate">
                        {t("layout.header.emergency")}
                      </span>
                      <span className="block text-[11px] text-muted-foreground group-hover:text-foreground/80 dark:group-hover:text-slate-300 font-normal transition-colors truncate">
                        রক্তদাতা ও অ্যাম্বুলেন্স
                      </span>
                    </div>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem className="p-0 rounded-xl focus:bg-transparent cursor-pointer focus:outline-none">
                  <Link
                    href="/health-tools"
                    className="flex items-center gap-3 w-full p-2.5 rounded-xl transition-colors duration-150 hover:bg-cyan-500/10 dark:hover:bg-cyan-950/40 text-foreground group"
                  >
                    <div className="h-8 w-8 rounded-xl bg-cyan-500/15 dark:bg-cyan-500/25 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Calculator className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="block text-xs font-bold text-foreground group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors truncate">
                        {t("layout.header.healthTools")}
                      </span>
                      <span className="block text-[11px] text-muted-foreground group-hover:text-foreground/80 dark:group-hover:text-slate-300 font-normal transition-colors truncate">
                        বিএমআই ও ক্যালোরি
                      </span>
                    </div>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem className="p-0 rounded-xl focus:bg-transparent cursor-pointer focus:outline-none">
                  <Link
                    href="/health-tips"
                    className="flex items-center gap-3 w-full p-2.5 rounded-xl transition-colors duration-150 hover:bg-primary/10 dark:hover:bg-primary/20 text-foreground group"
                  >
                    <div className="h-8 w-8 rounded-xl bg-primary/15 dark:bg-primary/25 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="block text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                        {t("layout.header.healthTips")}
                      </span>
                      <span className="block text-[11px] text-muted-foreground group-hover:text-foreground/80 dark:group-hover:text-slate-300 font-normal transition-colors truncate">
                        ডাক্তারের পরামর্শ ও ব্লগ
                      </span>
                    </div>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* 5. Membership */}
            <Link
              href="/membership"
              className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                isActive("/membership")
                  ? "text-primary font-bold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              {t("layout.header.membershipPlans")}
              {isActive("/membership") && (
                <span className="absolute bottom-1 left-3 right-3 h-0.5 rounded-full bg-primary animate-scale-in" />
              )}
            </Link>

            {/* 6. Contact */}
            <Link
              href="/contact"
              className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                isActive("/contact")
                  ? "text-primary font-bold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              {t("layout.header.contact")}
              {isActive("/contact") && (
                <span className="absolute bottom-1 left-3 right-3 h-0.5 rounded-full bg-primary animate-scale-in" />
              )}
            </Link>
          </nav>

          {/* Desktop Buttons */}
          <div className="hidden min-[992px]:flex items-center space-x-2">
            {/* Language Switcher Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocale(locale === "bn" ? "en" : "bn")}
              className="rounded-xl text-xs h-9 px-2.5"
            >
              <Globe className="h-4 w-4 mr-1" />
              <span className="font-semibold">{locale === "bn" ? "English" : "বাংলা"}</span>
            </Button>

            {/* Theme Toggle Button */}
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={toggleTheme}
              className="text-muted-foreground hover:text-foreground rounded-xl"
              aria-label="Toggle Theme"
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4 text-amber-400" />
              )}
            </Button>

            {user ? (
              <UserDropdown user={user} />
            ) : partner ? (
              <PartnerDropdown partner={partner} />
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground rounded-xl font-semibold"
                  >
                    {t("layout.header.login")}
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="rounded-xl font-bold">
                    {t("layout.header.becomeMember")}
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex min-[992px]:hidden items-center space-x-1">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">{isOpen ? "Close menu" : "Open menu"}</span>
              <div className="relative h-6 w-6">
                <X
                  className={`absolute inset-0 h-6 w-6 transition-all duration-200 ${
                    isOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-75"
                  }`}
                />
                <Menu
                  className={`absolute inset-0 h-6 w-6 transition-all duration-200 ${
                    isOpen ? "opacity-0 -rotate-90 scale-75" : "opacity-100 rotate-0 scale-100"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu — structured & clean */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-50 min-[992px]:hidden flex flex-col bg-background/98 backdrop-blur-xl transition-all duration-300 ease-in-out ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
        aria-hidden={!isOpen}
      >
        {/* Menu Header */}
        <div className="flex items-center justify-between px-4 h-14 border-b border-border/60 shrink-0">
          <Link
            href="/"
            className="flex items-center space-x-2.5"
            onClick={() => setIsOpen(false)}
          >
            <Image
              src="/images/member-card-logo.png"
              alt="Health Club Logo"
              width={32}
              height={32}
              style={{ height: "auto" }}
              className="h-8 w-8 object-contain drop-shadow-[0_2px_8px_rgba(34,197,94,0.3)] shrink-0"
            />
            <span className="font-heading text-xl font-bold tracking-tight text-secondary dark:text-white">
              {t("layout.header.health")}{" "}
              <span className="gradient-text">{t("layout.header.club")}</span>
            </span>
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
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
                onClick={() => setIsOpen(false)}
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
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-2.5 rounded-xl bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs font-bold"
              >
                <div className="h-7 w-7 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0">
                  <Siren className="h-4 w-4" />
                </div>
                <span>{t("layout.header.emergency")} (রক্তদাতা ও অ্যাম্বুলেন্স)</span>
              </Link>

              <Link
                href="/health-tools"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-2.5 rounded-xl bg-cyan-500/5 hover:bg-cyan-500/10 border border-cyan-500/20 text-cyan-700 dark:text-cyan-300 text-xs font-bold"
              >
                <div className="h-7 w-7 rounded-lg bg-cyan-500/10 text-cyan-600 flex items-center justify-center shrink-0">
                  <Calculator className="h-4 w-4" />
                </div>
                <span>{t("layout.header.healthTools")} (বিএমআই ও ক্যালোরি)</span>
              </Link>

              <Link
                href="/health-tips"
                onClick={() => setIsOpen(false)}
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
                onClick={() => setIsOpen(false)}
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
                {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4 text-amber-400" />}
                {t("layout.header.darkMode")}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                className="text-xs h-8 border-border px-3 rounded-lg font-bold"
              >
                <span>{theme === "light" ? t("layout.header.enable") : t("layout.header.disable")}</span>
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
                {user.email === (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "healthclubfeni@gmail.com") ? (
                  <Link href="/admin" className="block w-full" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full justify-start text-xs border-primary/30 text-primary">
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      {t("layout.header.adminPanel")}
                    </Button>
                  </Link>
                ) : (
                  <Link href="/dashboard" className="block w-full" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full justify-start text-xs border-primary/30 text-primary">
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
                <Link href="/partner/dashboard" className="block w-full" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full justify-start text-xs border-emerald-500/30 text-emerald-600">
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    ড্যাশবোর্ড
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  onClick={() => {
                    dbStore.logoutPartner();
                    setIsOpen(false);
                    router.push("/");
                  }}
                  className="w-full justify-start text-xs text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {t("layout.header.logout")}
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/60">
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full text-xs font-semibold">{t("layout.header.login")}</Button>
                </Link>
                <Link href="/register" onClick={() => setIsOpen(false)}>
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
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />
    </>
  );
}
