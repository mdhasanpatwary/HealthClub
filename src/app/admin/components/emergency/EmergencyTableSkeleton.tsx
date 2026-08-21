"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function EmergencyTableSkeleton() {
  return (
    <div className="rounded-xl border border-border overflow-hidden p-4 space-y-3">
      <div className="flex justify-between items-center pb-2 border-b border-border">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-32 hidden sm:block" />
        <Skeleton className="h-4 w-28 hidden md:block" />
        <Skeleton className="h-4 w-16" />
      </div>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0 gap-4">
          <div className="flex items-center gap-3 flex-1">
            <Skeleton className="h-8 w-8 rounded-full shrink-0" />
            <div className="space-y-1.5 flex-1">
              <Skeleton className="h-4 w-40 max-w-sm" />
              <Skeleton className="h-3 w-28 max-w-xs" />
            </div>
          </div>
          <Skeleton className="h-4 w-24 hidden md:block" />
          <Skeleton className="h-4 w-20 hidden sm:block" />
          <div className="flex gap-1.5">
            <Skeleton className="h-7 w-7 rounded-md" />
            <Skeleton className="h-7 w-7 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}
