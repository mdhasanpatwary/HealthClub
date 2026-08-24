"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { exportDatabaseDumpAction } from "@/app/actions/dbBackupActions";
import { toast } from "sonner";
import { Download, FileCode, FileJson, ShieldCheck, Loader2 } from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";

export function DbBackupExportTab() {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  const [exportFormat, setExportFormat] = useState<"json" | "sql">("json");
  const [selectedTables, setSelectedTables] = useState<string[]>([
    "members", "partners", "partnerStaff", "transactions", "doctors",
    "partnerRequests", "contactMessages", "systemSettings",
    "pwaInstallations", "memberNotifications", "adminUsers",
  ]);
  const [isExporting, setIsExporting] = useState(false);

  const allAvailableTables = [
    { id: "members", label: isEn ? "Members" : "মেম্বার তালিকা" },
    { id: "partners", label: isEn ? "Partners" : "পার্টনার হাসপাতাল" },
    { id: "partnerStaff", label: isEn ? "Staff" : "কাউন্টার স্টাফ" },
    { id: "transactions", label: isEn ? "Transactions" : "লেনদেন লগ" },
    { id: "doctors", label: isEn ? "Doctors" : "ডাক্তার তালিকা" },
    { id: "partnerRequests", label: isEn ? "Partner Requests" : "অংশীদার আবেদন" },
    { id: "contactMessages", label: isEn ? "Contact Messages" : "গ্রাহক বার্তা" },
    { id: "systemSettings", label: isEn ? "System Settings" : "সিস্টেম সেটিংস" },
    { id: "pwaInstallations", label: isEn ? "PWA Installs" : "PWA ট্র্যাকিং" },
    { id: "memberNotifications", label: isEn ? "Notifications" : "নোটিফিকেশন" },
    { id: "adminUsers", label: isEn ? "Admin Users" : "এডমিন একাউন্ট" },
  ];

  const toggleTable = (id: string) => {
    setSelectedTables((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const triggerFileDownload = (filename: string, content: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportDownload = async () => {
    if (selectedTables.length === 0) {
      toast.warning(isEn ? "Please select at least one table to export" : "অনুগ্রহ করে কমপক্ষে একটি টেবিল সিলেক্ট করুন।");
      return;
    }

    setIsExporting(true);
    try {
      const res = await exportDatabaseDumpAction(exportFormat, selectedTables);
      if (res.success && res.payload && res.filename) {
        const mimeType = exportFormat === "json" ? "application/json" : "application/sql";
        triggerFileDownload(res.filename, res.payload, mimeType);
        toast.success(
          isEn
            ? `Backup export successful! (${res.filename})`
            : `ডাটাবেস ব্যাকআপ সফলভাবে ডাউনলোড হয়েছে (${res.filename})`
        );
      } else {
        toast.error(res.message || "ব্যাকআপ এক্সপোর্ট ব্যর্থ হয়েছে।");
      }
    } catch {
      toast.error("ব্যাকআপ এক্সপোর্ট করার সময় সমস্যা হয়েছে।");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2 border border-border shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Download className="h-4 w-4 text-primary" />
            <span>{isEn ? "Direct Database Backup Export" : "ডাটাবেস ডাম্প এক্সপোর্ট"}</span>
          </CardTitle>
          <CardDescription className="text-xs">
            {isEn
              ? "Download raw database tables into portable JSON or standard PostgreSQL SQL dump"
              : "পোস্টগ্রেসকিউএল এসকিউএল (PostgreSQL SQL) বা স্ট্রাকচার্ড JSON ফরম্যাটে ব্যাকআপ ফাইল ডাউনলোড করুন।"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label className="text-xs font-semibold">{isEn ? "Export Format" : "এক্সপোর্ট ফরম্যাট"}</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setExportFormat("json")}
                className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                  exportFormat === "json"
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border hover:bg-muted/50"
                }`}
              >
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 shrink-0">
                  <FileJson className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">JSON Structure (.json)</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {isEn ? "Universal portable JSON with table metadata" : "পোর্টেবল ইউনিভার্সাল ডেটা ও মেটাডাটা"}
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setExportFormat("sql")}
                className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                  exportFormat === "sql"
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border hover:bg-muted/50"
                }`}
              >
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 shrink-0">
                  <FileCode className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">PostgreSQL Dump (.sql)</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {isEn ? "Ready-to-run INSERT queries with transactions" : "সরাসরি রান করার উপযোগী SQL কুয়েরি"}
                  </p>
                </div>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold">{isEn ? "Select Tables" : "টেবিল নির্বাচন করুন"}</Label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedTables(allAvailableTables.map((t) => t.id))}
                  className="text-[11px] text-primary hover:underline font-medium cursor-pointer"
                >
                  {isEn ? "Select All" : "সব নির্বাচন"}
                </button>
                <span className="text-muted-foreground text-[11px]">|</span>
                <button
                  type="button"
                  onClick={() => setSelectedTables([])}
                  className="text-[11px] text-muted-foreground hover:underline cursor-pointer"
                >
                  {isEn ? "Deselect All" : "মুছে ফেলুন"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 rounded-xl bg-muted/40 border border-border">
              {allAvailableTables.map((table) => {
                const isChecked = selectedTables.includes(table.id);
                return (
                  <label
                    key={table.id}
                    className={`flex items-center gap-2 p-2 rounded-lg text-xs cursor-pointer select-none transition-colors ${
                      isChecked ? "bg-background shadow-xs font-semibold text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleTable(table.id)}
                      className="rounded text-primary focus:ring-primary h-3.5 w-3.5"
                    />
                    <span className="truncate">{table.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="pt-2">
            <Button
              onClick={handleExportDownload}
              disabled={isExporting || selectedTables.length === 0}
              className="w-full sm:w-auto font-bold gap-2 text-xs h-9 cursor-pointer"
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{isEn ? "Generating Backup File..." : "ব্যাকআপ তৈরি হচ্ছে..."}</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span>
                    {isEn
                      ? `Download ${exportFormat.toUpperCase()} Backup (${selectedTables.length} Tables)`
                      : `${exportFormat.toUpperCase()} ব্যাকআপ ডাউনলোড (${selectedTables.length}টি টেবিল)`}
                  </span>
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border shadow-xs bg-muted/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>{isEn ? "Disaster Recovery Security" : "নিরাপত্তা ও ডেটা সুরক্ষা"}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-xs text-muted-foreground leading-relaxed">
          <p>
            🔒 <strong>{isEn ? "Super Admin Only" : "শুধুমাত্র সুপার এডমিন"}</strong>:{" "}
            {isEn
              ? "Database dumps contain sensitive records. Exports are strictly restricted to verified super admins."
              : "ডাটাবেস ব্যাকআপে গ্রাহক ও আর্থিক লেনদেনের সংবেদনশীল তথ্য থাকে বিধায় এটি শুধুমাত্র সুপার এডমিন এক্সেস করতে পারেন।"}
          </p>
          <p>
            💾 <strong>{isEn ? "Full Recovery" : "সম্পূর্ণ রিকভারি"}</strong>:{" "}
            {isEn
              ? "PostgreSQL SQL dumps can be executed directly in Supabase SQL editor for instant restore."
              : "SQL ডাম্প সরাসরি Supabase SQL এডিটর বা psql ক্লায়েন্টে রান করে সম্পূর্ণ সাইট রিস্টোর করা সম্ভব।"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
