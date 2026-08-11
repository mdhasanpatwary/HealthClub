import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function LoginLoading() {
  return (
    <div className="relative min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-light/40 via-emerald-50/20 to-background dark:from-slate-950 dark:via-slate-900 dark:to-background">
      <div className="w-full max-w-md">
        <Card className="p-8 sm:p-10 border border-border/60 bg-background/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl shadow-2xl space-y-6">
          <div className="text-center space-y-3">
            <Skeleton className="h-10 w-36 mx-auto rounded-xl" />
            <Skeleton className="h-6 w-48 mx-auto" />
            <Skeleton className="h-4 w-64 mx-auto" />
          </div>

          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-32" />
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-20" />
              <Skeleton className="h-11 w-full rounded-xl" />
              <div className="flex justify-end">
                <Skeleton className="h-3.5 w-28" />
              </div>
            </div>
            <Skeleton className="h-11 w-full rounded-xl mt-2" />
          </div>

          <div className="border-t border-border/60 pt-5 text-center">
            <Skeleton className="h-4 w-48 mx-auto" />
          </div>
        </Card>
      </div>
    </div>
  );
}
