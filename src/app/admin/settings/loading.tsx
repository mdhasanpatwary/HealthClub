import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AdminSettingsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Banner Skeleton */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-background border border-border">
        <div className="space-y-2">
          <Skeleton className="h-6 w-56 rounded-md" />
          <Skeleton className="h-3.5 w-80 max-w-full rounded-md" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-20 rounded-md" />
          <Skeleton className="h-9 w-36 rounded-md" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border border-border shadow-xs">
            <CardHeader className="pb-3 space-y-1.5">
              <Skeleton className="h-5 w-44 rounded-md" />
              <Skeleton className="h-3.5 w-64 rounded-md" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-3.5 w-28 rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3.5 w-32 rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
