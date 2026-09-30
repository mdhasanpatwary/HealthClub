import { ReactNode } from "react";
import { toBanglaNums } from "@/lib/utils";

interface BlogReviewCardWrapperProps {
  sectionId: string;
  rank: number;
  partnerStatus?: boolean;
  children: ReactNode;
  className?: string;
  wrapperClassName?: string;
  contentPadding?: string;
  contentSpacing?: string;
}

export function BlogReviewCardWrapper({
  sectionId,
  rank,
  partnerStatus,
  children,
  className = "",
  wrapperClassName = "",
  contentPadding = "p-0 sm:p-7",
  contentSpacing = "space-y-6",
}: BlogReviewCardWrapperProps) {
  return (
    <div id={sectionId} className={`scroll-mt-24 space-y-2.5 ${wrapperClassName}`}>
      {/* Serial Number Badge Above Card */}
      <div className="flex items-center gap-2 px-0 sm:px-1">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary text-primary-foreground font-heading text-xs sm:text-sm font-bold shadow-xs">
          <span>{`ক্রমিক নং ${toBanglaNums(rank)}`}</span>
        </span>
      </div>

      <article
        className={`rounded-none sm:rounded-2xl border-0 sm:border transition-all duration-300 ${contentPadding} ${contentSpacing} ${
          partnerStatus
            ? "sm:border-primary/40 bg-transparent sm:bg-card shadow-none sm:shadow-md sm:shadow-primary/5 ring-0 sm:ring-1 sm:ring-primary/20"
            : "sm:border-border/80 bg-transparent sm:bg-card shadow-none sm:shadow-xs"
        } ${className}`}
      >
        {children}
      </article>
    </div>
  );
}
