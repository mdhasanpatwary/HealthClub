import { HelpCircle, ChevronDown } from "lucide-react";
import { BlogFAQItem } from "@/types/blog";

interface BlogFAQSectionProps {
  faqs: BlogFAQItem[];
  locale?: string;
}

export function BlogFAQSection({ faqs, locale = "bn" }: BlogFAQSectionProps) {
  const isEn = locale === "en";

  if (!faqs || faqs.length === 0) return null;

  return (
    <section id="faq-section" className="scroll-mt-24 space-y-4">
      <div className="flex items-center gap-2 text-primary">
        <HelpCircle className="h-5 w-5" />
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
          {isEn ? "Frequently Asked Questions (FAQ)" : "সচরাচর জিজ্ঞাসিত প্রশ্ন ও উত্তর"}
        </h2>
      </div>

      <div className="divide-y divide-border/60 rounded-2xl border border-border/80 bg-card shadow-xs overflow-hidden">
        {faqs.map((faq, idx) => {
          const question = isEn ? faq.questionEn : faq.questionBn;
          const answer = isEn ? faq.answerEn : faq.answerBn;

          return (
            <details
              key={idx}
              open={idx === 0}
              className="group transition-colors"
            >
              <summary className="w-full flex items-center justify-between p-4 sm:p-5 text-left cursor-pointer list-none select-none [&::-webkit-details-marker]:hidden">
                <h3 className="pr-4 font-heading text-sm sm:text-base font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                  {question}
                </h3>
                <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180 group-open:text-primary" />
              </summary>

              <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-muted-foreground leading-relaxed animate-in fade-in-50">
                <p>{answer}</p>
              </div>
            </details>
          );
        })}
      </div>
    </section>
  );
}
