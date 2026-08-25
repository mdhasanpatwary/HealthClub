import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { Locale } from "@/lib/i18n";
import JsonLd from "@/components/seo/JsonLd";
import HospitalProfileView from "@/components/partner-hospitals/HospitalProfileView";
import {
  getPartnerByIdAction,
  getDoctorsByPartnerIdAction,
  getRelatedPartnersAction,
} from "@/app/actions/partnerActions";
import { getPartnerReviewsAction } from "@/app/actions/reviewActions";
import { SITE_URL } from "@/lib/siteConfig";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const partner = await getPartnerByIdAction(id);
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "bn";
  const isEn = locale === "en";

  if (!partner) {
    const notFoundTitle = isEn
      ? "Partner Facility Not Found - Health Club"
      : "পার্টনার প্রতিষ্ঠান পাওয়া যায়নি - হেলথ ক্লাব";
    const notFoundDesc = isEn
      ? "The requested partner hospital or clinic could not be found in Health Club directory."
      : "অনুরোধকৃত হাসপাতাল বা ডায়াগনস্টিক সেন্টার হেলথ ক্লাব ডিরেক্টরিতে পাওয়া যায়নি।";
    return {
      title: notFoundTitle,
      description: notFoundDesc,
      openGraph: {
        title: notFoundTitle,
        description: notFoundDesc,
        images: [
          {
            url: `${SITE_URL}/og-image.png`,
            width: 1200,
            height: 630,
            alt: "Health Club",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: notFoundTitle,
        description: notFoundDesc,
        images: [`${SITE_URL}/og-image.png`],
      },
    };
  }

  const categoryLabel =
    partner.category === "hospital"
      ? isEn ? "Hospital" : "হাসপাতাল"
      : partner.category === "diagnostic"
      ? isEn ? "Diagnostic Center" : "ডায়াগনস্টিক সেন্টার"
      : isEn ? "Pharmacy" : "ফার্মেসি";

  const pageTitle = isEn
    ? `${partner.name} (${categoryLabel}) in Feni | Member Discounts & Doctor Schedule - Health Club`
    : `${partner.name} (${categoryLabel}, ফেনী) | মেম্বার ডিসকাউন্ট, সেবা ও ডাক্তার শিডিউল - হেলথ ক্লাব`;

  const pageDesc = isEn
    ? `${partner.name} at ${partner.address}, Feni. Avail ${partner.discount} with Health Club Member Card. Verified facilities, resident specialist doctors & 24/7 hotline: ${partner.phone}.`
    : `${partner.name}, ${partner.address}, ফেনী। হেলথ ক্লাব মেম্বার কার্ডে পান ${partner.discount}। আধুনিক স্বাস্থ্যসেবা, বিশেষজ্ঞ ডাক্তারদের চেম্বার শিডিউল ও হটলাইন: ${partner.phone}।`;

  const canonicalUrl = `${SITE_URL}/partner-hospitals/${partner.id}`;
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
      title: pageTitle,
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
      title: pageTitle,
      description: pageDesc,
      images: [ogImage],
    },
  };
}

export default async function PartnerHospitalDetailPage({ params }: PageProps) {
  const { id } = await params;
  const partner = await getPartnerByIdAction(id);

  if (!partner) {
    notFound();
  }

  const [doctors, relatedPartners, reviewData] = await Promise.all([
    getDoctorsByPartnerIdAction(partner.id),
    getRelatedPartnersAction(partner.category, partner.id, 3),
    getPartnerReviewsAction(partner.id),
  ]);

  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "bn";
  const isEn = locale === "en";

  const schemaType =
    partner.category === "hospital"
      ? "Hospital"
      : partner.category === "pharmacy"
      ? "Pharmacy"
      : "MedicalBusiness";

  const jsonLdData = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: isEn ? "Home" : "হোম",
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: isEn ? "Partner Network" : "পার্টনার নেটওয়ার্ক",
          item: `${SITE_URL}/partner-hospitals`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: partner.name,
          item: `${SITE_URL}/partner-hospitals/${partner.id}`,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": schemaType,
      name: partner.name,
      image: partner.imageUrl || `${SITE_URL}/og-image.png`,
      telephone: partner.phone,
      priceRange: partner.discount,
      url: `${SITE_URL}/partner-hospitals/${partner.id}`,
      description: `${partner.name} is a partner ${partner.category} in Feni offering healthcare discounts for Health Club members.`,
      ...(reviewData.stats.totalReviews > 0
        ? {
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: reviewData.stats.averageRating,
              reviewCount: reviewData.stats.totalReviews,
              bestRating: "5",
              worstRating: "1",
            },
          }
        : {}),
      address: {
        "@type": "PostalAddress",
        streetAddress: partner.address,
        addressLocality: "Feni",
        addressRegion: "Chittagong Division",
        addressCountry: "BD",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: "23.0159",
        longitude: "91.3976",
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          opens: "00:00",
          closes: "23:59",
        },
      ],
    },
  ];

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
