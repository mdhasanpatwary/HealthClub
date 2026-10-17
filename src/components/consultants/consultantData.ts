import {
  Stethoscope, HeartPulse, Brain, Bone, Baby,
  Sparkles, ShieldCheck, UserRound, Apple, Eye, Info, Smile, Activity
} from "lucide-react";

export const DEPT_ICONS: Record<string, typeof Stethoscope> = {
  medicine: Stethoscope,
  cardiology: HeartPulse,
  gynecology: UserRound,
  orthopedics: Bone,
  psychiatry: Brain,
  nephrology: ShieldCheck,
  hepatology: ShieldCheck,
  surgery: Sparkles,
  pediatrics: Baby,
  rheumatology: Bone,
  nutrition: Apple,
  dermatology: Sparkles,
  ent: Info,
  eye: Eye,
  dental: Smile,
  diabetes: Activity,
  other: Sparkles,
};

export const CLINICAL_FOCUS_MAP: Record<string, { bn: string; en: string }> = {
  medicine: {
    bn: "জ্বর, গ্যাস্ট্রিক, লিভার, ডায়াবেটিস, উচ্চ রক্তচাপ, হাঁপানি ও সাধারণ স্বাস্থ্য সমস্যার পূর্ণাঙ্গ চিকিৎসা।",
    en: "Fever, gastrointestinal disorders, liver diseases, diabetes, hypertension, asthma & general health.",
  },
  cardiology: {
    bn: "বুকে ব্যথা, উচ্চ রক্তচাপ, বুক ধড়ফড়, শ্বাসকষ্ট, হৃদরোগ নির্ণয়, ইসিজি ও ইকো-কার্ডিওগ্রাফি পরামর্শ।",
    en: "Chest pain, hypertension, palpitations, shortness of breath, cardiovascular diseases, ECG & Echo.",
  },
  gynecology: {
    bn: "গর্ভকালীন যত্ন (ANC), বন্ধ্যাত্ব চিকিৎসা, সিজারিয়ান ও নরমাল ডেলিভারি, জরায়ুর জটিলতা ও মহিলাদের স্বাস্থ্যসেবা।",
    en: "Antenatal care (ANC), infertility evaluation, normal/caesarean delivery, and women's health.",
  },
  orthopedics: {
    bn: "হাড় ভাঙা ও জোড়া লাগানো, বাত-ব্যথা, স্পাইন ও মেরুদণ্ডের সমস্যা, জয়েন্ট রিপ্লেসমেন্ট ও ট্রমা সার্জারি।",
    en: "Fractures, arthritis, spine disorders, joint replacements, trauma surgery & chronic musculoskeletal pain.",
  },
  pediatrics: {
    bn: "নবজাতক ও শিশুর জ্বর, সর্দি-কাশি, নিউমোনিয়া, অপুষ্টি, টিকা পরামর্শ ও শারীরিক বৃদ্ধির চিকিৎসা।",
    en: "Neonatal & pediatric care, pneumonia, nutrition assessment, vaccinations & child development.",
  },
  psychiatry: {
    bn: "মানসিক অবসাদ, অনিদ্রা, উদ্বেগ, ফোবিয়া, মাদকাসক্তি থেকে মুক্তি ও স্নায়ুরোগ সংক্রান্ত কাউন্সেলিং।",
    en: "Depression, insomnia, anxiety disorders, phobias, addiction recovery & neuropsychiatric counseling.",
  },
  nephrology: {
    bn: "কিডনি রোগ, প্রস্রাবের ইনফেকশন, প্রোটিন নির্গমন, ক্রনিক কিডনি ডিজিজ (CKD) ও ডায়ালাইসিস পরামর্শ।",
    en: "Renal disease, urinary tract infections, proteinuria, chronic kidney disease (CKD) & dialysis guidance.",
  },
  hepatology: {
    bn: "জন্ডিস, ফ্যাটি লিভার, লিভার সিরোসিস, হেপাটাইটিস বি ও সি ভাইরাস এবং লিভারের জটিল রোগ।",
    en: "Jaundice, fatty liver disease, cirrhosis, Hepatitis B/C infections & advanced liver health.",
  },
  surgery: {
    bn: "ল্যাপারোস্কপিক ও জেনারেল সার্জারি, অ্যাপেন্ডিক্স, হার্নিয়া, পিত্তথলির পাথর, টিউমার ও ভাস্কুলার অপারেশন।",
    en: "Laparoscopic and general surgery, appendix, hernia repair, gallstones, tumors & vascular surgery.",
  },
  dermatology: {
    bn: "ব্রণ, এলার্জি, চর্মরোগ, সোরিয়াসিস, চুল পড়া, একজিমা, দাদ ও লেজার স্কিন কেয়ার চিকিৎসা।",
    en: "Acne, allergies, eczema, psoriasis, hair loss, fungal infections & modern dermatological care.",
  },
  ent: {
    bn: "নাক, কান, গলা ও থাইরয়েড রোগ, সাইনোসাইটিস, কানের পর্দা ফুটো, টনসিল অপারেশন ও স্লিপ সার্জারি।",
    en: "Ear, nose, throat and thyroid conditions, sinusitis, tonsillitis, ear discharge & sleep apnea surgery.",
  },
  eye: {
    bn: "চোখের ছানি অপারেশন, দৃষ্টিশক্তি পরীক্ষা, গ্লুকোমা, চোখের লালভাব ও আধুনিক ফ্যাকো সার্জারি।",
    en: "Cataract phaco surgery, visual acuity checks, glaucoma screening & ocular medical treatment.",
  },
  dental: {
    bn: "রুট ক্যানেল, স্কেলিং, দাঁতের ফিলিং, ক্যাপ বসানো, মাড়ির রোগ ও আধুনিক অর্থোডন্টিক সেবা।",
    en: "Root canal therapy, scaling, tooth fillings, crowns, gum care & modern orthodontic dentistry.",
  },
  diabetes: {
    bn: "টাইপ ১ ও টাইপ ২ ডায়াবেটিস, রক্তে সুগার নিয়ন্ত্রণ, থাইরয়েড ও হরমোনজনিত জটিলতার বিশেষায়িত চিকিৎসা।",
    en: "Type 1 & 2 diabetes management, blood sugar control, thyroid disorders & hormone care.",
  },
  nutrition: {
    bn: "ওজন নিয়ন্ত্রণ, ডায়াবেটিস ডায়েট চার্ট, কিডনি ও ফ্যাটি লিভার রোগীর পুষ্টি পরামর্শ ও সুষম খাদ্য তালিকা।",
    en: "Weight management, medical nutrition therapy for diabetes/kidney diseases & customized diet plans.",
  },
  rheumatology: {
    bn: "রিউমাটয়েড আর্থ্রাইটিস, গাউট, এঙ্কাইলোজিং স্পন্ডিলাইটিস ও দীর্ঘমেয়াদী জয়েন্ট ব্যথার আধুনিক চিকিৎসা।",
    en: "Rheumatoid arthritis, gout, ankylosing spondylitis, lupus & chronic joint and muscle care.",
  },
  other: {
    bn: "বিশেষায়িত চিকিৎসা সেবা, রোগ নির্ণয় এবং প্রয়োজনীয় স্বাস্থ্য ও রেফারেল পরামর্শ।",
    en: "Specialized clinical consultations, diagnostics, and patient referral services.",
  },
};

