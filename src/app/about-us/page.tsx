import { Heart, ShieldCheck, Users, Award } from "lucide-react";

export const metadata = {
  title: "আমাদের সম্পর্কে - হেলথ ক্লাব",
  description: "হেলথ ক্লাবের লক্ষ্য, আমাদের টিম, কাজের ধরণ এবং কীভাবে আমরা চিকিৎসা খরচ কমিয়ে এনে দেশব্যাপী স্বাস্থ্যসেবা সহজলভ্য করছি তা জানুন।"
};

export default function AboutUsPage() {
  return (
    <div className="bg-background min-h-screen py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-extrabold text-primary tracking-widest uppercase">আওয়ার মিশন</span>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-secondary dark:text-white">
            আমাদের লক্ষ্য ও পরিচিতি
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            স্বাস্থ্য সেবা হোক সহজ ও সাশ্রয়ী — এই স্লোগানকে সামনে রেখে আমরা কাজ করে যাচ্ছি।
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="font-heading text-2xl font-bold text-secondary dark:text-white">
              হেলথ ক্লাব কেন তৈরি হয়েছে?
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              আমাদের দেশের গ্রামীণ ও মফস্বল এলাকার মধ্যবিত্ত পরিবার, শিক্ষার্থী এবং প্রবীণ নাগরিকদের জন্য হঠাৎ আসা বড় ধরণের চিকিৎসা ব্যয় বহন করা অত্যন্ত কষ্টসাধ্য। অনেক সময় ডায়াগনস্টিক টেস্টের অতিরিক্ত মূল্যের কারণে সঠিক সময়ে রোগ নির্ণয় সম্ভব হয় না।
            </p>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              হেলথ ক্লাব একটি সহজ ডিজিটাল মেম্বারশিপ প্ল্যাটফর্ম, যা সাধারণ পরিবারগুলোর সাথে নামকরা পার্টনার হাসপাতালের সরাসরি সেতুবন্ধন তৈরি করে। আমাদের অফিশিয়াল চুক্তির মাধ্যমে হাসপাতাল ও ল্যাবগুলো আমাদের কার্ডধারী সদস্যদের বিশেষ ছাড় প্রদান করে, যার ফলে চিকিৎসায় সাশ্রয় ও সুস্থ জীবন নিশ্চিত করা সহজ হয়।
            </p>
          </div>
          <div className="relative bg-gradient-to-br from-primary-light/80 to-emerald-500/10 p-8 rounded-3xl border border-primary/20 space-y-6">
            <h3 className="font-heading text-xl font-bold text-primary">হেলথ ক্লাব ব্র্যান্ড ভ্যালু</h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-secondary dark:text-slate-300"><strong>ভরসা ও বিশ্বস্ততা:</strong> হাসপাতালগুলোর সাথে আইনি চুক্তির মাধ্যমে সেবার শতভাগ নিশ্চয়তা।</span>
              </li>
              <li className="flex gap-3">
                <Heart className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-secondary dark:text-slate-300"><strong>যত্নশীল সেবা:</strong> প্রতিটি মেম্বার এবং তাদের পরিবারের চিকিৎসায় আন্তরিক সমাধান।</span>
              </li>
              <li className="flex gap-3">
                <Users className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-secondary dark:text-slate-300"><strong>কমিউনিটি ও সমাজকল্যাণ:</strong> সাশ্রয়ী স্বাস্থ্যসেবা সবার মৌলিক অধিকার বাস্তবায়নে ভূমিকা রাখা।</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Values Grid */}
        <div className="space-y-8 pt-8 border-t border-border">
          <div className="text-center space-y-3">
            <h2 className="font-heading text-2xl font-bold text-secondary dark:text-white">
              আমাদের মূল স্তম্ভসমূহ (Core Pillars)
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              আমরা তিনটি মূল নীতির উপর ভিত্তি করে আমাদের মেম্বার ও পার্টনার হাসপাতাল পরিচালনা করি।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="bg-muted/40 p-6 rounded-2xl border border-border text-center space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-primary-light text-primary flex items-center justify-center mx-auto border border-primary/20">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-secondary dark:text-white">সবার জন্য চিকিৎসা</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                মধ্যবিত্ত ও গ্রামীণ নিম্ন-আয়ের পরিবারগুলোর স্বাস্থ্য পরীক্ষার ব্যয় হাতের নাগালে নিয়ে আসা আমাদের প্রথম লক্ষ্য।
              </p>
            </div>

            <div className="bg-muted/40 p-6 rounded-2xl border border-border text-center space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto border border-indigo-200">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-secondary dark:text-white">শতভাগ অফিশিয়াল পার্টনারশিপ</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                সকল অংশীদার হাসপাতাল ও ল্যাবের সাথে অফিশিয়াল চুক্তির মাধ্যমে ভ্যালিড ডিসকাউন্টের নিশ্চয়তা প্রদান করি।
              </p>
            </div>

            <div className="bg-muted/40 p-6 rounded-2xl border border-border text-center space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-secondary dark:text-white">সহজ ডিজিটাল যাচাইকরণ</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                ডিজিটাল মেম্বার আইডি কার্ড ও সহজ কিউআর কোড স্ক্যান ব্যবহার করে ঝামেলাহীন হাসপাতাল ছাড় নিশ্চিত করা।
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
