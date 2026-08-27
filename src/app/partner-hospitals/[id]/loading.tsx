import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function PartnerHospitalDetailLoading() {
  return (
    <div className="bg-background min-h-screen py-6 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 animate-pulse">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-9 w-32 rounded-xl" />
          <Skeleton className="h-9 w-24 rounded-xl" />
        </div>

        {/* Hero Card */}
        <div className="rounded-3xl border border-border/80 bg-card overflow-hidden shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 sm:p-8 items-center">
            {/* Image Placeholder */}
            <div className="lg:col-span-4 flex justify-center">
              <Skeleton className="h-48 sm:h-56 w-full max-w-sm rounded-2xl" />
            </div>

            {/* Content info */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Skeleton className="h-6 w-28 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-32 rounded-full" />
              </div>
              <Skeleton className="h-8 sm:h-10 w-3/4 rounded-xl" />
              <Skeleton className="h-4 w-5/6 rounded-md" />
              <Skeleton className="h-4 w-2/3 rounded-md" />

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <Skeleton className="h-11 w-40 rounded-xl" />
                <Skeleton className="h-11 w-32 rounded-xl" />
                <Skeleton className="h-11 w-32 rounded-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Discount Highlights Banner */}
        <Card className="border-border/80 bg-emerald-500/5 p-6 rounded-2xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-2 w-full sm:w-2/3 text-center sm:text-left">
              <Skeleton className="h-6 w-48 mx-auto sm:mx-0" />
              <Skeleton className="h-4 w-full" />
            </div>
            <Skeleton className="h-12 w-36 rounded-xl shrink-0" />
          </div>
        </Card>

        {/* Tabs Bar */}
        <div className="flex gap-2 border-b border-border pb-4 overflow-x-auto">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-28 rounded-xl shrink-0" />
          ))}
        </div>

        {/* Content Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="border-border shadow-sm bg-card p-5 space-y-3 rounded-2xl">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <div className="pt-2 border-t border-border/50 flex justify-between items-center">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-12" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
