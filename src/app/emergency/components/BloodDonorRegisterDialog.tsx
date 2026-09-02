"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BLOOD_GROUPS, UPAZILAS_FENI } from "@/data/emergencyData";
import { registerBloodDonorAction } from "@/app/actions/emergencyActions";
import {
  bloodDonorRegistrationSchema,
  type BloodDonorFormValues,
} from "@/lib/validations/emergency";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Heart, Loader2 } from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";

interface BloodDonorRegisterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BloodDonorRegisterDialog({ open, onOpenChange }: BloodDonorRegisterDialogProps) {
  const { locale, t } = useLanguage();
  const isEn = locale === "en";

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BloodDonorFormValues>({
    resolver: zodResolver(bloodDonorRegistrationSchema),
    defaultValues: {
      name: "",
      phone: "",
      bloodGroup: "O+",
      upazila: "feni-sadar",
      lastDonated: "",
    },
  });

  const selectedBloodGroup = useWatch({ control, name: "bloodGroup" });

  const onSubmit = async (data: BloodDonorFormValues) => {
    try {
      const selectedUpazila = UPAZILAS_FENI.find((u) => u.id === data.upazila);
      const upazilaName = isEn ? selectedUpazila?.nameEn : selectedUpazila?.nameBn;

      const res = await registerBloodDonorAction({
        name: data.name,
        phone: data.phone,
        bloodGroup: data.bloodGroup,
        upazila: upazilaName || data.upazila,
        lastDonated: data.lastDonated,
      });

      if (res.success) {
        toast.success(
          t("emergency.donorModal.successMsg") || (isEn
            ? "Registration submitted! It will appear in the directory once approved by admin."
            : res.message)
        );
        reset();
        onOpenChange(false);
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error(t("emergency.donorModal.errorMsg") || (isEn ? "Failed to submit registration." : "আবেদনটি জমা দেওয়া সম্ভব হয়নি।"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 text-rose-600">
            <Heart className="h-6 w-6 fill-rose-500/20" />
          </div>
          <DialogTitle className="text-center font-heading text-xl font-bold">
            {t("emergency.donorModal.title")}
          </DialogTitle>
          <DialogDescription className="text-center text-xs sm:text-sm text-muted-foreground">
            {t("emergency.donorModal.desc")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="donor-name" className="text-xs font-semibold">
              {t("emergency.donorModal.name")} <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="donor-name"
              placeholder={t("emergency.donorModal.namePlaceholder")}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <Label htmlFor="donor-phone" className="text-xs font-semibold">
              {t("emergency.donorModal.phone")} <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="donor-phone"
              type="tel"
              placeholder={t("emergency.donorModal.phonePlaceholder")}
              {...register("phone")}
            />
            {errors.phone && (
              <p className="text-xs text-destructive">{errors.phone.message}</p>
            )}
          </div>

          {/* Blood Group Select */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">
              {t("emergency.donorModal.bloodGroup")} <span className="text-rose-500">*</span>
            </Label>
            <div className="grid grid-cols-4 gap-1.5">
              {BLOOD_GROUPS.map((bg) => (
                <button
                  type="button"
                  key={bg}
                  onClick={() => setValue("bloodGroup", bg as BloodDonorFormValues["bloodGroup"], { shouldValidate: true })}
                  className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                    selectedBloodGroup === bg
                      ? "bg-rose-600 text-white border-rose-600 shadow-xs"
                      : "bg-background hover:bg-muted text-muted-foreground border-border"
                  }`}
                >
                  {bg}
                </button>
              ))}
            </div>
            {errors.bloodGroup && (
              <p className="text-xs text-destructive">{errors.bloodGroup.message}</p>
            )}
          </div>

          {/* Upazila Select */}
          <div className="space-y-1.5">
            <Label htmlFor="donor-upazila" className="text-xs font-semibold">
              {t("emergency.donorModal.upazila")} <span className="text-rose-500">*</span>
            </Label>
            <select
              id="donor-upazila"
              {...register("upazila")}
              className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {UPAZILAS_FENI.filter((u) => u.id !== "all").map((u) => (
                <option key={u.id} value={u.id}>
                  {isEn ? u.nameEn : u.nameBn}
                </option>
              ))}
            </select>
            {errors.upazila && (
              <p className="text-xs text-destructive">{errors.upazila.message}</p>
            )}
          </div>

          {/* Last Donation */}
          <div className="space-y-1.5">
            <Label htmlFor="last-donated" className="text-xs font-semibold text-muted-foreground">
              {t("emergency.donorModal.lastDonated")}
            </Label>
            <Input
              id="last-donated"
              placeholder={t("emergency.donorModal.lastDonatedPlaceholder")}
              {...register("lastDonated")}
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("emergency.donorModal.submitting")}
                </>
              ) : (
                <>
                  <Heart className="mr-2 h-4 w-4 fill-white" />
                  {t("emergency.donorModal.submit")}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
