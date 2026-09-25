"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";
import { toBanglaNums } from "@/lib/utils";
import type { BroadcastAudienceType, BroadcastChannel } from "@/app/actions/broadcastActions";

interface BroadcastConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  sending: boolean;
  audience: BroadcastAudienceType;
  targetCount: number;
  channels: BroadcastChannel[];
}

export function BroadcastConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  sending,
  audience,
  targetCount,
  channels,
}: BroadcastConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <Card className="max-w-md w-full rounded-2xl border border-border shadow-2xl bg-card animate-in fade-in zoom-in-95">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Send className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-foreground">
                ক্যাম্পেইন সম্প্রচার নিশ্চিতকরণ
              </h3>
              <p className="text-xs text-muted-foreground">
                আপনি কি নিশ্চিতভাবে এই বার্তাটি পাঠাতে চান?
              </p>
            </div>
          </div>

          <div className="p-3 bg-muted/40 rounded-xl space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">টার্গেট অডিয়েন্স:</span>
              <span className="font-bold text-foreground">{audience}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">মোট প্রাপক:</span>
              <span className="font-bold font-mono text-primary">{toBanglaNums(targetCount)} জন</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">চ্যানেলসমূহ:</span>
              <span className="font-bold text-foreground">{channels.join(", ").toUpperCase()}</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              disabled={sending}
              onClick={onClose}
              className="rounded-xl text-xs cursor-pointer"
            >
              বাতিল
            </Button>
            <Button
              disabled={sending}
              onClick={onConfirm}
              className="bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold gap-1.5 cursor-pointer"
            >
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              হ্যাঁ, সম্প্রচার করুন
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
