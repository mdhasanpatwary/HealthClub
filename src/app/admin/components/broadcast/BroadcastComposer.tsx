"use client";

import { useState } from "react";
import {
  Send,
  Sparkles,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { BroadcastAudienceSelector } from "./BroadcastAudienceSelector";
import { BroadcastPreviewPanel } from "./BroadcastPreviewPanel";
import { BroadcastConfirmModal } from "./BroadcastConfirmModal";

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
      toast.error(isBn ? "শিরোনাম এবং মূল বার্তা অবশ্যই পূরণ করতে হবে।" : "Title and message are required.");
      return;
    }

    if (test) {
      if (!testEmail && !testPhone) {
        toast.warning(
          isBn
            ? "টেস্ট পাঠানোর জন্য একটি ইমেইল অথবা মোবাইল নম্বর দিন।"
            : "Enter a test email or phone number."
        );
        return;
      }
    }

    setSending(true);
    setConfirmOpen(false);

    try {
      const res = await sendBroadcastCampaignAction({
        audience,
        channels,
        title: title.trim(),
        subject: subject.trim() || title.trim(),
        badge: badge.trim() || undefined,
        message: message.trim(),
        actionUrl: actionUrl.trim() || undefined,
        actionText: actionText.trim() || undefined,
        isTestMode: test,
        testEmail: test ? testEmail.trim() : undefined,
        testPhone: test ? testPhone.trim() : undefined,
      });

      if (res.success && res.campaign) {
        toast.success(
          test
            ? isBn
              ? "টেস্ট বার্তা সফলভাবে পাঠানো হয়েছে!"
              : "Test broadcast sent successfully!"
            : isBn
            ? `ক্যাম্পেইন সম্পন্ন! মোট ${res.campaign.recipientCount} টি বার্তা প্রেরিত হয়েছে।`
            : `Campaign sent to ${res.campaign.recipientCount} recipients!`
        );

        if (!test) {
          setTitle("");
          setSubject("");
          setBadge("");
          setMessage("");
          setActionUrl("");
          setActionText("");
          onCampaignSent(res.campaign);
        }
      } else {
        toast.error(res.message || (isBn ? "ক্যাম্পেইন পাঠাতে ত্রুটি হয়েছে।" : "Failed to broadcast."));
      }
    } catch {
      toast.error(isBn ? "সার্ভারে ত্রুটি হয়েছে।" : "Server error occurred.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Column: Form & Configuration */}
      <div className="lg:col-span-7 space-y-6">
        {/* Preset Templates Quick Carousel */}
        <div className="bg-card rounded-2xl border border-border/80 p-4 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold flex items-center gap-1.5 text-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              {isBn ? "রেডিমেড টেমপ্লেটসমূহ" : "Quick Template Presets"}
            </span>
            <span className="text-[11px] text-muted-foreground font-mono">
              {BROADCAST_PRESETS.length} presets
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {BROADCAST_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className="text-left p-2.5 rounded-xl border border-border/70 bg-muted/30 hover:bg-primary/5 hover:border-primary/40 transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-xs">
                    {p.iconName === "Stethoscope" ? "🩺" : p.iconName === "Building2" ? "🏥" : p.iconName === "Droplet" ? "🩸" : p.iconName === "RotateCcw" ? "🔄" : "📖"}
                  </span>
                  <span className="font-bold text-xs text-foreground group-hover:text-primary transition-colors truncate">
                    {isBn ? p.nameBn : p.nameEn}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground line-clamp-1">
                  {isBn ? p.descriptionBn : p.descriptionEn}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Audience & Channel Selector Card */}
        <BroadcastAudienceSelector
          audience={audience}
          setAudience={setAudience}
          channels={channels}
          handleToggleChannel={handleToggleChannel}
          counts={counts}
          locale={locale}
          isBn={isBn}
        />

        {/* Message Composition Card */}
        <div className="bg-card rounded-2xl border border-border/80 p-4 space-y-4 shadow-xs">
          <h3 className="font-heading font-bold text-sm text-foreground">
            {isBn ? "২. ক্যাম্পেইন বার্তা রচনা" : "2. Compose Broadcast Message"}
          </h3>

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
        <BroadcastPreviewPanel
          isBn={isBn}
          previewTab={previewTab}
          setPreviewTab={setPreviewTab}
          title={title}
          badge={badge}
          message={message}
          actionUrl={actionUrl}
          actionText={actionText}
          smsStats={smsStats}
        />
      </div>

      {/* Confirmation Modal */}
      <BroadcastConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => handleSend(false)}
        sending={sending}
        isBn={isBn}
        audience={audience}
        targetCount={targetCount}
        locale={locale}
        channels={channels}
      />
    </div>
  );
}
