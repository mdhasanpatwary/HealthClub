import { Skeleton, PageHeaderSkeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function BecomePartnerLoading() {
  return (
    <div className="bg-background min-h-screen py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <PageHeaderSkeleton />

        {/* Content Layout */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-stretch">
          {/* Left column (2 cols) */}
          <div className="md:col-span-2 space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <Skeleton className="h-6 w-44 rounded-md" />
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <Skeleton className="h-6 w-6 rounded-full shrink-0 mt-0.5" />
                    <div className="space-y-1.5 w-full">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-5/6" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Card className="p-4 rounded-2xl border-border bg-muted/50 space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-36" />
              <Skeleton className="h-4 w-32" />
            </Card>
          </div>

          {/* Right form card (3 cols) */}
          <Card className="md:col-span-3 border border-border bg-background/80 shadow-lg rounded-3xl">
            <CardContent className="p-6 sm:p-8 space-y-4">
              <Skeleton className="h-6 w-48 mb-2" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              </div>
              <Skeleton className="h-11 w-full rounded-xl mt-4" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
