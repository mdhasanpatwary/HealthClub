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
