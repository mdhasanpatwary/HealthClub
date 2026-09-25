"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DatabaseSnapshot } from "@/services/db";
import {
  downloadSnapshotPayloadAction,
  deleteDatabaseSnapshotAction,
} from "@/app/actions/dbBackupActions";
import { toast } from "sonner";
import {
  Download,
  Database,
  HardDrive,
  Trash2,
  Clock,
  Plus,
} from "lucide-react";
import { toBanglaNums } from "@/lib/utils";

interface DbBackupSnapshotsTabProps {
  snapshots: DatabaseSnapshot[];
  onOpenCreateModal: () => void;
  onSnapshotDeleted: (id: string) => void;
}

export function DbBackupSnapshotsTab({
  snapshots,
  onOpenCreateModal,
  onSnapshotDeleted,
}: DbBackupSnapshotsTabProps) {
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

  const handleDownloadSnapshot = async (snapshot: DatabaseSnapshot) => {
    try {
      toast.info("স্ন্যাপশট ডাউনলোড ফাইল তৈরি হচ্ছে...");
      const res = await downloadSnapshotPayloadAction(snapshot.id);
      if (res.success && res.payload) {
        const ext = snapshot.format === "json" ? "json" : "sql";
        const cleanName = snapshot.name.toLowerCase().replace(/[^a-z0-9_-]/g, "-");
        const filename = `snapshot-${cleanName}.${ext}`;
        const mimeType = snapshot.format === "json" ? "application/json" : "application/sql";
        triggerFileDownload(filename, res.payload, mimeType);
        toast.success("স্ন্যাপশট সফলভাবে ডাউনলোড হয়েছে।");
      } else {
        toast.error(res.message || "ডাউনলোড ব্যর্থ হয়েছে।");
      }
    } catch {
      toast.error("স্ন্যাপশট ডাউনলোড করতে সমস্যা হয়েছে।");
    }
  };

  const handleDeleteSnapshot = async (id: string, name: string) => {
    if (!confirm(`আপনি কি নিশ্চিত যে "${name}" স্ন্যাপশটটি ডিলিট করতে চান?`)) {
      return;
    }

    try {
      const res = await deleteDatabaseSnapshotAction(id);
      if (res.success) {
        toast.success(res.message || "স্ন্যাপশট সফলভাবে মুছে ফেলা হয়েছে");
        onSnapshotDeleted(id);
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("স্ন্যাপশট ডিলিট করতে সমস্যা হয়েছে।");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "০ বাইট";
    const k = 1024;
    const sizes = ["বাইট", "কেবি", "এমবি", "জিবি"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return toBanglaNums(parseFloat((bytes / Math.pow(k, i)).toFixed(2))) + " " + sizes[i];
  };

  return (
    <Card className="border border-border shadow-xs">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Database className="h-4 w-4 text-primary" />
              <span>সংরক্ষিত ডাটাবেস স্ন্যাপশট তালিকা</span>
            </CardTitle>
            <CardDescription className="text-xs">
              সার্ভারে সংরক্ষিত পয়েন্ট-ইন-টাইম স্ন্যাপশট দেখুন, ডাউনলোড বা ডিলিট করুন।
            </CardDescription>
          </div>
          <Button
            size="sm"
            onClick={onOpenCreateModal}
            className="text-xs h-8 gap-1.5 font-bold rounded-xl cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>নতুন স্ন্যাপশট নিন</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {snapshots.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground space-y-3">
            <HardDrive className="h-10 w-10 mx-auto text-muted-foreground/40" />
            <p className="text-xs font-medium">
              এখনও কোনো স্ন্যাপশট সংরক্ষণ করা হয়নি।
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenCreateModal}
              className="text-xs cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              প্রথম স্ন্যাপশট তৈরি করুন
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border text-muted-foreground font-semibold">
                  <th className="py-2.5 px-3">স্ন্যাপশটের নাম</th>
                  <th className="py-2.5 px-3">ফরম্যাট</th>
                  <th className="py-2.5 px-3">সাইজ</th>
                  <th className="py-2.5 px-3">ট্রিগার</th>
                  <th className="py-2.5 px-3">তৈরির তারিখ</th>
                  <th className="py-2.5 px-3">মেয়াদ</th>
                  <th className="py-2.5 px-3 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {snapshots.map((snap) => (
                  <tr key={snap.id} className="hover:bg-muted/40 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-foreground">{snap.name}</div>
                      {snap.description && (
                        <div className="text-[11px] text-muted-foreground truncate max-w-xs">
                          {snap.description}
                        </div>
                      )}
                      <div className="flex flex-wrap gap-1 mt-1">
                        {Object.entries(snap.tableStats || {})
                          .filter(([, count]) => count > 0)
                          .slice(0, 4)
                          .map(([tbl, count]) => (
                            <span
                              key={tbl}
                              className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] bg-muted font-mono text-muted-foreground"
                            >
                              {tbl}: {toBanglaNums(count)}
                            </span>
                          ))}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <Badge
                        variant="outline"
                        className={`text-[10px] uppercase font-mono ${
                          snap.format === "json"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                        }`}
                      >
                        {snap.format}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 font-mono font-medium">{formatFileSize(snap.fileSize)}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          snap.trigger === "automated"
                            ? "bg-purple-500/10 text-purple-600 dark:text-purple-300"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <Clock className="h-2.5 w-2.5" />
                        {snap.trigger === "automated"
                          ? "অটোমেটেড"
                          : "ম্যানুয়াল"}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-muted-foreground whitespace-nowrap">
                      {new Date(snap.createdAt).toLocaleString("bn-BD", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                    <td className="py-3 px-3 text-muted-foreground whitespace-nowrap">
                      {snap.expiresAt ? (
                        new Date(snap.expiresAt).toLocaleDateString("bn-BD")
                      ) : (
                        <span className="text-[10px] text-muted-foreground/70">
                          স্থায়ী
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadSnapshot(snap)}
                          className="h-7 w-7 p-0 rounded-lg hover:bg-primary/10 hover:text-primary cursor-pointer"
                          title="ডাউনলোড করুন"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSnapshot(snap.id, snap.name)}
                          className="h-7 w-7 p-0 rounded-lg hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                          title="ডিলিট করুন"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
