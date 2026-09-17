import { CheckCircle2, PhoneCall } from "lucide-react";

interface DoctorBookingGuideProps {
  guide: {
    titleBn: string;
    stepsBn: { step: string; title: string; desc: string }[];
  };
  locale?: string;
}

export function DoctorBookingGuide({
  guide,
  locale = "bn",
}: DoctorBookingGuideProps) {
  const isEn = locale === "en";
  const isEvenSteps = guide.stepsBn.length % 2 === 0;

  return (
    <section id="serial-guide" className="scroll-mt-24 space-y-6">
      <div>
        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-1.5">
          <PhoneCall className="h-4 w-4" />
          <span>{isEn ? "Appointment Advice" : "সিরিয়াল গাইডলাইন"}</span>
        </div>
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
          {guide.titleBn}
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          {isEn
            ? "Follow these essential steps to book doctor serials smoothly and avoid long waiting times."
            : "ডাক্তারের সিরিয়াল নিশ্চিত করতে ও চেম্বারে অযথা দীর্ঘ অপেক্ষা এড়াতে এই নিয়মগুলো মেনে চলুন।"}
        </p>
      </div>

      <div
        className={`grid grid-cols-1 sm:grid-cols-2 ${
          isEvenSteps ? "lg:grid-cols-2" : "lg:grid-cols-3"
        } gap-4`}
      >
        {guide.stepsBn.map((step, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 space-y-2.5 shadow-xs hover:border-primary/40 transition-all flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-primary/10 text-primary border border-primary/20 text-xs font-bold leading-none">
                  {step.step}
                </span>
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
              </div>
              <h3 className="font-heading text-xs sm:text-sm font-semibold text-foreground leading-snug">
                {step.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
