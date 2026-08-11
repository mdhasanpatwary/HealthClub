import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export function PartnerDashboardSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-pulse">
      {/* Header Profile card skeleton */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900 text-white shadow-xl">
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-xl bg-slate-800" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48 bg-slate-800" />
            <Skeleton className="h-3 w-64 bg-slate-800" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24 rounded-lg bg-slate-800" />
          <Skeleton className="h-9 w-20 rounded-lg bg-slate-800" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Scanner and verification */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border shadow-md">
            <CardHeader className="space-y-2">
              <Skeleton className="h-6 w-60" />
              <Skeleton className="h-4 w-96" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="py-8 border-2 border-dashed border-border rounded-xl flex justify-center">
                <Skeleton className="h-11 w-48 rounded-xl" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-11 flex-1 rounded-md" />
                <Skeleton className="h-11 w-28 rounded-md" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Recent Transactions */}
        <div>
          <Card className="border-border shadow-md h-full">
            <CardHeader className="space-y-2 pb-3">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-3.5 w-52" />
            </CardHeader>
            <CardContent className="px-4 space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="py-3 flex justify-between items-start border-b border-border/60 last:border-0">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <div className="space-y-2 text-right">
                    <Skeleton className="h-4 w-16 ml-auto" />
                    <Skeleton className="h-3 w-12 ml-auto" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