export const DEPT_LABEL_MAP: Record<string, string> = {
  all: "সকল বিভাগ",
  medicine: "মেডিসিন",
  cardiology: "কার্ডিওলজি (হৃদরোগ)",
  gynecology: "গাইনী ও প্রসূতিরোগ",
  pediatrics: "শিশু ও নবজাতক",
  orthopedics: "অর্থোপেডিকস (হাড়-জোড়া)",
  dermatology: "চর্ম ও যৌনরোগ",
  eye: "চক্ষুরোগ",
  ent: "নাক, কান ও গলা",
  diabetes: "ডায়াবেটিস ও হরমোন",
  psychiatry: "মানসিক রোগ",
  nephrology: "কিডনি রোগ",
  hepatology: "লিভার রোগ",
  surgery: "জেনারেল ও ল্যাপারোস্কপিক সার্জারি",
  rheumatology: "বাত ও রিউমাটোলজি",
  nutrition: "পুষ্টি ও ডায়েট",
  dental: "দন্তরোগ ও ডেন্টাল সার্জারি",
  other: "অন্যান্য বিশেষজ্ঞ",
};

export const DEPARTMENTS = [
  { id: "all", labelKey: "consultants.filter.all", labelBn: "সকল বিভাগ", icon: Stethoscope },
  { id: "medicine", labelKey: "consultants.filter.medicine", labelBn: "মেডিসিন", icon: Stethoscope },
  { id: "cardiology", labelKey: "consultants.filter.cardiology", labelBn: "কার্ডিওলজি (হৃদরোগ)", icon: HeartPulse },
  { id: "gynecology", labelKey: "consultants.filter.gynecology", labelBn: "গাইনী ও প্রসূতিরোগ", icon: UserRound },
  { id: "pediatrics", labelKey: "consultants.filter.pediatrics", labelBn: "শিশু ও নবজাতক", icon: Baby },
  { id: "orthopedics", labelKey: "consultants.filter.orthopedics", labelBn: "অর্থোপেডিকস (হাড়-জোড়া)", icon: Bone },
  { id: "dermatology", labelKey: "consultants.filter.dermatology", labelBn: "চর্ম ও যৌনরোগ", icon: Sparkles },
  { id: "eye", labelKey: "consultants.filter.eye", labelBn: "চক্ষুরোগ", icon: Eye },
  { id: "ent", labelKey: "consultants.filter.ent", labelBn: "নাক, কান ও গলা", icon: Info },
  { id: "diabetes", labelKey: "consultants.filter.diabetes", labelBn: "ডায়াবেটিস ও হরমোন", icon: Activity },
  { id: "psychiatry", labelKey: "consultants.filter.psychiatry", labelBn: "মানসিক রোগ", icon: Brain },
  { id: "nephrology", labelKey: "consultants.filter.nephrology", labelBn: "কিডনি রোগ", icon: ShieldCheck },
  { id: "hepatology", labelKey: "consultants.filter.hepatology", labelBn: "লিভার রোগ", icon: ShieldCheck },
  { id: "surgery", labelKey: "consultants.filter.surgery", labelBn: "জেনারেল ও ল্যাপারোস্কপিক সার্জারি", icon: Sparkles },
  { id: "rheumatology", labelKey: "consultants.filter.rheumatology", labelBn: "বাত ও রিউমাটোলজি", icon: Bone },
  { id: "nutrition", labelKey: "consultants.filter.nutrition", labelBn: "পুষ্টি ও ডায়েট", icon: Apple },
  { id: "dental", labelKey: "consultants.filter.dental", labelBn: "দন্তরোগ ও ডেন্টাল সার্জারি", icon: Smile },
  { id: "other", labelKey: "consultants.filter.other", labelBn: "অন্যান্য বিশেষজ্ঞ", icon: Sparkles },
];

