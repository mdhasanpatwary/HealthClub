import Link from "next/link";
import { ChevronLeft, Phone, Siren, ShieldCheck } from "lucide-react";
import { BlogPost, BlogPostCardItem } from "@/types/blog";
import { toBanglaNums } from "@/lib/utils";
import { BlogArticleHeader } from "./BlogArticleHeader";
import { BlogMedicalReviewerBadge } from "./BlogMedicalReviewerBadge";
import { GeoAnswerCapsule } from "./GeoAnswerCapsule";
import { BlogTableOfContents } from "./BlogTableOfContents";
import { BlogReadingProgress } from "./BlogReadingProgress";
import { BlogFloatingTocButton } from "./BlogFloatingTocButton";
import { BlogSidebar } from "./BlogSidebar";
import { BlogMembershipBanner } from "./BlogMembershipBanner";
import { DoctorSpecialtySection } from "./DoctorSpecialtySection";
import { DoctorChamberHubs } from "./DoctorChamberHubs";
import { DoctorBookingGuide } from "./DoctorBookingGuide";
import { BlogSpecializedSections } from "./BlogSpecializedSections";
import { BlogFAQSection } from "./BlogFAQSection";
import { BlogClinicalSources } from "./BlogClinicalSources";
import { BlogCitationBlock } from "./BlogCitationBlock";
import { BlogShareBar } from "./BlogShareBar";
import { BlogCard } from "./BlogCard";
import { BlogClusterMesh } from "./BlogClusterMesh";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { BlogLiveDoctorRoster } from "./BlogLiveDoctorRoster";
import { Doctor } from "@/services/db";
import { getDiagnosticTocTitles } from "@/app/blog/utils/blogDiagnosticMetadata";
import { SPECIALIZED_HUB_HEADERS } from "@/app/blog/utils/blogHubHeaders";
import { BlogEmbeddedTool } from "./BlogEmbeddedTool";
import { getHighDensityBlogFaqs } from "@/app/blog/utils/blogAeoFaqUtils";
import { BlogMarkdownParagraphs } from "./BlogMarkdownParagraphs";
import {
  formatAeoOverviewHeading,
  formatAeoSelectionHeading,
  formatAeoEmergencyHeading,
  getOverviewDirectAnswer,
  getSelectionDirectAnswer,
  getEmergencyDirectAnswer,
  checkHasPricingGuide,
} from "@/app/blog/utils/blogAeoHeadingUtils";

interface BlogPostDetailViewProps {
  post: BlogPost;
  pageUrl: string;
  relatedPosts: BlogPostCardItem[];
  liveDoctors?: Doctor[];
  liveDepartment?: string;
}

