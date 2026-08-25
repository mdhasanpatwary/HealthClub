"use client";

import * as React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatNum, Locale } from "@/lib/i18n";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  locale?: Locale;
  t?: (key: string) => string;
  itemLabel?: string;
  className?: string;
  disabled?: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  locale: propLocale,
  t: propT,
  itemLabel,
  className,
  disabled = false,
}: PaginationProps) {
  const lang = useLanguage();
  const locale = propLocale || lang.locale || "bn";
  const t = propT || lang.t;

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

  const isEn = locale === "en";

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
          {isEn ? (
            <span>
              Showing{" "}
              <span className="font-semibold text-foreground">
                {formatNum(startItem, locale)}
              </span>
              {" – "}
              <span className="font-semibold text-foreground">
                {formatNum(endItem, locale)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-foreground">
                {formatNum(totalItems, locale)}
              </span>{" "}
              {itemLabel || t("admin.pagination.entries")}
            </span>
          ) : (
            <span>
              মোট{" "}
              <span className="font-semibold text-foreground">
                {formatNum(totalItems, locale)}
              </span>{" "}
              {itemLabel || "টি এন্ট্রি"} এর মধ্যে{" "}
              <span className="font-semibold text-foreground">
                {formatNum(startItem, locale)}
              </span>
              –
              <span className="font-semibold text-foreground">
                {formatNum(endItem, locale)}
              </span>{" "}
              প্রদর্শিত
            </span>
          )}
        </div>

        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 pl-2 sm:border-l border-border">
            <span className="text-xs">{t("admin.pagination.perPage")}:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              disabled={disabled}
              aria-label={t("admin.pagination.perPage")}
              className="h-8 px-2 rounded-lg border border-border bg-background text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer disabled:opacity-50"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {formatNum(opt, locale)}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Right: Navigation Controls */}
      <div className="flex items-center justify-center gap-1 w-full sm:w-auto overflow-x-auto py-1">
        {/* First Page */}
        <Button
          variant="outline"
          size="icon-xs"
          onClick={() => onPageChange(1)}
          disabled={disabled || safeCurrentPage <= 1}
          aria-label={t("admin.pagination.first")}
          title={t("admin.pagination.first")}
          className="h-8 w-8 rounded-lg shrink-0 border-border text-muted-foreground hover:text-foreground disabled:opacity-40"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>

        {/* Previous Page */}
        <Button
          variant="outline"
          size="icon-xs"
          onClick={() => onPageChange(safeCurrentPage - 1)}
          disabled={disabled || safeCurrentPage <= 1}
          aria-label={t("admin.pagination.prev")}
          title={t("admin.pagination.prev")}
          className="h-8 w-8 rounded-lg shrink-0 border-border text-muted-foreground hover:text-foreground disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Mobile Compact Page Indicator */}
        <div className="flex sm:hidden items-center px-2 font-medium text-xs text-foreground">
          <span>{t("admin.pagination.page")}</span>&nbsp;
          <span className="font-bold text-primary">
            {formatNum(safeCurrentPage, locale)}
          </span>
          &nbsp;/&nbsp;
          <span>{formatNum(safeTotalPages, locale)}</span>
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
            return (
              <Button
                key={page}
                variant={isActive ? "default" : "outline"}
                size="icon-xs"
                onClick={() => onPageChange(page)}
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
                {formatNum(page, locale)}
              </Button>
            );
          })}
        </div>

        {/* Next Page */}
        <Button
          variant="outline"
          size="icon-xs"
          onClick={() => onPageChange(safeCurrentPage + 1)}
          disabled={disabled || safeCurrentPage >= safeTotalPages}
          aria-label={t("admin.pagination.next")}
          title={t("admin.pagination.next")}
          className="h-8 w-8 rounded-lg shrink-0 border-border text-muted-foreground hover:text-foreground disabled:opacity-40"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Last Page */}
        <Button
          variant="outline"
          size="icon-xs"
          onClick={() => onPageChange(safeTotalPages)}
          disabled={disabled || safeCurrentPage >= safeTotalPages}
          aria-label={t("admin.pagination.last")}
          title={t("admin.pagination.last")}
          className="h-8 w-8 rounded-lg shrink-0 border-border text-muted-foreground hover:text-foreground disabled:opacity-40"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>

    </div>
  );
}
