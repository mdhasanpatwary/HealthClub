"use client";

import React from "react";
import { Check, CalendarCheck2, X } from "lucide-react";
import { toBanglaNums } from "@/lib/utils";

interface AvailableTodayToggleProps {
  isActive: boolean;
  onToggle: () => void;
  count: number;
  dayNameBn?: string;
  className?: string;
}

export function AvailableTodayToggle({
  isActive,
  onToggle,
  count,
  dayNameBn,
  className = "",
}: AvailableTodayToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isActive}
      aria-label={`আজ চেম্বার খোলা ফিল্টার (${dayNameBn || "আজ"} ${toBanglaNums(count)} জন ডাক্তার)`}
      onClick={onToggle}
      className={`group relative inline-flex items-center gap-2 sm:gap-2.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer select-none shrink-0 ${
        isActive
          ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-500/30 shadow-emerald-600/20"
          : "bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 hover:border-emerald-500/50"
      } ${className}`}
      title={
        isActive
          ? "ফিল্টারটি বন্ধ করতে ক্লিক করুন"
          : `আজ (${dayNameBn || "আজ"}) ফেনীতে যেসকল ডাক্তারের চেম্বার খোলা রয়েছে তাদের দেখতে ক্লিক করুন`
      }
    >
      {/* Live Pulsing Dot / Active Check Icon */}
      {isActive ? (
        <span className="flex items-center justify-center h-4 w-4 rounded-full bg-white/20 shrink-0">
          <Check className="h-3 w-3 text-white" />
        </span>
      ) : (
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
        </span>
      )}

      {/* Label */}
      <span className="flex items-center gap-1.5">
        <CalendarCheck2 className={`h-3.5 w-3.5 shrink-0 ${isActive ? "text-white" : "text-emerald-600 dark:text-emerald-400"}`} />
        <span>{isActive ? "আজ চেম্বারে রোগী দেখছেন" : "আজ চেম্বার খোলা আছে"}</span>
        {dayNameBn && (
          <span className={`text-[11px] font-medium hidden sm:inline ${isActive ? "text-emerald-100" : "text-emerald-700/80 dark:text-emerald-400/80"}`}>
            ({dayNameBn})
          </span>
        )}
      </span>

      {/* Counter Pill */}
      {count > 0 && (
        <span
          className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full transition-colors ${
            isActive
              ? "bg-white/25 text-white"
              : "bg-emerald-600/15 text-emerald-800 dark:text-emerald-200"
          }`}
        >
          {toBanglaNums(count)} জন
        </span>
      )}

      {/* Clear Dismiss Icon when Active */}
      {isActive && (
        <span
          className="ml-0.5 text-white/80 hover:text-white p-0.5 rounded-full hover:bg-white/20 transition-colors"
          title="মুছুন"
        >
          <X className="h-3 w-3" />
        </span>
      )}
    </button>
  );
}
