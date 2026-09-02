import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard } from "lucide-react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { SystemSettingsFormValues } from "@/lib/validations/settings";

interface PaymentSettingsCardProps {
  register: UseFormRegister<SystemSettingsFormValues>;
  errors?: FieldErrors<SystemSettingsFormValues>;
  isEn: boolean;
}

export function PaymentSettingsCard({
  register,
  errors,
  isEn,
}: PaymentSettingsCardProps) {
  return (
    <Card className="border border-border shadow-xs">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-primary" />
          <span>{isEn ? "Payment & bKash Info" : "বিকাশ ও পেমেন্ট তথ্য"}</span>
        </CardTitle>
        <CardDescription className="text-xs">
          {isEn ? "Receiver mobile numbers for registration/renewals" : "রেজিস্ট্রেশন ও রিনিউয়ালের পেমেন্ট নাম্বার"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="bkash-personal" className="text-xs font-semibold">
              {isEn ? "bKash Personal Number" : "বিকাশ পার্সোনাল নম্বর"}
            </Label>
            <Input
              id="bkash-personal"
              {...register("bkash_personal_number")}
            />
            {errors?.bkash_personal_number && (
              <p className="text-xs text-destructive">{errors.bkash_personal_number.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bkash-merchant" className="text-xs font-semibold">
              {isEn ? "bKash Merchant Number" : "বিকাশ মার্চেন্ট নম্বর"}
            </Label>
            <Input
              id="bkash-merchant"
              {...register("bkash_merchant_number")}
            />
            {errors?.bkash_merchant_number && (
              <p className="text-xs text-destructive">{errors.bkash_merchant_number.message}</p>
            )}
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="payment-instructions" className="text-xs font-semibold">
            {isEn ? "Payment Instructions Text" : "পেমেন্ট নির্দেশিকা টেক্সট"}
          </Label>
          <textarea
            id="payment-instructions"
            rows={2}
            {...register("payment_instructions")}
            className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          {errors?.payment_instructions && (
            <p className="text-xs text-destructive">{errors.payment_instructions.message}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
