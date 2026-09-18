/**
 * Converts Bengali digits (০-৯) to English digits (0-9).
 */
export function toEnglishDigits(str: string | number): string {
  if (str === null || str === undefined) return "";
  const banglaToEnglishMap: Record<string, string> = {
    "০": "0",
    "১": "1",
    "২": "2",
    "৩": "3",
    "৪": "4",
    "৫": "5",
    "৬": "6",
    "৭": "7",
    "৮": "8",
    "৯": "9",
  };
  let result = str.toString();
  for (const [bn, en] of Object.entries(banglaToEnglishMap)) {
    result = result.replaceAll(bn, en);
  }
  return result;
}

/**
 * Formats pricing ranges like '৳৩০০ - ৳৫০০' to '৳300 - ৳500' in English.
 */
export function formatBlogPriceRange(priceStr: string, isEn: boolean): string {
  if (!priceStr) return "";
  if (!isEn) return priceStr;
  return toEnglishDigits(priceStr)
    .replace(/প্রতি সেশন/g, "per session")
    .replace(/প্রতি টেস্ট/g, "per test")
    .replace(/থেকে/g, "-")
    .replace(/টাকা/g, "BDT");
}

const CATEGORY_TRANSLATIONS: Record<string, string> = {
  "প্যাথলজি ও বায়োকেমিস্ট্রি": "Pathology & Biochemistry",
  "হেমাটোলজি": "Hematology",
  "বায়োকেমিস্ট্রি": "Biochemistry",
  "ইলেক্ট্রোকার্ডিওগ্রাম / কার্ডিয়াক": "Electrocardiogram / Cardiac",
  "সোনোগ্রাফি / ইমেজিং": "Sonography / Imaging",
  "অ্যাডভান্সড নিউরো ইমেজিং": "Advanced Neuro Imaging",
  "হরমোন ও থাইরয়েড": "Hormones & Thyroid",
  "মাইক্রোবায়োলজি": "Microbiology",
  "সেরোলজি": "Serology",
  "ডেন্টাল সার্জারি": "Dental Surgery",
  "এন্ডোডন্টিক্স": "Endodontics",
  "প্রোস্থোডন্টিক্স": "Prosthodontics",
  "অর্থোডন্টিক্স": "Orthodontics",
  "কসমেটিক ডেন্টিস্ট্রি": "Cosmetic Dentistry",
  "রেস্টোরেটিভ ডেন্টিস্ট্রি": "Restorative Dentistry",
  "ইলেক্ট্রোথেরাপি": "Electrotherapy",
  "ম্যানুয়াল থেরাপি": "Manual Therapy",
  "নিউরো রিহ্যাব": "Neuro Rehabilitation",
  "অর্থোপেডিক রিহ্যাব": "Orthopedic Rehabilitation",
  "জেরিয়াট্রিক কেয়ার": "Geriatric Care",
  "প্রসব সেবা": "Delivery Care",
  "সিজারিয়ান প্যাকেজ": "C-Section Package",
  "স্বাভাবিক প্রসব": "Normal Delivery Package",
  "কার্ডিয়াক ডায়াগনস্টিক": "Cardiac Diagnostics",
  "কার্ডিয়াক হেলথ চেকআপ": "Cardiac Health Checkup",
  "জরুরি কার্ডিয়াক কেয়ার": "Emergency Cardiac Care",
};

export function translateMedicalCategory(categoryBn: string, isEn: boolean): string {
  if (!categoryBn || !isEn) return categoryBn;
  return CATEGORY_TRANSLATIONS[categoryBn.trim()] || categoryBn;
}

const LOCATION_TRANSLATIONS: Record<string, string> = {
  "জিরো পয়েন্ট, এসএসকে রোড": "Zero Point, SSK Road",
  "এসএসকে রোড": "SSK Road",
  "গ্র্যান্ড ট্রাঙ্ক রোড": "Grand Trunk Road",
  "ট্রাঙ্ক রোড": "Trunk Road",
  "খেজুর চত্বর, ট্রাংক রোড": "Khejur Chottor, Trunk Road",
  "জাহিরিয়া টাওয়ার, ট্রাঙ্ক রোড": "Jahiria Tower, Trunk Road",
  "মিজান রোড": "Mizan Road",
  "জেল রোড, সদর হাসপাতাল মোড়": "Jail Road, Sadar Hospital Mor",
  "খাজুরিয়া কোট বিল্ডিং, ট্রাংক রোড": "Khajuria Court Building, Trunk Road",
  "শহীদ শহিদুল্লাহ কায়সার সড়ক": "Shahid Shahidullah Kaiser Road",
  "হাসপাতাল মোড়, জেল রোড": "Hospital Mor, Jail Road",
  "সদর হাসপাতাল রোড": "Sadar Hospital Road",
  "ডাক্তার পাড়া": "Doctor Para",
  "কলেজ রোড": "College Road",
  "বড় বাজার": "Boro Bazar",
  "ইসলামপুর রোড": "Islampur Road",
  "মুক্তার বাড়ি মোড়": "Muktar Bari Mor",
  "মাস্টার পাড়া": "Master Para",
};

