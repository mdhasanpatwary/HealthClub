import Link from "next/link";
import { HeartHandshake, ArrowRight } from "lucide-react";

export function BlogMembershipBanner() {
  return (
    <section className="rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/15 via-primary/5 to-card p-6 sm:p-8 space-y-4 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-sm">
          <HeartHandshake className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            হেলথ ক্লাব মেম্বার সুবিধা
          </span>
          <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground">
            ফেনীর সেরা পার্টনার হাসপাতালগুলোতে পরীক্ষা ও সার্ভিসে বিশেষ মেম্বার ছাড়
          </h3>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
        হেলথ ক্লাবের ডিজিটাল মেম্বারশিপ কার্ড থাকলে আপনি ও আপনার পরিবারের সদস্যরা আল-আকসা হাসপাতাল, প্যাসিফিক হেলথ কেয়ারসহ ফেনী সদরের শীর্ষ পার্টনার স্বাস্থ্যসেবা কেন্দ্রগুলোতে ১০-৩০% নিশ্চিত ছাড় পাবেন।
      </p>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <Link
          href="/membership"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-bold shadow-xs hover:bg-primary/90 transition-all"
        >
          <span>মেম্বারশিপ কার্ড গ্রহণ করুন</span>
          <ArrowRight className="h-4 w-4" />
        </Link>

        <Link
          href="/partner-hospitals"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/80 bg-card hover:bg-muted text-xs sm:text-sm font-semibold text-foreground transition-all"
        >
          <span>সকল পার্টনার হাসপাতাল দেখুন</span>
        </Link>
      </div>
    </section>
  );
}
