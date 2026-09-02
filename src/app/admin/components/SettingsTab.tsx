"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  getAllSystemSettingsAction,
  updateMultipleSystemSettingsAction,
} from "@/app/actions/systemSettingsActions";
import {
  systemSettingsSchema,
  type SystemSettingsFormValues,
} from "@/lib/validations/settings";
import { toast } from "sonner";
import { Save, Loader2, RotateCcw } from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { Skeleton } from "@/components/ui/skeleton";
import { FeeSettingsCard } from "./settings/FeeSettingsCard";
import { PaymentSettingsCard } from "./settings/PaymentSettingsCard";
import { ContactSettingsCard } from "./settings/ContactSettingsCard";
import { NoticeSettingsCard } from "./settings/NoticeSettingsCard";
import { MemberTxSettingsCard } from "./settings/MemberTxSettingsCard";
import { DatabaseBackupCard } from "./settings/DatabaseBackupCard";

export function SettingsTab() {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SystemSettingsFormValues>({
    resolver: zodResolver(systemSettingsSchema),
    defaultValues: {
      founding_fee: "0",
      premium_fee: "500",
      bkash_personal_number: "01886763849",
      bkash_merchant_number: "01886763849",
      payment_instructions:
        "বিকাশ পার্সোনাল বা মার্চেন্ট নম্বরে সেন্ড মানি/পেমেন্ট সম্পন্ন করে TrxID ও প্রেরক নম্বর লিখুন।",
      hotline_phone: "01886763849",
      contact_hotline: "01886763849",
      whatsapp_phone: "01886763849",
      contact_whatsapp: "01886763849",
      official_email: "healthclubfeni@gmail.com",
      contact_email: "healthclubfeni@gmail.com",
      facebook_url: "https://www.facebook.com/profile.php?id=61591616953090",
      notice_enabled: false,
      notice_text: "",
      allow_member_tx: false,
    },
  });

  const noticeEnabled = Boolean(useWatch({ control, name: "notice_enabled" }));
  const noticeText = useWatch({ control, name: "notice_text" }) || "";
  const allowMemberTx = Boolean(useWatch({ control, name: "allow_member_tx" }));

  const applySettingsData = useCallback(
    (data: Record<string, string | undefined>) => {
      reset({
        founding_fee: data.founding_fee || "0",
        premium_fee: data.premium_fee || "500",
        bkash_personal_number: data.bkash_personal_number || "01886763849",
        bkash_merchant_number: data.bkash_merchant_number || "01886763849",
        payment_instructions:
          data.payment_instructions ||
          "বিকাশ পার্সোনাল বা মার্চেন্ট নম্বরে সেন্ড মানি/পেমেন্ট সম্পন্ন করে TrxID ও প্রেরক নম্বর লিখুন।",
        hotline_phone: data.hotline_phone || data.contact_hotline || "01886763849",
        contact_hotline: data.hotline_phone || data.contact_hotline || "01886763849",
        whatsapp_phone: data.whatsapp_phone || data.contact_whatsapp || "01886763849",
        contact_whatsapp: data.whatsapp_phone || data.contact_whatsapp || "01886763849",
        official_email: data.official_email || data.contact_email || "healthclubfeni@gmail.com",
        contact_email: data.official_email || data.contact_email || "healthclubfeni@gmail.com",
        facebook_url: data.facebook_url || "https://www.facebook.com/profile.php?id=61591616953090",
        notice_enabled: data.notice_enabled === "true",
        notice_text: data.notice_text || "",
        allow_member_tx: data.allow_member_tx === "true",
      });
    },
    [reset]
  );

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await getAllSystemSettingsAction();
      applySettingsData(data);
    } catch {
      toast.error("সেটিংস লোড করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    getAllSystemSettingsAction()
      .then((data) => {
        if (!isMounted) return;
        applySettingsData(data);
      })
      .catch(() => {
        if (isMounted) toast.error("সেটিংস লোড করতে সমস্যা হয়েছে।");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [applySettingsData]);

  const onSubmit = async (formData: SystemSettingsFormValues) => {
    try {
      const payload: Record<string, string> = {
        founding_fee: formData.founding_fee,
        premium_fee: formData.premium_fee,
        bkash_personal_number: formData.bkash_personal_number,
        bkash_merchant_number: formData.bkash_merchant_number || "",
        payment_instructions: formData.payment_instructions,
        hotline_phone: formData.hotline_phone,
        contact_hotline: formData.hotline_phone,
        whatsapp_phone: formData.whatsapp_phone,
        contact_whatsapp: formData.whatsapp_phone,
        official_email: formData.official_email,
        contact_email: formData.official_email,
        facebook_url: formData.facebook_url,
        notice_enabled: formData.notice_enabled ? "true" : "false",
        notice_text: formData.notice_text || "",
        allow_member_tx: formData.allow_member_tx ? "true" : "false",
      };

      const res = await updateMultipleSystemSettingsAction(payload);
      if (res.success) {
        toast.success(isEn ? "System settings saved successfully!" : res.message);
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("সেটিংস সংরক্ষণ করতে ব্যর্থ হয়েছে।");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-background border border-border">
          <div className="space-y-2">
            <Skeleton className="h-6 w-56 rounded-md" />
            <Skeleton className="h-3.5 w-80 max-w-full rounded-md" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-20 rounded-md" />
            <Skeleton className="h-9 w-36 rounded-md" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="border border-border shadow-xs">
              <CardHeader className="pb-3 space-y-1.5">
                <Skeleton className="h-5 w-44 rounded-md" />
                <Skeleton className="h-3.5 w-64 rounded-md" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-background border border-border">
        <div>
          <h2 className="font-heading font-bold text-lg text-secondary dark:text-white">
            {isEn ? "System Settings & Configuration" : "সিস্টেম সেটিংস ও কনফিগারেশন"}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isEn
              ? "Manage membership pricing, payment details, hotlines, and announcements in real time."
              : "মেম্বারশিপ ফি, বিকাশ নম্বর, হটলাইন ও অফার ব্যানার ড্যাশবোর্ড থেকে পরিবর্তন করুন।"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={loadSettings}>
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
            {isEn ? "Reset" : "রিলোড"}
          </Button>
          <Button type="submit" disabled={isSubmitting} size="sm" className="font-bold">
            {isSubmitting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                {isEn ? "Saving..." : "সংরক্ষণ হচ্ছে..."}
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5 mr-1.5" />
                {isEn ? "Save All Settings" : "সেটিংস সংরক্ষণ করুন"}
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Membership Pricing */}
        <FeeSettingsCard
          register={register}
          errors={errors}
          isEn={isEn}
        />

        {/* 2. Payment & bKash Information */}
        <PaymentSettingsCard
          register={register}
          errors={errors}
          isEn={isEn}
        />

        {/* 3. Contact & Hotline Setup */}
        <ContactSettingsCard
          register={register}
          errors={errors}
          isEn={isEn}
        />

        {/* 4. Announcements & Website Banner */}
        <NoticeSettingsCard
          register={register}
          noticeEnabled={noticeEnabled}
          setNoticeEnabled={(val) => setValue("notice_enabled", val, { shouldValidate: true })}
          noticeText={noticeText}
          isEn={isEn}
        />

        {/* 5. Member Self-Transaction Entry */}
        <MemberTxSettingsCard
          allowMemberTx={allowMemberTx}
          setAllowMemberTx={(val) => setValue("allow_member_tx", val, { shouldValidate: true })}
          isEn={isEn}
        />

        {/* 6. Database Backup & Disaster Recovery */}
        <DatabaseBackupCard isEn={isEn} />
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={isSubmitting} size="lg" className="font-bold">
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              {isEn ? "Saving Settings..." : "সংরক্ষণ করা হচ্ছে..."}
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {isEn ? "Save All Settings" : "সেটিংস সংরক্ষণ করুন"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
