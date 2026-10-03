import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import JsonLd from "@/components/seo/JsonLd";
import HospitalProfileView from "@/components/partner-hospitals/HospitalProfileView";
import {
  getPartnerByIdAction,
  getDoctorsByPartnerIdAction,
  getRelatedPartnersAction,
  getPartnersAction,
} from "@/app/actions/partnerActions";
import { getPartnerReviewsAction } from "@/app/actions/reviewActions";
import { SITE_URL } from "@/lib/siteConfig";
import { generatePartnerJsonLd } from "@/lib/seo/partnerSchema";

// Pure static SSG: busted on-demand via updateTag("partners") or revalidatePath
export const revalidate = false;

// Pre-render all active partner hospital pages at build time
export async function generateStaticParams() {
  const partners = await getPartnersAction();
  return partners.map((p) => ({
    slug: p.slug || p.id,
  }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  let decodedParam = slug;
  try {
    decodedParam = decodeURIComponent(slug);
  } catch {
    // keep as is
  }

  if (decodedParam === "feni-sadar-hospital" || decodedParam === "feni-sadar-hospital-guide") {
    permanentRedirect("/blog/feni-sadar-hospital-guide");
  }

  const partner = await getPartnerByIdAction(slug);

  if (!partner) {
    notFound();
  }

  const categoryLabel =
    partner.category === "hospital"
      ? "হাসপাতাল"
      : partner.category === "diagnostic"
      ? "ডায়াগনস্টিক সেন্টার"
      : "ফার্মেসি";

  const pageTitle = `${partner.name} (${categoryLabel}, ফেনী) | মেম্বার ডিসকাউন্ট, সেবা ও ডাক্তার শিডিউল`;
  const ogTitle = `${partner.name} (${categoryLabel}, ফেনী) | মেম্বার ডিসকাউন্ট, সেবা ও ডাক্তার শিডিউল - হেলথ ক্লাব`;

  const pageDesc = `${partner.name}, ${partner.address}, ফেনী। হেলথ ক্লাব মেম্বার কার্ডে পান ${partner.discount}। আধুনিক স্বাস্থ্যসেবা, বিশেষজ্ঞ ডাক্তারদের চেম্বার শিডিউল ও হটলাইন: ${partner.phone}।`;

  const canonicalSlug = encodeURIComponent(partner.slug || partner.id);
  const canonicalUrl = `${SITE_URL}/partner-hospitals/${canonicalSlug}`;
  const rawImage = partner.imageUrl?.trim();
  const hasValidImage = Boolean(rawImage && rawImage.length > 0);
  const ogImage = hasValidImage
    ? (rawImage!.startsWith("http") ? rawImage! : `${SITE_URL}${rawImage!.startsWith("/") ? "" : "/"}${rawImage!}`)
    : `${SITE_URL}/og-image.png`;

  const imageDimensions = hasValidImage
    ? { width: 800, height: 800 }
    : { width: 1200, height: 630 };

  return {
    title: pageTitle,
    description: pageDesc,
    alternates: {
      canonical: canonicalUrl,
    },
    keywords: [
      partner.name,
      partner.address,
      `${partner.name} feni`,
      `${partner.name} phone number`,
      `${partner.name} doctors list`,
      `${partner.name} serial`,
      `${partner.name} discount`,
      "feni hospital discount",
      "feni diagnostic center",
      "Health Club partner hospital",
      "ফেনী হাসপাতাল",
      "ফেনী ডায়াগনস্টিক সেন্টার",
      "মেডিকেল ডিসকাউন্ট ফেনী",
      "ফেনী প্যাথলজি ল্যাব",
    ],
    openGraph: {
      title: ogTitle,
      description: pageDesc,
      url: canonicalUrl,
      type: "website",
      images: [
        {
          url: ogImage,
          width: imageDimensions.width,
          height: imageDimensions.height,
          alt: partner.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: pageDesc,
      images: [ogImage],
    },
  };
}

export default async function PartnerHospitalDetailPage({ params }: PageProps) {
  const { slug } = await params;
  let decodedParam = slug;
  try {
    decodedParam = decodeURIComponent(slug);
  } catch {
    // keep as is
  }

  if (decodedParam === "feni-sadar-hospital" || decodedParam === "feni-sadar-hospital-guide") {
    permanentRedirect("/blog/feni-sadar-hospital-guide");
  }

  const partner = await getPartnerByIdAction(slug);

  if (!partner) {
    notFound();
  }

  if (partner.slug && decodedParam !== partner.slug) {
    permanentRedirect(`/partner-hospitals/${encodeURIComponent(partner.slug)}`);
  }

  const [doctors, relatedPartners, reviewData] = await Promise.all([
    getDoctorsByPartnerIdAction(partner.id),
    getRelatedPartnersAction(partner.category, partner.id, 3),
    getPartnerReviewsAction(partner.id),
  ]);

  const jsonLdData = generatePartnerJsonLd({
    partner,
    doctors,
    reviews: reviewData.reviews,
    stats: reviewData.stats,
  });

  return (
    <>
      <JsonLd data={jsonLdData} />
      <HospitalProfileView
        partner={partner}
        doctors={doctors}
        relatedPartners={relatedPartners}
        initialStats={reviewData.stats}
        initialReviews={reviewData.reviews}
      />
    </>
  );
}
