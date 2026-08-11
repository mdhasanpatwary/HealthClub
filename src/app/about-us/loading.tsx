import { Skeleton, PageHeaderSkeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function AboutUsLoading() {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-light/40 via-emerald-50/20 to-background dark:from-slate-950 dark:via-slate-900 dark:to-background py-16 sm:py-24 border-b border-border/60">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <PageHeaderSkeleton />
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-20">
        {/* Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <Skeleton className="h-7 w-48 rounded-lg" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
            <div className="space-y-3 pt-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>

          {/* Brand values card */}
          <Card className="p-8 rounded-3xl border border-border/80 bg-background/80 shadow-xl space-y-6">
            <Skeleton className="h-6 w-40" />
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
                  <Skeleton className="h-4 w-5/6 mt-2" />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Pillars Grid */}
        <div className="space-y-10 border-t border-border/60 pt-16">
          <PageHeaderSkeleton />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="p-7 rounded-2xl border border-border/80 text-center space-y-4 shadow-sm">
                <Skeleton className="h-14 w-14 rounded-2xl mx-auto" />
                <Skeleton className="h-5 w-32 mx-auto" />
                <Skeleton className="h-4 w-5/6 mx-auto" />
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
