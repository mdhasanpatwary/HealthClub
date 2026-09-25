import { CheckCircle2 } from "lucide-react";

export function LandingComparison() {
  return (
    <section className="py-10 sm:py-20 lg:py-28 bg-muted/40 dark:bg-slate-950/60 border-y border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="section-label">তুলনামূলক বিবরণী</span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-secondary dark:text-white mt-3">
            হেলথ ক্লাব মেম্বারশিপের উপযোগিতা
          </h2>
          <p className="text-sm text-muted-foreground">
            সাধারণ চিকিৎসা ব্যয় এবং হেলথ ক্লাব মেম্বারশিপ মেয়াদের চিকিৎসা ব্যয়ের মধ্যে একটি স্পষ্ট তুলনা দেখুন।
          </p>
        </div>

        {/* Comparison Table */}
        <div className="max-w-4xl mx-auto overflow-x-auto rounded-2xl border border-border shadow-md">
          <table className="w-full min-w-[580px] text-left border-collapse bg-background dark:bg-slate-900">
            <thead>
              <tr className="bg-gradient-to-r from-secondary to-slate-800 text-white font-heading text-sm sm:text-base">
                <th className="p-4 md:p-5 font-semibold rounded-tl-2xl">সুবিধাসমূহ</th>
                <th className="p-4 md:p-5 font-semibold text-slate-400">মেম্বারশিপ ছাড়া</th>
                <th className="p-4 md:p-5 font-semibold text-emerald-400 rounded-tr-2xl">হেলথ ক্লাব মেম্বারশিপ সহ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs sm:text-sm text-secondary/80 dark:text-slate-300">
              <tr className="hover:bg-muted/40 dark:hover:bg-slate-800/50 transition-colors">
                <td className="p-4 md:p-5 font-bold text-secondary dark:text-white">চিকিৎসা টেস্ট ফি (Diagnostic Expense)</td>
                <td className="p-4 md:p-5">শতভাগ সম্পূর্ণ ফি প্রদান করতে হয়</td>
                <td className="p-4 md:p-5 font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  ১০-৩০% ডিসকাউন্ট সুবিধা
                </td>
              </tr>
              <tr className="hover:bg-muted/40 dark:hover:bg-slate-800/50 transition-colors">
                <td className="p-4 md:p-5 font-bold text-secondary dark:text-white">হাসপাতাল বেড ও ক্যাবিন চার্জ</td>
                <td className="p-4 md:p-5">কোনো ছাড় ছাড়া নিয়মিত ভাড়া প্রযোজ্য</td>
                <td className="p-4 md:p-5 font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  ১০-৩০% ডিসকাউন্ট সুবিধা
                </td>
              </tr>
              <tr className="hover:bg-muted/40 dark:hover:bg-slate-800/50 transition-colors">
                <td className="p-4 md:p-5 font-bold text-secondary dark:text-white">অংশীদার ফার্মেসি (ঔষধ)</td>
                <td className="p-4 md:p-5">কোনো ছাড় নেই (পূর্ণ মূল্য)</td>
                <td className="p-4 md:p-5 font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  ৫% থেকে ১০% ডিসকাউন্ট
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
