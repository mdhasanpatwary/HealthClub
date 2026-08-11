import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function RegisterLoading() {
  return (
    <div className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-light/40 via-emerald-50/20 to-background dark:from-slate-950 dark:via-slate-900 dark:to-background">
      <Card className="relative bg-background/90 dark:bg-slate-900/90 backdrop-blur-xl border border-border/60 rounded-3xl shadow-2xl overflow-hidden w-full max-w-xl p-8 sm:p-10 space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <Skeleton className="h-10 w-36 mx-auto rounded-xl" />
          <Skeleton className="h-6 w-52 mx-auto" />
          <Skeleton className="h-4 w-72 mx-auto" />
        </div>

        {/* Plan pills */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 border-2 border-border/60 space-y-2">
            <Skeleton className="h-5 w-5 rounded-md" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-24" />
          </Card>
          <Card className="p-4 border-2 border-border/60 space-y-2">
            <Skeleton className="h-5 w-5 rounded-md" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-24" />
          </Card>
        </div>

        {/* Image upload box */}
        <div className="border border-border/60 rounded-2xl p-4 flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-2xl shrink-0" />
          <div className="space-y-1.5 w-full">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-8 w-32 rounded-lg" />
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-20" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-20" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
          <Skeleton className="h-11 w-full rounded-xl mt-4" />
        </div>
      </Card>
    </div>
  );
}
