import { Doctor, Partner } from "@/services/db";
import { SITE_URL } from "@/lib/siteConfig";
import { CLINICAL_FOCUS_MAP } from "@/components/consultants/consultantData";
import {
  generateDoctorProfileFaqs,
  generateDoctorQuickSummary,
} from "@/data/doctorFaqData";

import {
  SCHEMA_SPECIALTY_MAP,
  getSemanticKnowledgeGraphForDoctor,
} from "./medicalEntityGraph";

export { SCHEMA_SPECIALTY_MAP } from "./medicalEntityGraph";

type SchemaDayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

/**
 * Parses Bangladeshi visiting days into Schema.org DayOfWeek values
 */
function parseDaysToSchemaDays(visitingDays?: string): SchemaDayOfWeek[] {
  if (!visitingDays) {
    return ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
  }

  const lower = visitingDays.toLowerCase();

  // Everyday / প্রতিদিন
  if (lower.includes("প্রতিদিন") || lower.includes("দৈনিক") || lower.includes("daily") || lower.includes("everyday")) {
    return ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  }

  // Saturday to Thursday / শনি - বৃহস্পতি
  if (
    (lower.includes("শনি") && lower.includes("বৃহস্পতি")) ||
    (lower.includes("sat") && lower.includes("thu"))
  ) {
    return ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
  }

  // Friday only / শুক্রবার
  if (
    (lower.includes("শুক্র") || lower.includes("fri")) &&
    !lower.includes("শনি") &&
    !lower.includes("সোম")
  ) {
    return ["Friday"];
  }

  const days: SchemaDayOfWeek[] = [];
  if (lower.includes("শনি") || lower.includes("sat")) days.push("Saturday");
  if (lower.includes("রবি") || lower.includes("sun")) days.push("Sunday");
  if (lower.includes("সোম") || lower.includes("mon")) days.push("Monday");
  if (lower.includes("মঙ্গল") || lower.includes("tue")) days.push("Tuesday");
  if (lower.includes("বুধ") || lower.includes("wed")) days.push("Wednesday");
  if (lower.includes("বৃহস্পতি") || lower.includes("thu")) days.push("Thursday");
  if (lower.includes("শুক্র") || lower.includes("fri")) days.push("Friday");

  return days.length > 0
    ? days
    : ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
}

/**
 * Parses visiting hours string into opens/closes times for OpeningHoursSpecification
 */
function parseVisitingHoursToTimes(visitingHours?: string): { opens: string; closes: string } {
  if (!visitingHours) {
    return { opens: "16:00", closes: "21:00" };
  }

  const lower = visitingHours.toLowerCase();

  // Match 24hr or standard time pattern e.g., "16:00 - 20:00" or "4:00 PM - 8:00 PM"
  if (lower.includes("সকাল") || lower.includes("am") || lower.includes("morning")) {
    return { opens: "09:00", closes: "14:00" };
  }

  if (lower.includes("বিকাল") || lower.includes("রাত") || lower.includes("pm") || lower.includes("evening")) {
    return { opens: "16:00", closes: "21:00" };
  }

  return { opens: "15:00", closes: "20:00" };
}

/**
 * Generate Google-compliant Schema.org JSON-LD structured data for doctor profile pages.
 */
