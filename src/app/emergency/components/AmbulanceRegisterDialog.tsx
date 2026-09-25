"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UPAZILAS_FENI, AMBULANCE_TYPES } from "@/data/emergencyData";
import { registerAmbulanceAction } from "@/app/actions/emergencyActions";
import {
  ambulanceDialogFormSchema,
  type AmbulanceDialogFormValues,
} from "@/lib/validations/emergency";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Truck, Loader2, ShieldCheck } from "lucide-react";

interface AmbulanceRegisterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AmbulanceRegisterDialog({
  open,
  onOpenChange,
}: AmbulanceRegisterDialogProps) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AmbulanceDialogFormValues>({
    resolver: zodResolver(ambulanceDialogFormSchema),
    defaultValues: {
      serviceName: "",
      operatorName: "",
      phone: "",
      altPhone: "",
      type: "AC",
      upazila: "feni-sadar",
      standLocation: "",
      coverage: "",
    },
  });

  const selectedType = useWatch({ control, name: "type" });

  const onSubmit = async (data: AmbulanceDialogFormValues) => {
    try {
      const selectedUpazilaObj = UPAZILAS_FENI.find((u) => u.id === data.upazila);
      const upazilaLabel = selectedUpazilaObj?.nameBn;
      const fullLocation = data.standLocation?.trim()
        ? `${upazilaLabel || data.upazila} (${data.standLocation.trim()})`
        : upazilaLabel || data.upazila;

      const res = await registerAmbulanceAction({
        serviceName: data.serviceName.trim(),
        operatorName: data.operatorName.trim(),
        phone: data.phone.trim(),
        altPhone: data.altPhone?.trim() || undefined,
        type: data.type,
        location: fullLocation,
        coverage: data.coverage?.trim() || undefined,
      });

      if (res.success) {
        toast.success(
          "অ্যাম্বুলেন্স তালিকাভুক্তির আবেদন সফলভাবে জমা হয়েছে! যাচাই করে দ্রুত প্রকাশ করা হবে।"
        );
        reset();
        onOpenChange(false);
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error(
        "নিবন্ধন জমা দেওয়া সম্ভব হয়নি। অনুগ্রহ করে আবার চেষ্টা করুন।"
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Truck className="h-6 w-6" />
          </div>
          <DialogTitle className="text-center font-heading text-xl font-bold">
            অ্যাম্বুলেন্স সার্ভিস তালিকাভুক্ত করুন
          </DialogTitle>
          <DialogDescription className="text-center text-xs sm:text-sm text-muted-foreground">
            ফেনী জেলা জরুরি স্বাস্থ্য ডিরেক্টরিতে আপনার অ্যাম্বুলেন্স তালিকাভুক্ত করুন।
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Service / Ambulance Name */}
          <div className="space-y-1.5">
            <Label htmlFor="ambulance-service-name" className="text-xs font-semibold">
              অ্যাম্বুলেন্স / সার্ভিসের নাম{" "}
              <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="ambulance-service-name"
              placeholder="যেমন: আল-মদিনা এসি অ্যাম্বুলেন্স সার্ভিস"
              {...register("serviceName")}
            />
            {errors.serviceName && (
              <p className="text-xs text-destructive">{errors.serviceName.message}</p>
            )}
          </div>

          {/* Driver / Operator Name */}
          <div className="space-y-1.5">
            <Label htmlFor="ambulance-operator-name" className="text-xs font-semibold">
              চালক বা মালিকের নাম{" "}
              <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="ambulance-operator-name"
              placeholder="যেমন: মোঃ জসীম উদ্দিন"
              {...register("operatorName")}
            />
            {errors.operatorName && (
              <p className="text-xs text-destructive">{errors.operatorName.message}</p>
            )}
          </div>

          {/* Phone Numbers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="ambulance-phone" className="text-xs font-semibold">
                প্রধান কল নম্বর (২৪/৭){" "}
                <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="ambulance-phone"
                type="tel"
                placeholder="যেমন: ০১৮XXXXXXXX"
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-xs text-destructive">{errors.phone.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ambulance-alt-phone" className="text-xs font-semibold text-muted-foreground">
                বিকল্প নম্বর (ঐচ্ছিক)
              </Label>
              <Input
                id="ambulance-alt-phone"
                type="tel"
                placeholder="যেমন: ০১৭XXXXXXXX"
                {...register("altPhone")}
              />
              {errors.altPhone && (
                <p className="text-xs text-destructive">{errors.altPhone.message}</p>
              )}
            </div>
          </div>

          {/* Ambulance Type Selection */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">
              অ্যাম্বুলেন্সের ধরন{" "}
              <span className="text-rose-500">*</span>
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {AMBULANCE_TYPES.map((tItem) => (
                <button
                  type="button"
                  key={tItem.id}
                  onClick={() => setValue("type", tItem.id as AmbulanceDialogFormValues["type"], { shouldValidate: true })}
                  className={`p-2.5 text-xs font-bold rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    selectedType === tItem.id
                      ? "bg-primary/10 text-primary border-primary shadow-2xs font-semibold"
                      : "bg-background hover:bg-muted text-muted-foreground border-border"
                  }`}
                >
                  <span>{tItem.nameBn}</span>
                  {selectedType === tItem.id && <span className="text-primary font-bold">✓</span>}
                </button>
              ))}
            </div>
            {errors.type && (
              <p className="text-xs text-destructive">{errors.type.message}</p>
            )}
          </div>

          {/* Upazila & Stand Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="ambulance-upazila" className="text-xs font-semibold">
                উপজেলা / এলাকা{" "}
                <span className="text-rose-500">*</span>
              </Label>
              <select
                id="ambulance-upazila"
                {...register("upazila")}
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {UPAZILAS_FENI.filter((u) => u.id !== "all").map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.nameBn}
                  </option>
                ))}
              </select>
              {errors.upazila && (
                <p className="text-xs text-destructive">{errors.upazila.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ambulance-stand" className="text-xs font-semibold">
                স্ট্যান্ড / নির্দিষ্ট স্থান
              </Label>
              <Input
                id="ambulance-stand"
                placeholder="যেমন: সদর হাসপাতাল গেইট"
                {...register("standLocation")}
              />
            </div>
          </div>

          {/* Coverage Note */}
          <div className="space-y-1.5">
            <Label htmlFor="ambulance-coverage" className="text-xs font-semibold text-muted-foreground">
              সার্ভিস রুট / কভারেজ (ঐচ্ছিক)
            </Label>
            <Input
              id="ambulance-coverage"
              placeholder="যেমন: সমগ্র ফেনী ও ঢাকা/চট্টগ্রাম ট্রিপ"
              {...register("coverage")}
            />
          </div>

          {/* Verified listing note */}
          <div className="flex items-start gap-2 p-2.5 rounded-xl bg-muted/60 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <span>
              তথ্য সাবমিট করার পর আমাদের হেল্পডেস্ক টিম যাচাই করে দ্রুত ডিরেক্টরিতে উন্মুক্ত করবে।
            </span>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  জমা দেওয়া হচ্ছে...
                </>
              ) : (
                <>
                  <Truck className="mr-2 h-4 w-4" />
                  অ্যাম্বুলেন্স তথ্য জমা দিন
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

