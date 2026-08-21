import { Skeleton } from "@/components/ui/skeleton";

export default function PrintCardLoading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6">
      <div className="space-y-4 w-full max-w-md">
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-[240px] w-full rounded-2xl" />
      </div>
    </div>
  );
}
