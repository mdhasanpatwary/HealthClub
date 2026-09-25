"use client";

import { useState } from "react";
import {
  Star,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  RefreshCw,
  MessageSquareQuote,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toBanglaNums } from "@/lib/utils";
import { Review, AdminReviewSummary, Partner } from "@/services/db";
import {
  moderateReviewAction,
  deleteReviewAction,
} from "@/app/actions/reviewActions";
import { AdminReviewCard } from "./AdminReviewCard";
import { AdminReviewDialogs } from "./AdminReviewDialogs";

interface ReviewsTabProps {
  reviews: Review[];
  summary: AdminReviewSummary;
  partners: Partner[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  statusFilter: string;
  partnerFilter: string;
  searchQuery: string;
  loading: boolean;
  onPageChange: (page: number) => void;
  onStatusFilterChange: (status: string) => void;
  onPartnerFilterChange: (partnerId: string) => void;
  onSearchChange: (query: string) => void;
  onRefresh: () => void;
}

export function ReviewsTab({
  reviews,
  summary,
  partners,
  totalItems,
  totalPages,
  currentPage,
  statusFilter,
  partnerFilter,
  searchQuery,
  loading,
  onPageChange,
  onStatusFilterChange,
  onPartnerFilterChange,
  onSearchChange,
  onRefresh,
}: ReviewsTabProps) {
  // Moderation state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [adminFeedback, setAdminFeedback] = useState("");
  const [moderating, setModerating] = useState(false);

  // Delete state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleApprove = async (reviewId: string) => {
    setModerating(true);
    try {
      const res = await moderateReviewAction(reviewId, "approved");
      if (res.success) {
        toast.success(res.message);
        onRefresh();
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("মডারেশন করতে ব্যর্থ হয়েছে।");
    } finally {
      setModerating(false);
    }
  };

  const openRejectDialog = (reviewId: string) => {
    setSelectedReviewId(reviewId);
    setAdminFeedback("");
    setRejectModalOpen(true);
  };

  const confirmReject = async () => {
    if (!selectedReviewId) return;
    setModerating(true);
    try {
      const res = await moderateReviewAction(selectedReviewId, "rejected", adminFeedback);
      if (res.success) {
        toast.success(res.message);
        setRejectModalOpen(false);
        setSelectedReviewId(null);
        setAdminFeedback("");
        onRefresh();
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("রিভিউ বাতিল করতে সমস্যা হয়েছে।");
    } finally {
      setModerating(false);
    }
  };

  const openDeleteDialog = (reviewId: string) => {
    setDeletingId(reviewId);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    setDeleting(true);
    try {
      const res = await deleteReviewAction(deletingId);
      if (res.success) {
        toast.success(res.message);
        setDeleteModalOpen(false);
        setDeletingId(null);
        onRefresh();
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("মুছে ফেলতে সমস্যা হয়েছে।");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-secondary dark:text-white font-heading tracking-tight">
            ইউজার রিভিউ ও রেটিং ব্যবস্থাপনা
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            পার্টনার হাসপাতাল ও স্বাস্থ্যসেবার ওপর গ্রাহকদের অভিজ্ঞতার মতামত যাচাই এবং অনুমোদন করুন।
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={loading}
          className="self-start sm:self-auto rounded-xl text-xs cursor-pointer shadow-2xs"
        >
          <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
          <span>রিফ্রেশ</span>
        </Button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        {/* Total Reviews */}
        <Card className="rounded-2xl border-border/80 shadow-2xs">
          <CardContent className="p-3.5 sm:p-4 space-y-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[11px] font-bold uppercase tracking-wider">মোট রিভিউ</span>
              <MessageSquareQuote className="h-4 w-4 text-primary" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-foreground font-heading">
              {toBanglaNums(summary.total)}
            </p>
          </CardContent>
        </Card>

        {/* Pending Moderation */}
        <Card className="rounded-2xl border-amber-500/30 bg-amber-500/5 shadow-2xs">
          <CardContent className="p-3.5 sm:p-4 space-y-1">
            <div className="flex items-center justify-between text-amber-600 dark:text-amber-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">পেন্ডিং রিভিউ</span>
              <Clock className="h-4 w-4" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 font-heading">
              {toBanglaNums(summary.pending)}
            </p>
          </CardContent>
        </Card>

        {/* Approved Live */}
        <Card className="rounded-2xl border-emerald-500/30 bg-emerald-500/5 shadow-2xs">
          <CardContent className="p-3.5 sm:p-4 space-y-1">
            <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">অনুমোদিত রিভিউ</span>
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 font-heading">
              {toBanglaNums(summary.approved)}
            </p>
          </CardContent>
        </Card>

        {/* Rejected */}
        <Card className="rounded-2xl border-rose-500/30 bg-rose-500/5 shadow-2xs">
          <CardContent className="p-3.5 sm:p-4 space-y-1">
            <div className="flex items-center justify-between text-rose-600 dark:text-rose-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">বাতিলকৃত রিভিউ</span>
              <XCircle className="h-4 w-4" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-rose-600 dark:text-rose-400 font-heading">
              {toBanglaNums(summary.rejected)}
            </p>
          </CardContent>
        </Card>

        {/* Average Overall Rating */}
        <Card className="rounded-2xl border-border/80 shadow-2xs col-span-2 sm:col-span-1">
          <CardContent className="p-3.5 sm:p-4 space-y-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[11px] font-bold uppercase tracking-wider">গড় রেটিং</span>
              <Star className="h-4 w-4 fill-amber-400 text-amber-500" />
            </div>
            <div className="flex items-center gap-1.5">
              <p className="text-xl sm:text-2xl font-black text-foreground font-heading">
                {summary.averageRating > 0 ? toBanglaNums(summary.averageRating.toFixed(1)) : "০.০"}
              </p>
              <span className="text-xs text-muted-foreground">/ ৫</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl border border-border/80 bg-card space-y-3 shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          {/* Search Box (5 cols) */}
          <div className="sm:col-span-5 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="সদস্য বা প্রতিষ্ঠানের নাম অথবা মন্তব্য দিয়ে খুঁজুন..."
              className="pl-9 text-xs rounded-xl h-9"
            />
          </div>

          {/* Status Tabs (4 cols) */}
          <div className="sm:col-span-4 flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {[
              { key: "all", labelBn: "সকল", count: summary.total },
              { key: "pending", labelBn: "পেন্ডিং", count: summary.pending },
              { key: "approved", labelBn: "অনুমোদিত", count: summary.approved },
              { key: "rejected", labelBn: "বাতিল", count: summary.rejected },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => onStatusFilterChange(tab.key)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  statusFilter === tab.key
                    ? "bg-primary text-white shadow-2xs font-bold"
                    : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                <span>{tab.labelBn}</span>
                <span className="ml-1 text-[10px] opacity-80">({toBanglaNums(tab.count)})</span>
              </button>
            ))}
          </div>

          {/* Partner Facility Filter (3 cols) */}
          <div className="sm:col-span-3">
            <select
              value={partnerFilter}
              onChange={(e) => onPartnerFilterChange(e.target.value)}
              className="w-full h-9 rounded-xl border border-input bg-background px-3 py-1 text-xs outline-none focus:ring-2 focus:ring-primary shadow-2xs"
            >
              <option value="all">সকল পার্টনার প্রতিষ্ঠান</option>
              {partners.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Reviews Cards List */}
      <div className="space-y-3">
        {loading ? (
          <div className="space-y-3 animate-pulse">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 rounded-2xl bg-muted/50" />
            ))}
          </div>
        ) : reviews.length > 0 ? (
          reviews.map((review) => (
            <AdminReviewCard
              key={review.id}
              review={review}
              moderating={moderating}
              deleting={deleting}
              onApprove={handleApprove}
              onReject={openRejectDialog}
              onDelete={openDeleteDialog}
            />
          ))
        ) : (
          /* Empty State */
          <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-border/80 bg-card/50 space-y-2">
            <MessageSquareQuote className="h-8 w-8 mx-auto text-muted-foreground" />
            <h4 className="text-sm font-bold text-foreground font-heading">
              কোনো রিভিউ পাওয়া যায়নি
            </h4>
          </div>
        )}
      </div>

      {/* Enhanced Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-border/60">
          <p className="text-xs text-muted-foreground font-mono">
            পৃষ্ঠা {toBanglaNums(currentPage)} / {toBanglaNums(totalPages)} ({toBanglaNums(totalItems)} টি মোট রিভিউ)
          </p>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1 || loading}
              className="text-xs rounded-xl h-8 px-2.5 cursor-pointer gap-1"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span className="hidden xs:inline">পূর্ববর্তী</span>
            </Button>

            {/* Page number buttons */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (p) =>
                  p === 1 ||
                  p === totalPages ||
                  Math.abs(p - currentPage) <= 1
              )
              .reduce<(number | string)[]>((acc, p, idx, arr) => {
                if (idx > 0 && p - (arr[idx - 1] as number) > 1) {
                  acc.push(`ellipsis-${p}`);
                }
                acc.push(p);
                return acc;
              }, [])
              .map((item) => {
                if (typeof item === "string") {
                  return (
                    <span
                      key={item}
                      className="px-1.5 text-xs text-muted-foreground font-mono"
                    >
                      ...
                    </span>
                  );
                }
                const pageNum = item;
                const isActive = pageNum === currentPage;
                return (
                  <Button
                    key={pageNum}
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(pageNum)}
                    disabled={loading}
                    className={`text-xs rounded-xl h-8 w-8 p-0 cursor-pointer ${
                      isActive ? "bg-primary text-white font-bold" : ""
                    }`}
                  >
                    {toBanglaNums(pageNum)}
                  </Button>
                );
              })}

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages || loading}
              className="text-xs rounded-xl h-8 px-2.5 cursor-pointer gap-1"
            >
              <span className="hidden xs:inline">পরবর্তী</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* Dialogs */}
      <AdminReviewDialogs
        rejectModalOpen={rejectModalOpen}
        setRejectModalOpen={setRejectModalOpen}
        adminFeedback={adminFeedback}
        setAdminFeedback={setAdminFeedback}
        confirmReject={confirmReject}
        moderating={moderating}
        deleteModalOpen={deleteModalOpen}
        setDeleteModalOpen={setDeleteModalOpen}
        confirmDelete={confirmDelete}
        deleting={deleting}
      />
    </div>
  );
}
