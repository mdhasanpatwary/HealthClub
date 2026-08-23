"use client";

import { useState } from "react";
import {
  Send,
  Mail,
  MessageSquare,
  Bell,
  Users,
  Building2,
  Droplet,
  Sparkles,
  AlertCircle,
  Smartphone,
  Eye,
  CheckCircle2,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  BroadcastAudienceType,
  BroadcastChannel,
  BroadcastAudienceCounts,
  sendBroadcastCampaignAction,
  BroadcastCampaignRecord,
} from "@/app/actions/broadcastActions";
import { calculateSmsSegments } from "@/lib/sms";
import { formatNum, Locale } from "@/lib/i18n";
import { BROADCAST_PRESETS, BroadcastPreset } from "./BroadcastPresets";

interface BroadcastComposerProps {
  counts: BroadcastAudienceCounts;
  locale: Locale;
  onCampaignSent: (campaign?: BroadcastCampaignRecord) => void;
}

export function BroadcastComposer({ counts, locale, onCampaignSent }: BroadcastComposerProps) {
  const isBn = locale === "bn";

  // Form State
  const [audience, setAudience] = useState<BroadcastAudienceType>("all_members");
  const [channels, setChannels] = useState<BroadcastChannel[]>(["email", "sms", "in_app"]);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [badge, setBadge] = useState("");
  const [message, setMessage] = useState("");
  const [actionUrl, setActionUrl] = useState("");
  const [actionText, setActionText] = useState("");

  // Test Mode State
  const [isTestMode, setIsTestMode] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [testPhone, setTestPhone] = useState("");

  // Execution State
  const [sending, setSending] = useState(false);
  const [previewTab, setPreviewTab] = useState<"email" | "sms" | "in_app">("email");
  const [confirmOpen, setConfirmOpen] = useState(false);

  // SMS calculation
  const smsStats = calculateSmsSegments(`${title}\n\n${message}`);

  // Channel toggling
  const handleToggleChannel = (channel: BroadcastChannel) => {
    if (channels.includes(channel)) {
      if (channels.length === 1) {
        toast.warning(isBn ? "কমপক্ষে একটি চ্যানেল নির্বাচন করতে হবে।" : "Select at least one channel.");
        return;
      }
      setChannels(channels.filter((c) => c !== channel));
    } else {
      setChannels([...channels, channel]);
    }
  };

  // Load preset template
  const handleApplyPreset = (preset: BroadcastPreset) => {
    setTitle(preset.title);
    setSubject(preset.subject);
    setBadge(preset.badge);
    setMessage(preset.message);
    setAudience(preset.defaultAudience);
    setChannels(preset.defaultChannels);
    setActionUrl(preset.actionUrl);
    setActionText(preset.actionText);
    toast.success(
      isBn ? `'${preset.nameBn}' টেমপ্লেট লোড হয়েছে` : `Loaded template '${preset.nameEn}'`
    );
  };

  // Calculate current target audience count
  const getAudienceCount = (type: BroadcastAudienceType) => {
    switch (type) {
      case "all_members":
        return counts.allMembers;
      case "active_members":
        return counts.activeMembers;
      case "inactive_members":
        return counts.inactiveMembers;
      case "blood_donors":
        return counts.bloodDonors;
      case "partners":
        return counts.partners;
      case "all_users":
        return counts.totalUniqueUsers;
      default:
        return 0;
    }
  };

  const targetCount = getAudienceCount(audience);

  // Submit Handler
  const handleSend = async (test = false) => {
    if (!title.trim() || !message.trim()) {
      toast.error(isBn ? "শিরোনাম ও বিস্তারিত বার্তা লিখুন।" : "Please enter title and message.");
      return;
    }

    if (channels.length === 0) {
      toast.error(isBn ? "কমপক্ষে একটি চ্যানেল নির্বাচন করুন।" : "Please select at least one channel.");
      return;
    }

    setSending(true);
    try {
      const res = await sendBroadcastCampaignAction({
        title,
        subject: subject || title,
        message,
        audience,
        channels,
        badge,
        actionUrl: actionUrl.trim() || undefined,
        actionText: actionText.trim() || undefined,
        isTestMode: test,
        testEmail: test ? testEmail : undefined,
        testPhone: test ? testPhone : undefined,
      });

      if (res.success) {
        toast.success(res.message);
        if (!test) {
          setConfirmOpen(false);
          onCampaignSent(res.campaign);
        }
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error(isBn ? "সম্প্রচার সম্পন্ন করতে সমস্যা হয়েছে।" : "Failed to execute broadcast.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Column: Form & Presets */}
      <div className="lg:col-span-7 space-y-6">
        {/* Quick Presets Picker */}
        <div className="bg-card rounded-2xl border border-border/80 p-4 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span className="text-xs font-bold text-foreground">
                {isBn ? "রেডিমেড ক্যাম্পেইন টেমপ্লেট" : "Ready Campaign Templates"}
              </span>
            </div>
            <span className="text-[11px] text-muted-foreground">
              {isBn ? "ক্লিক করে দ্রুত পূরণ করুন" : "Click to auto-fill"}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {BROADCAST_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className="text-left p-2.5 rounded-xl border border-border/60 hover:border-primary/50 hover:bg-primary/5 transition-all text-xs cursor-pointer group"
              >
                <p className="font-bold text-foreground group-hover:text-primary transition-colors truncate">
                  {isBn ? p.nameBn : p.nameEn}
                </p>
                <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                  {isBn ? p.badge : p.category}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Audience Segment Selection */}
        <div className="bg-card rounded-2xl border border-border/80 p-4 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-primary" />
              <span>{isBn ? "১. টার্গেট অডিয়েন্স নির্বাচন করুন *" : "1. Target Audience *"}</span>
            </label>
            <Badge variant="outline" className="text-[10px] font-mono">
              {isBn ? "প্রাপক সংখ্যা:" : "Estimated:"} {formatNum(targetCount, locale)}
            </Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { id: "all_members", label: isBn ? "সকল সদস্য" : "All Members", count: counts.allMembers, icon: Users, color: "text-indigo-500" },
              { id: "active_members", label: isBn ? "সক্রিয় সদস্য" : "Active Only", count: counts.activeMembers, icon: CheckCircle2, color: "text-emerald-500" },
              { id: "inactive_members", label: isBn ? "মেয়াদোত্তীর্ণ সদস্য" : "Inactive / Expired", count: counts.inactiveMembers, icon: AlertCircle, color: "text-amber-500" },
              { id: "blood_donors", label: isBn ? "রক্তদাতা নেটওয়ার্ক" : "Blood Donors", count: counts.bloodDonors, icon: Droplet, color: "text-rose-500" },
              { id: "partners", label: isBn ? "পার্টনার হাসপাতাল" : "Partners", count: counts.partners, icon: Building2, color: "text-blue-500" },
              { id: "all_users", label: isBn ? "সকল ইউজার (কমিউনিটি)" : "All Users", count: counts.totalUniqueUsers, icon: Users, color: "text-teal-500" },
            ].map((item) => {
              const Icon = item.icon;
              const isSelected = audience === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setAudience(item.id as BroadcastAudienceType)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? "border-primary bg-primary/10 ring-2 ring-primary/20 shadow-xs"
                      : "border-border/70 hover:border-border hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Icon className={`h-4 w-4 ${item.color}`} />
                    <span className="text-[10px] font-mono font-bold bg-background px-1.5 py-0.5 rounded-md border border-border/60">
                      {formatNum(item.count, locale)}
                    </span>
                  </div>
                  <p className="font-bold text-xs text-foreground mt-2 truncate">
                    {item.label}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Delivery Channels */}
        <div className="bg-card rounded-2xl border border-border/80 p-4 space-y-3 shadow-xs">
          <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <Send className="h-3.5 w-3.5 text-primary" />
            <span>{isBn ? "২. প্রেরণের মাধ্যম (Channels) *" : "2. Delivery Channels *"}</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {[
              { id: "email", name: isBn ? "ইমেইল ব্রডকাস্ট" : "Email Campaign", desc: isBn ? "ব্র্যান্ডেড HTML টেমপ্লেট" : "Branded HTML mail", icon: Mail, color: "text-blue-600 bg-blue-500/10" },
              { id: "sms", name: isBn ? "মোবাইল এসএমএস" : "Mobile SMS", desc: isBn ? "সরাসরি মোবাইলে মেসেজ" : "Direct SMS gateway", icon: MessageSquare, color: "text-emerald-600 bg-emerald-500/10" },
              { id: "in_app", name: isBn ? "ইন-অ্যাপ নোটিফিকেশন" : "In-App Notice", desc: isBn ? "মেম্বার ড্যাশবোর্ড অ্যালার্ট" : "Dashboard alert feed", icon: Bell, color: "text-amber-600 bg-amber-500/10" },
            ].map((item) => {
              const Icon = item.icon;
              const isChecked = channels.includes(item.id as BroadcastChannel);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleToggleChannel(item.id as BroadcastChannel)}
                  className={`p-3 rounded-xl border flex items-start gap-2.5 text-left transition-all cursor-pointer ${
                    isChecked
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border/70 opacity-60 hover:opacity-100 hover:bg-muted/30"
                  }`}
                >
                  <div className={`p-2 rounded-lg shrink-0 ${item.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-foreground flex items-center gap-1">
                      {item.name}
                      {isChecked && <CheckCircle2 className="h-3 w-3 text-primary inline" />}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Message Composition Fields */}
        <div className="bg-card rounded-2xl border border-border/80 p-4 space-y-4 shadow-xs">
          <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <MessageSquare className="h-3.5 w-3.5 text-primary" />
            <span>{isBn ? "৩. বার্তার বিবরণ ও কন্টেন্ট *" : "3. Message Details *"}</span>
          </label>

          <div className="space-y-3">
            {/* Title & Badge */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground">
                  {isBn ? "ক্যাম্পেইন শিরোনাম *" : "Campaign Title *"}
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={isBn ? "যেমন: বিনামূল্যে বিশেষজ্ঞ স্বাস্থ্য ক্যাম্প..." : "Campaign headline..."}
                  className="rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground">
                  {isBn ? "ট্যাগ / ব্যাজ (ঐচ্ছিক)" : "Badge Tag (optional)"}
                </label>
                <Input
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder={isBn ? "যেমন: স্পেশাল ক্যাম্প" : "e.g. Free Camp"}
                  className="rounded-xl text-xs"
                />
              </div>
            </div>

            {/* Email Subject (if email selected) */}
            {channels.includes("email") && (
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground">
                  {isBn ? "ইমেইল সাবজেক্ট লাইন" : "Email Subject Line"}
                </label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder={title || (isBn ? "ইনবক্স সাবজেক্ট লিখুন..." : "Email subject...")}
                  className="rounded-xl text-xs"
                />
              </div>
            )}

            {/* Message Body */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-muted-foreground">
                  {isBn ? "মূল বার্তা / বিস্তারিত বক্তব্য *" : "Message Body *"}
                </label>
                {/* Live SMS Counter */}
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md">
                  <span>{smsStats.isUnicode ? "বাংলা (Unicode)" : "English (GSM)"}:</span>
                  <span className="font-bold text-foreground">{smsStats.charCount} অক্ষর</span>
                  <span>&bull;</span>
                  <span className="text-primary font-bold">{smsStats.segmentCount} এসএমএস পার্ট</span>
                </div>
              </div>
              <textarea
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={isBn ? "এখানে বিস্তারিত বার্তা লিখুন..." : "Write message content..."}
                className="w-full rounded-xl border border-input bg-transparent px-3 py-2 text-xs focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 outline-none leading-relaxed transition-all dark:bg-input/30"
              />
            </div>

            {/* CTA Button Link & Text */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground">
                  {isBn ? "অ্যাকশন বাটন লিঙ্ক (URL)" : "Button URL"}
                </label>
                <Input
                  value={actionUrl}
                  onChange={(e) => setActionUrl(e.target.value)}
                  placeholder="https://healthclubbd.org/..."
                  className="rounded-xl text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground">
                  {isBn ? "বাটন টেক্সট" : "Button Text"}
                </label>
                <Input
                  value={actionText}
                  onChange={(e) => setActionText(e.target.value)}
                  placeholder={isBn ? "যেমন: বিস্তারিত দেখুন" : "e.g. View Details"}
                  className="rounded-xl text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Test Mode & Action Buttons */}
        <div className="bg-card rounded-2xl border border-border/80 p-4 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-xs text-foreground">
                {isBn ? "টেস্ট মোড (Test Send)" : "Test Send Mode"}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {isBn ? "সকলকে পাঠানোর আগে নিজের নম্বরে টেস্ট করে দেখুন" : "Send test copy to yourself before blasting"}
              </p>
            </div>
            <Button
              type="button"
              variant={isTestMode ? "default" : "outline"}
              size="sm"
              onClick={() => setIsTestMode(!isTestMode)}
              className="text-xs rounded-xl cursor-pointer"
            >
              {isTestMode ? (isBn ? "টেস্ট মোড চালু" : "Test Active") : (isBn ? "টেস্ট করুন" : "Enable Test")}
            </Button>
          </div>

          {isTestMode && (
            <div className="p-3 bg-muted/30 rounded-xl space-y-2.5 border border-border/60">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="admin@gmail.com"
                  className="text-xs rounded-lg"
                />
                <Input
                  type="tel"
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  placeholder="01886763849"
                  className="text-xs rounded-lg font-mono"
                />
              </div>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={sending}
                onClick={() => handleSend(true)}
                className="w-full text-xs font-bold gap-1.5 cursor-pointer rounded-lg"
              >
                {sending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                {isBn ? "টেস্ট বার্তা পাঠান" : "Dispatch Test Message"}
              </Button>
            </div>
          )}

          {/* Blast Dispatch CTA */}
          <div className="pt-2 border-t border-border/60 flex items-center justify-between gap-3">
            <div className="text-xs">
              <span className="text-muted-foreground">{isBn ? "মোট টার্গেট:" : "Target:"} </span>
              <span className="font-bold font-mono text-foreground">{formatNum(targetCount, locale)}</span>
              <span className="text-muted-foreground"> {isBn ? "জন প্রাপক" : "recipients"}</span>
            </div>

            <Button
              type="button"
              disabled={sending || targetCount === 0 || !title.trim() || !message.trim()}
              onClick={() => setConfirmOpen(true)}
              className="bg-primary hover:bg-primary-dark text-white font-bold gap-2 text-xs px-5 py-2.5 rounded-xl shadow-sm cursor-pointer"
            >
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {isBn ? "সম্প্রচার শুরু করুন" : "Blast Campaign"}
            </Button>
          </div>
        </div>
      </div>

      {/* Right Column: Live Interactive Preview */}
      <div className="lg:col-span-5 space-y-4">
        <div className="bg-card rounded-2xl border border-border/80 p-4 space-y-4 shadow-xs sticky top-6">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold text-foreground">
                {isBn ? "লাইভ প্রিভিউ (Live Preview)" : "Live Message Preview"}
              </span>
            </div>

            {/* Preview Channel Tabs */}
            <div className="flex items-center gap-1 bg-muted p-1 rounded-xl text-[10px] font-semibold">
              <button
                type="button"
                onClick={() => setPreviewTab("email")}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  previewTab === "email" ? "bg-background text-foreground shadow-2xs font-bold" : "text-muted-foreground"
                }`}
              >
                ইমেইল
              </button>
              <button
                type="button"
                onClick={() => setPreviewTab("sms")}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  previewTab === "sms" ? "bg-background text-foreground shadow-2xs font-bold" : "text-muted-foreground"
                }`}
              >
                এসএমএস
              </button>
              <button
                type="button"
                onClick={() => setPreviewTab("in_app")}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  previewTab === "in_app" ? "bg-background text-foreground shadow-2xs font-bold" : "text-muted-foreground"
                }`}
              >
                ইন-অ্যাপ
              </button>
            </div>
          </div>

          {/* Email Preview Card */}
          {previewTab === "email" && (
            <div className="rounded-2xl border border-border overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-xs shadow-inner">
              <div className="bg-slate-900 text-white p-3 text-center border-b-2 border-primary">
                <p className="font-heading font-extrabold text-sm tracking-wide">
                  হেলথ <span className="text-emerald-400">ক্লাব</span>
                </p>
                <p className="text-[9px] text-slate-400 font-mono mt-0.5">HEALTH CLUB OFFICIAL</p>
              </div>
              <div className="p-4 space-y-3 bg-white dark:bg-slate-900">
                {badge && (
                  <span className="inline-block bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    {badge}
                  </span>
                )}
                <h3 className="font-heading text-sm font-bold text-foreground leading-snug">
                  {title || (isBn ? "ক্যাম্পেইন শিরোনাম এখানে প্রদর্শিত হবে" : "Campaign Headline Here")}
                </h3>
                <p className="text-[11px] font-medium text-muted-foreground">প্রিয় সদস্য,</p>
                <p className="text-xs text-muted-foreground whitespace-pre-line leading-relaxed">
                  {message || (isBn ? "বার্তার বিস্তারিত বক্তব্য এখানে রিয়েল-টাইমে প্রদর্শিত হবে..." : "Message content preview...")}
                </p>
                {actionText && (
                  <div className="pt-2 text-center">
                    <span className="inline-flex items-center gap-1 bg-primary text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs">
                      {actionText} <ExternalLink className="h-3 w-3 inline ml-1" />
                    </span>
                  </div>
                )}
              </div>
              <div className="bg-slate-100 dark:bg-slate-950 p-2.5 text-center text-[10px] text-muted-foreground border-t border-border">
                &copy; 2026 হেলথ ক্লাব &bull; ফেনী, বাংলাদেশ
              </div>
            </div>
          )}

          {/* SMS Preview Card */}
          {previewTab === "sms" && (
            <div className="p-4 bg-muted/40 rounded-2xl border border-border/80 space-y-3">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Smartphone className="h-3.5 w-3.5" />
                  <span>প্রেরক: <strong>HealthClub</strong></span>
                </span>
                <span className="font-mono">{smsStats.charCount} chars</span>
              </div>
              <div className="bg-primary/10 border border-primary/20 p-3.5 rounded-2xl rounded-tl-xs text-xs text-foreground whitespace-pre-line leading-relaxed">
                <p className="font-bold text-primary mb-1">{title || "শিরোনাম..."}</p>
                <p>{message || "এসএমএস টেক্সট এখানে প্রদর্শিত হবে..."}</p>
                {actionUrl && <p className="text-[10px] text-blue-600 dark:text-blue-400 mt-1 font-mono">{actionUrl}</p>}
              </div>
            </div>
          )}

          {/* In-App Preview Card */}
          {previewTab === "in_app" && (
            <div className="p-3 bg-card rounded-2xl border border-primary/30 shadow-sm space-y-2">
              <div className="flex items-start gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Bell className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-xs text-foreground truncate">
                    {title || "বিজ্ঞপ্তি শিরোনাম"}
                  </p>
                  <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5 leading-relaxed">
                    {message || "ইন-অ্যাপ বার্তার সংক্ষিপ্ত বিবরণ..."}
                  </p>
                  <span className="text-[9px] font-mono text-muted-foreground mt-1 inline-block">এখনই &bull; হেলথ ক্লাব</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="max-w-md w-full rounded-2xl border border-border shadow-2xl bg-card animate-in fade-in zoom-in-95">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Send className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-foreground">
                    {isBn ? "ক্যাম্পেইন সম্প্রচার নিশ্চিতকরণ" : "Confirm Broadcast Dispatch"}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {isBn ? "আপনি কি নিশ্চিতভাবে এই বার্তাটি পাঠাতে চান?" : "Are you sure you want to broadcast?"}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-muted/40 rounded-xl space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{isBn ? "টার্গেট অডিয়েন্স:" : "Audience:"}</span>
                  <span className="font-bold text-foreground">{audience}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{isBn ? "মোট প্রাপক:" : "Total Recipients:"}</span>
                  <span className="font-bold font-mono text-primary">{formatNum(targetCount, locale)} জন</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{isBn ? "চ্যানেলসমূহ:" : "Channels:"}</span>
                  <span className="font-bold text-foreground">{channels.join(", ").toUpperCase()}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={sending}
                  onClick={() => setConfirmOpen(false)}
                  className="rounded-xl text-xs cursor-pointer"
                >
                  {isBn ? "বাতিল" : "Cancel"}
                </Button>
                <Button
                  disabled={sending}
                  onClick={() => handleSend(false)}
                  className="bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold gap-1.5 cursor-pointer"
                >
                  {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  {isBn ? "হ্যাঁ, সম্প্রচার করুন" : "Yes, Dispatch Now"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
