"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  Stethoscope,
  Receipt,
  FileCheck,
  RotateCcw,
  Mail,
} from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { formatNum } from "@/lib/i18n";
import { useAdminCounts } from "../hooks/useAdminCounts";

export function AdminNav() {
  const pathname = usePathname();
  const { t, locale } = useLanguage();
  const {
    doctorsCount,
    pendingPartnerRequests,
    pendingRenewals,
    contactMessagesCount,
  } = useAdminCounts();

  const navItems = [
    {
      label: locale === "bn" ? "ড্যাশবোর্ড" : "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      isActive: pathname === "/admin",
      badge: null,
      badgeVariant: "default",
    },
    {
      label: t("admin.dashboard.membersList") || "সদস্য তালিকা",
      href: "/admin/members",
      icon: Users,
      isActive: pathname.startsWith("/admin/members"),
      badge: null,
      badgeVariant: "default",
    },
    {
      label: t("admin.dashboard.partnerHospitals") || "পার্টনার হাসপাতাল",
      href: "/admin/partners",
      icon: Building2,
      isActive: pathname.startsWith("/admin/partners"),
      badge: null,
      badgeVariant: "default",
    },
    {
      label: locale === "bn" ? "ডাক্তার তালিকা" : "Doctors",
      href: "/admin/doctors",
      icon: Stethoscope,
      isActive: pathname.startsWith("/admin/doctors"),
      badge: doctorsCount,
      badgeVariant: "neutral",
    },
    {
      label: t("admin.dashboard.transactionLog") || "লেনদেন লগ",
      href: "/admin/transactions",
      icon: Receipt,
      isActive: pathname.startsWith("/admin/transactions"),
      badge: null,
      badgeVariant: "default",
    },
    {
      label: locale === "bn" ? "অংশীদার আবেদন" : "Partner Requests",
      href: "/admin/partner-requests",
      icon: FileCheck,
      isActive: pathname.startsWith("/admin/partner-requests"),
      badge: pendingPartnerRequests,
      badgeVariant: pendingPartnerRequests > 0 ? "warning" : "neutral",
    },
    {
      label: locale === "bn" ? "নবায়ন আবেদন" : "Renewals",
      href: "/admin/renewals",
      icon: RotateCcw,
      isActive: pathname.startsWith("/admin/renewals"),
      badge: pendingRenewals,
      badgeVariant: pendingRenewals > 0 ? "warning" : "neutral",
    },
    {
      label: t("admin.dashboard.contactMessages") || "যোগাযোগের বার্তা",
      href: "/admin/messages",
      icon: Mail,
      isActive: pathname.startsWith("/admin/messages"),
      badge: contactMessagesCount,
      badgeVariant: contactMessagesCount > 0 ? "accent" : "neutral",
    },
  ];

  return (
    <div className="w-full bg-background dark:bg-slate-900 border border-border rounded-2xl p-1.5 shadow-xs">
      <nav
        aria-label="Admin Navigation Tabs"
        className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5 px-0.5"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.isActive;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 shrink-0 ${
                active
                  ? "bg-primary text-white shadow-sm font-bold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
              }`}
            >
              <Icon className={`h-3.5 w-3.5 shrink-0 ${active ? "text-white" : "text-muted-foreground"}`} />
              <span>{item.label}</span>

              {item.badge !== null && (
                <span
                  className={`text-[11px] font-mono px-1.5 py-0.2 rounded-full font-bold transition-colors ${
                    active
                      ? "bg-white/20 text-white"
                      : item.badgeVariant === "warning" && (item.badge ?? 0) > 0
                      ? "bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30"
                      : item.badgeVariant === "accent" && (item.badge ?? 0) > 0
                      ? "bg-primary/15 text-primary border border-primary/20"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  ({formatNum(item.badge, locale)})
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
