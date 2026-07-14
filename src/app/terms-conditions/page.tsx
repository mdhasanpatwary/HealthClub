export const metadata = {
  title: "শর্তাবলী ও নিয়মাবলী - হেলথ ক্লাব",
  description: "হেলথ ক্লাবের মেম্বারশিপ ব্যবহারের নিয়ম, পার্টনার হাসপাতাল যাচাইকরণ নীতি এবং শর্তাবলী।"
};

export default function TermsConditionsPage() {
  return (
    <div className="bg-background min-h-screen py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-8 text-secondary/90 leading-relaxed text-sm sm:text-base">
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-secondary dark:text-white border-b border-border pb-4">
          শর্তাবলী ও নিয়মাবলী (Terms & Conditions)
        </h1>
        <p className="text-muted-foreground">সর্বশেষ আপডেট: ১৪ জুলাই, ২০২৬</p>
        
        <p>
          হেলথ ক্লাব (হেলথ ক্লাব)-এর মেম্বারশিপ সেবা গ্রহণের জন্য আপনাকে নিম্নলিখিত শর্তাবলী মেনে চলতে হবে। মেম্বার হিসেবে রেজিস্ট্রেশন সম্পন্ন করার মাধ্যমে আপনি এই শর্তাবলী স্বীকার করছেন বলে গণ্য হবে।
        </p>

        <h2 className="font-heading text-xl font-bold text-secondary dark:text-white mt-6">১. মেম্বারশিপের ব্যবহার ও অপব্যবহার</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>ব্যক্তিগত (Individual) মেম্বারশিপ কার্ড শুধুমাত্র কার্ডধারী ব্যক্তিই ব্যবহার করতে পারবেন। এটি অন্য কারো কাছে হস্তান্তর করা যাবে না।</li>
          <li>পারিবারিক (Family) কার্ডের ক্ষেত্রে শুধুমাত্র চুক্তিতে তালিকাভুক্ত পরিবারের সদস্যরা এর সুবিধা পাবেন।</li>
          <li>কার্ডের অপব্যবহার বা মিথ্যা তথ্য প্রদানের ক্ষেত্রে হেলথ ক্লাব যেকোনো মেম্বারশিপ বাতিল করার অধিকার রাখে।</li>
        </ul>

        <h2 className="font-heading text-xl font-bold text-secondary dark:text-white mt-6">২. পার্টনার হাসপাতালের ডিসকাউন্ট ও ভেরিফিকেশন</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>ডিসকাউন্ট সুবিধা পেতে রোগীকে অবশ্যই বিলিং কাউন্টারে পেমেন্ট করার আগে সচল ডিজিটাল মেম্বারশিপ কার্ড দেখাতে হবে। বিল করার পর কার্ড দেখালে ডিসকাউন্ট কার্যকর নাও হতে পারে।</li>
          <li>পার্টনার হাসপাতাল তাদের নির্ধারিত নীতি অনুযায়ী ছাড়ের হার পরিবর্তন বা পরিবর্ধন করতে পারে, যা হেলথ ক্লাব অফিশিয়াল ওয়েবসাইটে আপডেট করা হবে।</li>
          <li>হেলথ ক্লাব শুধুমাত্র মেম্বারশিপ ও ডিসকাউন্ট কার্ড সার্ভিস প্রদানকারী প্রতিষ্ঠান। চিকিৎসাগত ত্রুটি, অবহেলা বা ভুল চিকিৎসার জন্য হেলথ ক্লাব কোনোভাবেই দায়ী থাকবে না।</li>
        </ul>

        <h2 className="font-heading text-xl font-bold text-secondary dark:text-white mt-6">৩. পেমেন্ট ও রিফান্ড নীতি</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>প্রতিষ্ঠাতা (Founding) মেম্বারদের জন্য মেম্বারশিপ ১ম বছরের জন্য ফ্রী।</li>
          <li>অন্যান্য পেইড বাৎসরিক মেম্বারশিপ প্ল্যানগুলোর ফি অফেরতযোগ্য (Non-refundable)।</li>
        </ul>
      </div>
    </div>
  );
}
