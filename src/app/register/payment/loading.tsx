import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function PaymentLoading() {
  return (
    <div className="bg-muted/30 min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md border border-border shadow-xl bg-background/80 backdrop-blur overflow-hidden rounded-3xl animate-pulse">
        {/* Header */}
        <div className="bg-[#e2125d] p-6 text-center space-y-2">
          <Skeleton className="h-12 w-12 rounded-full mx-auto bg-white/20" />
          <Skeleton className="h-6 w-48 mx-auto bg-white/30" />
          <Skeleton className="h-3.5 w-36 mx-auto bg-white/20" />
        </div>

        <CardContent className="p-6 space-y-6">
          {/* Steps Card */}
          <div className="bg-[#e2125d]/5 border border-[#e2125d]/20 rounded-2xl p-4 space-y-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-full" />
            <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-border p-2.5 rounded-xl">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-7 w-16 rounded-lg" />
            </div>
            <div className="flex justify-between pt-1">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <Skeleton className="h-4 w-36 border-b border-border pb-1" />
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-36" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            <Skeleton className="h-11 w-full rounded-xl mt-4" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
