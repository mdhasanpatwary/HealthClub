import { Check } from "lucide-react";

export function LandingBenefits() {
  const benefits = [
    {
      title: "হাসপাতাল ডিসকাউন্ট",
      desc: "পার্টনার হাসপাতালের যেকোনো বিল পরিশোধের সময় মেম্বার কার্ড শো করলে ১০-৩০% ডিসকাউন্ট।",
      gradient: "from-emerald-500 to-green-600",
    },
    {
      title: "ডায়াগনস্টিক ডিসকাউন্ট",
      desc: "রক্ত পরীক্ষা, এক্স-রে, এমআরআই, সিটি স্ক্যান সহ সকল প্যাথলজিক্যাল ও ইমেজিং টেস্টে ১০-৩০% ছাড়।",
      gradient: "from-blue-500 to-cyan-600",
    },
    {
      title: "ডিজিটাল মেম্বারশিপ কার্ড",
      desc: "মোবাইলেই ডিজিটাল কার্ড সংরক্ষণ করে যেকোনো পার্টনার চিকিৎসাকেন্দ্রে সহজেই ছাড় উপভোগ করুন।",
      gradient: "from-violet-500 to-purple-600",
    },
    {
      title: "স্বাস্থ্য ক্যাম্প অ্যাক্সেস",
      desc: "দেশব্যাপী আমাদের ফ্রি হেলথ চেকআপ ক্যাম্প ও বিশেষ সচেতনতামূলক স্বাস্থ্য প্রোগ্রামে সরাসরি অংশগ্রহণ সুবিধা।",
      gradient: "from-rose-500 to-pink-600",
    },
    {
      title: "ভবিষ্যৎ স্বাস্থ্য সুবিধা",
      desc: "নতুন যেকোনো মেডিকেল অফার ও সরকারি-বেসরকারি চিকিৎসাকেন্দ্রের পার্টনারশিপ বেনিফিট স্বয়ংক্রিয়ভাবে আপডেট পাবেন।",
      gradient: "from-amber-500 to-orange-600",
    },
    {
      title: "ফার্মেসি ডিসকাউন্ট অফার",
      desc: "নির্ধারিত ও নির্বাচিত কিছু স্বনামধন্য মডেল ফার্মেসিতে প্রয়োজনীয় ঔষধ কেনাকাটায় সরাসরি ৫% থেকে ১০% ছাড়।",
      gradient: "from-teal-500 to-emerald-600",
    },
  ];

  return (
    <section id="benefits" className="py-10 sm:py-20 lg:py-28 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-14">
        <div className="text-center space-y-2 sm:space-y-4 max-w-2xl mx-auto">
          <span className="section-label">মেম্বারশিপ সুবিধা</span>
          <h2 className="font-heading text-2xl sm:text-4xl font-bold text-secondary dark:text-white mt-2">
            মেম্বারদের জন্য এক্সক্লুসিভ সুবিধাসমূহ
          </h2>
          <p className="text-xs sm:text-base text-muted-foreground">
            হেলথ ক্লাব কার্ডের মাধ্যমে প্রতিটি মেম্বার পান মানসম্মত ও সাশ্রয়ী স্বাস্থ্যসেবা সুবিধা।
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
          {benefits.map((benefit, i) => (
            <div
              key={i}
              className="group relative bg-background dark:bg-slate-900 p-5 sm:p-7 rounded-2xl border border-border/80 hover:border-primary/20 hover-lift shadow-sm overflow-hidden"
            >
              {/* Hover gradient wash */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/3 group-hover:to-emerald-500/3 transition-all duration-500 rounded-2xl" />
              <div className={`relative h-11 w-11 rounded-xl bg-gradient-to-br ${benefit.gradient} flex items-center justify-center mb-5 shadow-lg`}>
                <Check className="h-5 w-5 text-white" />
              </div>
              <h3 className="relative font-heading text-base font-bold text-secondary dark:text-white mb-2">{benefit.title}</h3>
              <p className="relative text-sm text-muted-foreground leading-relaxed">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
