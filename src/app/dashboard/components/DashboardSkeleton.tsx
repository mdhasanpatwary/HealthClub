import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function DashboardSkeleton() {
  return (
    <div className="bg-muted/30 dark:bg-slate-950/50 min-h-screen py-6 sm:py-10 animate-pulse">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Welcome Banner Skeleton */}
        <div className="relative overflow-hidden bg-slate-100 dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-border/60 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4 w-full">
              <Skeleton className="h-14 w-14 rounded-2xl shrink-0" />
              <div className="space-y-2 w-full max-w-[250px]">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
            <Skeleton className="h-8 w-32 rounded-full shrink-0" />
          </div>
        </div>

        {/* Overview Stats Cards Skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="border-0 shadow-sm overflow-hidden bg-background dark:bg-slate-900">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 w-2/3">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-8 w-28" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-12 w-12 rounded-2xl" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Dashboard Panel Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Digital Card Skeleton */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="border-border/60 shadow-md overflow-hidden bg-background dark:bg-slate-900">
              <div className="border-b border-border/60 p-4 sm:p-5 bg-muted/30 dark:bg-slate-900/60 space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
                  <Skeleton className="h-5 w-44" />
                </div>
                <Skeleton className="h-3.5 w-64 max-w-full" />
              </div>
              <CardContent className="p-3 sm:p-5 space-y-4">
                <Skeleton className="w-full max-w-md mx-auto aspect-[1.586/1] min-h-[200px] sm:min-h-[220px] rounded-2xl" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Skeleton className="h-9 w-full rounded-md" />
                  <Skeleton className="h-9 w-full rounded-md" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Tabs Skeleton */}
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-2 bg-muted/60 dark:bg-slate-900/60 p-1.5 rounded-xl border border-border/60 h-11">
              <Skeleton className="h-full rounded-lg" />
              <div className="h-full" />
            </div>
            <Card className="border-border/60 bg-background dark:bg-slate-900 p-6 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-border/40">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-8 w-28 rounded-lg" />
              </div>
              <div className="space-y-3 pt-2">
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
