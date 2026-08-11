import { Skeleton, PageHeaderSkeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function MembershipLoading() {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero Skeleton */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-light/40 via-emerald-50/20 to-background dark:from-slate-950 dark:via-slate-900 dark:to-background py-8 sm:py-20 border-b border-border/60">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <PageHeaderSkeleton />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-20 space-y-10 sm:space-y-20">
        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-stretch max-w-3xl mx-auto">
          {/* Card 1 */}
          <Card className="p-6 sm:p-8 rounded-3xl border-2 border-border/80 bg-background/80 space-y-6 flex flex-col justify-between shadow-lg">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-56" />
              </div>
              <div className="flex items-baseline gap-2">
                <Skeleton className="h-12 w-20" />
                <Skeleton className="h-4 w-28" />
              </div>
              <div className="space-y-3 pt-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-5 w-5 rounded-full shrink-0" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                ))}
              </div>
            </div>
            <Skeleton className="h-12 w-full rounded-xl mt-6" />
          </Card>

          {/* Card 2 */}
          <Card className="p-6 sm:p-8 rounded-3xl border border-border/80 bg-background/80 space-y-6 flex flex-col justify-between shadow-md">
            <div className="space-y-6">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-56" />
              </div>
              <div className="flex items-baseline gap-2">
                <Skeleton className="h-12 w-20" />
                <Skeleton className="h-4 w-28" />
              </div>
              <div className="space-y-3 pt-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-5 w-5 rounded-full shrink-0" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                ))}
              </div>
            </div>
            <Skeleton className="h-12 w-full rounded-xl mt-6" />
          </Card>
        </div>

        {/* Detailed Benefits Grid */}
        <div className="space-y-10 border-t border-border/60 pt-16">
          <PageHeaderSkeleton />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="p-6 rounded-2xl border border-border/80 bg-background/80 flex gap-4">
                <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
                <div className="space-y-2 w-full">
                  <Skeleton className="h-5 w-36" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
