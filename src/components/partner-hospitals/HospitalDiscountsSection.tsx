import { Tag, Check, ShieldCheck } from "lucide-react";
import { DepartmentDiscount, Partner } from "@/services/db";
import { Badge } from "@/components/ui/badge";
import { formatDiscount } from "@/lib/utils";

interface HospitalDiscountsSectionProps {
  partner: Partner;
}

export default function HospitalDiscountsSection({ partner }: HospitalDiscountsSectionProps) {
  const isPharmacy = partner.category === "pharmacy";
  const isDiagnostic = partner.category === "diagnostic";

  let deptList: DepartmentDiscount[] = [];
  if (partner.departmentDiscounts) {
    try {
      const parsed = JSON.parse(partner.departmentDiscounts);
      if (Array.isArray(parsed) && parsed.length > 0) {
        deptList = parsed;
      }
    } catch {
      // ignore JSON parse error
    }
  }

  // Fallback itemized discounts based on category if custom departmentDiscounts is not configured
  if (deptList.length === 0) {
    if (partner.category === "hospital") {
      deptList = [
        {
          name: "প্যাথলজি ও রক্ত পরীক্ষা",
          discount: partner.discount || "২০-৩০%",
          description: "সকল প্রকার রক্ত, হরমোন ও বায়োকেমিস্ট্রি পরীক্ষা",
        },
        {
          name: "ডিজিটাল এক্স-রে ও ইমেজিং",
          discount: "১৫-২০%",
          description: "ডিজিটাল এক্স-রে, ৪ডি আল্ট্রাসনোগ্রাফি ও ইকো পরীক্ষা",
        },
        {
          name: "কেবিন ও বেড ভাড়া",
          discount: "১০%",
          description: "ইনডোর এসি/নন-এসি কেবিন ও বেড চার্জে বিশেষ ছাড়",
        },
        {
          name: "ফার্মেসি ঔষধ সেবা",
          discount: "৭-১০%",
          description: "প্রয়োজনীয় ইন-হাউজ প্রেসক্রিপশন মেডিসিন",
        },
      ];
    } else if (partner.category === "diagnostic") {
      deptList = [
        {
          name: "রুটিন প্যাথলজি পরীক্ষা",
          discount: partner.discount || "২০-৩০%",
          description: "সিবিসি, রক্তের চর্বি, প্রস্রাব ও অন্যান্য রুটিন পরীক্ষা",
        },
        {
          name: "হরমোন ও বিশেষায়িত টেস্ট",
          discount: "২০-২৫%",
          description: "থাইরয়েড, ভিটামিন ডি, হিমোগ্লোবিন এ১সি ও টিউমার মার্কার",
        },
        {
          name: "রেডিওলজি ও ইউএসজি",
          discount: "১৫-২০%",
          description: "ডিজিটাল এক্স-রে ও হোল এবডোমেন আল্ট্রাসনোগ্রাম",
        },
        {
          name: "ইসিজি, ইকো ও এন্ডোস্কোপি",
          discount: "১৫%",
          description: "১২-লিড ইসিজি, কালার ডপলার ইকো ও ডায়াগনস্টিক স্কোপ",
        },
      ];
    } else {
      deptList = [
        {
          name: "প্রেসক্রিপশন মেডিসিন",
          discount: partner.discount || "৮-১২%",
          description: "সকল স্থানীয় ও আমদানিকৃত রেজিস্টার্ড ঔষধ",
        },
        {
          name: "সার্জিক্যাল ও হেলথকেয়ার আইটেম",
          discount: "৫-১০%",
          description: "প্রেসার মাপার মেশিন, ডায়াবেটিস স্ট্রিপ ও সার্জিক্যাল সামগ্রী",
        },
        {
          name: "শিশু ও মাতৃত্বকালীন যত্ন সামগ্রী",
          discount: "৫-৮%",
          description: "বেবি ডায়াপার, বেবি ফুড ও মাতৃত্বকালীন স্বাস্থ্যপণ্য",
        },
        {
          name: "ভিটামিন ও নিউট্রিশন সাপ্লিমেন্ট",
          discount: "৫-১০%",
          description: "মাল্টিভিটামিন, ক্যালসিয়াম ও স্বাস্থ্যবর্ধক সাপ্লিমেন্ট",
        },
      ];
    }
  }

  const categoryDiscountTitle = isPharmacy
    ? "ফার্মেসি পণ্যের ছাড় তালিকা"
    : isDiagnostic
    ? "ডায়াগনস্টিক টেস্টের ছাড় তালিকা"
    : "বিভাগভিত্তিক মেম্বার ডিসকাউন্ট তালিকা";

  const discountAvailTitle = isPharmacy
    ? "কীভাবে এই ফার্মেসিতে ডিসকাউন্ট পাবেন?"
    : isDiagnostic
    ? "কীভাবে এই ডায়াগনস্টিক সেন্টারে ডিসকাউন্ট পাবেন?"
    : "কীভাবে এই হাসপাতালে ডিসকাউন্ট পাবেন?";

  const discountAvailDesc = isPharmacy
    ? "ফার্মেসির ক্যাশ কাউন্টারে ঔষধ বিল করার পূর্বে আপনার ডিজিটাল অথবা ফিজিক্যাল হেলথ ক্লাব মেম্বার কার্ড প্রদর্শন করুন।"
    : "বিলিং বা ক্যাশ কাউন্টারে ইনভয়েস করার পূর্বে আপনার ডিজিটাল অথবা ফিজিক্যাল হেলথ ক্লাব মেম্বার কার্ড প্রদর্শন করুন।";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-secondary dark:text-white font-heading flex items-center gap-2">
            <Tag className="h-5 w-5 text-primary" />
            {categoryDiscountTitle}
          </h2>
          <p className="text-xs text-muted-foreground">
            হেলথ ক্লাব মেম্বার কার্ডধারীদের জন্য নির্ধারিত নিশ্চিত সাশ্রয়ী ছাড়
          </p>
        </div>
        <Badge
          variant="secondary"
          className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 font-bold px-3 py-1 text-xs"
        >
          সরাসরি কাউন্টারে ছাড়
        </Badge>
      </div>

      {/* Itemized Discount Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {deptList.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl border border-border/80 bg-background/80 dark:bg-slate-900/60 shadow-2xs hover:border-primary/40 transition-all flex flex-col justify-between"
          >
            <div className="space-y-1.5">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-xs sm:text-sm font-bold text-secondary dark:text-white font-heading">
                  {item.name}
                </h3>
                <span className="shrink-0 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-primary/10 text-primary border border-primary/20">
                  {formatDiscount(item.discount)}
                </span>
              </div>
              {item.description && (
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              )}
            </div>

            <div className="pt-2.5 mt-2.5 border-t border-border/40 flex items-center justify-between text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                <Check className="h-3 w-3" />
                তাৎক্ষণিক ক্যাশ মেমোতে ছাড়
              </span>
              <span className="font-mono text-muted-foreground/80">#Dept-{idx + 1}</span>
            </div>
          </div>
        ))}
      </div>

      {/* How to avail info banner */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-primary/5 to-emerald-500/10 border border-primary/20 flex items-center gap-3">
        <div className="p-2 rounded-xl bg-primary text-white shrink-0 shadow-xs">
          <ShieldCheck className="h-4 w-4" />
        </div>
        <div className="text-xs">
          <p className="font-bold text-secondary dark:text-white">
            {discountAvailTitle}
          </p>
          <p className="text-muted-foreground text-[11px] mt-0.5">
            {discountAvailDesc}
          </p>
        </div>
      </div>
    </div>
  );
}
