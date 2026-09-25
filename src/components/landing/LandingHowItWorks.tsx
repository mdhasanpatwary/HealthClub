export function LandingHowItWorks() {
  const steps = [
    {
      step: "১",
      title: "মেম্বার রেজিস্ট্রেশন",
      desc: "আপনার নাম, মোবাইল নম্বর এবং ইমেইল দিয়ে ফাউন্ডিং মেম্বার হিসেবে ফ্রি রেজিস্ট্রেশন সম্পন্ন করুন।",
    },
    {
      step: "২",
      title: "ডিজিটাল মেম্বার আইডি সংগ্রহ",
      desc: "মেম্বার ড্যাশবোর্ডে লগইন করে আপনার কিউআর কোড যুক্ত ডিজিটাল মেম্বারশিপ কার্ড ডাউনলোড করুন।",
    },
    {
      step: "৩",
      title: "হাসপাতালে ডিসকাউন্ট পান",
      desc: "পার্টনার হাসপাতালে চিকিৎসা বিল পে করার আগে আপনার ডিজিটাল কার্ডটি দেখিয়ে ডিসকাউন্ট উপভোগ করুন।",
    },
  ];

  return (
    <section className="py-10 sm:py-20 lg:py-28 bg-muted/40 dark:bg-slate-950/60 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6 sm:space-y-14">
        <div className="space-y-2 sm:space-y-4 max-w-2xl mx-auto">
          <span className="section-label">ব্যবহার বিধি</span>
          <h2 className="font-heading text-2xl sm:text-4xl font-bold text-secondary dark:text-white mt-2">
            ৩টি সহজ ধাপে সেবা নিন
          </h2>
          <p className="text-xs sm:text-base text-muted-foreground">
            হেলথ ক্লাবের ডিজিটাল মেম্বারশিপ কার্ড ব্যবহার করে হাসপাতালে ডিসকাউন্ট নেওয়া একদম সহজ।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 relative max-w-4xl mx-auto">
          {/* Connecting line on desktop */}
          <div className="hidden md:block absolute top-10 left-[calc(16.67%+1.5rem)] right-[calc(16.67%+1.5rem)] h-px bg-gradient-to-r from-primary/30 via-primary/60 to-primary/30 z-0" />

          {steps.map((item, i) => (
            <div
              key={i}
              className="relative z-10 flex flex-col items-center text-center space-y-3 p-5 sm:p-7 rounded-2xl bg-background dark:bg-slate-900 border border-border/80 hover:border-primary/30 hover-lift shadow-sm group"
            >
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 text-white font-heading text-xl font-bold flex items-center justify-center shadow-lg shadow-primary/20">
                {item.step}
              </div>
              <h3 className="font-heading text-base font-bold text-secondary dark:text-white">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
