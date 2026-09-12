import { ChevronDown } from "lucide-react";

interface FAQSectionProps {
  t: (key: string) => string;
}

/**
 * Server-rendered, accessible FAQ accordion using semantic HTML5 <details>/<summary>.
 * Requires zero JavaScript on the client side, eliminating script parsing & execution overhead.
 */
export default function FAQSection({ t }: FAQSectionProps) {
  const faqs = [
    { question: t("faq.q1"), answer: t("faq.a1") },
    { question: t("faq.q2"), answer: t("faq.a2") },
    { question: t("faq.q3"), answer: t("faq.a3") },
    { question: t("faq.q4"), answer: t("faq.a4") },
    { question: t("faq.q5"), answer: t("faq.a5") },
    { question: t("faq.q6"), answer: t("faq.a6") },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      {faqs.map((faq, idx) => (
        <details
          key={idx}
          className="group border border-border rounded-xl bg-background hover:bg-muted/30 transition-colors overflow-hidden"
        >
          <summary className="w-full flex justify-between items-center p-5 text-left font-heading font-bold text-secondary dark:text-white text-base md:text-lg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset cursor-pointer list-none [&::-webkit-details-marker]:hidden select-none">
            <span>{faq.question}</span>
            <ChevronDown className="h-5 w-5 text-primary shrink-0 transition-transform duration-300 group-open:rotate-180" />
          </summary>
          <div className="border-t border-border p-5">
            <p className="text-sm md:text-base leading-relaxed text-muted-foreground">
              {faq.answer}
            </p>
          </div>
        </details>
      ))}
    </div>
  );
}
