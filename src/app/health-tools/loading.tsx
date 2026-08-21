import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function HealthToolsLoading() {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero Skeleton */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-cyan-500/5 to-background dark:from-slate-950 dark:via-slate-900 dark:to-background py-8 sm:py-16 border-b border-border/60">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <Skeleton className="h-6 w-56 mx-auto rounded-full" />
          <Skeleton className="h-8 sm:h-12 w-3/4 sm:w-1/2 mx-auto rounded-xl" />
          <Skeleton className="h-4 w-5/6 sm:w-2/3 mx-auto rounded-md" />
        </div>
      </div>

      {/* Main Hub Tabs Skeleton */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-12">
        <div className="flex justify-center">
          <Skeleton className="h-12 w-full max-w-xl rounded-2xl" />
        </div>

        {/* Calculator Card Skeleton */}
        <div className="max-w-3xl mx-auto">
          <Card className="border-border shadow-md rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-6 w-48 rounded-md" />
              <Skeleton className="h-4 w-3/4 rounded-md" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-3.5 w-24 rounded-md" />
                <Skeleton className="h-11 w-full rounded-xl" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3.5 w-24 rounded-md" />
                <Skeleton className="h-11 w-full rounded-xl" />
              </div>
            </div>

            <Skeleton className="h-11 w-full rounded-xl" />

            <div className="p-6 rounded-2xl bg-muted/40 border border-border/70 space-y-3">
              <Skeleton className="h-5 w-36 rounded-md" />
              <Skeleton className="h-8 w-24 rounded-lg" />
              <Skeleton className="h-4 w-full rounded-md" />
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
