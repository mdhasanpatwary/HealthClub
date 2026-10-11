import { Partner, Doctor, DepartmentDiscount, Review, PartnerReviewStats, parsePartnerSocialLinks, formatSocialUrl } from "@/services/db";
import { SITE_URL } from "@/lib/siteConfig";
import { getSemanticKnowledgeGraphForPartner } from "./medicalEntityGraph";
import { generatePartnerFaqSchema } from "./partnerFaqSchema";

export interface PartnerJsonLdOptions {
  partner: Partner;
  doctors?: Doctor[];
  reviews?: Review[];
  stats?: PartnerReviewStats;
}

/**
 * Returns default department discounts based on facility category
 */
export function getDefaultDepartmentDiscounts(
  category: Partner["category"],
  defaultDiscount: string
): DepartmentDiscount[] {
  if (category === "hospital") {
    return [
      {
        name: "প্যাথলজি ও রক্ত পরীক্ষা",
        discount: defaultDiscount || "২০-৩০%",
        description: "সকল প্রকার রক্ত, হরমোন ও বায়োকেমিস্ট্রি পরীক্ষা",
      },
      {
        name: "ডিজিটাল এক্স-রে ও ইমেজিং",
        discount: "১৫-২০%",
        description: "ডিজিটাল এক্স-রে, ৪ডি আল্ট্রাসনোগ্রাফি ও ইকো পরীক্ষা",
      },
      {
        name: "কেবিন ও বেড ভাড়া",
        discount: "১০%",
        description: "ইনডোর এসি/নন-এসি কেবিন ও বেড চার্জে বিশেষ ছাড়",
      },
      {
        name: "ফার্মেসি ঔষধ সেবা",
        discount: "৭-১০%",
        description: "প্রয়োজনীয় ইন-হাউজ প্রেসক্রিপশন মেডিসিন ও সার্জিক্যাল সামগ্রী",
      },
    ];
  }

  if (category === "diagnostic") {
    return [
      {
        name: "রুটিন প্যাথলজি পরীক্ষা",
        discount: defaultDiscount || "২০-৩০%",
        description: "রক্তের বিভিন্ন রুটিন টেস্ট ও বায়োকেমিক্যাল স্ক্রিনিং",
      },
      {
        name: "স্পেশালাইজড ডায়াগনস্টিক স্ক্যান",
        discount: "১৫-২৫%",
        description: "সিটি স্ক্যান, এমআরআই, ডিজিটাল ম্যামোগ্রাফি ও আল্ট্রাসনোগ্রাম",
      },
      {
        name: "কার্ডিয়াক ও হার্ট টেস্ট",
        discount: "১৫-২০%",
        description: "ইসিজি, ইকো-কার্ডিওগ্রাফি, ইটিটি ও অন্যান্য হার্ট টেস্ট",
      },
      {
        name: "হরমোন ও ইমিউনোলজি প্রোফাইল",
        discount: "১০-২০%",
        description: "থাইরয়েড, ভিটামিন ও হরমোন টেস্ট",
      },
    ];
  }

  return [
    {
      name: "প্রেসক্রিপশন ঔষধ",
      discount: defaultDiscount || "৭-১০%",
      description: "সকল প্রেসক্রিপশন জেনেরিক ও ব্র্যান্ডের ঔষধ",
    },
    {
      name: "সার্জিক্যাল ও স্বাস্থ্যপণ্য",
      discount: "৫-১০%",
      description: "ব্লাড প্রেশার/গ্লুকোজ মনিটর, থার্মোমিটার ও সার্জিক্যাল সামগ্রী",
    },
    {
      name: "ওটিসি ও নিউট্রিশন সামগ্রী",
      discount: "৫-৭%",
      description: "ভিটামিন, ফুড সাপ্লিমেন্ট এবং পার্সোনাল হাইজিন পণ্য",
    },
  ];
}

/**
 * Parses department discount string from JSON or fallback
 */