export interface PopularSymptomChip {
  id: string;
  labelBn: string;
  searchTerm: string;
}

/**
 * Curated list of high-frequency symptoms and diseases searched by patients in Feni.
 * Clicking a chip immediately performs a smart filter in DoctorDirectory.
 */
export const POPULAR_SYMPTOM_CHIPS: PopularSymptomChip[] = [
  { id: "fever", labelBn: "জ্বর ও সর্দি-কাশি", searchTerm: "জ্বর" },
  { id: "jaundice", labelBn: "জন্ডিস ও লিভার", searchTerm: "জন্ডিস" },
  { id: "typhoid", labelBn: "টাইফয়েড", searchTerm: "টাইফয়েড" },
  { id: "chest-pain", labelBn: "বুকে ব্যথা ও হার্ট", searchTerm: "বুকে ব্যথা" },
  { id: "pregnancy", labelBn: "গর্ভকালীন ও গাইনী", searchTerm: "গর্ভকালীন" },
  { id: "back-joint-pain", labelBn: "কোমর ও বাতের ব্যথা", searchTerm: "বাতের ব্যথা" },
  { id: "asthma", labelBn: "হাঁপানি ও শ্বাসকষ্ট", searchTerm: "হাঁপানি" },
  { id: "headache", labelBn: "মাথাব্যথা ও মাইগ্রেন", searchTerm: "মাথাব্যথা" },
  { id: "gastric", labelBn: "পেট ব্যথা ও গ্যাস্ট্রিক", searchTerm: "গ্যাস্ট্রিক" },
  { id: "skin", labelBn: "চর্মরোগ ও এলার্জি", searchTerm: "এলার্জি" },
  { id: "pediatric", labelBn: "শিশুর রোগ", searchTerm: "শিশুর" },
  { id: "diabetes", labelBn: "ডায়াবেটিস ও থাইরয়েড", searchTerm: "ডায়াবেটিস" },
  { id: "kidney", labelBn: "কিডনি ও প্রস্রাব সমস্যা", searchTerm: "কিডনি" },
  { id: "ent", labelBn: "নাক, কান ও গলা", searchTerm: "টনসিল" },
  { id: "dental", labelBn: "দাঁতের সমস্যা", searchTerm: "দাঁত" },
];

