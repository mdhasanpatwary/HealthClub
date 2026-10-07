"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Heart, User, Phone, Lock, MapPin, Calendar, Briefcase,
  ArrowRight, Star, ShieldCheck, Sparkles
} from "lucide-react";
import { addMemberAction } from "@/app/actions/memberActions";
import {
  memberRegistrationSchema,
  type MemberRegistrationInput,
} from "@/lib/validations/member";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { authStore } from "@/services/authStore";
import WhatsAppAssistanceCard from "@/components/common/WhatsAppAssistanceCard";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planParam = searchParams.get("plan");
  const refParam = searchParams.get("ref") || searchParams.get("reference") || "";

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<MemberRegistrationInput>({
    resolver: zodResolver(memberRegistrationSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      password: "",
      tier: (planParam === "premium" ? "premium" : "free"),
      address: "",
      birthDate: "",
      profession: "",
      profilePictureUrl: "",
      referenceCode: refParam,
    },
  });

  const selectedTier = useWatch({ control, name: "tier" });
  const [isPhotoUploading, setIsPhotoUploading] = useState(false);
  const [showMoreDetails, setShowMoreDetails] = useState(false);

  const onSubmit = async (data: MemberRegistrationInput) => {
    try {
      const result = await addMemberAction(data);

      if ("error" in result) {
        toast.error(result.error);
        return;
      }

      // Sync authStore, local storage, and dispatch auth-change for Header
      authStore.setCurrentUser(result);

      if (result.tier === "premium" && result.status !== "active") {
        toast.success("অ্যাকাউন্ট তৈরি হয়েছে! মেম্বারশিপ সক্রিয় করতে পেমেন্ট সম্পন্ন করুন।");
        router.push(`/register/payment?memberId=${result.id}`);
      } else {
        toast.success("অভিনন্দন! আপনার ফ্রি মেম্বারশিপ কার্ড সফলভাবে সক্রিয় হয়েছে।");
        router.replace("/dashboard");
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "রেজিস্ট্রেশন সম্পন্ন করা যায়নি। আবার চেষ্টা করুন।";
      toast.error(errorMessage);
    }
  };

  const isPremiumSelected = selectedTier === "premium";

  return (
    <div className="relative bg-background/95 dark:bg-slate-900/95 backdrop-blur-xl border border-border/60 rounded-3xl shadow-2xl overflow-hidden w-full max-w-xl">
      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />

      <div className="p-6 sm:p-10 space-y-5">
        {/* Logo & Title */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center justify-center space-x-2 group">
            <div className="relative">
              <Heart className="h-7 w-7 fill-primary text-primary transition-transform duration-300 group-hover:scale-110" />
            </div>
            <span className="font-heading text-2xl font-bold text-secondary dark:text-white">
              হেলথ <span className="gradient-text">ক্লাব</span>
            </span>
          </Link>
          <h1 className="font-heading text-xl font-bold text-secondary dark:text-white">
            নতুন সদস্য নিবন্ধন
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            মাত্র ৩০ সেকেন্ডে তৈরি করুন আপনার ডিজিটাল মেম্বারশিপ কার্ড
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-400 text-[11px] font-semibold">
            <Sparkles className="h-3 w-3 text-emerald-600" />
            <span>কোনো গোপন ফি নেই • সাথে সাথে কার্ড চালু</span>
          </div>
        </div>

        {/* Plan Selector */}
        <div
          role="radiogroup"
          aria-label="মেম্বারশিপ প্ল্যান নির্বাচন করুন"
          className="grid grid-cols-2 gap-3"
        >
          <button
            type="button"
            role="radio"
            aria-checked={!isPremiumSelected}
            onClick={() => setValue("tier", "free", { shouldValidate: true })}
            className={`relative p-3.5 sm:p-4 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer ${
              !isPremiumSelected
                ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-xs"
                : "border-border/60 hover:border-primary/30"
            }`}
          >
            {!isPremiumSelected && (
              <div className="absolute top-2.5 right-2.5 h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                <Star className="h-2.5 w-2.5 text-white fill-white" />
              </div>
            )}
            <Star className={`h-4 w-4 mb-1.5 ${!isPremiumSelected ? "text-primary fill-primary/20" : "text-muted-foreground"}`} />
            <p className="text-xs font-bold text-secondary dark:text-white">ফ্রি মেম্বার</p>
            <p className="text-[11px] text-primary font-bold">১০-২৫% ছাড় (৳০ ফি)</p>
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={isPremiumSelected}
            onClick={() => setValue("tier", "premium", { shouldValidate: true })}
            className={`relative p-3.5 sm:p-4 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer ${
              isPremiumSelected
                ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-xs"
                : "border-border/60 hover:border-primary/30"
            }`}
          >
            {isPremiumSelected && (
              <div className="absolute top-2.5 right-2.5 h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                <ShieldCheck className="h-2.5 w-2.5 text-white" />
              </div>
            )}
            <ShieldCheck className={`h-4 w-4 mb-1.5 ${isPremiumSelected ? "text-primary" : "text-muted-foreground"}`} />
            <p className="text-xs font-bold text-secondary dark:text-white">প্রিমিয়াম মেম্বার</p>
            <p className="text-[11px] text-muted-foreground font-semibold">১৫-৩০% ছাড় ও প্রায়োরিটি</p>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
          {/* Core Essential 1: Name */}
          <div className="space-y-1">
            <label htmlFor="reg-name" className="text-xs font-semibold text-secondary dark:text-white flex items-center gap-1.5 cursor-pointer">
              <User className="h-3.5 w-3.5 text-primary" />
              পূর্ণ নাম (Full Name) <span className="text-destructive">*</span>
            </label>
            <Input
              id="reg-name"
              type="text"
              {...register("name")}
              placeholder="আপনার পূর্ণ নাম লিখুন"
              className="border-border/60 bg-background dark:bg-slate-800/60 rounded-xl h-10 focus:border-primary/40 text-sm"
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Core Essential 2: Phone */}
          <div className="space-y-1">
            <label htmlFor="reg-phone" className="text-xs font-semibold text-secondary dark:text-white flex items-center gap-1.5 cursor-pointer">
              <Phone className="h-3.5 w-3.5 text-primary" />
              মোবাইল নম্বর <span className="text-destructive">*</span>
            </label>
            <Input
              id="reg-phone"
              type="tel"
              {...register("phone")}
              placeholder="017XXXXXXXX"
              className="border-border/60 bg-background dark:bg-slate-800/60 rounded-xl h-10 focus:border-primary/40 text-sm font-mono"
            />
            {errors.phone && (
              <p className="text-xs text-destructive">{errors.phone.message}</p>
            )}
          </div>

          {/* Core Essential 3: Password */}
          <div className="space-y-1">
            <label htmlFor="reg-password" className="text-xs font-semibold text-secondary dark:text-white flex items-center gap-1.5 cursor-pointer">
              <Lock className="h-3.5 w-3.5 text-primary" />
              লগইন পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর) <span className="text-destructive">*</span>
            </label>
            <Input
              id="reg-password"
              type="password"
              {...register("password")}
              placeholder="••••••••"
              className="border-border/60 bg-background dark:bg-slate-800/60 rounded-xl h-10 focus:border-primary/40 text-sm"
            />
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>

          {/* Optional Collapsible Extra Profile Fields */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowMoreDetails((prev) => !prev)}
              className="text-xs font-semibold text-primary hover:text-primary-dark inline-flex items-center gap-1.5 transition-colors cursor-pointer py-1"
            >
              <span>{showMoreDetails ? "− অতিরিক্ত তথ্য লুকান" : "+ প্রোফাইল ছবি ও ঠিকানা যোগ করুন (ঐচ্ছিক)"}</span>
            </button>
          </div>

          {showMoreDetails && (
            <div className="space-y-3.5 pt-2 border-t border-border/50 animate-in fade-in duration-200">
              <Controller
                name="profilePictureUrl"
                control={control}
                render={({ field }) => (
                  <div className="space-y-1">
                    <ImageUpload
                      value={field.value || ""}
                      onChange={field.onChange}
                      onUploadingChange={setIsPhotoUploading}
                      label="প্রোফাইল ছবি (ঐচ্ছিক - ড্যাশবোর্ড থেকেও দেওয়া যাবে)"
                      folder="members"
                    />
                  </div>
                )}
              />

              <div className="space-y-1">
                <label htmlFor="reg-address" className="text-xs font-semibold text-secondary dark:text-white flex items-center gap-1.5 cursor-pointer">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  বর্তমান ঠিকানা <span className="text-[11px] text-muted-foreground font-normal">(ঐচ্ছিক)</span>
                </label>
                <Input
                  id="reg-address"
                  type="text"
                  {...register("address")}
                  placeholder="বাসা/রোড, এলাকা, উপজেলা/জেলা"
                  className="border-border/60 bg-background dark:bg-slate-800/60 rounded-xl h-10 focus:border-primary/40 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor="reg-birthDate" className="text-xs font-semibold text-secondary dark:text-white flex items-center gap-1.5 cursor-pointer">
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                    জন্ম তারিখ <span className="text-[11px] text-muted-foreground font-normal">(ঐচ্ছিক)</span>
                  </label>
                  <Input
                    id="reg-birthDate"
                    type="date"
                    {...register("birthDate")}
                    className="border-border/60 bg-background dark:bg-slate-800/60 rounded-xl h-10 focus:border-primary/40 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="reg-profession" className="text-xs font-semibold text-secondary dark:text-white flex items-center gap-1.5 cursor-pointer">
                    <Briefcase className="h-3.5 w-3.5 text-primary" />
                    পেশা <span className="text-[11px] text-muted-foreground font-normal">(ঐচ্ছিক)</span>
                  </label>
                  <Input
                    id="reg-profession"
                    type="text"
                    {...register("profession")}
                    placeholder="যেমন: শিক্ষক, চাকরিজীবী"
                    className="border-border/60 bg-background dark:bg-slate-800/60 rounded-xl h-10 focus:border-primary/40 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting || isPhotoUploading}
            size="lg"
            className="w-full mt-2 h-11 text-sm font-bold shadow-md cursor-pointer"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>কার্ড তৈরি হচ্ছে...</span>
              </div>
            ) : isPhotoUploading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>ছবি আপলোড হচ্ছে...</span>
              </div>
            ) : (
              <span className="flex items-center justify-center gap-2">
                {isPremiumSelected ? "পরবর্তী ধাপে পেমেন্ট করুন" : "বিনামূল্যে মেম্বার কার্ড নিন (৳০)"}
                <ArrowRight className="h-4 w-4" />
              </span>
            )}
          </Button>
        </form>

        <div className="text-center text-xs text-muted-foreground border-t border-border/60 pt-4">
          ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
          <Link href="/login" className="text-primary hover:text-primary-dark font-semibold transition-colors">
            লগইন করুন
          </Link>
        </div>

        <WhatsAppAssistanceCard
          context="register"
          variant="compact"
        />
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-primary-light/40 via-emerald-50/20 to-background dark:from-slate-950 dark:via-slate-900 dark:to-background">
      {/* Background orbs */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/8 dark:bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-200/40 dark:bg-emerald-900/15 rounded-full blur-3xl pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #16a34a 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <Suspense fallback={
        <Card className="relative bg-background/90 dark:bg-slate-900/90 backdrop-blur-xl border border-border/60 rounded-3xl shadow-2xl overflow-hidden w-full max-w-xl p-8 sm:p-10 space-y-6 animate-pulse">
          <div className="text-center space-y-3">
            <Skeleton className="h-10 w-36 mx-auto rounded-xl" />
            <Skeleton className="h-6 w-52 mx-auto" />
            <Skeleton className="h-4 w-72 mx-auto" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-4 border-2 border-border/60 space-y-2">
              <Skeleton className="h-5 w-5 rounded-md" />
              <Skeleton className="h-4 w-20" />
            </Card>
            <Card className="p-4 border-2 border-border/60 space-y-2">
              <Skeleton className="h-5 w-5 rounded-md" />
              <Skeleton className="h-4 w-20" />
            </Card>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-11 w-full rounded-xl mt-4" />
          </div>
        </Card>
      }>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
