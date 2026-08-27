import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function AdminBroadcastLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-8 w-32 rounded-xl" />
      </div>

      {/* Main Campaign Builder Card */}
      <Card className="border-border shadow-xs bg-card p-6 rounded-3xl space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-border">
          <div className="space-y-2">
            <Skeleton className="h-6 w-56" />
            <Skeleton className="h-4 w-80 max-w-full" />
          </div>
          <Skeleton className="h-9 w-36 rounded-xl" />
        </div>

        {/* Target Audience Segment Selector */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-32" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-4 rounded-2xl border border-border/80 space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
        </div>

        {/* Message Composition Form */}
        <div className="space-y-4">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>

        {/* Send Action */}
        <div className="flex justify-end pt-2">
          <Skeleton className="h-11 w-44 rounded-xl" />
        </div>
      </Card>
    </div>
  );
}
