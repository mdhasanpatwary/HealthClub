import { ShieldAlert } from "lucide-react";

export function MedicalDisclaimer() {
  return (
    <div className="rounded-2xl border border-border/80 bg-muted/30 p-4 sm:p-5 flex items-start gap-3.5 text-muted-foreground">
      <ShieldAlert className="h-5 w-5 text-primary shrink-0 mt-0.5" />
      <div className="space-y-1 text-xs leading-relaxed">
        <p className="font-bold text-foreground">
          মেডিকেল ও স্বাস্থ্য তথ্য বিষয়ক সতর্কবার্তা
        </p>
        <p>
          হেলথ ক্লাবের সকল স্বাস্থ্য টিপস ও গাইড নিবন্ধিত চিকিৎসকদের পরামর্শ ও আন্তর্জাতিক মেডিকেল গাইডলাইনের ভিত্তিতে প্রস্তুতকৃত। এই তথ্যগুলো স্বাস্থ্য সচেতনতা বৃদ্ধির উদ্দেশ্যে তৈরি এবং এটি চিকিৎসকের সরাসরি প্রেসক্রিপশন বা ক্লিনিক্যাল ডায়াগনোসিসের বিকল্প নয়। জরুরি বা জটিল শারীরিক সমস্যায় অবিলম্বে বিশেষজ্ঞ ডাক্তারের পরামর্শ নিন অথবা নিকটস্থ হাসপাতালের জরুরি বিভাগে যোগাযোগ করুন।
        </p>
      </div>
    </div>
  );
}

