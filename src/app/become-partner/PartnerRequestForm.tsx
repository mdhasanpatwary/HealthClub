"use client";

import { useState } from "react";
import { CheckCircle2, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { addPartnerRequestAction } from "@/app/actions/partnerActions";
import { toast } from "sonner";

type FormData = {
  orgName: string;
  category: string;
  address: string;
  discount: string;
  contactName: string;
  phone: string;
  email: string;
};

const initialFormData: FormData = {
  orgName: "",
  category: "hospital",
  address: "",
  discount: "",
  contactName: "",
  phone: "",
  email: "",
};

export default function PartnerRequestForm() {
  const [formData, setFormData] = useState(initialFormData);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    try {
      const result = await addPartnerRequestAction({
        orgName: formData.orgName.trim(),
        category: formData.category as "hospital" | "diagnostic" | "pharmacy",
        address: formData.address.trim(),
        discount: formData.discount.trim(),
        contactName: formData.contactName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
      });

      if (!result?.success) {
        toast.error(result?.error || "একটি সমস্যা হয়েছে, আবার চেষ্টা করুন।");
        return;
      }

      setSubmitted(true);
      setFormData(initialFormData);
      toast.success("আবেদনটি সফলভাবে জমা হয়েছে!");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "একটি সমস্যা হয়েছে, আবার চেষ্টা করুন।");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  return (
    <Card className="md:col-span-3 border border-border bg-background/50 backdrop-blur shadow-lg">
      <CardContent className="p-6 sm:p-8">
        {submitted ? (
          <div className="text-center py-12 space-y-4">
            <CheckCircle2 className="h-16 w-16 text-primary mx-auto animate-bounce" />
            <h2 className="font-heading text-xl font-bold text-secondary dark:text-white">আবেদনটি সফলভাবে জমা হয়েছে!</h2>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">আমাদের পার্টনারশিপ রিলেশন প্রতিনিধি আপনার সাথে যোগাযোগ করে ও চুক্তি স্বাক্ষর প্রক্রিয়া সম্পন্ন করতে পরবর্তী ২৪ ঘণ্টার মধ্যে ফোন করবেন।</p>
            <Button onClick={() => setSubmitted(false)} variant="outline" className="mt-4 border-primary text-primary hover:bg-primary-light">নতুন আবেদন করুন</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="font-heading text-xl font-bold text-secondary dark:text-white mb-2 flex items-center gap-2"><Building2 className="h-5 w-5 text-primary" />পার্টনারশিপ আবেদন ফর্ম</h2>
            <div className="space-y-2"><label htmlFor="partner-orgName" className="text-xs font-semibold text-secondary dark:text-white cursor-pointer">হাসপাতাল / ল্যাব / ফার্মেসির নাম *</label><Input id="partner-orgName" name="orgName" required value={formData.orgName} onChange={handleChange} placeholder="প্রতিষ্ঠানের সম্পূর্ণ নাম লিখুন" className="border-border bg-background" /></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2"><label htmlFor="partner-category" className="text-xs font-semibold text-secondary dark:text-white cursor-pointer">প্রতিষ্ঠানের ধরন / ক্যাটাগরি *</label><select id="partner-category" name="category" value={formData.category} onChange={handleChange} className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary"><option value="hospital">হাসপাতাল (Hospital)</option><option value="diagnostic">ডায়াগনস্টিক সেন্টার</option><option value="pharmacy">ফার্মেসি (Pharmacy)</option></select></div>
              <div className="space-y-2"><label htmlFor="partner-discount" className="text-xs font-semibold text-secondary dark:text-white cursor-pointer">প্রস্তাবিত ডিসকাউন্ট রেট (যেমন: প্যাথলজিতে ২০%) *</label><Input id="partner-discount" name="discount" required value={formData.discount} onChange={handleChange} placeholder="যেমন: ১৫% ল্যাব টেস্টে" className="border-border bg-background" /></div>
            </div>
            <div className="space-y-2"><label htmlFor="partner-address" className="text-xs font-semibold text-secondary dark:text-white cursor-pointer">প্রতিষ্ঠানের পূর্ণ ঠিকানা *</label><Input id="partner-address" name="address" required value={formData.address} onChange={handleChange} placeholder="যেমন: মিজান রোড, ফেনী" className="border-border bg-background" /></div>
            <div className="space-y-2"><label htmlFor="partner-contactName" className="text-xs font-semibold text-secondary dark:text-white cursor-pointer">যোগাযোগকারী কর্মকর্তার নাম ও পদবী *</label><Input id="partner-contactName" name="contactName" required value={formData.contactName} onChange={handleChange} placeholder="যেমন: মোঃ আশরাফুল কবির" className="border-border bg-background" /></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2"><label htmlFor="partner-phone" className="text-xs font-semibold text-secondary dark:text-white cursor-pointer">অফিসিয়াল মোবাইল নম্বর *</label><Input id="partner-phone" type="tel" name="phone" required value={formData.phone} onChange={handleChange} placeholder="017XXXXXXXX" className="border-border bg-background" /></div>
              <div className="space-y-2"><label htmlFor="partner-email" className="text-xs font-semibold text-secondary dark:text-white cursor-pointer">অফিসিয়াল ইমেইল অ্যাড্রেস *</label><Input id="partner-email" type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="partner@hospital.com" className="border-border bg-background" /></div>
            </div>
            <Button type="submit" disabled={submitting} className="w-full bg-primary hover:bg-primary-dark text-white font-semibold">{submitting ? "আবেদন জমা দেওয়া হচ্ছে..." : "আবেদন জমা দিন"}</Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}