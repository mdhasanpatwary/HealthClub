import { MapPin, Calendar, Sparkles, Clock, type LucideIcon } from "lucide-react";
import type { ClusterGroupId } from "./clusterNodes";

export interface ClusterNodeItem {
  slug: string;
  clusterGroupId: ClusterGroupId;
  titleBn: string;
  titleEn: string;
  subtitleBn: string;
  subtitleEn: string;
  categoryBn: string;
  categoryEn: string;
  icon: LucideIcon;
  accentColor: string;
  borderColor: string;
  bgLight: string;
}

export const CLUSTER_NODES_HUBS: ClusterNodeItem[] = [
  {
    slug: "feni-hospital-road-ss-k-road-chamber-hub-guide",
    clusterGroupId: "doctors",
    titleBn: "হাসপাতাল ও এসএসকে রোড চেম্বার হাব",
    titleEn: "Hospital & SSK Road Chamber Hub",
    subtitleBn: "প্রধান ক্লিনিক, ল্যাব, পার্কিং, ফার্মেসি ও সরাসরি সিরিয়াল পয়েন্ট",
    subtitleEn: "Clinics, labs, parking zones, pharmacies & appointment hubs",
    categoryBn: "চেম্বার হাব ও নেভিগেশন",
    categoryEn: "Chambers & Hubs",
    icon: MapPin,
    accentColor: "text-emerald-600 dark:text-emerald-400",
    borderColor: "hover:border-emerald-500/50",
    bgLight: "bg-emerald-500/10",
  },
  {
    slug: "feni-trunk-road-mizan-road-clinic-pharmacy-hub-guide",
    clusterGroupId: "doctors",
    titleBn: "ট্রাঙ্ক ও মিজান রোড স্বাস্থ্যসেবা হাব",
    titleEn: "Trunk & Mizan Road Healthcare Hub",
    subtitleBn: "বিশেষজ্ঞ চেম্বার, ডায়াবেটিক ও মিশন হাসপাতাল এবং ২৪ ঘণ্টা ফার্মেসি",
    subtitleEn: "Specialist chambers, Diabetic & Mission Hospitals & 24/7 pharmacies",
    categoryBn: "চেম্বার হাব ও নেভিগেশন",
    categoryEn: "Chambers & Hubs",
    icon: MapPin,
    accentColor: "text-blue-600 dark:text-blue-400",
    borderColor: "hover:border-blue-500/50",
    bgLight: "bg-blue-500/10",
  },
  {
    slug: "feni-friday-weekend-doctor-chamber-serial-guide",
    clusterGroupId: "doctors",
    titleBn: "শুক্রবার ও উইকেন্ড ডাক্তার তালিকা",
    titleEn: "Friday & Weekend Doctor Chambers",
    subtitleBn: "ঢাকা-চট্টগ্রামের ভিজিটিং প্রফেসর, শিডিউল ও অগ্রিম সিরিয়াল গাইড",
    subtitleEn: "Visiting professors, weekend chamber schedules & direct booking",
    categoryBn: "চেম্বার হাব ও নেভিগেশন",
    categoryEn: "Chambers & Hubs",
    icon: Calendar,
    accentColor: "text-amber-600 dark:text-amber-400",
    borderColor: "hover:border-amber-500/50",
    bgLight: "bg-amber-500/10",
  },
  {
    slug: "feni-female-gynecologist-doctor-chamber-list",
    clusterGroupId: "doctors",
    titleBn: "মহিলা গাইনী ও প্রসূতি ডাক্তার তালিকা",
    titleEn: "Female Gynecologists & Obstetricians",
    subtitleBn: "২০ জন শীর্ষ নারী বিশেষজ্ঞের চেম্বার শিডিউল, ফি ও সরাসরি সিরিয়াল",
    subtitleEn: "Top 20 lady gynecologists, chamber timings, fees & booking",
    categoryBn: "চেম্বার হাব ও নেভিগেশন",
    categoryEn: "Chambers & Hubs",
    icon: Sparkles,
    accentColor: "text-pink-600 dark:text-pink-400",
    borderColor: "hover:border-pink-500/50",
    bgLight: "bg-pink-500/10",
  },
  {
    slug: "feni-evening-doctor-chambers-after-5pm-guide",
    clusterGroupId: "doctors",
    titleBn: "সান্ধ্যকালীন ডাক্তার চেম্বার ও সিরিয়াল",
    titleEn: "Evening Doctor Chambers & Serials",
    subtitleBn: "সন্ধ্যা ৫টার পর বসা ৩২ জন বিশেষজ্ঞ ডাক্তারের চেম্বার ও শিডিউল",
    subtitleEn: "Chamber schedule & serials of 32 specialist doctors after 5 PM",
    categoryBn: "চেম্বার হাব ও নেভিগেশন",
    categoryEn: "Chambers & Hubs",
    icon: Clock,
    accentColor: "text-amber-600 dark:text-amber-400",
    borderColor: "hover:border-amber-500/50",
    bgLight: "bg-amber-500/10",
  },
];
