import { Skeleton } from "@/components/ui/skeleton";

export default function PrivacyPolicyLoading() {
  return (
    <div className="bg-background min-h-screen py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="border-b border-border pb-4 space-y-2">
          <Skeleton className="h-9 sm:h-12 w-64 rounded-xl" />
          <Skeleton className="h-4 w-32" />
        </div>

        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
        </div>

        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-4 pt-4">
            <Skeleton className="h-6 w-48 rounded-lg" />
            <Skeleton className="h-4 w-full" />
            <div className="pl-6 space-y-2">
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
