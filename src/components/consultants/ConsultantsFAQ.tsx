import { ChevronDown, HelpCircle } from "lucide-react";
import { Locale } from "@/lib/i18n";
import { tServer } from "@/lib/i18n.server";

interface FAQItem {
  question: string;
  answer: string;
}

interface ConsultantsFAQProps {
  locale?: Locale;
}

export default function ConsultantsFAQ({ locale = "bn" }: ConsultantsFAQProps) {
  const t = (key: string) => tServer(locale, key);

  const faqs: FAQItem[] = [
    { question: t("consultants.faq.q1"), answer: t("consultants.faq.a1") },
    { question: t("consultants.faq.q2"), answer: t("consultants.faq.a2") },
    { question: t("consultants.faq.q3"), answer: t("consultants.faq.a3") },
    { question: t("consultants.faq.q4"), answer: t("consultants.faq.a4") },
    { question: t("consultants.faq.q5"), answer: t("consultants.faq.a5") },
    { question: t("consultants.faq.q6"), answer: t("consultants.faq.a6") },
  ];

  return (
    <section aria-labelledby="consultants-faq-heading" className="w-full max-w-4xl mx-auto space-y-6 sm:space-y-8">
      {/* Section Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-emerald-800 dark:text-emerald-300 border border-primary/20 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
          <HelpCircle className="h-3.5 w-3.5" />
          <span>{t("consultants.faq.badge")}</span>
        </div>
        <h2 id="consultants-faq-heading" className="font-heading text-xl sm:text-3xl font-bold text-secondary dark:text-white tracking-tight">
          {t("consultants.faq.title")}
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {t("consultants.faq.subtitle")}
        </p>
      </div>

      {/* Accordion List using Native Details & Summary for Zero-JS Fast Hydration */}
      <div className="space-y-3">
        {faqs.map((faq, idx) => (
          <details
            key={idx}
            open={idx === 0}
            className="group border border-border/80 rounded-2xl bg-card hover:border-primary/40 transition-all duration-200 shadow-xs overflow-hidden"
          >
            <summary className="w-full flex justify-between items-center gap-3 p-4 sm:p-5 text-left font-heading font-bold text-secondary dark:text-white text-sm sm:text-base cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset list-none [&::-webkit-details-marker]:hidden select-none">
              <span className="leading-snug">{faq.question}</span>
              <ChevronDown className="h-5 w-5 text-primary shrink-0 transition-transform duration-300 group-open:rotate-180" />
            </summary>
            <div className="border-t border-border/60 p-4 sm:p-5 pt-3 sm:pt-4 bg-muted/20">
              <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                {faq.answer}
              </p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