/**
 * Comprehensive disease and symptom indexing keywords for healthcare discovery.
 * Maps department specialties to Bengali and English clinical conditions, colloquial phrases, and spelling variants.
 */
export const DEPARTMENT_DISEASE_KEYWORDS_MAP: Record<string, string> = {
  medicine:
    "জ্বর fever infection সংক্রমণ টাইফয়েড টাইফয়েড typhoid ম্যালেরিয়া ડેঙ্গু dengue জন্ডিস jaundice লিভার গ্যাস্ট্রিক gastric পেট ব্যথা পেটের আলসার বদহজম ডায়রিয়া ডায়রিয়া বমি বমি ভাব বমি বমি কাশি cough কফ বুকে কফ সর্দি ঠান্ডা ফ্লু ফ্লু-লাইক দুর্বলতা রক্তশূন্যতা anemia হাইপারটেনশন উচ্চ রক্তচাপ ব্লাড প্রেশার প্রেসার শ্বাসকষ্ট breathing asthma হাঁপানি এলার্জি এলার্জিজনিত মাথাব্যথা মাইগ্রেন headache migraine ক্লান্তি মাথা ঘোরা মাথা ঘুরানো প্রস্রাবে ইনফেকশন",
  cardiology:
    "হার্ট heart বুক ব্যথা বুকে ব্যথা chest pain বুক ধড়ফড় বুক ধরফর palpitation বুক ভারী হওয়া হার্ট ব্লকেজ heart attack হার্ট অ্যাটাক এনজাইনা angina শ্বাসকষ্ট shortness of breath হৃদরোগ cardiovascular উচ্চ রক্তচাপ হাইপারটেনশন hypertension রক্তচাপ প্রেসার বাতজ্বর rheumatic fever পা ফোলা হার্ট ফেইলিউর heart failure ইসিজি ecg ইকো echo এনজিওগ্রাম angiogram স্টেন্টিং কোলেস্টেরল রিং পরানো",
  gynecology:
    "গর্ভকালীন গর্ভাবস্থা প্রেগন্যান্সি pregnancy গর্ভবতী anc antenatal নরমাল ডেলিভারি সিজার cesarean c-section বন্ধ্যাত্ব infertility সন্তান না হওয়া বাচ্চা না হওয়া অনিয়মিত মাসিক irregular periods পিরিয়ড সাদাস্রাব leucorrhea অতিরিক্ত রক্তস্রাব জরায়ু uterus জরায়ুর টিউমার fibroid ওভারিয়ান সিস্ট ovarian cyst পিসিওএস pcos তলপেটে ব্যথা pelvic pain বন্ধ্যাত্ব চিকিৎসা স্তনে ব্যথা breast pain ল্যাকটেশন মেনোপজ",
  pediatrics:
    "শিশু বাচ্চা নবজাতক infant newborn child baby pediatric শিশুর জ্বর বাচ্চার জ্বর নিউমোনিয়া pneumonia শ্বাসকষ্ট শিশুর কাশি সর্দি ঠান্ডা বাচ্চার ডায়রিয়া ডায়রিয়া পাতলা পায়খানা বমি অপুষ্টি malnutrition কৃমি কম ওজন বৃদ্ধি না পাওয়া টিকা vaccination খিঁচুনি শিশুর এলার্জি পেট ফাঁপা নবজাতকের জন্ডিস নবজাতকের যত্ন",
  orthopedics:
    "হাড় bone হাড় ভাঙা fracture ফ্র্যাকচার জোড়া জয়েন্ট joint বাত gout arthritis আর্থ্রাইটিস বাত ব্যথা বাতের ব্যথা কোমর ব্যথা back pain পিঠ ব্যথা স্পাইন spine মেরুদণ্ড মেরুদণ্ডের সমস্যা ঘাড় ব্যথা neck pain হাঁটু ব্যথা knee pain গোড়ালি ব্যথা লিগামেন্ট ইনজুরি ligament injury স্পোর্টস ইনজুরি প্লাস্টার অপারেশন হাড়ের ক্ষয় osteoporosis ডিস্ক প্রোল্যাপ্স plid ট্রমা হাড়ের জোড়া স্থানচ্যুতি",
  rheumatology:
    "বাত arthritis রিউমাটয়েড রিউমাটোলজি rheumatology রিউমাটয়েড আর্থ্রাইটিস rheumatoid arthritis গাউট gout ইউরিক এসিড uric acid গিঁটে ব্যথা সন্ধিব্যথা বাতের ব্যথা বাত-ব্যথা জয়েন্টে ফোলা স্টিফনেস সকালে হাত শক্ত হয়ে যাওয়া এঙ্কাইলোজিং স্পন্ডিলাইটিস ankylosing spondylitis লুপাস lupus এসএলই sle অটোইমিউন autoimmune ক্রনিক ব্যথা মায়োসাইটিস ফাইব্রোমায়ালজিয়া",
  psychiatry:
    "মানসিক মন মনোরোগ psychiatry মানসিক সমস্যা ডিপ্রেশন depression বিষণ্ণতা মন খারাপ অবসাদ anxiety উদ্বেগ দুশ্চিন্তা প্যানিক অ্যাটাক panic attack অনিদ্রা insomnia ঘুমের সমস্যা ফোবিয়া phobia ভয় মাদকাসক্তি addiction মাদক কাউন্সেলিং counseling হিস্টিরিয়া সিজোফ্রেনিয়া schizophrenia বাইপোলার bipolar ওসিডি ocd স্মৃতিশক্তি হ্রাস ডিমেনশিয়া রাগ নিয়ন্ত্রণ মাথাব্যথা মাথা ভার",
  nephrology:
    "কিডনি kidney কিডনি রোগ renal nephrology প্রস্রাবে জ্বালাপোড়া burning urination প্রস্রাবের ইনফেকশন uti ইউটিআই প্রস্রাবে রক্ত রক্ত যাওয়া প্রস্রাবে প্রোটিন নির্গমন হাত-পা ফোলা মুখ ফোলা কিডনিতে পাথর kidney stone ক্রনিক কিডনি ডিজিজ ckd ডায়ালাইসিস dialysis ক্রিয়েটিনিন creatinine উচ্চ রক্তচাপ প্রস্রাব বন্ধ হওয়া কম প্রস্রাব ইউরোলজি urology প্রোস্টেট prostate",
  hepatology:
    "লিভার liver লিভার রোগ hepatology জন্ডিস jaundice জন্ডিস রোগ ফ্যাটি লিভার fatty liver লিভার সিরোসিস cirrhosis হেপাটাইটিস hepatitis হেপাটাইটিস বি হেপাটাইটিস সি hepatitis b hepatitis c লিভার এনজাইম লিভার ক্যান্সার লিভারের চর্বি পেটে পানি জমা ascites লিভার বৃদ্ধি গ্যাস্ট্রো gastro পরিপাকতন্ত্র পিত্তনালী পিত্তথলি পিত্তথলির পাথর হজমের সমস্যা",
  surgery:
    "সার্জারি surgery অপারেশন operation সার্জন surgeon জেনারেল সার্জারি অ্যাপেন্ডিক্স appendix অ্যাপেন্ডিসাইটিস appendicitis হার্নিয়া hernia পিত্তথলির পাথর gallstone পিত্তথলি gall bladder টিউমার tumor লাইপোমা lipoma সিস্ট cyst পাইলস piles অর্শ ফিশার fissure ভগন্দর ফিস্টুলা fistula পায়ুপথে রক্ত মলদ্বারে ব্যথা ল্যাপারোস্কপিক laparoscopic ফোড়া abscess কাটাছেঁড়া ট্রমা ভাস্কুলার vascular খাদ্যনালীর অপারেশন",
  dermatology:
    "চর্ম ত্বক skin চর্মরোগ dermatology যৌন যৌনরোগ venereology চুলকানি itching এলার্জি allergy এলার্জিজনিত র‍্যাশ rash ব্রণ acne মেছতা melasma দাদ ringworm fungal ফাঙ্গাল ইনফেকশন একজিমা eczema সোরিয়াসিস psoriasis চুল পড়া hair loss টাক খুশকি শ্বেতী vitiligo ত্বকের ঘা নখের ইনফেকশন কুষ্ঠ এলার্জিক চর্মরোগ লেজার স্কিন কেয়ার মুখের দাগ",
  ent:
    "নাক nose কান ear গলা throat ইএনটি ent নাক বন্ধ nasal blockage সাইনাস sinus সাইনোসাইটিস sinusitis সর্দি এলার্জিক রাইনাইটিস টনসিল tonsil টনসিলাইটিস টনসিলের ব্যথা গলায় ঘা গলায় কিছু আটকে থাকা কান পাকা ear discharge কানে পুঁজ কানে ব্যথা কানে কম শোনা hearing loss কানের পর্দা ফুটো নাক দিয়ে রক্ত পড়া থাইরয়েড thyroid ঘ্যাগ গলগণ্ড ভয়েস কর্কশ হওয়া স্বরভঙ্গ স্লিপ এপনিয়া নাক ডাকা snoring হেড নেক সার্জারি",
  eye:
    "চোখ eye চক্ষু চক্ষু বিশেষজ্ঞ ophthalmology দৃষ্টিশক্তি vision চশমা glasses ঝাপসা দেখা blurry vision ছানি cataract চোখের ছানি গ্লুকোমা glaucoma চোখের প্রেসার চোখ লাল red eye চোখ দিয়ে পানি পড়া চোখ চুলকানি চোখের ইনফেকশন কর্ণিয়া cornea রেটিনা retina চোখের অপারেশন ফ্যাকো phaco অঞ্জনি চোখের এলার্জি দূরের দৃষ্টি কাছের দৃষ্টি",
  dental:
    "দাঁত dental teeth দাঁতের ব্যথা toothache দাঁতে পোকা cavity ক্যাভিটি মাড়ি gums মাড়ি দিয়ে রক্ত পড়া bleeding gums মাড়ি ফোলা দাঁতের শিরশিরানি sensitivity রুট ক্যানেল root canal ফিলিং filling স্কেলিং scaling দাঁত তোলা extraction আঁকাবাঁকা দাঁত ব্রেসেস ক্যাপ ক্রাউন কৃত্রিম দাঁত ডেনচার ডেন্টাল সার্জারি আক্কেল দাঁতের ব্যথা মুখের দুর্গন্ধ",
  diabetes:
    "ডায়াবেটিস ডায়াবেটিস diabetes রক্তে সুগার blood sugar হাই সুগার ঘন ঘন প্রস্রাব অতিরিক্ত ক্ষুধা পিপাসা ডায়াবেটিক ফুট diabetic foot পায়ে ঘা ইনসুলিন insulin থাইরয়েড থাইরয়েড thyroid হরমোন hormone হরমোনজনিত হাইপোথাইরয়েডিজম হাইপারথাইরয়েডিজম ওজন দ্রুত কমা বা বাড়া স্থূলতা পলিসিস্টিক এন্ডোক্রাইন endocrinology",
  nutrition:
    "পুষ্টি nutrition ডায়েট diet ডায়েটিশিয়ান dietitian ওজন নিয়ন্ত্রণ weight loss ওজন কমানো ওজন বাড়ানো মেদ কমানো ডায়েট চার্ট diet chart ডায়াবেটিস ডায়েট কিডনি ডায়েট ফ্যাটি লিভার খাদ্য তালিকা পুষ্টিকর খাবার সুষম খাদ্য শিশুর খাবার অপুষ্টি স্থূলতা ওবেসিটি হাইপারটেনশন ডায়েট খাদ্যাভ্যাস",
  other:
    "সাধারণ স্বাস্থ্য পরীক্ষা শারীরিক সমস্যা বিশেষজ্ঞ পরামর্শ রোগ নির্ণয় ক্লিনিক্যাল টেস্ট প্রেসক্রিপশন স্বাস্থ্য পরীক্ষা",
};

