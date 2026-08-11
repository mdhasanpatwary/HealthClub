import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function ResetPasswordLoading() {
  return (
    <div className="bg-muted/30 min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md border border-border shadow-xl bg-background/80 backdrop-blur rounded-3xl animate-pulse">
        <CardHeader className="text-center space-y-3 pb-6">
          <Skeleton className="h-8 w-32 mx-auto rounded-lg" />
          <Skeleton className="h-6 w-44 mx-auto" />
          <Skeleton className="h-4 w-60 mx-auto" />
        </CardHeader>
        <CardContent className="p-6 sm:p-8 space-y-5">
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-36" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-36" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
          <Skeleton className="h-11 w-full rounded-xl mt-4" />
          <div className="text-center border-t border-border pt-4">
            <Skeleton className="h-4 w-36 mx-auto" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
