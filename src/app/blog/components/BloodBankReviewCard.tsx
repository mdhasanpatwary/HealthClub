import Link from "next/link";
import {
  MapPin,
  Phone,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Clock,
  Heart,
  Droplet,
  Users,
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BloodBankReviewItem } from "@/types/bloodBankBlog";
import { BlogReviewCardWrapper } from "./BlogReviewCardWrapper";

interface BloodBankReviewCardProps {
  bank: BloodBankReviewItem;
}

export function BloodBankReviewCard({
  bank,
}: BloodBankReviewCardProps) {
  const name = bank.nameBn || bank.nameEn;
  const address = bank.addressBn || bank.addressEn;
  const typeName = bank.typeBn || bank.typeEn;
  const hubName = bank.hubBn || bank.hubEn;
  const description = bank.descriptionBn ||
    `${bank.nameBn} ফেনীর একটি বিশ্বস্ত রক্ত পরিসঞ্চালন ও রক্তদাতা সমন্বয় কেন্দ্র, যেখানে নিরাপদ রক্ত পরিসঞ্চালন এবং জরুরি রোগী সেবায় স্বেচ্ছাসেবী নেটওয়ার্ক কাজ করে।`;

  const keyFeatures = bank.keyFeaturesBn;
  const servicesOffered = bank.servicesOfferedBn;
  const openHours = bank.openHoursBn;

  const sectionId = `blood-bank-${bank.rank}`;

  return (
    <BlogReviewCardWrapper
      sectionId={sectionId}
      rank={bank.rank}
      partnerStatus={bank.partnerStatus}
    >
      {/* Header: Names + Badges */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="text-xs font-medium border-border/80">
              {typeName}
            </Badge>

            <Badge
              variant="outline"
              className="text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 inline-flex items-center gap-1"
            >
              <MapPin className="h-3 w-3 text-primary shrink-0" />
              <span>{hubName}</span>
            </Badge>

            {bank.partnerStatus && (
              <Badge className="bg-emerald-600 dark:bg-emerald-700 text-white font-semibold flex items-center gap-1 shadow-xs">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>হেলথ ক্লাব ভেরিফায়েড পার্টনার</span>
              </Badge>
            )}
          </div>

          <h3 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            {name}
          </h3>

          {/* Address */}
          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground pt-0.5">
            <MapPin className="h-4 w-4 text-primary shrink-0" />
            <span>{address}</span>
          </div>
        </div>

        {/* Quick Attribute Badges */}
        <div className="flex flex-wrap sm:flex-col sm:items-end gap-2 shrink-0">
          {bank.is24x7 ? (
            <span className="inline-flex items-center gap-1.5 text-xs bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20 px-2.5 py-1 rounded-lg font-bold">
              <Droplet className="h-3.5 w-3.5 fill-rose-500 text-rose-500" />
              <span>২৪/৭ জরুরি রক্ত সেবা</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-lg font-semibold">
              <Clock className="h-3.5 w-3.5" />
              <span>{openHours}</span>
            </span>
          )}

          {bank.bloodTestingFacility && (
            <span className="inline-flex items-center gap-1.5 text-xs bg-sky-500/10 text-sky-700 dark:text-sky-400 border border-sky-500/20 px-2.5 py-1 rounded-lg font-semibold">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>বাধ্যতামূলক ৫টি রোগ স্ক্রিনিং ল্যাব</span>
            </span>
          )}

          {bank.voluntaryDonorsNetwork && (
            <span className="inline-flex items-center gap-1.5 text-xs bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-lg font-semibold">
              <Users className="h-3.5 w-3.5" />
              <span>স্বেচ্ছাসেবী রক্তদাতা নেটওয়ার্ক</span>
            </span>
          )}

          {bank.rareGroupSupport && (
            <span className="inline-flex items-center gap-1.5 text-xs bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/20 px-2.5 py-1 rounded-lg font-semibold">
              <Heart className="h-3.5 w-3.5 text-purple-500" />
              <span>দুর্লভ নেগেটিভ রক্তের জরুরি সেল</span>
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed pt-1">
        {description}
      </p>

      {/* Schedule & Operational Timing Banner */}
      <div className="rounded-xl border border-border/70 bg-muted/40 p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
        <div className="space-y-1">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
            রক্ত সেবার ধরন ও প্রাপ্তিসাধ্যতা
          </span>
          <span className="font-medium text-foreground flex items-center gap-1.5">
            <Droplet className="h-4 w-4 text-rose-600 shrink-0" />
            <span>
              {bank.bloodBagCollection
                ? "রক্ত সংরক্ষণাগার ও সার্বক্ষণিক ল্যাব"
                : "জরুরি স্বেচ্ছাসেবী রক্তদাতা সমন্বয়"}
            </span>
          </span>
        </div>
        <div className="space-y-1">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
            কার্যক্রম ও হেল্পলাইন সময়সূচি
          </span>
          <span className="font-medium text-foreground flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-primary shrink-0" />
            <span>{openHours}</span>
          </span>
        </div>
      </div>

      {/* Key Features & Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Key Features */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
            <span>প্রধান সুবিধা ও নিরাপত্তা বৈশিষ্ট্য</span>
          </h4>
          <ul className="space-y-1.5 text-xs sm:text-sm text-foreground/90">
            {keyFeatures.map((feat, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Services Offered */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Heart className="h-3.5 w-3.5 text-rose-500" />
            <span>সেবা ও সহায়তা কার্যক্রম</span>
          </h4>
          <ul className="space-y-1.5 text-xs sm:text-sm text-foreground/90">
            {servicesOffered.map((serv, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                <span>{serv}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer: Contacts + Call to Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-border/70">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={`tel:${bank.phone.replace(/[^0-9]/g, "")}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-600 text-white font-semibold text-xs sm:text-sm hover:bg-rose-700 transition-colors shadow-xs"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>{`কল করুন: ${bank.phone}`}</span>
            </a>

            {bank.hotline && (
              <a
                href={`tel:${bank.hotline.replace(/[^0-9]/g, "")}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-muted text-foreground/90 font-medium text-xs hover:bg-muted/80 transition-colors"
              >
                <span>{`হটলাইন: ${bank.hotline}`}</span>
              </a>
            )}

            {bank.emergencyContact && (
              <a
                href={`tel:${bank.emergencyContact.replace(/[^0-9]/g, "")}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-muted text-foreground/90 font-medium text-xs hover:bg-muted/80 transition-colors"
              >
                <span>{`জরুরি: ${bank.emergencyContact}`}</span>
              </a>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/emergency"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary/10 text-primary font-semibold text-xs hover:bg-primary/20 transition-colors border border-primary/20"
          >
            <Search className="h-3.5 w-3.5" />
            <span>লাইভ রক্তদাতা খুঁজুন</span>
            <ExternalLink className="h-3 w-3" />
          </Link>

          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
            {bank.partnerDiscountBn || "১০০% নিঃস্বার্থ স্বেচ্ছাসেবী সেবা"}
          </span>
        </div>
      </div>
    </BlogReviewCardWrapper>
  );
}
