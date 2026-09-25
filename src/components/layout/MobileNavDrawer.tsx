"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  X,
  Sun,
  Moon,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { Member, Partner } from "@/services/db";
import { authStore } from "@/services/authStore";
import { Button, buttonVariants } from "@/components/ui/button";
import { useTheme } from "@/components/layout/ThemeProvider";
import { useAdminCounts } from "@/app/admin/hooks/useAdminCounts";
import { isAdminUser } from "@/lib/permissions";
import { MobileNavAdminLinks } from "./MobileNavAdminLinks";
import { MobileNavPublicLinks } from "./MobileNavPublicLinks";

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
  const { theme, toggleTheme } = useTheme();
  const {
    doctorsCount,
    pendingPartnerRequests,
    pendingRenewals,
    contactMessagesCount,
  } = useAdminCounts();

  const isAdminMode = pathname.startsWith("/admin");

  const handleLogout = () => {
    authStore.logout();
    onClose();
    router.push("/");
  };

  const handlePartnerLogout = () => {
    authStore.logoutPartner();
    onClose();
    router.push("/");
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Mobile Drawer */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation Menu"
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
              src="/images/member-card-logo.webp"
              alt="Health Club Logo"
              width={32}
              height={32}
              sizes="32px"
              loading="lazy"
              className="h-8 w-8 object-contain drop-shadow-[0_2px_8px_rgba(34,197,94,0.3)] shrink-0"
            />
            <span className="font-heading text-lg font-bold tracking-tight text-secondary dark:text-white">
              হেলথ{" "}
              <span className="gradient-text">ক্লাব</span>
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
            <MobileNavAdminLinks
              pathname={pathname}
              onClose={onClose}
              doctorsCount={doctorsCount}
              pendingPartnerRequests={pendingPartnerRequests}
              pendingRenewals={pendingRenewals}
              contactMessagesCount={contactMessagesCount}
            />
          ) : (
            <MobileNavPublicLinks
              pathname={pathname}
              onClose={onClose}
            />
          )}

          {/* Footer controls: Theme & Auth */}
          <div className="border-t border-border/60 pt-4 space-y-3">
            {/* Theme Switcher */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                {theme === "light" ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4 text-amber-400" />
                )}
                ডার্ক মোড
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                className="text-xs h-8 border-border px-3 rounded-lg font-bold"
              >
                <span>
                  {theme === "light" ? "চালু করুন" : "বন্ধ করুন"}
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
                {isAdminUser(user) ? (
                  <Link
                    href="/admin"
                    onClick={onClose}
                    className={buttonVariants({
                      variant: "outline",
                      className: "w-full justify-start text-xs border-primary/30 text-primary",
                    })}
                  >
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    <span>এডমিন প্যানেল</span>
                  </Link>
                ) : (
                  <Link
                    href="/dashboard"
                    onClick={onClose}
                    className={buttonVariants({
                      variant: "outline",
                      className: "w-full justify-start text-xs border-primary/30 text-primary",
                    })}
                  >
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    <span>ড্যাশবোর্ড</span>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="w-full justify-start text-xs text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  লগআউট
                </Button>
              </div>
            ) : partner ? (
              <div className="pt-2 border-t border-border/60 space-y-2">
                <Link
                  href="/partner/dashboard"
                  onClick={onClose}
                  className={buttonVariants({
                    variant: "outline",
                    className: "w-full justify-start text-xs border-emerald-500/30 text-emerald-600",
                  })}
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  <span>ড্যাশবোর্ড</span>
                </Link>
                <Button
                  variant="ghost"
                  onClick={handlePartnerLogout}
                  className="w-full justify-start text-xs text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  লগআউট
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/60">
                <Link
                  href="/login"
                  onClick={onClose}
                  className={buttonVariants({
                    variant: "outline",
                    className: "w-full text-xs font-semibold",
                  })}
                >
                  লগইন
                </Link>
                <Link
                  href="/register"
                  onClick={onClose}
                  className={buttonVariants({
                    className: "w-full text-xs font-bold",
                  })}
                >
                  সদস্য হোন
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
