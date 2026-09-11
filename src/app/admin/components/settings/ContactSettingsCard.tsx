import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneCall } from "lucide-react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { SystemSettingsFormValues } from "@/lib/validations/settings";

interface ContactSettingsCardProps {
  register: UseFormRegister<SystemSettingsFormValues>;
  errors?: FieldErrors<SystemSettingsFormValues>;
  isEn: boolean;
}

export function ContactSettingsCard({
  register,
  errors,
  isEn,
}: ContactSettingsCardProps) {
  return (
    <Card className="border border-border shadow-xs">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <PhoneCall className="h-4 w-4 text-primary" />
          <span>{isEn ? "Contact & Social Links" : "যোগাযোগ ও সোশ্যাল মিডিয়া"}</span>
        </CardTitle>
        <CardDescription className="text-xs">
          {isEn ? "Official hotline, WhatsApp, and social channels" : "সাইটের ফুটার ও কন্টাক্ট সেকশনের তথ্য"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="hotline-phone" className="text-xs font-semibold">
              {isEn ? "Hotline Number" : "হটলাইন ফোন নম্বর"}
            </Label>
            <Input
              id="hotline-phone"
              {...register("hotline_phone")}
            />
            {errors?.hotline_phone && (
              <p className="text-xs text-destructive">{errors.hotline_phone.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="whatsapp-phone" className="text-xs font-semibold">
              {isEn ? "WhatsApp Support Number" : "হোয়াটসঅ্যাপ নম্বর"}
            </Label>
            <Input
              id="whatsapp-phone"
              {...register("whatsapp_phone")}
            />
            {errors?.whatsapp_phone && (
              <p className="text-xs text-destructive">{errors.whatsapp_phone.message}</p>
            )}
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="official-email" className="text-xs font-semibold">
              {isEn ? "Official Email" : "অফিসিয়াল ইমেইল"}
            </Label>
            <Input
              id="official-email"
              type="email"
              {...register("official_email")}
            />
            {errors?.official_email && (
              <p className="text-xs text-destructive">{errors.official_email.message}</p>
            )}
          </div>
        </div>

        {/* Social Accounts Section */}
        <div className="pt-2 border-t border-border/60">
          <p className="text-xs font-medium text-muted-foreground mb-3">
            {isEn
              ? "Social Media Profiles (links will show matching icons in footer)"
              : "সোশ্যাল মিডিয়া প্রোফাইল (লিংক দিলে ফুটারে সংশ্লিষ্ট আইকন প্রদর্শিত হবে)"}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="facebook-url" className="text-xs font-semibold">
                {isEn ? "Facebook Page URL" : "ফেসবুক পেজ লিংক"}
              </Label>
              <Input
                id="facebook-url"
                placeholder={isEn ? "e.g. https://facebook.com/healthclub" : "যেমন: https://facebook.com/healthclub"}
                {...register("facebook_url")}
              />
              {errors?.facebook_url && (
                <p className="text-xs text-destructive">{errors.facebook_url.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="youtube-url" className="text-xs font-semibold">
                {isEn ? "YouTube Channel URL" : "ইউটিউব চ্যানেল লিংক"}
              </Label>
              <Input
                id="youtube-url"
                placeholder={isEn ? "e.g. https://youtube.com/@healthclub" : "যেমন: https://youtube.com/@healthclub"}
                {...register("youtube_url")}
              />
              {errors?.youtube_url && (
                <p className="text-xs text-destructive">{errors.youtube_url.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="instagram-url" className="text-xs font-semibold">
                {isEn ? "Instagram Profile URL" : "ইনস্টাগ্রাম প্রোফাইল লিংক"}
              </Label>
              <Input
                id="instagram-url"
                placeholder={isEn ? "e.g. https://instagram.com/healthclub" : "যেমন: https://instagram.com/healthclub"}
                {...register("instagram_url")}
              />
              {errors?.instagram_url && (
                <p className="text-xs text-destructive">{errors.instagram_url.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="x-url" className="text-xs font-semibold">
                {isEn ? "X (Twitter) Profile URL" : "X (টুইটার) প্রোফাইল লিংক"}
              </Label>
              <Input
                id="x-url"
                placeholder={isEn ? "e.g. https://x.com/healthclub" : "যেমন: https://x.com/healthclub"}
                {...register("x_url")}
              />
              {errors?.x_url && (
                <p className="text-xs text-destructive">{errors.x_url.message}</p>
              )}
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="linkedin-url" className="text-xs font-semibold">
                {isEn ? "LinkedIn Page URL" : "লিংকডইন পেজ লিংক"}
              </Label>
              <Input
                id="linkedin-url"
                placeholder={isEn ? "e.g. https://linkedin.com/company/healthclub" : "যেমন: https://linkedin.com/company/healthclub"}
                {...register("linkedin_url")}
              />
              {errors?.linkedin_url && (
                <p className="text-xs text-destructive">{errors.linkedin_url.message}</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
