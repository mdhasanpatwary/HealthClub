"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogOut, Globe, Sun, Moon, Settings, LayoutDashboard } from "lucide-react";
import Image from "next/image";
import { dbStore } from "@/services/dbStore";
import { Member, Partner } from "@/services/db";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { useTheme } from "@/components/layout/ThemeProvider";
import UserDropdown from "./UserDropdown";
import PartnerDropdown from "./PartnerDropdown";

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
      // Guard: only update state when value actually changes to avoid excess re-renders
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
    router.push("/");
  };

  const navLinks = [
    { name: t("layout.header.home"), path: "/" },
    { name: t("layout.header.partnerHospitals"), path: "/partner-hospitals" },
    { name: t("layout.header.membershipPlans"), path: "/membership" },
    { name: t("layout.header.aboutUs"), path: "/about-us" },
    { name: t("layout.header.contact"), path: "/contact" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full pt-[env(safe-area-inset-top,0px)] transition-all duration-300 ${scrolled
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
                className="h-8 w-78sm:h-9 sm:w-9 object-contain drop-shadow-[0_2px_8px_rgba(34,197,94,0.3)] transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <span className="font-heading text-lg sm:text-xl font-bold tracking-tight text-secondary dark:text-white">
              {t("layout.header.health")}{" "}
              <span className="gradient-text">{t("layout.header.club")}</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden min-[992px]:flex space-x-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${isActive(link.path)
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <span className="absolute bottom-1 left-3 right-3 h-0.5 rounded-full bg-primary animate-scale-in" />
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop Buttons */}
          <div className="hidden min-[992px]:flex items-center space-x-2">
            {/* Language Switcher Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocale(locale === "bn" ? "en" : "bn")}
            >
              <Globe className="h-4 w-4" />
              <span className="text-xs font-semibold">{locale === "bn" ? "English" : "বাংলা"}</span>
            </Button>

            {/* Theme Toggle Button */}
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={toggleTheme}
              className="text-muted-foreground hover:text-foreground"
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
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {t("layout.header.login")}
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    size="sm"
                  >
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
                  className={`absolute inset-0 h-6 w-6 transition-all duration-200 ${isOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-75"
                    }`}
                />
                <Menu
                  className={`absolute inset-0 h-6 w-6 transition-all duration-200 ${isOpen ? "opacity-0 -rotate-90 scale-75" : "opacity-100 rotate-0 scale-100"
                    }`}
                />
              </div>
            </button>
          </div>
        </div>

      </header>

      {/* Mobile Menu — fixed full-screen overlay */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-50 min-[992px]:hidden flex flex-col bg-background/98 backdrop-blur-xl transition-all duration-300 ease-in-out ${isOpen
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
        aria-hidden={!isOpen}
      >
        {/* Menu Header */}
        <div className="flex items-center justify-between px-4 h-13 min-[992px]:h-16 border-b border-border/60 shrink-0">
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
            className="inline-flex items-center justify-center rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-3 pt-3 pb-1 space-y-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center rounded-xl px-3 py-3 text-base font-medium transition-colors ${isActive(link.path)
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="border-t border-border/60 mx-3 pt-3 pb-6 space-y-2">
            {/* Language Switcher */}
            <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-2">
              <span className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                <Globe className="h-4 w-4" />
                {t("layout.header.changeLanguage")}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLocale(locale === "bn" ? "en" : "bn")}
                className="text-xs h-8 border-border px-3 gap-1 rounded-lg"
              >
                <span>{locale === "bn" ? "English" : "বাংলা"}</span>
              </Button>
            </div>

            {/* Theme Switcher */}
            <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-2">
              <span className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4 text-amber-400" />}
                {t("layout.header.darkMode")}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                className="text-xs h-8 border-border px-3 rounded-lg"
              >
                <span>{theme === "light" ? t("layout.header.enable") : t("layout.header.disable")}</span>
              </Button>
            </div>

            {user ? (
              <>
                <div className="flex items-center gap-2.5 text-sm font-semibold text-foreground mb-2 pb-2 border-b border-border/60">
                  {user.profilePictureUrl ? (
                    <Image
                      src={user.profilePictureUrl}
                      alt={user.name}
                      width={36}
                      height={36}
                      unoptimized
                      className="h-9 w-9 rounded-xl object-cover object-left-top border border-border shrink-0"
                    />
                  ) : (
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 text-primary flex items-center justify-center font-bold text-sm uppercase shrink-0 border border-primary/20">
                      {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                  )}
                  <span className="truncate">{user.name}</span>
                </div>
                {user.email === "healthclubfeni@gmail.com" ? (
                  <Link href="/admin" className="block w-full" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full justify-start border-primary/30 text-primary hover:bg-primary/5">
                      <LayoutDashboard className="h-4 w-4" />
                      {t("layout.header.adminPanel")}
                    </Button>
                  </Link>
                ) : (
                  <Link href="/dashboard" className="block w-full" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full justify-start border-primary/30 text-primary hover:bg-primary/5">
                      <LayoutDashboard className="h-4 w-4" />
                      {t("layout.header.dashboard")}
                    </Button>
                  </Link>
                )}
                <Link href="/profile" className="block w-full" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full justify-start border-primary/30 text-primary hover:bg-primary/5">
                    <Settings className="h-4 w-4" />
                    {t("profile.page.profileSettings")}
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="w-full justify-start text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4" />
                  {t("layout.header.logout")}
                </Button>
              </>
            ) : partner ? (
              <>
                <div className="flex items-center gap-2.5 text-sm font-semibold text-foreground mb-2 pb-2 border-b border-border/60">
                  {partner.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={partner.imageUrl}
                      alt={partner.name}
                      width={36}
                      height={36}
                      className="h-9 w-9 rounded-xl object-cover object-left-top border border-border shrink-0"
                    />
                  ) : (
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-sm uppercase shrink-0 border border-emerald-500/20">
                      {partner.name ? partner.name.charAt(0).toUpperCase() : "P"}
                    </div>
                  )}
                  <span className="truncate">{partner.name}</span>
                </div>
                <Link href="/partner/dashboard" className="block w-full" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full justify-start border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/5">
                    <LayoutDashboard className="h-4 w-4" />
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
                  className="w-full justify-start text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4" />
                  {t("layout.header.logout")}
                </Button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full">{t("layout.header.login")}</Button>
                </Link>
                <Link href="/register" onClick={() => setIsOpen(false)}>
                  <Button className="w-full">
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
        className={`fixed inset-0 z-40 bg-black/40 md:hidden backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />
    </>
  );
}
