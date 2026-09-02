"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Phone, MapPin, CheckCircle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { addContactMessageAction } from "@/app/actions/contactActions";
import {
  getPublicContactSettingsAction,
  PublicContactSettings,
} from "@/app/actions/systemSettingsActions";
import {
  contactMessageSchema,
  type ContactMessageInput,
} from "@/lib/validations/contact";
import { toBanglaNums } from "@/lib/utils";
import { toast } from "sonner";

interface ContactFormProps {
  initialSettings?: PublicContactSettings;
}

const DEFAULT_CONTACT_SETTINGS: PublicContactSettings = {
  hotline: process.env.NEXT_PUBLIC_HOTLINE_PHONE || "01886763849",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "01886763849",
  email: process.env.NEXT_PUBLIC_OFFICIAL_EMAIL || "healthclubfeni@gmail.com",
  facebookUrl:
    process.env.NEXT_PUBLIC_FACEBOOK_URL ||
    "https://www.facebook.com/profile.php?id=61591616953090",
};

export default function ContactForm({ initialSettings }: ContactFormProps) {
  const { t, locale } = useLanguage();
  const [settings, setSettings] = useState<PublicContactSettings>(
    initialSettings || DEFAULT_CONTACT_SETTINGS
  );
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactMessageInput>({
    resolver: zodResolver(contactMessageSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      message: "",
    },
  });

  useEffect(() => {
    if (!initialSettings) {
      getPublicContactSettingsAction().then((s) => setSettings(s));
    }
  }, [initialSettings]);

  const rawHotline = settings.hotline.replace(/[^0-9]/g, "");
  const normalizedHotline = rawHotline.replace(/^(880|88|0)/, "");
  const hotlineTel = `+880${normalizedHotline}`;
  const hotlineDisplay =
    locale === "bn"
      ? toBanglaNums(`+880 ${normalizedHotline}`)
      : `+880 ${normalizedHotline}`;

  const rawWhatsapp = settings.whatsapp.replace(/[^0-9]/g, "");
  const normalizedWhatsapp = rawWhatsapp.replace(/^(880|88|0)/, "");
  const whatsappUrl = `https://wa.me/880${normalizedWhatsapp}`;
  const whatsappDisplay =
    locale === "bn"
      ? toBanglaNums(`+880 ${normalizedWhatsapp}`)
      : `+880 ${normalizedWhatsapp}`;

  const onSubmit = async (data: ContactMessageInput) => {
    if (typeof window !== "undefined" && !navigator.onLine) {
      toast.error(
        locale === "bn"
          ? "ইন্টারনেট সংযোগ নেই। অনুগ্রহ করে সংযোগ চেক করুন।"
          : "You are offline. Please check your internet connection."
      );
      return;
    }

    try {
      const res = await addContactMessageAction(data);
      if (res.success) {
        setSubmitted(true);
        reset();
        toast.success(
          locale === "bn"
            ? "আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে!"
            : "Message sent successfully!"
        );
      } else {
        toast.error(
          res.error ||
            (locale === "bn"
              ? "বার্তা পাঠাতে ব্যর্থ হয়েছে।"
              : "Failed to send message.")
        );
      }
    } catch {
      toast.error(
        locale === "bn"
          ? "একটি ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।"
          : "An error occurred. Please try again."
      );
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-stretch max-w-5xl mx-auto">
      {/* Contact Info (2 cols on lg) */}
      <div className="lg:col-span-2 space-y-6 flex flex-col justify-between">
        <div className="space-y-6">
          <div>
            <h3 className="font-heading text-xl font-bold text-secondary dark:text-white">
              {t("landing.contactform.contactUsDirectly")}
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              {t("landing.contactform.ourCustomerCareRepresentativesAre")}
            </p>
          </div>

          <div className="space-y-4">
            <a
              href={`tel:${hotlineTel}`}
              className="flex items-center gap-3 p-4 rounded-xl border border-border bg-background hover:bg-muted/50 transition-colors"
            >
              <div className="h-10 w-10 rounded-lg bg-primary-light text-primary flex items-center justify-center">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  {t("landing.contactform.hotlineNumber")}
                </p>
                <p className="text-sm font-bold text-secondary dark:text-white font-mono">
                  {hotlineDisplay}
                </p>
              </div>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 p-4 rounded-xl border border-border bg-background hover:bg-muted/50 transition-colors"
            >
              <div className="h-10 w-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 fill-emerald-600/10" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  {t("landing.contactform.whatsappChat")}
                </p>
                <p className="text-sm font-bold text-secondary dark:text-white font-mono">
                  {whatsappDisplay}
                </p>
              </div>
            </a>

            <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-background">
              <div className="h-10 w-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  {t("landing.contactform.officeAddress")}
                </p>
                <p className="text-sm font-bold text-secondary dark:text-white">
                  {t("landing.contactform.mizanRoadFeni3900")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <a
          href={settings.facebookUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 p-3 bg-secondary text-white rounded-xl hover:bg-slate-800 transition-colors text-sm font-semibold"
        >
          <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
            <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
          </svg>
          {t("landing.contactform.visitFacebookPage")}
        </a>
      </div>

      {/* Form Card (3 cols) */}
      <Card className="lg:col-span-3 border border-border bg-background/50 backdrop-blur shadow-lg">
        <CardContent className="p-4 sm:p-6 md:p-8">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <CheckCircle className="h-16 w-16 text-primary mx-auto animate-bounce" />
              <h3 className="font-heading text-xl font-bold text-secondary dark:text-white">
                {t("landing.contactform.messageSentSuccessfully")}
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                {t("landing.contactform.weHaveReceivedYourMessage")}
              </p>
              <Button
                onClick={() => setSubmitted(false)}
                variant="outline"
                className="mt-4 border-primary text-primary hover:bg-primary/5"
              >
                {t("landing.contactform.sendAnotherMessage")}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <h3 className="font-heading text-xl font-bold text-secondary dark:text-white mb-2">
                {t("landing.contactform.writeUsAMessage")}
              </h3>

              <div className="space-y-1.5">
                <label
                  htmlFor="contact-name"
                  className="text-xs font-semibold text-secondary dark:text-white cursor-pointer"
                >
                  {t("landing.contactform.yourName")}
                </label>
                <Input
                  id="contact-name"
                  type="text"
                  placeholder={t("landing.contactform.egMdAbdurRahman")}
                  className="border-border bg-background"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-xs text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="contact-phone"
                    className="text-xs font-semibold text-secondary dark:text-white cursor-pointer"
                  >
                    {t("landing.contactform.mobileNumber")}
                  </label>
                  <Input
                    id="contact-phone"
                    type="tel"
                    placeholder={t("landing.contactform.eg017xxxxxxxx")}
                    className="border-border bg-background"
                    {...register("phone")}
                  />
                  {errors.phone && (
                    <p className="text-xs text-destructive">{errors.phone.message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label
                    htmlFor="contact-email"
                    className="text-xs font-semibold text-secondary dark:text-white cursor-pointer"
                  >
                    {t("landing.contactform.emailAddress")}
                  </label>
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder={t("landing.contactform.egTestexamplecom")}
                    className="border-border bg-background"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="contact-message"
                  className="text-xs font-semibold text-secondary dark:text-white cursor-pointer"
                >
                  {t("landing.contactform.yourMessage")}
                </label>
                <textarea
                  id="contact-message"
                  rows={4}
                  placeholder={t(
                    "landing.contactform.writeYourQuestionOrMessage"
                  )}
                  className="w-full rounded-md border border-border bg-background p-3 text-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary"
                  {...register("message")}
                />
                {errors.message && (
                  <p className="text-xs text-destructive">{errors.message.message}</p>
                )}
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting
                  ? locale === "bn"
                    ? "পাঠানো হচ্ছে..."
                    : "Sending..."
                  : t("landing.contactform.sendMessage")}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