export function translateLocation(locBn: string, isEn: boolean): string {
  if (!locBn || !isEn) return locBn;
  const match = Object.entries(LOCATION_TRANSLATIONS).find(([bn]) =>
    locBn.toLowerCase().includes(bn.toLowerCase())
  );
  if (match) {
    return match[1];
  }
  return toEnglishDigits(locBn);
}

export function translateDiscount(discountBn: string, isEn: boolean): string {
  if (!discountBn || !isEn) return discountBn;
  return toEnglishDigits(discountBn)
    .replace(/১০-৩০% বিশেষ ছাড়/g, "10-30% Member Discount")
    .replace(/১০-৩০% মেম্বার ছাড়/g, "10-30% Member Discount")
    .replace(/হেলথ ক্লাব কার্ডে ২৫% পর্যন্ত ছাড়/g, "Up to 25% Health Club Discount")
    .replace(/সরকারি ন্যূনতম ফি/g, "Govt. Subsidized Rates")
    .replace(/প্রাইভেট নির্ধারিত চার্জ/g, "Standard Private Rates")
    .replace(/রেগুলার রেট/g, "Regular Market Rate")
    .replace(/মেম্বার হলে ১০-৩০% ডিসকাউন্ট/g, "10-30% Member Discount")
    .replace(/১০-২০% মেম্বার ছাড়/g, "10-20% Member Discount")
    .replace(/বিশেষ মেম্বার ছাড়/g, "Special Member Savings")
    .replace(/ছাড়/g, "Discount");
}

export function translateTurnaroundTime(timeBn: string, isEn: boolean): string {
  if (!timeBn || !isEn) return timeBn;
  return toEnglishDigits(timeBn)
    .replace(/তাৎক্ষণিক রিপোর্ট/g, "Instant Report")
    .replace(/২৪ ঘণ্টা/g, "24 Hours")
    .replace(/২-৪ ঘণ্টা/g, "2-4 Hours")
    .replace(/৪-৬ ঘণ্টা/g, "4-6 Hours")
    .replace(/৬-৮ ঘণ্টা/g, "6-8 Hours")
    .replace(/১২ ঘণ্টা/g, "12 Hours")
    .replace(/২-৩ দিন/g, "2-3 Days")
    .replace(/৩-৫ দিন/g, "3-5 Days")
    .replace(/ঘণ্টা/g, "Hours")
    .replace(/দিন/g, "Days")
    .replace(/মিনিট/g, "Minutes");
}

export function translateComparisonStatus(val: boolean | string, isEn: boolean): string {
  if (typeof val === "boolean") {
    return isEn ? (val ? "Yes" : "No") : val ? "আছে" : "নেই";
  }
  if (!isEn) return val;
  if (val.includes("রেফারেল")) return "Referral";
  if (val.includes("নেই") || val.toLowerCase().includes("no")) return "No";
  if (val.includes("আছে") || val.toLowerCase().includes("yes")) return "Yes";
  return toEnglishDigits(val);
}

