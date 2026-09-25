"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft, LayoutDashboard } from "lucide-react";
import { BroadcastTab } from "../components/BroadcastTab";

export default function AdminBroadcastPage() {
  return (
    <div className="space-y-6">
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
            ব্রডকাস্ট ক্যাম্পেইন
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

      {/* Main Broadcast Tab Manager */}
      <BroadcastTab />
    </div>
  );
}
