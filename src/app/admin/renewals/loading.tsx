import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AdminRenewalsLoading() {
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
              <Skeleton className="h-4 w-20 font-mono" />
              <Skeleton className="h-4 w-24 hidden sm:block font-mono" />
              <Skeleton className="h-4 w-28 hidden md:block font-mono" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-28" />
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 border-b border-border/50 last:border-0 gap-4"
              >
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-20 font-mono" />
                <Skeleton className="h-3.5 w-24 font-mono hidden sm:block" />
                <Skeleton className="h-3.5 w-28 font-mono hidden md:block" />
                <Skeleton className="h-3.5 w-24" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-16 rounded-lg" />
                  <Skeleton className="h-8 w-16 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
