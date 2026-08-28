import { Doctor, Partner } from "@/services/db";
import { SITE_URL } from "@/lib/siteConfig";
import { CLINICAL_FOCUS_MAP } from "@/components/consultants/consultantData";
import { Locale } from "@/lib/i18n";

/**
 * Mapping of internal department slugs to official Schema.org MedicalSpecialty URIs
 */
export const SCHEMA_SPECIALTY_MAP: Record<string, { uri: string; nameEn: string; nameBn: string }> = {
  medicine: {
    uri: "https://schema.org/InternalMedicine",
    nameEn: "Internal Medicine & General Practice",
    nameBn: "মেডিসিন ও ইন্টারনাল কেয়ার",
  },
  cardiology: {
    uri: "https://schema.org/Cardiovascular",
    nameEn: "Cardiology & Cardiovascular Medicine",
    nameBn: "হৃদরোগ ও কার্ডিওলজি",
  },
  gynecology: {
    uri: "https://schema.org/Gynecologic",
    nameEn: "Gynecology & Obstetrics",
    nameBn: "গাইনী ও প্রসূতিরোগ",
  },
  orthopedics: {
    uri: "https://schema.org/Musculoskeletal",
    nameEn: "Orthopedics & Musculoskeletal Surgery",
    nameBn: "অর্থোপেডিক্স ও হাড়-জোড়া সার্জারি",
  },
  pediatrics: {
    uri: "https://schema.org/Pediatric",
    nameEn: "Pediatrics & Child Health",
    nameBn: "শিশুরোগ ও শিশু স্বাস্থ্য",
  },
  psychiatry: {
    uri: "https://schema.org/Psychiatric",
    nameEn: "Psychiatry & Neuropsychology",
    nameBn: "মনোরোগ ও মানসিক স্বাস্থ্য",
  },
  nephrology: {
    uri: "https://schema.org/Renal",
    nameEn: "Nephrology & Renal Medicine",
    nameBn: "কিডনি ও নেফ্রোলজি",
  },
  hepatology: {
    uri: "https://schema.org/Gastroenterologic",
    nameEn: "Hepatology & Gastroenterology",
    nameBn: "লিভার ও গ্যাস্ট্রোএন্টারোলজি",
  },
  surgery: {
    uri: "https://schema.org/Surgical",
    nameEn: "General & Laparoscopic Surgery",
    nameBn: "জেনারেল ও ল্যাপারোস্কপিক সার্জারি",
  },
  dermatology: {
    uri: "https://schema.org/Dermatology",
    nameEn: "Dermatology & Venereology",
    nameBn: "চর্ম, এলার্জি ও যৌনরোগ",
  },
  ent: {
    uri: "https://schema.org/Otolaryngologic",
    nameEn: "Otolaryngology (ENT) & Head-Neck Surgery",
    nameBn: "নাক, কান ও গলা রোগ (ইএনটি)",
  },
  eye: {
    uri: "https://schema.org/Optometric",
    nameEn: "Ophthalmology & Eye Care",
    nameBn: "চক্ষুরোগ ও চক্ষু সার্জারি",
  },
  dental: {
    uri: "https://schema.org/Dentistry",
    nameEn: "Dentistry & Oral Surgery",
    nameBn: "দন্ত ও মুখগহ্বর চিকিৎসা",
  },
  diabetes: {
    uri: "https://schema.org/Endocrine",
    nameEn: "Endocrinology & Diabetology",
    nameBn: "ডায়াবেটিস, থাইরয়েড ও হরমোন",
  },
  nutrition: {
    uri: "https://schema.org/DietNutrition",
    nameEn: "Clinical Nutrition & Dietetics",
    nameBn: "ক্লিনিক্যাল নিউট্রিশন ও ডায়েট",
  },
  rheumatology: {
    uri: "https://schema.org/Rheumatologic",
    nameEn: "Rheumatology & Arthritis",
    nameBn: "রিউমাটোলজি ও বাত-ব্যথা",
  },
  other: {
    uri: "https://schema.org/MedicalSpecialty",
    nameEn: "Specialized Clinical Medicine",
    nameBn: "বিশেষায়িত চিকিৎসা সেবা",
  },
};

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
  doctor: Doctor & { partner?: Partner | null },
  locale: Locale = "bn"
): Record<string, unknown>[] {
  const isEn = locale === "en";
  const profileUrl = `${SITE_URL}/consultants/${doctor.id}`;
  const specialtyInfo = SCHEMA_SPECIALTY_MAP[doctor.department] || SCHEMA_SPECIALTY_MAP.other;
  const clinicalFocus = CLINICAL_FOCUS_MAP[doctor.department] || CLINICAL_FOCUS_MAP.other;

  // Format absolute image URL
  const rawImage = doctor.imageUrl?.trim();
  const imageUrl = rawImage
    ? rawImage.startsWith("http")
      ? rawImage
      : `${SITE_URL}${rawImage.startsWith("/") ? "" : "/"}${rawImage}`
    : `${SITE_URL}/og-image.png`;

  // Parse phone numbers
  const phoneList = doctor.serialPhone
    .split(/[,/|]+/)
    .map((p) => p.trim())
    .filter(Boolean);
  const primaryPhone = phoneList[0] || "01898221111";

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
        name: isEn ? specialtyInfo.nameEn : specialtyInfo.nameBn,
        item: `${SITE_URL}/consultants?dept=${doctor.department}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: doctor.name,
        item: profileUrl,
      },
    ],
  };

  // 2. Comprehensive Physician Schema (Google Rich Snippets & LocalBusiness compliant)
  const physicianSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Physician",
    "@id": `${profileUrl}#physician`,
    name: doctor.name,
    url: profileUrl,
    image: imageUrl,
    telephone: primaryPhone,
    jobTitle: doctor.designation || doctor.specialty,
    description: isEn
      ? `${doctor.name} is a ${doctor.specialty} specialist practicing at ${doctor.chamberName}, ${doctor.chamberAddress}, Feni. Qualifications: ${doctor.degrees}. Serial & appointments: ${doctor.serialPhone}.`
      : `${doctor.name} ফেনীর একজন প্রখ্যাত ${doctor.specialty} বিশেষজ্ঞ। চেম্বার: ${doctor.chamberName}, ${doctor.chamberAddress}। শিক্ষাগত যোগ্যতা ও ডিগ্রি: ${doctor.degrees}। সিরিয়াল বুকিং হটলাইন: ${doctor.serialPhone}।`,
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
        alternateName: isEn ? specialtyInfo.nameEn : specialtyInfo.nameBn,
        description: isEn ? clinicalFocus.en : clinicalFocus.bn,
      },
    ],
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
      name: doctor.chamberName,
      address: {
        "@type": "PostalAddress",
        streetAddress: doctor.chamberAddress,
        addressLocality: "Feni",
        addressRegion: "Chittagong Division",
        postalCode: "3900",
        addressCountry: "BD",
      },
      telephone: primaryPhone,
      ...(doctor.partnerId
        ? {
            url: `${SITE_URL}/partner-hospitals/${doctor.partnerId}`,
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
        name: isEn ? `${doctor.specialty} Specialist Consultation` : `${doctor.specialty} বিশেষজ্ঞ স্বাস্থ্য পরামর্শ ও কনসাল্টেশন`,
        serviceType: doctor.department || doctor.specialty,
        description: isEn
          ? `${doctor.specialty} specialist consultation and clinical care by ${doctor.name} (${doctor.degrees}). Chamber at ${doctor.chamberName}, ${doctor.chamberAddress}. Visiting: ${doctor.visitingDays} (${doctor.visitingHours}).`
          : `${doctor.name} (${doctor.degrees}) কর্তৃক ${doctor.specialty} বিশেষজ্ঞ চিকিৎসা ও স্বাস্থ্য পরামর্শ সেবা। চেম্বার: ${doctor.chamberName}, ${doctor.chamberAddress}। রোগী দেখার সময়: ${doctor.visitingDays} (${doctor.visitingHours})।`,
        provider: {
          "@type": "Physician",
          name: doctor.name,
          url: profileUrl,
        },
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
              },
            }
          : {}),
      },
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
    name: `${doctor.name} - ${doctor.specialty} (Feni) | Health Club`,
    description: isEn
      ? `${doctor.name} (${doctor.specialty}), ${doctor.degrees}. Chamber at ${doctor.chamberName}, ${doctor.chamberAddress}. Call serial: ${doctor.serialPhone}.`
      : `${doctor.name}, ${doctor.specialty}, ${doctor.degrees}। চেম্বার: ${doctor.chamberName}। সিরিয়াল হটলাইন: ${doctor.serialPhone}।`,
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

  // 4. Doctor-Specific FAQPage Schema for Direct Google SERP Answers
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: isEn
          ? `Where is Dr. ${doctor.name}'s chamber in Feni and what are the visiting hours?`
          : `ফেনীতে ${doctor.name}-এর চেম্বার কোথায় এবং রোগী দেখার সময় কখন?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: isEn
            ? `Dr. ${doctor.name} attends patients at ${doctor.chamberName}, ${doctor.chamberAddress}. Visiting schedule: ${doctor.visitingDays} (${doctor.visitingHours}). For serial booking, call ${doctor.serialPhone}.`
            : `${doctor.name}-এর চেম্বার হলো ${doctor.chamberName}, ${doctor.chamberAddress}। রোগী দেখার সময়সূচী: ${doctor.visitingDays} (${doctor.visitingHours})। চেম্বার রুম: ${doctor.roomNo || "নির্ধারিত কনসালটেশন সেন্টার"}। সিরিয়াল দিতে কল করুন: ${doctor.serialPhone}।`,
        },
      },
      {
        "@type": "Question",
        name: isEn
          ? `How can I book a serial or appointment for Dr. ${doctor.name}?`
          : `${doctor.name}-এর সিরিয়াল বা অ্যাপয়েন্টমেন্ট কীভাবে বুক করবেন?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: isEn
            ? `You can book a serial directly by calling the chamber hotline number(s): ${doctor.serialPhone}. Health Club members also receive fast-track health discount support.`
            : `সরাসরি সিরিয়াল বুকিংয়ের জন্য চেম্বার হটলাইন নম্বরে কল করুন: ${doctor.serialPhone}। হেলথ ক্লাব মেম্বারদের জন্য রয়েছে বিশেষ ডিসকাউন্ট ও সহায়তা সুবিধা।`,
        },
      },
      {
        "@type": "Question",
        name: isEn
          ? `What is the consultation fee and qualifications of Dr. ${doctor.name}?`
          : `${doctor.name}-এর ভিজিট ফি (কনসাল্টেশন ফি) ও শিক্ষাগত যোগ্যতা কী?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: isEn
            ? `Qualifications: ${doctor.degrees}. Designation/Affiliation: ${doctor.designation}. Consultation fee: ${doctor.consultationFee || "Standard fee applies, contact chamber serial hotline"} (Accepted: Cash, bKash, Nagad).`
            : `শিক্ষাগত যোগ্যতা ও ডিগ্রি: ${doctor.degrees}। বর্তমান পদবী/সংযুক্তি: ${doctor.designation}। কনসাল্টেশন ফি: ${doctor.consultationFee || "চেম্বারের নির্ধারিত ভিজিট প্রযোজ্য, বিস্তারিত জানতে সিরিয়ালে কল করুন"} (নগদ, বিকাশ ও রকেট পেমেন্ট গ্রহণযোগ্য)।`,
        },
      },
    ],
  };

  return [breadcrumbsSchema, physicianSchema, medicalWebPageSchema, faqSchema];
}
