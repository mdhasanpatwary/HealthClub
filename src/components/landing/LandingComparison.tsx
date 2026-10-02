import Link from "next/link";
import { CheckCircle2, XCircle, Crown, Sparkles, ArrowRight } from "lucide-react";

export function LandingComparison() {
  return (
    <section className="content-auto py-10 sm:py-20 lg:py-28 bg-muted/40 dark:bg-slate-950/60 border-y border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="section-label">তুলনামূলক বিবরণী</span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-secondary dark:text-white mt-3">
            হেলথ ক্লাব মেম্বারশিপের উপযোগিতা
          </h2>
          <p className="text-sm text-muted-foreground">
            সাধারণ চিকিৎসা সেবা বনাম হেলথ ক্লাব ফ্রি ও প্রিমিয়াম মেম্বারশিপের সুযোগ-সুবিধার স্পষ্ট তুলনা দেখুন।
          </p>
        </div>

        {/* 4-Column Comparison Table */}
        <div className="max-w-5xl mx-auto overflow-x-auto rounded-2xl border border-border shadow-md">
          <table className="w-full min-w-[700px] text-left border-collapse bg-background dark:bg-slate-900">
            <thead>
              <tr className="bg-gradient-to-r from-secondary via-slate-800 to-secondary text-white font-heading text-sm sm:text-base border-b border-slate-700">
                <th className="p-4 md:p-5 font-semibold rounded-tl-2xl w-[28%]">সুবিধাসমূহ</th>
                <th className="p-4 md:p-5 font-semibold text-slate-300 w-[24%]">মেম্বারশিপ ছাড়া</th>
                <th className="p-4 md:p-5 font-semibold text-emerald-400 bg-emerald-950/30 w-[24%]">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>ফ্রি মেম্বারশিপ</span>
                  </div>
                  <span className="text-[11px] font-normal text-emerald-300/80 block mt-0.5">৳০ (আজীবন ফ্রি)</span>
                </th>
                <th className="p-4 md:p-5 font-semibold text-amber-300 bg-amber-950/30 rounded-tr-2xl w-[24%]">
                  <div className="flex items-center gap-1.5">
                    <Crown className="h-4 w-4 text-amber-400 shrink-0" />
                    <span>প্রিমিয়াম মেম্বারশিপ</span>
                  </div>
                  <span className="text-[11px] font-normal text-amber-300/80 block mt-0.5">৳৫০০ / বছর</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs sm:text-sm text-secondary/80 dark:text-slate-300">
              {/* Row 1: Diagnostic Test */}
              <tr className="hover:bg-muted/40 dark:hover:bg-slate-800/50 transition-colors">
                <td className="p-4 md:p-5 font-bold text-secondary dark:text-white">
                  ডায়াগনস্টিক টেস্ট ফি (প্যাথলজি, আল্ট্রাসনোগ্রাম, এক্স-রে)
                </td>
                <td className="p-4 md:p-5 text-muted-foreground flex items-center gap-1.5">
                  <XCircle className="h-4 w-4 text-red-400/80 shrink-0" />
                  <span>১০০% সম্পূর্ণ ফি প্রদান</span>
                </td>
                <td className="p-4 md:p-5 font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-500/5">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>১০–২৫% নিশ্চিত ছাড়</span>
                  </div>
                </td>
                <td className="p-4 md:p-5 font-bold text-amber-800 dark:text-amber-300 bg-amber-500/5">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span>১৫–৩০% সর্বোচ্চ ছাড়</span>
                  </div>
                </td>
              </tr>

              {/* Row 2: Hospital Bed & Cabin */}
              <tr className="hover:bg-muted/40 dark:hover:bg-slate-800/50 transition-colors">
                <td className="p-4 md:p-5 font-bold text-secondary dark:text-white">
                  হাসপাতাল বেড ও ক্যাবিন চার্জ
                </td>
                <td className="p-4 md:p-5 text-muted-foreground flex items-center gap-1.5">
                  <XCircle className="h-4 w-4 text-red-400/80 shrink-0" />
                  <span>কোনো ছাড় নেই (পূর্ণ ভাড়া)</span>
                </td>
                <td className="p-4 md:p-5 font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-500/5">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>১০–২০% ডিসকাউন্ট</span>
                  </div>
                </td>
                <td className="p-4 md:p-5 font-bold text-amber-800 dark:text-amber-300 bg-amber-500/5">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span>১০–৩০% বিশেষ ছাড়</span>
                  </div>
                </td>
              </tr>

              {/* Row 3: Doctor Serial & Support */}
              <tr className="hover:bg-muted/40 dark:hover:bg-slate-800/50 transition-colors">
                <td className="p-4 md:p-5 font-bold text-secondary dark:text-white">
                  ডাক্তার সিরিয়াল ও সাপোর্ট
                </td>
                <td className="p-4 md:p-5 text-muted-foreground flex items-center gap-1.5">
                  <XCircle className="h-4 w-4 text-red-400/80 shrink-0" />
                  <span>নিয়মিত সিরিয়াল ও দীর্ঘ অপেক্ষা</span>
                </td>
                <td className="p-4 md:p-5 font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-500/5">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>ডিজিটাল সিরিয়াল বুকিং</span>
                  </div>
                </td>
                <td className="p-4 md:p-5 font-bold text-amber-800 dark:text-amber-300 bg-amber-500/5">
                  <div className="flex items-center gap-1.5">
                    <Crown className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span>ফার্স্ট প্রায়োরিটি ও ভিআইপি কেয়ার</span>
                  </div>
                </td>
              </tr>

              {/* Row 4: Partner Pharmacy */}
              <tr className="hover:bg-muted/40 dark:hover:bg-slate-800/50 transition-colors">
                <td className="p-4 md:p-5 font-bold text-secondary dark:text-white">
                  অংশীদার ফার্মেসি (ঔষধ ক্রয়)
                </td>
                <td className="p-4 md:p-5 text-muted-foreground flex items-center gap-1.5">
                  <XCircle className="h-4 w-4 text-red-400/80 shrink-0" />
                  <span>কোনো ছাড় ছাড়া পূর্ণ মূল্য</span>
                </td>
                <td className="p-4 md:p-5 font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-500/5">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>৫% থেকে ৮% ডিসকাউন্ট</span>
                  </div>
                </td>
                <td className="p-4 md:p-5 font-bold text-amber-800 dark:text-amber-300 bg-amber-500/5">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span>৫% থেকে ১০% বিশেষ ছাড়</span>
                  </div>
                </td>
              </tr>

              {/* Row 5: Digital Card */}
              <tr className="hover:bg-muted/40 dark:hover:bg-slate-800/50 transition-colors">
                <td className="p-4 md:p-5 font-bold text-secondary dark:text-white">
                  ডিজিটাল মেম্বার কার্ড ও রেকর্ড
                </td>
                <td className="p-4 md:p-5 text-muted-foreground flex items-center gap-1.5">
                  <XCircle className="h-4 w-4 text-red-400/80 shrink-0" />
                  <span>প্রযোজ্য নয়</span>
                </td>
                <td className="p-4 md:p-5 font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-500/5">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>ইনস্ট্যান্ট ডিজিটাল ফ্রি কার্ড</span>
                  </div>
                </td>
                <td className="p-4 md:p-5 font-bold text-amber-800 dark:text-amber-300 bg-amber-500/5">
                  <div className="flex items-center gap-1.5">
                    <Crown className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span>প্রিমিয়াম গোল্ড ব্যাজ + প্রায়োরিটি ভেরিফিকেশন</span>
                  </div>
                </td>
              </tr>

              {/* Row 6: Membership Fee */}
              <tr className="hover:bg-muted/40 dark:hover:bg-slate-800/50 transition-colors bg-muted/20">
                <td className="p-4 md:p-5 font-bold text-secondary dark:text-white">
                  বার্ষিক মেম্বারশিপ ফি
                </td>
                <td className="p-4 md:p-5 text-muted-foreground">
                  প্রযোজ্য নয়
                </td>
                <td className="p-4 md:p-5 font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/5">
                  ৳০ (১০০% ফ্রি)
                </td>
                <td className="p-4 md:p-5 font-bold text-amber-800 dark:text-amber-300 bg-amber-500/5">
                  ৳৫০০ / বছর
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-xl mx-auto pt-2">
          <Link
            href="/register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold text-sm shadow-md transition-all"
          >
            <span>ফ্রি মেম্বার কার্ড নিন (৳০)</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/register?plan=premium"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 dark:text-amber-300 border border-amber-500/30 font-semibold text-sm transition-all"
          >
            <Crown className="h-4 w-4 text-amber-500" />
            <span>প্রিমিয়াম মেম্বারশিপ নিন (৳৫০০)</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
