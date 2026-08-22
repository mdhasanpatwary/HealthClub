"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Siren, Calculator, BookOpen } from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function PublicHeaderNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  const isServicesActive =
    isActive("/emergency") || isActive("/health-tools") || isActive("/health-tips");

  return (
    <nav aria-label="Main Navigation" className="hidden min-[992px]:flex items-center space-x-1">
      {/* 1. Home */}
      <Link
        href="/"
        aria-current={isActive("/") ? "page" : undefined}
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
        aria-current={isActive("/consultants") ? "page" : undefined}
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
        aria-current={isActive("/partner-hospitals") ? "page" : undefined}
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
          className={`relative inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 outline-hidden cursor-pointer select-none ${
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
          <DropdownMenuItem className="p-0 rounded-xl focus:bg-transparent cursor-pointer focus:outline-hidden">
            <Link
              href="/emergency"
              aria-current={isActive("/emergency") ? "page" : undefined}
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

          <DropdownMenuItem className="p-0 rounded-xl focus:bg-transparent cursor-pointer focus:outline-hidden">
            <Link
              href="/health-tools"
              aria-current={isActive("/health-tools") ? "page" : undefined}
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

          <DropdownMenuItem className="p-0 rounded-xl focus:bg-transparent cursor-pointer focus:outline-hidden">
            <Link
              href="/health-tips"
              aria-current={isActive("/health-tips") ? "page" : undefined}
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
        aria-current={isActive("/membership") ? "page" : undefined}
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
        aria-current={isActive("/contact") ? "page" : undefined}
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
  );
}
