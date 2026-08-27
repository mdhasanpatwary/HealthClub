import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function OfflineLoading() {
  return (
    <div className="min-h-screen bg-muted/30 dark:bg-slate-950 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl space-y-6 sm:space-y-8 animate-pulse">
        {/* Offline Notification Header */}
        <div className="flex flex-col items-center text-center space-y-4">
          <Skeleton className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl" />
          <div className="space-y-2 flex flex-col items-center">
            <Skeleton className="h-7 w-60" />
            <Skeleton className="h-4 w-80 max-w-full" />
          </div>
          <Skeleton className="h-10 w-36 rounded-xl" />
        </div>

        {/* Cached Card Skeleton */}
        <Card className="p-6 border-border rounded-3xl space-y-4">
          <Skeleton className="h-6 w-44" />
          <Skeleton className="h-44 w-full rounded-2xl" />
        </Card>
      </div>
    </div>
  );
}
