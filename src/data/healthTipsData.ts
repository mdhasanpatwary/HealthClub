export interface HealthTipArticle {
  slug: string;
  titleBn: string;
  titleEn: string;
  excerptBn: string;
  excerptEn: string;
  category: "general" | "diabetes" | "cardiology" | "nutrition" | "pediatrics";
  categoryNameBn: string;
  categoryNameEn: string;
  readTimeBn: string;
  readTimeEn: string;
  publishedDate: string;
  authorBn: string;
  authorEn: string;
  keyTakeawaysBn: string[];
  keyTakeawaysEn: string[];
  contentBn: string[];
  contentEn: string[];
  relatedSpecialty: string;
}

export const HEALTH_CATEGORIES = [
  { id: "all", nameBn: "সব বিষয়", nameEn: "All Topics" },
  { id: "general", nameBn: "সাধারণ স্বাস্থ্য", nameEn: "General Health" },
  { id: "diabetes", nameBn: "ডায়াবেটিস ও হরমোন", nameEn: "Diabetes Care" },
  { id: "cardiology", nameBn: "হৃদরোগ ও রক্তচাপ", nameEn: "Cardiology & BP" },
  { id: "nutrition", nameBn: "পুষ্টি ও ডায়েট", nameEn: "Nutrition & Diet" },
  { id: "pediatrics", nameBn: "শিশু স্বাস্থ্য", nameEn: "Child Health" },
] as const;

