import { SITE_URL } from "@/lib/siteConfig";
import { BlogPost } from "@/types/blog";
import { Doctor, Partner } from "@/services/db";
import {
  MedicalTestEntity,
  MedicalConditionEntity,
  MEDICAL_CONDITIONS_REGISTRY,
} from "./medicalConditionsData";

export * from "./medicalConditionsData";

/**
 * Official Medical Recognizing Authorities in Bangladesh
 */
export const DGHS_AUTHORITY = {
  "@type": "GovernmentOrganization",
  name: "Directorate General of Health Services (DGHS)",
  alternateName: "স্বাস্থ্য অধিদপ্তর, বাংলাদেশ",
  url: "https://dghs.gov.bd",
};

export const BMDC_AUTHORITY = {
  "@type": "MedicalOrganization",
  name: "Bangladesh Medical & Dental Council (BMDC)",
  alternateName: "বাংলাদেশ মেডিকেল অ্যান্ড ডেন্টাল কাউন্সিল",
  url: "https://bmdc.org.bd",
};

export const MEDICAL_RECOGNIZING_AUTHORITIES = [DGHS_AUTHORITY, BMDC_AUTHORITY];

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

/**
 * Builds standard Schema.org MedicalCondition node
 */
export function buildMedicalConditionSchema(
  condition: MedicalConditionEntity,
  options?: { siteUrl?: string }
): Record<string, unknown> {
  const base = options?.siteUrl || SITE_URL;
  const conditionUrl = `${base}/#condition-${condition.id}`;
  const specialty = SCHEMA_SPECIALTY_MAP[condition.departmentSlug] || SCHEMA_SPECIALTY_MAP.other;

  return {
    "@type": "MedicalCondition",
    "@id": conditionUrl,
    name: `${condition.nameBn} (${condition.nameEn})`,
    alternateName: condition.alternateNames,
    code: {
      "@type": "MedicalCode",
      code: condition.icd10Code,
      codingSystem: "ICD-10",
    },
    signOrSymptom: condition.signsOrSymptomsBn.map((sym) => ({
      "@type": "MedicalSignOrSymptom",
      name: sym,
    })),
    possibleTreatment: condition.possibleTreatmentsBn.map((tr) => ({
      "@type": "MedicalTherapy",
      name: tr,
    })),
    relevantSpecialty: {
      "@type": "MedicalSpecialty",
      name: specialty.nameBn,
      alternateName: specialty.nameEn,
      url: specialty.uri,
    },
    recognizingAuthority: MEDICAL_RECOGNIZING_AUTHORITIES,
  };
}

/**
 * Builds standard Schema.org MedicalTest node
 */
export function buildMedicalTestSchema(
  test: MedicalTestEntity,
  conditionId: string,
  options?: { siteUrl?: string; partnerName?: string; discountText?: string }
): Record<string, unknown> {
  const base = options?.siteUrl || SITE_URL;
  const testUrl = `${base}/#test-${test.id}`;

  return {
    "@type": ["MedicalTest", test.testType || "MedicalTest"],
    "@id": testUrl,
    name: `${test.nameBn} (${test.nameEn})`,
    usedToDiagnose: {
      "@id": `${base}/#condition-${conditionId}`,
    },
    description: test.descriptionBn || `${test.nameBn} - রোগ নির্ণয় ও মনিটরিং পরীক্ষা`,
    offers: {
      "@type": "Offer",
      description: options?.discountText || "১০-৩০% মেম্বার ছাড় (ফেনী সদর পার্টনার সুবিধা)",
      priceCurrency: "BDT",
      eligibleRegion: {
        "@type": "AdministrativeArea",
        name: "Feni Sadar, Feni, Bangladesh",
      },
      seller: options?.partnerName
        ? {
            "@type": "MedicalBusiness",
            name: options.partnerName,
          }
        : undefined,
    },
    recognizingAuthority: MEDICAL_RECOGNIZING_AUTHORITIES,
  };
}

/**
 * Extracts connected Semantic Medical Entity Knowledge Graph nodes for Blog Articles
 */
