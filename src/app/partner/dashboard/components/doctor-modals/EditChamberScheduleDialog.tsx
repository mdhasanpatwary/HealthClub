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
import { Doctor } from "@/services/db";
import { updatePartnerDoctorChamberAction } from "@/app/actions/partnerDoctorActions";
import {
  updatePartnerDoctorSchema,
  type UpdatePartnerDoctorFormValues,
} from "@/lib/validations/doctor";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Building2 } from "lucide-react";
import { DEPT_OPTIONS, DAY_PRESETS } from "./doctorModalConstants";

export interface EditChamberModalProps {
  doctor: Doctor | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

function EditChamberForm({
  doctor,
  onClose,
  onSuccess,
}: {
  doctor: Doctor;
  onClose: () => void;
  onSuccess: () => void;
}) {

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<UpdatePartnerDoctorFormValues>({
    resolver: zodResolver(updatePartnerDoctorSchema),
    defaultValues: {
      name: doctor.name || "",
      specialty: doctor.specialty || "",
      department: doctor.department || "medicine",
      degrees: doctor.degrees || "",
      designation: doctor.designation || "",
      roomNo: doctor.roomNo || "",
      visitingDays: doctor.visitingDays || "",
      visitingHours: doctor.visitingHours || "",
      serialPhone: doctor.serialPhone || "",
      consultationFee: doctor.consultationFee || "",
      isActive: doctor.isActive ?? true,
      availableToday: doctor.availableToday !== false,
      onLeaveUntil: doctor.onLeaveUntil ? doctor.onLeaveUntil.slice(0, 10) : "",
      notice: doctor.notice || "",
    },
  });

  const availableToday = useWatch({ control, name: "availableToday" });

  const onSubmit = async (data: UpdatePartnerDoctorFormValues) => {
    try {
      const res = await updatePartnerDoctorChamberAction(doctor.id, {
        name: data.name?.trim(),
        specialty: data.specialty?.trim(),
        department: data.department,
        degrees: data.degrees?.trim(),
        designation: data.designation?.trim(),
        roomNo: data.roomNo?.trim() || undefined,
        visitingDays: data.visitingDays?.trim(),
        visitingHours: data.visitingHours?.trim(),
        serialPhone: data.serialPhone?.trim(),
        consultationFee: data.consultationFee?.trim() || undefined,
        isActive: data.isActive,
        availableToday: data.availableToday,
        onLeaveUntil: data.onLeaveUntil || undefined,
        notice: data.notice?.trim() || undefined,
      });

      if (res.success) {
        toast.success("চেম্বার সময়সূচী সফলভাবে আপডেট করা হয়েছে।");
        onSuccess();
        onClose();
      } else {
        toast.error(res.error || "চেম্বার তথ্য আপডেট করতে সমস্যা হয়েছে।");
      }
    } catch {
      toast.error("সার্ভারে ত্রুটি হয়েছে, অনুগ্রহ করে আবার চেষ্টা করুন");
    }
  };

  return (
    <DialogContent className="border-border bg-background max-h-[90vh] overflow-y-auto overflow-x-hidden w-full max-w-[calc(100vw-2rem)] sm:max-w-2xl md:max-w-3xl p-4 sm:p-6">
      <DialogHeader className="space-y-1">
        <DialogTitle className="font-heading font-bold text-base sm:text-lg md:text-xl flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary shrink-0" />
          <span className="truncate">চেম্বার সময়সূচী পরিবর্তন করুন</span>
        </DialogTitle>
        <DialogDescription className="text-xs text-muted-foreground">
          {doctor.name} - চেম্বারের সময়সূচী, ফি ও অন্যান্য তথ্য আপডেট করুন
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2 w-full max-w-full overflow-x-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-full">
          <div className="space-y-1.5">
            <label htmlFor="edit-doc-name" className="text-xs font-semibold text-foreground">ডাক্তারের নাম</label>
            <Input
              id="edit-doc-name"
              {...register("name")}
              className="h-10 text-sm"
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="edit-doc-dept" className="text-xs font-semibold text-foreground">বিভাগ</label>
            <select
              id="edit-doc-dept"
              {...register("department")}
              className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {DEPT_OPTIONS.map((dept) => (
                <option key={dept.value} value={dept.value}>{dept.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label htmlFor="edit-doc-spec" className="text-xs font-semibold text-foreground">বিশেষজ্ঞতা ও ডিগ্রী</label>
            <Input
              id="edit-doc-spec"
              {...register("specialty")}
              placeholder="মেডিসিন ও হৃদরোগ বিশেষজ্ঞ"
              className="h-10 text-sm"
            />
            {errors.specialty && (
              <p className="text-xs text-destructive">{errors.specialty.message}</p>
            )}
          </div>

          {/* Chamber Fields */}
          <div className="space-y-1.5">
            <label htmlFor="edit-doc-room" className="text-xs font-semibold text-primary">রুম / চেম্বার নম্বর</label>
            <Input
              id="edit-doc-room"
              {...register("roomNo")}
              placeholder="রুম নং ২০৪, ২য় তলা"
              className="h-10 text-sm border-primary/40 focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="edit-doc-fee" className="text-xs font-semibold text-foreground">পরামর্শ ফি</label>
            <Input
              id="edit-doc-fee"
              {...register("consultationFee")}
              placeholder="৳৮০০"
              className="h-10 text-sm"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label htmlFor="edit-doc-days" className="text-xs font-semibold text-foreground">রোগী দেখার দিনসমূহ *</label>
            <Input
              id="edit-doc-days"
              {...register("visitingDays")}
              className="h-10 text-sm"
            />
            {errors.visitingDays && (
              <p className="text-xs text-destructive">{errors.visitingDays.message}</p>
            )}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {DAY_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setValue("visitingDays", preset, { shouldValidate: true })}
                  className="text-[11px] bg-muted hover:bg-muted/80 text-foreground px-2 py-0.5 rounded-md border border-border cursor-pointer transition-colors"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="edit-doc-hours" className="text-xs font-semibold text-foreground">রোগী দেখার সময় *</label>
            <Input
              id="edit-doc-hours"
              {...register("visitingHours")}
              className="h-10 text-sm"
            />
            {errors.visitingHours && (
              <p className="text-xs text-destructive">{errors.visitingHours.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="edit-doc-phone" className="text-xs font-semibold text-foreground">সিরিয়ালের ফোন নম্বর *</label>
            <Input
              id="edit-doc-phone"
              {...register("serialPhone")}
              className="h-10 text-sm"
            />
            {errors.serialPhone && (
              <p className="text-xs text-destructive">{errors.serialPhone.message}</p>
            )}
          </div>
        </div>

        {/* Availability & Notices in Edit Modal */}
        <div className="p-3.5 bg-muted/20 border border-border/80 rounded-2xl space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            <div className="flex items-center justify-between p-2.5 bg-background border border-border/80 rounded-xl">
              <div>
                <label htmlFor="edit-doc-available" className="text-xs font-bold text-foreground block cursor-pointer">
                  আজ রোগী দেখবেন
                </label>
                <span className="text-[10px] text-muted-foreground">
                  {availableToday ? "চেম্বারে রোগী দেখা চালু রয়েছে" : "আজ চেম্বার বন্ধ রয়েছে"}
                </span>
              </div>
              <input
                id="edit-doc-available"
                type="checkbox"
                {...register("availableToday")}
                className="h-5 w-5 rounded border-border text-primary focus:ring-primary cursor-pointer accent-primary"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="edit-doc-leave" className="text-xs font-semibold text-foreground cursor-pointer">
                কত তারিখ পর্যন্ত ছুটিতে আছেন
              </label>
              <Input
                id="edit-doc-leave"
                type="date"
                {...register("onLeaveUntil")}
                className="h-9 text-xs"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="edit-doc-notice" className="text-xs font-semibold text-foreground cursor-pointer">
              বিশেষ জরুরি নোটিশ (ঐচ্ছিক)
            </label>
            <Input
              id="edit-doc-notice"
              type="text"
              placeholder="আজ সন্ধ্যা ৬টার পর রোগী দেখা শুরু হবে"
              {...register("notice")}
              className="h-9 text-xs"
            />
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2 pt-4 border-t border-border w-full">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting} className="rounded-xl w-full sm:w-auto">
            বাতিল
          </Button>
          <Button type="submit" disabled={isSubmitting} className="rounded-xl bg-primary text-white hover:bg-primary/90 cursor-pointer w-full sm:w-auto">
            {isSubmitting ? "সংরক্ষণ করা হচ্ছে..." : "পরিবর্তন সংরক্ষণ করুন"}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}

export function EditChamberScheduleDialog({
  doctor,
  isOpen,
  onClose,
  onSuccess,
}: EditChamberModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {doctor && (
        <EditChamberForm
          key={doctor.id}
          doctor={doctor}
          onClose={onClose}
          onSuccess={onSuccess}
        />
      )}
    </Dialog>
  );
}
