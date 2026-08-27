import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader } from "@/components/ui/card";

export default function AdminDbBackupLoading() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-pulse">
      {/* Breadcrumbs */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-56" />
        <Skeleton className="h-8 w-32 rounded-xl" />
      </div>

      {/* Hero Banner Card */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-2xl shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-6 w-60" />
              <Skeleton className="h-4 w-96 max-w-full" />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Snapshot Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border p-6 rounded-3xl space-y-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-11 w-44 rounded-xl" />
        </Card>
        <Card className="border-border p-6 rounded-3xl space-y-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-11 w-44 rounded-xl" />
        </Card>
      </div>
    </div>
  );
}
