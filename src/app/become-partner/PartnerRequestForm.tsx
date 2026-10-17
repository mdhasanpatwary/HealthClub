"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Building2,
  Activity,
  Pill,
  CheckCircle2,
  Loader2,
  Send,
  PhoneCall,
  User,
  MapPin,
  Tag,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  partnerRequestSchema,
  type PartnerRequestFormValues,
} from "@/lib/validations/partnerRequest";
import { addPartnerRequestAction } from "@/app/actions/partnerActions";
import { WhatsAppIcon } from "@/components/ui/SocialBrandIcons";
import { getWhatsAppUniversalUrl } from "@/lib/whatsapp";

interface PartnerRequestFormProps {
  hotline?: string;
}

const CATEGORIES = [
  { id: "hospital", label: "হাসপাতাল ও ক্লিনিক", icon: Building2 },
  { id: "diagnostic", label: "ডায়াগনস্টিক ও ল্যাব", icon: Activity },
  { id: "pharmacy", label: "মডেল ফার্মেসি", icon: Pill },
] as const;

export default function PartnerRequestForm({ hotline }: PartnerRequestFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [submittedOrgName, setSubmittedOrgName] = useState("");

  const effectiveHotline = (hotline || "01886763849").replace(/[^0-9]/g, "");

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PartnerRequestFormValues>({
    resolver: zodResolver(partnerRequestSchema),
    defaultValues: {
      orgName: "",
      category: "hospital",
      address: "",
      discount: "প্যাথলজি ও টেস্টে ২০% ছাড়, বেড ভাড়ায় ১৫% ছাড়",
      contactName: "",
      phone: "",
      email: "",
      upazilaConsent: true,
    },
  });

  const selectedCategory = useWatch({ control, name: "category" });

  const onSubmit = async (values: PartnerRequestFormValues) => {
    try {
      const result = await addPartnerRequestAction({
        orgName: values.orgName.trim(),
        category: values.category,
        address: values.address.trim(),
        discount: values.discount.trim(),
        contactName: values.contactName.trim(),
        phone: values.phone.trim(),
        email: values.email.trim(),
      });

      if (!result?.success) {
        toast.error(result?.error || "একটি সমস্যা হয়েছে, আবার চেষ্টা করুন।");
        return;
      }

      setSubmittedOrgName(values.orgName.trim());
      setSubmitted(true);
      reset();
      toast.success("আবেদনটি সফলভাবে জমা হয়েছে! আমাদের টিম দ্রুত যোগাযোগ করবে।");
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "একটি সমস্যা হয়েছে, আবার চেষ্টা করুন।"
      );
    }
  };

  const whatsappFastTrackUrl = getWhatsAppUniversalUrl(
    effectiveHotline,
    "আমি একজন স্বাস্থ্যসেবা প্রতিষ্ঠানের কর্মকর্তা। হেলথ ক্লাব ফেনী পার্টনার নেটওয়ার্কে আমাদের হাসপাতাল/ল্যাব যুক্ত করার জন্য প্রতিষ্ঠানের তথ্য ও লাইসেন্স পাঠাতে চাই।"
  );

  return (
    <Card className="border border-border/80 bg-card/80 backdrop-blur-sm shadow-xl rounded-3xl overflow-hidden">
      <CardContent className="p-6 sm:p-8">
        {submitted ? (
          <div className="text-center py-10 space-y-5">
            <div className="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-10 w-10 text-primary animate-pulse" />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold text-primary uppercase tracking-wider font-mono">
                আবেদন গৃহীত হয়েছে
              </span>
              <h2 className="font-heading text-2xl font-bold text-secondary dark:text-white">
                {submittedOrgName || "আপনার প্রতিষ্ঠান"} এর আবেদন সফলভাবে জমা হয়েছে!
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                আমাদের পার্টনারশিপ রিলেশন প্রতিনিধি আগামী ২৪ ঘণ্টার মধ্যে আপনার সাথে যোগাযোগ করে ট্রেড লাইসেন্স ও সমঝোতা চুক্তি (MoU) স্বাক্ষর প্রক্রিয়া সম্পন্ন করবেন। এরপরই ডেডিকেটেড ডিজিটাল পার্টনার ড্যাশবোর্ড ও কিউআর স্ক্যানার বুঝিয়ে দেওয়া হবে।
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Button
                onClick={() => setSubmitted(false)}
                variant="outline"
                className="rounded-xl border-primary/30 text-primary hover:bg-primary/10 cursor-pointer font-bold text-xs"
              >
                আরেকটি আবেদন করুন
              </Button>
              <a
                href={whatsappFastTrackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
              >
                <WhatsAppIcon className="h-4 w-4 fill-white" />
                <span>জরুরি WhatsApp যোগাযোগ</span>
              </a>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1">
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-secondary dark:text-white flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary shrink-0" />
                <span>পার্টনারশিপ আবেদন ফরম</span>
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                ফেনী সদরের লাইসেন্সপ্রাপ্ত বেসরকারি হাসপাতাল, ডায়াগনস্টিক ও ফার্মেসির জন্য সম্পূর্ণ ফ্রি তালিকাভুক্তি।
              </p>
            </div>

            {/* Category Selector Chips */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-secondary dark:text-white flex items-center gap-1.5">
                <span>প্রতিষ্ঠানের ধরণ / ক্যাটাগরি *</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setValue("category", cat.id, { shouldValidate: true })}
                      className={`flex items-center gap-2 p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? "bg-primary text-white border-primary shadow-xs ring-2 ring-primary/20"
                          : "bg-background text-foreground border-border hover:bg-muted"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
              {errors.category && (
                <p className="text-2xs text-rose-600 font-medium">{errors.category.message}</p>
              )}
            </div>

            {/* Organization Name */}
            <div className="space-y-1.5">
              <label htmlFor="partner-orgName" className="text-xs font-semibold text-secondary dark:text-white cursor-pointer flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                <span>হাসপাতাল / ল্যাব / ফার্মেসির সম্পূর্ণ নাম *</span>
              </label>
              <Input
                id="partner-orgName"
                {...register("orgName")}
                placeholder="যেমন: কনসেপ্ট হসপিটাল অ্যান্ড ডায়াগনস্টিক সেন্টার"
                className="rounded-xl border-border bg-background/50 h-11 text-xs sm:text-sm"
              />
              {errors.orgName && (
                <p className="text-2xs text-rose-600 font-medium">{errors.orgName.message}</p>
              )}
            </div>

            {/* Full Address */}
            <div className="space-y-1.5">
              <label htmlFor="partner-address" className="text-xs font-semibold text-secondary dark:text-white cursor-pointer flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                <span>প্রতিষ্ঠানের পূর্ণ ঠিকানা (ফেনী সদর) *</span>
              </label>
              <Input
                id="partner-address"
                {...register("address")}
                placeholder="যেমন: এসএসকে রোড (সদর হাসপাতালের বিপরীতে), ফেনী সদর"
                className="rounded-xl border-border bg-background/50 h-11 text-xs sm:text-sm"
              />
              {errors.address && (
                <p className="text-2xs text-rose-600 font-medium">{errors.address.message}</p>
              )}
            </div>

            {/* Proposed Discount */}
            <div className="space-y-1.5">
              <label htmlFor="partner-discount" className="text-xs font-semibold text-secondary dark:text-white cursor-pointer flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-primary" />
                <span>মেম্বারদের জন্য প্রস্তাবিত ডিসকাউন্ট রেঞ্জ (১০-৩০% মেম্বার ছাড়) *</span>
              </label>
              <Input
                id="partner-discount"
                {...register("discount")}
                placeholder="যেমন: প্যাথলজিতে ২৫%, এক্স-রে/ইউএসজিতে ২০% ও বেড ভাড়ায় ১৫% ছাড়"
                className="rounded-xl border-border bg-background/50 h-11 text-xs sm:text-sm"
              />
              <p className="text-[11px] text-muted-foreground">
                হেলথ ক্লাব নীতি অনুযায়ী নির্দিষ্ট টাকার অঙ্ক নয়, ১০-৩০% শতকরা মেম্বার ছাড় প্রদর্শিত হয়।
              </p>
              {errors.discount && (
                <p className="text-2xs text-rose-600 font-medium">{errors.discount.message}</p>
              )}
            </div>

            {/* Contact Person Name */}
            <div className="space-y-1.5">
              <label htmlFor="partner-contactName" className="text-xs font-semibold text-secondary dark:text-white cursor-pointer flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                <span>যোগাযোগকারী কর্মকর্তা বা প্রতিনিধির নাম ও পদবী *</span>
              </label>
              <Input
                id="partner-contactName"
                {...register("contactName")}
                placeholder="যেমন: মোঃ আশরাফুল কবির (ম্যানেজিং ডিরেক্টর / অ্যাডমিন)"
                className="rounded-xl border-border bg-background/50 h-11 text-xs sm:text-sm"
              />
              {errors.contactName && (
                <p className="text-2xs text-rose-600 font-medium">{errors.contactName.message}</p>
              )}
            </div>

            {/* Phone and Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label htmlFor="partner-phone" className="text-xs font-semibold text-secondary dark:text-white cursor-pointer flex items-center gap-1.5">
                  <PhoneCall className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>অফিসিয়াল মোবাইল নম্বর *</span>
                </label>
                <Input
                  id="partner-phone"
                  type="tel"
                  {...register("phone")}
                  placeholder="018XXXXXXXX"
                  className="rounded-xl border-border bg-background/50 h-11 text-xs sm:text-sm"
                />
                {errors.phone && (
                  <p className="text-2xs text-rose-600 font-medium">{errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="partner-email" className="text-xs font-semibold text-secondary dark:text-white cursor-pointer flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>অফিসিয়াল ইমেইল অ্যাড্রেস *</span>
                </label>
                <Input
                  id="partner-email"
                  type="email"
                  {...register("email")}
                  placeholder="contact@hospital.com"
                  className="rounded-xl border-border bg-background/50 h-11 text-xs sm:text-sm"
                />
                {errors.email && (
                  <p className="text-2xs text-rose-600 font-medium">{errors.email.message}</p>
                )}
              </div>
            </div>

            {/* Geographic & Compliance Checkbox */}
            <div className="p-3.5 rounded-2xl bg-muted/60 border border-border/80 space-y-2">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-foreground leading-relaxed select-none">
                <input
                  type="checkbox"
                  {...register("upazilaConsent")}
                  className="mt-0.5 rounded border-border text-primary focus:ring-primary size-4 shrink-0 cursor-pointer"
                />
                <span>
                  আমাদের প্রতিষ্ঠানটি <strong>ফেনী সদর</strong> সীমানায় অবস্থিত এবং সরকারের স্বাস্থ্য অধিদপ্তর (DGHS) বা সংশ্লিষ্ট কর্তৃপক্ষের যথাযথ লাইসেন্স রয়েছে।
                </span>
              </label>
              {errors.upazilaConsent && (
                <p className="text-2xs text-rose-600 font-medium">{errors.upazilaConsent.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-primary hover:bg-primary-dark text-white font-bold rounded-2xl transition-all shadow-md hover:shadow-lg cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>আবেদন জমা দেওয়া হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  <span>পার্টনার আবেদন জমা দিন</span>
                </>
              )}
            </Button>

            {/* WhatsApp Alternative */}
            <div className="pt-2 text-center space-y-2">
              <p className="text-2xs text-muted-foreground">
                অনলাইন ফরম পূরণের সময় না থাকলে সরাসরি WhatsApp-এ ভিজিটিং কার্ড পাঠান:
              </p>
              <a
                href={whatsappFastTrackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 text-xs font-bold transition-colors cursor-pointer"
              >
                <WhatsAppIcon className="h-4 w-4 fill-emerald-600" />
                <span>WhatsApp-এ কার্ড বা লাইসেন্স ছবি পাঠান (+880 {effectiveHotline.replace(/^0/, "")})</span>
              </a>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}