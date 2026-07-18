"use client";

import { useState } from "react";
import { CheckCircle2, Building2, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { addPartnerRequestAction } from "@/app/actions/partnerActions";

export default function BecomePartnerPage() {
  const [formData, setFormData] = useState({
    orgName: "",
    category: "hospital",
    address: "",
    discount: "",
    contactName: "",
    phone: "",
    email: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addPartnerRequestAction({
        orgName: formData.orgName,
        category: formData.category as "hospital" | "diagnostic" | "pharmacy",
        address: formData.address,
        discount: formData.discount,
        phone: formData.phone,
        email: formData.email || null,
      });
      setSubmitted(true);
      setFormData({
        orgName: "",
        category: "hospital",
        address: "",
        discount: "",
        contactName: "",
        phone: "",
        email: ""
      });
    } catch (err) {
      console.error(err);
      alert("আবেদনটি জমা দেওয়া সম্ভব হয়নি। অনুগ্রহ করে আবার চেষ্টা করুন।");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-extrabold text-primary tracking-widest uppercase font-mono">For Healthcare Providers</span>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-secondary dark:text-white">
            হেলথ ক্লাব পার্টনার নেটওয়ার্কে যুক্ত হোন
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            আপনার চিকিৎসাকেন্দ্র, ডায়াগনস্টিক ল্যাব বা ফার্মেসীকে আমাদের প্ল্যাটফর্মে রেজিস্টার করে নতুন পেশেন্ট বেস তৈরি করুন।
          </p>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-stretch">
          
          {/* Information & Perks (2 cols) */}
          <div className="md:col-span-2 space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <h3 className="font-heading text-xl font-bold text-secondary dark:text-white">
                অংশীদারিত্বের সুবিধাসমূহ
              </h3>
              
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-secondary dark:text-slate-300">নতুন পেশেন্ট আগমন</h4>
                    <p className="text-xs mt-0.5">আমাদের ১০০+ মেম্বারদের কাছে আপনার ব্র্যান্ড প্রমোট হবে।</p>
                  </div>
                </li>
                
                <li className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-secondary dark:text-slate-300">ডিজিটাল প্রচার ও ব্র্যান্ডিং</h4>
                    <p className="text-xs mt-0.5">আমাদের ওয়েবসাইট ও মোবাইল অ্যাপ ডিরেক্টরিতে আপনার সেন্টারের ফ্রি লিস্টিং পাবেন।</p>
                  </div>
                </li>

                <li className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-secondary dark:text-slate-300">পেশেন্ট লয়্যালটি</h4>
                    <p className="text-xs mt-0.5">ডিজিটাল ভেরিফিকেশন পোর্টালে পেশেন্ট ভ্যালিডেশন অত্যন্ত নিখুঁত ও ক্যাশলেস।</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-muted border border-border flex items-start gap-3">
              <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-bold text-secondary">সহায়তা প্রয়োজন?</p>
                <p className="text-muted-foreground">পার্টনার সম্পর্ক টিম হটলাইন:</p>
                <p className="font-bold text-primary font-mono">+৮৮০ ১৭৮৩৭২১৪১১</p>
              </div>
            </div>
          </div>

          {/* Form Card (3 cols) */}
          <Card className="md:col-span-3 border border-border bg-background/50 backdrop-blur shadow-lg">
            <CardContent className="p-6 sm:p-8">
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <CheckCircle2 className="h-16 w-16 text-primary mx-auto animate-bounce" />
                  <h3 className="font-heading text-xl font-bold text-secondary">
                    আবেদনটি সফলভাবে জমা হয়েছে!
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    আমাদের পার্টনারশিপ রিলেশন প্রতিনিধি আপনার সাথে যোগাযোগ করে ও চুক্তি স্বাক্ষর প্রক্রিয়া সম্পন্ন করতে পরবর্তী ২৪ ঘণ্টার মধ্যে ফোন করবেন।
                  </p>
                  <Button onClick={() => setSubmitted(false)} variant="outline" className="mt-4 border-primary text-primary hover:bg-primary-light">
                    নতুন আবেদন করুন
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="font-heading text-xl font-bold text-secondary dark:text-white mb-2 flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    পার্টনারশিপ আবেদন ফরম
                  </h3>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-secondary">প্রতিষ্ঠানের নাম (যেমন: ল্যাবএইড কুষ্টিয়া) *</label>
                    <Input
                      type="text"
                      name="orgName"
                      required
                      value={formData.orgName}
                      onChange={handleChange}
                      placeholder="প্রতিষ্ঠানের সম্পূর্ণ নাম লিখুন"
                      className="border-border bg-background"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-secondary">প্রতিষ্ঠানের ধরণ *</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      >
                        <option value="hospital">হাসপাতাল (Hospital)</option>
                        <option value="diagnostic">ডায়াগনস্টিক সেন্টার</option>
                        <option value="pharmacy">ফার্মেসী (Pharmacy)</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-secondary">প্রস্তাবিত ডিসকাউন্টের হার *</label>
                      <Input
                        type="text"
                        name="discount"
                        required
                        value={formData.discount}
                        onChange={handleChange}
                        placeholder="যেমন: ১৫% ল্যাব টেস্টে"
                        className="border-border bg-background"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-secondary">প্রতিষ্ঠানের ঠিকানা *</label>
                    <Input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="যেমন: হরিশপুর রোড, কুষ্টিয়া সদর"
                      className="border-border bg-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-secondary">যোগাযোগকারী ব্যক্তির নাম *</label>
                    <Input
                      type="text"
                      name="contactName"
                      required
                      value={formData.contactName}
                      onChange={handleChange}
                      placeholder="যেমন: মোঃ আশরাফুল কবির"
                      className="border-border bg-background"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-secondary">মোবাইল নম্বর *</label>
                      <Input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="যেমন: 017XXXXXXXX"
                        className="border-border bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-secondary">ইমেইল ঠিকানা</label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="যেমন: partner@hospital.com"
                        className="border-border bg-background"
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-semibold">
                    আবেদন সাবমিট করুন
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

        </div>

      </div>
    </div>
  );
}
