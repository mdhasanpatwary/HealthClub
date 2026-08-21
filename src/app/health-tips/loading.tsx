import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function HealthTipsLoading() {
  return (
    <div className="bg-background min-h-screen pb-16">
      {/* Hero Header Skeleton */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-emerald-500/5 to-background dark:from-slate-950 dark:via-slate-900 dark:to-background py-10 sm:py-16 border-b border-border/60">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <Skeleton className="h-6 w-60 mx-auto rounded-full" />
          <Skeleton className="h-9 sm:h-12 w-3/4 sm:w-1/2 mx-auto rounded-xl" />
          <Skeleton className="h-4 w-5/6 sm:w-2/3 mx-auto rounded-md" />
        </div>
      </div>

      {/* Main Content Skeleton */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        {/* Quick Matrix Skeleton */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded-md" />
            <Skeleton className="h-6 w-48 rounded-md" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="border-border p-4 space-y-3 rounded-2xl">
                <Skeleton className="h-8 w-8 rounded-xl" />
                <Skeleton className="h-4 w-3/4 rounded-md" />
                <Skeleton className="h-3 w-full rounded-md" />
              </Card>
            ))}
          </div>
        </div>

        {/* Directory & Articles Grid Skeleton */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded-md" />
            <Skeleton className="h-6 w-56 rounded-md" />
          </div>

          {/* Search and Filter Pills */}
          <div className="space-y-3">
            <Skeleton className="h-11 w-full max-w-xl mx-auto rounded-2xl" />
            <div className="flex gap-2 justify-center overflow-x-auto pb-1">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-24 rounded-full shrink-0" />
              ))}
            </div>
          </div>

          {/* Article Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="border-border bg-card rounded-2xl overflow-hidden p-5 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-20 rounded-md" />
                    <Skeleton className="h-3.5 w-16 rounded-md" />
                  </div>
                  <Skeleton className="h-5 w-4/5 rounded-md" />
                  <Skeleton className="h-3.5 w-full rounded-md" />
                  <Skeleton className="h-3.5 w-2/3 rounded-md" />
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-border/60">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-7 w-7 rounded-full" />
                    <Skeleton className="h-3.5 w-24 rounded-md" />
                  </div>
                  <Skeleton className="h-8 w-20 rounded-xl" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
