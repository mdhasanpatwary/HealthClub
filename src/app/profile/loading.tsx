import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function ProfileLoading() {
  return (
    <div className="bg-muted/30 min-h-[85vh] py-8 sm:py-12 animate-pulse">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center">
          <Skeleton className="h-5 w-32" />
        </div>
        <Card className="border-border shadow-lg bg-background/80 backdrop-blur rounded-3xl">
          <CardHeader className="border-b border-border pb-6">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Skeleton className="h-20 w-20 rounded-2xl shrink-0" />
              <div className="space-y-2 w-full max-w-[200px]">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 sm:p-8 space-y-6">
            <div className="bg-muted/40 p-4 rounded-xl border border-border flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton className="h-10 w-24 rounded-lg" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-11 w-full rounded-md" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-11 w-full rounded-md" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-11 w-full rounded-md" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-11 w-full rounded-md" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-11 w-full rounded-md" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-11 w-full rounded-md" />
              </div>
            </div>
            <div className="pt-4 border-t border-border">
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
