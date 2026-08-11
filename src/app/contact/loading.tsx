import { Skeleton, PageHeaderSkeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function ContactLoading() {
  return (
    <div className="bg-background min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <PageHeaderSkeleton />

        {/* Contact Form Wrapper */}
        <div className="bg-muted/30 border border-border/80 rounded-3xl p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Info items */}
            <div className="space-y-6">
              <Skeleton className="h-6 w-36" />
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="p-4 border border-border/60 bg-background/50 flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
                    <div className="space-y-1.5 w-full">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Form */}
            <Card className="border border-border/60 bg-background/80 shadow-md">
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-24 w-full rounded-md" />
                </div>
                <Skeleton className="h-11 w-full rounded-xl mt-4" />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Help Center CTA */}
        <div className="max-w-2xl mx-auto text-center space-y-3 pt-6">
          <Skeleton className="h-5 w-48 mx-auto" />
          <Skeleton className="h-4 w-2/3 mx-auto" />
          <Skeleton className="h-10 w-36 mx-auto rounded-lg mt-2" />
        </div>
      </div>
    </div>
  );
}
