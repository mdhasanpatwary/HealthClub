import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import JsonLd from "@/components/seo/JsonLd";
import DoctorProfileView from "@/components/consultants/DoctorProfileView";
import { getDoctorByIdAction, getDoctorsAction, getRelatedDoctorsAction } from "@/app/actions/doctorActions";
import { SITE_URL } from "@/lib/siteConfig";
import { generateDoctorJsonLd } from "@/lib/seo/doctorSchema";
import {
  formatDoctorMetaTitle,
  formatDoctorMetaDescription,
  generateDoctorKeywords,
} from "@/data/doctorSeoData";

// Pre-rendered static pages; busted on-demand via updateTag("doctors") or revalidatePath
export const revalidate = false;

// Pre-render all active doctor pages at build time so zero CPU is spent on first visit
export async function generateStaticParams() {
  const doctors = await getDoctorsAction();
  return doctors.map((doc) => ({
    slug: doc.slug || doc.id,
  }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const doctor = await getDoctorByIdAction(slug);
  // Public pages are always served in Bengali ("bn") — same as all list pages.
  if (!doctor) {
    notFound();
  }

  let decodedParam = slug;
  try {
    decodedParam = decodeURIComponent(slug);
  } catch {
    // Keep as is
  }

  if (doctor.slug && decodedParam !== doctor.slug) {
    permanentRedirect(`/consultants/${encodeURIComponent(doctor.slug)}`);
  }

  const pageTitle = formatDoctorMetaTitle(doctor.name, doctor.specialty);
  const ogTitle = `${pageTitle} - হেলথ ক্লাব`;
  const pageDesc = formatDoctorMetaDescription(doctor);
  const keywords = generateDoctorKeywords(doctor);

  const doctorCanonicalSegment = doctor.slug ? encodeURIComponent(doctor.slug) : doctor.id;
  const canonicalUrl = `${SITE_URL}/consultants/${doctorCanonicalSegment}`;
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
    keywords,
    openGraph: {
      title: ogTitle,
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
      title: ogTitle,
      description: pageDesc,
      images: [ogImage],
    },
  };
}

export default async function DoctorDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const doctor = await getDoctorByIdAction(slug);

  if (!doctor) {
    notFound();
  }

  // If accessed via ID (e.g. doc_03529e97) or mismatched slug,
  // permanently redirect to the canonical name slug URL
  let decodedParam = slug;
  try {
    decodedParam = decodeURIComponent(slug);
  } catch {
    // Keep as is
  }

  if (doctor.slug && decodedParam !== doctor.slug) {
    permanentRedirect(`/consultants/${encodeURIComponent(doctor.slug)}`);
  }

  const relatedDoctors = await getRelatedDoctorsAction(doctor.department, doctor.id, 4);

  const jsonLdData = generateDoctorJsonLd(doctor);

  return (
    <>
      <JsonLd data={jsonLdData} />
      <DoctorProfileView doctor={doctor} relatedDoctors={relatedDoctors} />
    </>
  );
}
