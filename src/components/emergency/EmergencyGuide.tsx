import { HeartHandshake, Truck, Activity, ShieldCheck, Siren, CheckCircle } from "lucide-react";

export default function EmergencyGuide() {
  const stats = [
    {
      icon: HeartHandshake,
      title: "ফেনী রক্তদাতা ও ব্লাড ব্যাংক",
      desc: "A+, A-, B+, B-, O+, O-, AB+, AB- রক্তের গ্রুপ ও উপজেলাভিত্তিক যাচাইকৃত স্বেচ্ছাসেবী রক্তদাতার ডিরেক্টরি।",
      color: "text-rose-600 dark:text-rose-400 bg-rose-500/10",
    },
    {
      icon: Truck,
      title: "২৪/৭ অ্যাম্বুলেন্স সেবা ফেনী",
      desc: "আইসিইউ (ICU), এসি, নন-এসি ও ফ্রিজিং অ্যাম্বুলেন্স সার্ভিসের সরাসরি চালক ও কাউন্টার নম্বর।",
      color: "text-primary bg-primary/10",
    },
    {
      icon: Activity,
      title: "অক্সিজেন সিলিন্ডার ও ব্লাড ব্যাংক",
      desc: "২৪ ঘণ্টা জরুরি মেডিকেল অক্সিজেন সিলিন্ডার হোম ডেলিভারি ও রেড ক্রিসেন্ট রক্ত কেন্দ্র সাপোর্ট।",
      color: "text-amber-600 dark:text-amber-400 bg-amber-500/10",
    },
    {
      icon: ShieldCheck,
      title: "১০০% সরাসরি ও মধ্যস্বত্বভোগীমুক্ত",
      desc: "কোনো প্রকার অতিরিক্ত চার্জ বা দালাল ছাড়া সরাসরি হাসপাতালের জরুরি বিভাগ, অ্যাম্বুলেন্স ও রক্তদাতার সাথে যোগাযোগ।",
      color: "text-blue-600 dark:text-blue-400 bg-blue-500/10",
    },
  ];

  return (
    <section aria-labelledby="emergency-guide-heading" className="w-full max-w-4xl mx-auto space-y-6 sm:space-y-8">
      <div className="rounded-3xl border border-border/80 bg-card p-5 sm:p-8 space-y-6 shadow-xs">
        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
            <Siren className="h-3.5 w-3.5" />
            <span>ফেনী জরুরি স্বাস্থ্য নেটওয়ার্ক ও ব্লাড ব্যাংক ডিরেক্টরি</span>
          </div>
          <h2
            id="emergency-guide-heading"
            className="font-heading text-lg sm:text-2xl font-bold text-secondary dark:text-white tracking-tight"
          >
            ফেনীতে ২৪/৭ জরুরি স্বাস্থ্য সহায়তা, রক্তদাতা ও অ্যাম্বুলেন্স সেবা
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            মেডিকেল ইমার্জেন্সিতে দ্রুত সঠিক সিদ্ধান্ত নেওয়া জীবন বাঁচাতে পারে। হেলথ ক্লাব ফেনী জেলার ৬টি উপজেলার (ফেনী সদর, দাগনভূঞা, ছাগলনাইয়া, সোনাগাজী, পরশুরাম, ফুলগাজী) সাধারণ মানুষের জন্য স্বেচ্ছাসেবী রক্তদাতা, রেড ক্রিসেন্ট ব্লাড ব্যাংক, আইসিইউ ও এসি অ্যাম্বুলেন্স, জরুরি অক্সিজেন সিলিন্ডার এবং ফেনী ২৫০ শয্যা সদর হাসপাতাল সহ সকল সরকারি ও বেসরকারি মেডিকেল হটলাইনের সার্বক্ষণিক সমন্বিত ডিরেক্টরি প্রদান করে।
          </p>
        </div>

        {/* Fact-Dense Stats Grid for Generative Engines (GEO) & Users */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-3 p-3.5 sm:p-4 rounded-2xl bg-muted/30 border border-border/60 hover:bg-muted/50 transition-colors"
              >
                <div className={`h-9 w-9 rounded-xl ${stat.color} flex items-center justify-center shrink-0`}>
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold text-foreground leading-tight">
                    {stat.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
                    {stat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust & E-E-A-T Assurance Footnote */}
        <div className="pt-2 border-t border-border/50 flex flex-wrap items-center justify-between gap-2 text-[11px] sm:text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5 text-primary font-medium">
            <CheckCircle className="h-3.5 w-3.5" />
            <span>১০০% জনস্বার্থে উন্মুক্ত জরুরি ডিরেক্টরি</span>
          </div>
          <span>ফেনী সদর, দাগনভূঞা, ছাগলনাইয়া, সোনাগাজী, পরশুরাম ও ফুলগাজী উপজেলা অন্তর্ভুক্ত</span>
        </div>
      </div>
    </section>
  );
}

