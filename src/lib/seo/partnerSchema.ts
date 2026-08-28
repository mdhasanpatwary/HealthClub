import { Partner, Doctor, DepartmentDiscount, Review, PartnerReviewStats } from "@/services/db";
import { SITE_URL } from "@/lib/siteConfig";
import { Locale } from "@/lib/i18n";

export interface PartnerJsonLdOptions {
  partner: Partner;
  doctors?: Doctor[];
  reviews?: Review[];
  stats?: PartnerReviewStats;
  locale?: Locale;
}

/**
 * Returns default department discounts based on facility category
 */
export function getDefaultDepartmentDiscounts(
  category: Partner["category"],
  defaultDiscount: string,
  isEn: boolean
): DepartmentDiscount[] {
  if (category === "hospital") {
    return [
      {
        name: isEn ? "Pathology & Diagnostic Blood Tests" : "প্যাথলজি ও রক্ত পরীক্ষা",
        discount: defaultDiscount || "২০-৩০%",
        description: isEn
          ? "Complete blood count, biochemistry, hormone profiles & pathology testing"
          : "সকল প্রকার রক্ত, হরমোন ও বায়োকেমিস্ট্রি পরীক্ষা",
      },
      {
        name: isEn ? "Digital Radiology & Imaging" : "ডিজিটাল এক্স-রে ও ইমেজিং",
        discount: "১৫-২০%",
        description: isEn
          ? "Digital X-Ray, 4D USG, ECG, Echocardiography & imaging diagnostics"
          : "ডিজিটাল এক্স-রে, ৪ডি আল্ট্রাসনোগ্রাফি ও ইকো পরীক্ষা",
      },
      {
        name: isEn ? "Inpatient Cabin & Bed Charges" : "কেবিন ও বেড ভাড়া",
        discount: "১০%",
        description: isEn
          ? "AC/Non-AC inpatient cabins and general ward admission beds"
          : "ইনডোর এসি/নন-এসি কেবিন ও বেড চার্জে বিশেষ ছাড়",
      },
      {
        name: isEn ? "In-House Pharmacy & Medicines" : "ফার্মেসি ঔষধ সেবা",
        discount: "৭-১০%",
        description: isEn
          ? "Essential prescription medicines and surgical consumables"
          : "প্রয়োজনীয় ইন-হাউজ প্রেসক্রিপশন মেডিসিন ও সার্জিক্যাল সামগ্রী",
      },
    ];
  }

  if (category === "diagnostic") {
    return [
      {
        name: isEn ? "Routine Pathology & Biochemistry" : "রুটিন প্যাথলজি পরীক্ষা",
        discount: defaultDiscount || "২০-৩০%",
        description: isEn
          ? "CBC, Lipid Profile, RBS, Urine R/E & Biochemical screening"
          : "রক্তের বিভিন্ন রুটিন টেস্ট ও বায়োকেমিক্যাল স্ক্রিনিং",
      },
      {
        name: isEn ? "Specialized Diagnostic Scans" : "স্পেশালাইজড ডায়াগনস্টিক স্ক্যান",
        discount: "১৫-২৫%",
        description: isEn
          ? "CT Scan, MRI, Mammography, Endoscopy & Ultrasonography"
          : "সিটি স্ক্যান, এমআরআই, ডিজিটাল ম্যামোগ্রাফি ও আল্ট্রাসনোগ্রাম",
      },
      {
        name: isEn ? "Cardiac Screening & Diagnostics" : "কার্ডিয়াক ও হার্ট টেস্ট",
        discount: "১৫-২০%",
        description: isEn
          ? "ECG, Echocardiogram, ETT & Cardiac Biomarkers"
          : "ইসিজি, ইকো-কার্ডিওগ্রাফি, ইটিটি ও অন্যান্য হার্ট টেস্ট",
      },
      {
        name: isEn ? "Hormone & Immunology Testing" : "হরমোন ও ইমিউনোলজি প্রোফাইল",
        discount: "১০-২০%",
        description: isEn
          ? "Thyroid panel, Vitamin D, Fertility hormones & Immunology tests"
          : "থাইরয়েড, ভিটামিন ও হরমোন টেস্ট",
      },
    ];
  }

  return [
    {
      name: isEn ? "Prescription Life-Saving Medicines" : "প্রেসক্রিপশন ঔষধ",
      discount: defaultDiscount || "৭-১০%",
      description: isEn
        ? "All essential allopathic and branded prescription medicines"
        : "সকল প্রেসক্রিপশন জেনেরিক ও ব্র্যান্ডের ঔষধ",
    },
    {
      name: isEn ? "Medical Devices & Surgical Items" : "সার্জিক্যাল ও স্বাস্থ্যপণ্য",
      discount: "৫-১০%",
      description: isEn
        ? "Blood pressure/glucose monitors, nebulizers, test strips & surgical equipment"
        : "ব্লাড প্রেশার/গ্লুকোজ মনিটর, থার্মোমিটার ও সার্জিক্যাল সামগ্রী",
    },
    {
      name: isEn ? "Over-The-Counter (OTC) & Nutrition" : "ওটিসি ও নিউট্রিশন সামগ্রী",
      discount: "৫-৭%",
      description: isEn
        ? "Vitamins, nutritional supplements, and daily personal hygiene products"
        : "ভিটামিন, ফুড সাপ্লিমেন্ট এবং পার্সোনাল হাইজিন পণ্য",
    },
  ];
}

