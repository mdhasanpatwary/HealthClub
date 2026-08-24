"use client";

import { useMemo } from "react";
import { AlertCircle, CalendarOff } from "lucide-react";
import { Doctor } from "@/services/db";

interface DoctorAvailabilityBadgeProps {
  doctor: Doctor;
  locale?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export type DoctorAvailabilityStatus = "available_today" | "closed_today" | "on_leave";

export interface DoctorAvailabilityInfo {
  status: DoctorAvailabilityStatus;
  label: string;
  badgeClass: string;
  dotClass: string;
  formattedLeaveDate?: string;
}

function formatLeaveDate(dateStr: string, isEn: boolean): string {
  try {
    const d = new Date(dateStr.includes("T") ? dateStr : `${dateStr}T00:00:00`);
    if (isNaN(d.getTime())) return dateStr;
    if (isEn) {
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    }
    return d.toLocaleDateString("bn-BD", { month: "long", day: "numeric", year: "numeric" });
  } catch {
    return dateStr;
  }
}

export function getDoctorAvailabilityInfo(
  doctor: Pick<Doctor, "availableToday" | "onLeaveUntil">,
  locale = "bn"
): DoctorAvailabilityInfo {
  const isEn = locale === "en";
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  if (doctor.onLeaveUntil) {
    const rawDate = typeof doctor.onLeaveUntil === "string" ? doctor.onLeaveUntil.slice(0, 10) : "";
    if (rawDate && rawDate >= todayStr) {
      const formattedDate = formatLeaveDate(doctor.onLeaveUntil, isEn);
      return {
        status: "on_leave",
        label: isEn ? `On Leave until ${formattedDate}` : `ছুটিতে আছেন (${formattedDate} পর্যন্ত)`,
        badgeClass: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30",
        dotClass: "bg-amber-500",
        formattedLeaveDate: formattedDate,
      };
    }
  }

  if (doctor.availableToday === false) {
    return {
      status: "closed_today",
      label: isEn ? "Chamber Closed Today" : "আজ চেম্বার বন্ধ",
      badgeClass: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30",
      dotClass: "bg-rose-500",
    };
  }

  return {
    status: "available_today",
    label: isEn ? "Available Today" : "আজ চেম্বার খোলা",
    badgeClass: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
    dotClass: "bg-emerald-500",
  };
}

export function DoctorAvailabilityBadge({
  doctor,
  locale = "bn",
  size = "md",
  className = "",
}: DoctorAvailabilityBadgeProps) {
  const info = useMemo(() => getDoctorAvailabilityInfo(doctor, locale), [doctor, locale]);

  const sizeClasses = {
    sm: "text-[10px] px-2 py-0.5 gap-1",
    md: "text-[11px] sm:text-xs px-2.5 py-0.5 gap-1.5",
    lg: "text-xs sm:text-sm px-3 py-1 gap-2",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold border shrink-0 transition-colors ${info.badgeClass} ${sizeClasses[size]} ${className}`}
    >
      {info.status === "available_today" && (
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
      )}
      {info.status === "closed_today" && (
        <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0" />
      )}
      {info.status === "on_leave" && (
        <CalendarOff className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
      )}
      <span className="truncate">{info.label}</span>
    </span>
  );
}

interface DoctorNoticeBannerProps {
  notice?: string | null;
  locale?: string;
  compact?: boolean;
  className?: string;
}

export function DoctorNoticeBanner({
  notice,
  locale = "bn",
  compact = false,
  className = "",
}: DoctorNoticeBannerProps) {
  if (!notice || !notice.trim()) return null;

  const isEn = locale === "en";

  if (compact) {
    return (
      <div
        className={`flex items-center gap-1.5 text-[11px] text-amber-800 dark:text-amber-300 bg-amber-500/10 border border-amber-500/25 px-2.5 py-1 rounded-lg min-w-0 ${className}`}
        title={notice}
      >
        <AlertCircle className="h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
        <span className="truncate font-medium">{notice}</span>
      </div>
    );
  }

  return (
    <div
      className={`flex items-start gap-2.5 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs sm:text-sm leading-relaxed ${className}`}
    >
      <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
      <div className="min-w-0 flex-1 space-y-0.5">
        <span className="font-bold text-[11px] sm:text-xs uppercase tracking-wider text-amber-700 dark:text-amber-400 block">
          {isEn ? "Chamber Notice" : "চেম্বার বিশেষ বিজ্ঞপ্তি"}
        </span>
        <p className="font-medium text-foreground/90">{notice}</p>
      </div>
    </div>
  );
}