export function getSemanticKnowledgeGraphForBlog(post: BlogPost, pageUrl?: string) {
  const matchedConditions: MedicalConditionEntity[] = [];
  const textToSearch = `${post.slug} ${post.category} ${(post.metaKeywords || []).join(" ")} ${post.titleBn} ${post.titleEn}`.toLowerCase();

  for (const condition of Object.values(MEDICAL_CONDITIONS_REGISTRY)) {
    const idMatch = textToSearch.includes(condition.id.replace(/-/g, " ")) || textToSearch.includes(condition.id);
    const bnMatch = textToSearch.includes(condition.nameBn.split(" ")[0]);
    const enMatch = textToSearch.includes(condition.nameEn.toLowerCase().split(" ")[0]);
    const deptMatch = post.category === condition.departmentSlug;

    if (idMatch || bnMatch || enMatch || deptMatch) {
      matchedConditions.push(condition);
      if (matchedConditions.length >= 2) break;
    }
  }

  // Fallback to medicine or cardiology condition if none matched
  if (matchedConditions.length === 0) {
    matchedConditions.push(MEDICAL_CONDITIONS_REGISTRY["dengue-fever"]);
  }

  const articleUrl = pageUrl || `${SITE_URL}/blog/${post.slug}`;
  const conditionNodes: Record<string, unknown>[] = matchedConditions.map((c) => ({
    ...buildMedicalConditionSchema(c, { siteUrl: SITE_URL }),
    url: articleUrl,
  }));
  const testNodes: Record<string, unknown>[] = matchedConditions.flatMap((c) =>
    c.recommendedTests.map((t) => buildMedicalTestSchema(t, c.id, { siteUrl: SITE_URL }))
  );

  return {
    conditionNodes,
    testNodes,
    aboutRefs: conditionNodes.map((cn) => ({ "@id": (cn["@id"] as string) || "" })),
    mentionsRefs: testNodes.map((tn) => ({ "@id": (tn["@id"] as string) || "" })),
  };
}

/**
 * Extracts connected Semantic Medical Entity Knowledge Graph nodes for Doctors
 */
export function getSemanticKnowledgeGraphForDoctor(doctor: Doctor) {
  const dept = doctor.department?.toLowerCase();
  const matched = Object.values(MEDICAL_CONDITIONS_REGISTRY).filter((c) => c.departmentSlug === dept);
  const conditions = matched.length > 0 ? matched : [MEDICAL_CONDITIONS_REGISTRY["dengue-fever"]];

  const knowsAbout = conditions.map((c) => ({
    "@type": "MedicalCondition",
    name: `${c.nameBn} (${c.nameEn})`,
    code: {
      "@type": "MedicalCode",
      code: c.icd10Code,
      codingSystem: "ICD-10",
    },
    signOrSymptom: c.signsOrSymptomsBn.slice(0, 3).map((name) => ({
      "@type": "MedicalSignOrSymptom",
      name,
    })),
  }));

  const availableService = conditions.flatMap((c) =>
    c.recommendedTests.map((t) => ({
      "@type": "MedicalTest",
      name: `${t.nameBn} (${t.nameEn})`,
      usedToDiagnose: `${c.nameBn} (${c.nameEn})`,
    }))
  );

  return {
    knowsAbout,
    availableService,
    recognizingAuthority: BMDC_AUTHORITY,
  };
}

/**
 * Extracts connected Semantic Medical Entity Knowledge Graph nodes for Partner Facilities
 */
export function getSemanticKnowledgeGraphForPartner(partner: Partner) {
  const isHospital = partner.category === "hospital";
  const conditions = isHospital
    ? [
        MEDICAL_CONDITIONS_REGISTRY["heart-attack"],
        MEDICAL_CONDITIONS_REGISTRY["pregnancy-maternal-care"],
        MEDICAL_CONDITIONS_REGISTRY["bone-fracture"],
        MEDICAL_CONDITIONS_REGISTRY["gallstones-cholelithiasis"],
      ]
    : [
        MEDICAL_CONDITIONS_REGISTRY["dengue-fever"],
        MEDICAL_CONDITIONS_REGISTRY["diabetes-mellitus"],
        MEDICAL_CONDITIONS_REGISTRY["chronic-kidney-disease"],
        MEDICAL_CONDITIONS_REGISTRY["jaundice-liver-disease"],
      ];

  const availableService = conditions.flatMap((c) =>
    c.recommendedTests.map((t) => ({
      "@type": "MedicalTest",
      name: `${t.nameBn} (${t.nameEn})`,
      description: `${t.nameBn} - ${partner.name}, ফেনী সদরে হেলথ ক্লাব মেম্বার ছাড়: ${partner.discount || "১০-৩০%"}`,
      offers: {
        "@type": "Offer",
        description: `হেলথ ক্লাব কার্ডে ${partner.discount || "১০-৩০%"} মেম্বার ছাড় (ফেনী সদর পার্টনার সুবিধা)`,
        priceCurrency: "BDT",
        eligibleRegion: {
          "@type": "AdministrativeArea",
          name: "Feni Sadar, Feni, Bangladesh",
        },
      },
    }))
  );

  const knowsAbout = conditions.map((c) => ({
    "@type": "MedicalCondition",
    name: `${c.nameBn} (${c.nameEn})`,
    code: {
      "@type": "MedicalCode",
      code: c.icd10Code,
      codingSystem: "ICD-10",
    },
  }));

  return {
    knowsAbout,
    availableService,
    recognizingAuthority: DGHS_AUTHORITY,
  };
}
