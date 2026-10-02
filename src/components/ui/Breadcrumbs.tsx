import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SITE_URL } from "@/lib/siteConfig";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  includeJsonLd?: boolean;
}

/**
 * Reusable Breadcrumbs component providing both accessible visual navigation
 * and valid Schema.org BreadcrumbList JSON-LD structured data for Google SERP.
 */
export function Breadcrumbs({
  items,
  className = "",
  includeJsonLd = false,
}: BreadcrumbsProps) {
  if (!items || items.length === 0) return null;

  const jsonLdData = includeJsonLd
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => {
          const itemUrl = item.href
            ? item.href.startsWith("http")
              ? item.href
              : `${SITE_URL}${item.href.startsWith("/") ? "" : "/"}${item.href}`
            : undefined;

          return {
            "@type": "ListItem",
            position: index + 1,
            name: item.label,
            ...(itemUrl ? { item: itemUrl } : {}),
          };
        }),
      }
    : null;

  return (
    <>
      {jsonLdData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />
      )}
      <nav
        aria-label="Breadcrumb"
        className={`flex items-center gap-1.5 text-xs text-muted-foreground overflow-x-auto no-scrollbar py-1 ${className}`}
      >
        <ol className="flex items-center gap-1.5 list-none p-0 m-0 whitespace-nowrap">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
                {index > 0 && (
                  <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" aria-hidden="true" />
                )}
                {isLast || !item.href ? (
                  <span
                    className="text-foreground font-semibold truncate max-w-[200px] sm:max-w-[320px]"
                    aria-current={isLast ? "page" : undefined}
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="hover:text-primary transition-colors text-muted-foreground"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
