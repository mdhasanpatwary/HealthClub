/**
 * Bengali to English Transliteration & Phonetic Normalizer
 * Provides high-speed bilingual text normalization for search querying and clean URL slug generation.
 */

// Common Bengali words & entity mappings for healthcare, titles, and names
const BENGALI_WORD_MAP: Record<string, string> = {
  // Medical Titles & Prefixes
  "ডাঃ": "dr",
  "ডা.": "dr",
  "ডা": "dr",
  "প্রফেসর": "prof",
  "অধ্যাপক": "prof",
  "সহকারী": "asst",
  "সহযোগী": "assoc",
  "ডাক্তার": "dr",

  // Healthcare Facilities & Types
  "হাসপাতাল": "hospital",
  "হসপিটাল": "hospital",
  "ডায়াগনস্টিক": "diagnostic",
  "ডায়াগনস্টিক": "diagnostic",
  "ডায়াগনস্টিকস": "diagnostics",
  "সেন্টার": "center",
  "ক্লিনিক": "clinic",
  "ফার্মেসি": "pharmacy",
  "ফার্মেসী": "pharmacy",
  "মেডিকেল": "medical",
  "মেডিসিন": "medicine",
  "ফিজিওথেরাপি": "physiotherapy",
  "রিহ্যাবিলিটেশন": "rehabilitation",
  "কনসালটেশন": "consultation",
  "কনসালটেন্ট": "consultant",
  "স্পেশালাইজড": "specialized",
  "জেনারেল": "general",
  "কেয়ার": "care",
  "কেয়ার": "care",
  "ল্যাব": "lab",
  "ল্যাবরেটরি": "laboratory",
  "স্টোর": "store",
  "স্টোরেজ": "stores",
  "চেম্বার": "chamber",
  "ডেন্টাল": "dental",
  "প্যাথলজি": "pathology",

  // Medical Specialties
  "গাইনি": "gynecology",
  "গাইনী": "gynecology",
  "কার্ডিওলজি": "cardiology",
  "হৃদরোগ": "cardiology",
  "অর্থোপেডিক": "orthopedics",
  "অর্থোপেডিক্স": "orthopedics",
  "শিশু": "pediatrics",
  "চর্ম": "dermatology",
  "যৌন": "venereology",
  "এলার্জি": "allergy",
  "চক্ষু": "eye",
  "চোখ": "eye",
  "ইএনটি": "ent",
  "নাক": "nose",
  "কান": "ear",
  "গলা": "throat",
  "নিউরো": "neurology",
  "নিউরোমেডিসিন": "neurology",
  "নিউরোসার্জারি": "neurosurgery",
  "সার্জারি": "surgery",
  "সার্জন": "surgeon",
  "কিডনি": "nephrology",
  "ইউরোলজি": "urology",
  "মনোরোগ": "psychiatry",
  "ডায়াবেটিস": "diabetes",
  "ডায়াবেটিস": "diabetes",
  "পুষ্টি": "nutrition",

  // Connectors & Common Prepositions
  "এন্ড": "and",
  "অ্যান্ড": "and",
  "ও": "and",
  "লিঃ": "ltd",
  "লিমিটেড": "limited",

  // Verified Contracted Partners & Local Landmarks
  "ইসলামিয়া": "islamia",
  "ইসলামিয়া": "islamia",
  "নিরাময়": "niramoy",
  "প্যাসিফিক": "pacific",
  "ইম্পেরিয়াল": "imperial",
  "ঢাকা": "dhaka",
  "সেন্ট্রাল": "central",
  "আল": "al",
  "আকসা": "aqsa",
  "লাইফ": "life",
  "ম্যাক্স": "max",
  "মজুমদার": "mazumder",
  "ফেনী": "feni",
  "ফেনি": "feni",
  "সদর": "sadar",

  // Common Bengali Names (Doctors / Staff)
  "কামরুন্নাহার": "kamrunnahar",
  "রলি": "roli",
  "চম্পা": "champa",
  "কুন্ডু": "kundu",
  "কুন্ড": "kundu",
  "আবদুল": "abdul",
  "আব্দুল": "abdul",
  "কুদ্দুস": "kuddus",
  "কুদ্দুছ": "kuddus",
  "সোহাগ": "sohag",
  "রিয়াজ": "riaz",
  "চৌধুরী": "chowdhury",
  "সুকান্ত": "sukanta",
  "দাস": "das",
  "দাশ": "das",
  "শাহনেওয়াজ": "shah-newaz",
  "শাহ": "shah",
  "নেওয়াজ": "newaz",
  "সিরাজ": "siraj",
  "মামুন": "mamun",
  "আসমা": "asma",
  "আক্তার": "akter",
  "আফরোজা": "afroza",
  "তৌফিক": "towfiq",
  "তৌফিকুল": "towfiqul",
  "হাছান": "hasan",
  "হাসান": "hasan",
  "হোসেন": "hossain",
  "হোসাইন": "hossain",
  "ভূঁইয়া": "bhuiyan",
  "ভূইয়া": "bhuiyan",
  "মঈনুল": "moinul",
  "মাহমুদ": "mahmud",
  "সানি": "sunny",
  "গুলশান": "gulshan",
  "আরা": "ara",
  "জাহান": "jahan",
  "মোস্তাফিজ": "mostafiz",
  "মোস্তাফিজুর": "mostafizur",
  "রহমান": "rahman",
  "আতিক": "atiq",
  "আতিকুর": "atiqur",
  "আনিস": "anis",
  "আনিসুর": "anisur",
  "রাসেল": "russel",
  "রোকন": "rokon",
  "উদ": "ud",
  "দৌলা": "dowla",
  "বেলাল": "belal",
  "আরিফ": "arif",
  "আরিফুর": "arifur",
  "বিপুল": "bipul",
  "মুহাম্মদ": "muhammad",
  "মোহাম্মদ": "mohammad",
  "মোঃ": "md",
  "মো:": "md",
  "মো": "md",
  "কামরুল": "kamrul",
  "কবির": "kabir",
  "মমিনুল": "mominul",
  "ইসলাম": "islam",
  "তুহিন": "tuhin",
  "শুভ্র": "shuvro",
  "সিফাত": "sifat",
  "সায়মা": "sayma",
  "জয়নাব": "joynab",
  "মুন্নী": "munni",
  "শুভ": "shuvo",
  "রাজীব": "rajib",
  "গুহ": "guha",
  "নয়ন": "noyon",
  "চন্দ্র": "chandra",
  "দেবনাথ": "debnath",
  "কামাল": "kamal",
  "উদ্দিন": "uddin",
  "ফাহমিদ": "fahmid",
  "ফাহমিদুল": "fahmidul",
  "হক": "hoque",
  "রিয়ন": "rion",
  "রিয়ন": "rion",
  "রাজু": "raju",
  "সরকার": "sarkar",
  "শাহাদাত": "shahadat",
  "তাসলিমা": "taslima",
  "বেগম": "begum",
  "তামিম": "tamim",
  "সৈয়দ": "syed",
  "আজাদ": "azad",
  "সোনিয়া": "sonia",
  "নাজমুল": "nazmul",
  "সাম্মি": "sammi",
  "ইকবাল": "iqbal",
  "রাফি": "rafi",
  "উল": "ul",
  "আলম": "alam",
  "ফাহিম": "fahim",
  "আসিফ": "asif",
  "উদ্দৌলা": "uddowla",
  "যুবায়ের": "jubayer",
  "ইবনে": "ibne",
  "খায়ের": "khayer",
  "অর্ণব": "arnab",
  "বণিক": "banik",
  "রাশেদ": "rashed",
  "রাশেদুল": "rashedul",
  "মীর": "mir",
  "শওকত": "showkat",
  "নিরব": "nirob",
  "নীরব": "nirob",
  "আবদুল্লাহ": "abdullah",
  "নোমান": "noman",
  "তোহিদ": "tohid",
};

