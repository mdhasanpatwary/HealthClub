"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Link from "next/link";
import {
  Heart,
  Droplets,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  MapPin,
  PhoneCall,
  User,
  Calendar,
  Send,
  Sparkles,
  Info,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  bloodDonorRegistrationPageSchema,
  type BloodDonorRegistrationPageFormValues,
} from "@/lib/validations/emergency";
import { registerBloodDonorAction } from "@/app/actions/emergencyActions";
import { UPAZILAS_FENI, BLOOD_GROUPS } from "@/data/emergencyData";

const COMMON_DONATION_INTERVALS = [
  "কখনো দেইনি (নতুন)",
  "৩ মাস আগে",
  "৪-৬ মাস আগে",
  "১ বছর আগে",
];

export default function BloodDonorRegistrationForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submittedDonorName, setSubmittedDonorName] = useState("");
  const [submittedGroup, setSubmittedGroup] = useState("");

  const validUpazilas = UPAZILAS_FENI.filter((u) => u.id !== "all");

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BloodDonorRegistrationPageFormValues>({
    resolver: zodResolver(bloodDonorRegistrationPageSchema),
    defaultValues: {
      name: "",
      phone: "",
      altPhone: "",
      bloodGroup: "O+",
      upazila: "feni-sadar",
      specificArea: "",
      lastDonated: "",
      notes: "",
      eligibilityConsent: true,
    },
  });

  const selectedBloodGroup = useWatch({ control, name: "bloodGroup" });
  const selectedUpazila = useWatch({ control, name: "upazila" });
  const selectedLastDonated = useWatch({ control, name: "lastDonated" });

  const onSubmit = async (values: BloodDonorRegistrationPageFormValues) => {
    try {
      const selectedUpazilaObj = validUpazilas.find((u) => u.id === values.upazila);
      const upazilaLabel = selectedUpazilaObj?.nameBn || values.upazila;

      const res = await registerBloodDonorAction({
        name: values.name.trim(),
        phone: values.phone.trim(),
        altPhone: values.altPhone?.trim() || undefined,
        bloodGroup: values.bloodGroup,
        upazila: upazilaLabel,
        specificArea: values.specificArea?.trim() || undefined,
        lastDonated: values.lastDonated?.trim() || undefined,
        notes: values.notes?.trim() || undefined,
      });

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      setSubmittedDonorName(values.name);
      setSubmittedGroup(values.bloodGroup);
      setSubmitted(true);
      reset();
      toast.success(res.message);
    } catch {
      toast.error("তথ্য জমা দিতে সমস্যা হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর চেষ্টা করুন বা সরাসরি WhatsApp-এ জানান।");
    }
  };

  if (submitted) {
    return (
      <Card className="border border-rose-500/20 bg-card shadow-sm rounded-3xl overflow-hidden">
        <CardContent className="p-8 sm:p-12 text-center space-y-6">
          <div className="h-16 w-16 bg-rose-500/10 text-rose-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-10 w-10 text-rose-600 animate-pulse" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-700 dark:text-rose-400 text-xs font-bold">
              <Droplets className="h-3.5 w-3.5 text-rose-600" />
              রক্তের গ্রুপ: {submittedGroup}
            </span>
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-secondary dark:text-white">
              অভিনন্দন {submittedDonorName}!
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              স্বেচ্ছাসেবী রক্তদাতা হিসেবে আপনার আবেদনটি সফলভাবে জমা হয়েছে। আমাদের সমন্বয়ক টিম যাচাই শেষে ২৪ ঘণ্টার মধ্যে তালিকায় যুক্ত করবে।
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-muted/40 border border-border/80 text-left max-w-md mx-auto space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2 font-bold text-foreground">
              <ShieldCheck className="h-4 w-4 text-rose-600" />
              <span>পরবর্তী করণীয়:</span>
            </div>
            <p>
              • আপনার মোবাইলে আমাদের অফিসিয়াল নম্বর থেকে একটি কনফার্মেশন কল আসতে পারে।
            </p>
            <p>
              • জরুরি প্রয়োজনে কোনো মুমূর্ষু রোগীর রক্ত সংকট দেখা দিলে হাসপাতাল বা রোগীর স্বজন আপনাকে ফোন করতে পারেন।
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/emergency/blood-donors"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors"
            >
              <Heart className="h-4 w-4 fill-white" />
              <span>রক্তদাতা ডিরেক্টরিতে ফিরে যান</span>
            </Link>
            <Button
              variant="outline"
              onClick={() => setSubmitted(false)}
              className="w-full sm:w-auto rounded-xl text-xs sm:text-sm font-semibold cursor-pointer"
            >
              আরেকটি নিবন্ধন করুন
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border/80 bg-card shadow-sm rounded-3xl overflow-hidden">
      <div className="p-6 sm:p-8 border-b border-border/60 bg-linear-to-r from-rose-500/10 via-rose-500/5 to-transparent">
        <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider mb-1">
          <Sparkles className="h-4 w-4" />
          <span>স্বেচ্ছাসেবী রক্তদাতা তালিকাভুক্তি ফরম</span>
        </div>
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-secondary dark:text-white">
          আপনার রক্তদানের তথ্য পূরণ করুন
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          লাল তারকাচিহ্নিত (<span className="text-rose-500">*</span>) ঘরগুলো পূরণ করা বাধ্যতামূলক
        </p>
      </div>

      <CardContent className="p-6 sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Blood Group Selection Chips */}
          <div className="space-y-2.5">
            <Label className="text-xs sm:text-sm font-bold text-foreground flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Droplets className="h-4 w-4 text-rose-600" />
                আপনার রক্তের গ্রুপ নির্বাচন করুন <span className="text-rose-500">*</span>
              </span>
              <span className="text-2xs text-muted-foreground font-normal">
                (সঠিক গ্রুপ নির্বাচন জরুরি)
              </span>
            </Label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {BLOOD_GROUPS.map((bg) => {
                const isSelected = selectedBloodGroup === bg;
                return (
                  <button
                    key={bg}
                    type="button"
                    onClick={() =>
                      setValue(
                        "bloodGroup",
                        bg as BloodDonorRegistrationPageFormValues["bloodGroup"],
                        { shouldValidate: true }
                      )
                    }
                    className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all border cursor-pointer text-center ${
                      isSelected
                        ? "bg-rose-600 border-rose-600 text-white shadow-md scale-102"
                        : "bg-muted/50 hover:bg-muted border-border/80 text-foreground"
                    }`}
                  >
                    {bg}
                  </button>
                );
              })}
            </div>
            {errors.bloodGroup && (
              <p className="text-xs text-destructive">{errors.bloodGroup.message}</p>
            )}
          </div>

          {/* Full Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="donor-reg-name" className="text-xs sm:text-sm font-bold text-foreground">
                পূর্ণ নাম <span className="text-rose-500">*</span>
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="donor-reg-name"
                  placeholder="যেমন: তানভীর আহমেদ"
                  className="pl-9 h-11 rounded-xl text-xs sm:text-sm"
                  {...register("name")}
                />
              </div>
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="donor-reg-phone" className="text-xs sm:text-sm font-bold text-foreground">
                মোবাইল নম্বর <span className="text-rose-500">*</span>
              </Label>
              <div className="relative">
                <PhoneCall className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="donor-reg-phone"
                  placeholder="যেমন: 018XXXXXXXX"
                  className="pl-9 h-11 rounded-xl text-xs sm:text-sm font-mono"
                  {...register("phone")}
                />
              </div>
              {errors.phone && (
                <p className="text-xs text-destructive">{errors.phone.message}</p>
              )}
            </div>
          </div>

          {/* Alternate Phone & Upazila */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="donor-reg-alt-phone" className="text-xs sm:text-sm font-bold text-foreground">
                বিকল্প নম্বর বা WhatsApp (ঐচ্ছিক)
              </Label>
              <div className="relative">
                <PhoneCall className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="donor-reg-alt-phone"
                  placeholder="যেমন: 017XXXXXXXX"
                  className="pl-9 h-11 rounded-xl text-xs sm:text-sm font-mono"
                  {...register("altPhone")}
                />
              </div>
              {errors.altPhone && (
                <p className="text-xs text-destructive">{errors.altPhone.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="donor-reg-upazila" className="text-xs sm:text-sm font-bold text-foreground">
                উপজেলা <span className="text-rose-500">*</span>
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <select
                  id="donor-reg-upazila"
                  value={selectedUpazila}
                  onChange={(e) => setValue("upazila", e.target.value, { shouldValidate: true })}
                  className="w-full pl-9 pr-4 h-11 rounded-xl border border-input bg-background text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {validUpazilas.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.nameBn}
                    </option>
                  ))}
                </select>
              </div>
              {errors.upazila && (
                <p className="text-xs text-destructive">{errors.upazila.message}</p>
              )}
            </div>
          </div>

          {/* Specific Area / Address */}
          <div className="space-y-1.5">
            <Label htmlFor="donor-reg-area" className="text-xs sm:text-sm font-bold text-foreground">
              বর্তমান এলাকা / পাড়া বা মহল্লা (ঐচ্ছিক)
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="donor-reg-area"
                placeholder="যেমন: হাসপাতাল মোড়, রামপুর, মিজান রোড বা মাস্টারপাড়া"
                className="pl-9 h-11 rounded-xl text-xs sm:text-sm"
                {...register("specificArea")}
              />
            </div>
            {errors.specificArea && (
              <p className="text-xs text-destructive">{errors.specificArea.message}</p>
            )}
            <p className="text-2xs text-muted-foreground">
              নির্দিষ্ট এলাকা উল্লেখ করলে আপনার কাছাকাছি থাকা রোগীরা সহজে যোগাযোগ করতে পারবে।
            </p>
          </div>

          {/* Last Donation Date Quick Chips & Input */}
          <div className="space-y-2">
            <Label htmlFor="donor-reg-last-donated" className="text-xs sm:text-sm font-bold text-foreground flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-rose-600" />
                সর্বশেষ রক্তদানের সময় (ঐচ্ছিক)
              </span>
              <span className="text-2xs text-muted-foreground font-normal">
                (রক্তদানের উপযুক্ততা বুঝতে সহায়ক)
              </span>
            </Label>

            {/* Quick interval chips */}
            <div className="flex items-center gap-2 flex-wrap pb-1">
              {COMMON_DONATION_INTERVALS.map((interval) => (
                <button
                  key={interval}
                  type="button"
                  onClick={() => setValue("lastDonated", interval, { shouldValidate: true })}
                  className={`text-2xs px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                    selectedLastDonated === interval
                      ? "bg-rose-500/10 border-rose-500 text-rose-700 dark:text-rose-300 font-bold"
                      : "bg-muted/40 hover:bg-muted border-border/80 text-muted-foreground"
                  }`}
                >
                  {interval}
                </button>
              ))}
            </div>

            <Input
              id="donor-reg-last-donated"
              placeholder="যেমন: ১৫ আগস্ট ২০২৪ বা প্রায় ৪ মাস আগে"
              className="h-11 rounded-xl text-xs sm:text-sm"
              {...register("lastDonated")}
            />
            {errors.lastDonated && (
              <p className="text-xs text-destructive">{errors.lastDonated.message}</p>
            )}
          </div>

          {/* Notes / Preferred Time */}
          <div className="space-y-1.5">
            <Label htmlFor="donor-reg-notes" className="text-xs sm:text-sm font-bold text-foreground">
              যোগাযোগের উপযুক্ত সময় বা বিশেষ নোট (ঐচ্ছিক)
            </Label>
            <Input
              id="donor-reg-notes"
              placeholder="যেমন: বিকাল ৫টার পর যেকোনো দিন বা শুক্রবার সারাদিন ফ্রি"
              className="h-11 rounded-xl text-xs sm:text-sm"
              {...register("notes")}
            />
            {errors.notes && (
              <p className="text-xs text-destructive">{errors.notes.message}</p>
            )}
          </div>

          {/* Eligibility & Privacy Checkbox */}
          <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded text-rose-600 border-border focus:ring-rose-500 cursor-pointer"
                {...register("eligibilityConsent")}
              />
              <span className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                আমি অঙ্গীকার করছি যে আমার বয়স ১৮ বছরের বেশি, ওজন ৫০ কেজির বেশি এবং আমি রক্তদানে শারীরিক ও মানসিকভাবে সুস্থ। রক্তদানের মহৎ উদ্দেশ্যে আমার যোগাযোগের নম্বর ডিরেক্টরিতে প্রকাশে আমি সম্মত।
              </span>
            </label>
            {errors.eligibilityConsent && (
              <p className="text-xs text-destructive font-semibold">
                {errors.eligibilityConsent.message}
              </p>
            )}

            <div className="flex items-center gap-1.5 text-2xs text-muted-foreground pt-1 border-t border-rose-500/10">
              <Info className="h-3.5 w-3.5 text-rose-600 shrink-0" />
              <span>আপনার নম্বরটি শুধুমাত্র জরুরি রক্তের প্রয়োজনে রোগীর স্বজনদের ব্যবহারের জন্য উন্মুক্ত থাকবে।</span>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>তথ্য যাচাই করা হচ্ছে...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>রক্তদাতা হিসেবে নিবন্ধন সম্পন্ন করুন</span>
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
