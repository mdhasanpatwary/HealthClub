"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { BackupSettings } from "@/services/db";
import { updateBackupSettingsAction } from "@/app/actions/dbBackupActions";
import { toast } from "sonner";
import { Sliders, Loader2 } from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";

interface DbBackupRetentionTabProps {
  initialSettings: BackupSettings;
  onSettingsUpdated: (newSettings: BackupSettings) => void;
}

export function DbBackupRetentionTab({
  initialSettings,
  onSettingsUpdated,
}: DbBackupRetentionTabProps) {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  const [settings, setSettings] = useState<BackupSettings>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await updateBackupSettingsAction(settings);
      if (res.success) {
        toast.success(isEn ? "Backup retention settings updated!" : res.message);
        onSettingsUpdated(settings);
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("পলিসি সংরক্ষণ করতে ব্যর্থ হয়েছে।");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave}>
      <Card className="border border-border shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Sliders className="h-4 w-4 text-primary" />
            <span>{isEn ? "Automated Backup & Retention Policy" : "স্বয়ংক্রিয় ব্যাকআপ শিডিউল ও রিটেনশন পলিসি"}</span>
          </CardTitle>
          <CardDescription className="text-xs">
            {isEn
              ? "Configure automated snapshot frequencies, retention windows, and storage ceiling rules"
              : "কতদিন পর পর ব্যাকআপ হবে এবং পুরনো ব্যাকআপ স্বয়ংক্রিয়ভাবে মুছে যাওয়ার নিয়ম নির্ধারণ করুন।"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="auto-schedule" className="text-xs font-semibold">
                {isEn ? "Automated Backup Frequency" : "স্বয়ংক্রিয় ব্যাকআপ শিডিউল"}
              </Label>
              <select
                id="auto-schedule"
                value={settings.autoSchedule}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    autoSchedule: e.target.value as BackupSettings["autoSchedule"],
                  })
                }
                className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-background focus:ring-1 focus:ring-primary"
              >
                <option value="disabled">{isEn ? "Disabled (Manual Only)" : "বন্ধ (শুধুমাত্র ম্যানুয়াল)"}</option>
                <option value="daily">{isEn ? "Daily (Every 24 Hours)" : "দৈনিক (প্রতি ২৪ ঘণ্টায়)"}</option>
                <option value="weekly">{isEn ? "Weekly (Every 7 Days)" : "সাপ্তাহিক (প্রতি ৭ দিনে একবার)"}</option>
                <option value="monthly">{isEn ? "Monthly (Every 30 Days)" : "মাসিক (প্রতি ৩০ দিনে একবার)"}</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="retention-days" className="text-xs font-semibold">
                {isEn ? "Snapshot Retention Window" : "স্ন্যাপশট সংরক্ষণের মেয়াদ"}
              </Label>
              <select
                id="retention-days"
                value={settings.retentionDays}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    retentionDays: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-background focus:ring-1 focus:ring-primary"
              >
                <option value="7">{isEn ? "7 Days" : "৭ দিন"}</option>
                <option value="14">{isEn ? "14 Days" : "১৪ দিন"}</option>
                <option value="30">{isEn ? "30 Days (Recommended)" : "৩০ দিন (প্রস্তাবিত)"}</option>
                <option value="90">{isEn ? "90 Days (Quarterly)" : "৯০ দিন"}</option>
                <option value="0">{isEn ? "Keep Indefinitely" : "আজীবন সংরক্ষণ"}</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="max-snapshots" className="text-xs font-semibold">
                {isEn ? "Max Stored Snapshots Ceiling" : "সর্বোচ্চ স্ন্যাপশট ধারণক্ষমতা"}
              </Label>
              <select
                id="max-snapshots"
                value={settings.maxSnapshots}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    maxSnapshots: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-background focus:ring-1 focus:ring-primary"
              >
                <option value="5">5 Snapshots</option>
                <option value="10">10 Snapshots</option>
                <option value="20">20 Snapshots (Recommended)</option>
                <option value="50">50 Snapshots</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">{isEn ? "Admin Notifications" : "এডমিন নোটিফিকেশন"}</Label>
              <div className="flex items-center justify-between p-2 rounded-lg bg-muted/40 border border-border h-9">
                <span className="text-xs text-muted-foreground">
                  {isEn ? "Notify on Auto-Backup" : "অটো-ব্যাকআপ সম্পন্ন হলে নোটিশ দিন"}
                </span>
                <input
                  type="checkbox"
                  checked={settings.notifyOnBackup}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      notifyOnBackup: e.target.checked,
                    })
                  }
                  className="rounded text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={isSaving} size="sm" className="font-bold text-xs h-9">
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                  <span>{isEn ? "Saving..." : "সংরক্ষণ হচ্ছে..."}</span>
                </>
              ) : (
                <span>{isEn ? "Save Policy Settings" : "পলিসি সেটিংস সংরক্ষণ করুন"}</span>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
