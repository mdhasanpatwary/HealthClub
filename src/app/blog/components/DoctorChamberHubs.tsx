import { DoctorChamberHub } from "@/types/blog";
import { Building2, Navigation, Lightbulb, MapPin } from "lucide-react";

interface DoctorChamberHubsProps {
  hubs: DoctorChamberHub[];
  locale?: string;
}

export function DoctorChamberHubs({ hubs, locale = "bn" }: DoctorChamberHubsProps) {
  const isEn = locale === "en";

  return (
    <section id="chamber-hubs" className="scroll-mt-24 space-y-6">
      <div>
        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-1.5">
          <Navigation className="h-4 w-4" />
          <span>{isEn ? "Location Directory" : "চেম্বার হাব গাইড"}</span>
        </div>
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
          {isEn
            ? "3. Major Medical Hubs & Chamber Locations in Feni"
            : "৩. ফেনী শহরের প্রধান ডাক্তার চেম্বার ও ক্লিনিক্যাল হাবসমূহ"}
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          {isEn
            ? "Key streets and zones where major specialist chambers and diagnostic centers are clustered."
            : "এসএসকে রোড, হাসপাতাল রোড, ট্রাঙ্ক রোড ও মিজান রোডের বিশিষ্ট চেম্বার লোকেশন ও যাতায়াত নির্দেশিকা।"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {hubs.map((hub, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-xs hover:border-primary/30 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0 mt-0.5">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-heading text-base font-bold text-foreground">
                    {isEn ? hub.areaNameEn : hub.areaNameBn}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {isEn
                      ? hub.descriptionEn ||
                        `Major healthcare hub located along ${hub.areaNameEn}, housing specialized clinics, diagnostic labs, and doctor chambers.`
                      : hub.descriptionBn}
                  </p>
                </div>
              </div>

              {/* Popular Chambers */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-semibold text-foreground/80 flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-primary" />
                  <span>{isEn ? "Popular Centers & Hospitals:" : "উল্লেখযোগ্য চেম্বার ও প্রতিষ্ঠান:"}</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {hub.popularHospitalsChambersBn.map((item, cIdx) => (
                    <span
                      key={cIdx}
                      className="px-2.5 py-1 rounded-lg bg-muted/60 text-foreground/90 text-[11px] font-medium border border-border/60"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Practical Tip */}
            <div className="rounded-xl bg-amber-500/5 border border-amber-500/20 p-3 text-xs flex items-start gap-2 text-amber-900 dark:text-amber-200">
              <Lightbulb className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                {isEn
                  ? hub.tipsEn ||
                    "Tip: Book appointments 1-2 days ahead by calling serial hotlines between 8:00 AM - 11:00 AM."
                  : hub.tipsBn}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
