"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { getPartnerRequestsAction } from "@/app/actions/partnerActions";
import { getContactMessagesAction } from "@/app/actions/contactActions";
import { getMembersAction } from "@/app/actions/memberAdminActions";
import { getAllDoctorsAdminAction } from "@/app/actions/doctorActions";

export interface AdminCounts {
  doctorsCount: number;
  pendingPartnerRequests: number;
  pendingRenewals: number;
  contactMessagesCount: number;
  loading: boolean;
}

export function useAdminCounts() {
  const pathname = usePathname();
  const [counts, setCounts] = useState<AdminCounts>({
    doctorsCount: 0,
    pendingPartnerRequests: 0,
    pendingRenewals: 0,
    contactMessagesCount: 0,
    loading: true,
  });

  const fetchCounts = useCallback(async () => {
    try {
      const [doctorsRes, requestsRes, membersRes, messagesRes] = await Promise.all([
        getAllDoctorsAdminAction(),
        getPartnerRequestsAction(),
        getMembersAction(),
        getContactMessagesAction(),
      ]);

      const pendingRequests = requestsRes.filter((r) => r.status === "pending").length;
      const pendingRenewals = membersRes.filter((m) => m.renewalStatus === "pending").length;

      setCounts({
        doctorsCount: doctorsRes.length,
        pendingPartnerRequests: pendingRequests,
        pendingRenewals: pendingRenewals,
        contactMessagesCount: messagesRes.length,
        loading: false,
      });
    } catch {
      setCounts((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    Promise.resolve().then(() => {
      if (isMounted) {
        fetchCounts();
      }
    });

    const handleDataChange = () => {
      fetchCounts();
    };

    window.addEventListener("admin-data-change", handleDataChange);
    return () => {
      isMounted = false;
      window.removeEventListener("admin-data-change", handleDataChange);
    };
  }, [fetchCounts, pathname]);

  return { ...counts, refetchCounts: fetchCounts };
}
