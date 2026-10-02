import Link from "next/link";
import { BookOpen, ArrowRight, Sparkles, Clock } from "lucide-react";
import { getDepartmentPillarPost } from "@/data/blog/departmentBlogMapping";
import { Badge } from "@/components/ui/badge";

interface DoctorPillarGuideCardProps {
  department?: string;
  specialty?: string;
  className?: string;
}

/**
 * Contextual internal linking card on doctor profile pages.
 * Connects the doctor's specialty/department directly to its corresponding
 * high-ranking blog pillar guide, optimizing dwell time and PageRank flow.
 */
export function DoctorPillarGuideCard({
  department,
  className = "",
}: DoctorPillarGuideCardProps) {
  const guide = getDepartmentPillarPost(department);

  return (
    <div
      className={`rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 via-card to-card p-5 sm:p-6 shadow-xs relative overflow-hidden ${className}`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2.5 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="text-[11px] font-semibold bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/30"
            >
              <Sparkles className="h-3 w-3 mr-1" />
              {guide.badgeBn}
            </Badge>
            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground font-medium">
              <Clock className="h-3 w-3 text-muted-foreground/70" />
              <span>পড়ার সময়: {guide.readTimeBn}</span>
            </span>
          </div>

          <div>
            <h3 className="font-heading text-base sm:text-lg font-bold text-foreground hover:text-primary transition-colors">
              <Link href={`/blog/${guide.slug}`} className="hover:underline">
                {guide.titleBn}
              </Link>
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
              {guide.subtitleBn}
            </p>
          </div>
        </div>

        <Link
          href={`/blog/${guide.slug}`}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs sm:text-sm font-bold shadow-xs transition-all hover:gap-3 shrink-0 self-start md:self-auto"
        >
          <BookOpen className="h-4 w-4" />
          <span>বিশেষজ্ঞ গাইড পড়ুন</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
