import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Coins } from "lucide-react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { SystemSettingsFormValues } from "@/lib/validations/settings";

interface FeeSettingsCardProps {
  register: UseFormRegister<SystemSettingsFormValues>;
  errors?: FieldErrors<SystemSettingsFormValues>;
  isEn: boolean;
}

export function FeeSettingsCard({
  register,
  errors,
  isEn,
}: FeeSettingsCardProps) {
  return (
    <Card className="border border-border shadow-xs">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Coins className="h-4 w-4 text-primary" />
          <span>{isEn ? "Membership Pricing" : "মেম্বারশিপ ফি নির্ধারণ"}</span>
        </CardTitle>
        <CardDescription className="text-xs">
          {isEn ? "Annual subscription fee for membership plans" : "সদস্যপদের বাৎসরিক ফি নির্ধারণ করুন"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="founding-fee" className="text-xs font-semibold">
            {isEn ? "Founding Member Annual Fee (৳)" : "ফাউন্ডিং মেম্বার ফি (৳)"}
          </Label>
          <Input
            id="founding-fee"
            type="number"
            {...register("founding_fee")}
          />
          {errors?.founding_fee && (
            <p className="text-xs text-destructive">{errors.founding_fee.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="premium-fee" className="text-xs font-semibold">
            {isEn ? "Premium Member Annual Fee (৳)" : "প্রিমিয়াম মেম্বার ফি (৳)"}
          </Label>
          <Input
            id="premium-fee"
            type="number"
            {...register("premium_fee")}
          />
          {errors?.premium_fee && (
            <p className="text-xs text-destructive">{errors.premium_fee.message}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
