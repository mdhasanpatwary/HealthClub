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
import { toBanglaNums } from "@/lib/utils";
import { BROADCAST_PRESETS, BroadcastPreset } from "./BroadcastPresets";
import { BroadcastAudienceSelector } from "./BroadcastAudienceSelector";
import { BroadcastPreviewPanel } from "./BroadcastPreviewPanel";
import { BroadcastConfirmModal } from "./BroadcastConfirmModal";

interface BroadcastComposerProps {
  counts: BroadcastAudienceCounts;
  onCampaignSent: (campaign?: BroadcastCampaignRecord) => void;
}

export function BroadcastComposer({ counts, onCampaignSent }: BroadcastComposerProps) {
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
        toast.warning("কমপক্ষে একটি চ্যানেল নির্বাচন করতে হবে।");
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
    toast.success(`'${preset.nameBn}' টেমপ্লেট লোড হয়েছে`);
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
      toast.error("শিরোনাম এবং মূল বার্তা অবশ্যই পূরণ করতে হবে।");
      return;
    }

    if (test) {
      if (!testEmail && !testPhone) {
        toast.warning("টেস্ট পাঠানোর জন্য একটি ইমেইল অথবা মোবাইল নম্বর দিন।");
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
            ? "টেস্ট বার্তা সফলভাবে পাঠানো হয়েছে!"
            : `ক্যাম্পেইন সম্পন্ন! মোট ${toBanglaNums(res.campaign.recipientCount)} টি বার্তা প্রেরিত হয়েছে।`
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
        toast.error(res.message || "ক্যাম্পেইন পাঠাতে ত্রুটি হয়েছে।");
      }
    } catch {
      toast.error("সার্ভারে ত্রুটি হয়েছে।");
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
              রেডিমেড টেমপ্লেটসমূহ
            </span>
            <span className="text-[11px] text-muted-foreground font-mono">
              {toBanglaNums(BROADCAST_PRESETS.length)} টি প্রিসেট
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
                    {p.nameBn}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground line-clamp-1">
                  {p.descriptionBn}
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
        />

        {/* Message Composition Card */}
        <div className="bg-card rounded-2xl border border-border/80 p-4 space-y-4 shadow-xs">
          <h3 className="font-heading font-bold text-sm text-foreground">
            ২. ক্যাম্পেইন বার্তা রচনা
          </h3>

          <div className="space-y-3">
            {/* Title & Badge */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground">
                  ক্যাম্পেইন শিরোনাম *
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="যেমন: বিনামূল্যে বিশেষজ্ঞ স্বাস্থ্য ক্যাম্প..."
                  className="rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground">
                  ট্যাগ / ব্যাজ (ঐচ্ছিক)
                </label>
                <Input
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="যেমন: স্পেশাল ক্যাম্প"
                  className="rounded-xl text-xs"
                />
              </div>
            </div>

            {/* Email Subject (if email selected) */}
            {channels.includes("email") && (
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground">
                  ইমেইল সাবজেক্ট লাইন
                </label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder={title || "ইনবক্স সাবজেক্ট লিখুন..."}
                  className="rounded-xl text-xs"
                />
              </div>
            )}

            {/* Message Body */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-muted-foreground">
                  মূল বার্তা / বিস্তারিত বক্তব্য *
                </label>
                {/* Live SMS Counter */}
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md">
                  <span>{smsStats.isUnicode ? "বাংলা (Unicode)" : "English (GSM)"}:</span>
                  <span className="font-bold text-foreground">{toBanglaNums(smsStats.charCount)} অক্ষর</span>
                  <span>&bull;</span>
                  <span className="text-primary font-bold">{toBanglaNums(smsStats.segmentCount)} এসএমএস পার্ট</span>
                </div>
              </div>
              <textarea
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="এখানে বিস্তারিত বার্তা লিখুন..."
                className="w-full rounded-xl border border-input bg-transparent px-3 py-2 text-xs focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 outline-none leading-relaxed transition-all dark:bg-input/30"
              />
            </div>

            {/* CTA Button Link & Text */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground">
                  অ্যাকশন বাটন লিঙ্ক (URL)
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
                  বাটন টেক্সট
                </label>
                <Input
                  value={actionText}
                  onChange={(e) => setActionText(e.target.value)}
                  placeholder="যেমন: বিস্তারিত দেখুন"
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
                টেস্ট মোড (Test Send)
              </p>
              <p className="text-[11px] text-muted-foreground">
                সকলকে পাঠানোর আগে নিজের নম্বরে টেস্ট করে দেখুন
              </p>
            </div>
            <Button
              type="button"
              variant={isTestMode ? "default" : "outline"}
              size="sm"
              onClick={() => setIsTestMode(!isTestMode)}
              className="text-xs rounded-xl cursor-pointer"
            >
              {isTestMode ? "টেস্ট মোড চালু" : "টেস্ট করুন"}
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
                টেস্ট বার্তা পাঠান
              </Button>
            </div>
          )}

          {/* Blast Dispatch CTA */}
          <div className="pt-2 border-t border-border/60 flex items-center justify-between gap-3">
            <div className="text-xs">
              <span className="text-muted-foreground">মোট টার্গেট: </span>
              <span className="font-bold font-mono text-foreground">{toBanglaNums(targetCount)}</span>
              <span className="text-muted-foreground"> জন প্রাপক</span>
            </div>

            <Button
              type="button"
              disabled={sending || targetCount === 0 || !title.trim() || !message.trim()}
              onClick={() => setConfirmOpen(true)}
              className="bg-primary hover:bg-primary-dark text-white font-bold gap-2 text-xs px-5 py-2.5 rounded-xl shadow-sm cursor-pointer"
            >
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              সম্প্রচার শুরু করুন
            </Button>
          </div>
        </div>
      </div>

      {/* Right Column: Live Interactive Preview */}
      <div className="lg:col-span-5 space-y-4">
        <BroadcastPreviewPanel
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
        audience={audience}
        targetCount={targetCount}
        channels={channels}
      />
    </div>
  );
}
