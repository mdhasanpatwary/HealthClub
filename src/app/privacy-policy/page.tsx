export const metadata = {
  title: "গোপনীয়তা নীতি - হেলথ ক্লাব",
  description: "হেলথ ক্লাবের গোপনীয়তা নীতি এবং কীভাবে আমরা আপনার তথ্য সুরক্ষিত রাখি তার বিস্তারিত বিবরণ।"
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-background min-h-screen py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-8 text-secondary/90 leading-relaxed text-sm sm:text-base">
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-secondary dark:text-white border-b border-border pb-4">
          গোপনীয়তা নীতি (Privacy Policy)
        </h1>
        <p className="text-muted-foreground">সর্বশেষ আপডেট: ১৪ জুলাই, ২০২৬</p>
        
        <p>
          হেলথ ক্লাব (হেলথ ক্লাব)-এ আপনার গোপনীয়তা রক্ষা করা আমাদের অন্যতম অগ্রাধিকার। আমাদের এই নীতিমালায় আমরা কীভাবে আপনার ব্যক্তিগত তথ্য সংগ্রহ করি, ব্যবহার করি এবং আপনার নিরাপত্তা নিশ্চিত করি তা ব্যাখ্যা করা হয়েছে।
        </p>

        <h2 className="font-heading text-xl font-bold text-secondary dark:text-white mt-6">১. কোন কোন তথ্য আমরা সংগ্রহ করি?</h2>
        <p>
          মেম্বারশিপ তৈরি করার সময় আমরা আপনার মৌলিক ব্যক্তিগত তথ্য সংগ্রহ করি যেমন:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>নাম (Name)</li>
          <li>মোবাইল নম্বর (Phone Number)</li>
          <li>ইমেইল ঠিকানা (Email Address)</li>
          <li>যুক্ত করা পরিবারের সদস্যদের নাম ও বয়স (ফ্যামিলি প্ল্যানের ক্ষেত্রে)</li>
        </ul>

        <h2 className="font-heading text-xl font-bold text-secondary dark:text-white mt-6">২. আমরা কেন আপনার তথ্য ব্যবহার করি?</h2>
        <p>
          সংগৃহীত তথ্য নিম্নলিখিত উদ্দেশ্যসমূহে ব্যবহৃত হয়:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>আপনার জন্য ডিজিটাল মেম্বারশিপ আইডি কার্ড তৈরি করতে।</li>
          <li>পার্টনার হাসপাতালগুলোতে কিউআর কোড স্ক্যানের মাধ্যমে মেম্বারশিপ যাচাই করতে।</li>
          <li>আপনার সেভিং হিস্ট্রি ও ট্রানজেকশন ড্যাশবোর্ডে দেখাতে।</li>
          <li>জরুরি সেবা এবং নতুন অফার সম্পর্কিত বিজ্ঞপ্তি পাঠাতে।</li>
        </ul>

        <h2 className="font-heading text-xl font-bold text-secondary dark:text-white mt-6">৩. তথ্য সুরক্ষা</h2>
        <p>
          আমরা আপনার ব্যক্তিগত তথ্যের নিরাপত্তা নিশ্চিত করতে সর্বাধুনিক ডিজিটাল সুরক্ষা ব্যবস্থা ব্যবহার করি। আমরা কোনো অবস্থাতেই আপনার তথ্য কোনো তৃতীয় পক্ষের কাছে বিক্রি বা পাচার করি না।
        </p>

        <h2 className="font-heading text-xl font-bold text-secondary dark:text-white mt-6">৪. নীতিমালার পরিবর্তন</h2>
        <p>
          হেলথ ক্লাব যেকোনো সময় এই গোপনীয়তা নীতি পরিবর্তন বা পরিবর্ধন করার অধিকার রাখে। যেকোনো পরিবর্তন এই পেজে প্রকাশ করা হবে।
        </p>
      </div>
    </div>
  );
}
