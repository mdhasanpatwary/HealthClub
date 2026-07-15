"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogOut, Heart, Globe, Sun, Moon, Settings, LayoutDashboard } from "lucide-react";
import Image from "next/image";
import { dbStore } from "@/services/dbStore";
import { Member } from "@/services/db";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { useTheme } from "@/components/layout/ThemeProvider";
import UserDropdown from "./UserDropdown";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<Member | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { locale, setLocale, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(dbStore.getCurrentUser());
  }, [pathname]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsOpen(false);
  }, [pathname]);

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
    setUser(null);
    setIsOpen(false);
    router.push("/");
  };

  const navLinks = [
    { name: t("layout.header.home"), path: "/" },
    { name: t("layout.header.benefits"), path: "/#benefits" },
    { name: t("layout.header.partnerHospitals"), path: "/partner-hospitals" },
    { name: t("layout.header.membershipPlans"), path: "/membership" },
    { name: t("layout.header.aboutUs"), path: "/about-us" },
    { name: t("layout.header.contact"), path: "/contact" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    if (path.startsWith("/#")) return false;
    return pathname.startsWith(path);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 text-primary"
            onClick={() => setIsOpen(false)}
          >
            <Heart className="h-6 w-6 fill-primary" />
            <span className="font-heading text-xl font-bold tracking-tight text-secondary dark:text-white">
              {t("layout.header.health")} <span className="text-primary">{t("layout.header.club")}</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? "bg-primary-light/50 text-primary dark:bg-primary-dark/20"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Language Switcher Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocale(locale === "bn" ? "en" : "bn")}
              className="gap-1.5 text-muted-foreground hover:text-foreground h-9 px-3"
            >
              <Globe className="h-4 w-4" />
              <span className="text-xs font-semibold">{locale === "bn" ? "English" : "বাংলা"}</span>
            </Button>

            {/* Theme Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9 text-muted-foreground hover:text-foreground"
              aria-label="Toggle Theme"
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4 text-amber-500" />
              )}
            </Button>

            {user ? (
              <UserDropdown user={user} />
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">{t("layout.header.login")}</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary-dark">
                    {t("layout.header.becomeMember")}
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex md:hidden items-center space-x-2">
            {/* Quick language switcher on Mobile header to improve accessibility */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocale(locale === "bn" ? "en" : "bn")}
              className="h-9 w-9 text-muted-foreground hover:text-foreground"
              aria-label="Change Language"
            >
              <Globe className="h-4 w-4" />
            </Button>

            {/* Quick theme switcher on Mobile header */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9 text-muted-foreground hover:text-foreground"
              aria-label="Toggle Theme"
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4 text-amber-500" />
              )}
            </Button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
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

        {/* Mobile Dropdown */}
        <div
          id="mobile-menu"
          className={`md:hidden border-b border-border bg-background overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
          }`}
        >
          <div className="px-3 pt-2 pb-1 space-y-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center rounded-lg px-3 py-3 text-base font-medium transition-colors ${
                  isActive(link.path)
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="border-t border-border mx-3 pt-3 pb-4 space-y-2">
            {/* Mobile Language Switcher Section */}
            <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-2">
              <span className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                <Globe className="h-4 w-4" />
                {t("layout.header.changeLanguage")}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLocale(locale === "bn" ? "en" : "bn")}
                className="text-xs h-8 border-border px-3 gap-1"
              >
                <span>{locale === "bn" ? "English" : "বাংলা"}</span>
              </Button>
            </div>

            {/* Mobile Theme Switcher Section */}
            <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-2">
              <span className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4 text-amber-500" />}
                {t("layout.header.darkMode")}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                className="text-xs h-8 border-border px-3"
              >
                <span>{theme === "light" ? t("layout.header.enable") : t("layout.header.disable")}</span>
              </Button>
            </div>

            {user ? (
              <>
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2 pb-2 border-b border-border/60">
                  {user.profilePictureUrl ? (
                    <Image
                      src={user.profilePictureUrl}
                      alt={user.name}
                      width={32}
                      height={32}
                      unoptimized
                      className="h-8 w-8 rounded-full object-cover border border-border shrink-0"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase shrink-0 border border-primary/20">
                      {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                  )}
                  <span className="truncate">{user.name}</span>
                </div>
                {user.email === "healthclubfeni@gmail.com" ? (
                  <Link href="/admin" className="block w-full" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full justify-start gap-2 border-primary text-primary">
                      <LayoutDashboard className="h-4 w-4" />
                      {t("layout.header.adminPanel")}
                    </Button>
                  </Link>
                ) : (
                  <Link href="/dashboard" className="block w-full" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full justify-start gap-2 border-primary text-primary">
                      <LayoutDashboard className="h-4 w-4" />
                      {t("layout.header.dashboard")}
                    </Button>
                  </Link>
                )}
                <Link href="/profile" className="block w-full" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full justify-start gap-2 border-primary text-primary">
                    <Settings className="h-4 w-4" />
                    {t("profile.page.profileSettings")}
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="w-full justify-start gap-2 text-destructive hover:bg-destructive/10"
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
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary-dark">
                    {t("layout.header.becomeMember")}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 md:hidden backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />
    </>
  );
}
