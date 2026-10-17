import { AlertCircle, CalendarOff } from "lucide-react";
import { Doctor } from "@/services/db";
import {
  DoctorAvailabilityStatus,
  DoctorAvailabilityInfo,
  DoctorAvailabilityReason,
  getDoctorAvailabilityInfo,
  isDoctorAvailableToday,
  isAvailableOnDay,
} from "@/lib/doctorAvailability";

export type { DoctorAvailabilityStatus, DoctorAvailabilityInfo, DoctorAvailabilityReason };
export { getDoctorAvailabilityInfo, isDoctorAvailableToday, isAvailableOnDay };

interface DoctorAvailabilityBadgeProps {
  doctor: Pick<Doctor, "availableToday" | "onLeaveUntil"> & { visitingDays?: string | null };
  size?: "sm" | "md" | "lg";
  className?: string;
  targetDate?: Date;
}

export function DoctorAvailabilityBadge({
  doctor,
  size = "md",
  className = "",
  targetDate,
}: DoctorAvailabilityBadgeProps) {
  const info = getDoctorAvailabilityInfo(doctor, targetDate);

  const sizeClasses = {
    sm: "text-[10px] px-2 py-0.5 gap-1",
    md: "text-[11px] sm:text-xs px-2.5 py-0.5 gap-1.5",
    lg: "text-xs sm:text-sm px-3 py-1 gap-2",
  };

  const tooltip =
    info.reason === "scheduled_off" && doctor.visitingDays
      ? `রোগী দেখার দিন: ${doctor.visitingDays}`
      : undefined;

  return (
    <span
      title={tooltip}
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
  compact?: boolean;
  className?: string;
}

export function DoctorNoticeBanner({
  notice,
  compact = false,
  className = "",
}: DoctorNoticeBannerProps) {
  if (!notice || !notice.trim()) return null;

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
          চেম্বার বিশেষ বিজ্ঞপ্তি
        </span>
        <p className="font-medium text-foreground/90">{notice}</p>
      </div>
    </div>
  );
}
