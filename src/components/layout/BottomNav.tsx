"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Building2, CreditCard, User, Menu, X, ArrowUpRight } from "lucide-react";
import { dbStore } from "@/services/dbStore";
import { Member, Partner } from "@/services/db";
import { useLanguage } from "@/components/layout/LanguageProvider";
import MemberCard from "@/components/ui/MemberCard";
import { Button } from "@/components/ui/button";

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [user, setUser] = useState<Member | null>(null);
  const [partner, setPartner] = useState<Partner | null>(null);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);

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

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  const getCardPath = () => {
    if (user) return "/dashboard";
    if (partner) return "/partner/dashboard";
    return "/membership";
  };

  const getProfilePath = () => {
    if (user) return "/dashboard?tab=profile";
    if (partner) return "/partner/dashboard";
    return "/login";
  };

  const isCardActive = isActive("/dashboard") || isActive("/partner/dashboard") || isActive("/membership");
  const isProfileActive = isActive("/profile") || (pathname === "/login" && !user && !partner);

  const handleCardClick = (e: React.MouseEvent) => {
    if (user) {
      e.preventDefault();
      setIsCardModalOpen(true);
    }
  };

  const handleOpenMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("open-mobile-menu"));
  };

  return (
    <>
      <aside
        aria-label="Mobile Bottom Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 min-[992px]:hidden bg-background/95 backdrop-blur-xl border-t border-border/80 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] transition-all duration-300"
      >
        <div className="mx-auto flex h-16 max-w-md items-center justify-around px-2 pb-[env(safe-area-inset-bottom,0px)]">
          {/* 1. Home Tab */}
          <Link
            href="/"
            className={`flex flex-1 flex-col items-center justify-center py-1 touch-active transition-colors ${
              isActive("/") && !isCardActive && !isProfileActive
                ? "text-primary font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <div className="relative">
              <Home className="h-5 w-5 stroke-[2.2]" />
              {isActive("/") && !isCardActive && !isProfileActive && (
                <span className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary" />
              )}
            </div>
            <span className="mt-1 text-[10px] tracking-tight">
              {t("layout.bottomNav.home")}
            </span>
          </Link>

          {/* 2. Partner Hospitals Tab */}
          <Link
            href="/partner-hospitals"
            className={`flex flex-1 flex-col items-center justify-center py-1 touch-active transition-colors ${
              isActive("/partner-hospitals")
                ? "text-primary font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <div className="relative">
              <Building2 className="h-5 w-5 stroke-[2.2]" />
              {isActive("/partner-hospitals") && (
                <span className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary" />
              )}
            </div>
            <span className="mt-1 text-[10px] tracking-tight">
              {t("layout.bottomNav.hospitals")}
            </span>
          </Link>

          {/* 3. Central Digital Card Highlight Button */}
          <Link
            href={getCardPath()}
            onClick={handleCardClick}
            className="flex flex-1 flex-col items-center justify-center -mt-4 touch-active group"
          >
            <div
              className={`relative flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg transition-all duration-300 ${
                isCardActive || isCardModalOpen
                  ? "bg-gradient-to-br from-primary to-primary-dark text-white ring-4 ring-primary/20 scale-105 shadow-primary"
                  : "bg-primary text-white hover:bg-primary-dark shadow-emerald-500/20"
              }`}
            >
              <CreditCard className="h-6 w-6 stroke-[2.2]" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
              </span>
            </div>
            <span
              className={`mt-1 text-[10px] font-semibold tracking-tight ${
                isCardActive || isCardModalOpen ? "text-primary" : "text-foreground"
              }`}
            >
              {t("layout.bottomNav.card")}
            </span>
          </Link>

          {/* 4. Profile / Account Tab */}
          <Link
            href={getProfilePath()}
            className={`flex flex-1 flex-col items-center justify-center py-1 touch-active transition-colors ${
              isProfileActive && !isCardActive
                ? "text-primary font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <div className="relative">
              <User className="h-5 w-5 stroke-[2.2]" />
              {isProfileActive && !isCardActive && (
                <span className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary" />
              )}
            </div>
            <span className="mt-1 text-[10px] tracking-tight">
              {t("layout.bottomNav.profile")}
            </span>
          </Link>

          {/* 5. Menu Tab */}
          <button
            onClick={handleOpenMenu}
            className="flex flex-1 flex-col items-center justify-center py-1 text-muted-foreground hover:text-foreground touch-active transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5 stroke-[2.2]" />
            <span className="mt-1 text-[10px] tracking-tight">
              {t("layout.bottomNav.menu")}
            </span>
          </button>
        </div>
      </aside>

      {/* Quick Digital Card Bottom Sheet Modal */}
      {isCardModalOpen && user && (
        <div className="fixed inset-0 z-50 flex items-end justify-center min-[992px]:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsCardModalOpen(false)}
          />

          {/* Bottom Sheet Drawer */}
          <div className="relative w-full max-w-lg bg-background dark:bg-slate-900 border-t border-border rounded-t-3xl p-4 sm:p-6 shadow-2xl z-10 animate-in slide-in-from-bottom-6 duration-300 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]">
            {/* Handle bar */}
            <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full mx-auto mb-4" />

            {/* Sheet Header */}
            <div className="flex items-center justify-between mb-3 px-1">
              <div>
                <h3 className="font-heading text-lg font-bold text-foreground">
                  {t("layout.bottomNav.card")}
                </h3>
                <p className="text-xs text-muted-foreground">
                  হাসপাতালে ডিসকাউন্টের জন্য এই কিউআর কোডটি দেখান
                </p>
              </div>
              <button
                onClick={() => setIsCardModalOpen(false)}
                className="p-1.5 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Render Digital Member Card */}
            <div className="py-2">
              <MemberCard member={user} />
            </div>

            {/* Actions */}
            <div className="mt-4 flex items-center gap-3">
              <Link
                href="/dashboard"
                onClick={() => setIsCardModalOpen(false)}
                className="flex-1"
              >
                <Button className="w-full bg-primary hover:bg-primary-dark text-white font-semibold gap-1.5 shadow-md">
                  <span>{t("layout.header.dashboard")}</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => setIsCardModalOpen(false)}
                className="px-5 border-border"
              >
                {t("admin.dashboard.closeButton")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