export function BlogPostDetailView({
  post,
  pageUrl,
  relatedPosts,
  liveDoctors = [],
  liveDepartment,
}: BlogPostDetailViewProps) {
  const title = post.titleBn;
  const introParagraphs = post.introParagraphsBn || [];
  const selectionGuide = post.selectionGuideBn;
  const emergencyDirectory = post.emergencyDirectoryBn;
  const bookingGuide = post.bookingGuideBn;
  const hubHeader = SPECIALIZED_HUB_HEADERS[post.slug];

  const hasPricingGuide = checkHasPricingGuide(post);

  const isPurePriceList = post.slug === "feni-medical-test-price-list";
  const isUpazilaArticle = Boolean(
    post.slug.includes("healthcare-guide") || post.slug.includes("patient-guide")
  );
  const hasDoctorGroups = Boolean(post.doctorGroups && post.doctorGroups.length > 0);

  const selectionGuideNumber = isPurePriceList
    ? 3
    : isUpazilaArticle
      ? 8
      : hasDoctorGroups
        ? (hasPricingGuide ? 6 : 5)
        : (hasPricingGuide ? 5 : 4);

  const emergencyDirectoryNumber = isPurePriceList
    ? 4
    : isUpazilaArticle
      ? 9
      : selectionGuide
        ? selectionGuideNumber + 1
        : selectionGuideNumber;

  return (
    <div className="min-h-screen bg-background pb-16">
      <BlogReadingProgress />

      {/* Breadcrumb Navigation */}
      <div className="border-b border-border/50 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between text-xs sm:text-sm text-muted-foreground">
          <Link
            href="/blog"
            prefetch={false}
            className="inline-flex items-center gap-1 hover:text-primary transition-colors font-medium shrink-0 mr-4"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>সকল ব্লগ</span>
          </Link>

          <Breadcrumbs
            items={[
              { label: "হোম", href: "/" },
              { label: "ব্লগ", href: "/blog" },
              { label: title },
            ]}
          />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 space-y-12">
        <article>
          {/* Content Layout: 8 cols main, 4 cols sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            <div className="lg:col-span-8 space-y-10 min-w-0">
              {/* Article Header (Title, Author, Highlights) */}
              <BlogArticleHeader post={post} pageUrl={pageUrl} />

              {/* Medical Reviewer E-E-A-T Badge */}
              <BlogMedicalReviewerBadge post={post} />

              {/* Standardized GEO Answer Capsule (BLUF) */}
              <GeoAnswerCapsule post={post} />

              {/* Mobile Table of Contents (Direct in-flow jump menu) */}
              <div id="mobile-toc" className="lg:hidden scroll-mt-24">
                <BlogTableOfContents
                  hospitals={post.hospitals}
                  doctorGroups={post.doctorGroups}
                  diagnosticCenters={post.diagnosticCenters}
                  dentalClinics={post.dentalClinics}
                  physiotherapyCenters={post.physiotherapyCenters}
                  hasMaternityPricing={!!post.maternityCarePricingBn}
                  hasCardiacPricing={!!post.cardiacCarePricingBn}
                  hasKidneyPricing={!!post.kidneyCarePricingBn}
                  hasPediatricPricing={!!post.pediatricCarePricingBn}
                  hasSkinPricing={!!post.skinCarePricingBn}
                  hasEyePricing={!!post.eyeCarePricingBn}
                  hasOrthopedicPricing={!!post.orthopedicCarePricingBn}
                  hasEntPricing={!!post.entCarePricingBn}
                  hasSurgeryPricing={!!post.surgicalCarePricingBn}
                  hasNeurologyPricing={!!post.neurologyCarePricingBn}
                  hasDiabetesPricing={!!post.diabetesCarePricingBn}
                  hasPsychiatryPricing={!!post.psychiatryCarePricingBn}
                  hasSadarHospitalPricing={!!post.sadarHospitalPricingBn}
                  hasDiabeticHospitalPricing={!!post.diabeticHospitalPricingBn}
                  hasPharmacyPricing={!!post.pharmacyCarePricingBn}
                  hasBloodPricing={!!post.bloodCarePricingBn}
                  hasAmbulancePricing={!!post.ambulanceCarePricingBn}
                  hasCriticalCarePricing={!!post.criticalCarePricingBn}
                  hasStrokeCardiacPricing={!!post.strokeCardiacPricingBn}
                  hasHomeCarePricing={!!post.homeCarePricingBn}
                  hasOxygenPricing={!!post.oxygenPricingBn}
                  hasDengueTyphoidPricing={!!post.dengueTyphoidPricingBn}
                  hasUpazilaPricing={!!post.upazilaCarePricingBn}
                  pharmacies={post.pharmacies}
                  bloodBanks={post.bloodBanks}
                  ambulances={post.ambulances}
                  currentSlug={post.slug}
                  defaultOpen={false}
                />
              </div>

              {/* Overview / Introduction with AEO Conversational Direct Answer Capsule */}
              <section id="overview" className="scroll-mt-24 space-y-5">
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
                  {`১. ${formatAeoOverviewHeading(
                    post.slug,
                    isPurePriceList
                      ? "ফেনীর ডায়াগনস্টিক পরিকাঠামো ও প্রেক্ষাপট"
                      : post.slug === "feni-doctor-serial-appointment-guide"
                        ? "ফেনীতে ডাক্তার সিরিয়াল ও স্বাস্থ্যসেবা"
                        : post.slug === "best-dental-specialists-in-feni"
                          ? "ফেনীতে আধুনিক ডেন্টাল কেয়ার"
                          : post.slug === "feni-hospital-road-ss-k-road-chamber-hub-guide"
                            ? "হাসপাতাল রোড ও এসএসকে রোড স্বাস্থ্যসেবা করিডোর"
                            : post.slug === "feni-trunk-road-mizan-road-clinic-pharmacy-hub-guide"
                              ? "ট্রাঙ্ক রোড ও মিজান রোড স্বাস্থ্যসেবা হাব"
                              : post.slug === "feni-friday-weekend-doctor-chamber-serial-guide"
                                ? "শুক্রবার ও ছুটির দিনে বিশেষজ্ঞ ডাক্তার স্বাস্থ্যসেবা"
                                : isUpazilaArticle
                                  ? "উপজেলা স্বাস্থ্যসেবা ও পটভূমি"
                                  : getDiagnosticTocTitles(post.slug).overviewTitle
                  )}`}
                </h2>

                {/* Self-contained 1-2 sentence direct answer capsule for AEO & Voice Search */}
                <div
                  id="article-quick-summary"
                  className="rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:p-5 space-y-1.5"
                >
                  <span className="text-[11px] uppercase tracking-wider font-bold text-primary block">
                    সরাসরি প্রশ্নোত্তর ও মূল তথ্য (Quick Answer)
                  </span>
                  <p className="text-sm sm:text-base font-medium text-foreground leading-relaxed">
                    {getOverviewDirectAnswer(post)}
                  </p>
                </div>

                <BlogMarkdownParagraphs paragraphs={introParagraphs} />
              </section>

              {/* Interactive Health Calculator Tool (Dwell Time Multiplier) */}
              <BlogEmbeddedTool
                tool={post.embeddedTool}
                slug={post.slug}
                category={post.category}
              />

              {/* Doctor Specialty Sections */}
              {post.doctorGroups && post.doctorGroups.length > 0 && (
                <DoctorSpecialtySection
                  doctorGroups={post.doctorGroups}
                  titleBn={
                    isUpazilaArticle
                      ? "২. উপজেলা অনুযায়ী বিশেষজ্ঞ ডাক্তার তালিকা"
                      : hubHeader?.doctorTitle
                  }
                  subtitleBn={
                    isUpazilaArticle
                      ? "উপজেলার স্থানীয় ভিজিটিং বিশেষজ্ঞ ও ফেনী সদর রেফারেল চিকিৎসকদের চেম্বার শিডিউল।"
                      : hubHeader?.doctorSubtitle
                  }
                />
              )}

              {/* Dynamic Live Doctor Roster from Database */}
              {liveDoctors && liveDoctors.length > 0 && (
                <BlogLiveDoctorRoster
                  doctors={liveDoctors}
                  department={liveDepartment}
                />
              )}

              {/* Doctor Chamber Hubs */}
              {post.chamberHubsBn && post.chamberHubsBn.length > 0 && (
                <DoctorChamberHubs
                  hubs={post.chamberHubsBn}
                  titleBn={
                    isUpazilaArticle
                      ? "৩. উপজেলার প্রধান চেম্বার হাবসমূহ"
                      : hubHeader?.hubTitle
                  }
                  subtitleBn={
                    isUpazilaArticle
                      ? "পৌর বাজার, হাসপাতাল রোড ও হাইওয়ে সংলগ্ন প্রধান চেম্বার লোকেশন ও যাতায়াত নির্দেশিকা।"
                      : hubHeader?.hubSubtitle
                  }
                />
              )}

              {/* Doctor Serial Booking Guide */}
              {bookingGuide && (
                <DoctorBookingGuide guide={bookingGuide} />
              )}

              {/* Specialized Reviews, Comparison Matrix & Pricing Guides */}
              <BlogSpecializedSections post={post} />

              {/* Selection Guide */}
              {selectionGuide && (
                <section id="selection-guide" className="scroll-mt-24 space-y-5">
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
                    {`${toBanglaNums(selectionGuideNumber)}. `}
                    {formatAeoSelectionHeading(selectionGuide.titleBn)}
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {getSelectionDirectAnswer(post)}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(
                      selectionGuide.pointsBn ||
                      (selectionGuide as unknown as { criteria?: { title: string; desc: string }[] }).criteria ||
                      (selectionGuide as unknown as { points?: { title: string; desc: string }[] }).points ||
                      []
                    ).map((pt, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl border border-border/80 bg-card p-5 space-y-2"
                      >
                        <h3 className="font-heading text-base font-bold text-primary flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-primary" />
                          <span>{pt.title}</span>
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          {pt.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Health Club Member Discount Banner (Hidden for pure emergency public directory guides) */}
              {post.slug !== "feni-ambulance-and-oxygen-service-guide" && (
                <BlogMembershipBanner />
              )}

              {/* Emergency Hotline Directory */}
              {emergencyDirectory && (
                <section id="emergency-directory" className="scroll-mt-24 space-y-4">
                  <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                    <Siren className="h-5 w-5" />
                    <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
                      {`${toBanglaNums(emergencyDirectoryNumber)}. `}
                      {formatAeoEmergencyHeading(emergencyDirectory.titleBn)}
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {getEmergencyDirectAnswer(post)}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(emergencyDirectory.services || []).map((item, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4 flex items-center justify-between gap-3"
                      >
                        <div className="space-y-0.5 min-w-0">
                          <span className="font-bold text-xs sm:text-sm text-foreground block truncate">
                            {item.name}
                          </span>
                          <span className="text-[11px] text-muted-foreground block truncate">
                            {item.note}
                          </span>
                        </div>
                        {item.phone && (
                          <a
                            href={`tel:${item.phone.replace(/[^0-9]/g, "")}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold shadow-xs hover:bg-rose-700 transition-colors shrink-0"
                          >
                            <Phone className="h-3 w-3" />
                            <span>{item.phone}</span>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* FAQ Accordion (AEO & Voice Search Optimized) */}
              <BlogFAQSection faqs={getHighDensityBlogFaqs(post)} />

              {/* Medical Trust & Editorial Policy Disclaimer */}
              <aside
                aria-label="মেডিকেল তথ্য নির্দেশিকা ও ডিসক্লেইমার"
                className="rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:p-5 flex items-start gap-3.5 text-xs text-muted-foreground"
              >
                <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="space-y-1 leading-relaxed">
                  <p className="font-bold text-foreground">
                    মেডিকেল তথ্য যাচাই ও ক্লিনিক্যাল ডিসক্লেইমার
                  </p>
                  <p>
                    এই স্বাস্থ্য গাইডের তথ্যসমূহ জাতীয় স্বাস্থ্য প্রটোকল ও BMDC নিবন্ধিত বিশেষজ্ঞ চিকিৎসকের পর্যালোচনায় সাধারণ মানুষের সচেতনতার জন্য প্রকাশিত। এটি কোনো অবস্থাতেই চিকিৎসকের সরাসরি পরামর্শ বা প্রেসক্রিপশনের বিকল্প নয়।
                  </p>
                  <p className="pt-0.5">
                    <Link
                      href="/editorial-policy"
                      prefetch={false}
                      className="text-primary font-medium hover:underline inline-flex items-center gap-1"
                    >
                      <span>আমাদের সম্পূর্ণ এডিটোরিয়াল ও ফ্যাক্ট-চেকিং নীতিমালা পড়ুন</span> →
                    </Link>
                  </p>
                </div>
              </aside>

              {/* Clinical Sources & DGHS/BMDC Evidence Guidelines */}
              <BlogClinicalSources sources={post.clinicalSources} post={post} />

              {/* GEO Citation Attribution Block */}
              <BlogCitationBlock
                title={title}
                titleEn={post.titleEn}
                publishedDate={post.publishedDate}
                modifiedDate={post.modifiedDate}
                canonicalUrl={pageUrl}
                authorName={post.author.nameBn}
              />

              {/* Bottom Share Bar */}
              <div className="p-5 rounded-2xl border border-border/70 bg-card flex flex-col gap-4">
                <span className="text-xs sm:text-sm font-medium text-foreground">
                  তথ্যটি প্রয়োজনীয় মনে হলে পরিবার ও পরিচিতজনদের সাথে শেয়ার করুন!
                </span>
                <BlogShareBar url={pageUrl} title={title} />
              </div>
            </div>

            {/* Sticky Sidebar */}
            <BlogSidebar
              currentSlug={post.slug}
              hospitals={post.hospitals}
              doctorGroups={post.doctorGroups}
              diagnosticCenters={post.diagnosticCenters}
              dentalClinics={post.dentalClinics}
              physiotherapyCenters={post.physiotherapyCenters}
              hasMaternityPricing={!!post.maternityCarePricingBn}
              hasCardiacPricing={!!post.cardiacCarePricingBn}
              hasKidneyPricing={!!post.kidneyCarePricingBn}
              hasPediatricPricing={!!post.pediatricCarePricingBn}
              hasSkinPricing={!!post.skinCarePricingBn}
              hasEyePricing={!!post.eyeCarePricingBn}
              hasOrthopedicPricing={!!post.orthopedicCarePricingBn}
              hasEntPricing={!!post.entCarePricingBn}
              hasSurgeryPricing={!!post.surgicalCarePricingBn}
              hasNeurologyPricing={!!post.neurologyCarePricingBn}
              hasDiabetesPricing={!!post.diabetesCarePricingBn}
              hasPsychiatryPricing={!!post.psychiatryCarePricingBn}
              hasSadarHospitalPricing={!!post.sadarHospitalPricingBn}
              hasDiabeticHospitalPricing={!!post.diabeticHospitalPricingBn}
              hasPharmacyPricing={!!post.pharmacyCarePricingBn}
              hasBloodPricing={!!post.bloodCarePricingBn}
              hasAmbulancePricing={!!post.ambulanceCarePricingBn}
              hasCriticalCarePricing={!!post.criticalCarePricingBn}
              hasStrokeCardiacPricing={!!post.strokeCardiacPricingBn}
              hasHomeCarePricing={!!post.homeCarePricingBn}
              hasOxygenPricing={!!post.oxygenPricingBn}
              hasDengueTyphoidPricing={!!post.dengueTyphoidPricingBn}
              hasUpazilaPricing={!!post.upazilaCarePricingBn}
              pharmacies={post.pharmacies}
              bloodBanks={post.bloodBanks}
              ambulances={post.ambulances}
            />
          </div>
        </article>

        {/* Feni Healthcare Topic Cluster Navigation Mesh */}
        <section aria-label="ফেনী স্বাস্থ্যসেবা গাইড নেটওয়ার্ক">
          <BlogClusterMesh currentSlug={post.slug} />
        </section>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <aside
            aria-label="আরও প্রয়োজনীয় স্বাস্থ্য গাইড"
            className="pt-10 border-t border-border/60 space-y-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-2xl font-bold text-foreground">
                আরও প্রয়োজনীয় স্বাস্থ্য গাইড
              </h3>
              <Link
                href="/blog"
                prefetch={false}
                className="text-xs sm:text-sm font-semibold text-primary hover:underline"
              >
                সকল ব্লগ দেখুন →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((rPost) => (
                <BlogCard
                  key={rPost.slug}
                  post={rPost}
                  priority={rPost.coverImage === post.coverImage}
                />
              ))}
            </div>
          </aside>
        )}

        {/* Floating Mobile TOC / Back to Top Button */}
        <BlogFloatingTocButton />
      </div>
    </div>
  );
}
