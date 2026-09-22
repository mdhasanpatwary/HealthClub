import { BlogPost } from "@/types/blog";
import { SITE_URL } from "@/lib/siteConfig";
import { getArticleIsoDate } from "@/lib/dateUtils";

export function generateBlogJsonLd(
  post: BlogPost,
  title: string,
  pageUrl: string,
  isEn: boolean,
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
      description: isEn ? post.excerptEn : post.excerptBn,
      inLanguage: isEn ? "en-US" : "bn-BD",
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
          name: isEn ? "Home" : "হোম",
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: isEn ? "Blog" : "ব্লগ",
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
      description: isEn ? post.excerptEn : post.excerptBn,
      image: coverImageUrl,
      datePublished: getArticleIsoDate(post.publishedDate),
      dateModified: getArticleIsoDate(post.modifiedDate),
      inLanguage: isEn ? "en-US" : "bn-BD",
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
        name: isEn ? post.author.nameEn : post.author.nameBn,
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
      articleSection: isEn ? post.categoryNameEn : post.categoryNameBn,
      keywords: post.metaKeywords.join(", "),
      medicalAudience: {
        "@type": "MedicalAudience",
        medicalAudienceType: "Patient",
      },
      reviewedBy: {
        "@type": "Organization",
        name: isEn
          ? "Health Club Clinical Editorial Board"
          : "হেলথ ক্লাব ক্লিনিক্যাল এডিটোরিয়াল বোর্ড",
        url: `${SITE_URL}/about`,
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
        ? (isEn ? post.titleEn : post.titleBn)
        : (isEn ? "Best 10 Hospitals in Feni" : "ফেনীর সেরা ১০টি হাসপাতাল"),
      description: isEn ? post.excerptEn : post.excerptBn,
      numberOfItems: post.hospitals.length,
      itemListElement: post.hospitals.map((h) => ({
        "@type": "ListItem",
        position: h.rank,
        item: {
          "@type": "Hospital",
          name: isEn ? h.nameEn : h.nameBn,
          telephone: h.phone,
          address: {
            "@type": "PostalAddress",
            streetAddress: isEn ? h.addressEn : h.addressBn,
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
      name: isEn ? "Best Doctors in Feni Directory" : "ফেনীর সেরা বিশেষজ্ঞ ডাক্তার তালিকা",
      description: isEn ? post.excerptEn : post.excerptBn,
      numberOfItems: allDoctors.length,
      itemListElement: allDoctors.map((doc, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        item: {
          "@type": "Physician",
          name: isEn ? doc.nameEn : doc.nameBn,
          medicalSpecialty: isEn ? doc.specialtyEn : doc.specialtyBn,
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
      name: isEn ? "Best Diagnostic Centers in Feni" : "ফেনীর সেরা ডায়াগনস্টিক সেন্টার ও ল্যাব তালিকা",
      description: isEn ? post.excerptEn : post.excerptBn,
      numberOfItems: post.diagnosticCenters.length,
      itemListElement: post.diagnosticCenters.map((diag) => ({
        "@type": "ListItem",
        position: diag.rank,
        item: {
          "@type": "DiagnosticLab",
          name: isEn ? diag.nameEn : diag.nameBn,
          description: diag.descriptionBn,
          telephone: diag.phone.split(",")[0].trim(),
          address: {
            "@type": "PostalAddress",
            streetAddress: isEn ? diag.addressEn : diag.addressBn,
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
      name: isEn
        ? "Diagnostic & Pathology Test Price List in Feni"
        : "ফেনীতে প্যাথলজি ও রেডিওলজি টেস্টের খরচ তালিকা",
      description: isEn ? post.excerptEn : post.excerptBn,
      numberOfItems: post.diagnosticTestPricingBn.tests.length,
      itemListElement: post.diagnosticTestPricingBn.tests.slice(0, 30).map((test, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        item: {
          "@type": "MedicalTest",
          name: isEn ? test.testNameEn : test.testNameBn,
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
      name: isEn ? "Best Dental Clinics in Feni" : "ফেনীর সেরা ডেন্টাল ক্লিনিক ও সার্জন তালিকা",
      description: isEn ? post.excerptEn : post.excerptBn,
      numberOfItems: post.dentalClinics.length,
      itemListElement: post.dentalClinics.map((clinic) => ({
        "@type": "ListItem",
        position: clinic.rank,
        item: {
          "@type": "Dentist",
          name: isEn ? clinic.nameEn : clinic.nameBn,
          description: `${clinic.doctorInChargeBn} (${clinic.degreesBn}). ${clinic.descriptionBn}`,
          telephone: clinic.phone.split(",")[0].trim(),
          medicalSpecialty: "Dentistry",
          address: {
            "@type": "PostalAddress",
            streetAddress: isEn ? clinic.addressEn : clinic.addressBn,
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
      name: isEn
        ? "Best Physiotherapy Centers in Feni"
        : "ফেনীর সেরা ফিজিওথেরাপি সেন্টার ও থেরাপিস্ট তালিকা",
      description: isEn ? post.excerptEn : post.excerptBn,
      numberOfItems: post.physiotherapyCenters.length,
      itemListElement: post.physiotherapyCenters.map((center) => ({
        "@type": "ListItem",
        position: center.rank,
        item: {
          "@type": "MedicalClinic",
          name: isEn ? center.nameEn : center.nameBn,
          description: `${center.doctorInChargeBn} (${center.degreesBn}). ${center.descriptionBn}`,
          telephone: center.phone.split(",")[0].trim(),
          medicalSpecialty: "Physiotherapy",
          address: {
            "@type": "PostalAddress",
            streetAddress: isEn ? center.addressEn : center.addressBn,
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
      name: isEn
        ? "24/7 Pharmacies & Emergency Medicine Delivery in Feni"
        : "ফেনীতে ২৪ ঘণ্টা খোলা ফার্মেসি ও জরুরি ওষুধ ডেলিভারি তালিকা",
      description: isEn ? post.excerptEn : post.excerptBn,
      numberOfItems: post.pharmacies.length,
      itemListElement: post.pharmacies.map((pharmacy) => ({
        "@type": "ListItem",
        position: pharmacy.rank,
        item: {
          "@type": "Pharmacy",
          name: isEn ? pharmacy.nameEn : pharmacy.nameBn,
          description: pharmacy.descriptionBn,
          telephone: pharmacy.phone.split(",")[0].trim(),
          address: {
            "@type": "PostalAddress",
            streetAddress: isEn ? pharmacy.addressEn : pharmacy.addressBn,
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
      name: isEn
        ? "Emergency Blood Banks & Voluntary Donor Networks in Feni"
        : "ফেনী জেলা জরুরি ব্লাড ব্যাংক ও রক্তদান সংগঠন তালিকা",
      description: isEn ? post.excerptEn : post.excerptBn,
      numberOfItems: post.bloodBanks.length,
      itemListElement: post.bloodBanks.map((bank) => ({
        "@type": "ListItem",
        position: bank.rank,
        item: {
          "@type": "MedicalOrganization",
          name: isEn ? bank.nameEn : bank.nameBn,
          description: bank.descriptionBn,
          telephone: bank.phone.split(",")[0].trim(),
          address: {
            "@type": "PostalAddress",
            streetAddress: isEn ? bank.addressEn : bank.addressBn,
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
      name: isEn
        ? "24/7 Emergency Ambulance & Oxygen Services in Feni"
        : "ফেনী ২৪/৭ জরুরি অ্যাম্বুলেন্স ও অক্সিজেন সেবা তালিকা",
      description: isEn ? post.excerptEn : post.excerptBn,
      numberOfItems: post.ambulances.length,
      itemListElement: post.ambulances.map((amb) => ({
        "@type": "ListItem",
        position: amb.rank,
        item: {
          "@type": "EmergencyService",
          name: isEn ? amb.nameEn : amb.nameBn,
          description: amb.descriptionBn,
          telephone: amb.phone.split(",")[0].trim(),
          address: {
            "@type": "PostalAddress",
            streetAddress: isEn ? amb.addressEn : amb.addressBn,
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

  // FAQ structured data
  if (post.faqs && post.faqs.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${pageUrl}#faq`,
      isPartOf: { "@id": `${pageUrl}#webpage` },
      mainEntity: post.faqs.map((faq) => ({
        "@type": "Question",
        name: isEn ? faq.questionEn : faq.questionBn,
        acceptedAnswer: {
          "@type": "Answer",
          text: isEn ? faq.answerEn : faq.answerBn,
        },
      })),
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}
