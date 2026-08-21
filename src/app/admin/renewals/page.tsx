"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { dbStore } from "@/services/dbStore";
import { Member } from "@/services/db";
import {
  approveMemberRenewalAction,
  rejectMemberRenewalAction,
} from "@/app/actions/memberAdminActions";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { RenewalsTab } from "../components/RenewalsTab";

export default function AdminRenewalsPage() {
  const { t, locale } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<Member[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const loadData = useCallback(async () => {
    try {
      const res = await dbStore.getPaginatedRenewals({
        page,
        pageSize,
      });
      setMembers(res.data);
      setTotalItems(res.totalItems);
      setTotalPages(res.totalPages);
    } catch {
      toast.error("নবায়ন আবেদন তালিকা লোড করতে সমস্যা হয়েছে।");
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

  const handleApproveRenewal = async (memberId: string) => {
    try {
      const success = await approveMemberRenewalAction(memberId);
      if (success) {
        toast.success("মেম্বারশিপ নবায়ন আবেদন সফলভাবে অনুমোদিত হয়েছে!");
        await loadData();
        window.dispatchEvent(new Event("admin-data-change"));
      } else {
        toast.error("অনুমোদন করা যায়নি।");
      }
    } catch {
      toast.error("সার্ভার ত্রুটি।");
    }
  };

  const handleRejectRenewal = async (memberId: string) => {
    try {
      const success = await rejectMemberRenewalAction(memberId);
      if (success) {
        toast.success("নবায়ন আবেদন বাতিল করা হয়েছে।");
        await loadData();
        window.dispatchEvent(new Event("admin-data-change"));
      } else {
        toast.error("বাতিল করা যায়নি।");
      }
    } catch {
      toast.error("সার্ভার ত্রুটি।");
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
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-28" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-16 rounded-md" />
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
      <RenewalsTab
        members={members}
        totalItems={totalItems}
        totalPages={totalPages}
        currentPage={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPage(1);
        }}
        onApprove={handleApproveRenewal}
        onReject={handleRejectRenewal}
        locale={locale}
        t={t}
        loading={loading}
      />
    </div>
  );
}

