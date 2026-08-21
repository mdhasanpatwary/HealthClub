import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AdminDoctorsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <Card className="border-border shadow-md">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48 rounded-md" />
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
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-28 hidden sm:block" />
              <Skeleton className="h-4 w-24 hidden md:block" />
              <Skeleton className="h-4 w-16" />
            </div>
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 border-b border-border/50 last:border-0 gap-4"
              >
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-28" />
                </div>
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-4 w-32 hidden sm:block" />
                <Skeleton className="h-4 w-24 hidden md:block" />
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
