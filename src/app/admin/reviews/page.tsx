"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Review, AdminReviewSummary, Partner } from "@/services/db";
import { getAdminReviewsAction } from "@/app/actions/reviewActions";
import { getPartnersAction } from "@/app/actions/partnerActions";
import { ReviewsTab } from "../components/ReviewsTab";

export default function AdminReviewsPage() {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [summary, setSummary] = useState<AdminReviewSummary>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    averageRating: 0,
  });

  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");
  const [partnerFilter, setPartnerFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const loadData = useCallback(async () => {
    try {
      const [reviewRes, partnersRes] = await Promise.all([
        getAdminReviewsAction({
          page,
          pageSize,
          status: statusFilter,
          partnerId: partnerFilter,
          search: searchQuery,
        }),
        getPartnersAction(),
      ]);

      if (reviewRes.success) {
        setReviews(reviewRes.data);
        setTotalItems(reviewRes.totalItems);
        setTotalPages(reviewRes.totalPages);
        setSummary(reviewRes.summary);
      } else {
        toast.error("রিভিউ লোড করতে সমস্যা হয়েছে।");
      }

      setPartners(partnersRes);
    } catch {
      toast.error("রিভিউ লোড করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, statusFilter, partnerFilter, searchQuery]);

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

  if (loading && reviews.length === 0) {
    return (
      <div className="space-y-4 animate-pulse">
        <Skeleton className="h-10 w-48 rounded-lg" />
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-2xl" />
          ))}
        </div>
        <Card className="border-border shadow-md">
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-8 w-64" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="py-4 border-b border-border last:border-0 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-64" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <ReviewsTab
      reviews={reviews}
      summary={summary}
      partners={partners}
      totalItems={totalItems}
      totalPages={totalPages}
      currentPage={page}
      pageSize={pageSize}
      statusFilter={statusFilter}
      partnerFilter={partnerFilter}
      searchQuery={searchQuery}
      loading={loading}
      onPageChange={setPage}
      onStatusFilterChange={(status) => {
        setStatusFilter(status);
        setPage(1);
      }}
      onPartnerFilterChange={(partnerId) => {
        setPartnerFilter(partnerId);
        setPage(1);
      }}
      onSearchChange={(query) => {
        setSearchQuery(query);
        setPage(1);
      }}
      onRefresh={loadData}
    />
  );
}
