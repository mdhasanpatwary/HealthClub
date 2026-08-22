import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function ArticleDetailLoading() {
  return (
    <div className="bg-background min-h-screen pb-16">
      {/* Header Container Skeleton */}
      <div className="border-b border-border/60 bg-muted/20 py-6 sm:py-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-4">
          <Skeleton className="h-4 w-32 rounded-md" />
          <div className="flex items-center gap-3 pt-1">
            <Skeleton className="h-6 w-24 rounded-md" />
            <Skeleton className="h-4 w-20 rounded-md" />
            <Skeleton className="h-4 w-24 rounded-md" />
          </div>
          <Skeleton className="h-8 sm:h-12 w-4/5 rounded-xl" />
          <div className="flex items-center gap-3 pt-2">
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-32 rounded-md" />
              <Skeleton className="h-3 w-40 rounded-md" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area Skeleton */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Key Takeaways Box Skeleton */}
        <div className="p-5 sm:p-6 rounded-3xl bg-primary/5 border border-primary/20 space-y-3">
          <Skeleton className="h-5 w-48 rounded-md" />
          <div className="space-y-2 pt-2">
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-5/6 rounded-md" />
            <Skeleton className="h-4 w-4/5 rounded-md" />
          </div>
        </div>

        {/* Article Body Blocks Skeleton */}
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="p-5 sm:p-6 rounded-2xl bg-card border border-border/70 shadow-xs space-y-3"
            >
              <Skeleton className="h-5 w-1/3 rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-3/4 rounded-md" />
            </div>
          ))}
        </div>

        {/* Share Bar Skeleton */}
        <div className="pt-4 border-t border-border/80 flex items-center justify-between">
          <Skeleton className="h-5 w-32 rounded-md" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
        </div>

        {/* Related Articles Skeleton */}
        <div className="space-y-4 pt-4 border-t border-border/80">
          <Skeleton className="h-6 w-44 rounded-md" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <Card key={i} className="border border-border/80 bg-card rounded-2xl p-4 space-y-2.5">
                <Skeleton className="h-4 w-20 rounded-md" />
                <Skeleton className="h-4 w-4/5 rounded-md" />
                <Skeleton className="h-3 w-full rounded-md" />
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
