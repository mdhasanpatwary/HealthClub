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
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
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
          <div className="space-y-1.5">
            <Label htmlFor="facebook-url" className="text-xs font-semibold">
              {isEn ? "Facebook Page URL" : "ফেসবুক পেজ লিংক"}
            </Label>
            <Input
              id="facebook-url"
              {...register("facebook_url")}
            />
            {errors?.facebook_url && (
              <p className="text-xs text-destructive">{errors.facebook_url.message}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
