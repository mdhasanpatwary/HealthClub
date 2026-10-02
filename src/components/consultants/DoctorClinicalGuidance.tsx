import { Doctor } from "@/services/db";
import {
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ListChecks,
  PhoneCall,
  Activity,
  Hospital
} from "lucide-react";

interface DoctorClinicalGuidanceProps {
  doctor: Doctor;
}

/**
 * Clinical Guidance, Preparation Checklist & Emergency Warnings.
 * Remediates directory thin content by equipping patients with actionable clinical guidance
 * and crucial emergency triage warnings before outdoor chamber visits.
 */
export function DoctorClinicalGuidance({ doctor }: DoctorClinicalGuidanceProps) {
  return (
    <div className="space-y-6">
      {/* Patient Preparation Checklist */}
      <section
        aria-labelledby="prep-checklist-heading"
        className="rounded-3xl border border-border/80 bg-card p-5 sm:p-7 shadow-xs space-y-5"
      >
        <div className="flex items-center gap-3 pb-3 border-b border-border/60">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <ListChecks className="h-5 w-5" />
          </div>
          <div>
            <h2 id="prep-checklist-heading" className="font-heading font-bold text-base sm:text-lg text-foreground">
              চেম্বারে আসার পূর্বে রোগীর প্রস্তুতি ও চেকলিস্ট
            </h2>
            <p className="text-xs text-muted-foreground">
              {doctor.name}-এর চেম্বারে সময় বাঁচিয়ে সুনির্দিষ্ট চিকিৎসা পাওয়ার জন্য
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
          <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-2">
            <div className="flex items-center gap-2 text-foreground font-bold text-xs sm:text-sm">
              <FileText className="h-4 w-4 text-primary shrink-0" />
              <span>পূর্বের প্রেসক্রিপশন ও কাগজপত্র</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              পূর্বে দেখানো সকল ডাক্তারের ব্যবস্থাপত্র ও প্রেসক্রিপশন ক্রমানুসারে গুছিয়ে ফাইলে সাথে রাখুন।
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-2">
            <div className="flex items-center gap-2 text-foreground font-bold text-xs sm:text-sm">
              <Activity className="h-4 w-4 text-primary shrink-0" />
              <span>নিয়মিত ওষুধের সঠিক তালিকা</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              ডায়াবেটিস, প্রেশার, থাইরয়েড বা হার্টের যেসব ওষুধ নিয়মিত সেবন করছেন তার নাম বা স্ট্রিপ সাথে রাখুন।
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-2">
            <div className="flex items-center gap-2 text-foreground font-bold text-xs sm:text-sm">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>সাম্প্রতিক টেস্ট রিপোর্ট</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              রক্ত পরীক্ষা, এক্স-রে, আল্ট্রাসনোগ্রাম বা ইসিজি রিপোর্টের মূল কপি ডাক্তারের সামনে উপস্থাপনের জন্য প্রস্তুত রাখুন।
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-2">
            <div className="flex items-center gap-2 text-foreground font-bold text-xs sm:text-sm">
              <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>উপসর্গের সময়কাল ও বিবরণ</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              সমস্যাটি কবে শুরু হয়েছে, ব্যথার তীব্রতা এবং কোনো বিশেষ সময়ে বাড়ে কি না তা সংক্ষেপে ডাক্তারকে জানান।
            </p>
          </div>
        </div>
      </section>

      {/* Appointment & Chamber Serial Protocol */}
      <section
        aria-labelledby="serial-protocol-heading"
        className="rounded-3xl border border-border/80 bg-card p-5 sm:p-7 shadow-xs space-y-4"
      >
        <div className="flex items-center gap-3 pb-3 border-b border-border/60">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <PhoneCall className="h-5 w-5" />
          </div>
          <div>
            <h2 id="serial-protocol-heading" className="font-heading font-bold text-base sm:text-lg text-foreground">
              সিরিয়াল ও অ্যাপয়েন্টমেন্ট প্রটোকল
            </h2>
            <p className="text-xs text-muted-foreground">
              চেম্বারে নির্বিঘ্ন সেবা গ্রহণের নির্দেশিকা
            </p>
          </div>
        </div>

        <ul className="space-y-3 text-xs sm:text-sm text-muted-foreground">
          <li className="flex items-start gap-3">
            <span className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              ১
            </span>
            <span>
              <strong className="text-foreground">সরাসরি বুকিং:</strong> কোনো মধ্যস্বত্বভোগী ছাড়া উপরে উল্লেখিত অফিসিয়াল নাম্বারে সরাসরি কল করে সিরিয়াল কনফার্ম করুন।
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              ২
            </span>
            <span>
              <strong className="text-foreground">আগাম উপস্থিতি:</strong> ভিড় এড়াতে এবং প্রাথমিক ব্লাড প্রেশার/ওজন পরীক্ষার জন্য নির্ধারিত চেম্বার সময়ের অন্তত ১৫-২০ মিনিট পূর্বে উপস্থিত হোন।
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              ৩
            </span>
            <span>
              <strong className="text-foreground">মেম্বার সুবিধা:</strong> ডাক্তার দেখানোর পর প্রেসক্রিপশন অনুযায়ী সকল ডায়াগনস্টিক পরীক্ষায় ফেনী সদরের পার্টনার সেন্টারে ১০-৩০% মেম্বার ছাড় উপভোগ করতে আপনার হেলথ ক্লাব ডিজিটাল কার্ড প্রদর্শন করুন।
            </span>
          </li>
        </ul>
      </section>

      {/* Emergency Advisory Callout */}
      <section
        aria-labelledby="emergency-warning-heading"
        className="rounded-3xl border border-red-500/30 bg-red-500/5 p-5 sm:p-6 shadow-xs space-y-3"
      >
        <div className="flex items-center gap-2.5 text-red-700 dark:text-red-400 font-bold text-sm sm:text-base">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <h2 id="emergency-warning-heading">জরুরি স্বাস্থ্য সতর্কতা (ইমার্জেন্সি নির্দেশনা)</h2>
        </div>
        <p className="text-xs sm:text-sm text-foreground/85 leading-relaxed">
          ডাক্তারের এই ব্যক্তিগত চেম্বার শুধুমাত্র সিডিউলড আউটডোর কনসালটেশনের জন্য। <strong>তীব্র বুকে ব্যথা, মারাত্মক শ্বাসকষ্ট, হঠাৎ অজ্ঞান হওয়া, স্ট্রোকের লক্ষণ, অতিরিক্ত রক্তক্ষরণ</strong> বা যেকোনো আশঙ্কাজনক অবস্থায় আউটডোর চেম্বারের অপেক্ষায় না থেকে অবিলম্বে রোগীকে <strong>২৫০ শয্যা বিশিষ্ট জেনারেল হাসপাতাল, ফেনী (সদর হাসপাতাল)</strong>-এর জরুরি বিভাগে অথবা নিকটস্থ হাসপাতালে স্থানান্তর করুন।
        </p>
        <div className="flex items-center gap-2 text-[11px] text-red-700/80 dark:text-red-400/80 font-semibold pt-1">
          <Hospital className="h-4 w-4 shrink-0" />
          <span>ফেনী সদর হাসপাতাল জরুরি বিভাগ ২৪ ঘণ্টা খোলা থাকে।</span>
        </div>
      </section>
    </div>
  );
}
