"use client";

import { useState } from "react";
import { Phone, MapPin, CheckCircle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission
    setTimeout(() => {
      setSubmitted(true);
      setFormData({ name: "", phone: "", email: "", message: "" });
    }, 800);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-stretch max-w-5xl mx-auto">
      
      {/* Contact Info (2 cols on lg) */}
      <div className="lg:col-span-2 space-y-6 flex flex-col justify-between">
        <div className="space-y-6">
          <div>
            <h3 className="font-heading text-xl font-bold text-secondary dark:text-white">
              সরাসরি যোগাযোগ করুন
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              আমাদের কাস্টমার কেয়ার প্রতিনিধিরা যেকোনো প্রশ্ন বা মেম্বারশিপের বিষয়ে আপনাকে সহায়তা করতে প্রস্তুত।
            </p>
          </div>

          <div className="space-y-4">
            
            <a href="tel:+8809612345678" className="flex items-center gap-3 p-4 rounded-xl border border-border bg-background hover:bg-muted/50 transition-colors">
              <div className="h-10 w-10 rounded-lg bg-primary-light text-primary flex items-center justify-center">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">হটলাইন নম্বর</p>
                <p className="text-sm font-bold text-secondary font-mono">+৮৮০ ৯৬১২৩৪৫৬৭৮</p>
              </div>
            </a>

            <a href="https://wa.me/8801700000000" target="_blank" rel="noreferrer" className="flex items-center gap-3 p-4 rounded-xl border border-border bg-background hover:bg-muted/50 transition-colors">
              <div className="h-10 w-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 fill-emerald-600/10" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">হোয়াটসঅ্যাপ চ্যাট</p>
                <p className="text-sm font-bold text-secondary font-mono">+৮৮০ ১৭০০০০০০০০</p>
              </div>
            </a>

            <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-background">
              <div className="h-10 w-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">অফিসের ঠিকানা</p>
                <p className="text-sm font-bold text-secondary">মিজান রোড, ফেনী - ৩৯০০</p>
              </div>
            </div>

          </div>
        </div>

        <a href="https://www.facebook.com/profile.php?id=61591616953090" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 p-3 bg-secondary text-white rounded-xl hover:bg-slate-800 transition-colors text-sm font-semibold">
          <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
            <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
          </svg>
          ফেসবুক পেজ ভিজিট করুন
        </a>
      </div>

      {/* Form Card (3 cols) */}
      <Card className="lg:col-span-3 border border-border bg-background/50 backdrop-blur shadow-lg">
        <CardContent className="p-4 sm:p-6 md:p-8">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <CheckCircle className="h-16 w-16 text-primary mx-auto animate-bounce" />
              <h3 className="font-heading text-xl font-bold text-secondary">
                বার্তাটি সফলভাবে পাঠানো হয়েছে!
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                আমরা আপনার বার্তাটি পেয়েছি এবং আমাদের প্রতিনিধি খুব শীঘ্রই আপনার প্রদত্ত মোবাইল নম্বরে যোগাযোগ করবেন।
              </p>
              <Button onClick={() => setSubmitted(false)} variant="outline" className="mt-4 border-primary text-primary hover:bg-primary-light">
                নতুন বার্তা পাঠান
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="font-heading text-xl font-bold text-secondary dark:text-white mb-2">
                আমাদের মেসেজ লিখুন
              </h3>
              
              <div className="space-y-2">
                <label className="text-xs font-semibold text-secondary">আপনার নাম *</label>
                <Input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="যেমন: মোঃ আব্দুর রহমান"
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
                    placeholder="যেমন: test@example.com"
                    className="border-border bg-background"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-secondary">আপনার বার্তা *</label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="এখানে আপনার প্রশ্ন বা বার্তাটি লিখুন..."
                  className="w-full rounded-md border border-border bg-background p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-semibold">
                বার্তা পাঠান
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

    </div>
  );
}
