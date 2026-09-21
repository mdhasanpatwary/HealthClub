import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function DoctorProfileLoading() {
  return (
    <div className="bg-background min-h-screen py-6 sm:py-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 animate-pulse">
        {/* Top Breadcrumb & Back Link */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-28 rounded-xl" />
            <Skeleton className="h-4 w-32 hidden sm:block" />
          </div>
          <Skeleton className="h-9 w-24 rounded-xl" />
        </div>

        {/* Doctor Main Profile Card */}
        <Card className="border border-border/80 shadow-md overflow-hidden rounded-3xl bg-card">
          <div className="p-6 sm:p-8 space-y-6 sm:space-y-8">
            {/* Header with Avatar & Basic Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 text-center sm:text-left">
              <Skeleton className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl shrink-0" />
              <div className="space-y-3 flex-1 w-full">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <Skeleton className="h-6 w-28 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <Skeleton className="h-8 w-64 mx-auto sm:mx-0" />
                <Skeleton className="h-4 w-5/6 mx-auto sm:mx-0" />
                <Skeleton className="h-4 w-2/3 mx-auto sm:mx-0" />
              </div>
            </div>

            {/* Chamber & Schedule Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-4 border-t border-border/60">
              {/* Chamber Details */}
              <div className="p-4 sm:p-5 rounded-2xl bg-muted/40 border border-border/50 space-y-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5 rounded-md" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
                <div className="pt-2">
                  <Skeleton className="h-9 w-32 rounded-lg" />
                </div>
              </div>

              {/* Visiting Schedule */}
              <div className="p-4 sm:p-5 rounded-2xl bg-muted/40 border border-border/50 space-y-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5 rounded-md" />
                  <Skeleton className="h-5 w-36" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
                <div className="flex gap-2 pt-2">
                  <Skeleton className="h-8 w-20 rounded-lg" />
                  <Skeleton className="h-8 w-24 rounded-lg" />
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Skeleton className="h-12 flex-1 rounded-xl" />
              <Skeleton className="h-12 flex-1 sm:max-w-xs rounded-xl" />
            </div>
          </div>
        </Card>

        {/* Clinical Focus / Details */}
        <Card className="border border-border/80 rounded-3xl p-6 sm:p-8 space-y-4 bg-card">
          <Skeleton className="h-6 w-44" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </Card>

        {/* Related Doctors Grid */}
        <div className="space-y-4 pt-4">
          <Skeleton className="h-6 w-48" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="rounded-2xl border-border/80 p-4 space-y-3 bg-card">
                <div className="flex gap-3">
                  <Skeleton className="h-14 w-14 rounded-2xl shrink-0" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
                <Skeleton className="h-10 w-full rounded-xl" />
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
