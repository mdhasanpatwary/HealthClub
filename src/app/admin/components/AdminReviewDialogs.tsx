"use client";

import { XCircle, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useLanguage } from "@/components/layout/LanguageProvider";

interface AdminReviewDialogsProps {
  rejectModalOpen: boolean;
  setRejectModalOpen: (open: boolean) => void;
  adminFeedback: string;
  setAdminFeedback: (feedback: string) => void;
  confirmReject: () => void;
  moderating: boolean;

  deleteModalOpen: boolean;
  setDeleteModalOpen: (open: boolean) => void;
  confirmDelete: () => void;
  deleting: boolean;
}

export function AdminReviewDialogs({
  rejectModalOpen,
  setRejectModalOpen,
  adminFeedback,
  setAdminFeedback,
  confirmReject,
  moderating,
  deleteModalOpen,
  setDeleteModalOpen,
  confirmDelete,
  deleting,
}: AdminReviewDialogsProps) {
  const { t, locale } = useLanguage();
  const isBn = locale === "bn";

  return (
    <>
      {/* Reject Moderation Dialog */}
      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent className="sm:max-w-md bg-background border-border">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-destructive flex items-center gap-2">
              <XCircle className="h-5 w-5" />
              <span>{t("admin.reviews.reject")}</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {t("admin.reviews.feedbackPrompt")}
            </DialogDescription>
          </DialogHeader>

          <div className="py-2 space-y-2">
            <Textarea
              value={adminFeedback}
              onChange={(e) => setAdminFeedback(e.target.value)}
              placeholder={isBn ? "বাতিল করার কারণ লিখুন..." : "Reason for rejecting review..."}
              rows={3}
              className="text-xs rounded-xl resize-none"
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRejectModalOpen(false)}
              disabled={moderating}
              className="text-xs rounded-xl"
            >
              {isBn ? "বাতিল" : "Cancel"}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={confirmReject}
              disabled={moderating}
              className="text-xs font-bold rounded-xl"
            >
              {moderating ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  <span>{isBn ? "প্রক্রিয়াধীন..." : "Processing..."}</span>
                </>
              ) : (
                <span>{t("admin.reviews.reject")}</span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-md bg-background border-border">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-destructive flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              <span>{t("admin.reviews.delete")}</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {t("admin.reviews.confirmDelete")}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteModalOpen(false)}
              disabled={deleting}
              className="text-xs rounded-xl"
            >
              {isBn ? "বাতিল" : "Cancel"}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={confirmDelete}
              disabled={deleting}
              className="text-xs font-bold rounded-xl"
            >
              {deleting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  <span>{isBn ? "মুছে ফেলা হচ্ছে..." : "Deleting..."}</span>
                </>
              ) : (
                <span>{t("admin.reviews.delete")}</span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
