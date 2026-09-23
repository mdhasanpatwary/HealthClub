import Link from "next/link";
import { Sparkles, Clock, ShieldCheck, ArrowRight } from "lucide-react";

export interface BlogPriceTableItem {
  name: string;
  category?: string;
  regularPriceRange: string;
  durationOrTurnaround: string;
  discountText?: string;
}

export interface BlogPriceTableProps {
  id?: string;
  title: string;
  subtitle: string;
  items: BlogPriceTableItem[];
  locale?: string;
  showBenefitColumn?: boolean;
  columnHeaders?: {
    item?: string;
    regularPrice?: string;
    benefit?: string;
    duration?: string;
  };
  conversionBanner?: {
    title?: string;
    text: string;
    buttonText: string;
    href?: string;
    variant?: "button" | "link";
  };
}

export function BlogPriceTable({
  id = "price-guide",
  title,
  subtitle,
  items,
  locale = "bn",
  showBenefitColumn = true,
  columnHeaders,
  conversionBanner,
}: BlogPriceTableProps) {
  const isEn = locale === "en";

  const defaultItemHeader = isEn ? "Procedure / Test Name" : "টেস্ট / প্রসিডিউরের নাম ও ধরন";
  const defaultPriceHeader = isEn ? "Standard Rate" : "সাধারণ বাজারদর";
  const defaultBenefitHeader = isEn ? "Health Club Benefit" : "হেলথ ক্লাব সুবিধা";
  const defaultDurationHeader = isEn ? "Duration / Turnaround" : "সময়কাল / সুবিধা";

  const defaultBannerTitle = isEn
    ? "Special member savings with Health Club!"
    : "হেলথ ক্লাবে বিশেষ মেম্বার ছাড় ও সাশ্রয় পান!";
  const defaultBannerText = isEn
    ? "Get your digital Health Club membership card today to save on healthcare."
    : "আজই হেলথ ক্লাবের মেম্বারশিপ কার্ড সংগ্রহ করে চিকিৎসায় নিশ্চিত ছাড় পান।";
  const defaultButtonText = isEn ? "Get Membership" : "মেম্বারশিপ গ্রহণ করুন";

  const banner = conversionBanner || {
    text: defaultBannerText,
    buttonText: defaultButtonText,
    href: "/membership",
    variant: "link",
  };

  const isButtonVariant = banner.variant === "button" || Boolean(banner.title);

  return (
    <section id={id} className="scroll-mt-24 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1.5">
        <div className="space-y-1.5">
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <div className="flex sm:hidden items-center gap-1 text-[11px] font-medium text-muted-foreground/80 self-end">
          <span>{isEn ? "← Scroll horizontally →" : "← সম্পূর্ণ দেখতে স্ক্রোল করুন →"}</span>
        </div>
      </div>

      <div
        className="relative overflow-x-auto rounded-2xl border border-border/80 bg-card shadow-xs focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40"
        tabIndex={0}
        aria-label={title}
      >
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-muted/80 text-foreground font-bold border-b border-border/80">
            <tr>
              <th className="py-3.5 px-3 sm:px-4 min-w-[200px]">
                {columnHeaders?.item || defaultItemHeader}
              </th>
              <th className="py-3.5 px-3 sm:px-4 whitespace-nowrap text-center">
                {columnHeaders?.regularPrice || defaultPriceHeader}
              </th>
              {showBenefitColumn && (
                <th className="py-3.5 px-3 sm:px-4 whitespace-nowrap text-center">
                  {columnHeaders?.benefit || defaultBenefitHeader}
                </th>
              )}
              <th className="py-3.5 px-3 sm:px-4 whitespace-nowrap text-center">
                {columnHeaders?.duration || defaultDurationHeader}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {items.map((item, idx) => (
              <tr key={idx} className="hover:bg-muted/40 transition-colors">
                <td className="py-3 px-3 sm:px-4">
                  <span className="font-semibold text-foreground block">
                    {item.name}
                  </span>
                  {item.category && (
                    <span className="text-[11px] text-muted-foreground block">
                      {item.category}
                    </span>
                  )}
                </td>
                <td className="py-3 px-3 sm:px-4 text-center font-mono text-muted-foreground whitespace-nowrap">
                  {item.regularPriceRange}
                </td>
                {showBenefitColumn && (
                  <td className="py-3 px-3 sm:px-4 text-center whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                      <Sparkles className="h-3 w-3 shrink-0" />
                      <span>
                        {item.discountText || (isEn ? "10-30% Member Discount" : "১০-৩০% মেম্বার ছাড়")}
                      </span>
                    </span>
                  </td>
                )}
                <td className="py-3 px-3 sm:px-4 text-center text-muted-foreground whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 text-xs">
                    <Clock className="h-3 w-3 text-muted-foreground/70" />
                    <span>{item.durationOrTurnaround}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isButtonVariant ? (
        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary font-bold text-sm sm:text-base">
              <ShieldCheck className="h-5 w-5 shrink-0" />
              <span>{banner.title || defaultBannerTitle}</span>
            </div>
            <p className="text-xs text-muted-foreground">{banner.text}</p>
          </div>

          <Link
            href={banner.href || "/membership"}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs sm:text-sm font-bold shadow-xs transition-colors shrink-0"
          >
            <span>{banner.buttonText}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
            <p className="text-foreground">{banner.text}</p>
          </div>
          <Link
            href={banner.href || "/membership"}
            className="inline-flex items-center gap-1.5 font-bold text-primary hover:underline shrink-0"
          >
            <span>{banner.buttonText}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </section>
  );
}
