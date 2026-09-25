import { ChevronDown } from "lucide-react";


const FAQS = [
  {
    question: "হেলথ ক্লাব মেম্বারশিপ কীভাবে কাজ করে?",
    answer:
      "হেলথ ক্লাব একটি মেম্বারশিপ ভিত্তিক স্বাস্থ্য সুবিধা প্ল্যাটফর্ম। আমাদের সদস্য হয়ে আপনি আমাদের পার্টনার হাসপাতাল, ডায়াগনস্টিক সেন্টার এবং ফার্মেসিতে ডিজিটাল আইডি কার্ড দেখিয়ে বিশেষ ছাড় পেতে পারেন।",
  },
  {
    question: "আমি কীভাবে ডিসকাউন্ট বা ছাড় পেতে পারি?",
    answer:
      "আমাদের অংশীদার স্বাস্থ্যসেবা কেন্দ্রে যাওয়ার পর বিল করার সময় আপনার ডিজিটাল মেম্বারশিপ আইডি কার্ডটি দেখান। হাসপাতাল কর্তৃপক্ষ কার্ডে থাকা কিউআর (QR) কোডটি স্ক্যান করে আপনার মেম্বারশিপের সত্যতা নিশ্চিত করবে এবং তাৎক্ষণিকভাবে আপনার বিলে ডিসকাউন্ট যোগ করে দেবে।",
  },
  {
    question: "আমি কোথায় আমার মেম্বারশিপ ব্যবহার করতে পারব?",
    answer:
      "আমাদের ওয়েবসাইটে থাকা 'পার্টনার হাসপাতাল' ডিরেক্টরিতে তালিকাভুক্ত সকল হাসপাতাল, ডায়াগনস্টিক সেন্টার এবং ফার্মেসিতে আপনি এই কার্ডটি ব্যবহার করতে পারবেন। পার্টনারদের তালিকা প্রতিনিয়ত বৃদ্ধি পাচ্ছে।",
  },
  {
    question: "মেম্বারশিপের খরচ কত?",
    answer:
      "বর্তমানে প্রথম ১০০ জন সদস্যের জন্য আমরা সম্পূর্ণ ফ্রি 'ফাউন্ডিং মেম্বারশিপ' দিচ্ছি, যা ১ বছরের জন্য ফ্রি থাকবে। পরবর্তীতে প্রিমিয়াম মেম্বারশিপের জন্য বাৎসরিক ৫০০ টাকা ফি প্রযোজ্য হবে।",
  },
  {
    question: "পার্টনার হাসপাতালগুলো কীভাবে আমার কার্ড ভেরিফাই করবে?",
    answer:
      "আপনার ডিজিটাল মেম্বারশিপ কার্ডে একটি অনন্য কিউআর (QR) কোড থাকবে। হাসপাতাল কর্তৃপক্ষ তাদের মোবাইল বা স্ক্যানার দিয়ে এই কিউআর কোডটি স্ক্যান করলে একটি সুরক্ষিত ভেরিফিকেশন পেজ খুলবে, যেখানে আপনার নাম, মেম্বার আইডি এবং মেম্বারশিপ স্ট্যাটাস (Active/Inactive) দেখা যাবে।",
  },
  {
    question: "আমার কার্ড দিয়ে কি পরিবার বা আত্মীয়দের চিকিৎসার বিল পরিশোধ করে ডিসকাউন্ট পাওয়া যাবে?",
    answer:
      "হ্যাঁ! হেলথ ক্লাবের একজন মেম্বার তার কার্ড ব্যবহার করে নিজের পুরো পরিবার এবং আত্মীয়-স্বজনদের চিকিৎসার বিল পরিশোধ করতে পারবেন এবং নির্ধারিত সকল ডিসকাউন্ট সুবিধা উপভোগ করতে পারবেন।",
  },
];

/**
 * Server-rendered, accessible FAQ accordion using semantic HTML5 <details>/<summary>.
 * Requires zero JavaScript on the client side, eliminating script parsing & execution overhead.
 */
export default function FAQSection() {
  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      {FAQS.map((faq, idx) => (
        <details
          key={idx}
          className="group border border-border rounded-xl bg-background hover:bg-muted/30 transition-colors overflow-hidden"
        >
          <summary className="w-full flex justify-between items-center p-5 text-left font-heading font-bold text-secondary dark:text-white text-base md:text-lg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset cursor-pointer list-none [&::-webkit-details-marker]:hidden select-none">
            <span>{faq.question}</span>
            <ChevronDown className="h-5 w-5 text-primary shrink-0 transition-transform duration-300 group-open:rotate-180" />
          </summary>
          <div className="border-t border-border p-5">
            <p className="text-sm md:text-base leading-relaxed text-muted-foreground">
              {faq.answer}
            </p>
          </div>
        </details>
      ))}
    </div>
  );
}
