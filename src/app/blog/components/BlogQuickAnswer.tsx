import React from "react";
import { BlogPost } from "@/types/blog";
import { Zap, ShieldCheck, Phone, CheckCircle2, Award } from "lucide-react";
import { toBanglaNums } from "@/lib/utils";

interface BlogQuickAnswerProps {
  post: BlogPost;
}

export function BlogQuickAnswer({ post }: BlogQuickAnswerProps) {
  const highlights = post.keyHighlightsBn;

  // Determine top facilities or specialists count
  const facilityCount =
    (post.ambulances && post.ambulances.length) ||
    (post.bloodBanks && post.bloodBanks.length) ||
    (post.pharmacies && post.pharmacies.length) ||
    (post.hospitals && post.hospitals.length) ||
    (post.diagnosticCenters && post.diagnosticCenters.length) ||
    (post.dentalClinics && post.dentalClinics.length) ||
    (post.physiotherapyCenters && post.physiotherapyCenters.length) ||
    (post.doctorGroups && post.doctorGroups.flatMap((g) => g.doctors).length) ||
    0;

  const isAmbulanceGuide = Boolean(post.ambulances && post.ambulances.length > 0);

  // Emergency contact from post if available, else default hotline
  const primaryEmergency =
    post.emergencyDirectoryBn?.services[0]?.phone || "01886-763849";

  return (
    <section
      id="article-quick-summary"
      aria-label="সংক্ষেপে মূল তথ্য ও সারসংক্ষেপ"
      className="rounded-3xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card p-5 sm:p-7 shadow-sm space-y-4"
    >
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-primary/20 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
            <Zap className="h-4 w-4 fill-primary" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary block">
              একনজরে সরাসরি প্রশ্নোত্তর • এআই সারসংক্ষেপ
            </span>
            <h2 className="font-heading text-base sm:text-lg font-bold text-foreground">
              রোগী ও স্বজনদের জন্য দ্রুত সিদ্ধান্ত গাইড
            </h2>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-semibold">
          <Award className="h-3.5 w-3.5" />
          <span>
            {`${toBanglaNums(facilityCount)}টি যাচাইকৃত প্রতিষ্ঠান`}
          </span>
        </div>
      </div>

      {/* Direct Factual Summary paragraph for AI engines and patients */}
      <div className="text-sm text-foreground/90 leading-relaxed space-y-2.5">
        <p>
          {isAmbulanceGuide
            ? "ফেনী জেলা ও মহাসড়কে জরুরি অ্যাম্বুলেন্স, আইসিইউ লাইফ সাপোর্ট ও অক্সিজেন সেবার তথ্যে সহায়তা করতে এটি একটি উন্মুক্ত জরুরি পাবলিক ডিরেক্টরি। জরুরি মুহূর্তে রোগী দ্রুত স্থানান্তরের স্বার্থে দালাল চক্র এড়িয়ে সরাসরি যাচাইকৃত ড্রাইভার ও এজেন্সির সাথে কথা বলে সাধারণ প্রমিত ভাড়ায় দ্রুত সেবা নিশ্চিত করা সম্ভব।"
            : "ফেনী জেলা ও পার্শ্ববর্তী অঞ্চলের রোগীদের জন্য এই গাইডে শীর্ষ হাসপাতাল, বিশেষজ্ঞ ডাক্তার, ডায়াগনস্টিক ল্যাব ও ফিজিওথেরাপি সেন্টারের যাচাইকৃত তথ্য তুলে ধরা হয়েছে। জরুরি ভর্তি, আইসিইউ/সিসিইউ সুবিধা ও হেলথ ক্লাবের ডিজিটাল কার্ডে সর্বোচ্চ ১০% থেকে ৩০% পর্যন্ত বিশেষ ছাড় সুবিধা পাওয়া যাবে।"}
        </p>
      </div>

      {/* Quick Core Highlights Grid */}
      {highlights && highlights.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {highlights.slice(0, 4).map((highlight, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2 rounded-xl bg-card/80 border border-border/80 p-2.5 text-xs sm:text-[13px] text-foreground/85"
            >
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span className="leading-snug">{highlight}</span>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Action / Helpline Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-border/70 text-xs">
        <div className="flex items-center gap-2 text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
          <span>
            হেলথ ক্লাব ক্লিনিক্যাল এডিটোরিয়াল বোর্ড কর্তৃক সরেজমিনে তথ্যের সত্যতা যাচাইকৃত (২০২৬)
          </span>
        </div>

        <a
          href={`tel:${primaryEmergency.replace(/[^0-9]/g, "")}`}
          className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shrink-0 shadow-xs"
        >
          <Phone className="h-3.5 w-3.5" />
          <span>
            জরুরি হটলাইন: {primaryEmergency}
          </span>
        </a>
      </div>
    </section>
  );
}
