import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted-foreground/15 dark:bg-slate-800/80",
        className
      )}
      {...props}
    />
  );
}

/**
 * Reusable skeleton for page headers (badge + title + subtitle)
 */
function PageHeaderSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("text-center space-y-3 max-w-2xl mx-auto py-2", className)}>
      <Skeleton className="h-4 w-28 mx-auto rounded-full" />
      <Skeleton className="h-9 sm:h-12 w-3/4 sm:w-2/3 mx-auto rounded-xl" />
      <Skeleton className="h-4 w-5/6 sm:w-1/2 mx-auto rounded-md" />
    </div>
  );
}

/**
 * Reusable skeleton for partner cards matching PartnerDirectory layout
 */
function PartnerCardSkeleton() {
  return (
    <Card className="p-0 gap-0 overflow-hidden border-border bg-background dark:bg-slate-900 group flex flex-col justify-between rounded-2xl border">
      <div className="relative h-52 sm:h-56 w-full bg-slate-900/10 dark:bg-slate-900 overflow-hidden flex flex-col justify-between p-4">
        <div className="flex justify-end">
          <Skeleton className="h-6 w-24 rounded-full bg-slate-200/50 dark:bg-slate-800" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-5 w-3/4 bg-slate-200/70 dark:bg-slate-800" />
          <Skeleton className="h-3.5 w-1/2 bg-slate-200/60 dark:bg-slate-800" />
        </div>
      </div>
      <div className="p-3.5 sm:p-4 bg-background dark:bg-slate-900 flex items-center justify-between gap-2 border-t border-border/60">
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
  );
}

/**
 * Reusable skeleton for digital membership card
 */
function MemberCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn("p-6 border-border/80 bg-background/90 rounded-3xl space-y-6 shadow-md", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <Skeleton className="h-7 w-20 rounded-full" />
      </div>
      <div className="space-y-2 py-4">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-7 w-48 font-mono" />
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-border/40">
        <div className="space-y-1">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-12 w-12 rounded-lg" />
      </div>
    </Card>
  );
}

/**
 * Reusable skeleton for metrics / stats grid
 */
function StatsGridSkeleton({ count = 4, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("grid grid-cols-2 sm:grid-cols-4 gap-4", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="border-border bg-background/60 dark:bg-slate-900/60">
          <CardContent className="p-4 sm:p-5 space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
            <Skeleton className="h-7 w-24" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/**
 * Reusable skeleton for auth/simple form cards
 */
function FormCardSkeleton({
  title,
  fields = 3,
  className,
}: {
  title?: boolean;
  fields?: number;
  className?: string;
}) {
  return (
    <Card className={cn("w-full max-w-md border border-border shadow-xl bg-background/80 backdrop-blur rounded-3xl", className)}>
      <CardHeader className="text-center space-y-3 pb-6">
        <Skeleton className="h-12 w-12 rounded-2xl mx-auto" />
        {title !== false && <Skeleton className="h-6 w-48 mx-auto" />}
        <Skeleton className="h-4 w-64 mx-auto" />
      </CardHeader>
      <CardContent className="p-6 sm:p-8 space-y-5">
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
        ))}
        <Skeleton className="h-11 w-full rounded-xl mt-4" />
      </CardContent>
    </Card>
  );
}

export {
  Skeleton,
  PageHeaderSkeleton,
  PartnerCardSkeleton,
  MemberCardSkeleton,
  StatsGridSkeleton,
  FormCardSkeleton,
};