const ARTICLE_ENGLISH_INTROS: Record<string, string[]> = {
  "best-diagnostic-centers-in-feni": [
    "Accurate diagnosis is the foundational cornerstone of effective medical care. Misdiagnosis or delayed pathology reports can have serious health consequences. As healthcare infrastructure expands across Feni district, access to state-of-the-art diagnostic testing has grown significantly.",
    "Today, residents of Feni can access automated robotic biochemistry analyzers, multi-slice CT scanning, 4D color Doppler ultrasound, and high-frequency digital radiography locally without traveling to Dhaka or Chittagong.",
    "However, laboratories vary widely in equipment accuracy, consultant oversight, biosafety, and turnaround times. The Health Club clinical team has verified the top diagnostic centers in Feni to help patients make confident, cost-effective decisions.",
  ],
  "best-10-hospitals-in-feni": [
    "Feni district serves as a strategic healthcare hub in southeast Bangladesh, catering not only to its 1.4 million residents but also to patients from nearby Comilla, Noakhali, and Mirsharai.",
    "During medical emergencies, trauma cases, acute cardiac events, or planned surgeries, choosing the right hospital is vital. Lack of reliable hospital information often causes costly delays.",
    "Health Club's medical editorial board conducted on-site reviews of the top government and private hospitals in Feni to provide clear data on bed capacities, ICU facilities, specialist coverage, and member savings.",
  ],
  "best-doctors-in-feni": [
    "Finding an experienced, BMDC-registered specialist doctor in Feni can be challenging when managing acute illness or chronic conditions like diabetes, hypertension, and cardiac issues.",
    "Feni's central medical hubs along SSK Road, Trunk Road, and Hospital Road host visiting professors and consultants from premier institutions across Bangladesh.",
    "This curated directory outlines top specialists across medicine, cardiology, surgery, pediatrics, and gynecology, complete with chamber schedules, visiting fees, and verified direct serial booking hotlines.",
  ],
  "best-cardiologists-in-feni": [
    "Cardiovascular diseases, hypertension, and ischemic heart conditions require timely assessment and expert management. Early detection through ECG, Echocardiogram, and ETT tests prevents irreversible cardiac damage.",
    "Feni is home to distinguished clinical and interventional cardiologists who provide comprehensive consultations, cardiac rehabilitation advice, and specialized CCU care.",
    "This guide covers Feni's premier heart specialists, their diagnostic chamber timings, consultation fees, and emergency helpline protocols.",
  ],
  "best-gynecologists-in-feni": [
    "Maternal health, safe prenatal monitoring, and specialized gynecological care are critical for every family. From routine antenatal checkups to high-risk pregnancies, choosing a certified specialist ensures safety.",
    "Leading female gynecologists and laparoscopic surgeons in Feni offer advanced obstetrics, painless normal delivery support, and fertility care.",
    "Explore our verified guide to top gynecologists in Feni, with chamber schedules, hospital affiliations, and exclusive delivery package discounts for Health Club members.",
  ],
  "best-physiotherapy-in-feni": [
    "Rehabilitation therapy is essential for stroke recovery, chronic PLID back pain, sports injuries, and musculoskeletal conditions. Proper therapeutic exercise prevents long-term physical disability.",
    "Modern physiotherapy centers in Feni are equipped with computerized lumbar/cervical traction, Shortwave Diathermy (SWD), therapeutic ultrasound, and specialized paralysis rehabilitation units.",
    "Compare Feni's top 10 physiotherapy clinics, their licensed therapists (BPT/MPT), home session availability, and guaranteed 10-30% member savings.",
  ],
  "best-dental-clinics-in-feni": [
    "Oral health directly impacts overall physical well-being. Avoiding substandard dental practices is crucial to prevent blood-borne infections and nerve complications during treatments.",
    "Reputed dental surgeries in Feni employ modern digital RVG X-rays, Class-B autoclave sterilization, laser dentistry, and advanced root canal therapy.",
    "This guide reviews the top 10 dental clinics and BMDC-certified dental surgeons in Feni, including visiting hours, treatment price ranges, and Health Club card savings.",
  ],
};

export function getArticleEnglishIntro(slug: string, fallbackBn: string[], isEn: boolean): string[] {
  if (!isEn) return fallbackBn;
  return ARTICLE_ENGLISH_INTROS[slug] || fallbackBn;
}

