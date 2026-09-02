"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Heart, User, Phone, Mail, Lock, MapPin, Calendar, Briefcase,
  ArrowRight, Star, ShieldCheck
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
import { useLanguage } from "@/components/layout/LanguageProvider";
import { toast } from "sonner";

function RegisterForm() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const planParam = searchParams.get("plan");

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
      tier: (planParam === "premium" ? "premium" : "founding"),
      address: "",
      birthDate: "",
      profession: "",
      profilePictureUrl: "",
    },
  });

  const selectedTier = useWatch({ control, name: "tier" });

  const onSubmit = async (data: MemberRegistrationInput) => {
    try {
      const result = await addMemberAction(data);

      if ("error" in result) {
        toast.error(result.error);
        return;
      }

      toast.success(t("auth.register.registerSuccess"));
      router.push(`/register/verify-email?email=${encodeURIComponent(data.email)}`);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : t("auth.register.registerError");
      toast.error(errorMessage);
    }
  };

  return (
    <div className="relative bg-background/90 dark:bg-slate-900/90 backdrop-blur-xl border border-border/60 rounded-3xl shadow-2xl overflow-hidden w-full max-w-xl">
      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />

      <div className="p-8 sm:p-10 space-y-6">
        {/* Logo & Title */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center justify-center space-x-2 group mb-4">
            <div className="relative">
              <Heart className="h-8 w-8 fill-primary text-primary transition-transform duration-300 group-hover:scale-110" />
            </div>
            <span className="font-heading text-2xl font-bold text-secondary dark:text-white">
              {t("layout.header.health")} <span className="gradient-text">{t("layout.header.club")}</span>
            </span>
          </Link>
          <h1 className="font-heading text-xl font-bold text-secondary dark:text-white">
            {t("auth.register.title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            {t("auth.register.subtitle")}
          </p>
        </div>

        {/* Plan Selector */}
        <div
          role="radiogroup"
          aria-label={t("auth.register.selectPlan")}
          className="grid grid-cols-2 gap-3 mb-6"
        >
          <button
            type="button"
            role="radio"
            aria-checked={selectedTier === "founding"}
            onClick={() => setValue("tier", "founding", { shouldValidate: true })}
            className={`relative p-4 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer ${
              selectedTier === "founding"
                ? "border-primary bg-primary/5 dark:bg-primary/10"
                : "border-border/60 hover:border-primary/30"
            }`}
          >
            {selectedTier === "founding" && (
              <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                <Star className="h-3 w-3 text-white fill-white" />
              </div>
            )}
            <Star className={`h-5 w-5 mb-2 ${selectedTier === "founding" ? "text-primary fill-primary/20" : "text-muted-foreground"}`} />
            <p className="text-xs font-bold text-secondary dark:text-white">{t("auth.register.foundingTier")}</p>
            <p className="text-[11px] text-primary font-semibold">{t("auth.register.foundingSub")}</p>
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={selectedTier === "premium"}
            onClick={() => setValue("tier", "premium", { shouldValidate: true })}
            className={`relative p-4 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer ${
              selectedTier === "premium"
                ? "border-primary bg-primary/5 dark:bg-primary/10"
                : "border-border/60 hover:border-primary/30"
            }`}
          >
            {selectedTier === "premium" && (
              <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                <ShieldCheck className="h-3 w-3 text-white" />
              </div>
            )}
            <ShieldCheck className={`h-5 w-5 mb-2 ${selectedTier === "premium" ? "text-primary" : "text-muted-foreground"}`} />
            <p className="text-xs font-bold text-secondary dark:text-white">{t("auth.register.premiumTier")}</p>
            <p className="text-[11px] text-muted-foreground font-semibold">{t("auth.register.premiumSub")}</p>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            name="profilePictureUrl"
            control={control}
            render={({ field, fieldState }) => (
              <div className="space-y-1">
                <ImageUpload
                  value={field.value}
                  onChange={field.onChange}
                  label={t("auth.register.photoLabel")}
                />
                {fieldState.error && (
                  <p className="text-xs text-destructive">{fieldState.error.message}</p>
                )}
              </div>
            )}
          />

          <div className="space-y-1.5">
            <label htmlFor="reg-name" className="text-xs font-semibold text-secondary dark:text-white flex items-center gap-1.5 cursor-pointer">
              <User className="h-3.5 w-3.5 text-primary" />
              {t("auth.register.fullNameLabel")}
            </label>
            <Input
              id="reg-name"
              type="text"
              {...register("name")}
              placeholder={t("auth.register.fullNamePlaceholder")}
              className="border-border/60 bg-background dark:bg-slate-800/60 rounded-xl h-10 focus:border-primary/40"
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="reg-phone" className="text-xs font-semibold text-secondary dark:text-white flex items-center gap-1.5 cursor-pointer">
                <Phone className="h-3.5 w-3.5 text-primary" />
                {t("auth.register.phoneLabel")}
              </label>
              <Input
                id="reg-phone"
                type="tel"
                {...register("phone")}
                placeholder="017XXXXXXXX"
                className="border-border/60 bg-background dark:bg-slate-800/60 rounded-xl h-10 focus:border-primary/40"
              />
              {errors.phone && (
                <p className="text-xs text-destructive">{errors.phone.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <label htmlFor="reg-email" className="text-xs font-semibold text-secondary dark:text-white flex items-center gap-1.5 cursor-pointer">
                <Mail className="h-3.5 w-3.5 text-primary" />
                {t("auth.register.emailLabel")}
              </label>
              <Input
                id="reg-email"
                type="email"
                {...register("email")}
                placeholder="name@domain.com"
                className="border-border/60 bg-background dark:bg-slate-800/60 rounded-xl h-10 focus:border-primary/40"
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="reg-address" className="text-xs font-semibold text-secondary dark:text-white flex items-center gap-1.5 cursor-pointer">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              {t("auth.register.addressLabel")}
            </label>
            <Input
              id="reg-address"
              type="text"
              {...register("address")}
              placeholder={t("auth.register.addressPlaceholder")}
              className="border-border/60 bg-background dark:bg-slate-800/60 rounded-xl h-10 focus:border-primary/40"
            />
            {errors.address && (
              <p className="text-xs text-destructive">{errors.address.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="reg-birthDate" className="text-xs font-semibold text-secondary dark:text-white flex items-center gap-1.5 cursor-pointer">
                <Calendar className="h-3.5 w-3.5 text-primary" />
                {t("auth.register.dobLabel")}
              </label>
              <Input
                id="reg-birthDate"
                type="date"
                {...register("birthDate")}
                className="border-border/60 bg-background dark:bg-slate-800/60 rounded-xl h-10 focus:border-primary/40"
              />
              {errors.birthDate && (
                <p className="text-xs text-destructive">{errors.birthDate.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <label htmlFor="reg-profession" className="text-xs font-semibold text-secondary dark:text-white flex items-center gap-1.5 cursor-pointer">
                <Briefcase className="h-3.5 w-3.5 text-primary" />
                {t("auth.register.professionLabel")}
              </label>
              <Input
                id="reg-profession"
                type="text"
                {...register("profession")}
                placeholder={t("auth.register.professionPlaceholder")}
                className="border-border/60 bg-background dark:bg-slate-800/60 rounded-xl h-10 focus:border-primary/40"
              />
              {errors.profession && (
                <p className="text-xs text-destructive">{errors.profession.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="reg-password" className="text-xs font-semibold text-secondary dark:text-white flex items-center gap-1.5 cursor-pointer">
              <Lock className="h-3.5 w-3.5 text-primary" />
              {t("auth.register.passwordLabel")}
            </label>
            <Input
              id="reg-password"
              type="password"
              {...register("password")}
              placeholder="••••••••"
              className="border-border/60 bg-background dark:bg-slate-800/60 rounded-xl h-10 focus:border-primary/40"
            />
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            size="lg"
            className="w-full mt-1"
          >
            {isSubmitting ? (
              <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <>
                {t("auth.register.submitButton")}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground border-t border-border/60 pt-5">
          {t("auth.register.alreadyHaveAccount")}{" "}
          <Link href="/login" className="text-primary hover:text-primary-dark font-semibold transition-colors">
            {t("auth.register.loginLink")}
          </Link>
        </div>
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