// Bengali vowel mapping
const BENGALI_VOWELS: Record<string, string> = {
  "অ": "o", "আ": "a", "ই": "i", "ঈ": "i", "উ": "u", "ঊ": "u",
  "ঋ": "ri", "এ": "e", "ঐ": "oi", "ও": "o", "ঔ": "ou",
};

// Bengali vowel marks (kars)
const BENGALI_KARS: Record<string, string> = {
  "া": "a", "ি": "i", "ী": "i", "ু": "u", "ূ": "u",
  "ৃ": "ri", "ে": "e", "ৈ": "oi", "ো": "o", "ৌ": "ou",
};

// Bengali consonants
const BENGALI_CONSONANTS: Record<string, string> = {
  "ক": "k", "খ": "kh", "গ": "g", "ঘ": "gh", "ঙ": "ng",
  "চ": "ch", "ছ": "chh", "জ": "j", "ঝ": "jh", "ঞ": "n",
  "ট": "t", "ঠ": "th", "ড": "d", "ঢ": "dh", "ণ": "n",
  "ত": "t", "থ": "th", "দ": "d", "ধ": "dh", "ন": "n",
  "প": "p", "ফ": "f", "ব": "b", "ভ": "bh", "ম": "m",
  "য": "y", "র": "r", "ল": "l", "শ": "sh", "ষ": "sh", "স": "s", "হ": "h",
  "ড়": "r", "ঢ়": "rh", "য়": "y", "ৎ": "t", "ং": "ng", "ঃ": "h", "ঁ": "",
};