const ARTICLE_ENGLISH_HIGHLIGHTS: Record<string, string[]> = {
  "best-diagnostic-centers-in-feni": [
    "Verified laboratory equipment, test menus, and direct serial numbers for top 10 labs in Feni.",
    "Comparison matrix of CT Scan, 4D Ultrasound, Digital X-Ray, and Automated Biochemistry.",
    "Standard market price guide for routine diagnostic tests with Health Club member savings.",
    "Guaranteed 10-30% member discounts at official partner diagnostic centers.",
  ],
  "best-10-hospitals-in-feni": [
    "250-bed Feni General Hospital tertiary facility and 24/7 trauma emergency care.",
    "Up to 25% member savings at Health Club partner hospitals including Al-Aqsa Hospital.",
    "Top private hospitals equipped with operational ICU, CCU, and NICU units.",
    "Direct emergency ambulance, blood donor, and admission desk telephone contacts.",
  ],
  "best-doctors-in-feni": [
    "Directory of BMDC-registered specialist doctors across 6 key clinical departments.",
    "Chamber addresses, visiting schedules, and consultation fees across Feni medical hubs.",
    "Direct phone contacts for immediate serial booking and minimal clinic waiting times.",
    "Special discounts on hospital diagnostic investigations for Health Club cardholders.",
  ],
  "best-cardiologists-in-feni": [
    "Top clinical and interventional cardiologists practicing across Feni.",
    "Comprehensive Echocardiogram, ETT, and cardiac biomarker test pricing guide.",
    "24/7 CCU availability and emergency acute coronary care facilities.",
    "Special member privileges on heart health checkup packages.",
  ],
  "best-gynecologists-in-feni": [
    "Feni's top female gynecologists, obstetricians, and laparoscopic surgeons.",
    "Normal delivery and C-Section package comparison at leading maternity hospitals.",
    "High-risk pregnancy care, NICU incubators, and fertility management.",
    "Guaranteed 10-30% member discounts on delivery and prenatal ultrasound services.",
  ],
  "best-physiotherapy-in-feni": [
    "Top 10 rehabilitation centers led by certified physiotherapists (BPT/MPT).",
    "Modern therapeutic traction, SWD, laser, and stroke paralysis recovery units.",
    "Home visit physiotherapy session pricing and scheduling guidance.",
    "Exclusive 10-30% discount per therapy session for Health Club digital card members.",
  ],
  "best-dental-clinics-in-feni": [
    "Top 10 dental clinics with BMDC-licensed Dental Surgeons (BDS/FCPS).",
    "Digital RVG X-ray, Class-B autoclave sterilization, and rotary root canal facilities.",
    "Market price guide for scaling, fillings, root canals, crowns, and implants.",
    "Exclusive 10-30% savings on all dental treatments for Health Club members.",
  ],
};

export function getArticleEnglishHighlights(
  slug: string,
  keyHighlightsBn: string[] | undefined,
  isEn: boolean
): string[] {
  if (!isEn) return keyHighlightsBn || [];
  return ARTICLE_ENGLISH_HIGHLIGHTS[slug] || keyHighlightsBn || [];
}

const ARTICLE_SELECTION_GUIDES: Record<string, { title: string; points: { title: string; desc: string }[] }> = {
  "best-diagnostic-centers-in-feni": {
    title: "5 Essential Criteria for Choosing a Reliable Diagnostic Lab",
    points: [
      {
        title: "1. Automated Analyzers & Quality Reagents",
        desc: "Ensure the lab uses fully automated analyzers (e.g. Roche, Abbott, Beckman) with standardized international reagents for accurate blood analysis.",
      },
      {
        title: "2. Resident Pathologists & Radiologists",
        desc: "Reports should be reviewed and signed by certified consultant pathologists or radiologists rather than junior technicians alone.",
      },
      {
        title: "3. Digital Radiology & High-Frequency 4D USG",
        desc: "Choose centers with modern digital radiography and multi-frequency color Doppler transducers to detect subtle tissue anomalies.",
      },
      {
        title: "4. Strict Biosafety & Disposable Consumables",
        desc: "Verify that phlebotomists follow sterile protocols with single-use vacuum blood tubes and disposable needles to prevent infection.",
      },
      {
        title: "5. Maximize Savings with Health Club Card",
        desc: "Diagnostic tests can be costly; use your Health Club membership card to receive guaranteed 10-30% savings at verified partner centers.",
      },
    ],
  },
  "best-10-hospitals-in-feni": {
    title: "4 Key Factors for Selecting the Right Hospital in Feni",
    points: [
      {
        title: "1. 24/7 ICU, CCU & Emergency Availability",
        desc: "Confirm the presence of functional intensive care beds, central oxygen, and round-the-clock emergency medical officers before admission.",
      },
      {
        title: "2. Cleanliness, Infection Control & Biosafety",
        desc: "Choose facilities with sterile operating theaters, adequate post-operative care, and strict sterilization protocols.",
      },
      {
        title: "3. Transparent Billing & Clear Cost Estimates",
        desc: "Ensure the hospital provides written admission and surgical package quotes to prevent unexpected ancillary charges.",
      },
      {
        title: "4. Health Club Partner Discounts",
        desc: "Take advantage of up to 25% member savings on cabin rent, pathology tests, and hospital charges at official partner hospitals.",
      },
    ],
  },
  "default": {
    title: "Guidelines for Choosing Quality Healthcare in Feni",
    points: [
      {
        title: "1. Certified Medical Professionals",
        desc: "Ensure practitioners hold recognized BMDC degrees and active credentials in their respective specialties.",
      },
      {
        title: "2. Modern Clinical Equipment",
        desc: "Verify the clinic uses updated medical technologies and hygienic sterilizing procedures.",
      },
      {
        title: "3. Convenient Booking & Punctuality",
        desc: "Prioritize chambers with verified serial hotlines to minimize waiting times and crowded conditions.",
      },
      {
        title: "4. Save with Health Club Membership",
        desc: "Show your digital Health Club card at partner centers to receive guaranteed member discounts on consultations and diagnostics.",
      },
    ],
  },
};

