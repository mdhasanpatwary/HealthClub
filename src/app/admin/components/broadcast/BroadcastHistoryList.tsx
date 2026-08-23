"use client";

import { useState } from "react";
import {
  Search,
  Mail,
  MessageSquare,
  Bell,
  Trash2,
  Calendar,
  Users,
  Eye,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  BroadcastCampaignRecord,
  deleteBroadcastCampaignAction,
} from "@/app/actions/broadcastActions";
import { formatNum, Locale } from "@/lib/i18n";

interface BroadcastHistoryListProps {
  campaigns: BroadcastCampaignRecord[];
  locale: Locale;
  onCampaignDeleted: (id: string) => void;
}

export function BroadcastHistoryList({
  campaigns,
  locale,
  onCampaignDeleted,
}: BroadcastHistoryListProps) {
  const isBn = locale === "bn";
  const [search, setSearch] = useState("");
  const [channelFilter, setChannelFilter] = useState<string>("all");
  const [selectedCampaign, setSelectedCampaign] = useState<BroadcastCampaignRecord | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = campaigns.filter((c) => {
    const matchesSearch =
      !search ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.subject.toLowerCase().includes(search.toLowerCase()) ||
      c.message.toLowerCase().includes(search.toLowerCase());

    const matchesChannel =
      channelFilter === "all" || c.channels.includes(channelFilter as "email" | "sms" | "in_app");

    return matchesSearch && matchesChannel;
  });

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await deleteBroadcastCampaignAction(id);
      if (res.success) {
        toast.success(res.message);
        onCampaignDeleted(id);
        if (selectedCampaign?.id === id) {
          setSelectedCampaign(null);
        }
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error(isBn ? "মুছতে সমস্যা হয়েছে।" : "Failed to delete.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Channel Filter */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-card p-3 rounded-2xl border border-border/80 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isBn ? "ক্যাম্পেইন শিরোনাম বা বক্তব্য খুঁজুন..." : "Search campaign history..."}
            className="pl-9 h-9 rounded-xl text-xs"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 text-xs">
          {[
            { id: "all", label: isBn ? "সকল" : "All" },
            { id: "email", label: "ইমেইল", icon: Mail },
            { id: "sms", label: "এসএমএস", icon: MessageSquare },
            { id: "in_app", label: "ইন-অ্যাপ", icon: Bell },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setChannelFilter(item.id)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer font-semibold ${
                channelFilter === item.id
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Campaigns List */}
      {filtered.length === 0 ? (
        <Card className="rounded-2xl border-dashed border-2 border-border p-12 text-center">
          <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-3">
            <Sparkles className="h-6 w-6" />
          </div>
          <h3 className="font-heading text-sm font-bold text-foreground">
            {isBn ? "কোনো ক্যাম্পেইন ইতিহাস পাওয়া যায়নি" : "No Broadcast History Found"}
          </h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            {isBn
              ? "নতুন এসএমএস বা ইমেইল ক্যাম্পেইন সম্প্রচার করলে তার সম্পূর্ণ লগ এখানে জমা হবে।"
              : "When you send a mass announcement or campaign, full delivery logs will show here."}
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((c) => (
            <Card
              key={c.id}
              className="border-border/80 shadow-xs hover:border-primary/40 transition-all rounded-2xl bg-card"
            >
              <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {c.badge && (
                      <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/20 text-[10px] font-bold">
                        {c.badge}
                      </Badge>
                    )}
                    <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(c.createdAt).toLocaleString(locale === "bn" ? "bn-BD" : "en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                    <span className="text-[10px] font-mono bg-muted text-muted-foreground px-2 py-0.5 rounded-md">
                      Audience: {c.audience}
                    </span>
                  </div>

                  <h4 className="font-heading text-sm font-bold text-foreground truncate">
                    {c.title}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {c.message}
                  </p>

                  {/* Channel & Recipient Badges */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-xs font-mono font-bold text-foreground flex items-center gap-1">
                      <Users className="h-3.5 w-3.5 text-primary" />
                      {formatNum(c.recipientCount, locale)} {isBn ? "জন প্রাপক" : "recipients"}
                    </span>
                    <span>&bull;</span>
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      {c.channels.includes("email") && (
                        <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded-md font-mono">
                          Email: {formatNum(c.emailSentCount, locale)}
                        </span>
                      )}
                      {c.channels.includes("sms") && (
                        <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded-md font-mono">
                          SMS: {formatNum(c.smsSentCount, locale)}
                        </span>
                      )}
                      {c.channels.includes("in_app") && (
                        <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded-md font-mono">
                          In-App: {formatNum(c.inAppSentCount, locale)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedCampaign(c)}
                    className="rounded-xl text-xs gap-1.5 cursor-pointer"
                  >
                    <Eye className="h-3.5 w-3.5 text-primary" />
                    <span>{isBn ? "বিস্তারিত" : "Details"}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    disabled={deletingId === c.id}
                    onClick={() => handleDelete(c.id)}
                    className="rounded-xl text-muted-foreground hover:text-rose-600 cursor-pointer"
                    title={isBn ? "মুছে ফেলুন" : "Delete"}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Details Dialog */}
      {selectedCampaign && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="max-w-lg w-full rounded-2xl border border-border shadow-2xl bg-card animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
            <CardContent className="p-6 space-y-4 overflow-y-auto">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div>
                  <h3 className="font-heading font-bold text-base text-foreground">
                    {selectedCampaign.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(selectedCampaign.createdAt).toLocaleString()}
                  </p>
                </div>
                {selectedCampaign.badge && (
                  <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                    {selectedCampaign.badge}
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600">
                  <p className="text-[10px] font-semibold">ইমেইল ডেলিভারি</p>
                  <p className="text-sm font-bold font-mono mt-0.5">{selectedCampaign.emailSentCount}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600">
                  <p className="text-[10px] font-semibold">এসএমএস ডেলিভারি</p>
                  <p className="text-sm font-bold font-mono mt-0.5">{selectedCampaign.smsSentCount}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600">
                  <p className="text-[10px] font-semibold">ইন-অ্যাপ নোটিশ</p>
                  <p className="text-sm font-bold font-mono mt-0.5">{selectedCampaign.inAppSentCount}</p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[11px] font-bold text-muted-foreground uppercase">মূল বার্তা:</p>
                <div className="p-3.5 bg-muted/40 rounded-xl text-xs text-foreground whitespace-pre-line leading-relaxed border border-border/60">
                  {selectedCampaign.message}
                </div>
              </div>

              {selectedCampaign.actionUrl && (
                <div className="text-xs p-2.5 bg-primary/5 rounded-xl border border-primary/20 flex items-center justify-between">
                  <span className="text-muted-foreground">লিঙ্ক:</span>
                  <span className="font-mono text-primary truncate max-w-xs">{selectedCampaign.actionUrl}</span>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <Button
                  size="sm"
                  onClick={() => setSelectedCampaign(null)}
                  className="rounded-xl text-xs cursor-pointer"
                >
                  {isBn ? "বন্ধ করুন" : "Close"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