/**
 * Transliterates a single Bengali word using dictionary lookup with fallback to phonetic mapping.
 */
function transliterateWord(word: string): string {
  const clean = word.trim();
  if (!clean) return "";

  // Direct dictionary hit
  if (BENGALI_WORD_MAP[clean]) {
    return BENGALI_WORD_MAP[clean];
  }

  // Already English/ASCII
  if (/^[a-zA-Z0-9_-]+$/.test(clean)) {
    return clean.toLowerCase();
  }

  // Character-level phonetic conversion
  let result = "";
  for (let i = 0; i < clean.length; i++) {
    const char = clean[i];
    const nextChar = clean[i + 1];

    if (BENGALI_VOWELS[char]) {
      result += BENGALI_VOWELS[char];
    } else if (BENGALI_KARS[char]) {
      result += BENGALI_KARS[char];
    } else if (BENGALI_CONSONANTS[char]) {
      result += BENGALI_CONSONANTS[char];
      // If next char is NOT a kar and NOT a hasant, some consonants naturally carry inherent vowel 'a' or 'o'
      // But in slugs/searching, pure consonants without superfluous vowels match closer to modern English spelling
      if (nextChar === "্") {
        i++; // skip hasant
      }
    } else if (/[a-zA-Z0-9]/.test(char)) {
      result += char.toLowerCase();
    }
  }

  return result;
}

/**
 * Transliterates Bengali text into clean English/Latin text.
 * Suitable for building searchable indexes and phonetic matching.
 *
 * Example:
 * "ডাঃ কামরুন্নাহার রলি" -> "dr kamrunnahar roli"
 * "ইসলামিয়া ফিজিওথেরাপি এন্ড রিহ্যাবিলিটেশন সেন্টার" -> "islamia physiotherapy and rehabilitation center"
 */
