"use client";

import { Users, Building2, Droplet, Sparkles, Mail, MessageSquare, Bell } from "lucide-react";
import { formatNum, Locale } from "@/lib/i18n";
import {
  BroadcastAudienceType,
  BroadcastChannel,
  BroadcastAudienceCounts,
} from "@/app/actions/broadcastActions";

interface BroadcastAudienceSelectorProps {
  audience: BroadcastAudienceType;
  setAudience: (aud: BroadcastAudienceType) => void;
  channels: BroadcastChannel[];
  handleToggleChannel: (ch: BroadcastChannel) => void;
  counts: BroadcastAudienceCounts;
  locale: Locale;
  isBn: boolean;
}

export function BroadcastAudienceSelector({
  audience,
  setAudience,
  channels,
  handleToggleChannel,
  counts,
  locale,
  isBn,
}: BroadcastAudienceSelectorProps) {
  return (
    <div className="bg-card rounded-2xl border border-border/80 p-4 space-y-4 shadow-xs">
      <h3 className="font-heading font-bold text-sm text-foreground">
        {isBn ? "১. প্রাপক ও মাধ্যম নির্বাচন" : "1. Target Audience & Channels"}
      </h3>

      {/* Target Audience Tabs */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-muted-foreground">
          {isBn ? "টার্গেট প্রাপক ক্যাটাগরি" : "Target Audience Segment"}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            { type: "all_members" as const, labelBn: "সকল সদস্য", labelEn: "All Members", count: counts.allMembers, icon: Users },
            { type: "active_members" as const, labelBn: "সক্রিয় মেম্বার", labelEn: "Active Members", count: counts.activeMembers, icon: Users },
            { type: "inactive_members" as const, labelBn: "মেয়াদোত্তীর্ণ মেম্বার", labelEn: "Expired / Inactive", count: counts.inactiveMembers, icon: Users },
            { type: "blood_donors" as const, labelBn: "রক্তদাতা সকল", labelEn: "Blood Donors", count: counts.bloodDonors, icon: Droplet },
            { type: "partners" as const, labelBn: "পার্টনার হাসপাতাল", labelEn: "Partner Hospitals", count: counts.partners, icon: Building2 },
            { type: "all_users" as const, labelBn: "সমগ্র ইউজার ডাটা", labelEn: "All Unique Users", count: counts.totalUniqueUsers, icon: Sparkles },
          ].map((item) => {
            const Icon = item.icon;
            const active = audience === item.type;
            return (
              <button
                key={item.type}
                type="button"
                onClick={() => setAudience(item.type)}
                className={`text-left p-2.5 rounded-xl border transition-all cursor-pointer ${
                  active
                    ? "border-primary bg-primary/10 text-primary shadow-xs font-bold"
                    : "border-border/70 bg-muted/20 hover:bg-muted/50 text-foreground"
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="flex items-center gap-1">
                    <Icon className="h-3.5 w-3.5" />
                    <span className="truncate">{isBn ? item.labelBn : item.labelEn}</span>
                  </span>
                </div>
                <p className="text-[11px] font-mono text-muted-foreground font-semibold">
                  {formatNum(item.count, locale)} {isBn ? "জন" : "users"}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Delivery Channel Toggles */}
      <div className="space-y-2 pt-1 border-t border-border/60">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-muted-foreground">
            {isBn ? "ডেলিভারি চ্যানেলসমূহ *" : "Delivery Channels *"}
          </label>
          <span className="text-[10px] text-muted-foreground">
            {channels.length} {isBn ? "টি চ্যানেল সক্রিয়" : "selected"}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleToggleChannel("email")}
            className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              channels.includes("email")
                ? "border-primary bg-primary text-white shadow-xs"
                : "border-border bg-muted/20 text-muted-foreground hover:text-foreground"
            }`}
          >
            <Mail className="h-3.5 w-3.5" />
            <span>{isBn ? "ইমেইল" : "Email"}</span>
          </button>

          <button
            type="button"
            onClick={() => handleToggleChannel("sms")}
            className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              channels.includes("sms")
                ? "border-primary bg-primary text-white shadow-xs"
                : "border-border bg-muted/20 text-muted-foreground hover:text-foreground"
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>{isBn ? "এসএমএস" : "SMS"}</span>
          </button>

          <button
            type="button"
            onClick={() => handleToggleChannel("in_app")}
            className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              channels.includes("in_app")
                ? "border-primary bg-primary text-white shadow-xs"
                : "border-border bg-muted/20 text-muted-foreground hover:text-foreground"
            }`}
          >
            <Bell className="h-3.5 w-3.5" />
            <span>{isBn ? "ইন-অ্যাপ" : "In-App"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
