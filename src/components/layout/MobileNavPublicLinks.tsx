"use client";

import Link from "next/link";
import { Siren, Calculator, BookOpen, Newspaper } from "lucide-react";

interface MobileNavPublicLinksProps {
  pathname: string;
  onClose: () => void;
}

export function MobileNavPublicLinks({
  pathname,
  onClose,
}: MobileNavPublicLinksProps) {
  const isActive = (path: string) => {
    if (path === "/") return pathname === path;
    return pathname.startsWith(path);
  };

  return (
    <div className="space-y-5">
      {/* Main Links */}
      <div className="space-y-1">
        {[
          { name: "হোম", path: "/" },
          { name: "ডাক্তার ও কনসালট্যান্টস", path: "/consultants" },
          { name: "পার্টনার হাসপাতাল", path: "/partner-hospitals" },
          { name: "মেম্বারশিপ প্ল্যান", path: "/membership" },
        ].map((link) => (
          <Link
            key={link.path}
            href={link.path}
            prefetch={false}
            onClick={onClose}
            className={`flex items-center rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors ${
              isActive(link.path)
                ? "bg-primary/10 text-primary font-bold"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>

      {/* Services Group */}
      <div className="space-y-2">
        <div className="px-3.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          সেবাসমূহ
        </div>
        <div className="grid grid-cols-1 gap-1.5">
          <Link
            href="/emergency"
            prefetch={false}
            onClick={onClose}
            className="flex items-center gap-3 p-2.5 rounded-xl bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs font-bold"
          >
            <div className="h-7 w-7 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0">
              <Siren className="h-4 w-4" />
            </div>
            <span>জরুরি সেবা (রক্তদাতা ও অ্যাম্বুলেন্স)</span>
          </Link>

          <Link
            href="/health-tools"
            prefetch={false}
            onClick={onClose}
            className="flex items-center gap-3 p-2.5 rounded-xl bg-cyan-500/5 hover:bg-cyan-500/10 border border-cyan-500/20 text-cyan-700 dark:text-cyan-300 text-xs font-bold"
          >
            <div className="h-7 w-7 rounded-lg bg-cyan-500/10 text-cyan-600 flex items-center justify-center shrink-0">
              <Calculator className="h-4 w-4" />
            </div>
            <span>হেলথ টুলস (বিএমআই ও ক্যালোরি)</span>
          </Link>

          <Link
            href="/health-tips"
            prefetch={false}
            onClick={onClose}
            className="flex items-center gap-3 p-2.5 rounded-xl bg-primary/5 hover:bg-primary/10 border border-primary/20 text-primary text-xs font-bold"
          >
            <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <BookOpen className="h-4 w-4" />
            </div>
            <span>স্বাস্থ্য টিপস (ডাক্তারের পরামর্শ ও টিপস)</span>
          </Link>

          <Link
            href="/blog"
            prefetch={false}
            onClick={onClose}
            className="flex items-center gap-3 p-2.5 rounded-xl bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold"
          >
            <div className="h-7 w-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <Newspaper className="h-4 w-4" />
            </div>
            <span>স্বাস্থ্য ব্লগ ও গাইড (হাসপাতাল রিভিউ ও তালিকা)</span>
          </Link>
        </div>
      </div>

      {/* Company Links */}
      <div className="space-y-1 pt-1 border-t border-border/60">
        {[
          { name: "আমাদের সম্পর্কে", path: "/about-us" },
          { name: "যোগাযোগ", path: "/contact" },
        ].map((link) => (
          <Link
            key={link.path}
            href={link.path}
            prefetch={false}
            onClick={onClose}
            className={`flex items-center rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-colors ${
              isActive(link.path)
                ? "bg-primary/10 text-primary font-bold"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