export function transliterateBengaliToEnglish(text: string): string {
  if (!text || !text.trim()) return "";

  // Split by whitespace and common punctuation, preserving word boundaries
  const words = text
    .replace(/[.,/#!$%^&*;:{}=\-_`~()\[\]]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  const transliterated = words.map(transliterateWord).filter(Boolean);
  return transliterated.join(" ");
}

/**
 * Generates a clean, lowercase ASCII slug from either Bengali or English text.
 *
 * Examples:
 * - "Dr. Md. Abdul Kuddus (Sohag)" -> "dr-md-abdul-kuddus-sohag"
 * - "ডাঃ কামরুন্নাহার রলি" -> "dr-kamrunnahar-roli"
 * - "ইসলামিয়া ফিজিওথেরাপি এন্ড রিহ্যাবিলিটেশন সেন্টার" -> "islamia-physiotherapy-and-rehabilitation-center"
 */
export function generateCleanAsciiSlug(text: string): string {
  if (!text || !text.trim()) return "";

  const latinText = transliterateBengaliToEnglish(text);

  return latinText
    .trim()
    .toLowerCase()
    .replace(/&/g, "-and-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const PARTNER_HOSPITAL_ALIASES: Record<string, string> = {
  "life-care-diagnostic-center": "life care lifecare life care diagnostic",
  "imperial-neurocare-diagnostic-center": "imperial neurocare imperial diagnostic",
  "niramoy-diagnostic-consultation-center": "niramoy niramay niramoy diagnostic consultation",
  "নিরাময়-ডায়াগনস্টিক-এন্ড-কনসালটেশন-সেন্টার": "niramoy niramay niramoy diagnostic consultation",
  "m-rahaman-medical-stories": "m rahaman rahaman medical m rahman",
  "dhaka-pharmacy": "dhaka pharmacy dhaka medical",
  "ঢাকা-ফার্মেসি": "dhaka pharmacy dhaka medical",
  "feni-max-diagnostic-centre": "feni max fenimax feni max diagnostic",
  "al-aqsa-hospital-feni": "al aqsa al-aqsa hospital al aqsa hospital",
  "আল-আকসা-হাসপাতাল-লিঃ-ফেনী": "al aqsa al-aqsa hospital al aqsa hospital",
  "pacific-health-care-centre": "pacific pacific health care centre",
  "feni-care-hospital": "feni care fenicare feni care hospital",
  "ফেনী-কেয়ার-হসপিটাল": "feni care fenicare feni care hospital",
  "islamia-physiotherapy-and-rehabilitation-center": "islamia physiotherapy rehabilitation center islamia physio",
  "islamia-physiotherapy-rehabilitation-center": "islamia physiotherapy rehabilitation center islamia physio",
  "ইসলামিয়া-ফিজিওথেরাপি-এন্ড-রিহ্যাবিলিটেশন-সেন্টার": "islamia physiotherapy rehabilitation center islamia physio",
  "mazumder-dental-clinic": "mazumder dental clinic mojumdar dental",
  "মজুমদার-ডেন্টাল-ক্লিনিক": "mazumder dental clinic mojumdar dental",
  "central-physiotherapy-rehabilitation-center": "central physiotherapy rehabilitation center central physio",
  "সেন্ট্রাল-ফিজিওথেরাপি-এন্ড-রিহ্যাবিলিটেশন-সেন্টার": "central physiotherapy rehabilitation center central physio",
};

export function getChamberSearchAliases(doc: { chamberName?: string; partnerId?: string | null }): string {
  const parts: string[] = [];
  if (doc.partnerId && PARTNER_HOSPITAL_ALIASES[doc.partnerId]) {
    parts.push(PARTNER_HOSPITAL_ALIASES[doc.partnerId]);
  }
  const chamber = (doc.chamberName || "").toLowerCase();
  if (chamber.includes("ডিডি ল্যাব")) parts.push("dd lab ddlab d.d. lab");
  if (chamber.includes("পপুলার")) parts.push("popular popular diagnostic");
  if (chamber.includes("ল্যাবএইড")) parts.push("labaid labaid specialized hospital");
  if (chamber.includes("ইবনে সিনা")) parts.push("ibn sina ibnsina");
  if (chamber.includes("স্কয়ার") || chamber.includes("স্কয়ার")) parts.push("square square hospital");
  if (chamber.includes("লাইফ কেয়ার") || chamber.includes("লাইফ কেয়ার")) parts.push("life care lifecare");
  if (chamber.includes("হার্ট ফাউন্ডেশন")) parts.push("heart foundation national heart foundation");
  if (chamber.includes("জেনারেল হাসপাতাল")) parts.push("general hospital 250 bed general hospital");
  if (chamber.includes("ফেনী কেয়ার") || chamber.includes("ফেনী কেয়ার")) parts.push("feni care fenicare");
  if (chamber.includes("ইসলামিয়া") || chamber.includes("ইসলামিয়া")) parts.push("islamia");
  if (chamber.includes("নিরাময়") || chamber.includes("নিরাময়")) parts.push("niramoy");
  if (chamber.includes("মজুমদার")) parts.push("mazumder");
  if (chamber.includes("আল আকসা") || chamber.includes("আল-আকসা")) parts.push("al aqsa");
  return parts.join(" ");
}

export function getSpecialtySearchAliases(specialtyOrDept: string): string {
  const s = specialtyOrDept.toLowerCase();
  const parts: string[] = [];
  if (s.includes("গাইনি") || s.includes("গাইনী") || s.includes("gyne")) parts.push("gynae gynecology obgyn pregnancy");
  if (s.includes("কার্ডি") || s.includes("হৃদরোগ") || s.includes("cardio")) parts.push("cardiology cardiologist heart");
  if (s.includes("অর্থোপেডিক") || s.includes("হাড়") || s.includes("ortho")) parts.push("orthopedics orthopedic bone fracture");
  if (s.includes("শিশু") || s.includes("pediatric")) parts.push("pediatrics pediatric child baby");
  if (s.includes("চর্ম") || s.includes("যৌন") || s.includes("derma") || s.includes("skin")) parts.push("dermatology dermatologist skin allergy");
  if (s.includes("চক্ষু") || s.includes("চোখ") || s.includes("eye")) parts.push("eye ophthalmology vision");
  if (s.includes("ইএনটি") || s.includes("নাক") || s.includes("কান") || s.includes("গলা") || s.includes("ent")) parts.push("ent ear nose throat");
  if (s.includes("নিউরো") || s.includes("neuro")) parts.push("neurology neurologist brain spine");
  if (s.includes("সার্জারি") || s.includes("সার্জন") || s.includes("surgery")) parts.push("surgery surgeon operation laparoscopic");
  if (s.includes("কিডনি") || s.includes("nephro")) parts.push("nephrology kidney renal");
  if (s.includes("ইউরো") || s.includes("uro")) parts.push("urology urologist prostate");
  if (s.includes("মনোরোগ") || s.includes("সাইকিয়াট্রি") || s.includes("psych")) parts.push("psychiatry psychiatrist mental");
  if (s.includes("মেডিসিন") || s.includes("medicine")) parts.push("medicine internal physician");
  if (s.includes("ডায়াবেটিস") || s.includes("ডায়াবেটিস") || s.includes("diabetes")) parts.push("diabetes endocrinology sugar");
  return parts.join(" ");
}