export function getArticleSelectionGuide(
  slug: string,
  rawBn: { titleBn: string; pointsBn: { title: string; desc: string }[] } | undefined,
  isEn: boolean
) {
  if (!rawBn) return null;
  if (!isEn) {
    return {
      title: rawBn.titleBn,
      points: rawBn.pointsBn,
    };
  }
  const match = ARTICLE_SELECTION_GUIDES[slug] || ARTICLE_SELECTION_GUIDES.default;
  return {
    title: match.title,
    points: match.points,
  };
}

export function getArticleEmergencyDirectory(
  rawBn: { titleBn: string; services: { name: string; phone: string; note: string }[] } | undefined,
  isEn: boolean
) {
  if (!rawBn) return null;
  if (!isEn) {
    return {
      title: rawBn.titleBn,
      services: rawBn.services,
    };
  }

  const enServices = rawBn.services.map((svc) => {
    let nameEn = svc.name;
    let noteEn = svc.note;
    if (svc.name.includes("অ্যাম্বুলেন্স")) nameEn = "24/7 Red Crescent Ambulance Service";
    else if (svc.name.includes("জেনারেল হাসপাতাল")) nameEn = "Feni 250 Bed General Hospital Emergency";
    else if (svc.name.includes("ফায়ার সার্ভিস")) nameEn = "Feni Fire Service & Civil Defense";
    else if (svc.name.includes("পুলিশ")) nameEn = "Feni District Police Control Room";

    if (svc.note.includes("২৪/৭")) noteEn = "24/7 On-Call Emergency Service";
    else if (svc.note.includes("তাৎক্ষণিক")) noteEn = "Immediate Response Dispatch";

    return {
      name: nameEn,
      phone: svc.phone,
      note: noteEn,
    };
  });

  return {
    title: "24/7 Emergency Medical Hotlines in Feni",
    services: enServices,
  };
}

export function getArticleBookingGuide(
  rawBn: { titleBn: string; stepsBn: { step: string; title: string; desc: string }[] } | undefined,
  isEn: boolean
) {
  if (!rawBn) return null;
  if (!isEn) {
    return {
      title: rawBn.titleBn,
      steps: rawBn.stepsBn,
    };
  }

  const enSteps = rawBn.stepsBn.map((step, idx) => {
    let titleEn = step.title;
    let descEn = step.desc;

    if (idx === 0) {
      titleEn = "Call Early in the Morning";
      descEn = "Most specialist chambers in Feni begin accepting serial calls between 8:00 AM and 10:00 AM. Call early to secure lower serial numbers.";
    } else if (idx === 1) {
      titleEn = "Note Serial Number and Expected Time";
      descEn = "Clearly confirm your serial number and expected entry time with the chamber assistant to avoid prolonged waiting.";
    } else if (idx === 2) {
      titleEn = "Bring Previous Medical Records";
      descEn = "Organize prior prescription files, recent blood test reports, and imaging scans chronologically for the physician's review.";
    } else if (idx === 3) {
      titleEn = "Present Health Club Card for Test Savings";
      descEn = "If diagnostic tests are advised, visit Health Club partner centers to save 10-30% with your digital membership card.";
    }

    return {
      step: `Step ${idx + 1}`,
      title: titleEn,
      desc: descEn,
    };
  });

  return {
    title: "Step-by-Step Specialist Appointment & Serial Booking Guide",
    steps: enSteps,
  };
}
