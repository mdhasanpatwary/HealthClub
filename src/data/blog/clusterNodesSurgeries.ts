import { Activity, Eye, ShieldCheck } from "lucide-react";
import type { ClusterNode } from "./clusterNodes";

export const CLUSTER_NODES_SURGERIES: ClusterNode[] = [
  {
    slug: "feni-cataract-phaco-eye-surgery-cost-guide",
    clusterGroupId: "procedures",
    titleBn: "ফেনী ছানি ও ফ্যাকো সার্জারি গাইড",
    titleEn: "Feni Cataract & Phaco Surgery Guide",
    subtitleBn: "চোখের ছানি অপারেশন, ফোল্ডেবল ও মাল্টিফোকাল লেন্সের দাম ও ফ্যাকো সেন্টার",
    subtitleEn: "Cataract phaco surgery cost, foldable IOL lenses & eye hospitals in Feni",
    categoryBn: "চক্ষু সার্জারি ও ফ্যাকো",
    categoryEn: "Cataract & Eye Surgery",
    icon: Eye,
    accentColor: "text-sky-600 dark:text-sky-400",
    borderColor: "hover:border-sky-500/50",
    bgLight: "bg-sky-500/10",
  },
  {
    slug: "feni-tonsil-adenoid-surgery-cost-guide",
    clusterGroupId: "procedures",
    titleBn: "ফেনী টনসিল ও এডিনয়েড সার্জারি গাইড",
    titleEn: "Feni Tonsil & Adenoid Surgery Guide",
    subtitleBn: "টনসিল ও এডিনয়েড অপারেশন খরচ, কোবলেশন আধুনিক পদ্ধতি ও ইএনটি সার্জন",
    subtitleEn: "Tonsillectomy & adenoid surgery cost, coblation tech & ENT surgeons in Feni",
    categoryBn: "ইএনটি ও হেড-নেক সার্জারি",
    categoryEn: "ENT & Tonsil Surgery",
    icon: ShieldCheck,
    accentColor: "text-emerald-600 dark:text-emerald-400",
    borderColor: "hover:border-emerald-500/50",
    bgLight: "bg-emerald-500/10",
  },
  {
    slug: "feni-appendix-appendectomy-surgery-cost-guide",
    clusterGroupId: "procedures",
    titleBn: "ফেনী এপেন্ডিসাইটিস সার্জারি গাইড",
    titleEn: "Feni Appendicitis Surgery Guide",
    subtitleBn: "এপেন্ডিসাইটিস অপারেশন খরচ, জরুরি লক্ষণ ও ল্যাপারোস্কোপিক এপেনডেক্টমি",
    subtitleEn: "Appendicitis surgery cost, emergency symptoms & laparoscopic appendectomy in Feni",
    categoryBn: "জেনারেল ও ল্যাপারোস্কোপিক সার্জারি",
    categoryEn: "Laparoscopic & Appendectomy",
    icon: Activity,
    accentColor: "text-rose-600 dark:text-rose-400",
    borderColor: "hover:border-rose-500/50",
    bgLight: "bg-rose-500/10",
  },
];


