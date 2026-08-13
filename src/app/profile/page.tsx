"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function ProfilePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard?tab=profile");
  }, [router]);

  return (
    <div className="bg-muted/30 min-h-[85vh] py-8 sm:py-12 animate-pulse">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center">
          <Skeleton className="h-5 w-32" />
        </div>
        <Card className="border-border shadow-lg bg-background/80 backdrop-blur">
          <CardHeader className="border-b border-border pb-6">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Skeleton className="h-20 w-20 rounded-2xl shrink-0" />
              <div className="space-y-2 w-full max-w-[200px]">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 sm:p-8 space-y-6">
            <div className="space-y-4">
              <Skeleton className="h-11 w-full rounded-md" />
              <Skeleton className="h-11 w-full rounded-md" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
