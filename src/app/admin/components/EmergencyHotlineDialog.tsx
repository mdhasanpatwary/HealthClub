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
import { EmergencyHotline } from "@/data/emergencyData";
import { saveHotlineAction } from "@/app/actions/emergencyHotlineActions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";

interface EmergencyHotlineDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hotline: EmergencyHotline | null;
  onSuccess: () => void;
}

export function EmergencyHotlineDialog({
  open,
  onOpenChange,
  hotline,
  onSuccess,
}: EmergencyHotlineDialogProps) {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  const [titleBn, setTitleBn] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [category, setCategory] = useState<EmergencyHotline["category"]>("oxygen");
  const [phone, setPhone] = useState("");
  const [descriptionBn, setDescriptionBn] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;
    Promise.resolve().then(() => {
      if (!isMounted) return;
      if (hotline) {
        setTitleBn(hotline.titleBn);
        setTitleEn(hotline.titleEn);
        setCategory(hotline.category);
        setPhone(hotline.phone);
        setDescriptionBn(hotline.descriptionBn);
        setDescriptionEn(hotline.descriptionEn);
      } else {
        setTitleBn("");
        setTitleEn("");
        setCategory("oxygen");
        setPhone("");
        setDescriptionBn("");
        setDescriptionEn("");
      }
    });
    return () => {
      isMounted = false;
    };
  }, [hotline, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleBn.trim() || !phone.trim()) {
      toast.error(isEn ? "Please fill all required fields" : "অনুগ্রহ করে সব তথ্য দিন");
      return;
    }

    setSaving(true);
    try {
      const payload: EmergencyHotline = {
        id: hotline ? hotline.id : `hotline-${Date.now()}`,
        titleBn: titleBn.trim(),
        titleEn: titleEn.trim() || titleBn.trim(),
        category,
        phone: phone.trim(),
        descriptionBn: descriptionBn.trim(),
        descriptionEn: descriptionEn.trim() || descriptionBn.trim(),
      };

      const res = await saveHotlineAction(payload);
      if (res.success) {
        toast.success(
          hotline
            ? isEn ? "Hotline updated successfully!" : "হটলাইনের তথ্য আপডেট হয়েছে!"
            : isEn ? "New hotline added successfully!" : "নতুন জরুরি হটলাইন যুক্ত হয়েছে!"
        );
        onSuccess();
        onOpenChange(false);
      } else {
        toast.error(res.error || (isEn ? "Failed to save hotline" : "সংরক্ষণ ব্যর্থ হয়েছে"));
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
            {hotline
              ? isEn ? "Edit Emergency Hotline / Oxygen" : "জরুরি হটলাইন / অক্সিজেন এডিট করুন"
              : isEn ? "Add Emergency Hotline / Oxygen" : "নতুন জরুরি হটলাইন / অক্সিজেন যুক্ত করুন"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {isEn
              ? "Provide organization name, category, and direct calling number."
              : "হাসপাতাল, অক্সিজেন বা জরুরি সংস্থার নাম ও হেল্পলাইন নম্বর দিন।"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="hotline-title-bn" className="text-xs font-semibold">
                {isEn ? "Title (Bangla)" : "নাম (বাংলায়)"} *
              </Label>
              <Input
                id="hotline-title-bn"
                value={titleBn}
                onChange={(e) => setTitleBn(e.target.value)}
                placeholder="যেমন: ফেনী অক্সিজেন সেবা"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="hotline-title-en" className="text-xs font-semibold">
                {isEn ? "Title (English)" : "নাম (ইংরেজিতে)"}
              </Label>
              <Input
                id="hotline-title-en"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="e.g. Feni Oxygen Supply"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">
                {isEn ? "Category" : "ক্যাটাগরি"} *
              </Label>
              <Select
                value={category}
                onValueChange={(val) => {
                  if (val) setCategory(val as EmergencyHotline["category"]);
                }}
              >
                <SelectTrigger className="w-full h-9">
                  <SelectValue placeholder="ক্যাটাগরি" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="oxygen">অক্সিজেন সেবা (Oxygen)</SelectItem>
                  <SelectItem value="hospital">হাসপাতাল (Hospital)</SelectItem>
                  <SelectItem value="blood_bank">ব্লাড ব্যাংক (Blood Bank)</SelectItem>
                  <SelectItem value="fire">ফায়ার সার্ভিস (Fire)</SelectItem>
                  <SelectItem value="police">পুলিশ / জাতীয় (Police/National)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="hotline-phone" className="text-xs font-semibold">
                {isEn ? "Phone Number" : "ফোন নম্বর"} *
              </Label>
              <Input
                id="hotline-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01XXXXXXXXX বা 16263"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="hotline-desc-bn" className="text-xs font-semibold">
              {isEn ? "Short Description (Bangla)" : "সংক্ষিপ্ত বিবরণ (বাংলা)"}
            </Label>
            <Input
              id="hotline-desc-bn"
              value={descriptionBn}
              onChange={(e) => setDescriptionBn(e.target.value)}
              placeholder="যেমন: ২৪/৭ জরুরি হোম ডেলিভারি ও রিফিল সুবিধা"
            />
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
                isEn ? "Save Hotline" : "সংরক্ষণ করুন"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
