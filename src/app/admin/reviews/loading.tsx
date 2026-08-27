import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminReviewsLoading() {
  return (
    <div className="space-y-4 animate-pulse">
      <Skeleton className="h-10 w-48 rounded-lg" />
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-2xl" />
        ))}
      </div>
      <Card className="border-border shadow-md bg-card">
        <CardContent className="p-6 space-y-4">
          <Skeleton className="h-8 w-64" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="py-4 border-b border-border last:border-0 space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-64" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
