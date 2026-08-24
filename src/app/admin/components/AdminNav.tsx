"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  RotateCcw,
  Receipt,
  TrendingUp,
  Stethoscope,
  Building2,
  FileCheck,
  Siren,
  BookOpen,
  Radio,
  Bell,
  Mail,
  Smartphone,
  Settings,
} from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";

export interface AdminNavLink {
  href: string;
  labelBn: string;
  labelEn: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const ADMIN_NAV_LINKS: AdminNavLink[] = [
  {
    href: "/admin",
    labelBn: "ড্যাশবোর্ড",
    labelEn: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/members",
    labelBn: "সদস্য তালিকা",
    labelEn: "Members",
    icon: Users,
  },
  {
    href: "/admin/renewals",
    labelBn: "নবায়ন আবেদন",
    labelEn: "Renewals",
    icon: RotateCcw,
  },
  {
    href: "/admin/transactions",
    labelBn: "লেনদেন লগ",
    labelEn: "Transactions",
    icon: Receipt,
  },
  {
    href: "/admin/analytics",
    labelBn: "রাজস্ব অ্যানালিটিক্স",
    labelEn: "Revenue Analytics",
    icon: TrendingUp,
  },
  {
    href: "/admin/doctors",
    labelBn: "ডাক্তার তালিকা",
    labelEn: "Doctors",
    icon: Stethoscope,
  },
  {
    href: "/admin/partners",
    labelBn: "পার্টনার নেটওয়ার্ক",
    labelEn: "Partners",
    icon: Building2,
  },
  {
    href: "/admin/partner-requests",
    labelBn: "অংশীদার আবেদন",
    labelEn: "Partner Requests",
    icon: FileCheck,
  },
  {
    href: "/admin/emergency",
    labelBn: "জরুরি সেবা",
    labelEn: "Emergency",
    icon: Siren,
  },
  {
    href: "/admin/health-tips",
    labelBn: "স্বাস্থ্য টিপস",
    labelEn: "Health Tips",
    icon: BookOpen,
  },
  {
    href: "/admin/broadcast",
    labelBn: "ব্রডকাস্ট",
    labelEn: "Broadcast",
    icon: Radio,
  },
  {
    href: "/admin/notifications",
    labelBn: "বিজ্ঞপ্তি",
    labelEn: "Notifications",
    icon: Bell,
  },
  {
    href: "/admin/messages",
    labelBn: "বার্তা",
    labelEn: "Messages",
    icon: Mail,
  },
  {
    href: "/admin/pwa",
    labelBn: "PWA অ্যানালিটিক্স",
    labelEn: "PWA",
    icon: Smartphone,
  },
  {
    href: "/admin/settings",
    labelBn: "সেটিংস",
    labelEn: "Settings",
    icon: Settings,
  },
];

export function AdminNav() {
  const pathname = usePathname();
  const { locale } = useLanguage();
  const isBn = locale === "bn";

  return (
    <nav className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
      {ADMIN_NAV_LINKS.map((link) => {
        const Icon = link.icon;
        const isActive =
          link.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              isActive
                ? "bg-primary text-white shadow-xs"
                : "bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" />
            <span>{isBn ? link.labelBn : link.labelEn}</span>
          </Link>
        );
      })}
    </nav>
  );
}
