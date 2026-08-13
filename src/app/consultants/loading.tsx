import { Skeleton, PageHeaderSkeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function ConsultantsLoading() {
  return (
    <div className="bg-background min-h-screen py-6 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-12">
        {/* Header */}
        <PageHeaderSkeleton />

        {/* Highlight Banner Skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-4xl mx-auto">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-card border border-border/80"
            >
              <Skeleton className="h-10 w-10 rounded-xl" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-3/4 rounded-md" />
                <Skeleton className="h-3 w-1/2 rounded-md" />
              </div>
            </div>
          ))}
        </div>

        {/* Directory Skeleton Container */}
        <div className="sm:bg-muted/30 sm:border sm:border-border/80 sm:rounded-3xl sm:p-8 space-y-6">
          {/* Search Bar Skeleton */}
          <div className="max-w-2xl mx-auto">
            <Skeleton className="h-12 w-full rounded-2xl" />
          </div>

          {/* Mobile Select Skeleton */}
          <div className="block sm:hidden">
            <Skeleton className="h-11 w-full rounded-2xl" />
          </div>

          {/* Desktop Filter Pills Skeleton */}
          <div className="hidden sm:flex gap-2 pb-2 justify-center flex-wrap">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-24 rounded-xl shrink-0" />
            ))}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card
                key={i}
                className="rounded-2xl border-border/80 p-3 sm:p-4 space-y-3"
              >
                <div className="flex gap-3">
                  <Skeleton className="h-16 w-16 sm:h-18 sm:w-18 rounded-2xl shrink-0" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4 rounded-md" />
                    <Skeleton className="h-3 w-1/2 rounded-md" />
                    <Skeleton className="h-3 w-2/3 rounded-md" />
                  </div>
                </div>
                <Skeleton className="h-12 w-full rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full rounded-md" />
                  <Skeleton className="h-4 w-4/5 rounded-md" />
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/60">
                  <Skeleton className="h-9 w-full rounded-xl" />
                  <Skeleton className="h-9 w-full rounded-xl" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
