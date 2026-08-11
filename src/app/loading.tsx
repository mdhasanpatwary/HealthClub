import { Skeleton, PageHeaderSkeleton, PartnerCardSkeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section Skeleton */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-light/40 via-emerald-50/20 to-background dark:from-slate-950 dark:via-slate-900 dark:to-background py-12 sm:py-20 border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content Skeleton */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <Skeleton className="h-6 w-36 rounded-full mx-auto lg:mx-0" />
              <div className="space-y-3">
                <Skeleton className="h-10 sm:h-14 w-full sm:w-5/6 rounded-2xl mx-auto lg:mx-0" />
                <Skeleton className="h-10 sm:h-14 w-4/5 sm:w-2/3 rounded-2xl mx-auto lg:mx-0" />
              </div>
              <Skeleton className="h-4 sm:h-5 w-full sm:w-3/4 rounded-md mx-auto lg:mx-0" />
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-2">
                <Skeleton className="h-12 w-44 rounded-xl mx-auto sm:mx-0" />
                <Skeleton className="h-12 w-40 rounded-xl mx-auto sm:mx-0" />
              </div>
            </div>

            {/* Right Card Skeleton */}
            <div className="lg:col-span-5 flex justify-center">
              <Card className="w-full max-w-sm p-6 border-border/60 bg-background/80 rounded-3xl space-y-5 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-xl" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <Skeleton className="h-36 w-full rounded-2xl" />
                <div className="flex items-center justify-between pt-2 border-t border-border/60">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-8 w-8 rounded-lg" />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar Skeleton */}
      <section className="border-b border-border/60 bg-muted/40 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="border-border/60 bg-background/50">
                <CardContent className="p-4 space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-7 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Cards Preview Grid Skeleton */}
      <section className="py-12 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          <PageHeaderSkeleton />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <PartnerCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

