"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { createDatabaseSnapshotAction } from "@/app/actions/dbBackupActions";
import { toast } from "sonner";
import { Database, FileCode, FileJson, Loader2 } from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";

interface DbBackupSnapshotDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function DbBackupSnapshotDialog({
  open,
  onOpenChange,
  onSuccess,
}: DbBackupSnapshotDialogProps) {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  const [snapshotName, setSnapshotName] = useState("");
  const [snapshotDesc, setSnapshotDesc] = useState("");
  const [snapshotFormat, setSnapshotFormat] = useState<"json" | "sql">("json");
  const [isCreatingSnapshot, setIsCreatingSnapshot] = useState(false);

  const handleCreateSnapshot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!snapshotName.trim()) {
      toast.warning("অনুগ্রহ করে স্ন্যাপশটের নাম লিখুন।");
      return;
    }

    setIsCreatingSnapshot(true);
    try {
      const res = await createDatabaseSnapshotAction({
        name: snapshotName.trim(),
        description: snapshotDesc.trim() || undefined,
        format: snapshotFormat,
        trigger: "manual",
      });

      if (res.success) {
        toast.success(isEn ? "Database snapshot created successfully!" : res.message);
        onOpenChange(false);
        setSnapshotName("");
        setSnapshotDesc("");
        onSuccess();
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("স্ন্যাপশট তৈরি করতে সমস্যা হয়েছে।");
    } finally {
      setIsCreatingSnapshot(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleCreateSnapshot}>
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Database className="h-4 w-4 text-primary" />
              <span>{isEn ? "Create Point-in-Time Snapshot" : "নতুন ডাটাবেস স্ন্যাপশট নিন"}</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              {isEn
                ? "Saves a complete snapshot of all active tables to the server's disaster recovery registry."
                : "বর্তমান ডাটাবেসের সমস্ত তথ্য ও মেটাডাটা সার্ভারে নিরাপদ স্ন্যাপশট হিসেবে সংরক্ষণ করুন।"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5 py-4">
            <div className="space-y-1.5">
              <Label htmlFor="snap-name" className="text-xs font-semibold">
                {isEn ? "Snapshot Name" : "স্ন্যাপশটের নাম"} *
              </Label>
              <Input
                id="snap-name"
                placeholder={isEn ? "e.g. Pre-v2-Deployment" : "যেমন: প্রি-রিলিজ ব্যাকআপ"}
                value={snapshotName}
                onChange={(e) => setSnapshotName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="snap-desc" className="text-xs font-semibold">
                {isEn ? "Description / Notes (Optional)" : "বিবরণ বা নোট (ঐচ্ছিক)"}
              </Label>
              <Input
                id="snap-desc"
                placeholder={isEn ? "e.g. Full system backup before member fee update" : "যেমন: মেম্বার ফি আপডেটের আগের ব্যাকআপ"}
                value={snapshotDesc}
                onChange={(e) => setSnapshotDesc(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">{isEn ? "Format" : "ফরম্যাট"}</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSnapshotFormat("json")}
                  className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    snapshotFormat === "json"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  <FileJson className="h-3.5 w-3.5" />
                  <span>JSON Structure</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSnapshotFormat("sql")}
                  className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    snapshotFormat === "sql"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  <FileCode className="h-3.5 w-3.5" />
                  <span>PostgreSQL Dump</span>
                </button>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs"
            >
              {isEn ? "Cancel" : "বাতিল"}
            </Button>
            <Button type="submit" size="sm" disabled={isCreatingSnapshot} className="font-bold text-xs">
              {isCreatingSnapshot ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                  <span>{isEn ? "Creating..." : "তৈরি হচ্ছে..."}</span>
                </>
              ) : (
                <span>{isEn ? "Save Snapshot" : "স্ন্যাপশট তৈরি করুন"}</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
