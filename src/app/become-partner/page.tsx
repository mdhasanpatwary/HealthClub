import { HelpCircle } from "lucide-react";
import PartnerRequestForm from "./PartnerRequestForm";

export default function BecomePartnerPage() {
  return (
    <div className="bg-background min-h-screen py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-extrabold text-primary tracking-widest uppercase font-mono">স্বাস্থ্যসেবা প্রতিষ্ঠানের জন্য</span>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-secondary dark:text-white">হেলথ ক্লাব পার্টনার নেটওয়ার্কে যুক্ত হোন</h1>
          <p className="text-sm sm:text-base text-muted-foreground">আপনার চিকিৎসাকেন্দ্র, ডায়াগনস্টিক ল্যাব বা ফার্মেসিকে আমাদের প্ল্যাটফর্মে রেজিস্টার করে নতুন পেশেন্ট বেস তৈরি করুন।</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-stretch">
          <div className="md:col-span-2 space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <h2 className="font-heading text-xl font-bold text-secondary dark:text-white">অংশীদারিত্বের সুবিধাসমূহ</h2>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li className="flex gap-3"><div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5"><span className="text-xs font-bold">✓</span></div><div><h3 className="font-semibold text-secondary dark:text-slate-300">নতুন পেশেন্ট আগমন</h3><p className="text-xs mt-0.5">আমাদের ১০০+ মেম্বারদের কাছে আপনার ব্র্যান্ড প্রমোট হবে।</p></div></li>
                <li className="flex gap-3"><div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5"><span className="text-xs font-bold">✓</span></div><div><h3 className="font-semibold text-secondary dark:text-slate-300">ডিজিটাল প্রচার ও ব্র্যান্ডিং</h3><p className="text-xs mt-0.5">আমাদের ওয়েবসাইট ও মোবাইল অ্যাপ ডিরেক্টরিতে আপনার সেন্টারের ফ্রি লিস্টিং পাবেন।</p></div></li>
                <li className="flex gap-3"><div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5"><span className="text-xs font-bold">✓</span></div><div><h3 className="font-semibold text-secondary dark:text-slate-300">পেশেন্ট লয়্যালটি</h3><p className="text-xs mt-0.5">ডিজিটাল ভেরিফিকেশন পোর্টালে পেশেন্ট ভ্যালিডেশন অত্যন্ত নিখুঁত ও ক্যাশলেস।</p></div></li>
              </ul>
            </div>
            <div className="p-4 rounded-2xl bg-muted border border-border flex items-start gap-3"><HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" /><div className="text-xs space-y-1"><p className="font-bold text-secondary dark:text-white">সহায়তা প্রয়োজন?</p><p className="text-muted-foreground">পার্টনার সম্পর্ক টিম হটলাইন:</p><p className="font-bold text-primary font-mono">+880 1886763849</p></div></div>
          </div>

          <PartnerRequestForm />
        </div>
      </div>
    </div>
  );
}
