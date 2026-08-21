import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function EmergencyLoading() {
  return (
    <div className="bg-background min-h-screen">
      {/* Page Hero Header Skeleton */}
      <div className="relative overflow-hidden bg-gradient-to-br from-rose-500/10 via-amber-500/5 to-background dark:from-slate-950 dark:via-slate-900 dark:to-background py-8 sm:py-16 border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <Skeleton className="h-6 w-56 mx-auto rounded-full" />
          <Skeleton className="h-8 sm:h-12 w-3/4 sm:w-1/2 mx-auto rounded-xl" />
          <Skeleton className="h-4 w-5/6 sm:w-2/3 mx-auto rounded-md" />
          <div className="pt-2 flex flex-wrap justify-center gap-2 sm:gap-4">
            <Skeleton className="h-7 w-32 rounded-full" />
            <Skeleton className="h-7 w-32 rounded-full" />
            <Skeleton className="h-7 w-36 rounded-full" />
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-8">
        {/* Tab Switcher Skeleton */}
        <Skeleton className="h-12 w-full max-w-xl mx-auto rounded-2xl" />

        {/* Action / Highlights Banner Skeleton */}
        <div className="p-5 rounded-2xl border border-rose-500/20 bg-rose-500/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-64 rounded-md" />
            <Skeleton className="h-3.5 w-80 max-w-full rounded-md" />
          </div>
          <Skeleton className="h-9 w-36 rounded-xl shrink-0" />
        </div>

        {/* Filter Bar Skeleton */}
        <div className="space-y-3">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {Array.from({ length: 9 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-16 rounded-full shrink-0" />
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        </div>

        {/* Card Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="border-border/80 bg-card p-4 space-y-3 rounded-2xl">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-3/4 rounded-md" />
                  <Skeleton className="h-3 w-1/2 rounded-md" />
                </div>
                <Skeleton className="h-7 w-12 rounded-lg" />
              </div>
              <Skeleton className="h-3 w-36 rounded-md pt-1" />
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50">
                <Skeleton className="h-8 w-full rounded-lg" />
                <Skeleton className="h-8 w-full rounded-lg" />
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
