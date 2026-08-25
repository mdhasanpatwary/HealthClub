import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { Locale } from "@/lib/i18n";
import JsonLd from "@/components/seo/JsonLd";
import DoctorProfileView from "@/components/consultants/DoctorProfileView";
import { getDoctorByIdAction, getRelatedDoctorsAction } from "@/app/actions/doctorActions";
import { SITE_URL } from "@/lib/siteConfig";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const doctor = await getDoctorByIdAction(id);
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "bn";
  const isEn = locale === "en";

  if (!doctor) {
    const notFoundTitle = isEn ? "Doctor Not Found - Health Club" : "ডাক্তার পাওয়া যায়নি - হেলথ ক্লাব";
    const notFoundDesc = isEn
      ? "The requested doctor profile could not be found in Health Club directory."
      : "অনুরোধকৃত ডাক্তারের প্রোফাইল হেলথ ক্লাব ডিরেক্টরিতে পাওয়া যায়নি।";
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

  const pageTitle = isEn
    ? `${doctor.name} - ${doctor.specialty} in Feni | Chamber & Serial - Health Club`
    : `${doctor.name} - ${doctor.specialty} (ফেনী) | চেম্বার শিডিউল ও সিরিয়াল - হেলথ ক্লাব`;

  const pageDesc = isEn
    ? `${doctor.name} (${doctor.specialty}), ${doctor.degrees}. Chamber: ${doctor.chamberName}, ${doctor.chamberAddress}. Visiting: ${doctor.visitingDays} (${doctor.visitingHours}). Call serial: ${doctor.serialPhone}.`
    : `${doctor.name}, ${doctor.specialty}, ${doctor.degrees}। চেম্বার: ${doctor.chamberName}, ${doctor.chamberAddress}। রোগী দেখার সময়: ${doctor.visitingDays} (${doctor.visitingHours})। সরাসরি সিরিয়াল কল করুন: ${doctor.serialPhone}।`;

  const canonicalUrl = `${SITE_URL}/consultants/${doctor.id}`;
  const rawImage = doctor.imageUrl?.trim();
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
      doctor.name,
      doctor.specialty,
      doctor.department,
      doctor.chamberName,
      `${doctor.name} serial`,
      `${doctor.name} chamber`,
      `${doctor.name} feni`,
      "feni doctor serial number",
      "feni specialist doctors",
      "ফেনী ডাক্তার",
      "ফেনী ডাক্তার সিরিয়াল",
      "ফেনীর বিশেষজ্ঞ ডাক্তার",
      "Health Club doctor directory",
    ],
    openGraph: {
      title: pageTitle,
      description: pageDesc,
      url: canonicalUrl,
      type: "profile",
      images: [
        {
          url: ogImage,
          width: imageDimensions.width,
          height: imageDimensions.height,
          alt: doctor.name,
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

export default async function DoctorDetailPage({ params }: PageProps) {
  const { id } = await params;
  const doctor = await getDoctorByIdAction(id);

  if (!doctor) {
    notFound();
  }

  const relatedDoctors = await getRelatedDoctorsAction(doctor.department, doctor.id, 4);

  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "bn";
  const isEn = locale === "en";

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
          name: isEn ? "Specialist Doctors" : "বিশেষজ্ঞ ডাক্তারগণ",
          item: `${SITE_URL}/consultants`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: doctor.name,
          item: `${SITE_URL}/consultants/${doctor.id}`,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Physician",
      name: doctor.name,
      image: doctor.imageUrl || `${SITE_URL}/og-image.png`,
      medicalSpecialty: doctor.specialty,
      jobTitle: doctor.designation,
      telephone: doctor.serialPhone,
      priceRange: doctor.consultationFee || "৳৳",
      url: `${SITE_URL}/consultants/${doctor.id}`,
      description: `${doctor.name} is a specialist in ${doctor.specialty} practicing at ${doctor.chamberName}, Feni.`,
      worksFor: {
        "@type": "MedicalOrganization",
        name: doctor.chamberName,
        address: {
          "@type": "PostalAddress",
          streetAddress: doctor.chamberAddress,
          addressLocality: "Feni",
          addressRegion: "Chittagong Division",
          addressCountry: "BD",
        },
      },
      address: {
        "@type": "PostalAddress",
        streetAddress: doctor.chamberAddress,
        addressLocality: "Feni",
        addressRegion: "Chittagong Division",
        addressCountry: "BD",
      },
    },
  ];

  return (
    <>
      <JsonLd data={jsonLdData} />
      <DoctorProfileView doctor={doctor} relatedDoctors={relatedDoctors} />
    </>
  );
}
