import Link from "next/link";
import { FileQuestion, Home, Building2 } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Animated Icon Container */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 ring-8 ring-emerald-50 dark:ring-emerald-900/20 shadow-lg animate-bounce">
          <FileQuestion className="w-10 h-10" />
        </div>

        {/* Status code & Heading */}
        <div className="space-y-2">
          <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/80 rounded-full border border-emerald-200 dark:border-emerald-800">
            Error 404
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Page Not Found / পৃষ্ঠাটি পাওয়া যায়নি
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            আপনি যে পৃষ্ঠাটি খুঁজছেন সেটি সরানো হয়েছে, নাম পরিবর্তন করা হয়েছে অথবা সাময়িকভাবে অনুপলব্ধ।
          </p>
        </div>

        {/* CTA Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-md transition-all active:scale-[0.98]"
          >
            <Home className="w-4 h-4" />
            হোম পেজে ফিরে যান
          </Link>
          <Link
            href="/partner-hospitals"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium shadow-sm transition-all active:scale-[0.98]"
          >
            <Building2 className="w-4 h-4" />
            পার্টনার তালিকা
          </Link>
        </div>
      </div>
    </div>
  );
}
