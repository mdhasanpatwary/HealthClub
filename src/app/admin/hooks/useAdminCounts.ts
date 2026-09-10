"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { getAdminCountsAction, type AdminBadgeCounts } from "@/app/actions/adminCountActions";

export interface AdminCounts {
  doctorsCount: number;
  pendingPartnerRequests: number;
  pendingRenewals: number;
  contactMessagesCount: number;
  loading: boolean;
}

// Module-level deduplication and short TTL cache to prevent redundant concurrent
// queries when both AdminHeaderNav and MobileNavDrawer mount at the same time.
let inFlightRequest: Promise<AdminBadgeCounts> | null = null;
let cachedResult: { data: AdminBadgeCounts; timestamp: number } | null = null;
const CACHE_TTL_MS = 3000;

async function fetchDedupedAdminCounts(force = false): Promise<AdminBadgeCounts> {
  const now = Date.now();
  if (!force && cachedResult && now - cachedResult.timestamp < CACHE_TTL_MS) {
    return cachedResult.data;
  }

  if (force) {
    cachedResult = null;
  }

  if (!inFlightRequest) {
    inFlightRequest = getAdminCountsAction()
      .then((data) => {
        cachedResult = { data, timestamp: Date.now() };
        return data;
      })
      .finally(() => {
        inFlightRequest = null;
      });
  }

  return inFlightRequest;
}

export function useAdminCounts() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const [counts, setCounts] = useState<AdminCounts>({
    doctorsCount: 0,
    pendingPartnerRequests: 0,
    pendingRenewals: 0,
    contactMessagesCount: 0,
    loading: true,
  });

  const fetchCounts = useCallback(async (force = false) => {
    if (!isAdmin) {
      setCounts((prev) => ({ ...prev, loading: false }));
      return;
    }

    try {
      const data = await fetchDedupedAdminCounts(force);
      setCounts({
        doctorsCount: data.doctorsCount,
        pendingPartnerRequests: data.pendingPartnerRequests,
        pendingRenewals: data.pendingRenewals,
        contactMessagesCount: data.contactMessagesCount,
        loading: false,
      });
    } catch {
      setCounts((prev) => ({ ...prev, loading: false }));
    }
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin) {
      return;
    }

    let isMounted = true;
    Promise.resolve().then(() => {
      if (isMounted) {
        fetchCounts();
      }
    });

    const handleDataChange = () => {
      fetchCounts(true);
    };

    window.addEventListener("admin-data-change", handleDataChange);
    return () => {
      isMounted = false;
      window.removeEventListener("admin-data-change", handleDataChange);
    };
  }, [fetchCounts, isAdmin]);

  return { ...counts, refetchCounts: () => fetchCounts(true) };
}