/**
 * Parses department discount string from JSON or fallback
 */
function parseDepartmentDiscounts(
  partner: Partner,
  isEn: boolean
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

  return getDefaultDepartmentDiscounts(partner.category, partner.discount, isEn);
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
  locale = "bn",
}: PartnerJsonLdOptions): Record<string, unknown>[] {
  const isEn = locale === "en";
  const profileUrl = `${SITE_URL}/partner-hospitals/${partner.id}`;

  const categoryConfig = {
    hospital: {
      schemaType: ["Hospital", "MedicalOrganization"],
      nameEn: "Hospital & Medical Center",
      nameBn: "হাসপাতাল ও মেডিকেল সেন্টার",
      serviceItemType: "MedicalProcedure",
      defaultHours: { opens: "00:00", closes: "23:59", is24_7: true },
    },
    diagnostic: {
      schemaType: ["DiagnosticLab", "MedicalOrganization", "MedicalBusiness"],
      nameEn: "Diagnostic & Pathology Lab",
      nameBn: "ডায়াগনস্টিক ও প্যাথলজি সেন্টার",
      serviceItemType: "MedicalTest",
      defaultHours: { opens: "07:00", closes: "23:00", is24_7: false },
    },
    pharmacy: {
      schemaType: ["Pharmacy", "MedicalBusiness"],
      nameEn: "Model Pharmacy & Medicine Store",
      nameBn: "মডেল ফার্মেসি ও ঔষধালয়",
      serviceItemType: "Drug",
      defaultHours: { opens: "08:00", closes: "23:30", is24_7: false },
    },
  }[partner.category] || {
    schemaType: ["MedicalOrganization"],
    nameEn: "Healthcare Facility",
    nameBn: "স্বাস্থ্যসেবা প্রতিষ্ঠান",
    serviceItemType: "MedicalService",
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
  const deptList = parseDepartmentDiscounts(partner, isEn);

  // 1. Breadcrumbs Schema
  const breadcrumbCategoryName = isEn
    ? partner.category === "hospital"
      ? "Hospitals"
      : partner.category === "diagnostic"
      ? "Diagnostic Centers"
      : "Pharmacies"
    : partner.category === "hospital"
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
        name: breadcrumbCategoryName,
        item: `${SITE_URL}/partner-hospitals?category=${partner.category}`,
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

  // 2. Primary Medical Organization / Facility Schema
  const facilitySchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": categoryConfig.schemaType,
    "@id": `${profileUrl}#facility`,
    name: partner.name,
    alternateName: `${partner.name} (${isEn ? categoryConfig.nameEn : categoryConfig.nameBn})`,
    url: profileUrl,
    image: imageUrl,
    logo: imageUrl,
    telephone: partner.phone,
    ...(partner.email ? { email: partner.email } : {}),
    description: isEn
      ? `${partner.name} is an authorized partner ${partner.category} of Health Club located at ${partner.address}, Feni. Members receive exclusive discounts of ${partner.discount} on diagnostic tests, admissions, and medical services.`
      : `${partner.name} ফেনীর ${partner.address}-এ অবস্থিত হেলথ ক্লাবের একটি নিবন্ধিত পার্টনার ${categoryConfig.nameBn}। হেলথ ক্লাব মেম্বার কার্ডধারী ব্যক্তিরা পাচ্ছেন ${partner.discount} পর্যন্ত বিশেষ স্বাস্থ্যসেবা ছাড়।`,
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
              name: r.member?.name || (isEn ? "Health Club Verified Member" : "যাচাইকৃত মেম্বার"),
            },
            reviewRating: {
              "@type": "Rating",
              ratingValue: r.rating,
              bestRating: 5,
              worstRating: 1,
            },
            reviewBody: r.comment || (isEn ? "Great service and verified discount." : "চমৎকার সেবা ও সঠিক ডিসকাউন্ট পেয়েছি।"),
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
            url: `${SITE_URL}/consultants/${doc.id}`,
            telephone: doc.serialPhone,
            ...(doc.degrees ? { hasCredential: doc.degrees } : {}),
          })),
        }
      : {}),
    // Offer Catalog with PriceSpecification & Offers
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: isEn
        ? `${partner.name} Member Discount & Service Catalog`
        : `${partner.name} মেম্বার ডিসকাউন্ট ও স্বাস্থ্যসেবা অফার`,
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
    name: `${partner.name} (${isEn ? categoryConfig.nameEn : categoryConfig.nameBn}, Feni) | Health Club`,
    description: isEn
      ? `${partner.name} at ${partner.address}, Feni. Avail ${partner.discount} discount with Health Club membership. Call hotline: ${partner.phone}.`
      : `${partner.name}, ${partner.address}, ফেনী। হেলথ ক্লাব কার্ডে পান ${partner.discount} ছাড়। হটলাইন: ${partner.phone}।`,
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

  // 4. Partner-Specific FAQPage Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: isEn
          ? `How much discount do Health Club members get at ${partner.name}?`
          : `${partner.name}-এ হেলথ ক্লাব মেম্বাররা কত শতাংশ ছাড় বা ডিসকাউন্ট পান?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: isEn
            ? `Health Club members receive up to ${partner.discount} discount on diagnostic tests, medical investigations, and hospital services at ${partner.name}. Simply present your Health Club digital/physical member card or registered phone number at the billing counter.`
            : `${partner.name}-এ হেলথ ক্লাব কার্ডধারী মেম্বাররা প্যাথলজি, ডায়াগনস্টিক টেস্ট ও মেডিকেল সার্ভিসে ${partner.discount} পর্যন্ত আকর্ষণীয় ছাড় পেয়ে থাকেন। বিলিং বা ক্যাশ কাউন্টারে মেম্বার কার্ড বা মোবাইল নম্বর দেখালেই তাত্ক্ষণিক ছাড় প্রযোজ্য হয়।`,
        },
      },
      {
        "@type": "Question",
        name: isEn
          ? `Where is ${partner.name} located in Feni and what is the contact phone number?`
          : `${partner.name}-এর ঠিকানা কোথায় এবং যোগাযোগের ফোন নম্বর কী?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: isEn
            ? `${partner.name} is located at ${partner.address}, Feni, Bangladesh. You can contact them directly for serials and queries at ${partner.phone}${partner.emergencyPhone ? ` or emergency hotline: ${partner.emergencyPhone}` : ""}.`
            : `${partner.name}-এর ঠিকানা: ${partner.address}, ফেনী। যেকোনো তথ্য ও সিরিয়ালের জন্য যোগাযোগ করুন: ${partner.phone}${partner.emergencyPhone ? ` (জরুরি হটলাইন: ${partner.emergencyPhone})` : ""}।`,
        },
      },
      {
        "@type": "Question",
        name: isEn
          ? `Are specialist doctor chambers and visiting schedules available at ${partner.name}?`
          : `${partner.name}-এ কি বিশেষজ্ঞ ডাক্তারদের চেম্বার ও সিরিয়াল সেবা রয়েছে?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: isEn
            ? doctors.length > 0
              ? `Yes, ${partner.name} hosts multiple specialist consultants across medicine, surgery, gynecology, and cardiology. You can check doctor profiles and serial numbers directly on Health Club.`
              : `Yes, visiting consultant chambers and medical services are available. Call ${partner.phone} for the latest doctor visiting schedules.`
            : doctors.length > 0
            ? `হ্যাঁ, ${partner.name}-এ অভিজ্ঞ ও বিশেষজ্ঞ ডাক্তারদের নিয়মিত চেম্বার ও কনসালটেশন সেবা রয়েছে। হেলথ ক্লাব ডিরেক্টরি থেকে ডাক্তারদের তালিকা ও সরাসরি সিরিয়াল নম্বর দেখে নিতে পারেন।`
            : `হ্যাঁ, এখানে নিয়মিত বিশেষজ্ঞ চিকিৎসকদের চেম্বার পরিচালিত হয়। বিস্তারিত শিডিউল জানতে হটলাইনে (${partner.phone}) কল করুন।`,
        },
      },
      {
        "@type": "Question",
        name: isEn
          ? `What are the operating hours and emergency support at ${partner.name}?`
          : `${partner.name}-এর সেবা প্রদানের সময়সূচী ও জরুরি সেবা কী?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: isEn
            ? partner.category === "hospital"
              ? `${partner.name} provides 24/7 emergency care, inpatient admissions, and round-the-clock medical services. Standard diagnostic sample collection operates daily.`
              : `${partner.name} operates daily for diagnostic testing and medicine delivery. Working hours: ${partner.workingHours || "Open 7 days a week"}.`
            : partner.category === "hospital"
            ? `${partner.name}-এ ২৪ ঘণ্টা জরুরি স্বাস্থ্যসেবা, ইমার্জেন্সি সাপোর্ট ও ইনডোর চিকিৎসা সেবা চালু থাকে। প্যাথলজি ও বহির্বিভাগ সেবা প্রতিদিন সকাল থেকে রাত পর্যন্ত পরিচালিত হয়।`
            : `${partner.name} প্রতিদিন ডায়াগনস্টিক টেস্ট ও সেবা প্রদানের জন্য খোলা থাকে (${partner.workingHours || "সপ্তাহের ৭ দিন খোলা"})।`,
        },
      },
    ],
  };

  return [breadcrumbSchema, facilitySchema, medicalWebPageSchema, faqSchema];
}
