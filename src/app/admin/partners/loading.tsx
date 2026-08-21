import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AdminPartnersLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <Card className="border-border shadow-md">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-52 rounded-md" />
            <Skeleton className="h-4 w-72 rounded-md" />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Skeleton className="h-9 w-48 rounded-md flex-1 sm:flex-none" />
            <Skeleton className="h-9 w-24 rounded-md" />
            <Skeleton className="h-9 w-28 rounded-md" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-4 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-border">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-40 hidden sm:block" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-24 hidden md:block" />
              <Skeleton className="h-4 w-16" />
            </div>
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 border-b border-border/50 last:border-0 gap-4"
              >
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3.5 w-44 hidden sm:block" />
                <Skeleton className="h-4 w-12 font-bold" />
                <Skeleton className="h-3.5 w-24 font-mono hidden md:block" />
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
