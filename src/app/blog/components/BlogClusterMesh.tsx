import Link from "next/link";
import {
  CheckCircle2,
  ArrowRight,
  Network,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { FENI_CLUSTER_NODES } from "@/data/blog/clusterNodes";

interface BlogClusterMeshProps {
  currentSlug: string;
  locale?: string;
}


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
