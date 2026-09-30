import { CheckCircle2, PhoneCall } from "lucide-react";

interface DoctorBookingGuideProps {
  guide: {
    title?: string;
    titleBn?: string;
    steps?: { step: string; title: string; desc: string }[];
    stepsBn?: { step: string; title: string; desc: string }[];
  };
}

export function DoctorBookingGuide({
  guide,
}: DoctorBookingGuideProps) {
  const title = guide.titleBn || guide.title || "";
  const steps = guide.stepsBn || guide.steps || [];
  const isEvenSteps = steps.length % 2 === 0;

  return (
    <section id="serial-guide" className="scroll-mt-24 space-y-6">
      <div>
        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-1.5">
          <PhoneCall className="h-4 w-4" />
          <span>সিরিয়াল গাইডলাইন</span>
        </div>
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
          {title.includes("কীভাবে") ? `৪. ${title}` : `৪. কীভাবে সিরিয়াল নিবেন: ${title}`}
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
          চেম্বারে অযথা দীর্ঘ অপেক্ষা এড়াতে সকাল ৮টা-১০টার মধ্যে সরাসরি সিরিয়াল হটলাইনে কল করে অ্যাপয়েন্টমেন্ট কনফার্ম করুন অথবা হেলথ ক্লাবের পেশেন্ট হেল্পডেস্কের সহায়তা নিন।
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {steps.map((step, idx) => {
          const isLastOdd = !isEvenSteps && idx === steps.length - 1;
          return (
            <div
              key={idx}
              className={`rounded-2xl border border-border/80 bg-card p-4 sm:p-5 space-y-2.5 shadow-xs hover:border-primary/40 transition-all flex flex-col justify-between ${
                isLastOdd ? "sm:col-span-2" : ""
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-primary/10 text-primary border border-primary/20 text-xs font-bold leading-none">
                    {step.step || ((step as unknown as { stepNumber?: string }).stepNumber ? `ধাপ ${(step as unknown as { stepNumber?: string }).stepNumber}` : `ধাপ ${idx + 1}`)}
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
          );
        })}
      </div>
    </section>
  );
}
