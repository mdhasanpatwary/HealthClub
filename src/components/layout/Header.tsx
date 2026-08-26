"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Languages, Globe, Sun, Moon } from "lucide-react";
import Image from "next/image";
import { authStore } from "@/services/authStore";
import { Member, Partner } from "@/services/db";
import { Button, buttonVariants } from "@/components/ui/button";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { useTheme } from "@/components/layout/ThemeProvider";
import UserDropdown from "./UserDropdown";
import PartnerDropdown from "./PartnerDropdown";
import PublicHeaderNav from "./PublicHeaderNav";
import AdminHeaderNav from "./AdminHeaderNav";
import MobileNavDrawer from "./MobileNavDrawer";
import { AdminNotificationBell } from "./AdminNotificationBell";
import { MemberNotificationBell } from "@/app/dashboard/components/MemberNotificationBell";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<Member | null>(null);
  const [partner, setPartner] = useState<Partner | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { locale, setLocale, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const isAdminMode = pathname.startsWith("/admin");

  // 1. Mount effect: window event listeners (auth sync, scroll detection with RAF throttle, mobile menu trigger)
  useEffect(() => {
    const syncUser = () => {
      setUser(authStore.getCurrentUser());
      setPartner(authStore.getCurrentPartner());
    };
    syncUser();

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const isScrolled = window.scrollY > 10;
          setScrolled((prev) => (prev !== isScrolled ? isScrolled : prev));
          ticking = false;
        });
        ticking = true;
      }
    };
    handleScroll();

    const handleOpenMenu = () => setIsOpen(true);

    window.addEventListener("auth-change", syncUser);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("open-mobile-menu", handleOpenMenu);

    return () => {
      window.removeEventListener("auth-change", syncUser);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("open-mobile-menu", handleOpenMenu);
    };
  }, []);

  // 2. Route change effect: close mobile drawer on navigation
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsOpen(false);
  }, [pathname]);

  // 3. Body scroll lock effect when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full pt-[env(safe-area-inset-top,0px)] transition-all duration-300 ${
          scrolled
            ? "border-b border-border/60 bg-background/80 backdrop-blur-xl shadow-xs"
            : "border-b border-transparent bg-background/60 backdrop-blur-md"
        }`}
      >
        <div className="mx-auto flex h-14 min-[992px]:h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            href={isAdminMode ? "/admin" : "/"}
            className="flex items-center space-x-2 group shrink-0"
            onClick={() => setIsOpen(false)}
          >
            <div className="relative shrink-0">
              <Image
                src="/images/member-card-logo.png"
                alt="Health Club Logo"
                width={36}
                height={36}
                priority
                style={{ width: "auto", height: "auto" }}
                className="h-8 w-8 sm:h-9 sm:w-9 object-contain drop-shadow-[0_2px_8px_rgba(34,197,94,0.3)] transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <span className="font-heading text-lg sm:text-xl font-bold tracking-tight text-secondary dark:text-white">
              {t("layout.header.health")}{" "}
              <span className="gradient-text">{t("layout.header.club")}</span>
            </span>
          </Link>

          {/* Desktop Navigation — Context-Aware (Admin vs Public) */}
          {isAdminMode ? <AdminHeaderNav /> : <PublicHeaderNav />}

          {/* Desktop Actions */}
          <div className="hidden min-[992px]:flex items-center space-x-2 shrink-0">
            {/* Utility Control Group (View Site, Notifications, Language, Theme) */}
            <div className="flex items-center p-1 rounded-xl bg-muted/50 dark:bg-muted/30 border border-border/60 shadow-2xs gap-0.5">
              {/* View Public Website (Shown when in Admin Mode) */}
              {isAdminMode && (
                <Link
                  href="/"
                  className="inline-flex items-center justify-center size-8 rounded-lg text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-background/80 transition-all"
                  title={t("admin.nav.viewSite") || "পাবলিক ওয়েবসাইট দেখুন"}
                  aria-label={t("admin.nav.viewSite") || "পাবলিক ওয়েবসাইট দেখুন"}
                >
                  <Globe className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </Link>
              )}

              {/* Admin Notification Bell (Shown when in Admin Mode) */}
              {isAdminMode && <AdminNotificationBell />}

              {/* Member Notification Bell (Shown when logged in as member in public/dashboard mode) */}
              {!isAdminMode && user && <MemberNotificationBell />}

              {/* Language Switcher Button */}
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => setLocale(locale === "bn" ? "en" : "bn")}
                className="size-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-background/80 transition-all"
                aria-label={locale === "bn" ? "Switch to English" : "বাংলায় পরিবর্তন করুন"}
                title={locale === "bn" ? "English" : "বাংলা"}
              >
                <Languages className="h-4 w-4" />
              </Button>

              {/* Theme Toggle Button */}
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={toggleTheme}
                className="size-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-background/80 transition-all"
                aria-label="Toggle Theme"
                title={theme === "light" ? "Dark Mode" : "Light Mode"}
              >
                {theme === "light" ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4 text-amber-400" />
                )}
              </Button>
            </div>

            {user ? (
              <UserDropdown user={user} />
            ) : partner ? (
              <PartnerDropdown partner={partner} />
            ) : (
              <>
                <Link
                  href="/login"
                  className={buttonVariants({
                    variant: "ghost",
                    size: "sm",
                    className: "text-muted-foreground hover:text-foreground rounded-xl font-semibold",
                  })}
                >
                  {t("layout.header.login")}
                </Link>
                <Link
                  href="/register"
                  className={buttonVariants({
                    size: "sm",
                    className: "rounded-xl font-bold",
                  })}
                >
                  {t("layout.header.becomeMember")}
                </Link>
              </>
            )}
          </div>

          {/* Mobile Actions & Hamburger Toggle */}
          <div className="flex min-[992px]:hidden items-center space-x-1">
            {isAdminMode && (
              <div className="mr-0.5">
                <AdminNotificationBell />
              </div>
            )}
            {!isAdminMode && user && (
              <div className="mr-0.5">
                <MemberNotificationBell />
              </div>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/30 transition-colors"
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

      {/* Mobile Menu Drawer */}
      <MobileNavDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        user={user}
        partner={partner}
      />
    </>
  );
}
