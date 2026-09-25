"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  getPaginatedPartnerRequestsAction,
  updatePartnerRequestStatusAction,
  deletePartnerRequestAction,
  deleteAllRejectedPartnerRequestsAction,
} from "@/app/actions/partnerActions";
import { PartnerRequest } from "@/services/db";
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
import { PartnerRequestsTab } from "../components/PartnerRequestsTab";

export default function AdminPartnerRequestsPage() {
  const [loading, setLoading] = useState(true);
  const [partnerRequests, setPartnerRequests] = useState<PartnerRequest[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Single delete state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingRequest, setDeletingRequest] = useState<PartnerRequest | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Bulk delete state
  const [deleteAllModalOpen, setDeleteAllModalOpen] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const res = await getPaginatedPartnerRequestsAction({
        page,
        pageSize,
        status: statusFilter === "all" ? undefined : statusFilter,
      });
      setPartnerRequests(res.data);
      setTotalItems(res.totalItems);
      setTotalPages(res.totalPages);
    } catch {
      toast.error("আবেদন তালিকা লোড করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, statusFilter]);

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

  const handleApprove = async (id: string) => {
    if (processingId) return;
    setProcessingId(id);
    try {
      const success = await updatePartnerRequestStatusAction(id, "approved");
      if (success) {
        toast.success("অংশীদার আবেদন সফলভাবে অনুমোদিত হয়েছে এবং ডিরেক্টরিতে যুক্ত করা হয়েছে!");
        await loadData();
        window.dispatchEvent(new Event("admin-data-change"));
      } else {
        toast.error("আবেদনটি ইতিমধ্যে প্রক্রিয়া করা হয়েছে অথবা অনুমোদন করা সম্ভব হয়নি।");
      }
    } catch {
      toast.error("সার্ভার ত্রুটি।");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    if (processingId) return;
    if (confirm("আপনি কি নিশ্চিতভাবে এই আবেদনটি বাতিল করতে চান?")) {
      setProcessingId(id);
      try {
        const success = await updatePartnerRequestStatusAction(id, "rejected");
        if (success) {
          toast.success("আবেদনটি সফলভাবে বাতিল করা হয়েছে।");
          await loadData();
          window.dispatchEvent(new Event("admin-data-change"));
        } else {
          toast.error("আবেদনটি ইতিমধ্যে প্রক্রিয়া করা হয়েছে অথবা বাতিল করা সম্ভব হয়নি।");
        }
      } catch {
        toast.error("সার্ভার ত্রুটি।");
      } finally {
        setProcessingId(null);
      }
    }
  };

  const handleDeleteRequest = (req: PartnerRequest) => {
    setDeletingRequest(req);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingRequest) return;
    setIsDeleting(true);
    try {
      const success = await deletePartnerRequestAction(deletingRequest.id);
      if (success) {
        toast.success("আবেদনটি সফলভাবে মুছে ফেলা হয়েছে।");
        setDeleteModalOpen(false);
        setDeletingRequest(null);
        await loadData();
        window.dispatchEvent(new Event("admin-data-change"));
      } else {
        toast.error("আবেদনটি মুছে ফেলা সম্ভব হয়নি।");
      }
    } catch {
      toast.error("সার্ভার ত্রুটি।");
    } finally {
      setIsDeleting(false);
    }
  };

  const confirmDeleteAll = async () => {
    setIsDeletingAll(true);
    try {
      const res = await deleteAllRejectedPartnerRequestsAction();
      if (res.success) {
        toast.success("বাতিলকৃত সকল আবেদন সফলভাবে মুছে ফেলা হয়েছে।");
        setDeleteAllModalOpen(false);
        await loadData();
        window.dispatchEvent(new Event("admin-data-change"));
      } else {
        toast.error("বাতিলকৃত আবেদনগুলো মুছে ফেলা সম্ভব হয়নি।");
      }
    } catch {
      toast.error("সার্ভার ত্রুটি।");
    } finally {
      setIsDeletingAll(false);
    }
  };

  const hasRejectedRequests =
    (statusFilter === "rejected" && totalItems > 0) ||
    partnerRequests.some((r) => r.status === "rejected");

  if (loading && partnerRequests.length === 0) {
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
                  <Skeleton className="h-3 w-32" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-20 rounded-md" />
                  <Skeleton className="h-8 w-16 rounded-md" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PartnerRequestsTab
        partnerRequests={partnerRequests}
        totalItems={totalItems}
        totalPages={totalPages}
        currentPage={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPage(1);
        }}
        onApprove={handleApprove}
        onReject={handleReject}
        onDelete={handleDeleteRequest}
        onDeleteAllRejected={() => setDeleteAllModalOpen(true)}
        statusFilter={statusFilter}
        onStatusFilterChange={(status) => {
          setStatusFilter(status);
          setPage(1);
        }}
        hasRejectedRequests={hasRejectedRequests}
        loading={loading}
        processingId={processingId}
      />

      {/* Single Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-md bg-background border-border">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-destructive flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              <span>আবেদন মুছে ফেলুন</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground pt-1">
              আপনি কি নিশ্চিতভাবে এই আবেদনটি মুছে ফেলতে চান? এই পরিবর্তনটি পুনরুদ্ধার করা যাবে না।
              {deletingRequest && (
                <span className="block mt-2 font-semibold text-foreground">
                  প্রতিষ্ঠান: {deletingRequest.orgName}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteModalOpen(false)}
              disabled={isDeleting}
              className="cursor-pointer"
            >
              বাতিল
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={confirmDelete}
              disabled={isDeleting}
              className="font-bold cursor-pointer"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                  মুছে ফেলা হচ্ছে...
                </>
              ) : (
                "মুছে ফেলুন"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete All Rejected Confirmation Modal */}
      <Dialog open={deleteAllModalOpen} onOpenChange={setDeleteAllModalOpen}>
        <DialogContent className="sm:max-w-md bg-background border-border">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-destructive flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              <span>বাতিলকৃত সকল আবেদন মুছুন</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground pt-1">
              আপনি কি নিশ্চিতভাবে সকল বাতিলকৃত আবেদন মুছে ফেলতে চান? এই পরিবর্তনটি ফিরিয়ে আনা সম্ভব নয়।
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteAllModalOpen(false)}
              disabled={isDeletingAll}
              className="cursor-pointer"
            >
              বাতিল
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={confirmDeleteAll}
              disabled={isDeletingAll}
              className="font-bold cursor-pointer"
            >
              {isDeletingAll ? (
                <>
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                  মুছে ফেলা হচ্ছে...
                </>
              ) : (
                "সব মুছুন"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
