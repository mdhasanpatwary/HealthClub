import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AdminHealthTipsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <Card className="border-border shadow-xs">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-60 rounded-md" />
            <Skeleton className="h-4 w-80 rounded-md" />
          </div>
          <Skeleton className="h-9 w-36 rounded-md" />
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-border">
            <div className="flex gap-2 w-full sm:w-auto">
              <Skeleton className="h-9 w-60 rounded-md flex-1" />
              <Skeleton className="h-9 w-32 rounded-md" />
            </div>
            <Skeleton className="h-9 w-24 rounded-md" />
          </div>
          <div className="rounded-xl border border-border overflow-hidden p-4 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0 gap-4">
                <Skeleton className="h-5 w-20 rounded-md shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-3/4 max-w-sm" />
                  <Skeleton className="h-3 w-1/2 max-w-xs" />
                </div>
                <Skeleton className="h-4 w-24 hidden sm:block" />
                <Skeleton className="h-4 w-20 hidden md:block" />
                <div className="flex gap-1">
                  <Skeleton className="h-7 w-7 rounded-md" />
                  <Skeleton className="h-7 w-7 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
