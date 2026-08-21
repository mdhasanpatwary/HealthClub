import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function RenewalLoading() {
  return (
    <div className="bg-muted/30 min-h-[85vh] py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl space-y-5">
        <Skeleton className="h-4 w-32 rounded-md" />
        <Card className="border border-border shadow-xl bg-background/80 backdrop-blur rounded-3xl animate-pulse">
          <CardHeader className="text-center space-y-3 pb-6 border-b border-border/60">
            <Skeleton className="h-8 w-32 mx-auto rounded-lg" />
            <Skeleton className="h-6 w-44 mx-auto rounded-md" />
            <Skeleton className="h-4 w-60 mx-auto rounded-md" />
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="bg-[#e2125d]/5 rounded-2xl p-5 border border-[#e2125d]/10 space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-lg" />
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-4 w-28 rounded-md" />
                  <Skeleton className="h-3 w-40 rounded-md" />
                </div>
              </div>
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-3.5 w-28 rounded-md" />
                <Skeleton className="h-11 w-full rounded-xl" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3.5 w-36 rounded-md" />
                <Skeleton className="h-11 w-full rounded-xl" />
              </div>
              <Skeleton className="h-11 w-full rounded-xl mt-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
