import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "মেম্বারশিপ প্ল্যান - হেলথ ক্লাব",
  description: "আমাদের ৩টি মেম্বারশিপ প্ল্যান দেখে আপনার জন্য উপযুক্ত প্ল্যানটি বেছে নিন এবং চিকিৎসা ব্যয় সাশ্রয় করা শুরু করুন।"
};

export default function MembershipPage() {
  const benefitDetails = [
    { title: "হাসপাতাল ডিসকাউন্ট", desc: "যেকোনো অংশীদার হাসপাতালে শুধু ডিজিটাল মেম্বার কার্ড প্রদর্শন করে বিলের উপর ফ্ল্যাট ১০% ডিসকাউন্ট।" },
    { title: "ডায়াগনস্টিক টেস্ট ছাড়", desc: "রক্ত পরীক্ষা, এক্স-রে সহ সকল প্যাথলজিক্যাল ও ইমেজিং পরীক্ষায় ফ্ল্যাট ১০% ডিসকাউন্ট।" },
    { title: "মডেল ফার্মেসী অফার", desc: "নির্ধারিত পার্টনার ফার্মেসীগুলো থেকে প্রয়োজনীয় ঔষধ ক্রয়ের ক্ষেত্রে সরাসরি ফ্ল্যাট ১০% ডিসকাউন্ট।" },
    { title: "পারিবারিক সাশ্রয়", desc: "ফ্যামিলি প্ল্যানের মাধ্যমে পরিবারের ৪ জন সদস্যের আলাদা মেম্বারশিপ কার্ড ও একই ছাড় সুবিধা।" },
    { title: "ফ্রি স্বাস্থ্য ক্যাম্প", desc: "নিয়মিত আয়োজিত ফ্রি ডায়াবেটিস চেকআপ, আই ক্যাম্প এবং রক্তচাপ পরীক্ষা।" },
    { title: "১ বছর প্রতিষ্ঠাতা স্ট্যাটাস", desc: "প্রথম ১০০ ফাউন্ডিং মেম্বারদের জন্য মেম্বারশিপ ১ বছরের জন্য সম্পুর্ণ ফ্রী।" }
  ];

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-extrabold text-primary tracking-widest uppercase">প্ল্যান ও বিবরণী</span>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-secondary dark:text-white">
            সাশ্রয়ী স্বাস্থ্য মেম্বারশিপ প্ল্যান
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            আপনার পরিবারের প্রয়োজন ও বাজেট অনুযায়ী মানানসই প্ল্যানটি বেছে নিন।
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
          
          {/* Founding Member */}
          <div className="bg-gradient-to-b from-primary-light/50 to-background border-2 border-primary rounded-3xl p-8 relative flex flex-col justify-between shadow-xl ring-4 ring-primary/10">
            <div className="absolute top-4 right-4 bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
              সীমিত অফার
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="font-heading text-xl font-bold text-secondary">Founding Member</h3>
                <p className="text-xs text-muted-foreground mt-1">প্রথম ১০০ জন ফাউন্ডিং মেম্বারশিপ পাবেন।</p>
              </div>
              <div className="flex items-baseline gap-1 text-secondary dark:text-white font-mono">
                <span className="text-4xl font-extrabold">৳০</span>
                <span className="text-xs text-muted-foreground font-semibold">/ ১ বছর ফ্রী</span>
              </div>
              <ul className="space-y-3 text-sm text-secondary/80">
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>১ জন সদস্য কভারেজ</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>১ বছর মেম্বারশিপ</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>সকল পার্টনার হাসপাতালে ডিসকাউন্ট</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>ডিজিটাল মেম্বারশিপ কার্ড ও ভেরিফাইড কিউআর</span>
                </li>
              </ul>
            </div>
            <div className="pt-8">
              <Link href="/register">
                <Button className="w-full bg-primary hover:bg-primary-dark text-white font-semibold">
                  ফ্রি জয়েন করুন
                </Button>
              </Link>
            </div>
          </div>

          {/* Individual */}
          <div className="bg-background border border-border rounded-3xl p-8 flex flex-col justify-between shadow-md">
            <div className="space-y-6">
              <div>
                <h3 className="font-heading text-xl font-bold text-secondary dark:text-white">Individual Membership</h3>
                <p className="text-xs text-muted-foreground mt-1">একক সদস্যদের বাৎসরিক কার্ড ও সুবিধা।</p>
              </div>
              <div className="flex items-baseline gap-1 text-secondary dark:text-white font-mono">
                <span className="text-4xl font-extrabold">৳৫০০</span>
                <span className="text-xs text-muted-foreground font-semibold">/ বাৎসরিক সাবস্ক্রিপশন</span>
              </div>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>১ জন সদস্য কভারেজ</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>বাৎসরিক রিনিউয়াল সাপেক্ষে মেয়াদ বৃদ্ধি</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>সকল পার্টনার হাসপাতালে ডিসকাউন্ট</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>ডিজিটাল মেম্বারশিপ কার্ড ও ভেরিফাইড কিউআর</span>
                </li>
              </ul>
            </div>
            <div className="pt-8">
              <Link href="/register?plan=individual">
                <Button variant="outline" className="w-full border-border hover:bg-muted text-secondary dark:text-white">
                  প্ল্যান কিনুন
                </Button>
              </Link>
            </div>
          </div>

          {/* Family */}
          <div className="bg-background border border-border rounded-3xl p-8 flex flex-col justify-between shadow-md relative">
            <div className="absolute top-4 right-4 bg-primary-light text-primary text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border border-primary/20">
              সেরা ভ্যালু
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="font-heading text-xl font-bold text-secondary dark:text-white">Family Membership</h3>
                <p className="text-xs text-muted-foreground mt-1">পরিবারের একাধিক সদস্যদের যৌথ কার্ড সুবিধা।</p>
              </div>
              <div className="flex items-baseline gap-1 text-secondary dark:text-white font-mono">
                <span className="text-4xl font-extrabold">৳১,৫০০</span>
                <span className="text-xs text-muted-foreground font-semibold">/ বাৎসরিক সাবস্ক্রিপশন</span>
              </div>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span className="text-secondary dark:text-white font-semibold">অনূর্ধ্ব ৪ জন পরিবার সদস্য কভারেজ</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>সকল সদস্যদের জন্য আলাদা ডিজিটাল কার্ড</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>সকল পার্টনার হাসপাতালে ডিসকাউন্ট</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>পারিবারিক যৌথ কভারেজ ও বিল সাশ্রয়</span>
                </li>
              </ul>
            </div>
            <div className="pt-8">
              <Link href="/register?plan=family">
                <Button variant="outline" className="w-full border-border hover:bg-muted text-secondary dark:text-white">
                  প্ল্যান কিনুন
                </Button>
              </Link>
            </div>
          </div>

        </div>

        {/* Detailed Benefits List */}
        <div className="space-y-8 pt-8 border-t border-border">
          <div className="text-center space-y-3">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-secondary dark:text-white">
              বিস্তারিত মেম্বারশিপের সুবিধাসমূহ
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              আমাদের সকল মেম্বারশিপ প্ল্যানেই নিচে উল্লেখ করা মৌলিক স্বাস্থ্য সুবিধা ও ক্যাশলেস ডিসকাউন্ট কভারেজ অন্তর্ভুক্ত থাকে।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {benefitDetails.map((benefit, index) => (
              <div key={index} className="flex gap-3.5 p-5 rounded-2xl border border-border bg-muted/30">
                <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-secondary dark:text-white text-base">
                    {benefit.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    {benefit.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
