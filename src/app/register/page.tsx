"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Heart, User, Phone, Mail, Lock, MapPin, Calendar } from "lucide-react";
import { dbStore } from "@/services/dbStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { ImageUpload } from "@/components/ui/ImageUpload";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    tier: "founding" as "founding" | "individual" | "family",
    address: "",
    birthDate: "",
    profilePictureUrl: ""
  });
  const [error, setError] = useState("");

  // Pre-select plan from URL parameters
  useEffect(() => {
    const planParam = searchParams.get("plan");
    if (planParam === "individual") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(prev => ({ ...prev, tier: planParam }));
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.phone || !formData.password || !formData.email || !formData.address || !formData.birthDate || !formData.profilePictureUrl) {
      setError("সবগুলো তারকাচিহ্নিত (*) ঘর পূরণ করুন।");
      return;
    }

    try {
      // Check if phone or email already registered
      const existing = await dbStore.getMemberById(formData.phone);
      if (existing) {
        setError("এই মোবাইল নম্বরটি দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট তৈরি করা হয়েছে।");
        return;
      }

      // Add member to Supabase DB
      const newMember = await dbStore.addMember({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        tier: formData.tier,
        address: formData.address,
        birthDate: formData.birthDate,
        profilePictureUrl: formData.profilePictureUrl
      });

      // Login immediately
      dbStore.setCurrentUser(newMember);

      // Redirect to Member Dashboard
      router.push("/dashboard");
    } catch {
      setError("রেজিস্ট্রেশন করতে সমস্যা হচ্ছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
    }
  };

  return (
    <Card className="w-full max-w-xl border border-border shadow-xl bg-background/80 backdrop-blur">
      <CardHeader className="text-center space-y-2">
        <Link href="/" className="flex items-center justify-center space-x-2 text-primary mx-auto">
          <Heart className="h-7 w-7 fill-primary" />
          <span className="font-heading text-2xl font-bold text-secondary">
            হেলথ <span className="text-primary">ক্লাব</span>
          </span>
        </Link>
        <CardTitle className="font-heading text-xl font-bold text-secondary pt-2">
          মেম্বার হিসেবে জয়েন করুন
        </CardTitle>
        <CardDescription>
          হেলথ ক্লাবের ডিজিটাল মেম্বার আইডি কার্ড সংগ্রহ করতে ফ্রী রেজিস্ট্রেশন সম্পন্ন করুন।
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {error && (
          <div className="bg-destructive/10 text-destructive text-xs p-3 rounded-lg border border-destructive/20">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          
          <ImageUpload
            value={formData.profilePictureUrl}
            onChange={(url) => setFormData(prev => ({ ...prev, profilePictureUrl: url }))}
            label="প্রোফাইল ছবি *"
          />

          <div className="space-y-2">
            <label className="text-xs font-semibold text-secondary flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-primary" />
              আপনার নাম *
            </label>
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
              <label className="text-xs font-semibold text-secondary flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-primary" />
                মোবাইল নম্বর *
              </label>
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
              <label className="text-xs font-semibold text-secondary flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-primary" />
                ইমেইল ঠিকানা *
              </label>
              <Input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="যেমন: test@example.com"
                className="border-border bg-background"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-secondary flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              ঠিকানা *
            </label>
            <Input
              type="text"
              name="address"
              required
              value={formData.address}
              onChange={handleChange}
              placeholder="যেমন: মিজান রোড, ফেনী"
              className="border-border bg-background"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-secondary flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              জন্ম তারিখ *
            </label>
            <Input
              type="date"
              name="birthDate"
              required
              value={formData.birthDate}
              onChange={handleChange}
              className="border-border bg-background"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-secondary flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-primary" />
              পাসওয়ার্ড *
            </label>
            <Input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড"
              className="border-border bg-background"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-secondary">মেম্বারশিপ প্ল্যান নির্বাচন করুন *</label>
            <select
              name="tier"
              value={formData.tier}
              onChange={handleChange}
              className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            >
              <option value="founding">Founding Member (ফ্রী ১ বছর - প্রথম ১০০ মেম্বার)</option>
              <option value="individual">Individual Plan (৳৫০০ / বাৎসরিক)</option>
            </select>
          </div>

          <Button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-semibold">
            অ্যাকাউন্ট তৈরি করুন
          </Button>

        </form>

        <div className="text-center text-sm text-muted-foreground border-t border-border pt-4">
          ইতিমধ্যে মেম্বারশিপ অ্যাকাউন্ট আছে?{" "}
          <Link href="/login" className="text-primary hover:underline font-semibold">
            লগইন করুন
          </Link>
        </div>

      </CardContent>
    </Card>
  );
}

export default function RegisterPage() {
  return (
    <div className="bg-muted/30 min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={
        <div className="text-center py-12 text-muted-foreground">
          লোড হচ্ছে...
        </div>
      }>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
