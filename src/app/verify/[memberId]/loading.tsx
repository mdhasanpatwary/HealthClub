import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function VerificationLoading() {
  return (
    <div className="bg-muted/30 min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md border border-border shadow-2xl bg-background/90 backdrop-blur text-center overflow-hidden animate-pulse">
        <div className="bg-muted/30 py-6 border-b border-border/80 space-y-3">
          <Skeleton className="h-16 w-16 rounded-full mx-auto" />
          <Skeleton className="h-6 w-48 mx-auto" />
          <Skeleton className="h-3.5 w-32 mx-auto" />
        </div>
        <CardContent className="p-6 md:p-8 space-y-6">
          <div className="space-y-4 text-left bg-muted/40 p-4 rounded-2xl border border-border">
            <div className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-5 w-40" />
            </div>
            <div className="grid grid-cols-2 gap-4 border-t border-border/80 pt-3">
              <div className="space-y-2">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-4 w-28" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 border-t border-border/80 pt-3">
              <div className="space-y-2">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-5 w-24 rounded-full" />
              </div>
            </div>
          </div>
          <div className="pt-2">
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
