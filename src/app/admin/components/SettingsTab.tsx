"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getAllSystemSettingsAction,
  updateMultipleSystemSettingsAction,
} from "@/app/actions/systemSettingsActions";
import { toast } from "sonner";
import {
  Save,
  CreditCard,
  PhoneCall,
  Megaphone,
  Coins,
  Loader2,
  RotateCcw,
} from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";

export function SettingsTab() {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [foundingFee, setFoundingFee] = useState("0");
  const [premiumFee, setPremiumFee] = useState("500");
  const [bkashPersonal, setBkashPersonal] = useState("01886763849");
  const [bkashMerchant, setBkashMerchant] = useState("01886763849");
  const [paymentInstructions, setPaymentInstructions] = useState(
    "বিকাশ পার্সোনাল বা মার্চেন্ট নম্বরে সেন্ড মানি/পেমেন্ট সম্পন্ন করে TrxID ও প্রেরক নম্বর লিখুন।"
  );
  const [hotlinePhone, setHotlinePhone] = useState("01783721411");
  const [whatsappPhone, setWhatsappPhone] = useState("01886763849");
  const [officialEmail, setOfficialEmail] = useState("healthclubfeni@gmail.com");
  const [facebookUrl, setFacebookUrl] = useState("https://www.facebook.com/profile.php?id=61591616953090");
  const [noticeEnabled, setNoticeEnabled] = useState(false);
  const [noticeText, setNoticeText] = useState("");
  const [allowMemberTx, setAllowMemberTx] = useState(false);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await getAllSystemSettingsAction();
      if (data.founding_fee) setFoundingFee(data.founding_fee);
      if (data.premium_fee) setPremiumFee(data.premium_fee);
      if (data.bkash_personal_number) setBkashPersonal(data.bkash_personal_number);
      if (data.bkash_merchant_number) setBkashMerchant(data.bkash_merchant_number);
      if (data.payment_instructions) setPaymentInstructions(data.payment_instructions);
      if (data.hotline_phone) setHotlinePhone(data.hotline_phone);
      if (data.whatsapp_phone) setWhatsappPhone(data.whatsapp_phone);
      if (data.official_email) setOfficialEmail(data.official_email);
      if (data.facebook_url) setFacebookUrl(data.facebook_url);
      if (data.notice_enabled) setNoticeEnabled(data.notice_enabled === "true");
      if (data.notice_text) setNoticeText(data.notice_text);
      if (data.allow_member_tx) setAllowMemberTx(data.allow_member_tx === "true");
    } catch (err) {
      console.error(err);
      toast.error("সেটিংস লোড করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: Record<string, string> = {
        founding_fee: foundingFee,
        premium_fee: premiumFee,
        bkash_personal_number: bkashPersonal,
        bkash_merchant_number: bkashMerchant,
        payment_instructions: paymentInstructions,
        hotline_phone: hotlinePhone,
        whatsapp_phone: whatsappPhone,
        official_email: officialEmail,
        facebook_url: facebookUrl,
        notice_enabled: noticeEnabled ? "true" : "false",
        notice_text: noticeText,
        allow_member_tx: allowMemberTx ? "true" : "false",
      };

      const res = await updateMultipleSystemSettingsAction(payload);
      if (res.success) {
        toast.success(isEn ? "System settings saved successfully!" : res.message);
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("সেটিংস সংরক্ষণ করতে ব্যর্থ হয়েছে।");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>সেটিংস লোড হচ্ছে...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-background border border-border">
        <div>
          <h2 className="font-heading font-bold text-lg text-secondary dark:text-white">
            {isEn ? "System Settings & Configuration" : "সিস্টেম সেটিংস ও কনফিগারেশন"}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isEn
              ? "Manage membership pricing, payment details, hotlines, and announcements in real time."
              : "মেম্বারশিপ ফি, বিকাশ নম্বর, হটলাইন ও অফার ব্যানার ড্যাশবোর্ড থেকে পরিবর্তন করুন।"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={loadSettings}>
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
            {isEn ? "Reset" : "রিলোড"}
          </Button>
          <Button type="submit" disabled={saving} size="sm" className="font-bold">
            {saving ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                {isEn ? "Saving..." : "সংরক্ষণ হচ্ছে..."}
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5 mr-1.5" />
                {isEn ? "Save All Settings" : "সেটিংস সংরক্ষণ করুন"}
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Membership Pricing */}
        <Card className="border border-border shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Coins className="h-4 w-4 text-primary" />
              <span>{isEn ? "Membership Pricing" : "মেম্বারশিপ ফি নির্ধারণ"}</span>
            </CardTitle>
            <CardDescription className="text-xs">
              {isEn ? "Annual subscription fee for membership plans" : "সদস্যপদের বাৎসরিক ফি নির্ধারণ করুন"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="founding-fee" className="text-xs font-semibold">
                {isEn ? "Founding Member Annual Fee (৳)" : "ফাউন্ডিং মেম্বার ফি (৳)"}
              </Label>
              <Input
                id="founding-fee"
                type="number"
                value={foundingFee}
                onChange={(e) => setFoundingFee(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="premium-fee" className="text-xs font-semibold">
                {isEn ? "Premium Member Annual Fee (৳)" : "প্রিমিয়াম মেম্বার ফি (৳)"}
              </Label>
              <Input
                id="premium-fee"
                type="number"
                value={premiumFee}
                onChange={(e) => setPremiumFee(e.target.value)}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* 2. Payment & bKash Information */}
        <Card className="border border-border shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary" />
              <span>{isEn ? "Payment & bKash Info" : "বিকাশ ও পেমেন্ট তথ্য"}</span>
            </CardTitle>
            <CardDescription className="text-xs">
              {isEn ? "Receiver mobile numbers for registration/renewals" : "রেজিস্ট্রেশন ও রিনিউয়ালের পেমেন্ট নাম্বার"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="bkash-personal" className="text-xs font-semibold">
                  {isEn ? "bKash Personal Number" : "বিকাশ পার্সোনাল নম্বর"}
                </Label>
                <Input
                  id="bkash-personal"
                  value={bkashPersonal}
                  onChange={(e) => setBkashPersonal(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="bkash-merchant" className="text-xs font-semibold">
                  {isEn ? "bKash Merchant Number" : "বিকাশ মার্চেন্ট নম্বর"}
                </Label>
                <Input
                  id="bkash-merchant"
                  value={bkashMerchant}
                  onChange={(e) => setBkashMerchant(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="payment-instructions" className="text-xs font-semibold">
                {isEn ? "Payment Instructions Text" : "পেমেন্ট নির্দেশিকা টেক্সট"}
              </Label>
              <textarea
                id="payment-instructions"
                rows={2}
                value={paymentInstructions}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPaymentInstructions(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </CardContent>
        </Card>

        {/* 3. Contact & Hotline Setup */}
        <Card className="border border-border shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <PhoneCall className="h-4 w-4 text-primary" />
              <span>{isEn ? "Contact & Social Links" : "যোগাযোগ ও সোশ্যাল মিডিয়া"}</span>
            </CardTitle>
            <CardDescription className="text-xs">
              {isEn ? "Official hotline, WhatsApp, and social channels" : "সাইটের ফুটার ও কন্টাক্ট সেকশনের তথ্য"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="hotline-phone" className="text-xs font-semibold">
                  {isEn ? "Hotline Number" : "হটলাইন ফোন নম্বর"}
                </Label>
                <Input
                  id="hotline-phone"
                  value={hotlinePhone}
                  onChange={(e) => setHotlinePhone(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="whatsapp-phone" className="text-xs font-semibold">
                  {isEn ? "WhatsApp Support Number" : "হোয়াটসঅ্যাপ নম্বর"}
                </Label>
                <Input
                  id="whatsapp-phone"
                  value={whatsappPhone}
                  onChange={(e) => setWhatsappPhone(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="official-email" className="text-xs font-semibold">
                  {isEn ? "Official Email" : "অফিসিয়াল ইমেইল"}
                </Label>
                <Input
                  id="official-email"
                  type="email"
                  value={officialEmail}
                  onChange={(e) => setOfficialEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="facebook-url" className="text-xs font-semibold">
                  {isEn ? "Facebook Page URL" : "ফেসবুক পেজ লিংক"}
                </Label>
                <Input
                  id="facebook-url"
                  value={facebookUrl}
                  onChange={(e) => setFacebookUrl(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 4. Announcements & Permissions */}
        <Card className="border border-border shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Megaphone className="h-4 w-4 text-primary" />
              <span>{isEn ? "Announcements & Permissions" : "ঘোষণা ও পারমিশন কন্ট্রোল"}</span>
            </CardTitle>
            <CardDescription className="text-xs">
              {isEn ? "Global site notices and member features" : "ওয়েবসাইট ব্যানার ও মেম্বার ট্রানজেকশন কন্ট্রোল"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-border">
              <div className="space-y-0.5">
                <Label className="text-xs font-bold text-foreground">
                  {isEn ? "Enable Global Notice Banner" : "ওয়েবসাইট নোটিশ ব্যানার চালু"}
                </Label>
                <p className="text-[11px] text-muted-foreground">
                  {isEn ? "Show announcement bar on top of all pages" : "ওয়েবসাইটের শীর্ষে বিশেষ অফার বা নোটিশ প্রদর্শন"}
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={noticeEnabled}
                onClick={() => setNoticeEnabled(!noticeEnabled)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  noticeEnabled ? "bg-primary" : "bg-muted-foreground/30"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    noticeEnabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {noticeEnabled && (
              <div className="space-y-1.5 animate-in fade-in duration-200">
                <Label htmlFor="notice-text" className="text-xs font-semibold">
                  {isEn ? "Notice Banner Message" : "ব্যানারের বার্তা (টেক্সট)"}
                </Label>
                <Input
                  id="notice-text"
                  placeholder={isEn ? "e.g. Free Eye Camp on 25th August!" : "যেমন: আগামী ২৫ আগস্ট ফ্রি চক্ষু ক্যাম্প!"}
                  value={noticeText}
                  onChange={(e) => setNoticeText(e.target.value)}
                />
              </div>
            )}

            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-border">
              <div className="space-y-0.5">
                <Label className="text-xs font-bold text-foreground">
                  {isEn ? "Allow Member Self-Transactions" : "মেম্বারদের সেলফ-ট্রানজেকশন অনুমতি"}
                </Label>
                <p className="text-[11px] text-muted-foreground">
                  {isEn ? "Allows members to add discounts manually from dashboard" : "মেম্বাররা নিজে ড্যাশবোর্ড থেকে ডিসকাউন্ট এন্ট্রি দিতে পারবে কি না"}
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={allowMemberTx}
                onClick={() => setAllowMemberTx(!allowMemberTx)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  allowMemberTx ? "bg-primary" : "bg-muted-foreground/30"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    allowMemberTx ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={saving} size="lg" className="font-bold">
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              {isEn ? "Saving Settings..." : "সংরক্ষণ করা হচ্ছে..."}
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {isEn ? "Save All Settings" : "সেটিংস সংরক্ষণ করুন"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
