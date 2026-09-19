"use client";

import Link from "next/link";
import {
  Hospital,
  Stethoscope,
  Pill,
  HeartPulse,
  Baby,
  Activity,
  Microscope,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Network,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface BlogClusterMeshProps {
  currentSlug: string;
  locale?: string;
}

interface ClusterNode {
  slug: string;
  titleBn: string;
  titleEn: string;
  subtitleBn: string;
  subtitleEn: string;
  categoryBn: string;
  categoryEn: string;
  icon: typeof Hospital;
  accentColor: string;
  borderColor: string;
  bgLight: string;
}

const FENI_CLUSTER_NODES: ClusterNode[] = [
  {
    slug: "best-10-hospitals-in-feni",
    titleBn: "ফেনীর সেরা ১০টি হাসপাতাল",
    titleEn: "Top 10 Hospitals in Feni",
    subtitleBn: "সরকারি-বেসরকারি হাসপাতাল, আইসিইউ ও জরুরি সেবা",
    subtitleEn: "Govt & private tertiary hospitals, ICU & 24/7 care",
    categoryBn: "হাসপাতাল গাইড",
    categoryEn: "Hospitals",
    icon: Hospital,
    accentColor: "text-blue-600 dark:text-blue-400",
    borderColor: "hover:border-blue-500/50",
    bgLight: "bg-blue-500/10",
  },
  {
    slug: "best-doctors-in-feni",
    titleBn: "ফেনীর সেরা বিশেষজ্ঞ ডাক্তার",
    titleEn: "Best Specialist Doctors in Feni",
    subtitleBn: "মেডিসিন, সার্জারি, গাইনি ও শিশু বিশেষজ্ঞ ডিরেক্টরি",
    subtitleEn: "Multi-specialty master directory & chamber serials",
    categoryBn: "ডাক্তার তালিকা",
    categoryEn: "Doctors",
    icon: Stethoscope,
    accentColor: "text-emerald-600 dark:text-emerald-400",
    borderColor: "hover:border-emerald-500/50",
    bgLight: "bg-emerald-500/10",
  },
  {
    slug: "best-medicine-doctors-in-feni",
    titleBn: "ফেনীর সেরা মেডিসিন ডাক্তার",
    titleEn: "Best Medicine Specialists in Feni",
    subtitleBn: "ডায়াবেটিস, প্রেশার, লিভার ও জটিল রোগ বিশেষজ্ঞ",
    subtitleEn: "Internal medicine, diabetes, fever & chronic disease",
    categoryBn: "মেডিসিন গাইড",
    categoryEn: "Medicine",
    icon: Pill,
    accentColor: "text-amber-600 dark:text-amber-400",
    borderColor: "hover:border-amber-500/50",
    bgLight: "bg-amber-500/10",
  },
  {
    slug: "best-cardiologists-in-feni",
    titleBn: "ফেনীর সেরা হৃদরোগ ও কার্ডিওলজিস্ট",
    titleEn: "Best Cardiologists in Feni",
    subtitleBn: "হার্ট বিশেষজ্ঞ, ইকো/ইটিটি টেস্ট ও সিসিইউ ট্রায়াজ",
    subtitleEn: "Heart specialists, ECG, Echo & CCU emergency care",
    categoryBn: "হৃদরোগ ও সিসিইউ",
    categoryEn: "Cardiology",
    icon: HeartPulse,
    accentColor: "text-rose-600 dark:text-rose-400",
    borderColor: "hover:border-rose-500/50",
    bgLight: "bg-rose-500/10",
  },
  {
    slug: "best-gynecologists-in-feni",
    titleBn: "ফেনীর সেরা গাইনি বিশেষজ্ঞ",
    titleEn: "Best Gynecologists & Maternity Care",
    subtitleBn: "প্রসূতি সেবা, স্বাভাবিক ডেলিভারি ও এনআইসিইউ গাইড",
    subtitleEn: "Maternal health, safe delivery & NICU facilities",
    categoryBn: "গাইনি ও প্রসূতি",
    categoryEn: "Gynecology",
    icon: Baby,
    accentColor: "text-pink-600 dark:text-pink-400",
    borderColor: "hover:border-pink-500/50",
    bgLight: "bg-pink-500/10",
  },
  {
    slug: "best-kidney-doctors-in-feni",
    titleBn: "ফেনীর সেরা কিডনি ডাক্তার ও ডায়ালাইসিস",
    titleEn: "Best Kidney Doctors & Dialysis in Feni",
    subtitleBn: "নেফ্রোলজিস্ট, ডায়ালাইসিস খরচ ও ইউরোলজি সার্জারি",
    subtitleEn: "Nephrologists, dialysis pricing & kidney stones",
    categoryBn: "কিডনি ও ডায়ালাইসিস",
    categoryEn: "Nephrology",
    icon: Activity,
    accentColor: "text-purple-600 dark:text-purple-400",
    borderColor: "hover:border-purple-500/50",
    bgLight: "bg-purple-500/10",
  },
  {
    slug: "best-diagnostic-centers-in-feni",
    titleBn: "ফেনীর সেরা ডায়াগনস্টিক সেন্টার",
    titleEn: "Best Diagnostic Centers in Feni",
    subtitleBn: "সিটি স্ক্যান, ৪ডি আল্ট্রাসাউন্ড, রক্ত পরীক্ষা ও মেম্বার ছাড়",
    subtitleEn: "CT scans, 4D USG, pathology labs & member savings",
    categoryBn: "ডায়াগনস্টিক",
    categoryEn: "Diagnostics",
    icon: Microscope,
    accentColor: "text-cyan-600 dark:text-cyan-400",
    borderColor: "hover:border-cyan-500/50",
    bgLight: "bg-cyan-500/10",
  },
  {
    slug: "best-dental-clinics-in-feni",
    titleBn: "ফেনীর সেরা ডেন্টাল ক্লিনিক",
    titleEn: "Best Dental Clinics & Dentists in Feni",
    subtitleBn: "রুট ক্যানেল, দাঁতের ক্যাপ, ব্রেসেস ও ইমপ্লান্ট গাইড",
    subtitleEn: "Root canals, crowns, braces & titanium implants",
    categoryBn: "ডেন্টাল কেয়ার",
    categoryEn: "Dental",
    icon: Sparkles,
    accentColor: "text-indigo-600 dark:text-indigo-400",
    borderColor: "hover:border-indigo-500/50",
    bgLight: "bg-indigo-500/10",
  },
  {
    slug: "best-physiotherapy-centers-in-feni",
    titleBn: "ফেনীর সেরা ফিজিওথেরাপি সেন্টার",
    titleEn: "Best Physiotherapy Centers in Feni",
    subtitleBn: "স্ট্রোক প্যারালাইসিস, পিএলআইডি কোমর ব্যথা ও রিহ্যাব",
    subtitleEn: "Stroke rehabilitation, PLID sciatica & physical therapy",
    categoryBn: "ফিজিওথেরাপি ও রিহ্যাব",
    categoryEn: "Physiotherapy",
    icon: ShieldCheck,
    accentColor: "text-teal-600 dark:text-teal-400",
    borderColor: "hover:border-teal-500/50",
    bgLight: "bg-teal-500/10",
  },
];

export function BlogClusterMesh({ currentSlug, locale = "bn" }: BlogClusterMeshProps) {
  const isEn = locale === "en";

  return (
    <div className="rounded-3xl border border-primary/20 bg-gradient-to-b from-primary/5 via-card to-card p-5 sm:p-7 md:p-8 shadow-xs space-y-6">
      {/* Cluster Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-border/70">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider">
            <Network className="h-4 w-4" />
            <span>{isEn ? "Feni Healthcare Guide Network" : "ফেনী স্বাস্থ্যসেবা গাইড নেটওয়ার্ক"}</span>
          </div>
          <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground">
            {isEn
              ? "Interconnected Regional Healthcare Cluster"
              : "এক নজরে ফেনীর চিকিৎসাসেবার পূর্ণাঙ্গ টপিক ক্লাস্টার"}
          </h3>
          <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
            {isEn
              ? "All hospital, specialist doctor, diagnostic lab, and therapy guides are linked for continuous patient care."
              : "হাসপাতাল ভর্তি, বিশেষজ্ঞ ডাক্তার চেম্বার, ডায়াগনস্টিক টেস্ট ও ফিজিওথেরাপির প্রতিটি গাইড একে অপরের সাথে সংযুক্ত।"}
          </p>
        </div>

        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline shrink-0"
        >
          <span>{isEn ? "Explore all guides" : "সকল গাইড দেখুন"}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Cluster Mesh Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {FENI_CLUSTER_NODES.map((node) => {
          const isCurrent = node.slug === currentSlug;
          const IconComponent = node.icon;
          const title = isEn ? node.titleEn : node.titleBn;
          const subtitle = isEn ? node.subtitleEn : node.subtitleBn;
          const category = isEn ? node.categoryEn : node.categoryBn;

          if (isCurrent) {
            return (
              <div
                key={node.slug}
                className="relative flex flex-col justify-between p-4 rounded-2xl border-2 border-primary bg-primary/10 shadow-xs ring-2 ring-primary/20 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className={cn("p-2 rounded-xl bg-primary text-primary-foreground shadow-xs")}>
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <Badge className="bg-primary text-primary-foreground text-[10px] font-bold gap-1 shadow-xs">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>{isEn ? "Current Guide" : "বর্তমান গাইড"}</span>
                    </Badge>
                  </div>

                  <div>
                    <h4 className="font-heading text-sm font-bold text-foreground leading-snug">
                      {title}
                    </h4>
                    <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                      {subtitle}
                    </p>
                  </div>
                </div>

                <div className="pt-3 mt-2 border-t border-primary/20 flex items-center justify-between text-[11px] font-semibold text-primary">
                  <span>{category}</span>
                  <span className="text-[10px] opacity-80">{isEn ? "Active Reading" : "পড়ছেন"}</span>
                </div>
              </div>
            );
          }

          return (
            <Link
              key={node.slug}
              href={`/blog/${node.slug}`}
              className={cn(
                "group relative flex flex-col justify-between p-4 rounded-2xl border border-border/70 bg-card/80 hover:bg-card hover:shadow-md transition-all duration-200",
                node.borderColor
              )}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className={cn("p-2 rounded-xl transition-colors group-hover:scale-105", node.bgLight, node.accentColor)}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <span className="text-[10px] font-medium text-muted-foreground bg-muted/80 px-2 py-0.5 rounded-md">
                    {category}
                  </span>
                </div>

                <div>
                  <h4 className="font-heading text-sm font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                    {title}
                  </h4>
                  <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                    {subtitle}
                  </p>
                </div>
              </div>

              <div className="pt-3 mt-2 border-t border-border/50 flex items-center justify-between text-[11px] font-semibold text-muted-foreground group-hover:text-primary transition-colors">
                <span>{isEn ? "Read guide" : "গাইড পড়ুন"}</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
