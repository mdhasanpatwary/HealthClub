"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft, LayoutDashboard, UploadCloud } from "lucide-react";
import { BulkImportManager } from "../components/BulkImportManager";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AdminBulkImportPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link
            href="/admin"
            className="hover:text-primary transition-colors flex items-center gap-1 font-medium"
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            <span>ড্যাশবোর্ড</span>
          </Link>
          <span>/</span>
          <span className="text-foreground font-semibold">
            বাল্ক ডেটা ইম্পোর্ট
          </span>
        </div>

        <Link
          href="/admin"
          className={buttonVariants({
            variant: "outline",
            size: "sm",
            className: "h-8 text-xs gap-1.5 border-border rounded-xl cursor-pointer",
          })}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>ড্যাশবোর্ডে ফিরে যান</span>
        </Link>
      </div>

      {/* Hero Header Card */}
      <Card className="border-border bg-gradient-to-r from-primary/5 via-card to-background shadow-xs">
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-xs">
                <UploadCloud className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="font-heading text-lg sm:text-xl font-bold text-foreground">
                  বাল্ক ডেটা ইম্পোর্টার (Excel ও CSV)
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm mt-0.5">
                  বিশেষজ্ঞ ডাক্তার, পার্টনার হাসপাতাল, রক্তদাতা ও অ্যাম্বুলেন্স সার্ভিস এক ক্লিকে ব্যাচ ইম্পোর্ট করুন।
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Bulk Importer Manager */}
      <BulkImportManager />
    </div>
  );
}
