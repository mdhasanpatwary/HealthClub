"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BloodDonor, BLOOD_GROUPS, UPAZILAS_FENI } from "@/data/emergencyData";
import { saveBloodDonorAction } from "@/app/actions/emergencyAdminActions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";

interface EmergencyDonorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  donor: BloodDonor | null;
  onSuccess: () => void;
}

export function EmergencyDonorDialog({
  open,
  onOpenChange,
  donor,
  onSuccess,
}: EmergencyDonorDialogProps) {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  const [name, setName] = useState("");
  const [bloodGroup, setBloodGroup] = useState<BloodDonor["bloodGroup"]>("O+");
  const [upazila, setUpazila] = useState("feni-sadar");
  const [phone, setPhone] = useState("");
  const [lastDonated, setLastDonated] = useState("৩ মাস আগে");
  const [isAvailable, setIsAvailable] = useState(true);
  const [status, setStatus] = useState<"approved" | "pending">("approved");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;
    Promise.resolve().then(() => {
      if (!isMounted) return;
      if (donor) {
        setName(donor.name);
        setBloodGroup(donor.bloodGroup);
        setUpazila(donor.upazila);
        setPhone(donor.phone);
        setLastDonated(donor.lastDonated);
        setIsAvailable(donor.isAvailable);
        setStatus(donor.status || "approved");
      } else {
        setName("");
        setBloodGroup("O+");
        setUpazila("feni-sadar");
        setPhone("");
        setLastDonated("৩ মাস আগে");
        setIsAvailable(true);
        setStatus("approved");
      }
    });
    return () => {
      isMounted = false;
    };
  }, [donor, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      toast.error(isEn ? "Please fill all required fields" : "অনুগ্রহ করে সব তথ্য দিন");
      return;
    }

    setSaving(true);
    try {
      const payload: BloodDonor = {
        id: donor ? donor.id : `donor-${Date.now()}`,
        name: name.trim(),
        bloodGroup,
        upazila,
        phone: phone.trim(),
        lastDonated: lastDonated.trim(),
        isAvailable,
        status,
      };

      const res = await saveBloodDonorAction(payload);
      if (res.success) {
        toast.success(
          donor
            ? isEn ? "Donor updated successfully!" : "রক্তদাতার তথ্য আপডেট হয়েছে!"
            : isEn ? "New donor added successfully!" : "নতুন রক্তদাতা যুক্ত করা হয়েছে!"
        );
        onSuccess();
        onOpenChange(false);
      } else {
        toast.error(res.error || (isEn ? "Failed to save donor" : "রক্তদাতা সংরক্ষণ ব্যর্থ হয়েছে"));
      }
    } catch {
      toast.error(isEn ? "An unexpected error occurred" : "একটি সমস্যা দেখা দিয়েছে");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-foreground">
            {donor
              ? isEn ? "Edit Blood Donor" : "রক্তদাতার তথ্য এডিট করুন"
              : isEn ? "Add New Blood Donor" : "নতুন রক্তদাতা যুক্ত করুন"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {isEn
              ? "Fill out volunteer details to show in the public emergency directory."
              : "জরুরি ডিরেক্টরিতে প্রদর্শনের জন্য রক্তদাতার সঠিক তথ্য দিন।"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="donor-name" className="text-xs font-semibold">
              {isEn ? "Full Name" : "রক্তদাতার নাম"} *
            </Label>
            <Input
              id="donor-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={isEn ? "e.g. Tanvir Ahmed" : "যেমন: তানভীর আহমেদ"}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">
                {isEn ? "Blood Group" : "রক্তের গ্রুপ"} *
              </Label>
              <Select
                value={bloodGroup}
                onValueChange={(val) => {
                  if (val) setBloodGroup(val as BloodDonor["bloodGroup"]);
                }}
              >
                <SelectTrigger className="w-full h-9">
                  <SelectValue placeholder="রক্তের গ্রুপ" />
                </SelectTrigger>
                <SelectContent>
                  {BLOOD_GROUPS.map((bg) => (
                    <SelectItem key={bg} value={bg}>
                      {bg}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">
                {isEn ? "Upazila" : "উপজেলা"} *
              </Label>
              <Select
                value={upazila}
                onValueChange={(val) => {
                  if (val) setUpazila(val);
                }}
              >
                <SelectTrigger className="w-full h-9">
                  <SelectValue placeholder="উপজেলা" />
                </SelectTrigger>
                <SelectContent>
                  {UPAZILAS_FENI.filter((u) => u.id !== "all").map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {isEn ? u.nameEn : u.nameBn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="donor-phone" className="text-xs font-semibold">
                {isEn ? "Phone Number" : "মোবাইল নম্বর"} *
              </Label>
              <Input
                id="donor-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01XXXXXXXXX"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="last-donated" className="text-xs font-semibold">
                {isEn ? "Last Donated" : "সর্বশেষ রক্তদান"}
              </Label>
              <Input
                id="last-donated"
                value={lastDonated}
                onChange={(e) => setLastDonated(e.target.value)}
                placeholder={isEn ? "e.g. 3 months ago" : "যেমন: ৩ মাস আগে"}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="donor-status" className="text-xs font-semibold">
              {isEn ? "Approval Status" : "অনুমোদন স্ট্যাটাস"}
            </Label>
            <Select
              value={status}
              onValueChange={(val) => {
                if (val) setStatus(val as "approved" | "pending");
              }}
            >
              <SelectTrigger id="donor-status" className="h-9 text-xs">
                <SelectValue placeholder={isEn ? "Select Status" : "স্ট্যাটাস নির্বাচন করুন"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="approved" className="text-xs">
                  {isEn ? "Approved (Live in Directory)" : "অনুমোদিত (পাবলিক ডিরেক্টরিতে দৃশ্যমান)"}
                </SelectItem>
                <SelectItem value="pending" className="text-xs">
                  {isEn ? "Pending Approval (Hidden from public)" : "অনুমোদন অপেক্ষমাণ (পাবলিক থেকে লুকানো)"}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border">
            <div>
              <Label className="text-xs font-bold text-foreground">
                {isEn ? "Availability Status" : "রক্তদানের জন্য প্রস্তুত?"}
              </Label>
              <p className="text-[11px] text-muted-foreground">
                {isEn
                  ? "Mark if donor is ready to donate right now"
                  : "বর্তমানে রক্তদানে সক্ষম ও প্রস্তুত থাকলে চালু রাখুন"}
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={isAvailable}
              aria-label={isEn ? "Availability Status" : "রক্তদানের জন্য প্রস্তুত"}
              onClick={() => setIsAvailable(!isAvailable)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary ${
                isAvailable ? "bg-emerald-600" : "bg-muted-foreground/30"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  isAvailable ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <DialogFooter className="pt-2 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={saving}
              className="text-xs"
            >
              {isEn ? "Cancel" : "বাতিল"}
            </Button>
            <Button type="submit" disabled={saving} className="text-xs font-bold">
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                  {isEn ? "Saving..." : "সংরক্ষণ হচ্ছে..."}
                </>
              ) : (
                isEn ? "Save Donor" : "সংরক্ষণ করুন"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
