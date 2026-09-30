import { Doctor } from "@/services/db";
import { ChevronDown, HelpCircle, ShieldCheck } from "lucide-react";
import { generateDoctorProfileFaqs, DoctorFaqItem } from "@/data/doctorFaqData";

interface DoctorDepartmentFaqProps {
  doctor: Doctor;
  customFaqs?: DoctorFaqItem[];
}

/**
 * Conversational Department FAQ Accordion Component.
 * Optimized for Answer Engine Optimization (AEO) and Generative Engine Optimization (GEO).
 * Rendered using native <details>/<summary> for instant zero-JS hydration and 100% crawlability.
 */
export function DoctorDepartmentFaq({
  doctor,
  customFaqs,
}: DoctorDepartmentFaqProps) {
  const faqs = customFaqs && customFaqs.length > 0
    ? customFaqs
    : generateDoctorProfileFaqs(doctor);

  return (
    <section
      id="faq-section"
      aria-labelledby="doctor-faq-heading"
      className="rounded-3xl border border-border/80 bg-card p-5 sm:p-7 shadow-xs space-y-5"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <HelpCircle className="h-5 w-5" />
          </div>
          <div>
            <h2 id="doctor-faq-heading" className="font-heading font-bold text-base sm:text-lg text-foreground">
              {doctor.name} সম্পর্কিত সাধারণ প্রশ্নোত্তর (FAQs)
            </h2>
            <p className="text-xs text-muted-foreground">
              চেম্বার শিডিউল, সিরিয়াল বুকিং ও চিকিৎসা সংক্রান্ত তথ্য
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/25 text-[11px] font-bold self-start sm:self-auto">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          <span>ভেরিফাইড প্রশ্নোত্তর</span>
        </div>
      </div>

      {/* Accessible native details & summary accordion */}
      <div className="space-y-3">
        {faqs.map((faq, idx) => (
          <details
            key={idx}
            open={idx === 0}
            className="group border border-border/70 rounded-2xl bg-muted/20 hover:border-primary/40 transition-all duration-200 overflow-hidden"
          >
            <summary className="w-full flex justify-between items-center gap-3 p-4 sm:p-4.5 text-left font-heading font-bold text-secondary dark:text-white text-xs sm:text-sm cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset list-none [&::-webkit-details-marker]:hidden select-none">
              <span className="leading-snug">{faq.question}</span>
              <ChevronDown className="h-4 w-4 text-primary shrink-0 transition-transform duration-300 group-open:rotate-180" />
            </summary>
            <div className="border-t border-border/50 p-4 sm:p-4.5 pt-3 sm:pt-3.5 bg-background/80">
              <p className="faq-answer text-xs sm:text-sm leading-relaxed text-muted-foreground">
                {faq.answer}
              </p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

export default DoctorDepartmentFaq;
