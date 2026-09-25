"use client";

import { toBanglaNums } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Monitor, Smartphone, Globe, Laptop, Tablet } from "lucide-react";
import type { PwaStatsData } from "@/app/actions/pwaActions";

interface PwaDistributionCardsProps {
  stats: PwaStatsData;
}

export function PwaDistributionCards({ stats }: PwaDistributionCardsProps) {
  const getPlatformIcon = (platform: string) => {
    const lower = platform.toLowerCase();
    if (lower.includes("android") || lower.includes("ios")) return <Smartphone className="h-4 w-4 text-emerald-500" />;
    if (lower.includes("mac") || lower.includes("windows") || lower.includes("linux")) return <Laptop className="h-4 w-4 text-indigo-500" />;
    return <Monitor className="h-4 w-4 text-slate-500" />;
  };

  const getDeviceIcon = (deviceType: string) => {
    if (deviceType === "tablet") return <Tablet className="h-4 w-4 text-purple-500" />;
    if (deviceType === "mobile") return <Smartphone className="h-4 w-4 text-emerald-500" />;
    return <Laptop className="h-4 w-4 text-indigo-500" />;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* 1. Operating System Breakdown */}
      <Card className="border-border shadow-sm bg-card">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="font-heading text-sm font-bold text-foreground flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-emerald-500" />
              অপারেটিং সিস্টেম অনুযায়ী
            </h3>
          </div>

          {stats.platformBreakdown.length > 0 ? (
            <div className="space-y-3">
              {stats.platformBreakdown.map((item) => (
                <div key={item.platform} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground flex items-center gap-1.5">
                      {getPlatformIcon(item.platform)}
                      {item.platform}
                    </span>
                    <span className="font-mono font-semibold text-muted-foreground">
                      {toBanglaNums(item.count)} ({toBanglaNums(item.percentage)}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(4, item.percentage)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground py-6 text-center">
              কোনো ওএস তথ্য পাওয়া যায়নি
            </p>
          )}
        </CardContent>
      </Card>

      {/* 2. Browser Breakdown */}
      <Card className="border-border shadow-sm bg-card">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="font-heading text-sm font-bold text-foreground flex items-center gap-2">
              <Globe className="h-4 w-4 text-blue-500" />
              ব্রাউজার পরিসংখ্যান
            </h3>
          </div>

          {stats.browserBreakdown.length > 0 ? (
            <div className="space-y-3">
              {stats.browserBreakdown.map((item) => (
                <div key={item.browser} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground">{item.browser}</span>
                    <span className="font-mono font-semibold text-muted-foreground">
                      {toBanglaNums(item.count)} ({toBanglaNums(item.percentage)}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(4, item.percentage)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground py-6 text-center">
              কোনো ব্রাউজার তথ্য পাওয়া যায়নি
            </p>
          )}
        </CardContent>
      </Card>

      {/* 3. Device Category Breakdown */}
      <Card className="border-border shadow-sm bg-card">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="font-heading text-sm font-bold text-foreground flex items-center gap-2">
              <Laptop className="h-4 w-4 text-purple-500" />
              ডিভাইস ক্যাটাগরি
            </h3>
          </div>

          {stats.deviceTypeBreakdown.length > 0 ? (
            <div className="space-y-3">
              {stats.deviceTypeBreakdown.map((item) => (
                <div key={item.deviceType} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs capitalize">
                    <span className="font-medium text-foreground flex items-center gap-1.5">
                      {getDeviceIcon(item.deviceType)}
                      {item.deviceType === "mobile" ? "মোবাইল" : item.deviceType === "tablet" ? "ট্যাবলেট" : "ডেস্কটপ / ল্যাপটপ"}
                    </span>
                    <span className="font-mono font-semibold text-muted-foreground">
                      {toBanglaNums(item.count)} ({toBanglaNums(item.percentage)}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(4, item.percentage)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground py-6 text-center">
              কোনো ডিভাইস ক্যাটাগরি তথ্য নেই
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
