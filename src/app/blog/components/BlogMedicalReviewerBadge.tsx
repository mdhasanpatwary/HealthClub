import Link from "next/link";
import Image from "next/image";
import { BlogPost, BlogReviewer } from "@/types/blog";
import { resolveBlogReviewer } from "../utils/blogReviewerUtils";
import { Badge } from "@/components/ui/badge";
import {
  Stethoscope,
  CheckCircle2,
  Calendar,
  ExternalLink,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { toBanglaNums } from "@/lib/utils";

interface BlogMedicalReviewerBadgeProps {
  post: BlogPost;
  reviewer?: BlogReviewer;
  className?: string;
}

export function BlogMedicalReviewerBadge({
  post,
  reviewer,
  className = "",
}: BlogMedicalReviewerBadgeProps) {
  const activeReviewer = reviewer || post.reviewedBy || resolveBlogReviewer(post);
  const profileUrl = activeReviewer.profileSlug
    ? (activeReviewer.profileSlug.startsWith("/")
        ? activeReviewer.profileSlug
        : `/consultants/${activeReviewer.profileSlug.replace(/^\//, "")}`)
    : null;

  return (
    <aside
      aria-label="মেডিকেল তথ্য পর্যালোচনা ও যাচাইকরণ"
      className={`rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/[0.08] via-card to-primary/[0.03] p-4 sm:p-5 shadow-xs transition-all hover:border-primary/40 ${className}`}
    >
      {/* Top Header: Review Status & Verification Date */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-primary/10">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className="bg-primary/10 text-primary border-primary/25 text-xs font-semibold px-2.5 py-0.5 flex items-center gap-1.5"
          >
            <Stethoscope className="h-3.5 w-3.5" />
            <span>ক্লিনিক্যাল মেডিকেল রিভিউ</span>
          </Badge>
          <Badge
            variant="outline"
            className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 text-xs hidden sm:flex items-center gap-1"
          >
            <CheckCircle2 className="h-3 w-3" />
            <span>যাচাইকৃত তথ্য</span>
          </Badge>
        </div>

        {activeReviewer.reviewDateBn && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
            <span>
              সর্বশেষ পর্যালোচনা:{" "}
              <strong className="text-foreground font-medium">
                {activeReviewer.reviewDateBn}
              </strong>
            </span>
          </div>
        )}
      </div>

      {/* Main Reviewer Information Row */}
      <div className="flex items-start sm:items-center gap-3.5 pt-3.5">
        {/* Doctor Avatar or Stethoscope Badge */}
        <div className="relative shrink-0">
          {activeReviewer.photoUrl ? (
            <div className="relative h-12 w-12 sm:h-14 sm:w-14 rounded-full overflow-hidden border-2 border-primary/30 shadow-xs">
              <Image
                src={activeReviewer.photoUrl}
                alt={activeReviewer.doctorNameBn}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-primary/10 border-2 border-primary/25 flex items-center justify-center text-primary shadow-xs">
              <UserCheck className="h-6 w-6" />
            </div>
          )}
          <div className="absolute -bottom-0.5 -right-0.5 rounded-full bg-emerald-500 text-white p-0.5 ring-2 ring-background">
            <CheckCircle2 className="h-3 w-3" />
          </div>
        </div>

        {/* Doctor Credentials & Profile Link */}
        <div className="space-y-1 min-w-0 flex-1">
          <div className="text-xs font-semibold text-primary uppercase tracking-wide">
            মেডিকেল তথ্য যাচাই ও পর্যালোচনা করেছেন:
          </div>

          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <h3 className="font-heading font-bold text-sm sm:text-base text-foreground">
              {activeReviewer.doctorNameBn}
            </h3>
            <span className="text-xs text-muted-foreground font-normal">
              {activeReviewer.degreesBn}
            </span>
            {profileUrl && (
              <span className="inline-flex items-center gap-1 text-xs">
                <span className="text-muted-foreground/60">-</span>
                <Link
                  href={profileUrl}
                  prefetch={false}
                  className="font-semibold text-primary hover:underline inline-flex items-center gap-0.5"
                >
                  <span>ভিউ প্রোফাইল</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </span>
            )}
          </div>

          {/* Specialty & BMDC Tags */}
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            <Badge
              variant="outline"
              className="bg-primary/10 text-primary border-primary/20 text-[11px] font-medium py-0 px-2"
            >
              {activeReviewer.specialtyBn}
            </Badge>

            {activeReviewer.bmdcRegNo && (
              <Badge
                variant="outline"
                className="bg-muted text-muted-foreground border-border/80 text-[11px] font-medium py-0 px-2"
              >
                বিএমডিসি রেজিঃ {toBanglaNums(activeReviewer.bmdcRegNo)}
              </Badge>
            )}

            <Badge
              variant="outline"
              className="bg-emerald-500/5 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 text-[11px] font-medium py-0 px-2 hidden md:inline-flex items-center gap-1"
            >
              <CheckCircle2 className="h-3 w-3" />
              <span>BMDC নিবন্ধিত চিকিৎসক দ্বারা পরীক্ষিত</span>
            </Badge>
          </div>
        </div>
      </div>

      {/* Editorial Trust & Transparency Footnote */}
      <div className="mt-3 pt-2.5 border-t border-border/50 text-[11px] text-muted-foreground flex flex-wrap items-center justify-between gap-2">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" />
          <span>রোগীদের সঠিক সিদ্ধান্ত সহায়তায় বিশেষজ্ঞ চিকিৎসকের ক্লিনিক্যাল তথ্য ও স্বাস্থ্যবিধি অনুসৃত।</span>
        </span>
        <Link
          href="/editorial-policy"
          prefetch={false}
          className="text-primary hover:underline font-medium ml-auto"
        >
          এডিটোরিয়াল নীতিমালা
        </Link>
      </div>
    </aside>
  );
}
