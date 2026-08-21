import { Skeleton } from "@/components/ui/skeleton";

export default function AdminPwaLoading() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="space-y-2">
          <Skeleton className="h-4 w-36 rounded-md" />
          <Skeleton className="h-8 w-56 rounded-md" />
          <Skeleton className="h-4 w-80 rounded-md" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-36 rounded-md" />
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-64 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-96 rounded-2xl" />
    </div>
  );
}
