import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function PartnerHospitalsLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">

        {/* Page title */}
        <div className="text-center space-y-3 mb-8">
          <Skeleton className="h-4 w-24 mx-auto rounded-full" />
          <Skeleton className="h-10 w-64 mx-auto" />
          <Skeleton className="h-4 w-80 mx-auto" />
        </div>

        {/* Search & filter row */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
          <Skeleton className="h-10 w-full md:max-w-md rounded-lg" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-20 rounded-full" />
            ))}
          </div>
        </div>

        {/* Partner cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-0 gap-0 border-border bg-background/50 overflow-hidden rounded-2xl">
              <Skeleton className="h-52 sm:h-56 w-full rounded-none" />
              <div className="p-4 flex items-center justify-between border-t border-border">
                <div className="space-y-1">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <Skeleton className="h-8 w-8 rounded-lg" />
                </div>
              </div>
            </Card>
          ))}
        </div>

      </div>
    </div>
  );
}
