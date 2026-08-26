"use client";

import { useState, useEffect, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  getDatabaseStatsSummaryAction,
  getDatabaseSnapshotsAction,
  getBackupSettingsAction,
} from "@/app/actions/dbBackupActions";
import { DatabaseSnapshot, BackupTableStats, BackupSettings } from "@/services/db";
import { DbBackupTableStats } from "./DbBackupTableStats";
import { DbBackupExportTab } from "./DbBackupExportTab";
import { DbBackupSnapshotsTab } from "./DbBackupSnapshotsTab";
import { DbBackupRetentionTab } from "./DbBackupRetentionTab";
import { DbBackupSnapshotDialog } from "./DbBackupSnapshotDialog";
import { toast } from "sonner";
import {
  Download,
  Database,
  RefreshCw,
  Plus,
  Sliders,
} from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";

export function DbBackupManager() {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  const [activeTab, setActiveTab] = useState<"export" | "snapshots" | "retention">("export");
  const [stats, setStats] = useState<BackupTableStats | null>(null);
  const [snapshots, setSnapshots] = useState<DatabaseSnapshot[]>([]);
  const [settings, setSettings] = useState<BackupSettings>({
    autoSchedule: "weekly",
    retentionDays: 30,
    maxSnapshots: 20,
    lastRunAt: null,
    notifyOnBackup: true,
  });

  const [loading, setLoading] = useState(true);
  const [isSnapshotModalOpen, setIsSnapshotModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const loadData = async () => {
    setLoading(true);
    try {
      const [fetchedStats, fetchedSnapshots, fetchedSettings] = await Promise.all([
        getDatabaseStatsSummaryAction(),
        getDatabaseSnapshotsAction(),
        getBackupSettingsAction(),
      ]);
      setStats(fetchedStats);
      setSnapshots(fetchedSnapshots);
      setSettings(fetchedSettings);
    } catch {
      toast.error(isEn ? "Failed to load backup data" : "ব্যাকআপ তথ্য লোড করতে ব্যর্থ হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      {/* Live Table Stats */}
      <DbBackupTableStats stats={stats} loading={loading} />

      {/* Tabs Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-muted/70 rounded-xl w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab("export")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer flex-1 sm:flex-initial shrink-0 ${
              activeTab === "export"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Download className="h-3.5 w-3.5" />
            <span>{isEn ? "One-Click Export" : "ওয়ান-ক্লিক এক্সপোর্ট"}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("snapshots")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer flex-1 sm:flex-initial shrink-0 ${
              activeTab === "snapshots"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Database className="h-3.5 w-3.5" />
            <span>{isEn ? "Snapshot Registry" : "স্ন্যাপশট রেজিস্ট্রি"}</span>
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-mono">
              {snapshots.length}
            </Badge>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("retention")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer flex-1 sm:flex-initial shrink-0 ${
              activeTab === "retention"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sliders className="h-3.5 w-3.5" />
            <span>{isEn ? "Auto Schedule & Retention" : "শিডিউল ও রিটেনশন"}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            disabled={loading || isPending}
            className="text-xs h-8 gap-1.5 rounded-xl cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>{isEn ? "Refresh" : "রিফ্রেশ"}</span>
          </Button>
          {activeTab === "snapshots" && (
            <Button
              size="sm"
              onClick={() => setIsSnapshotModalOpen(true)}
              className="text-xs h-8 gap-1.5 font-bold rounded-xl cursor-pointer bg-primary text-white"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>{isEn ? "Create Snapshot" : "নতুন স্ন্যাপশট তৈরি"}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Tab 1: Export Database */}
      {activeTab === "export" && <DbBackupExportTab />}

      {/* Tab 2: Snapshot Registry */}
      {activeTab === "snapshots" && (
        <DbBackupSnapshotsTab
          snapshots={snapshots}
          onOpenCreateModal={() => setIsSnapshotModalOpen(true)}
          onSnapshotDeleted={(id) => setSnapshots((prev) => prev.filter((s) => s.id !== id))}
        />
      )}

      {/* Tab 3: Retention & Automated Schedule Settings */}
      {activeTab === "retention" && (
        <DbBackupRetentionTab
          initialSettings={settings}
          onSettingsUpdated={(newSettings) => setSettings(newSettings)}
        />
      )}

      {/* Snapshot Creation Modal */}
      <DbBackupSnapshotDialog
        open={isSnapshotModalOpen}
        onOpenChange={setIsSnapshotModalOpen}
        onSuccess={() => {
          startTransition(() => {
            loadData();
          });
        }}
      />
    </div>
  );
}
