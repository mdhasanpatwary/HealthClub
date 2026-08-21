"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { logger } from "@/lib/logger";

export default function RootGlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error("Critical Root Layout Application Error:", error);
  }, [error]);

  return (
    <html lang="bn">
      <body className="min-h-screen flex items-center justify-center px-4 py-16 bg-slate-50 text-slate-900 antialiased font-sans">
        <div className="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
          {/* Error Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-rose-100 text-rose-600 ring-8 ring-rose-50 shadow-md">
            <AlertTriangle className="w-10 h-10" />
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-rose-700 bg-rose-100 rounded-full border border-rose-200">
              Critical System Alert / সিস্টেম ত্রুটি
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              সাময়িক সমস্যা দেখা দিয়েছে
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              একটি অপ্রত্যাশিত ত্রুটি ঘটেছে। অনুগ্রহ করে পেজটি রিফ্রেশ করুন অথবা পরবর্তীতে পুনরায় চেষ্টা করুন।
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => reset()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-md transition-all active:scale-[0.98] cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              পুনরায় চেষ্টা করুন (Retry)
            </button>
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold transition-all active:scale-[0.98]"
            >
              <Home className="w-4 h-4" />
              হোম পেজ
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
