"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BLOOD_GROUPS, UPAZILAS_FENI } from "@/data/emergencyData";
import { registerBloodDonorAction } from "@/app/actions/emergencyActions";
import { toast } from "sonner";
import { Heart, Loader2 } from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";

interface BloodDonorRegisterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BloodDonorRegisterDialog({ open, onOpenChange }: BloodDonorRegisterDialogProps) {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bloodGroup, setBloodGroup] = useState<string>("O+");
  const [upazila, setUpazila] = useState<string>("feni-sadar");
  const [lastDonated, setLastDonated] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      toast.error(isEn ? "Please provide your name and phone number." : "আপনার নাম ও মোবাইল নম্বর প্রদান করুন।");
      return;
    }

    setLoading(true);
    try {
      const selectedUpazila = UPAZILAS_FENI.find((u) => u.id === upazila);
      const upazilaName = isEn ? selectedUpazila?.nameEn : selectedUpazila?.nameBn;

      const res = await registerBloodDonorAction({
        name,
        phone,
        bloodGroup,
        upazila: upazilaName || upazila,
        lastDonated,
      });

      if (res.success) {
        toast.success(
          isEn
            ? "Registration submitted! It will appear in the directory once approved by admin."
            : res.message
        );
        setName("");
        setPhone("");
        setLastDonated("");
        onOpenChange(false);
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error(isEn ? "Failed to submit registration." : "আবেদনটি জমা দেওয়া সম্ভব হয়নি।");
    } finally {
      setLoading(false);
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
            {isEn ? "Register as a Blood Donor" : "রক্তদাতা হিসেবে নিবন্ধন করুন"}
          </DialogTitle>
          <DialogDescription className="text-center text-xs sm:text-sm text-muted-foreground">
            {isEn
              ? "Join our voluntary blood donation network and save lives in emergency situations."
              : "আমাদের স্বেচ্ছাসেবী রক্তদাতা নেটওয়ার্কে যুক্ত হয়ে যেকোনো জরুরি প্রয়োজনে মুমূর্ষু রোগীর পাশে দাঁড়ান।"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="donor-name" className="text-xs font-semibold">
              {isEn ? "Your Full Name" : "আপনার পূর্ণ নাম"} <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="donor-name"
              placeholder={isEn ? "e.g. Tanvir Ahmed" : "যেমন: তানভীর আহমেদ"}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <Label htmlFor="donor-phone" className="text-xs font-semibold">
              {isEn ? "Phone Number" : "মোবাইল নম্বর"} <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="donor-phone"
              type="tel"
              placeholder={isEn ? "e.g. 018XXXXXXXX" : "যেমন: ০১৮XXXXXXXX"}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          {/* Blood Group Select */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">
              {isEn ? "Select Blood Group" : "রক্তের গ্রুপ নির্বাচন করুন"} <span className="text-rose-500">*</span>
            </Label>
            <div className="grid grid-cols-4 gap-1.5">
              {BLOOD_GROUPS.map((bg) => (
                <button
                  type="button"
                  key={bg}
                  onClick={() => setBloodGroup(bg)}
                  className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                    bloodGroup === bg
                      ? "bg-rose-600 text-white border-rose-600 shadow-sm"
                      : "bg-background hover:bg-muted text-muted-foreground border-border"
                  }`}
                >
                  {bg}
                </button>
              ))}
            </div>
          </div>

          {/* Upazila Select */}
          <div className="space-y-1.5">
            <Label htmlFor="donor-upazila" className="text-xs font-semibold">
              {isEn ? "Upazila / Area" : "উপজেলা / এলাকা"} <span className="text-rose-500">*</span>
            </Label>
            <select
              id="donor-upazila"
              value={upazila}
              onChange={(e) => setUpazila(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {UPAZILAS_FENI.filter((u) => u.id !== "all").map((u) => (
                <option key={u.id} value={u.id}>
                  {isEn ? u.nameEn : u.nameBn}
                </option>
              ))}
            </select>
          </div>

          {/* Last Donation */}
          <div className="space-y-1.5">
            <Label htmlFor="last-donated" className="text-xs font-semibold text-muted-foreground">
              {isEn ? "Last Blood Donation (Optional)" : "সর্বশেষ রক্তদানের সময় (ঐচ্ছিক)"}
            </Label>
            <Input
              id="last-donated"
              placeholder={isEn ? "e.g. 3 months ago / Never" : "যেমন: ৩ মাস আগে / কখনো দিইনি"}
              value={lastDonated}
              onChange={(e) => setLastDonated(e.target.value)}
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEn ? "Submitting..." : "জমা দেওয়া হচ্ছে..."}
                </>
              ) : (
                <>
                  <Heart className="mr-2 h-4 w-4 fill-white" />
                  {isEn ? "Submit Registration" : "নিবন্ধন জমা দিন"}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
