import { Skeleton, PageHeaderSkeleton, PartnerCardSkeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function PartnerHospitalsLoading() {
  return (
    <div className="bg-background min-h-screen py-6 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-12">
        {/* Header */}
        <PageHeaderSkeleton />

        {/* Directory Skeleton Container */}
        <div className="bg-muted/30 border border-border/80 rounded-3xl p-3.5 sm:p-8 space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Skeleton className="h-10 w-full max-w-md rounded-xl" />
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-20 rounded-full" />
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <PartnerCardSkeleton key={i} />
            ))}
          </div>
        </div>

        {/* Banner Skeleton */}
        <Card className="border border-border/60 bg-muted/40 rounded-3xl p-6 sm:p-10 text-center space-y-4 max-w-4xl mx-auto">
          <Skeleton className="h-7 w-2/3 mx-auto rounded-lg" />
          <Skeleton className="h-4 w-1/2 mx-auto rounded-md" />
          <Skeleton className="h-11 w-48 mx-auto rounded-xl mt-2" />
        </Card>
      </div>
    </div>
  );
}
