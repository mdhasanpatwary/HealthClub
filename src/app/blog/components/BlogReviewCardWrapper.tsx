import { ReactNode } from "react";
import { toBanglaNums } from "@/lib/utils";

interface BlogReviewCardWrapperProps {
  sectionId: string;
  rank: number;
  partnerStatus?: boolean;
  locale?: string;
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
  locale = "bn",
  children,
  className = "",
  wrapperClassName = "",
  contentPadding = "p-5 sm:p-7",
  contentSpacing = "space-y-6",
}: BlogReviewCardWrapperProps) {
  const isEn = locale === "en";

  return (
    <div id={sectionId} className={`scroll-mt-24 space-y-2.5 ${wrapperClassName}`}>
      {/* Serial Number Badge Above Card */}
      <div className="flex items-center gap-2 px-1">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary text-primary-foreground font-heading text-xs sm:text-sm font-bold shadow-xs">
          <span>{isEn ? `Serial #${rank}` : `ক্রমিক নং ${toBanglaNums(rank)}`}</span>
        </span>
      </div>

      <article
        className={`rounded-2xl border transition-all duration-300 ${contentPadding} ${contentSpacing} ${
          partnerStatus
            ? "border-primary/40 bg-card shadow-md shadow-primary/5 ring-1 ring-primary/20"
            : "border-border/80 bg-card shadow-xs"
        } ${className}`}
      >
        {children}
      </article>
    </div>
  );
}