function parseDepartmentDiscounts(
  partner: Partner
): DepartmentDiscount[] {
  if (partner.departmentDiscounts) {
    try {
      const parsed = JSON.parse(partner.departmentDiscounts);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch {
      // Fallback below
    }
  }

  return getDefaultDepartmentDiscounts(partner.category, partner.discount);
}

/**
 * Generate Google-compliant Schema.org JSON-LD structured data for partner hospitals,
 * diagnostic labs, and pharmacies.
 */
export function generatePartnerJsonLd({
  partner,
  doctors = [],
  reviews = [],
  stats,
}: PartnerJsonLdOptions): Record<string, unknown>[] {
  const profileUrl = `${SITE_URL}/partner-hospitals/${encodeURIComponent(partner.slug || partner.id)}`;

  const categoryConfig = {
    hospital: {
      schemaType: ["Hospital", "MedicalOrganization"],
      nameBn: "হাসপাতাল ও মেডিকেল সেন্টার",
      serviceItemType: "MedicalProcedure",
      defaultHours: { opens: "00:00", closes: "23:59", is24_7: true },
    },
    diagnostic: {
      schemaType: ["DiagnosticLab", "MedicalOrganization", "MedicalBusiness"],
      nameBn: "ডায়াগনস্টিক ও প্যাথলজি সেন্টার",
      serviceItemType: "MedicalTest",
      defaultHours: { opens: "07:00", closes: "23:00", is24_7: false },
    },
    pharmacy: {
      schemaType: ["Pharmacy", "MedicalBusiness"],
      nameBn: "মডেল ফার্মেসি ও ঔষধালয়",
      serviceItemType: "Service",
      defaultHours: { opens: "08:00", closes: "23:30", is24_7: false },
    },
  }[partner.category] || {
    schemaType: ["MedicalOrganization"],
    nameBn: "স্বাস্থ্যসেবা প্রতিষ্ঠান",
    serviceItemType: "Service",
    defaultHours: { opens: "00:00", closes: "23:59", is24_7: true },
  };

  // Image URL formatting
  const rawImage = partner.imageUrl?.trim();
  const imageUrl = rawImage
    ? rawImage.startsWith("http")
      ? rawImage
      : `${SITE_URL}${rawImage.startsWith("/") ? "" : "/"}${rawImage}`
    : `${SITE_URL}/og-image.png`;

  // Parse discounts & services
  const deptList = parseDepartmentDiscounts(partner);
  const semanticGraph = getSemanticKnowledgeGraphForPartner(partner);

  // 1. Breadcrumbs Schema
  const breadcrumbCategoryName =
    partner.category === "hospital"
      ? "হাসপাতালসমূহ"
      : partner.category === "diagnostic"
      ? "ডায়াগনস্টিক সেন্টার"
      : "ফার্মেসি";

  const breadcrumbSchema = {
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
        name: "পার্টনার নেটওয়ার্ক",
        item: `${SITE_URL}/partner-hospitals`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: breadcrumbCategoryName,
        item: `${SITE_URL}/partner-hospitals/category/${partner.category}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: partner.name,
        item: profileUrl,
      },
    ],
  };

  // Contact points: Support + Emergency Hotline
  const contactPoints = [
    {
      "@type": "ContactPoint",
      telephone: partner.phone,
      contactType: "customer support and serial appointments",
      areaServed: "Feni, Bangladesh",
      availableLanguage: ["bn", "en"],
    },
  ];

  if (partner.emergencyPhone) {
    contactPoints.push({
      "@type": "ContactPoint",
      telephone: partner.emergencyPhone,
      contactType: "24/7 emergency medical hotline",
      areaServed: "Feni, Bangladesh",
      availableLanguage: ["bn", "en"],
    });
  }

  const socials = parsePartnerSocialLinks(partner.socialLinks);
  const sameAsUrls = socials
    ? (["facebook", "website", "youtube", "linkedin", "instagram", "whatsapp"] as const)
        .map((p) => (socials[p] ? formatSocialUrl(p, socials[p]) : undefined))
        .filter((u): u is string => Boolean(u))
    : [];

  // 2. Primary Medical Organization / Facility Schema
  const facilitySchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", ...categoryConfig.schemaType],
    "@id": `${profileUrl}#facility`,
    name: partner.name,
    alternateName: `${partner.name} (${categoryConfig.nameBn})`,
    url: profileUrl,
    image: imageUrl,
    logo: imageUrl,
    telephone: partner.phone,
    ...(partner.email ? { email: partner.email } : {}),
    description: `${partner.name} ফেনীর ${partner.address}-এ অবস্থিত হেলথ ক্লাবের একটি নিবন্ধিত পার্টনার ${categoryConfig.nameBn}। হেলথ ক্লাব মেম্বার কার্ডধারী ব্যক্তিরা পাচ্ছেন ${partner.discount} পর্যন্ত বিশেষ স্বাস্থ্যসেবা ছাড়।`,
    priceRange: partner.discount || "৳৳",
    currenciesAccepted: "BDT",
    paymentAccepted: "Cash, bKash, Nagad, Rocket, Debit Card, Credit Card",
    isAcceptingNewPatients: true,
    address: {
      "@type": "PostalAddress",
      streetAddress: partner.address,
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
    sameAs: sameAsUrls.length > 0 ? sameAsUrls : undefined,
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Feni District, Chittagong Division, Bangladesh",
    },
    ...(partner.mapLink ? { hasMap: partner.mapLink } : {}),
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
        opens: categoryConfig.defaultHours.opens,
        closes: categoryConfig.defaultHours.closes,
        description: partner.workingHours || (categoryConfig.defaultHours.is24_7 ? "24 Hours Open" : "Daily Open"),
      },
    ],
    contactPoint: contactPoints,
    // Rating & Reviews
    ...(stats && stats.totalReviews > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: stats.averageRating,
            reviewCount: stats.totalReviews,
            bestRating: "5",
            worstRating: "1",
          },
        }
      : {}),
    ...(reviews.length > 0
      ? {
          review: reviews.slice(0, 5).map((r) => ({
            "@type": "Review",
            author: {
              "@type": "Person",
              name: r.member?.name || "যাচাইকৃত মেম্বার",
            },
            reviewRating: {
              "@type": "Rating",
              ratingValue: r.rating,
              bestRating: 5,
              worstRating: 1,
            },
            reviewBody: r.comment || "চমৎকার সেবা ও সঠিক ডিসকাউন্ট পেয়েছি।",
            datePublished: r.createdAt.split("T")[0],
          })),
        }
      : {}),
    // Chamber Doctors / Medical Staff
    ...(doctors.length > 0
      ? {
          employee: doctors.map((doc) => ({
            "@type": "Physician",
            name: doc.name,
            jobTitle: doc.specialty,
            url: `${SITE_URL}/consultants/${encodeURIComponent(doc.slug || doc.id)}`,
            telephone: doc.serialPhone,
            ...(doc.degrees ? { hasCredential: doc.degrees } : {}),
          })),
        }
      : {}),
    recognizingAuthority: [semanticGraph.recognizingAuthority],
    knowsAbout: semanticGraph.knowsAbout,
    availableService: semanticGraph.availableService,
    // Offer Catalog with PriceSpecification & Offers
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${partner.name} মেম্বার ডিসকাউন্ট ও স্বাস্থ্যসেবা অফার`,
      itemListElement: deptList.map((item, idx) => ({
        "@type": "Offer",
        position: idx + 1,
        name: item.name,
        description: item.description || `${item.name} with ${item.discount} discount for Health Club members`,
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          priceCurrency: "BDT",
          description: `${item.discount} member discount rate`,
        },
        itemOffered: {
          "@type": categoryConfig.serviceItemType,
          name: item.name,
          description: item.description || item.name,
          provider: {
            "@id": `${profileUrl}#facility`,
          },
        },
        seller: {
          "@id": `${profileUrl}#facility`,
        },
        availability: "https://schema.org/InStock",
      })),
    },
  };

  // 3. MedicalWebPage Schema
  const medicalWebPageSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "@id": profileUrl,
    url: profileUrl,
    name: `${partner.name} (${categoryConfig.nameBn}, Feni) | Health Club`,
    description: `${partner.name}, ${partner.address}, ফেনী। হেলথ ক্লাব কার্ডে পান ${partner.discount} ছাড়। হটলাইন: ${partner.phone}।`,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [
        ".geo-answer-capsule",
        ".faq-answer",
        "#overview",
        "#partner-profile-header",
      ],
    },
    mainEntity: {
      "@id": `${profileUrl}#facility`,
    },
    about: {
      "@id": `${profileUrl}#facility`,
    },
    aspect: [
      "Facility Profile",
      "Medical Diagnostic Tests",
      "Member Discount Rates",
      "Specialist Doctor Schedule",
      "Emergency Contact Hotline",
      "Address & Location",
    ],
  };

  // 4. Partner-Specific High-Density FAQPage Schema
  const faqSchema = generatePartnerFaqSchema(partner, doctors);

  return [breadcrumbSchema, facilitySchema, medicalWebPageSchema, faqSchema];
}
