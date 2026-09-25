"use client";

import React, { useState, useEffect } from "react";
import {
  Bell,
  Send,
  Radio,
  Flame,
  Clock,
  Sparkles,
  CheckCircle2,
  Smartphone,
  ExternalLink,
  Loader2,
  RefreshCw,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { toBanglaNums } from "@/lib/utils";
import {
  getPushSubscriberStatsAction,
  sendPushBroadcastAction,
  PushSubscriberStats,
} from "@/app/actions/pushNotificationActions";

interface PushBroadcastModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type AudienceType = "all" | "members" | "partners" | "emergency" | "advisory";

interface PresetOption {
  id: string;
  labelBn: string;
  icon: React.ElementType;
  iconColor: string;
  title: string;
  body: string;
  url: string;
  tag: string;
  audience: AudienceType;
}

const PRESETS: PresetOption[] = [
  {
    id: "emergency",
    labelBn: "জরুরি রক্তদান",
    icon: Flame,
    iconColor: "text-rose-500 bg-rose-500/10",
    title: "জরুরি রক্তদান প্রয়োজন - ফেনী",
    body: "ফেনী সদর হাসপাতালে জরুরি রক্ত প্রয়োজন। আপনি কি রক্তদানে এগিয়ে আসতে পারবেন? বিস্তারিত দেখুন।",
    url: "/emergency",
    tag: "emergency-blood-drive",
    audience: "emergency",
  },
  {
    id: "renewal",
    labelBn: "মেম্বারশিপ রিনিউ",
    icon: Clock,
    iconColor: "text-amber-500 bg-amber-500/10",
    title: "মেম্বারশিপ কার্ডের মেয়াদ নবায়ন করুন",
    body: "আপনার হেলথ ক্লাব মেম্বারশিপের মেয়াদ প্রায় শেষ। হাসপাতালে নিরবচ্ছিন্ন সর্বোচ্চ ডিসকাউন্ট উপভোগ করতে দ্রুত রিনিউ করুন।",
    url: "/dashboard/renew",
    tag: "renewal-reminder",
    audience: "members",
  },
  {
    id: "advisory",
    labelBn: "ফ্রি স্বাস্থ্য ক্যাম্প",
    icon: Sparkles,
    iconColor: "text-emerald-500 bg-emerald-500/10",
    title: "ফ্রি স্বাস্থ্য ক্যাম্প ও বিশেষ পরামর্শ",
    body: "আসন্ন শুক্রবারে ফেনীতে বিনামূল্যে স্বাস্থ্য পরীক্ষা ও বিশেষজ্ঞ ডাক্তারের কনসালটেন্সি ক্যাম্প অনুষ্ঠিত হতে যাচ্ছে।",
    url: "/health-tips",
    tag: "health-advisory",
    audience: "advisory",
  },
];

export function PushBroadcastModal({
  open,
  onOpenChange,
}: PushBroadcastModalProps) {

  const [stats, setStats] = useState<PushSubscriberStats>({
    totalSubscribers: 0,
    memberSubscribers: 0,
    partnerSubscribers: 0,
    guestSubscribers: 0,
    platformBreakdown: [],
  });

  const [loadingStats, setLoadingStats] = useState(false);
  const [sending, setSending] = useState(false);

  // Form State
  const [title, setTitle] = useState(PRESETS[0].title);
  const [body, setBody] = useState(PRESETS[0].body);
  const [url, setUrl] = useState(PRESETS[0].url);
  const [tag, setTag] = useState(PRESETS[0].tag);
  const [targetAudience, setTargetAudience] = useState<AudienceType>("all");
  const [selectedPresetId, setSelectedPresetId] = useState<string>("emergency");

  const handleManualRefresh = async () => {
    setLoadingStats(true);
    try {
      const data = await getPushSubscriberStatsAction();
      setStats(data);
    } catch {
      // ignore
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    let isMounted = true;
    getPushSubscriberStatsAction()
      .then((data) => {
        if (isMounted) {
          setStats(data);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [open]);

  const applyPreset = (preset: PresetOption) => {
    setSelectedPresetId(preset.id);
    setTitle(preset.title);
    setBody(preset.body);
    setUrl(preset.url);
    setTag(preset.tag);
    setTargetAudience(preset.audience);
  };

  const handleBroadcast = async () => {
    if (!title.trim() || !body.trim()) {
      toast.error("শিরোনাম ও বিবরণ পূরণ করুন।");
      return;
    }

    setSending(true);
    try {
      const res = await sendPushBroadcastAction({
        title,
        body,
        url: url.trim() || "/",
        tag: tag.trim() || "general",
        targetAudience,
        requireInteraction: true,
      });

      if (res.success) {
        toast.success(res.message);
        onOpenChange(false);
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("ব্রডকাস্ট পাঠানোর সময় ত্রুটি হয়েছে।");
    } finally {
      setSending(false);
    }
  };

  const audienceOptions: Array<{ id: AudienceType; label: string }> = [
    { id: "all", label: "সকল গ্রাহক" },
    { id: "emergency", label: "জরুরি রক্তদান" },
    { id: "members", label: "মেম্বারগণ" },
    { id: "partners", label: "পার্টনারগণ" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 rounded-2xl">
        <DialogHeader className="space-y-1 text-left pb-2 border-b border-border/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <Radio className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-foreground">
                  ওয়েব পুশ নোটিফিকেশন ব্রডকাস্টার
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  সরাসরি ব্যবহারকারীদের ব্রাউজারে রিয়েল-টাইম পুশ অ্যালার্ট পাঠান
                </DialogDescription>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon-xs"
              onClick={handleManualRefresh}
              disabled={loadingStats}
              title="রিফ্রেশ পরিসংখ্যান"
              className="rounded-lg"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${loadingStats ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </DialogHeader>

        {/* Live Subscribers KPIs */}
        <div className="grid grid-cols-3 gap-2 py-1">
          <div className="p-2.5 rounded-xl bg-primary/5 border border-primary/20 text-center">
            <p className="text-[10px] uppercase font-bold text-muted-foreground">
              মোট পুশ গ্রাহক
            </p>
            <p className="text-base font-extrabold font-mono text-primary mt-0.5">
              {toBanglaNums(stats.totalSubscribers)}
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-muted/40 border border-border/80 text-center">
            <p className="text-[10px] uppercase font-bold text-muted-foreground">
              মেম্বার ডিভাইস
            </p>
            <p className="text-base font-extrabold font-mono text-foreground mt-0.5">
              {toBanglaNums(stats.memberSubscribers)}
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-muted/40 border border-border/80 text-center">
            <p className="text-[10px] uppercase font-bold text-muted-foreground">
              পার্টনার/গেস্ট
            </p>
            <p className="text-base font-extrabold font-mono text-foreground mt-0.5">
              {toBanglaNums(stats.partnerSubscribers + stats.guestSubscribers)}
            </p>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground">
            কুইক টেমপ্লেট নির্বাচন করুন
          </label>
          <div className="grid grid-cols-3 gap-2">
            {PRESETS.map((preset) => {
              const Icon = preset.icon;
              const isSelected = selectedPresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className={`p-2.5 rounded-xl text-left border text-xs font-semibold flex flex-col gap-1.5 transition-all cursor-pointer ${
                    isSelected
                      ? "border-primary bg-primary/10 text-primary shadow-xs ring-1 ring-primary/30"
                      : "border-border/80 bg-card hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`p-1 rounded-lg ${preset.iconColor}`}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                    )}
                  </div>
                  <span className="truncate">
                    {preset.labelBn}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Target Audience Filter */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground">
            প্রাপক সেগমেন্ট (Target Audience)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs">
            {audienceOptions.map((aud) => (
              <button
                key={aud.id}
                type="button"
                onClick={() => {
                  setTargetAudience(aud.id);
                  setSelectedPresetId("");
                }}
                className={`px-2.5 py-1.5 rounded-xl font-medium border text-center transition-all cursor-pointer ${
                  targetAudience === aud.id
                    ? "bg-foreground text-background font-bold border-foreground"
                    : "border-border/80 bg-background text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {aud.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-bold text-foreground">
              বিজ্ঞপ্তির শিরোনাম
            </label>
            <Input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setSelectedPresetId("");
              }}
              placeholder="যেমন: জরুরি রক্তদান প্রয়োজন"
              className="rounded-xl text-xs h-9 bg-background"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-foreground">
              বিজ্ঞপ্তির বার্তা
            </label>
            <Textarea
              value={body}
              onChange={(e) => {
                setBody(e.target.value);
                setSelectedPresetId("");
              }}
              rows={3}
              placeholder="বিস্তারিত বার্তা লিখুন..."
              className="rounded-xl text-xs bg-background resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">
                ক্লিক অ্যাকশন লিংক (URL)
              </label>
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="/emergency"
                className="rounded-xl text-xs h-9 bg-background font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">
                ট্যাগ (Notification Tag)
              </label>
              <Input
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="general"
                className="rounded-xl text-xs h-9 bg-background font-mono"
              />
            </div>
          </div>
        </div>

        {/* Interactive Notification Preview */}
        <div className="space-y-1.5 pt-1">
          <label className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
            <Smartphone className="h-3.5 w-3.5" />
            <span>
              ব্রাউজার পুশ প্রিভিউ
            </span>
          </label>
          <div className="p-3 bg-slate-900 text-white rounded-xl border border-slate-700/80 shadow-md flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-500 text-white shrink-0">
              <Bell className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span className="font-semibold text-emerald-400">
                  হেলথ ক্লাব (Health Club)
                </span>
                <span>এখনই</span>
              </div>
              <p className="text-xs font-bold text-white mt-0.5 truncate">
                {title || "বিজ্ঞপ্তির শিরোনাম"}
              </p>
              <p className="text-[11px] text-slate-300 leading-snug line-clamp-2 mt-0.5">
                {body || "বিজ্ঞপ্তির বিস্তারিত বিবরণ..."}
              </p>
              {url && (
                <div className="flex items-center gap-1 text-[10px] text-emerald-400 mt-1">
                  <ExternalLink className="h-2.5 w-2.5" />
                  <span className="truncate">{url}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/80">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={sending}
            className="rounded-xl text-xs h-9 px-4 cursor-pointer"
          >
            বাতিল
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleBroadcast}
            disabled={sending || stats.totalSubscribers === 0}
            className="rounded-xl text-xs h-9 px-5 bg-primary text-primary-foreground hover:bg-primary/90 font-bold gap-2 cursor-pointer shadow-md"
          >
            {sending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>সম্প্রচার হচ্ছে...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>
                  {`${toBanglaNums(stats.totalSubscribers)} ডিভাইসে পুশ পাঠান`}
                </span>
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PushBroadcastModal;
