import { BlogPost } from "@/types/blog";
import { SITE_URL } from "@/lib/siteConfig";
import { getArticleIsoDate } from "@/lib/dateUtils";

export function generateBlogJsonLd(
  post: BlogPost,
  title: string,
  pageUrl: string,
  relatedPosts?: BlogPost[]
): Record<string, unknown> {
  const coverImageUrl = post.coverImage.startsWith("http")
    ? post.coverImage
    : `${SITE_URL}${post.coverImage}`;

  const relatedUrls = (relatedPosts && relatedPosts.length > 0)
    ? relatedPosts.map((r) => `${SITE_URL}/blog/${r.slug}`)
    : (post.relatedSlugs || []).map((s) => `${SITE_URL}/blog/${s}`);

  const graph: Record<string, unknown>[] = [
    // WebSite Entity
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "Health Club (হেলথ ক্লাব)",
      url: SITE_URL,
    },

    // WebPage Entity with AEO speakable selectors
    {
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: title,
      description: post.excerptBn,
      inLanguage: "bn-BD",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
      ...(relatedUrls.length > 0 ? { relatedLink: relatedUrls } : {}),
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: [
          "#article-quick-summary",
          "#overview",
          "#key-highlights",
          "#faq-section",
        ],
      },
    },

    // BreadcrumbList
    {
      "@type": "BreadcrumbList",
      "@id": `${pageUrl}#breadcrumb`,
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
          name: "ব্লগ",
          item: `${SITE_URL}/blog`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: title,
          item: pageUrl,
        },
      ],
    },

    // Article & MedicalWebPage Schema
    {
      "@type": ["BlogPosting", "MedicalWebPage"],
      "@id": `${pageUrl}#article`,
      isPartOf: { "@id": `${pageUrl}#webpage` },
      headline: title,
      description: post.excerptBn,
      image: coverImageUrl,
      datePublished: getArticleIsoDate(post.publishedDate),
      dateModified: getArticleIsoDate(post.modifiedDate),
      inLanguage: "bn-BD",
      isAccessibleForFree: true,
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": pageUrl,
      },
      ...(relatedUrls.length > 0
        ? {
            relatedLink: relatedUrls,
            significantLink: relatedUrls,
          }
        : {}),
      author: {
        "@type": "Organization",
        name: post.author.nameBn,
        url: SITE_URL,
      },
      publisher: {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "Health Club (হেলথ ক্লাব)",
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/images/member-card-logo.webp`,
        },
      },
      articleSection: post.categoryNameBn,
      keywords: post.metaKeywords.join(", "),
      medicalAudience: {
        "@type": "MedicalAudience",
        medicalAudienceType: "Patient",
      },
      reviewedBy: {
        "@type": "Organization",
        name: "হেলথ ক্লাব ক্লিনিক্যাল এডিটোরিয়াল বোর্ড",
        url: `${SITE_URL}/about-us`,
      },
      lastReviewed: getArticleIsoDate(post.modifiedDate),
      timeRequired: `PT${post.readTimeEn ? (post.readTimeEn.match(/\d+/)?.[0] || "8") : "8"}M`,
    },
  ];

  // Hospital structured data
  if (post.hospitals && post.hospitals.length > 0) {
    graph.push({
      "@type": "ItemList",
      "@id": `${pageUrl}#hospitals-list`,
      name: post.slug.includes("healthcare-guide")
        ? post.titleBn
        : "ফেনীর সেরা ১০টি হাসপাতাল",
      description: post.excerptBn,
      numberOfItems: post.hospitals.length,
      itemListElement: post.hospitals.map((h) => ({
        "@type": "ListItem",
        position: h.rank,
        item: {
          "@type": "Hospital",
          name: h.nameBn,
          telephone: h.phone,
          address: {
            "@type": "PostalAddress",
            streetAddress: h.addressBn,
            addressLocality: "Feni",
            addressRegion: "Chittagong",
            addressCountry: "BD",
          },
          url: h.partnerProfileSlug
            ? `${SITE_URL}/partner-hospitals/${encodeURIComponent(h.partnerProfileSlug)}`
            : pageUrl,
        },
      })),
    });
  }

  // Doctor structured data
  if (post.doctorGroups && post.doctorGroups.length > 0) {
    const allDoctors = post.doctorGroups.flatMap((g) => g.doctors);
    graph.push({
      "@type": "ItemList",
      "@id": `${pageUrl}#doctors-list`,
      name: "ফেনীর সেরা বিশেষজ্ঞ ডাক্তার তালিকা",
      description: post.excerptBn,
      numberOfItems: allDoctors.length,
      itemListElement: allDoctors.map((doc, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        item: {
          "@type": "Physician",
          name: doc.nameBn,
          medicalSpecialty: doc.specialtyBn,
          description: `${doc.designationBn}, ${doc.degreesBn}`,
          telephone: doc.serialPhone.split(",")[0].trim(),
          address: {
            "@type": "PostalAddress",
            streetAddress: doc.chamberAddressBn,
            addressLocality: "Feni",
            addressRegion: "Chittagong",
            addressCountry: "BD",
          },
          url: doc.consultantProfileUrl
            ? `${SITE_URL}${doc.consultantProfileUrl}`
            : `${SITE_URL}/consultants/${doc.id}`,
        },
      })),
    });
  }

  // Diagnostic Center structured data
  if (post.diagnosticCenters && post.diagnosticCenters.length > 0) {
    graph.push({
      "@type": "ItemList",
      "@id": `${pageUrl}#diagnostic-list`,
      name: "ফেনীর সেরা ডায়াগনস্টিক সেন্টার ও ল্যাব তালিকা",
      description: post.excerptBn,
      numberOfItems: post.diagnosticCenters.length,
      itemListElement: post.diagnosticCenters.map((diag) => ({
        "@type": "ListItem",
        position: diag.rank,
        item: {
          "@type": "DiagnosticLab",
          name: diag.nameBn,
          description: diag.descriptionBn,
          telephone: diag.phone.split(",")[0].trim(),
          address: {
            "@type": "PostalAddress",
            streetAddress: diag.addressBn,
            addressLocality: "Feni",
            addressRegion: "Chittagong",
            addressCountry: "BD",
          },
          url: diag.partnerProfileSlug
            ? `${SITE_URL}/partner-hospitals/${encodeURIComponent(diag.partnerProfileSlug)}`
            : pageUrl,
        },
      })),
    });
  }

  // Diagnostic Tests structured data (for pure test price guides)
  if (!post.diagnosticCenters && post.diagnosticTestPricingBn && post.diagnosticTestPricingBn.tests.length > 0) {
    graph.push({
      "@type": "ItemList",
      "@id": `${pageUrl}#medical-tests-list`,
      name: "ফেনীতে প্যাথলজি ও রেডিওলজি টেস্টের খরচ তালিকা",
      description: post.excerptBn,
      numberOfItems: post.diagnosticTestPricingBn.tests.length,
      itemListElement: post.diagnosticTestPricingBn.tests.slice(0, 30).map((test, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        item: {
          "@type": "MedicalTest",
          name: test.testNameBn,
          description: `${test.testNameBn} (${test.categoryBn}). সাধারণ বাজারদর: ${test.regularPriceRangeBn}, হেলথ ক্লাব মেম্বার ছাড়: ১০-৩০%।`,
          url: pageUrl,
        },
      })),
    });
  }

  // Dental Clinic structured data
  if (post.dentalClinics && post.dentalClinics.length > 0) {
    graph.push({
      "@type": "ItemList",
      "@id": `${pageUrl}#dental-list`,
      name: "ফেনীর সেরা ডেন্টাল ক্লিনিক ও সার্জন তালিকা",
      description: post.excerptBn,
      numberOfItems: post.dentalClinics.length,
      itemListElement: post.dentalClinics.map((clinic) => ({
        "@type": "ListItem",
        position: clinic.rank,
        item: {
          "@type": "Dentist",
          name: clinic.nameBn,
          description: `${clinic.doctorInChargeBn} (${clinic.degreesBn}). ${clinic.descriptionBn}`,
          telephone: clinic.phone.split(",")[0].trim(),
          medicalSpecialty: "Dentistry",
          address: {
            "@type": "PostalAddress",
            streetAddress: clinic.addressBn,
            addressLocality: "Feni",
            addressRegion: "Chittagong",
            addressCountry: "BD",
          },
          url: clinic.partnerProfileSlug
            ? `${SITE_URL}/partner-hospitals/${encodeURIComponent(clinic.partnerProfileSlug)}`
            : pageUrl,
        },
      })),
    });
  }

  // Physiotherapy Center structured data
  if (post.physiotherapyCenters && post.physiotherapyCenters.length > 0) {
    graph.push({
      "@type": "ItemList",
      "@id": `${pageUrl}#physiotherapy-list`,
      name: "ফেনীর সেরা ফিজিওথেরাপি সেন্টার ও থেরাপিস্ট তালিকা",
      description: post.excerptBn,
      numberOfItems: post.physiotherapyCenters.length,
      itemListElement: post.physiotherapyCenters.map((center) => ({
        "@type": "ListItem",
        position: center.rank,
        item: {
          "@type": "MedicalClinic",
          name: center.nameBn,
          description: `${center.doctorInChargeBn} (${center.degreesBn}). ${center.descriptionBn}`,
          telephone: center.phone.split(",")[0].trim(),
          medicalSpecialty: "Physiotherapy",
          address: {
            "@type": "PostalAddress",
            streetAddress: center.addressBn,
            addressLocality: "Feni",
            addressRegion: "Chittagong",
            addressCountry: "BD",
          },
          url: center.partnerProfileSlug
            ? `${SITE_URL}/partner-hospitals/${encodeURIComponent(center.partnerProfileSlug)}`
            : pageUrl,
        },
      })),
    });
  }

  // 24/7 Pharmacy structured data
  if (post.pharmacies && post.pharmacies.length > 0) {
    graph.push({
      "@type": "ItemList",
      "@id": `${pageUrl}#pharmacy-list`,
      name: "ফেনীতে ২৪ ঘণ্টা খোলা ফার্মেসি ও জরুরি ওষুধ ডেলিভারি তালিকা",
      description: post.excerptBn,
      numberOfItems: post.pharmacies.length,
      itemListElement: post.pharmacies.map((pharmacy) => ({
        "@type": "ListItem",
        position: pharmacy.rank,
        item: {
          "@type": "Pharmacy",
          name: pharmacy.nameBn,
          description: pharmacy.descriptionBn,
          telephone: pharmacy.phone.split(",")[0].trim(),
          address: {
            "@type": "PostalAddress",
            streetAddress: pharmacy.addressBn,
            addressLocality: "Feni",
            addressRegion: "Chittagong",
            addressCountry: "BD",
          },
          ...(pharmacy.partnerProfileSlug
            ? { url: `${SITE_URL}/partner-hospitals/${encodeURIComponent(pharmacy.partnerProfileSlug)}` }
            : { url: pageUrl }),
        },
      })),
    });
  }

  // Blood Bank and Voluntary Donor Organization structured data
  if (post.bloodBanks && post.bloodBanks.length > 0) {
    graph.push({
      "@type": "ItemList",
      "@id": `${pageUrl}#blood-banks-list`,
      name: "ফেনী জেলা জরুরি ব্লাড ব্যাংক ও রক্তদান সংগঠন তালিকা",
      description: post.excerptBn,
      numberOfItems: post.bloodBanks.length,
      itemListElement: post.bloodBanks.map((bank) => ({
        "@type": "ListItem",
        position: bank.rank,
        item: {
          "@type": "MedicalOrganization",
          name: bank.nameBn,
          description: bank.descriptionBn,
          telephone: bank.phone.split(",")[0].trim(),
          address: {
            "@type": "PostalAddress",
            streetAddress: bank.addressBn,
            addressLocality: "Feni",
            addressRegion: "Chittagong",
            addressCountry: "BD",
          },
          ...(bank.partnerProfileSlug
            ? { url: `${SITE_URL}/partner-hospitals/${encodeURIComponent(bank.partnerProfileSlug)}` }
            : { url: pageUrl }),
        },
      })),
    });
  }

  // 24/7 Ambulance and Emergency Transport structured data
  if (post.ambulances && post.ambulances.length > 0) {
    graph.push({
      "@type": "ItemList",
      "@id": `${pageUrl}#ambulance-list`,
      name: "ফেনী ২৪/৭ জরুরি অ্যাম্বুলেন্স ও অক্সিজেন সেবা তালিকা",
      description: post.excerptBn,
      numberOfItems: post.ambulances.length,
      itemListElement: post.ambulances.map((amb) => ({
        "@type": "ListItem",
        position: amb.rank,
        item: {
          "@type": "EmergencyService",
          name: amb.nameBn,
          description: amb.descriptionBn,
          telephone: amb.phone.split(",")[0].trim(),
          address: {
            "@type": "PostalAddress",
            streetAddress: amb.addressBn,
            addressLocality: "Feni",
            addressRegion: "Chittagong",
            addressCountry: "BD",
          },
          ...(amb.partnerProfileSlug
            ? { url: `${SITE_URL}/partner-hospitals/${encodeURIComponent(amb.partnerProfileSlug)}` }
            : { url: pageUrl }),
        },
      })),
    });
  }

  // Surgical and Critical Care procedure structured data
  if (post.surgicalCarePricingBn?.packages?.length) {
    graph.push({
      "@type": "ItemList",
      "@id": `${pageUrl}#surgery-price-guide`,
      name: post.surgicalCarePricingBn.titleBn,
      numberOfItems: post.surgicalCarePricingBn.packages.length,
      itemListElement: post.surgicalCarePricingBn.packages.map((pkg, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        item: {
          "@type": "MedicalProcedure",
          name: pkg.procedureOrTestNameBn,
          description: `${pkg.procedureOrTestNameBn}. বাজারদর: ${pkg.regularPriceRangeBn}, মেম্বার ছাড়: ১০-৩০%।`,
          url: `${pageUrl}#surgery-price-guide`,
        },
      })),
    });
  }

  if (post.criticalCarePricingBn?.packages?.length) {
    graph.push({
      "@type": "ItemList",
      "@id": `${pageUrl}#critical-care-price-guide`,
      name: post.criticalCarePricingBn.titleBn,
      numberOfItems: post.criticalCarePricingBn.packages.length,
      itemListElement: post.criticalCarePricingBn.packages.map((pkg, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        item: {
          "@type": "MedicalProcedure",
          name: pkg.serviceOrBedNameBn,
          description: `${pkg.serviceOrBedNameBn}. বাজারদর: ${pkg.regularPriceRangeBn}, মেম্বার ছাড়: ১০-৩০%।`,
          url: `${pageUrl}#critical-care-price-guide`,
        },
      })),
    });
  }

  // FAQ structured data
  if (post.faqs && post.faqs.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${pageUrl}#faq`,
      isPartOf: { "@id": `${pageUrl}#webpage` },
      mainEntity: post.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.questionBn,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answerBn,
        },
      })),
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}
