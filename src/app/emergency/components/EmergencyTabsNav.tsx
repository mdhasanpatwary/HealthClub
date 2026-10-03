"use client";

import Link from "next/link";
import { Heart, Truck, PhoneForwarded, LayoutGrid } from "lucide-react";

export type EmergencyTabKey = "overview" | "donors" | "ambulances" | "hotlines";

interface EmergencyTabsNavProps {
  activeTab: EmergencyTabKey;
}

export function EmergencyTabsNav({ activeTab }: EmergencyTabsNavProps) {
  const tabs = [
    {
      id: "overview" as const,
      label: "সব জরুরি সেবা",
      href: "/emergency",
      icon: LayoutGrid,
      activeColor: "text-foreground bg-background shadow-xs ring-1 ring-border/50",
      iconColor: "text-primary",
    },
    {
      id: "donors" as const,
      label: "রক্তদাতা ডিরেক্টরি",
      href: "/emergency/blood-donors",
      icon: Heart,
      activeColor: "text-rose-600 dark:text-rose-400 bg-background shadow-xs ring-1 ring-rose-500/20",
      iconColor: "text-rose-600 fill-rose-500/20",
    },
    {
      id: "ambulances" as const,
      label: "২৪/৭ অ্যাম্বুলেন্স",
      href: "/emergency/ambulances",
      icon: Truck,
      activeColor: "text-primary bg-background shadow-xs ring-1 ring-primary/20",
      iconColor: "text-primary",
    },
    {
      id: "hotlines" as const,
      label: "জরুরি হটলাইন",
      href: "/emergency/hotlines",
      icon: PhoneForwarded,
      activeColor: "text-amber-600 dark:text-amber-400 bg-background shadow-xs ring-1 ring-amber-500/20",
      iconColor: "text-amber-600",
    },
  ];

  return (
    <nav aria-label="জরুরি সেবা নেভিগেশন ট্যাব" className="w-full">
      <div className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1.5 p-1.5 bg-muted/80 backdrop-blur-xs rounded-2xl border border-border/60">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.id}
              href={tab.href}
              prefetch={true}
              aria-current={isActive ? "page" : undefined}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all text-center ${
                isActive
                  ? tab.activeColor
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
              }`}
            >
              <Icon className={`h-4 w-4 shrink-0 ${isActive ? tab.iconColor : "text-muted-foreground"}`} />
              <span className="truncate">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
