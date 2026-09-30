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
  showBenefitColumn = true,
  columnHeaders,
  conversionBanner,
}: BlogPriceTableProps) {
  const defaultItemHeader = "টেস্ট / প্রসিডিউরের নাম ও ধরন";
  const defaultPriceHeader = "সাধারণ বাজারদর";
  const defaultBenefitHeader = "হেলথ ক্লাব সুবিধা";
  const defaultDurationHeader = "সময়কাল / সুবিধা";

  const defaultBannerTitle = "ফেনীর শীর্ষ পার্টনার হাসপাতাল ও ডায়াগনস্টিক ল্যাবে সাশ্রয়ী চিকিৎসা";
  const defaultBannerText = "আজই হেলথ ক্লাবের মেম্বারশিপ কার্ড সংগ্রহ করে চিকিৎসায় নিশ্চিত ১০-৩০% ছাড় পান।";
  const defaultButtonText = "মেম্বারশিপ কার্ড নিন";

  const banner = conversionBanner || {
    text: defaultBannerText,
    buttonText: defaultButtonText,
    href: "/membership",
    variant: "button",
  };

  const prefixMatch = title.match(/^([০-৯১-৯\d]+[\.\s]*)/);
  const numberPrefix = prefixMatch ? prefixMatch[1] : "";
  const rawCleanTitle = title.replace(/^[০-৯১-৯\d]+[\.\s]*/, "");
  const formattedTitle = title.includes("খরচ কত")
    ? title
    : `${numberPrefix}${rawCleanTitle.startsWith("খরচ কত") ? rawCleanTitle : `খরচ কত: ${rawCleanTitle}`}`;
  const directAnswerSubtitle = subtitle || "ফেনী সদরের অনুমোদিত ডায়াগনস্টিক ল্যাব ও ক্লিনিকে প্রমিত সাধারণ বাজার ফি প্রযোজ্য হলেও হেলথ ক্লাব মেম্বারশিপ কার্ড দেখালে নিশ্চিত ১০-৩০% বিশেষ ছাড় পাওয়া যায়।";

  return (
    <section id={id} className="scroll-mt-24 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1.5">
        <div className="space-y-1.5">
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
            {formattedTitle}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{directAnswerSubtitle}</p>
        </div>
        <div className="flex sm:hidden items-center gap-1 text-[11px] font-medium text-muted-foreground/80 self-end">
          <span>← সম্পূর্ণ দেখতে স্ক্রোল করুন →</span>
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
                        {item.discountText || "১০-৩০% মেম্বার ছাড়"}
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

      {/* Prominent Standardized Health Club Member Discount Banner */}
      <div className="rounded-2xl border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-card p-4 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-500/30">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>১০-৩০% মেম্বার ছাড় পেতে আজই কার্ড সংগ্রহ করুন</span>
          </div>
          <h3 className="font-heading text-base sm:text-lg font-bold text-foreground">
            {banner.title || defaultBannerTitle}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {banner.text || defaultBannerText}
          </p>
        </div>

        <Link
          href={banner.href || "/membership"}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs sm:text-sm font-bold shadow-xs transition-all hover:gap-3 shrink-0 w-full sm:w-auto self-start sm:self-auto"
        >
          <ShieldCheck className="h-4 w-4" />
          <span>{banner.buttonText || defaultButtonText}</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
