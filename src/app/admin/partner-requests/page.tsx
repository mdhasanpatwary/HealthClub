"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  getPartnerRequestsAction,
  updatePartnerRequestStatusAction,
  PartnerRequest,
} from "@/app/actions/partnerActions";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { PartnerRequestsTab } from "../components/PartnerRequestsTab";

export default function AdminPartnerRequestsPage() {
  const [loading, setLoading] = useState(true);
  const [partnerRequests, setPartnerRequests] = useState<PartnerRequest[]>([]);

  const loadData = useCallback(async () => {
    try {
      const data = await getPartnerRequestsAction();
      setPartnerRequests(data);
    } catch (err) {
      console.error("Failed to load partner requests:", err);
      toast.error("আবেদন তালিকা লোড করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  }, []);

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
    try {
      const success = await updatePartnerRequestStatusAction(id, "approved");
      if (success) {
        toast.success("অংশীদার আবেদন সফলভাবে অনুমোদিত হয়েছে এবং ডিরেক্টরিতে যুক্ত করা হয়েছে!");
        await loadData();
        window.dispatchEvent(new Event("admin-data-change"));
      } else {
        toast.error("আবেদন অনুমোদন করতে সমস্যা হয়েছে।");
      }
    } catch {
      toast.error("সার্ভার ত্রুটি।");
    }
  };

  const handleReject = async (id: string) => {
    if (confirm("আপনি কি নিশ্চিতভাবে এই আবেদনটি বাতিল করতে চান?")) {
      try {
        const success = await updatePartnerRequestStatusAction(id, "rejected");
        if (success) {
          toast.success("আবেদনটি সফলভাবে বাতিল করা হয়েছে।");
          await loadData();
          window.dispatchEvent(new Event("admin-data-change"));
        } else {
          toast.error("আবেদন বাতিল করতে সমস্যা হয়েছে।");
        }
      } catch {
        toast.error("সার্ভার ত্রুটি।");
      }
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
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}
