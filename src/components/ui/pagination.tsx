"use client";

import * as React from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn, toBanglaNums } from "@/lib/utils";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  itemLabel?: string;
  className?: string;
  disabled?: boolean;
  getPageUrl?: (page: number) => string;
}

export function Pagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  itemLabel,
  className,
  disabled = false,
  getPageUrl,
}: PaginationProps) {
  const safeTotalPages = Math.max(1, totalPages);
  const safeCurrentPage = Math.min(Math.max(1, currentPage), safeTotalPages);

  const startItem = totalItems === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1;
  const endItem = Math.min(safeCurrentPage * pageSize, totalItems);

  // Generate page numbers with ellipsis
  const getPageNumbers = (): (number | "ellipsis")[] => {
    if (safeTotalPages <= 7) {
      return Array.from({ length: safeTotalPages }, (_, i) => i + 1);
    }

    if (safeCurrentPage <= 4) {
      return [1, 2, 3, 4, 5, "ellipsis", safeTotalPages];
    }

    if (safeCurrentPage >= safeTotalPages - 3) {
      return [
        1,
        "ellipsis",
        safeTotalPages - 4,
        safeTotalPages - 3,
        safeTotalPages - 2,
        safeTotalPages - 1,
        safeTotalPages,
      ];
    }

    return [
      1,
      "ellipsis",
      safeCurrentPage - 1,
      safeCurrentPage,
      safeCurrentPage + 1,
      "ellipsis",
      safeTotalPages,
    ];
  };

  const pageNumbers = getPageNumbers();

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-border bg-card/50 text-xs sm:text-sm select-none",
        className
      )}
    >
      {/* Left: Summary text & Page Size Selector */}
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 w-full sm:w-auto text-muted-foreground">
        <div>
          <span>
            মোট{" "}
            <span className="font-semibold text-foreground">
              {toBanglaNums(totalItems)}
            </span>{" "}
            {itemLabel || "টি এন্ট্রি"} এর মধ্যে{" "}
            <span className="font-semibold text-foreground">
              {toBanglaNums(startItem)}
            </span>
            –
            <span className="font-semibold text-foreground">
              {toBanglaNums(endItem)}
            </span>{" "}
            দেখাচ্ছে
          </span>
        </div>

        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 pl-2 sm:border-l border-border">
            <span className="text-xs">প্রতি পেজে:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              disabled={disabled}
              aria-label="প্রতি পেজে"
              className="h-8 px-2 rounded-lg border border-border bg-background text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer disabled:opacity-50"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {toBanglaNums(opt)}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Right: Navigation Controls */}
      <div className="flex items-center justify-center gap-1 w-full sm:w-auto overflow-x-auto py-1">
        {/* First Page */}
        {safeCurrentPage <= 1 || disabled ? (
          <Button
            variant="outline"
            size="icon-xs"
            disabled
            aria-label="প্রথম পেজ"
            title="প্রথম পেজ"
            className="h-8 w-8 rounded-lg shrink-0 border-border text-muted-foreground opacity-40 cursor-not-allowed"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
        ) : getPageUrl ? (
          <Link
            href={getPageUrl(1)}
            onClick={() => onPageChange?.(1)}
            aria-label="প্রথম পেজ"
            title="প্রথম পেজ"
            className={cn(
              buttonVariants({ variant: "outline", size: "icon-xs" }),
              "h-8 w-8 rounded-lg shrink-0 border-border text-muted-foreground hover:text-foreground"
            )}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Link>
        ) : (
          <Button
            variant="outline"
            size="icon-xs"
            onClick={() => onPageChange?.(1)}
            aria-label="প্রথম পেজ"
            title="প্রথম পেজ"
            className="h-8 w-8 rounded-lg shrink-0 border-border text-muted-foreground hover:text-foreground"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
        )}

        {/* Previous Page */}
        {safeCurrentPage <= 1 || disabled ? (
          <Button
            variant="outline"
            size="icon-xs"
            disabled
            aria-label="পূর্ববর্তী পেজ"
            title="পূর্ববর্তী পেজ"
            className="h-8 w-8 rounded-lg shrink-0 border-border text-muted-foreground opacity-40 cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        ) : getPageUrl ? (
          <Link
            href={getPageUrl(safeCurrentPage - 1)}
            onClick={() => onPageChange?.(safeCurrentPage - 1)}
            aria-label="পূর্ববর্তী পেজ"
            title="পূর্ববর্তী পেজ"
            className={cn(
              buttonVariants({ variant: "outline", size: "icon-xs" }),
              "h-8 w-8 rounded-lg shrink-0 border-border text-muted-foreground hover:text-foreground"
            )}
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>
        ) : (
          <Button
            variant="outline"
            size="icon-xs"
            onClick={() => onPageChange?.(safeCurrentPage - 1)}
            aria-label="পূর্ববর্তী পেজ"
            title="পূর্ববর্তী পেজ"
            className="h-8 w-8 rounded-lg shrink-0 border-border text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}

        {/* Mobile Compact Page Indicator */}
        <div className="flex sm:hidden items-center px-2 font-medium text-xs text-foreground">
          <span>পেজ</span>&nbsp;
          <span className="font-bold text-primary">
            {toBanglaNums(safeCurrentPage)}
          </span>
          &nbsp;/&nbsp;
          <span>{toBanglaNums(safeTotalPages)}</span>
        </div>

        {/* Desktop Page Numbers */}
        <div className="hidden sm:flex items-center gap-1">
          {pageNumbers.map((page, idx) => {
            if (page === "ellipsis") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="h-8 w-8 flex items-center justify-center text-muted-foreground"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </span>
              );
            }

            const isActive = page === safeCurrentPage;

            if (getPageUrl && !disabled) {
              return (
                <Link
                  key={page}
                  href={getPageUrl(page)}
                  onClick={() => onPageChange?.(page)}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    buttonVariants({
                      variant: isActive ? "default" : "outline",
                      size: "icon-xs",
                    }),
                    "h-8 w-8 rounded-lg font-semibold text-xs transition-all",
                    isActive
                      ? "bg-primary text-white hover:bg-primary-dark font-bold shadow-xs"
                      : "border-border text-foreground hover:bg-muted"
                  )}
                >
                  {toBanglaNums(page)}
                </Link>
              );
            }

            return (
              <Button
                key={page}
                variant={isActive ? "default" : "outline"}
                size="icon-xs"
                onClick={() => onPageChange?.(page)}
                disabled={disabled}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "h-8 w-8 rounded-lg font-semibold text-xs transition-all",
                  isActive
                    ? "bg-primary text-white hover:bg-primary-dark font-bold shadow-xs"
                    : "border-border text-foreground hover:bg-muted",
                  disabled && "opacity-50 cursor-not-allowed"
                )}
              >
                {toBanglaNums(page)}
              </Button>
            );
          })}
        </div>

        {/* Next Page */}
        {safeCurrentPage >= safeTotalPages || disabled ? (
          <Button
            variant="outline"
            size="icon-xs"
            disabled
            aria-label="পরবর্তী পেজ"
            title="পরবর্তী পেজ"
            className="h-8 w-8 rounded-lg shrink-0 border-border text-muted-foreground opacity-40 cursor-not-allowed"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : getPageUrl ? (
          <Link
            href={getPageUrl(safeCurrentPage + 1)}
            onClick={() => onPageChange?.(safeCurrentPage + 1)}
            aria-label="পরবর্তী পেজ"
            title="পরবর্তী পেজ"
            className={cn(
              buttonVariants({ variant: "outline", size: "icon-xs" }),
              "h-8 w-8 rounded-lg shrink-0 border-border text-muted-foreground hover:text-foreground"
            )}
          >
            <ChevronRight className="h-4 w-4" />
          </Link>
        ) : (
          <Button
            variant="outline"
            size="icon-xs"
            onClick={() => onPageChange?.(safeCurrentPage + 1)}
            aria-label="পরবর্তী পেজ"
            title="পরবর্তী পেজ"
            className="h-8 w-8 rounded-lg shrink-0 border-border text-muted-foreground hover:text-foreground"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}

        {/* Last Page */}
        {safeCurrentPage >= safeTotalPages || disabled ? (
          <Button
            variant="outline"
            size="icon-xs"
            disabled
            aria-label="শেষ পেজ"
            title="শেষ পেজ"
            className="h-8 w-8 rounded-lg shrink-0 border-border text-muted-foreground opacity-40 cursor-not-allowed"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        ) : getPageUrl ? (
          <Link
            href={getPageUrl(safeTotalPages)}
            onClick={() => onPageChange?.(safeTotalPages)}
            aria-label="শেষ পেজ"
            title="শেষ পেজ"
            className={cn(
              buttonVariants({ variant: "outline", size: "icon-xs" }),
              "h-8 w-8 rounded-lg shrink-0 border-border text-muted-foreground hover:text-foreground"
            )}
          >
            <ChevronsRight className="h-4 w-4" />
          </Link>
        ) : (
          <Button
            variant="outline"
            size="icon-xs"
            onClick={() => onPageChange?.(safeTotalPages)}
            aria-label="শেষ পেজ"
            title="শেষ পেজ"
            className="h-8 w-8 rounded-lg shrink-0 border-border text-muted-foreground hover:text-foreground"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
