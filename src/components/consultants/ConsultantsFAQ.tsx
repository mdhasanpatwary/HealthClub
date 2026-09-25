import { ChevronDown, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

export default function ConsultantsFAQ() {
  const faqs: FAQItem[] = [
    {
      question: "ফেনীতে বিশেষজ্ঞ ডাক্তারের সিরিয়াল বা অ্যাপয়েন্টমেন্ট কীভাবে বুক করবেন?",
      answer: "হেলথ ক্লাব ডিরেক্টরিতে যেকোনো ডাক্তারের প্রোফাইলে 'সিরিয়াল কল করুন' বাটনে চাপ দিন। এতে সরাসরি সংশ্লিষ্ট হাসপাতাল ও চেম্বার কাউন্টারের অফিসিয়াল হটলাইন নাম্বার চলে আসবে। সেখানে কল করে কোনো প্রকার মধ্যস্বত্বভোগী বা বাড়তি ফি ছাড়াই আপনার সিরিয়াল নিশ্চিত করুন।",
    },
    {
      question: "ফেনীতে আজ কোন ডাক্তার চেম্বারে বসবেন তা কীভাবে জানব?",
      answer: "হেলথ ক্লাব ডিরেক্টরির প্রতিটি ডাক্তারের কার্ডে 'আজ চেম্বার খোলা' বা 'আজ চেম্বার বন্ধ' স্ট্যাটাস ব্যাজ এবং রোগী দেখার দিন ও সময় স্পষ্ট উল্লেখ থাকে। এছাড়া আপনার প্রয়োজনীয় বিভাগ (যেমন মেডিসিন, গাইনী, শিশু রোগ) নির্বাচন করে আজকের শিডিউল অনুযায়ী সহজেই ডাক্তার খুঁজে নিতে পারেন।",
    },
    {
      question: "ফেনীর ডাক্তারদের চেম্বার ও সময়সূচী কোথায় পাওয়া যাবে?",
      answer: "আমাদের ডিরেক্টরিতে ফেনীর এস.এস.কে রোড, ট্রাঙ্ক রোড, শহীদ শহীদুল্লা কায়সার সড়ক ও গ্র্যান্ড ট্রাঙ্ক রোডের সকল প্রধান ক্লিনিক ও ডায়াগনস্টিক সেন্টারের চিকিৎসকদের চেম্বার নাম, রুম নম্বর, রোগী দেখার দিন এবং সময়সূচী সম্পূর্ণ হালনাগাদ আকারে পাওয়া যায়।",
    },
    {
      question: "ফেনীর কোন কোন হাসপাতাল ও ডায়াগনস্টিক সেন্টারের ডাক্তার তালিকা এখানে রয়েছে?",
      answer: "ফেনীর শীর্ষ স্বাস্থ্যসেবা প্রতিষ্ঠান যেমন আধুনিক ডায়াগনস্টিক সেন্টার, ফেনী ডায়াবেটিক সমিতি, কনসেপ্ট হাসপাতাল, সাজেদা হাসপাতাল, ড্রিম প্রাইভেট হাসপাতাল, ফেনী হার্ট ফাউন্ডেশন, আল-কেমাল হাসপাতাল সহ শহরের সকল রেজিস্টার্ড সেন্টারের অভিজ্ঞ চিকিৎসকদের তথ্য এখানে অন্তর্ভুক্ত রয়েছে।",
    },
    {
      question: "ডাক্তার দেখানোর পর টেস্ট বা পরীক্ষায় হেলথ ক্লাব মেম্বাররা কী সুবিধা পান?",
      answer: "ডাক্তার দেখানোর পর চিকিৎসকের পরামর্শ অনুযায়ী সকল প্রয়োজনীয় ডায়াগনস্টিক পরীক্ষা (যেমন: রক্ত পরীক্ষা, ডিজিটাল এক্স-রে, আল্ট্রাসনোগ্রাম, ইকো, এমআরআই, সিটি স্ক্যান)-এ হেলথ ক্লাব মেম্বাররা পার্টনার হাসপাতাল ও ল্যাবগুলোতে ১০% থেকে ৩০% পর্যন্ত তাৎক্ষণিক ডিসকাউন্ট পান।",
    },
    {
      question: "চেম্বারে যাওয়ার পূর্বে কী প্রস্তুতি নেওয়া প্রয়োজন ও তথ্য কতটা নির্ভরযোগ্য?",
      answer: "আমাদের ডেডিকেটেড হেলথ টিম নিয়মিত হাসপাতাল ও চেম্বারগুলোর সাথে সরাসরি যোগাযোগ রেখে ডাক্তারদের সময়সূচি এবং সিরিয়াল নম্বর যাচাই করে। চেম্বারে যাওয়ার পূর্বে ফোনে সিরিয়াল নিশ্চিত করুন এবং রোগীর পূর্বের প্রেসক্রিপশন ও রিপোর্ট সাথে নিয়ে নির্ধারিত সময়ের ৩০ মিনিট পূর্বে উপস্থিত হোন।",
    },
  ];

  return (
    <section aria-labelledby="consultants-faq-heading" className="w-full max-w-4xl mx-auto space-y-6 sm:space-y-8">
      {/* Section Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-emerald-800 dark:text-emerald-300 border border-primary/20 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
          <HelpCircle className="h-3.5 w-3.5" />
          <span>সাধারণ জিজ্ঞাসা</span>
        </div>
        <h2 id="consultants-faq-heading" className="font-heading text-xl sm:text-3xl font-bold text-secondary dark:text-white tracking-tight">
          ফেনী ডাক্তার ও সিরিয়াল সম্পর্কিত সাধারণ প্রশ্নোত্তর
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          ফেনীর বিশেষজ্ঞ ডাক্তারদের অ্যাপয়েন্টমেন্ট, চেম্বার শিডিউল, সিরিয়াল নাম্বার এবং মেম্বার সুবিধা সম্পর্কিত প্রয়োজনীয় প্রশ্নোত্তর।
        </p>
      </div>

      {/* Accordion List using Native Details & Summary for Zero-JS Fast Hydration */}
      <div className="space-y-3">
        {faqs.map((faq, idx) => (
          <details
            key={idx}
            open={idx === 0}
            className="group border border-border/80 rounded-2xl bg-card hover:border-primary/40 transition-all duration-200 shadow-xs overflow-hidden"
          >
            <summary className="w-full flex justify-between items-center gap-3 p-4 sm:p-5 text-left font-heading font-bold text-secondary dark:text-white text-sm sm:text-base cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset list-none [&::-webkit-details-marker]:hidden select-none">
              <span className="leading-snug">{faq.question}</span>
              <ChevronDown className="h-5 w-5 text-primary shrink-0 transition-transform duration-300 group-open:rotate-180" />
            </summary>
            <div className="border-t border-border/60 p-4 sm:p-5 pt-3 sm:pt-4 bg-muted/20">
              <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                {faq.answer}
              </p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
