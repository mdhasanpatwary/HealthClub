"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Phone, MapPin, CheckCircle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
  youtubeUrl:
    process.env.NEXT_PUBLIC_YOUTUBE_URL ||
    "",
  instagramUrl:
    process.env.NEXT_PUBLIC_INSTAGRAM_URL ||
    "",
  xUrl:
    process.env.NEXT_PUBLIC_X_URL ||
    process.env.NEXT_PUBLIC_TWITTER_URL ||
    "",
  linkedinUrl:
    process.env.NEXT_PUBLIC_LINKEDIN_URL ||
    "",
};

export default function ContactForm({ initialSettings }: ContactFormProps) {
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
  const hotlineDisplay = toBanglaNums(`+880 ${normalizedHotline}`);

  const rawWhatsapp = settings.whatsapp.replace(/[^0-9]/g, "");
  const normalizedWhatsapp = rawWhatsapp.replace(/^(880|88|0)/, "");
  const whatsappUrl = `https://wa.me/880${normalizedWhatsapp}`;
  const whatsappDisplay = toBanglaNums(`+880 ${normalizedWhatsapp}`);

  const onSubmit = async (data: ContactMessageInput) => {
    if (typeof window !== "undefined" && !navigator.onLine) {
      toast.error("ইন্টারনেট সংযোগ নেই। অনুগ্রহ করে সংযোগ চেক করুন।");
      return;
    }

    try {
      const res = await addContactMessageAction(data);
      if (res.success) {
        setSubmitted(true);
        reset();
        toast.success("আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে!");
      } else {
        toast.error(res.error || "বার্তা পাঠাতে ব্যর্থ হয়েছে।");
      }
    } catch {
      toast.error("একটি ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-stretch max-w-5xl mx-auto">
      {/* Contact Info (2 cols on lg) */}
      <div className="lg:col-span-2 space-y-6 flex flex-col justify-between">
        <div className="space-y-6">
          <div>
            <h3 className="font-heading text-xl font-bold text-secondary dark:text-white">
              সরাসরি যোগাযোগ করুন
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              আমাদের কাস্টমার কেয়ার প্রতিনিধি যেকোনো তথ্যের জন্য সার্বক্ষণিক প্রস্তুত।
            </p>
          </div>

          <div className="space-y-4">
            {/* Hotline Item */}
            <a
              href={`tel:${hotlineTel}`}
              className="flex items-start gap-4 p-4 rounded-xl border border-border bg-card/50 hover:bg-card hover:border-primary/50 transition-colors group cursor-pointer"
            >
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-105 transition-transform">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">
                  হটলাইন নম্বর
                </p>
                <p className="text-base font-bold text-secondary dark:text-white font-mono">
                  {hotlineDisplay}
                </p>
              </div>
            </a>

            {/* WhatsApp Item */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 p-4 rounded-xl border border-border bg-card/50 hover:bg-card hover:border-emerald-500/50 transition-colors group cursor-pointer"
            >
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">
                  হোয়াটসঅ্যাপ চ্যাট
                </p>
                <p className="text-base font-bold text-secondary dark:text-white font-mono">
                  {whatsappDisplay}
                </p>
              </div>
            </a>

            {/* Address Item */}
            <div className="flex items-start gap-4 p-4 rounded-xl border border-border bg-card/50">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">
                  অফিস ঠিকানা
                </p>
                <p className="text-sm font-semibold text-secondary dark:text-white">
                  মিজান রোড, ফেনী ৩৯০০, বাংলাদেশ
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Social Link Callout */}
        {settings.facebookUrl && (
          <div className="pt-2">
            <a
              href={settings.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <span>ফেসবুক পেজ দেখুন</span> &rarr;
            </a>
          </div>
        )}
      </div>

      {/* Form (3 cols on lg) */}
      <Card className="lg:col-span-3 border-border shadow-md">
        <CardContent className="p-6 sm:p-8">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="h-14 w-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h4 className="text-xl font-bold text-secondary dark:text-white">
                বার্তা সফলভাবে পাঠানো হয়েছে!
              </h4>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
                আমরা আপনার বার্তা পেয়েছি। দ্রুততম সময়ের মধ্যে আমাদের টিম আপনার সাথে যোগাযোগ করবে।
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSubmitted(false)}
                className="mt-2"
              >
                আরেকটি বার্তা পাঠান
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <h4 className="font-heading text-lg font-bold text-secondary dark:text-white mb-2">
                আমাদের বার্তা পাঠান
              </h4>

              <div className="space-y-1.5">
                <label
                  htmlFor="contact-name"
                  className="text-xs font-semibold text-secondary dark:text-white cursor-pointer"
                >
                  আপনার নাম
                </label>
                <Input
                  id="contact-name"
                  placeholder="যেমন: মোঃ আব্দুর রহমান"
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
                    মোবাইল নম্বর
                  </label>
                  <Input
                    id="contact-phone"
                    type="tel"
                    placeholder="যেমন: 018XXXXXXXX"
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
                    ইমেইল অ্যাড্রেস
                  </label>
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder="যেমন: info@example.com"
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
                  আপনার বার্তা
                </label>
                <textarea
                  id="contact-message"
                  rows={4}
                  placeholder="কী বিষয়ে জানতে চান বিস্তারিত লিখুন..."
                  className="w-full rounded-md border border-border bg-background p-3 text-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary"
                  {...register("message")}
                />
                {errors.message && (
                  <p className="text-xs text-destructive">{errors.message.message}</p>
                )}
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "পাঠানো হচ্ছে..." : "বার্তা পাঠান"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
