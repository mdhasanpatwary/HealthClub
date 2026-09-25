import { Users, Stethoscope, PhoneCall, Percent, BookOpen, CheckCircle } from "lucide-react";

export default function ConsultantsGuide() {
  const stats = [
    {
      icon: Users,
      title: "১০০+ বিশেষজ্ঞ ডাক্তার",
      desc: "ডিএমসি, বিএসএমএমইউ, সিএমসিএইচ সহ দেশের শীর্ষ প্রতিষ্ঠানের বিএমডিসি রেজিস্টার্ড চিকিৎসকদের পূর্ণাঙ্গ তালিকা।",
      color: "text-primary bg-primary/10",
    },
    {
      icon: Stethoscope,
      title: "১৬+ মেডিকেল বিভাগ",
      desc: "মেডিসিন, হৃদরোগ, গাইনী, শিশু রোগ, হাড়-জোড়া, কিডনি ও সার্জারি সহ সকল বিশেষজ্ঞ সেবা।",
      color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
    },
    {
      icon: PhoneCall,
      title: "সরাসরি সিরিয়াল হটলাইন",
      desc: "হাসপাতাল ও চেম্বার কাউন্টারের অফিসিয়াল ফোন নাম্বারে সরাসরি কল করে সিরিয়াল বুকিং।",
      color: "text-blue-600 dark:text-blue-400 bg-blue-500/10",
    },
    {
      icon: Percent,
      title: "১০-৩০% টেস্ট ডিসকাউন্ট",
      desc: "ডাক্তারের প্রেসক্রিপশন অনুযায়ী পার্টনার ডায়াগনস্টিকে সকল ল্যাব টেস্টে তাৎক্ষণিক সেভিংস।",
      color: "text-amber-600 dark:text-amber-400 bg-amber-500/10",
    },
  ];

  return (
    <section aria-labelledby="consultants-guide-heading" className="w-full max-w-4xl mx-auto space-y-6 sm:space-y-8">
      {/* Container Card */}
      <div className="rounded-3xl border border-border/80 bg-card p-5 sm:p-8 space-y-6 shadow-xs">
        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-emerald-800 dark:text-emerald-300 border border-primary/20 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
            <BookOpen className="h-3.5 w-3.5" />
            <span>ফেনী ডাক্তার ও চেম্বার নির্দেশিকা</span>
          </div>
          <h2 id="consultants-guide-heading" className="font-heading text-lg sm:text-2xl font-bold text-secondary dark:text-white tracking-tight">
            ফেনীর ডাক্তারদের চেম্বার, সময়সূচী ও সিরিয়াল নির্দেশিকা
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            ফেনী জেলা ও পার্শ্ববর্তী অঞ্চলের রোগীদের জন্য ফেনী শহরের শীর্ষ হাসপাতাল ও ডায়াগনস্টিক সেন্টারের (যেমন এস.এস.কে রোড, ট্রাঙ্ক রোড, শহীদ শহীদুল্লা কায়সার সড়ক ও গ্র্যান্ড ট্রাঙ্ক রোডে অবস্থিত প্রতিষ্ঠানসমূহ) অভিজ্ঞ বিশেষজ্ঞ চিকিৎসকদের তথ্য এক ছাদের নিচে। আজ কোন ডাক্তার বসেন, চেম্বার সময়সূচী এবং সরাসরি সিরিয়াল বুকিংয়ের অফিসিয়াল ফোন নাম্বার জানুন সহজেই।
          </p>
        </div>

        {/* Fact-Dense Stats Grid for Generative Engines & Users */}
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

        {/* E-E-A-T Assurance Footnote */}
        <div className="pt-2 border-t border-border/50 flex flex-wrap items-center justify-between gap-2 text-[11px] sm:text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5 text-primary font-medium">
            <CheckCircle className="h-3.5 w-3.5" />
            <span>১০০% যাচাইকৃত চেম্বার তথ্য</span>
          </div>
          <span>ফেনীর পার্টনার হাসপাতালগুলোর সাথে সমন্বিতভাবে নিয়মিত হালনাগাদকৃত</span>
        </div>
      </div>
    </section>
  );
}