export const HEALTH_TIPS_ARTICLES: HealthTipArticle[] = [
  {
    slug: "dengue-fever-prevention-treatment",
    titleBn: "ডেঙ্গু জ্বর: প্রাথমিক লক্ষণ, চিকিৎসা ও জরুরি করণীয়",
    titleEn: "Dengue Fever: Early Symptoms, Care and Emergency Actions",
    excerptBn: "ডেঙ্গু হলে কখন হাসপাতালে ভর্তি হতে হবে, প্লাটিলেট কমে গেলে কী করবেন এবং ঘরে বসে নিরাপদ প্রাথমিক চিকিৎসা পদ্ধতি জেনে নিন।",
    excerptEn: "Learn when hospitalization is required for dengue, platelet care, and safe home management guidelines.",
    category: "general",
    categoryNameBn: "সাধারণ স্বাস্থ্য",
    categoryNameEn: "General Health",
    readTimeBn: "৪ মিনিট",
    readTimeEn: "4 min read",
    publishedDate: "১৪ আগস্ট, ২০২৬",
    authorBn: "ডাঃ তানভীর হাসান (এমবিবিএস, এফসিপিএস)",
    authorEn: "Dr. Tanvir Hasan (MBBS, FCPS)",
    relatedSpecialty: "medicine",
    keyTakeawaysBn: [
      "জ্বর হলে প্যারাসিটামল ছাড়া অন্য কোনো ব্যথানাশক (যেমন আইবুপ্রোফেন/ডাইক্লোফেনাক) খাওয়া সম্পূর্ণ নিষেধ।",
      "পর্যাপ্ত তরল খাবার, খাবার স্যালাইন, ডাবের পানি ও লেবুর শরবত পান করুন।",
      "মাড়ি বা নাক দিয়ে রক্তপাত, অতিরিক্ত পেটব্যথা বা বমি হলে অবিলম্বে হাসপাতালে ভর্তি হোন।",
    ],
    keyTakeawaysEn: [
      "Never take painkiller medications like Ibuprofen or Diclofenac during fever; only Paracetamol is safe.",
      "Stay hydrated with ORS, coconut water, fresh fruit juices, and clear soups.",
      "Seek emergency hospital admission if there is bleeding from gums, severe abdominal pain, or continuous vomiting.",
    ],
    contentBn: [
      "বর্ষা ও শরৎকালে এডিস মশার বংশবিস্তার বেড়ে যাওয়ার কারণে ডেঙ্গু জ্বরের প্রকোপ আশঙ্কাজনক হারে বৃদ্ধি পায়। সঠিক সময়ে লক্ষণ চিনে সঠিক পরিচর্যা নিলে ডেঙ্গু থেকে দ্রুত আরোগ্য লাভ সম্ভব।",
      "**ডেঙ্গুর প্রধান লক্ষণসমূহ:**\n- হঠাৎ তীব্র জ্বর (১০৩° থেকে ১০৫° ফারেনহাইট পর্যন্ত)\n- চোখের পেছনে তীব্র ব্যথা এবং তীব্র মাথাব্যথা\n- মাংসপেশি ও হাড়ের জোড়ে তীব্র ব্যথা (ব্রেক বোন ফিভার)\n- চামড়ায় লালচে র‍্যাশ বা দানা ওঠা এবং বমি বমি ভাব।",
      "**বিপদচিহ্ন (Warning Signs):**\n১. তীব্র পেটব্যথা ও ক্রমাগত বমি হওয়া\n২. নাক, দাঁতের মাড়ি বা কাশির সাথে রক্ত যাওয়া\n৩. চরম দুর্বলতা, অস্থিরতা বা হাত-পা ঠান্ডা হয়ে যাওয়া\n৪. প্রস্রাবের পরিমাণ উল্লেখযোগ্যভাবে কমে যাওয়া। এই লক্ষণগুলো দেখা দিলে কালবিলম্ব না করে হাসপাতালে যেতে হবে।",
      "**করণীয় ও প্রতিরোধ:**\nঘুমানোর সময় সব সময় মশারি ব্যবহার করুন। ঘরের ফুলের টব, এসির পানি বা পাত্রে জমে থাকা পরিষ্কার পানি ৩ দিনের মধ্যে ফেলে দিন।",
    ],
    contentEn: [
      "Dengue fever prevalence rises during seasonal rainfall due to Aedes mosquito breeding. Early detection and proper fluid balance ensure safe and swift recovery.",
      "**Key Symptoms:**\n- Sudden high fever (103°F to 105°F)\n- Severe headache and retro-orbital pain (behind the eyes)\n- Joint and severe muscle ache\n- Skin rashes and nausea.",
      "**Warning Signs for Hospitalization:**\n1. Persistent vomiting and severe abdominal pain\n2. Bleeding from gums, nose, or in stool\n3. Extreme lethargy, restlessness, or cold clammy extremities\n4. Drastic drop in urine output.",
      "**Prevention:** Always sleep under mosquito bed nets and eliminate stagnant water in flower pots, AC trays, and discarded containers within 3 days.",
    ],
  },
  {
    slug: "diabetes-diet-blood-sugar-control",
    titleBn: "ডায়াবেটিস নিয়ন্ত্রণে সঠিক খাদ্যাভ্যাস ও লাইফস্টাইল টিপস",
    titleEn: "Managing Diabetes: Ideal Nutrition and Blood Sugar Control",
    excerptBn: "রক্তে শর্করার মাত্রা নিয়ন্ত্রণে রাখতে কোন কোন খাবার খাওয়া উচিত এবং কীভাবে নিয়মিত হাঁটার অভ্যাস গড়ে তুলবেন।",
    excerptEn: "Practical dietary guidelines, low-glycemic foods, and daily habits to keep your blood glucose under control.",
    category: "diabetes",
    categoryNameBn: "ডায়াবেটিস ও হরমোন",
    categoryNameEn: "Diabetes Care",
    readTimeBn: "৫ মিনিট",
    readTimeEn: "5 min read",
    publishedDate: "১২ আগস্ট, ২০২৬",
    authorBn: "ডাঃ ফাতেমা জোহরা (এমবিবিএস, সিসিডি বারডেম)",
    authorEn: "Dr. Fatema Zohra (MBBS, CCD BIRDEM)",
    relatedSpecialty: "medicine",
    keyTakeawaysBn: [
      "একবারে বেশি খাবার না খেয়ে সারাদিনে অল্প অল্প করে ৪-৫ বার খান।",
      "সাদা চালের ভাত, চিনিযুক্ত মিষ্টি ও কোমল পানীয় সম্পূর্ণ পরিহার করুন।",
      "প্রতিদিন কমপক্ষে ৩০ থেকে ৪৫ মিনিট ঘাম ঝরিয়ে দ্রুত হাঁটার অভ্যাস করুন।",
    ],
    keyTakeawaysEn: [
      "Eat small, balanced portions 4-5 times a day rather than heavy meals.",
      "Avoid refined sugar, white polished rice, sugary beverages, and processed bakery snacks.",
      "Engage in at least 30-45 minutes of brisk walking every single day.",
    ],
    contentBn: [
      "ডায়াবেটিস এমন একটি দীর্ঘমেয়াদী বিপাকীয় রোগ যা সঠিক খাদ্যাভ্যাস ও নিয়মতান্ত্রিক জীবনযাপনের মাধ্যমে সম্পূর্ণ নিয়ন্ত্রণে রাখা যায়।",
      "**ডায়াবেটিস রোগীর আদর্শ খাবারের থালা:**\n- থালার অর্ধেক অংশ (৫০%): সবুজ শাকসবজি ও সালাদ (শসা, টমেটো, গাজর, বাঁধাকপি)\n- থালার এক-চতুর্থাংশ (২৫%): প্রোটিন (মাছ, চামড়াবিহীন মুরগির মাংস, ডিমের সাদা অংশ বা ডাল)\n- থালার এক-চতুর্থাংশ (২৫%): জটিল শর্করা (লাল চালের ভাত, লাল আটার রুটি বা ওটস)।",
      "**ব্যায়ামের গুরুত্ব:**\nপ্রতিদিন সকালে বা বিকেলে ৩০-৪০ মিনিট হাঁটলে মাংসপেশির ইনসুলিন সংবেদনশীলতা বৃদ্ধি পায়, যার ফলে রক্তে গ্লুকোজের মাত্রা স্বাভাবিক সীমার মধ্যে থাকে।",
    ],
    contentEn: [
      "Diabetes is a manageable metabolic condition that responds exceptionally well to disciplined nutrition and consistent physical movement.",
      "**The Ideal Diabetes Plate Method:**\n- 50% Plate: Non-starchy green vegetables and salads (cucumber, spinach, broccoli, lettuce)\n- 25% Plate: High-quality proteins (fish, skinless chicken, egg whites, lentils)\n- 25% Plate: Complex whole carbohydrates (brown rice, whole wheat roti, oats).",
      "**Exercise Benefit:** 30 minutes of daily brisk aerobic walking activates muscular glucose uptake, significantly improving insulin sensitivity.",
    ],
  },
  {
    slug: "hypertension-blood-pressure-care",
    titleBn: "উচ্চ রক্তচাপ (হাইপারটেনশন) নিয়ন্ত্রণে রাখার ৫টি বৈজ্ঞানিক নিয়ম",
    titleEn: "5 Scientific Rules to Manage High Blood Pressure",
    excerptBn: "কাঁচা লবণ বর্জন, পটাশিয়াম সমৃদ্ধ খাবার ও মানসিক চাপ কমানোর মাধ্যমে রক্তচাপ স্বাভাবিক রাখার উপায়।",
    excerptEn: "Sodium reduction, potassium-rich nutrition, and stress management techniques to prevent cardiovascular risks.",
    category: "cardiology",
    categoryNameBn: "হৃদরোগ ও রক্তচাপ",
    categoryNameEn: "Cardiology & BP",
    readTimeBn: "৩ মিনিট",
    readTimeEn: "3 min read",
    publishedDate: "১০ আগস্ট, ২০২৬",
    authorBn: "ডাঃ কে. এম. রেজওয়ান (কার্ডিওলজিস্ট)",
    authorEn: "Dr. K. M. Rezwan (Cardiologist)",
    relatedSpecialty: "cardiology",
    keyTakeawaysBn: [
      "ভাতের সাথে কাঁচা লবণ খাওয়া একদম বন্ধ করুন; দৈনিক মোট লবণ ১ চা চামচের কম রাখুন।",
      "ধূমপান ও জর্দা সম্পূর্ণ বর্জন করুন।",
      "ডাক্তারের পরামর্শ ছাড়া হঠাৎ রক্তচাপের ওষুধ বন্ধ করবেন না।",
    ],
    keyTakeawaysEn: [
      "Eliminate added raw table salt; keep total daily sodium under 1 teaspoon.",
      "Completely quit smoking and smokeless tobacco.",
      "Never stop prescribed antihypertensive medications abruptly without doctor consultation.",
    ],
    contentBn: [
      "উচ্চ রক্তচাপকে প্রায়ই 'নীরব ঘাতক' (Silent Killer) বলা হয়, কারণ কোনো প্রাথমিক উপসর্গ ছাড়াই এটি হৃদরোগ, স্ট্রোক ও কিডনি বিকল হওয়ার ঝুঁকি বাড়িয়ে দেয়।",
      "**১. লবণের মাত্রা নিয়ন্ত্রণ (DASH Diet):** অতিরিক্ত সোডিয়াম রক্তনালীতে পানির চাপ বাড়িয়ে রক্তচাপ বাড়িয়ে দেয়। প্রক্রিয়াজাত প্যাকেটজাত খাবার, চিপস ও আচার পরিহার করুন।",
      "**২. পটাশিয়াম সমৃদ্ধ খাবার গ্রহণ:** কলা, ডাবের পানি, মিষ্টি আলু ও পেঁপের মতো খাবার রক্তচাপ কমাতে সাহায্য করে।",
      "**৩. ওজন নিয়ন্ত্রণ ও পর্যাপ্ত ঘুম:** দৈনিক ৭-৮ ঘণ্টার নিরবচ্ছিন্ন ঘুম মানসিক চাপ হরমোন (করটিসোল) কমায় এবং হৃদযন্ত্রকে সুস্থ রাখে।",
    ],
    contentEn: [
      "Hypertension is known as the 'Silent Killer' because it often produces no symptoms while quietly increasing risks of heart attack, stroke, and kidney damage.",
      "**1. Lower Sodium Intake:** Excess sodium retains water inside blood vessels. Avoid chips, pickles, processed cured meats, and extra table salt.",
      "**2. Increase Potassium:** Foods like bananas, spinach, and sweet potatoes help balance sodium levels and relax vessel walls.",
      "**3. Quality Sleep:** 7-8 hours of uninterrupted rest lowers cortisol stress hormones and maintains stable vascular tone.",
    ],
  },
  {
    slug: "child-nutrition-immunity-boost",
    titleBn: "শিশুর রোগ প্রতিরোধ ক্ষমতা ও স্মৃতিশক্তি বাড়ানোর সহজ উপায়",
    titleEn: "Boosting Child Immunity and Brain Development",
    excerptBn: "বাচ্চাদের মৌসুমি সর্দি-কাশি থেকে রক্ষা করতে এবং পুষ্টিকর খাবারের মাধ্যমে দেহের রোগ প্রতিরোধ ক্ষমতা শক্তিশালী করার গাইড।",
    excerptEn: "Nutrition guidelines to protect children from seasonal infections and support mental cognitive growth.",
    category: "pediatrics",
    categoryNameBn: "শিশু স্বাস্থ্য",
    categoryNameEn: "Child Health",
    readTimeBn: "৪ মিনিট",
    readTimeEn: "4 min read",
    publishedDate: "৮ আগস্ট, ২০২৬",
    authorBn: "ডাঃ নুসরাত জাহান (শিশু বিশেষজ্ঞ)",
    authorEn: "Dr. Nusrat Jahan (Child Specialist)",
    relatedSpecialty: "pediatrics",
    keyTakeawaysBn: [
      "শিশুকে প্যাকেটজাত চিপস, চকলেট ও জুসের পরিবর্তে রঙিন ফলমূল খেতে উৎসাহিত করুন।",
      "দৈনিক অন্তত একটি সেদ্ধ ডিম ও এক গ্লাস খাঁটি দুধ দিন।",
      "রোদ ও খোলা মাঠে খেলাধুলার সুযোগ দিন যেন প্রাকৃতিক ভিটামিন ডি নিশ্চিত হয়।",
    ],
    keyTakeawaysEn: [
      "Replace packaged chips, candy, and soda with colorful fresh seasonal fruits.",
      "Ensure daily intake of one whole boiled egg and pure milk for quality proteins.",
      "Encourage outdoor playtime in morning sunlight for natural Vitamin D synthesis.",
    ],
    contentBn: [
      "শিশুদের শারীরিক ও মানসিক বিকাশের জন্য প্রথম ৫ বছর অত্যন্ত গুরুত্বপূর্ণ। এ সময় সঠিক পুষ্টি তাদের আজীবন সুস্থতার ভিত্তি গড়ে দেয়।",
      "**মৌসুমী ফল ও ভিটামিন সি:** পেয়ারা, আমলকী, কমলা ও মাল্টা শিশুর শ্বেত রক্তকণিকাকে শক্তিশালী করে এবং ইনফেকশন প্রতিরোধে সাহায্য করে।",
      "**ব্রেন বুস্টিং খাবার:** ডিমে থাকা কোলিন এবং মাছে থাকা ওমেগা-৩ ফ্যাটি এসিড শিশুর মস্তিষ্কের কোষ ও স্মৃতিশক্তি বৃদ্ধিতে অসাধারণ কাজ করে।",
    ],
    contentEn: [
      "A child's first five years are critical for immune foundation and neurological growth.",
      "**Vitamin C Rich Fruits:** Guava, oranges, and berries stimulate white blood cell production, shielding children against seasonal flu.",
      "**Brain Foods:** Eggs (rich in choline) and fish (omega-3 fatty acids) nourish cognitive memory and learning retention.",
    ],
  },
];
