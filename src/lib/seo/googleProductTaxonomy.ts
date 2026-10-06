/**
 * Google Product Taxonomy (GPT) mappings for Healthcare & Medical Equipment.
 * Standardizes categories into Schema.org CategoryCode objects compliant with
 * Google Search Console's Merchant listings structured data requirements.
 *
 * Official Taxonomy Source:
 * https://www.google.com/basepages/producttype/taxonomy-with-ids.en-US.txt
 */

export const GOOGLE_PRODUCT_TAXONOMY_URL =
  "https://www.google.com/basepages/producttype/taxonomy-with-ids.en-US.txt";

export interface GoogleCategoryCode {
  "@type": "CategoryCode";
  inCodeSet: typeof GOOGLE_PRODUCT_TAXONOMY_URL;
  codeValue: string;
  name: string;
}

interface ProductIdentifier {
  category?: string | null;
  slug?: string | null;
  nameEn?: string | null;
  nameBn?: string | null;
}

/**
 * Returns a standardized CategoryCode node for any healthcare product.
 * Guarantees zero "Invalid value in field 'category'" issues in Google Search Console.
 */
export function getGoogleProductCategory(product: ProductIdentifier): GoogleCategoryCode {
  const slug = (product.slug || "").toLowerCase();
  const cat = (product.category || "").toLowerCase();
  const nameEn = (product.nameEn || "").toLowerCase();

  // 1. Blood Pressure Monitors
  if (
    slug.includes("bp") ||
    slug.includes("blood-pressure") ||
    slug.includes("hem-") ||
    slug.includes("sphygmo") ||
    nameEn.includes("blood pressure")
  ) {
    return {
      "@type": "CategoryCode",
      inCodeSet: GOOGLE_PRODUCT_TAXONOMY_URL,
      codeValue: "495",
      name: "Health & Beauty > Health Care > Biometric Monitors > Blood Pressure Monitors",
    };
  }

  // 2. Respiratory & Nebulizers
  if (slug.includes("nebulizer") || slug.includes("inhaler") || nameEn.includes("nebulizer")) {
    return {
      "@type": "CategoryCode",
      inCodeSet: GOOGLE_PRODUCT_TAXONOMY_URL,
      codeValue: "4552",
      name: "Health & Beauty > Health Care > Respiratory Care > Nebulizers",
    };
  }

  // 3. Medical Thermometers
  if (slug.includes("thermometer") || nameEn.includes("thermometer")) {
    return {
      "@type": "CategoryCode",
      inCodeSet: GOOGLE_PRODUCT_TAXONOMY_URL,
      codeValue: "501",
      name: "Health & Beauty > Health Care > Biometric Monitors > Medical Thermometers",
    };
  }

  // 4. Pulse Oximeters
  if (slug.includes("oximeter") || slug.includes("pulse") || nameEn.includes("oximeter")) {
    return {
      "@type": "CategoryCode",
      inCodeSet: GOOGLE_PRODUCT_TAXONOMY_URL,
      codeValue: "5551",
      name: "Health & Beauty > Health Care > Biometric Monitors > Pulse Oximeters",
    };
  }

  // 5. Body Weight Scales
  if (slug.includes("scale") || slug.includes("weight") || nameEn.includes("scale")) {
    return {
      "@type": "CategoryCode",
      inCodeSet: GOOGLE_PRODUCT_TAXONOMY_URL,
      codeValue: "500",
      name: "Health & Beauty > Health Care > Biometric Monitors > Body Weight Scales",
    };
  }

  // 6. Diabetes Care (Meters, Strips, Lancets)
  if (
    cat === "diabetes_care" ||
    slug.includes("gluco") ||
    slug.includes("sugar") ||
    slug.includes("accu-chek") ||
    nameEn.includes("glucose")
  ) {
    if (slug.includes("strip") || nameEn.includes("strip")) {
      return {
        "@type": "CategoryCode",
        inCodeSet: GOOGLE_PRODUCT_TAXONOMY_URL,
        codeValue: "3905",
        name: "Health & Beauty > Health Care > Biometric Monitor Accessories > Blood Glucose Meter Accessories > Blood Glucose Test Strips",
      };
    }
    if (slug.includes("lancet") || slug.includes("lancing") || nameEn.includes("lancet")) {
      return {
        "@type": "CategoryCode",
        inCodeSet: GOOGLE_PRODUCT_TAXONOMY_URL,
        codeValue: "3111",
        name: "Health & Beauty > Health Care > Biometric Monitor Accessories > Blood Glucose Meter Accessories > Lancing Devices",
      };
    }
    return {
      "@type": "CategoryCode",
      inCodeSet: GOOGLE_PRODUCT_TAXONOMY_URL,
      codeValue: "2246",
      name: "Health & Beauty > Health Care > Biometric Monitors > Blood Glucose Meters",
    };
  }

  // 7. Orthopedic Supports & Braces
  if (
    cat === "orthopedic" ||
    slug.includes("belt") ||
    slug.includes("brace") ||
    slug.includes("support") ||
    slug.includes("collar") ||
    nameEn.includes("brace") ||
    nameEn.includes("support")
  ) {
    if (slug.includes("lumbar") || slug.includes("back") || nameEn.includes("lumbar")) {
      return {
        "@type": "CategoryCode",
        inCodeSet: GOOGLE_PRODUCT_TAXONOMY_URL,
        codeValue: "7404",
        name: "Health & Beauty > Personal Care > Back Care > Back & Lumbar Support Cushions",
      };
    }
    return {
      "@type": "CategoryCode",
      inCodeSet: GOOGLE_PRODUCT_TAXONOMY_URL,
      codeValue: "523",
      name: "Health & Beauty > Health Care > Supports & Braces",
    };
  }

  // 8. First Aid & Surgical
  if (cat === "first_aid" || slug.includes("first-aid") || nameEn.includes("first aid")) {
    if (slug.includes("kit") || slug.includes("box") || nameEn.includes("kit")) {
      return {
        "@type": "CategoryCode",
        inCodeSet: GOOGLE_PRODUCT_TAXONOMY_URL,
        codeValue: "510",
        name: "Health & Beauty > Health Care > First Aid > First Aid Kits",
      };
    }
    if (
      slug.includes("bandage") ||
      slug.includes("gauze") ||
      slug.includes("tape") ||
      nameEn.includes("bandage")
    ) {
      return {
        "@type": "CategoryCode",
        inCodeSet: GOOGLE_PRODUCT_TAXONOMY_URL,
        codeValue: "509",
        name: "Health & Beauty > Health Care > First Aid > Medical Tape & Bandages",
      };
    }
    if (
      slug.includes("antiseptic") ||
      slug.includes("savlon") ||
      slug.includes("dettol") ||
      nameEn.includes("antiseptic")
    ) {
      return {
        "@type": "CategoryCode",
        inCodeSet: GOOGLE_PRODUCT_TAXONOMY_URL,
        codeValue: "2954",
        name: "Health & Beauty > Health Care > First Aid > Antiseptics & Cleaning Supplies",
      };
    }
    return {
      "@type": "CategoryCode",
      inCodeSet: GOOGLE_PRODUCT_TAXONOMY_URL,
      codeValue: "508",
      name: "Health & Beauty > Health Care > First Aid",
    };
  }

  // 9. Wellness & Therapies
  if (cat === "wellness") {
    if (
      slug.includes("hot") ||
      slug.includes("cold") ||
      slug.includes("ice") ||
      slug.includes("heat")
    ) {
      return {
        "@type": "CategoryCode",
        inCodeSet: GOOGLE_PRODUCT_TAXONOMY_URL,
        codeValue: "516",
        name: "Health & Beauty > Health Care > First Aid > Hot & Cold Therapies",
      };
    }
    return {
      "@type": "CategoryCode",
      inCodeSet: GOOGLE_PRODUCT_TAXONOMY_URL,
      codeValue: "491",
      name: "Health & Beauty > Health Care",
    };
  }

  // 10. General Medical Devices
  if (cat === "medical_device") {
    return {
      "@type": "CategoryCode",
      inCodeSet: GOOGLE_PRODUCT_TAXONOMY_URL,
      codeValue: "494",
      name: "Health & Beauty > Health Care > Biometric Monitors",
    };
  }

  // Default fallback for general healthcare items
  return {
    "@type": "CategoryCode",
    inCodeSet: GOOGLE_PRODUCT_TAXONOMY_URL,
    codeValue: "491",
    name: "Health & Beauty > Health Care",
  };
}
