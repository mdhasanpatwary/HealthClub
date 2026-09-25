"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { BackupSettings } from "@/services/db";
import { updateBackupSettingsAction } from "@/app/actions/dbBackupActions";
import { toast } from "sonner";
import { Sliders, Loader2 } from "lucide-react";

interface DbBackupRetentionTabProps {
  initialSettings: BackupSettings;
  onSettingsUpdated: (newSettings: BackupSettings) => void;
}

export function DbBackupRetentionTab({
  initialSettings,
  onSettingsUpdated,
}: DbBackupRetentionTabProps) {
  const [settings, setSettings] = useState<BackupSettings>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await updateBackupSettingsAction(settings);
      if (res.success) {
        toast.success(res.message || "ব্যাকআপ পলিসি সফলভাবে সংরক্ষিত হয়েছে!");
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
            <span>স্বয়ংক্রিয় ব্যাকআপ শিডিউল ও রিটেনশন পলিসি</span>
          </CardTitle>
          <CardDescription className="text-xs">
            কতদিন পর পর ব্যাকআপ হবে এবং পুরনো ব্যাকআপ স্বয়ংক্রিয়ভাবে মুছে যাওয়ার নিয়ম নির্ধারণ করুন।
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="auto-schedule" className="text-xs font-semibold">
                স্বয়ংক্রিয় ব্যাকআপ শিডিউল
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
                <option value="disabled">বন্ধ (শুধুমাত্র ম্যানুয়াল)</option>
                <option value="daily">দৈনিক (প্রতি ২৪ ঘণ্টায়)</option>
                <option value="weekly">সাপ্তাহিক (প্রতি ৭ দিনে একবার)</option>
                <option value="monthly">মাসিক (প্রতি ৩০ দিনে একবার)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="retention-days" className="text-xs font-semibold">
                স্ন্যাপশট সংরক্ষণের মেয়াদ
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
                <option value="7">৭ দিন</option>
                <option value="14">১৪ দিন</option>
                <option value="30">৩০ দিন (প্রস্তাবিত)</option>
                <option value="90">৯০ দিন</option>
                <option value="0">আজীবন সংরক্ষণ</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="max-snapshots" className="text-xs font-semibold">
                সর্বোচ্চ স্ন্যাপশট ধারণক্ষমতা
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
                <option value="5">৫টি স্ন্যাপশট</option>
                <option value="10">১০টি স্ন্যাপশট</option>
                <option value="20">২০টি স্ন্যাপশট (প্রস্তাবিত)</option>
                <option value="50">৫০টি স্ন্যাপশট</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">এডমিন নোটিফিকেশন</Label>
              <div className="flex items-center justify-between p-2 rounded-lg bg-muted/40 border border-border h-9">
                <span className="text-xs text-muted-foreground">
                  অটো-ব্যাকআপ সম্পন্ন হলে নোটিশ দিন
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
                  <span>সংরক্ষণ হচ্ছে...</span>
                </>
              ) : (
                <span>পলিসি সেটিংস সংরক্ষণ করুন</span>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
