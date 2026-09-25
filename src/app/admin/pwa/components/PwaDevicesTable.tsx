"use client";

import React, { useState, useMemo } from "react";
import { toBanglaNums } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Download,
  Smartphone,
  Globe,
  Clock,
  CheckCircle2,
  Copy,
  Check,
} from "lucide-react";
import type { PwaStatsData } from "@/app/actions/pwaActions";
import { toast } from "sonner";

interface PwaDevicesTableProps {
  devices: PwaStatsData["recentDevices"];
}

export function PwaDevicesTable({ devices }: PwaDevicesTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive" | "browser">("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredDevices = useMemo(() => {
    return devices.filter((d) => {
      const matchesStatus =
        statusFilter === "all" ? true : d.status === statusFilter;

      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        d.id.toLowerCase().includes(q) ||
        d.platform.toLowerCase().includes(q) ||
        (d.browser && d.browser.toLowerCase().includes(q)) ||
        (d.deviceType && d.deviceType.toLowerCase().includes(q));

      return matchesStatus && matchesSearch;
    });
  }, [devices, search, statusFilter]);

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.success("ডিভাইস আইডি কপি হয়েছে");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportCsv = () => {
    if (devices.length === 0) {
      toast.error("এক্সপোর্ট করার মতো কোনো ডেটা নেই");
      return;
    }

    const headers = ["Device ID", "Platform", "Browser", "Device Type", "Mode", "Status", "First Recorded", "Last Active", "Sessions"];
    const rows = devices.map((d) => [
      `"${d.id}"`,
      `"${d.platform}"`,
      `"${d.browser || "N/A"}"`,
      `"${d.deviceType || "N/A"}"`,
      d.isStandalone ? "Standalone PWA" : "Browser",
      d.status,
      `"${new Date(d.installedAt).toLocaleString()}"`,
      `"${new Date(d.lastActiveAt).toLocaleString()}"`,
      d.sessionCount,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `pwa_devices_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV ডাউনলোড সম্পন্ন হয়েছে");
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("bn-BD", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <Card className="border-border shadow-sm bg-card overflow-hidden">
      <CardContent className="p-5 space-y-4">
        {/* Header with Search and Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-heading text-base font-bold text-foreground flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-emerald-500" />
              ডিভাইস ও সেশন লগ
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              মোট {toBanglaNums(filteredDevices.length)} টি রেকর্ড প্রদর্শিত
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleExportCsv}
              variant="outline"
              size="sm"
              className="h-9 text-xs gap-1.5 border-border cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>CSV ডাউনলোড</span>
            </Button>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="ডিভাইস আইডি, ওএস বা ব্রাউজার খুঁজুন"
              placeholder="ডিভাইস আইডি, ওএস বা ব্রাউজার খুঁজুন..."
              className="pl-9 h-9 text-xs bg-background"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              role="button"
              aria-pressed={statusFilter === "all"}
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === "all"
                  ? "bg-primary text-white"
                  : "bg-muted hover:bg-muted/80 text-muted-foreground"
              }`}
            >
              সকল
            </button>
            <button
              type="button"
              role="button"
              aria-pressed={statusFilter === "active"}
              onClick={() => setStatusFilter("active")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === "active"
                  ? "bg-emerald-600 text-white"
                  : "bg-muted hover:bg-muted/80 text-muted-foreground"
              }`}
            >
              সক্রিয় স্ট্যান্ডঅ্যালোন
            </button>
            <button
              type="button"
              role="button"
              aria-pressed={statusFilter === "inactive"}
              onClick={() => setStatusFilter("inactive")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === "inactive"
                  ? "bg-slate-700 text-white"
                  : "bg-muted hover:bg-muted/80 text-muted-foreground"
              }`}
            >
              নিষ্ক্রিয় / আনইনস্টল
            </button>
            <button
              type="button"
              role="button"
              aria-pressed={statusFilter === "browser"}
              onClick={() => setStatusFilter("browser")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === "browser"
                  ? "bg-blue-600 text-white"
                  : "bg-muted hover:bg-muted/80 text-muted-foreground"
              }`}
            >
              ব্রাউজার
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-border text-muted-foreground font-semibold">
                <th className="p-3 whitespace-nowrap">ডিভাইস আইডি</th>
                <th className="p-3 whitespace-nowrap">প্ল্যাটফর্ম ও ব্রাউজার</th>
                <th className="p-3 whitespace-nowrap">স্ট্যাটাস</th>
                <th className="p-3 whitespace-nowrap">প্রথম রেকর্ড</th>
                <th className="p-3 whitespace-nowrap">সর্বশেষ সক্রিয়</th>
                <th className="p-3 whitespace-nowrap text-right">সেশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredDevices.length > 0 ? (
                filteredDevices.map((device) => (
                  <tr key={device.id} className="hover:bg-muted/30 transition-colors">
                    {/* Device ID */}
                    <td className="p-3 font-mono text-[11px] text-foreground">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate max-w-[130px] sm:max-w-[180px]">{device.id}</span>
                        <button
                          type="button"
                          onClick={() => handleCopyId(device.id)}
                          className="p-1 text-muted-foreground hover:text-foreground rounded transition-colors cursor-pointer"
                          title="Copy ID"
                          aria-label={`Copy device ID ${device.id}`}
                        >
                          {copiedId === device.id ? (
                            <Check className="h-3 w-3 text-emerald-500" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Platform & Browser */}
                    <td className="p-3">
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground">{device.platform}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {device.browser || "N/A"} • {device.deviceType || "device"}
                        </span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="p-3 whitespace-nowrap">
                      {device.status === "active" ? (
                        <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 gap-1 text-[10px]">
                          <CheckCircle2 className="h-3 w-3" />
                          সক্রিয় স্ট্যান্ডঅ্যালোন
                        </Badge>
                      ) : device.status === "inactive" ? (
                        <Badge variant="outline" className="bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/30 gap-1 text-[10px]">
                          <Clock className="h-3 w-3" />
                          নিষ্ক্রিয় (&gt;৩০ দিন)
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30 gap-1 text-[10px]">
                          <Globe className="h-3 w-3" />
                          ওয়েব ব্রাউজার
                        </Badge>
                      )}
                    </td>

                    {/* Installed Date */}
                    <td className="p-3 whitespace-nowrap text-muted-foreground">
                      {formatDate(device.installedAt)}
                    </td>

                    {/* Last Active Date */}
                    <td className="p-3 whitespace-nowrap font-medium text-foreground">
                      {formatDate(device.lastActiveAt)}
                    </td>

                    {/* Session Count */}
                    <td className="p-3 whitespace-nowrap text-right font-mono font-bold text-foreground">
                      {toBanglaNums(device.sessionCount)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground text-xs">
                    এখনো কোনো PWA ডিভাইস ডেটা পাওয়া যায়নি।
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
