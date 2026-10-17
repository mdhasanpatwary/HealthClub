"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Truck,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  MapPin,
  Activity,
  Wind,
  Snowflake,
  Send,
  PhoneCall,
  User,
  Navigation,
  FileText,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ambulanceRegistrationPageSchema,
  type AmbulanceRegistrationPageFormValues,
} from "@/lib/validations/emergency";
import { registerAmbulanceAction } from "@/app/actions/emergencyActions";
import { UPAZILAS_FENI, AMBULANCE_TYPES, type AmbulanceType } from "@/data/emergencyData";

export default function AmbulanceRegistrationForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submittedServiceName, setSubmittedServiceName] = useState("");

  const validUpazilas = UPAZILAS_FENI.filter((u) => u.id !== "all");

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AmbulanceRegistrationPageFormValues>({
    resolver: zodResolver(ambulanceRegistrationPageSchema),
    defaultValues: {
      serviceName: "",
      operatorName: "",
      phone: "",
      altPhone: "",
      type: "AC",
      upazila: "feni-sadar",
      standLocation: "",
      coverage: "ফেনী সদর ও সারা দেশ",
      notes: "",
    },
  });

  const selectedType = useWatch({ control, name: "type" });

  const onSubmit = async (values: AmbulanceRegistrationPageFormValues) => {
    try {
      const selectedUpazilaObj = validUpazilas.find((u) => u.id === values.upazila);
      const upazilaLabel = selectedUpazilaObj?.nameBn || values.upazila;
      const fullLocation = values.standLocation?.trim()
        ? `${upazilaLabel} (${values.standLocation.trim()})`
        : upazilaLabel;

      const res = await registerAmbulanceAction({
        serviceName: values.serviceName.trim(),
        operatorName: values.operatorName.trim(),
        phone: values.phone.trim(),
        altPhone: values.altPhone?.trim() || undefined,
        type: values.type,
        location: fullLocation,
        coverage: values.coverage?.trim() || undefined,
        notes: values.notes?.trim() || undefined,
      });

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      setSubmittedServiceName(values.serviceName);
      setSubmitted(true);
      reset();
      toast.success(res.message);
    } catch {
      toast.error("তথ্য জমা দিতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন বা সরাসরি WhatsApp-এ জানান।");
    }
  };

  if (submitted) {
    return (
      <Card className="border border-primary/20 bg-card shadow-sm rounded-3xl overflow-hidden">
        <CardContent className="p-8 sm:p-12 text-center space-y-6">
          <div className="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-10 w-10 text-primary animate-pulse" />
          </div>
          <div className="space-y-2">
            <h3 className="font-heading text-2xl font-bold text-secondary dark:text-white">
              নিবন্ধন আবেদন সফলভাবে জমা হয়েছে!
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              <strong className="text-foreground">{submittedServiceName}</strong>-এর তথ্য আমাদের জরুরি সমন্বয়কারী টিম কর্তৃক দ্রুত যাচাই করা হবে।
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-muted/60 text-xs sm:text-sm text-foreground/90 max-w-lg mx-auto text-left space-y-2 border border-border/80">
            <div className="flex items-center gap-2 font-bold text-primary">
              <ShieldCheck className="h-4 w-4" />
              <span>পরবর্তী করণীয় ও ভেরিফিকেশন ধাপ:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground text-xs leading-relaxed">
              <li>আমাদের টিম প্রদত্ত মোবাইল নম্বরে কল করে ড্রাইভার ও গাড়ির লোকেশন নিশ্চিত করবে।</li>
              <li>ভেরিফিকেশন সম্পন্ন হলে ১২ থেকে ২৪ ঘণ্টার মধ্যে হেলথ ক্লাব ২৪/৭ অ্যাম্বুলেন্স বহরে যুক্ত হবে।</li>
              <li>জরুরি যেকোনো তথ্য সংশোধনে আমাদের হেল্পলাইনে সরাসরি যোগাযোগ করতে পারেন।</li>
            </ul>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => setSubmitted(false)}
            className="rounded-xl font-bold text-xs cursor-pointer"
          >
            আরেকটি অ্যাম্বুলেন্স যুক্ত করুন
          </Button>
        </CardContent>
      </Card>
    );
  }

  const getTypeIcon = (typeId: AmbulanceType) => {
    switch (typeId) {
      case "ICU":
        return <Activity className="h-4 w-4 text-rose-500" />;
      case "AC":
        return <Wind className="h-4 w-4 text-emerald-500" />;
      case "Non-AC":
        return <Truck className="h-4 w-4 text-blue-500" />;
      case "Freezer":
        return <Snowflake className="h-4 w-4 text-cyan-500" />;
    }
  };

  return (
    <Card className="border border-border/80 bg-card shadow-sm rounded-3xl overflow-hidden">
      <div className="border-b border-border/60 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-xs">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-heading text-lg sm:text-xl font-bold text-secondary dark:text-white">
              অ্যাম্বুলেন্স ও ড্রাইভার নিবন্ধন ফরম
            </h2>
            <p className="text-xs text-muted-foreground">
              সকল তথ্য নির্ভুলভাবে দিন যেন জরুরি মুহূর্তে সেবাগ্রহীতারা সহজেই সরাসরি যোগাযোগ করতে পারেন।
            </p>
          </div>
        </div>
      </div>

      <CardContent className="p-6 sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Section 1: Vehicle Type Selection */}
          <div className="space-y-3">
            <label className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-1.5">
              <Truck className="h-4 w-4 text-primary" />
              <span>গাড়ির ধরন নির্বাচন করুন *</span>
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {AMBULANCE_TYPES.map((t) => {
                const isSelected = selectedType === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setValue("type", t.id, { shouldValidate: true })}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${isSelected
                        ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                        : "border-border/80 bg-background hover:bg-muted/50"
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      {getTypeIcon(t.id)}
                      <span className={`text-2xs font-bold px-1.5 py-0.5 rounded-md ${isSelected ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                        }`}>
                        {t.shortBn}
                      </span>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-foreground">{t.nameBn}</div>
                      <div className="text-2xs text-muted-foreground line-clamp-1">{t.shortEn}</div>
                    </div>
                  </button>
                );
              })}
            </div>
            {errors.type && (
              <p className="text-2xs text-destructive">{errors.type.message}</p>
            )}
          </div>

          {/* Section 2: Basic Operator & Service Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="serviceName" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5 text-primary" />
                <span>প্রতিষ্ঠানের নাম / গাড়ির পরিচিতি *</span>
              </label>
              <Input
                id="serviceName"
                placeholder="যেমন: ফেনী সেন্ট্রাল অ্যাম্বুলেন্স"
                {...register("serviceName")}
                className="rounded-xl text-xs sm:text-sm"
              />
              {errors.serviceName && (
                <p className="text-2xs text-destructive">{errors.serviceName.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="operatorName" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-primary" />
                <span>চালক / অপারেটরের নাম *</span>
              </label>
              <Input
                id="operatorName"
                placeholder="যেমন: মো. রফিক মিয়া"
                {...register("operatorName")}
                className="rounded-xl text-xs sm:text-sm"
              />
              {errors.operatorName && (
                <p className="text-2xs text-destructive">{errors.operatorName.message}</p>
              )}
            </div>
          </div>

          {/* Section 3: Contact Phone Numbers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="phone" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <PhoneCall className="h-3.5 w-3.5 text-primary" />
                <span>জরুরি যোগাযোগের প্রধান মোবাইল নম্বর *</span>
              </label>
              <Input
                id="phone"
                type="tel"
                placeholder="018XXXXXXXX"
                {...register("phone")}
                className="rounded-xl text-xs sm:text-sm"
              />
              {errors.phone && (
                <p className="text-2xs text-destructive">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="altPhone" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <PhoneCall className="h-3.5 w-3.5 text-muted-foreground" />
                <span>বিকল্প ফোন নম্বর (যদি থাকে)</span>
              </label>
              <Input
                id="altPhone"
                type="tel"
                placeholder="017XXXXXXXX (ঐচ্ছিক)"
                {...register("altPhone")}
                className="rounded-xl text-xs sm:text-sm"
              />
              {errors.altPhone && (
                <p className="text-2xs text-destructive">{errors.altPhone.message}</p>
              )}
            </div>
          </div>

          {/* Section 4: Location & Stand */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="upazila" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                <span>উপজেলা *</span>
              </label>
              <select
                id="upazila"
                {...register("upazila")}
                className="w-full h-10 px-3 rounded-xl border border-input bg-background text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {validUpazilas.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.nameBn} ({u.nameEn})
                  </option>
                ))}
              </select>
              {errors.upazila && (
                <p className="text-2xs text-destructive">{errors.upazila.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="standLocation" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Navigation className="h-3.5 w-3.5 text-primary" />
                <span>স্ট্যান্ড বা বর্তমান পার্কিং লোকেশন *</span>
              </label>
              <Input
                id="standLocation"
                placeholder="যেমন: মহিপাল হাইওয়ে মোড় / সদর হাসপাতাল গেট"
                {...register("standLocation")}
                className="rounded-xl text-xs sm:text-sm"
              />
              {errors.standLocation && (
                <p className="text-2xs text-destructive">{errors.standLocation.message}</p>
              )}
            </div>
          </div>

          {/* Section 5: Coverage Area & Route */}
          <div className="space-y-1.5">
            <label htmlFor="coverage" className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              <span>সার্ভিস এলাকা / কভারেজ রুট</span>
            </label>
            <Input
              id="coverage"
              placeholder="যেমন: ফেনী সদর, ঢাকা, চট্টগ্রাম ও সারা দেশ"
              {...register("coverage")}
              className="rounded-xl text-xs sm:text-sm"
            />
            {errors.coverage && (
              <p className="text-2xs text-destructive">{errors.coverage.message}</p>
            )}
          </div>

          {/* Section 6: Additional Features / Notes */}
          <div className="space-y-1.5">
            <label htmlFor="notes" className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-primary" />
              <span>অতিরিক্ত সুবিধা বা মন্তব্য (ঐচ্ছিক)</span>
            </label>
            <Input
              id="notes"
              placeholder="যেমন: সিলিন্ডার অক্সিজেন সুবিধা আছে, দক্ষ চালক, ন্যায্য ভাড়ায় সার্বক্ষণিক প্রস্তুত"
              {...register("notes")}
              className="rounded-xl text-xs sm:text-sm"
            />
            {errors.notes && (
              <p className="text-2xs text-destructive">{errors.notes.message}</p>
            )}
          </div>

          {/* Trust Commitment Badge */}
          <div className="p-3.5 rounded-2xl bg-primary/5 border border-primary/20 flex items-start gap-2.5">
            <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <p className="text-2xs sm:text-xs text-muted-foreground leading-relaxed">
              <strong>ন্যায্য ভাড়ার অঙ্গীকার:</strong> জরুরি রোগীর অসহায়ত্বের সুযোগ না নিয়ে সরকারি বা নির্ধারিত মানসম্মত ন্যায্য ভাড়া গ্রহণ করবেন। হেলথ ক্লাব কোনো মধ্যস্বত্বভোগী বা কমিশন গ্রহণ করে না।
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3.5 rounded-2xl text-xs sm:text-sm cursor-pointer shadow-md transition-all"
          >
            {isSubmitting ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                আবেদন জমা হচ্ছে...
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <Send className="h-4 w-4" />
                অ্যাম্বুলেন্স তালিকাভুক্তির আবেদন জমা দিন
              </span>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
