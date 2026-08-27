import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader } from "@/components/ui/card";

export default function AdminImportLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-8 w-32 rounded-xl" />
      </div>

      {/* Hero Header Card */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-2xl shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-6 w-64" />
              <Skeleton className="h-4 w-96 max-w-full" />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Category Tabs */}
      <div className="flex gap-2 border-b border-border pb-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-28 rounded-xl" />
        ))}
      </div>

      {/* Upload Zone Card */}
      <Card className="border-2 border-dashed border-border p-8 rounded-3xl flex flex-col items-center justify-center space-y-4">
        <Skeleton className="h-16 w-16 rounded-2xl" />
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-10 w-36 rounded-xl" />
      </Card>
    </div>
  );
}
