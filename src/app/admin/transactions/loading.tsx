import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AdminTransactionsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex justify-between items-center bg-card p-4 rounded-2xl border border-border">
        <div className="space-y-1.5">
          <Skeleton className="h-5 w-36 rounded-md" />
          <Skeleton className="h-3.5 w-60 rounded-md" />
        </div>
        <Skeleton className="h-9 w-40 rounded-xl" />
      </div>

      <Card className="border-border shadow-md">
        <CardHeader className="flex flex-row justify-between items-center">
          <div className="space-y-1.5">
            <Skeleton className="h-5 w-44 rounded-md" />
            <Skeleton className="h-3.5 w-56 rounded-md" />
          </div>
          <Skeleton className="h-9 w-28 rounded-md" />
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-4 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-border">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-24 hidden sm:block" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
            </div>
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 border-b border-border/50 last:border-0 gap-4"
              >
                <div className="space-y-1 w-36">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-20 font-mono" />
                </div>
                <Skeleton className="h-4 w-32 flex-1" />
                <Skeleton className="h-3.5 w-24 hidden sm:block" />
                <Skeleton className="h-4 w-16 font-mono" />
                <Skeleton className="h-4 w-16 font-mono" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