/**
 * Returns disease and symptom indexing keywords for a doctor based on department and specialty.
 */
export function getDoctorDiseaseKeywords(doc: {
  department?: string | null;
  specialty?: string | null;
}): string {
  const dept = (doc.department || "other").toLowerCase();
  const spec = (doc.specialty || "").toLowerCase();

  const keywords: string[] = [];

  if (DEPARTMENT_DISEASE_KEYWORDS_MAP[dept]) {
    keywords.push(DEPARTMENT_DISEASE_KEYWORDS_MAP[dept]);
  }

  // Check for cross-specialty keywords
  if (spec.includes("মেডিসিন") || spec.includes("medicine")) {
    keywords.push(DEPARTMENT_DISEASE_KEYWORDS_MAP.medicine);
  }
  if (spec.includes("গ্যাস্ট্রো") || spec.includes("লিভার") || spec.includes("hepato") || spec.includes("gastro")) {
    keywords.push(DEPARTMENT_DISEASE_KEYWORDS_MAP.hepatology);
  }
  if (spec.includes("ডায়াবেটিস") || spec.includes("ডায়াবেটিস") || spec.includes("হরমোন") || spec.includes("diabetes")) {
    keywords.push(DEPARTMENT_DISEASE_KEYWORDS_MAP.diabetes);
  }
  if (spec.includes("বাত") || spec.includes("rheumat")) {
    keywords.push(DEPARTMENT_DISEASE_KEYWORDS_MAP.rheumatology);
  }
  if (spec.includes("হাড়") || spec.includes("অর্থোপেডিক") || spec.includes("ortho")) {
    keywords.push(DEPARTMENT_DISEASE_KEYWORDS_MAP.orthopedics);
  }
  if (spec.includes("কার্ডি") || spec.includes("হৃদরোগ") || spec.includes("cardio")) {
    keywords.push(DEPARTMENT_DISEASE_KEYWORDS_MAP.cardiology);
  }
  if (spec.includes("গাইনী") || spec.includes("গাইনি") || spec.includes("gyne")) {
    keywords.push(DEPARTMENT_DISEASE_KEYWORDS_MAP.gynecology);
  }
  if (spec.includes("শিশু") || spec.includes("pediatric")) {
    keywords.push(DEPARTMENT_DISEASE_KEYWORDS_MAP.pediatrics);
  }
  if (spec.includes("চর্ম") || spec.includes("এলার্জি") || spec.includes("derma") || spec.includes("skin")) {
    keywords.push(DEPARTMENT_DISEASE_KEYWORDS_MAP.dermatology);
  }
  if (spec.includes("নাক") || spec.includes("কান") || spec.includes("গলা") || spec.includes("ent")) {
    keywords.push(DEPARTMENT_DISEASE_KEYWORDS_MAP.ent);
  }
  if (spec.includes("কিডনি") || spec.includes("ইউরোলজি") || spec.includes("nephro") || spec.includes("uro")) {
    keywords.push(DEPARTMENT_DISEASE_KEYWORDS_MAP.nephrology);
  }

  return keywords.join(" ");
}