export function generateDoctorJsonLd(
  doctor: Doctor & { partner?: Partner | null }
): Record<string, unknown>[] {
  const doctorSlugOrId = doctor.slug ? encodeURIComponent(doctor.slug) : doctor.id;
  const profileUrl = `${SITE_URL}/consultants/${doctorSlugOrId}`;
  const specialtyInfo = SCHEMA_SPECIALTY_MAP[doctor.department] || SCHEMA_SPECIALTY_MAP.other;
  const clinicalFocus = CLINICAL_FOCUS_MAP[doctor.department] || CLINICAL_FOCUS_MAP.other;
  const semanticGraph = getSemanticKnowledgeGraphForDoctor(doctor);

  // Format absolute image URL
  const rawImage = doctor.imageUrl?.trim();
  const imageUrl = rawImage
    ? rawImage.startsWith("http")
      ? rawImage
      : `${SITE_URL}${rawImage.startsWith("/") ? "" : "/"}${rawImage}`
    : `${SITE_URL}/og-image.png`;

  // Parse phone numbers
  const phoneList = (doctor.serialPhone || "01898221111")
    .split(/[,/|]+/)
    .map((p: string) => p.trim())
    .filter(Boolean);
  const primaryPhone = phoneList[0] || "01898221111";

  const hospitalAffiliationName = doctor.partner?.name || doctor.chamberName || "ফেনী স্বাস্থ্যসেবা প্রতিষ্ঠান";

  const alumniOfValue = doctor.degrees
    ? [
        {
          "@type": "CollegeOrUniversity",
          name: `Medical education credentials: ${doctor.degrees}`,
        },
      ]
    : undefined;

  // Parse consultation fee for numerical price offer
  const numericFeeMatch = doctor.consultationFee?.match(/(\d+[\d,]*)/);
  const numericFee = numericFeeMatch ? numericFeeMatch[1].replace(/,/g, "") : undefined;

  // Parse opening hours specification
  const schemaDays = parseDaysToSchemaDays(doctor.visitingDays);
  const { opens, closes } = parseVisitingHoursToTimes(doctor.visitingHours);

  // 1. Breadcrumb Schema
  const breadcrumbsSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "হোম",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "বিশেষজ্ঞ ডাক্তারগণ",
        item: `${SITE_URL}/consultants`,
      },
      ...(doctor.department && doctor.department !== "other" && doctor.department !== "all"
        ? [
            {
              "@type": "ListItem",
              position: 3,
              name: specialtyInfo.nameBn,
              item: `${SITE_URL}/consultants/department/${doctor.department}`,
            },
            {
              "@type": "ListItem",
              position: 4,
              name: doctor.name,
              item: profileUrl,
            },
          ]
        : [
            {
              "@type": "ListItem",
              position: 3,
              name: doctor.name,
              item: profileUrl,
            },
          ]),
    ],
  };

  // 2. Comprehensive Physician Schema (Google Rich Snippets & LocalBusiness compliant)
  const physicianSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Physician",
    "@id": `${profileUrl}#physician`,
    name: doctor.name,
    ...(doctor.nameEn ? { alternateName: [doctor.nameEn] } : {}),
    url: profileUrl,
    image: imageUrl,
    telephone: primaryPhone,
    jobTitle: doctor.designation || doctor.specialty,
    description: generateDoctorQuickSummary(doctor),
    priceRange: doctor.consultationFee || "৳৳",
    currenciesAccepted: "BDT",
    paymentAccepted: "Cash, bKash, Nagad, Rocket, Mobile Banking",
    isAcceptingNewPatients: doctor.isActive !== false,
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Feni District, Chittagong Division, Bangladesh",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: doctor.chamberAddress || doctor.chamberName,
      addressLocality: "Feni",
      addressRegion: "Chittagong Division",
      postalCode: "3900",
      addressCountry: "BD",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "23.0159",
      longitude: "91.3976",
    },
    // Schema.org MedicalSpecialty linkage
    medicalSpecialty: [
      specialtyInfo.uri,
      {
        "@type": "MedicalSpecialty",
        name: doctor.specialty,
        alternateName: specialtyInfo.nameBn,
        description: clinicalFocus.bn,
      },
    ],
    recognizingAuthority: [semanticGraph.recognizingAuthority],
    knowsAbout: semanticGraph.knowsAbout,
    ...(alumniOfValue ? { alumniOf: alumniOfValue } : {}),
    ...(doctor.partner?.name || doctor.chamberName
      ? {
          hospitalAffiliation: {
            "@type": "MedicalOrganization",
            name: hospitalAffiliationName,
            address: {
              "@type": "PostalAddress",
              streetAddress: doctor.chamberAddress || doctor.partner?.address || "Feni Sadar, Feni",
              addressLocality: "Feni",
              addressRegion: "Chittagong Division",
              postalCode: "3900",
              addressCountry: "BD",
            },
            telephone: primaryPhone,
            ...(doctor.partnerId
              ? {
                  url: `${SITE_URL}/partner-hospitals/${encodeURIComponent(doctor.partner?.slug || doctor.partnerId)}`,
                }
              : {}),
          },
        }
      : {}),
    // Educational Credentials
    ...(doctor.degrees
      ? {
          hasCredential: [
            {
              "@type": "EducationalOccupationalCredential",
              credentialCategory: "degree",
              name: doctor.degrees,
              recognizedBy: {
                "@type": "Organization",
                name: "Bangladesh Medical and Dental Council (BMDC)",
              },
            },
          ],
        }
      : {}),
    // Chamber / Hospital / Clinic Organization Affiliation
    worksFor: {
      "@type": "MedicalOrganization",
      name: hospitalAffiliationName,
      address: {
        "@type": "PostalAddress",
        streetAddress: doctor.chamberAddress || doctor.partner?.address || "Feni Sadar, Feni",
        addressLocality: "Feni",
        addressRegion: "Chittagong Division",
        postalCode: "3900",
        addressCountry: "BD",
      },
      telephone: primaryPhone,
      ...(doctor.partnerId
        ? {
            url: `${SITE_URL}/partner-hospitals/${encodeURIComponent(doctor.partner?.slug || doctor.partnerId)}`,
          }
        : {}),
    },
    // Opening Hours Specification
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: schemaDays,
        opens,
        closes,
        description: `${doctor.visitingDays} (${doctor.visitingHours})`,
      },
    ],
    // Available Medical Consultation Service & Pricing Offer
    availableService: [
      {
        "@type": "MedicalProcedure",
        name: `${doctor.specialty} বিশেষজ্ঞ স্বাস্থ্য পরামর্শ ও কনসাল্টেশন`,
        serviceType: doctor.department || doctor.specialty,
        description: `${doctor.name} (${doctor.degrees}) কর্তৃক ${doctor.specialty} বিশেষজ্ঞ চিকিৎসা ও স্বাস্থ্য পরামর্শ সেবা। চেম্বার: ${doctor.chamberName}, ${doctor.chamberAddress}। রোগী দেখার সময়: ${doctor.visitingDays} (${doctor.visitingHours})।`,
        provider: {
          "@type": "Physician",
          name: doctor.name,
          url: profileUrl,
        },
        areaServed: "Feni District, Bangladesh",
        ...(numericFee
          ? {
              offers: {
                "@type": "Offer",
                price: numericFee,
                priceCurrency: "BDT",
                description: doctor.consultationFee
                  ? `Consultation fee: ${doctor.consultationFee}`
                  : "Doctor consultation fee",
                availability:
                  doctor.isActive !== false
                    ? "https://schema.org/InStock"
                    : "https://schema.org/OutOfStock",
                validFrom: "2026-01-01",
                seller: {
                  "@type": "MedicalOrganization",
                  name: hospitalAffiliationName,
                },
              },
            }
          : {}),
      },
      ...semanticGraph.availableService,
    ],
    // Contact Point for serial booking
    contactPoint: {
      "@type": "ContactPoint",
      telephone: primaryPhone,
      contactType: "Appointment and serial booking",
      areaServed: "Feni, Bangladesh",
      availableLanguage: ["bn", "en"],
    },
  };

  // 3. MedicalWebPage Schema (High relevance for Google AI & Medical search)
  const medicalWebPageSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "@id": profileUrl,
    url: profileUrl,
    image: imageUrl,
    name: `${doctor.name} - ${doctor.specialty} (Feni) | Health Club`,
    description: generateDoctorQuickSummary(doctor),
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [
        "#doctor-quick-summary",
        ".geo-answer-capsule",
        "#faq-section",
        ".faq-answer",
        "#doctor-profile-header",
      ],
    },
    mainEntity: {
      "@id": `${profileUrl}#physician`,
    },
    about: {
      "@type": "Physician",
      name: doctor.name,
    },
    aspect: [
      "Consultation",
      "Doctor Profile",
      "Chamber Schedule",
      "Serial Phone",
      "Prescription & Medical Services",
    ],
  };

  // 4. Doctor-Specific High-Density FAQPage Schema for Direct Google & Voice SERP Answers
  const doctorFaqs = generateDoctorProfileFaqs(doctor);
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: doctorFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return [breadcrumbsSchema, physicianSchema, medicalWebPageSchema, faqSchema];
}

