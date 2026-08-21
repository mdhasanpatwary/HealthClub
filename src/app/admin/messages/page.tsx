"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/components/layout/LanguageProvider";
import {
  getPaginatedContactMessagesAction,
  deleteContactMessageAction,
  ContactMessage,
} from "@/app/actions/contactActions";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { ContactMessagesTab } from "../components/ContactMessagesTab";

export default function AdminMessagesPage() {
  const { t, locale } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const res = await getPaginatedContactMessagesAction({
        page,
        pageSize,
      });
      setMessages(res.data);
      setTotalItems(res.totalItems);
      setTotalPages(res.totalPages);
    } catch {
      toast.error("যোগাযোগের বার্তা লোড করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);


  useEffect(() => {
    let isMounted = true;
    Promise.resolve().then(() => {
      if (isMounted) {
        loadData();
      }
    });
    return () => {
      isMounted = false;
    };
  }, [loadData]);

  const handleDeleteRequest = (id: string) => {
    setDeletingId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    setDeleting(true);
    try {
      const success = await deleteContactMessageAction(deletingId);
      if (success) {
        toast.success(t("admin.dashboard.messageDeletedSuccess"));
        setDeleteModalOpen(false);
        setDeletingId(null);
        await loadData();
        window.dispatchEvent(new Event("admin-data-change"));
      } else {
        toast.error(t("admin.dashboard.messageDeletedFailed"));
      }
    } catch {
      toast.error(t("admin.dashboard.messageDeletedFailed"));
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <Skeleton className="h-10 w-48 rounded-lg" />
        <Card className="border-border shadow-md">
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-8 w-64" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center py-4 border-b border-border last:border-0">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-64" />
                </div>
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ContactMessagesTab
        messages={messages}
        totalItems={totalItems}
        totalPages={totalPages}
        currentPage={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPage(1);
        }}
        onDelete={handleDeleteRequest}
        t={t}
        locale={locale}
        loading={loading}
      />


      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-md bg-background border-border">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-destructive flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              <span>{t("admin.dashboard.delete")}</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {t("admin.dashboard.deleteMessageConfirm")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteModalOpen(false)}
              disabled={deleting}
            >
              {locale === "bn" ? "বাতিল" : "Cancel"}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={confirmDelete}
              disabled={deleting}
              className="font-bold"
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                  {locale === "bn" ? "মুছে ফেলা হচ্ছে..." : "Deleting..."}
                </>
              ) : (
                locale === "bn" ? "মুছে ফেলুন" : "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
