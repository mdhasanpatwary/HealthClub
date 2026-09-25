"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ArrowRight,
  Network,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, toBanglaNums } from "@/lib/utils";
import {
  FENI_CLUSTER_NODES,
  CLUSTER_GROUPS,
  ClusterGroupId,
  getClusterGroupIdBySlug,
} from "@/data/blog/clusterNodes";

interface BlogClusterMeshProps {
  currentSlug: string;
}

export function BlogClusterMesh({ currentSlug }: BlogClusterMeshProps) {
  const initialGroup = getClusterGroupIdBySlug(currentSlug);
  const [selectedGroup, setSelectedGroup] = useState<ClusterGroupId>(initialGroup);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Group counts calculation
  const groupCounts = CLUSTER_GROUPS.reduce<Record<ClusterGroupId, number>>(
    (acc, group) => {
      acc[group.id] = FENI_CLUSTER_NODES.filter((n) => n.clusterGroupId === group.id).length;
      return acc;
    },
    {
      hospitals: 0,
      doctors: 0,
      diagnostics: 0,
      procedures: 0,
      emergency: 0,
      upazila: 0,
    }
  );

  // Filter nodes by selected cluster
  const currentGroupNodes = FENI_CLUSTER_NODES.filter(
    (node) => node.clusterGroupId === selectedGroup
  );

  // By default show 6 nodes; expand to all if user clicks toggle
  const visibleNodes = isExpanded ? currentGroupNodes : currentGroupNodes.slice(0, 6);
  const hasMoreNodes = currentGroupNodes.length > 6;

  return (
    <div className="rounded-3xl border border-primary/20 bg-gradient-to-b from-primary/5 via-card to-card p-4 sm:p-7 md:p-8 shadow-xs space-y-6">
      {/* Cluster Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-border/70">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider">
            <Network className="h-4 w-4" />
            <span>ফেনী স্বাস্থ্যসেবা গাইড নেটওয়ার্ক</span>
          </div>
          <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground">
            এক নজরে ফেনীর চিকিৎসাসেবার পূর্ণাঙ্গ টপিক ক্লাস্টার
          </h3>
          <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
            হাসপাতাল ভর্তি, বিশেষজ্ঞ ডাক্তার চেম্বার, ডায়াগনস্টিক টেস্ট ও ফিজিওথেরাপির প্রতিটি গাইড একে অপরের সাথে সংযুক্ত।
          </p>
        </div>

        <Link
          href="/blog"
          prefetch={false}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline shrink-0"
        >
          <span>সকল গাইড দেখুন</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Cluster Category Filter Tabs (Mobile-first horizontal scroll) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground px-0.5">
          <span className="font-medium">
            চিকিৎসাসেবা ক্লাস্টার অনুযায়ী দেখুন:
          </span>
          <span className="text-[11px]">
            {`এই ক্লাস্টারে ${toBanglaNums(currentGroupNodes.length)}টি গাইড`}
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth -mx-1 px-1">
          {CLUSTER_GROUPS.map((group) => {
            const isSelected = selectedGroup === group.id;
            const IconComponent = group.icon;
            const count = groupCounts[group.id] || 0;
            const label = group.labelBn;

            return (
              <button
                key={group.id}
                type="button"
                onClick={() => {
                  setSelectedGroup(group.id);
                  setIsExpanded(false);
                }}
                className={cn(
                  "inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 shrink-0 cursor-pointer",
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20 scale-[1.02]"
                    : "bg-background/80 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/70"
                )}
                aria-pressed={isSelected}
              >
                <IconComponent className="h-3.5 w-3.5" />
                <span>{label}</span>
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded-full font-bold",
                    isSelected
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {toBanglaNums(count)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Cluster Mesh Grid (Filtered) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {visibleNodes.map((node) => {
          const isCurrent = node.slug === currentSlug;
          const IconComponent = node.icon;
          const title = node.titleBn;
          const subtitle = node.subtitleBn;
          const category = node.categoryBn;

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
                      <span>বর্তমান গাইড</span>
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
                  <span className="text-[10px] opacity-80">পড়ছেন</span>
                </div>
              </div>
            );
          }

          return (
            <Link
              key={node.slug}
              href={`/blog/${node.slug}`}
              prefetch={false}
              className={cn(
                "group relative flex flex-col justify-between p-4 rounded-2xl border border-border/70 bg-card/80 hover:bg-card hover:shadow-md transition-all duration-200",
                node.borderColor
              )}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div
                    className={cn(
                      "p-2 rounded-xl transition-colors group-hover:scale-105",
                      node.bgLight,
                      node.accentColor
                    )}
                  >
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
                <span>গাইড পড়ুন</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Show more / Show fewer toggle button if cluster has > 6 nodes */}
      {hasMoreNodes && (
        <div className="pt-2 flex justify-center">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="rounded-xl text-xs font-bold gap-2 border-primary/30 hover:border-primary text-foreground hover:text-primary transition-colors h-9 px-4 cursor-pointer"
          >
            {isExpanded ? (
              <>
                <span>কম গাইড দেখুন</span>
                <ChevronUp className="h-3.5 w-3.5" />
              </>
            ) : (
              <>
                <span>
                  {`এই ক্লাস্টারের আরও ${toBanglaNums(currentGroupNodes.length - 6)}টি গাইড দেখুন`}
                </span>
                <ChevronDown className="h-3.5 w-3.5" />
              </>
            )}
          </Button>
        </div>
      )}

      {/* Cluster Footer Metadata */}
      <div className="pt-4 border-t border-border/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>
            {`৬টি বিশেষায়িত ক্লাস্টারে সর্বমোট ${toBanglaNums(FENI_CLUSTER_NODES.length)}+টি পারস্পরিক সংযুক্ত স্বাস্থ্য গাইড রয়েছে।`}
          </span>
        </div>

        <Link
          href="/blog"
          prefetch={false}
          className="inline-flex items-center gap-1.5 font-bold text-primary hover:underline"
        >
          <span>সকল স্বাস্থ্য গাইড ডিরেক্টরি</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
