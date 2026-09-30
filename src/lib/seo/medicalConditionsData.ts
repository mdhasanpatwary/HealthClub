export interface MedicalTestEntity {
  id: string;
  nameBn: string;
  nameEn: string;
  testType: string;
  descriptionBn?: string;
}

export interface MedicalConditionEntity {
  id: string;
  nameBn: string;
  nameEn: string;
  alternateNames?: string[];
  icd10Code: string;
  departmentSlug: string;
  signsOrSymptomsBn: string[];
  possibleTreatmentsBn: string[];
  recommendedTests: MedicalTestEntity[];
}

/**
 * Knowledge Base of Core Clinical Conditions & Linked Diagnostic Tests in Feni
 */
export const MEDICAL_CONDITIONS_REGISTRY: Record<string, MedicalConditionEntity> = {
  "dengue-fever": {
    id: "dengue-fever",
    nameBn: "ডেঙ্গু জ্বর",
    nameEn: "Dengue Fever",
    alternateNames: ["Dengue Hemorrhagic Fever", "ব্রেকবোন ফিভার"],
    icd10Code: "A90",
    departmentSlug: "medicine",
    signsOrSymptomsBn: [
      "তীব্র জ্বর ও মাথাব্যথা",
      "চোখের পেছনের অংশে তীব্র ব্যথা",
      "হাড় ও মাংসপেশিতে তীব্র ব্যথা (Breakbone pain)",
      "ত্বকে লালচে র‍্যাশ বা ফুসকুড়ি",
      "রক্তে প্লাটিলেট দ্রুত হ্রাস পাওয়া",
    ],
    possibleTreatmentsBn: [
      "পর্যাপ্ত বিশ্রাম ও তরল/ওরাল রিহাইড্রেশন স্যালাইন গ্রহণ",
      "প্যারাসিটামল ও চিকিৎসকের নিয়মিত প্রেসক্রিপশন গাইডলাইন",
      "জরুরি প্রয়োজনে ফেনী সদর হাসপাতালে ভর্তি ও প্লাটিলেট মনিটরিং",
    ],
    recommendedTests: [
      { id: "cbc-platelet", nameBn: "সিবিসি ও প্লাটিলেট কাউন্ট", nameEn: "Complete Blood Count (CBC with Platelets)", testType: "BloodTest" },
      { id: "dengue-ns1", nameBn: "ডেঙ্গু এনএস১ এন্টিজেন", nameEn: "Dengue NS1 Antigen", testType: "DiagnosticTest" },
      { id: "dengue-antibody", nameBn: "ডেঙ্গু এন্টিবডি (IgG/IgM)", nameEn: "Dengue Antibody IgG/IgM", testType: "DiagnosticTest" },
    ],
  },
  "heart-attack": {
    id: "heart-attack",
    nameBn: "হার্ট অ্যাটাক ও হৃদরোগ",
    nameEn: "Acute Myocardial Infarction & Coronary Artery Disease",
    alternateNames: ["CAD", "কার্ডিয়াক এরেস্ট", "বুকে ব্যথা"],
    icd10Code: "I21",
    departmentSlug: "cardiology",
    signsOrSymptomsBn: [
      "বুকে তীব্র চাপ, ভারী ভাব বা অসহ্য ব্যথা",
      "ব্যথা বাম হাত, ঘাড় বা চোয়ালে ছড়িয়ে পড়া",
      "প্রচণ্ড ঘাম হওয়া ও শ্বাসকষ্ট",
      "বুক ধড়ফড় ও মাথা ঘোরানো",
    ],
    possibleTreatmentsBn: [
      "জরুরি সিসিইউ সাপোর্ট ও অক্সিজেন থেরাপি",
      "থ্রম্বোলাইটিক ও অ্যান্টিকোয়াগুল্যান্ট মেডিসিন",
      "কার্ডিওলজিস্টের সার্বক্ষণিক তত্ত্বাবধান ও জীবনযাত্রা পরিবর্তন",
    ],
    recommendedTests: [
      { id: "ecg-12lead", nameBn: "১২-লিড ইসিজি", nameEn: "12-Lead Electrocardiogram (ECG)", testType: "DiagnosticProcedure" },
      { id: "troponin-i", nameBn: "ট্রপোনিন আই টেস্ট", nameEn: "Troponin I Quantitative", testType: "BloodTest" },
      { id: "echocardiogram", nameBn: "কালার ডপলার ২ডি ইকো-কার্ডিওগ্রাফি", nameEn: "2D Color Doppler Echocardiogram", testType: "ImagingTest" },
      { id: "lipid-profile", nameBn: "লিপিড প্রোফাইল", nameEn: "Fast-Lipid Profile", testType: "BloodTest" },
    ],
  },
  "diabetes-mellitus": {
    id: "diabetes-mellitus",
    nameBn: "ডায়াবেটিস মেলাইটাস",
    nameEn: "Type 2 Diabetes Mellitus",
    alternateNames: ["রক্তে সুগার", "Diabetes", "হাইপারগ্লাইসেমিয়া"],
    icd10Code: "E11",
    departmentSlug: "diabetes",
    signsOrSymptomsBn: [
      "ঘন ঘন প্রস্রাব হওয়া ও অতিরিক্ত তৃষ্ণা লাগা",
      "কারণ ছাড়া ওজন হ্রাস ও শারীরিক দুর্বলতা",
      "শরীরের কাটা-ছেঁড়া বা ঘা দেরিতে শুকানো",
      "চোখে ঝাপসা দেখা",
    ],
    possibleTreatmentsBn: [
      "ডায়াবেটিস বিশেষজ্ঞের পরামর্শে ওরাল হাইপোগ্লাইসেমিক ঔষধ বা ইনসুলিন",
      "পরিমিত শর্করা ও সুষম খাদ্য ডায়েট চার্ট অনুসরণ",
      "প্রতিদিন ৩০-৪৫ মিনিট হাঁটা ও ওজন নিয়ন্ত্রণ",
    ],
    recommendedTests: [
      { id: "hba1c", nameBn: "হিমোগ্লোবিন এ১সি", nameEn: "Glycated Hemoglobin (HbA1c)", testType: "BloodTest" },
      { id: "fbs-2habf", nameBn: "ফাস্টিং ও খাবারের ২ ঘণ্টা পর সুগার", nameEn: "FBS and 2hABF Blood Glucose", testType: "BloodTest" },
      { id: "urine-microalbumin", nameBn: "ইউরিন মাইক্রোএলবুমিন", nameEn: "Urine for Microalbumin", testType: "PathologyTest" },
    ],
  },
  "stroke": {
    id: "stroke",
    nameBn: "ব্রেইন স্ট্রোক ও স্নায়ুরোগ",
    nameEn: "Cerebrovascular Accident (Stroke)",
    alternateNames: ["মস্তিষ্কে রক্তক্ষরণ", "প্যারালাইসিস", "Brain Stroke"],
    icd10Code: "I64",
    departmentSlug: "psychiatry",
    signsOrSymptomsBn: [
      "মুখের একপাশ বেঁকে যাওয়া (Facial drooping)",
      "একপাশের হাত বা পা অবশ হয়ে যাওয়া (Hemiplegia)",
      "কথা জড়িয়ে যাওয়া বা স্পষ্ট বলতে না পারা (Slurred speech)",
      "হঠাৎ তীব্র মাথাব্যথা ও শরীরের ভারসাম্য হারানো",
    ],
    possibleTreatmentsBn: [
      "গোল্ডেন আওয়ারে দ্রুততম সময়ে হাসপাতালে ভর্তি ও আইসিইউ ম্যানেজমেন্ট",
      "নিউরোমেডিসিন ও নিউরোসার্জন বিশেষজ্ঞের নিবিড় পর্যবেক্ষণ",
      "স্ট্রোক পরবর্তী দীর্ঘমেয়াদী ফিজিওথেরাপি ও স্পিচ থেরাপি",
    ],
    recommendedTests: [
      { id: "brain-ct-scan", nameBn: "ব্রেন সিটি স্ক্যান", nameEn: "CT Scan of Brain", testType: "ImagingTest" },
      { id: "brain-mri", nameBn: "ব্রেন ও সেরিব্রাল এমআরআই", nameEn: "MRI of Brain with MRA", testType: "ImagingTest" },
      { id: "carotid-doppler", nameBn: "ক্যারোটিড আর্টারি ডপলার", nameEn: "Carotid Duplex Doppler", testType: "ImagingTest" },
    ],
  },
  "chronic-kidney-disease": {
    id: "chronic-kidney-disease",
    nameBn: "ক্রনিক কিডনি ডিজিজ (সিকেডি) ও কিডনি ফেইলিউর",
    nameEn: "Chronic Kidney Disease (CKD)",
    alternateNames: ["কিডনি রোগ", "Renal Failure", "কিডনি ডায়ালাইসিস"],
    icd10Code: "N18",
    departmentSlug: "nephrology",
    signsOrSymptomsBn: [
      "হাত-পা ও চোখ-মুখ ফুলে যাওয়া (Edema)",
      "প্রস্রাবের পরিমাণ আশঙ্কাজনকভাবে কমে যাওয়া বা ফেনা হওয়া",
      "সারাক্ষণ দুর্বলতা, রক্তশূন্যতা ও বমি বমি ভাব",
      "উচ্চ রক্তচাপ অনিয়ন্ত্রিত থাকা ও শ্বাসকষ্ট",
    ],
    possibleTreatmentsBn: [
      "নেফ্রোলজি বিশেষজ্ঞের নিবিড় তত্ত্বাবধান ও প্রোটিন-লবণ নিয়ন্ত্রিত ডায়েট",
      "নিয়মিত হেমোডায়ালাইসিস সেশন (ফেনী সদর পার্টনার সেন্টারে)",
      "এরিথ্রোপোয়েটিন ইনজেকশন ও কিডনি ট্রান্সপ্লান্ট মূল্যায়ন",
    ],
    recommendedTests: [
      { id: "serum-creatinine-egfr", nameBn: "সিরাম ক্রিয়েটিনিন ও ইজিএফআর", nameEn: "Serum Creatinine with eGFR", testType: "BloodTest" },
      { id: "serum-electrolytes", nameBn: "সিরাম ইলেকট্রোলাইটস", nameEn: "Serum Electrolytes (Na+, K+, Cl-)", testType: "BloodTest" },
      { id: "usg-kub", nameBn: "আল্ট্রাসনোগ্রাম কেইউবি ও প্রোস্টেট", nameEn: "USG of KUB and Prostate", testType: "ImagingTest" },
    ],
  },
  "bone-fracture": {
    id: "bone-fracture",
    nameBn: "হাড়ভাঙা, ফ্র্যাকচার ও অর্থোপেডিক ট্রমা",
    nameEn: "Bone Fracture & Orthopedic Trauma",
    alternateNames: ["হাড় জোড়া", "রড স্ক্রু বসানো", "Orthopedic Surgery"],
    icd10Code: "S82",
    departmentSlug: "orthopedics",
    signsOrSymptomsBn: [
      "আঘাত বা দুর্ঘটনার পর তীব্র অসহ্য ব্যথা",
      "আক্রান্ত অঙ্গ বিকৃত বা বাঁকা হয়ে যাওয়া",
      "হাত বা পা নাড়াতে না পারা ও মারাত্মক ফোলা",
      "চামড়ার নিচে হাড়ের স্থানচ্যুতি ও রক্তক্ষরণ",
    ],
    possibleTreatmentsBn: [
      "অর্থোপেডিক ট্রমা সার্জারি ও টাইটানিয়াম রড/প্লেট ইমপ্লান্টেশন",
      "পিওপি প্লাস্টার কাস্ট ও ক্লোজড রিডাকশন",
      "সার্জারি পরবর্তী ফিজিওথেরাপি ও ক্যালসিয়াম থেরাপি",
    ],
    recommendedTests: [
      { id: "digital-xray", nameBn: "ডিজিটাল এক্স-রে (এপি/ল্যাটেরাল ভিউ)", nameEn: "Digital X-Ray (AP and Lateral Views)", testType: "ImagingTest" },
      { id: "ct-orthopedic", nameBn: "জয়েন্ট ও হাড়ের ৩ডি সিটি স্ক্যান", nameEn: "3D CT Scan of Bone and Joint", testType: "ImagingTest" },
      { id: "mri-spine-joint", nameBn: "স্পাইন ও জয়েন্ট এমআরআই", nameEn: "MRI of Spine and Joint", testType: "ImagingTest" },
    ],
  },
  "pregnancy-maternal-care": {
    id: "pregnancy-maternal-care",
    nameBn: "গর্ভকালীন যত্ন ও নরমাল/সিজারিয়ান প্রসব",
    nameEn: "Antenatal Care & Maternal Delivery",
    alternateNames: ["প্রেগন্যান্সি কেয়ার", "সিজারিয়ান অপারেশন", "নরমাল ডেলিভারি"],
    icd10Code: "Z34",
    departmentSlug: "gynecology",
    signsOrSymptomsBn: [
      "গর্ভকালীন তলপেটে ব্যথা ও ভারীবোধ",
      "প্রস্রাবে সংক্রমণ বা রক্তচাপ বৃদ্ধি (Preeclampsia ঝুঁকি)",
      "গর্ভস্থ বাচ্চার নড়াচড়া কমে যাওয়া বা অতিরিক্ত ক্লান্তি",
    ],
    possibleTreatmentsBn: [
      "নিয়মিত গাইনী বিশেষজ্ঞের এন্টিনেটাল চেকআপ (ANC)",
      "প্রাতিষ্ঠানিক নিরাপদ নরমাল ডেলিভারি বা আধুনিক সিজারিয়ান সেকশন",
      "মা ও নবজাতকের সমন্বিত পোস্টনেটাল কেয়ার ও নিউট্রিশন সাপোর্ট",
    ],
    recommendedTests: [
      { id: "usg-pregnancy-profile", nameBn: "আল্ট্রাসনোগ্রাম প্রেগন্যান্সি প্রোফাইল", nameEn: "USG of Pregnancy Profile", testType: "ImagingTest" },
      { id: "anomaly-scan-4d", nameBn: "৪ডি এনোমালি স্ক্যান", nameEn: "4D Color Anomaly Scan", testType: "ImagingTest" },
      { id: "blood-group-rh", nameBn: "ব্লাড গ্রুপিং ও আরএইচ ফ্যাক্টর", nameEn: "Blood Group & Rh Typing", testType: "BloodTest" },
      { id: "ogtt-gestational", nameBn: "ওজিটিটি ডায়াবেটিস স্ক্রিনিং", nameEn: "Oral Glucose Tolerance Test (OGTT)", testType: "BloodTest" },
    ],
  },
  "gallstones-cholelithiasis": {
    id: "gallstones-cholelithiasis",
    nameBn: "পিত্তথলির পাথর ও কোলেসিস্টেক্টমি",
    nameEn: "Cholelithiasis (Gallbladder Stones)",
    alternateNames: ["পিত্তে পাথর", "Gallstones", "ল্যাপারোস্কপিক সার্জারি"],
    icd10Code: "K80",
    departmentSlug: "surgery",
    signsOrSymptomsBn: [
      "পেটের উপরের ডানপাশে তীব্র মোচড়ানো ব্যথা যা পিঠ বা ডান কাঁধে ছড়ায়",
      "ভারী বা চর্বিযুক্ত খাবার খাওয়ার পর বমি বমি ভাব ও বুকজ্বালা",
      "হঠাৎ জ্বর আসা ও পেট ফেঁপে থাকা",
    ],
    possibleTreatmentsBn: [
      "ল্যাপারোস্কপিক কোলেসিস্টেক্টমি (পেট না কেটে ছোট ছিদ্রের আধুনিক সার্জারি)",
      "জেনারেল সার্জনের পরামর্শে পেইন ও ইনফেকশন ম্যানেজমেন্ট",
    ],
    recommendedTests: [
      { id: "usg-whole-abdomen", nameBn: "আল্ট্রাসনোগ্রাম হোল এবডোমেন", nameEn: "USG of Whole Abdomen", testType: "ImagingTest" },
      { id: "lft-liver-panel", nameBn: "লিভার ফাংশন টেস্ট (LFT)", nameEn: "Liver Function Test (SGPT, Alkaline Phos)", testType: "BloodTest" },
      { id: "cbc-wbc", nameBn: "সিবিসি (সংক্রমণ ও ডব্লিউবিসি পরিমাপ)", nameEn: "Complete Blood Count for Infection", testType: "BloodTest" },
    ],
  },
  "jaundice-liver-disease": {
    id: "jaundice-liver-disease",
    nameBn: "জন্ডিস, ফ্যাটি লিভার ও হেপাটাইটিস",
    nameEn: "Jaundice & Fatty Liver Disease",
    alternateNames: ["লিভার রোগ", "Hepatitis B", "Hepatitis C", "হেপাটোলজি"],
    icd10Code: "K76",
    departmentSlug: "hepatology",
    signsOrSymptomsBn: [
      "চোখ ও প্রস্রাবের রঙ গাঢ় হলুদ হওয়া",
      "পেটের ডানপাশে ভারীবোধ ও অস্বস্তি",
      "ক্ষুধামন্দা, দুর্বলতা ও দ্রুত ওজন হ্রাস",
    ],
    possibleTreatmentsBn: [
      "হেপাটোলজিস্টের তত্ত্বাবধানে পুষ্টিকর ও লো-ফ্যাট ডায়েট অনুসরণ",
      "ভাইরাল হেপাটাইটিসের সুনির্দিষ্ট এন্টিভাইরাল ঔষধ গ্রহণ",
      "অ্যালকোহল ও অপ্রয়োজনীয় ওষুধ বর্জন",
    ],
    recommendedTests: [
      { id: "serum-bilirubin-sgpt", nameBn: "সিরাম বিলিরুবিন ও এসজিপিটি", nameEn: "Serum Bilirubin and SGPT (ALT)", testType: "BloodTest" },
      { id: "hbsag-antihcv", nameBn: "হেপাটাইটিস বি ও সি স্ক্রিনিং (HBsAg & Anti-HCV)", nameEn: "HBsAg & Anti-HCV Screening", testType: "BloodTest" },
      { id: "usg-hbs", nameBn: "আল্ট্রাসনোগ্রাম হেপাটোবিলিয়ারি সিস্টেম", nameEn: "USG of Hepatobiliary System (HBS)", testType: "ImagingTest" },
    ],
  },
  "pediatric-pneumonia": {
    id: "pediatric-pneumonia",
    nameBn: "শিশুর নিউমোনিয়া ও শ্বাসকষ্ট",
    nameEn: "Pediatric Pneumonia & Acute Respiratory Distress",
    alternateNames: ["শিশুর বুকে কফ", "বাচ্চার শ্বাসকষ্ট", "Pneumonia in Children"],
    icd10Code: "J18",
    departmentSlug: "pediatrics",
    signsOrSymptomsBn: [
      "শিশুর দ্রুত শ্বাস নেওয়া ও বুকের খাঁচা দেবে যাওয়া (Chest indrawing)",
      "তীব্র জ্বর ও শ্বাস নেওয়ার সময় বাঁশির মতো সাঁই-সাঁই শব্দ",
      "খাবার বা মায়ের দুধ টেনে খেতে না পারা ও নিস্তেজ হওয়া",
    ],
    possibleTreatmentsBn: [
      "শিশু বিশেষজ্ঞের জরুরি পরামর্শ ও হাসপাতালে ভর্তি",
      "নেবুলাইজেশন ও আর্দ্র অক্সিজেন থেরাপি",
      "সুনির্দিষ্ট অ্যান্টিবায়োটিক ও সাপোর্টিভ ফ্লুইড ম্যানেজমেন্ট",
    ],
    recommendedTests: [
      { id: "chest-xray-pa", nameBn: "ডিজিটাল চেস্ট এক্স-রে (পি/এ ভিউ)", nameEn: "Digital Chest X-Ray (P/A View)", testType: "ImagingTest" },
      { id: "pediatric-cbc-crp", nameBn: "সিবিসি ও সিআরপি (ইনফেকশন পরিমাপ)", nameEn: "Pediatric CBC with CRP", testType: "BloodTest" },
      { id: "spo2-pulse-oximetry", nameBn: "পালস অক্সিমেট্রি অক্সিজেন স্যাচুরেশন", nameEn: "Pulse Oximetry SpO2 Monitoring", testType: "MedicalTest" },
    ],
  },
  "dental-caries-rct": {
    id: "dental-caries-rct",
    nameBn: "দাঁতের ক্ষয়, ক্যাভিটি ও রুট ক্যানেল",
    nameEn: "Dental Caries & Root Canal Therapy",
    alternateNames: ["দাঁতে ব্যথা", "রুট ক্যানেল খরচ", "দাঁতে ক্যাপ"],
    icd10Code: "K02",
    departmentSlug: "dental",
    signsOrSymptomsBn: [
      "মিষ্টি বা ঠান্ডা-গরম খাবার খেলে দাঁতে তীব্র শিরশিরানি ও ব্যথা",
      "দাঁতে কালো গর্ত বা ক্যাভিটি সৃষ্টি হওয়া",
      "মাড়ি ফুলে যাওয়া ও কামড় দিলে দাঁতে যন্ত্রণা",
    ],
    possibleTreatmentsBn: [
      "আধুনিক এন্ডোডন্টিক রুট ক্যানেল চিকিৎসা (RCT)",
      "লাইট-কিউর ফিলিং বা জোরকনিয়া/পোরসেলিন ডেন্টাল ক্রাউন (ক্যাপ)",
      "ডেন্টাল স্কেলিং ও নিয়মিত ওরাল হাইজিন কাউন্সেলিং",
    ],
    recommendedTests: [
      { id: "rvg-iopa-xray", nameBn: "ডিজিটাল আরভিজি আইওপিএ এক্স-রে", nameEn: "Digital RVG IOPA Dental X-Ray", testType: "ImagingTest" },
      { id: "opg-dental-scan", nameBn: "ওপিজি প্যানোরামিক ডেন্টাল স্ক্যান", nameEn: "Orthopantomogram (OPG) Full Mouth Scan", testType: "ImagingTest" },
    ],
  },
};
