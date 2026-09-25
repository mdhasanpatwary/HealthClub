"use client";

import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { Megaphone, X } from "lucide-react";

interface GlobalNoticeBannerProps {
  notice: {
    enabled: boolean;
    text: string;
  };
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("hc-notice-dismiss", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("hc-notice-dismiss", callback);
  };
}

function getDismissedText() {
  try {
    return sessionStorage.getItem("hc_global_notice_dismissed_text") || "";
  } catch {
    return "";
  }
}

function getServerSnapshot() {
  return "";
}

export default function GlobalNoticeBanner({ notice }: GlobalNoticeBannerProps) {
  const pathname = usePathname();
  const dismissedText = useSyncExternalStore(subscribe, getDismissedText, getServerSnapshot);

  // Hide announcement banner inside admin panel
  if (pathname.startsWith("/admin")) {
    return null;
  }

  if (!notice?.enabled || !notice?.text?.trim()) {
    return null;
  }

  const trimmedText = notice.text.trim();
  if (dismissedText === trimmedText) {
    return null;
  }

  const handleDismiss = () => {
    try {
      sessionStorage.setItem("hc_global_notice_dismissed_text", trimmedText);
      window.dispatchEvent(new Event("hc-notice-dismiss"));
    } catch {
      // Storage unavailable or blocked
    }
  };

  return (
    <aside
      aria-label="Website Announcement"
      className="relative z-40 w-full bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 dark:from-emerald-950 dark:via-emerald-900 dark:to-slate-950 text-white dark:text-emerald-100 border-b border-emerald-500/40 dark:border-emerald-800/50 shadow-xs animate-in fade-in slide-in-from-top-1 duration-200"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-2 sm:px-6 text-xs sm:text-sm font-medium">
        <div className="flex items-center gap-2 min-w-0 flex-1 justify-center text-center">
          <span className="inline-flex items-center justify-center p-1 rounded-md bg-white/20 dark:bg-white/10 shrink-0 text-amber-200">
            <Megaphone className="size-3.5 sm:size-4 animate-pulse" />
          </span>
          <p className="truncate sm:text-wrap leading-tight tracking-normal font-medium text-left">
            {trimmedText}
          </p>
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          className="inline-flex items-center justify-center size-7 sm:size-6 rounded-md p-1 text-white/80 hover:text-white hover:bg-white/20 dark:hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
          aria-label="বিজ্ঞপ্তিটি বন্ধ করুন"
          title="বন্ধ করুন"
        >
          <X className="size-4 sm:size-3.5" />
        </button>
      </div>
    </aside>
  );
}
