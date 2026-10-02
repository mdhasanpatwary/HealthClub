import { toBanglaNums } from "@/lib/utils";

interface LandingStatsProps {
  hospitalCount: number;
  diagnosticCount: number;
  pharmacyCount: number;
}

export function LandingStats({
  hospitalCount,
  diagnosticCount,
  pharmacyCount,
}: LandingStatsProps) {
  return (
    <section className="bg-background py-8 sm:py-14 border-y border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
          {/* 1. Free Membership */}
          <div className="col-span-2 sm:col-span-1 relative bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5 p-4 sm:p-6 rounded-2xl border border-primary/15 text-center hover-lift shadow-sm group overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />
            <p className="text-2xl sm:text-3xl font-extrabold text-primary font-mono tabular-nums">
              ১০-২৫% ছাড়
            </p>
            <p className="text-sm font-bold text-secondary dark:text-white mt-1.5">ফ্রি মেম্বারশিপ</p>
            <p className="text-xs text-muted-foreground mt-1">
              সম্পূর্ণ বিনামূল্যে ডিজিটাল কার্ড
            </p>
          </div>

          {/* 2. Premium Membership */}
          <div className="relative bg-gradient-to-br from-emerald-500/5 to-emerald-500/10 dark:from-emerald-500/10 dark:to-emerald-500/5 p-4 sm:p-6 rounded-2xl border border-emerald-500/15 text-center hover-lift shadow-sm overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">১৫-৩০% ছাড়</p>
            <p className="text-sm font-bold text-secondary dark:text-white mt-1.5">প্রিমিয়াম মেম্বারশিপ</p>
            <p className="text-xs text-muted-foreground mt-1">সর্বোচ্চ ছাড় ও প্রায়োরিটি সুবিধা।</p>
          </div>

          {/* 3. Partner Hospitals */}
          <div className="relative bg-gradient-to-br from-blue-500/5 to-blue-500/10 dark:from-blue-500/10 dark:to-blue-500/5 p-4 sm:p-6 rounded-2xl border border-blue-500/15 text-center hover-lift shadow-sm overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
            <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 font-mono tabular-nums">
              {toBanglaNums(hospitalCount)}+
            </p>
            <p className="text-sm font-bold text-secondary dark:text-white mt-1.5">পার্টনার হাসপাতাল</p>
            <p className="text-xs text-muted-foreground mt-1">শীর্ষস্থানীয় প্রাইভেট হাসপাতাল ও ক্লিনিক।</p>
          </div>

          {/* 4. Diagnostic Centers */}
          <div className="relative bg-gradient-to-br from-teal-500/5 to-teal-500/10 dark:from-teal-500/10 dark:to-teal-500/5 p-4 sm:p-6 rounded-2xl border border-teal-500/15 text-center hover-lift shadow-sm overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-teal-500 to-transparent" />
            <p className="text-3xl font-extrabold text-teal-600 dark:text-teal-400 font-mono tabular-nums">
              {toBanglaNums(diagnosticCount)}+
            </p>
            <p className="text-sm font-bold text-secondary dark:text-white mt-1.5">ডায়াগনস্টিক সেন্টার</p>
            <p className="text-xs text-muted-foreground mt-1">আধুনিক ল্যাব ও প্যাথলজি টেস্টের সুবিধা।</p>
          </div>

          {/* 5. Model Pharmacies */}
          <div className="relative bg-gradient-to-br from-violet-500/5 to-violet-500/10 dark:from-violet-500/10 dark:to-violet-500/5 p-4 sm:p-6 rounded-2xl border border-violet-500/15 text-center hover-lift shadow-sm overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
            <p className="text-3xl font-extrabold text-violet-600 dark:text-violet-400 font-mono tabular-nums">
              {toBanglaNums(pharmacyCount)}+
            </p>
            <p className="text-sm font-bold text-secondary dark:text-white mt-1.5">মডেল ফার্মেসি</p>
            <p className="text-xs text-muted-foreground mt-1">পার্টনার ফার্মেসি থেকে ঔষধ ক্রয়ে ৫-১০% ছাড়।</p>
          </div>
        </div>
      </div>
    </section>
  );
}
