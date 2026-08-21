"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { logger } from "@/lib/logger";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected runtime errors for production monitoring
    logger.error("Unhandled runtime application error:", error);
  }, [error]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Error Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 ring-8 ring-rose-50 dark:ring-rose-900/20 shadow-lg">
          <AlertTriangle className="w-10 h-10" />
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-rose-700 dark:text-rose-300 bg-rose-100/80 dark:bg-rose-950/80 rounded-full border border-rose-200 dark:border-rose-800">
            System Alert / সিস্টেম ত্রুটি
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            সাময়িক সমস্যা দেখা দিয়েছে
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            একটি অপ্রত্যাশিত ত্রুটি ঘটেছে। অনুগ্রহ করে পেজটি রিফ্রেশ করুন অথবা পরবর্তীতে পুনরায় চেষ্টা করুন।
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-md transition-all active:scale-[0.98]"
          >
            <RefreshCw className="w-4 h-4" />
            পুনরায় চেষ্টা করুন (Try Again)
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium shadow-sm transition-all active:scale-[0.98]"
          >
            <Home className="w-4 h-4" />
            হোম পেজ
          </Link>
        </div>
      </div>
    </div>
  );
}
