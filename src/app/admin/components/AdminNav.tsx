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
  Star,
  Siren,
  Newspaper,
  BookOpen,
  Radio,
  Bell,
  Mail,
  Smartphone,
  UploadCloud,
  Settings,
  ShieldCheck,
} from "lucide-react";
export interface AdminNavLink {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const ADMIN_NAV_LINKS: AdminNavLink[] = [
  {
    href: "/admin",
    label: "ড্যাশবোর্ড",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/members",
    label: "সদস্য তালিকা",
    icon: Users,
  },
  {
    href: "/admin/renewals",
    label: "নবায়ন আবেদন",
    icon: RotateCcw,
  },
  {
    href: "/admin/transactions",
    label: "লেনদেন লগ",
    icon: Receipt,
  },
  {
    href: "/admin/analytics",
    label: "রাজস্ব অ্যানালিটিক্স",
    icon: TrendingUp,
  },
  {
    href: "/admin/doctors",
    label: "ডাক্তার তালিকা",
    icon: Stethoscope,
  },
  {
    href: "/admin/partners",
    label: "পার্টনার নেটওয়ার্ক",
    icon: Building2,
  },
  {
    href: "/admin/partner-requests",
    label: "অংশীদার আবেদন",
    icon: FileCheck,
  },
  {
    href: "/admin/reviews",
    label: "রিভিউ ও রেটিং",
    icon: Star,
  },
  {
    href: "/admin/emergency",
    label: "জরুরি সেবা",
    icon: Siren,
  },
  {
    href: "/admin/blogs",
    label: "ব্লগ পোস্ট",
    icon: Newspaper,
  },
  {
    href: "/admin/health-tips",
    label: "স্বাস্থ্য টিপস",
    icon: BookOpen,
  },
  {
    href: "/admin/broadcast",
    label: "ব্রডকাস্ট",
    icon: Radio,
  },
  {
    href: "/admin/notifications",
    label: "বিজ্ঞপ্তি",
    icon: Bell,
  },
  {
    href: "/admin/messages",
    label: "বার্তা",
    icon: Mail,
  },
  {
    href: "/admin/pwa",
    label: "PWA অ্যানালিটিক্স",
    icon: Smartphone,
  },
  {
    href: "/admin/import",
    label: "বাল্ক ইম্পোর্ট",
    icon: UploadCloud,
  },
  {
    href: "/admin/staff",
    label: "এডমিন ও স্টাফ",
    icon: ShieldCheck,
  },
  {
    href: "/admin/settings",
    label: "সেটিংস",
    icon: Settings,
  },
];

export function AdminNav() {
  const pathname = usePathname();

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
            <span>{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
