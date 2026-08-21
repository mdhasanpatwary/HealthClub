import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AdminMessagesLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <Card className="border-border shadow-md">
        <CardHeader>
          <div className="space-y-2">
            <Skeleton className="h-6 w-48 rounded-md" />
            <Skeleton className="h-4 w-72 rounded-md" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-4 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-border">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-24 hidden sm:block" />
              <Skeleton className="h-4 w-48 flex-1 mx-4" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-12" />
            </div>
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 border-b border-border/50 last:border-0 gap-4"
              >
                <div className="space-y-1 w-44">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-36 font-mono" />
                </div>
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-3 w-3/5" />
                </div>
                <Skeleton className="h-3.5 w-24 hidden sm:block" />
                <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
