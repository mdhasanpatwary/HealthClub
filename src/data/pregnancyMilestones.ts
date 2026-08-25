export interface BabyMilestone {
  week: number;
  fruitBn: string;
  fruitEn: string;
  sizeCm: string;
  weightG: string;
  iconEmoji: string;
  developmentBn: string;
  developmentEn: string;
}

export interface TrimesterAdvice {
  trimester: 1 | 2 | 3;
  titleBn: string;
  titleEn: string;
  rangeBn: string;
  rangeEn: string;
  nutritionBn: string[];
  nutritionEn: string[];
  careTipsBn: string[];
  careTipsEn: string[];
  warningSignsBn: string[];
  warningSignsEn: string[];
}

export interface PregnancyCalculationResult {
  edd: Date;
  gestationalAgeDays: number;
  weeks: number;
  days: number;
  trimester: 1 | 2 | 3;
  daysRemaining: number;
  progressPercentage: number;
  conceptionDate: Date;
  milestone: BabyMilestone;
  trimesterInfo: TrimesterAdvice;
}

export const PREGNANCY_MILESTONES: BabyMilestone[] = [
  {
    week: 4,
    fruitBn: "পোস্তদানা (Poppy Seed)",
    fruitEn: "Poppy Seed",
    sizeCm: "০.১ সেমি",
    weightG: "< ১ গ্রাম",
    iconEmoji: "🌱",
    developmentBn: "ভ্রূণ জরায়ুর দেয়ালে স্থাপিত হচ্ছে এবং প্লাসেন্টা ও অ্যামনিওটিক থলে তৈরি হতে শুরু করেছে।",
    developmentEn: "The blastocyst implants in the uterine wall; placenta and amniotic sac begin forming.",
  },
  {
    week: 6,
    fruitBn: "মসুর ডাল (Sweet Pea)",
    fruitEn: "Sweet Pea",
    sizeCm: "০.৬ সেমি",
    weightG: "< ১ গ্রাম",
    iconEmoji: "🫛",
    developmentBn: "শিশুর হৃদস্পন্দন শুরু হয়েছে এবং মস্তিষ্ক ও মেরুদণ্ডের প্রাথমিক কাঠামো গড়ে উঠছে।",
    developmentEn: "Baby's heartbeat begins and the neural tube is closing.",
  },
  {
    week: 8,
    fruitBn: "শিমের বিচি (Kidney Bean)",
    fruitEn: "Kidney Bean",
    sizeCm: "১.৬ সেমি",
    weightG: "১ গ্রাম",
    iconEmoji: "🫘",
    developmentBn: "হাত ও পায়ের আঙুল তৈরি হচ্ছে, চোখের পাতা ও নাকের অবয়ব স্পষ্ট হচ্ছে।",
    developmentEn: "Tiny fingers and toes are forming; eyes and facial features become identifiable.",
  },
  {
    week: 10,
    fruitBn: "স্ট্রবেরি (Strawberry)",
    fruitEn: "Strawberry",
    sizeCm: "৩.১ সেমি",
    weightG: "৪ গ্রাম",
    iconEmoji: "🍓",
    developmentBn: "ভ্রূণীয় পর্যায় শেষ হয়ে এখন ফেটাস পর্যায় শুরু। গুরুত্বপূর্ণ অঙ্গগুলো গঠিত হচ্ছে।",
    developmentEn: "Embryonic stage ends; vital organs are functioning and developing rapidly.",
  },
  {
    week: 12,
    fruitBn: "লেবু (Lime)",
    fruitEn: "Lime",
    sizeCm: "৫.৪ সেমি",
    weightG: "১৪ গ্রাম",
    iconEmoji: "🍋",
    developmentBn: "প্রথম ট্রাইমেস্টারের শেষ সপ্তাহ। শিশুর নখ তৈরি হচ্ছে এবং রিফ্লেক্স দেখা দিচ্ছে।",
    developmentEn: "End of 1st trimester; baby has formed reflexes, fingernails, and fully formed limbs.",
  },
  {
    week: 14,
    fruitBn: "কিউই ফল (Kiwi)",
    fruitEn: "Kiwi",
    sizeCm: "৮.৭ সেমি",
    weightG: "৪৩ গ্রাম",
    iconEmoji: "🥝",
    developmentBn: "দ্বিতীয় ট্রাইমেস্টার শুরু। শিশুর মুখের পেশি সক্রিয় হচ্ছে এবং হালকা চুল গজাতে শুরু করেছে।",
    developmentEn: "Second trimester starts; baby makes facial expressions and lanugo hair begins growing.",
  },
  {
    week: 16,
    fruitBn: "অ্যাভোকাডো (Avocado)",
    fruitEn: "Avocado",
    sizeCm: "১১.৬ সেমি",
    weightG: "১০০ গ্রাম",
    iconEmoji: "🥑",
    developmentBn: "শিশুর চোখ আলো অনুভব করতে পারে এবং মাথার ত্বক সুগঠিত হচ্ছে।",
    developmentEn: "Baby's eyes can perceive light; legs are more developed and head is more erect.",
  },
  {
    week: 18,
    fruitBn: "ক্যাপসিকাম (Bell Pepper)",
    fruitEn: "Bell Pepper",
    sizeCm: "১৪.২ সেমি",
    weightG: "১৯০ গ্রাম",
    iconEmoji: "🫑",
    developmentBn: "শ্রবণ ইন্দ্রিয় বিকশিত হচ্ছে, মায়ের কণ্ঠস্বর শুনতে পায় ও হাত-পা নাড়াচাড়া করে।",
    developmentEn: "Baby can hear external sounds, including your voice, and begins moving freely.",
  },
  {
    week: 20,
    fruitBn: "কলা (Banana)",
    fruitEn: "Banana",
    sizeCm: "২৫.৬ সেমি",
    weightG: "৩০০ গ্রাম",
    iconEmoji: "🍌",
    developmentBn: "গর্ভধারণের মাঝামাঝি সময়। আল্ট্রাসনোগ্রামে অঙ্গপ্রত্যঙ্গের বিস্তারিত গঠন (Anomaly scan) দেখা যায়।",
    developmentEn: "Halfway mark! Baby can swallow amniotic fluid and movements (quickening) are easily felt.",
  },
  {
    week: 22,
    fruitBn: "ছোট পেঁপে (Papaya)",
    fruitEn: "Papaya",
    sizeCm: "২৭.৮ সেমি",
    weightG: "৪৩০ গ্রাম",
    iconEmoji: "🥭",
    developmentBn: "স্বাদগ্রন্থি ও ইন্দ্রিয় সক্রিয় হচ্ছে। ভ্রূণের ঘুমের চক্র গঠিত হচ্ছে।",
    developmentEn: "Taste buds and senses develop; baby develops a regular sleep and wake cycle.",
  },
  {
    week: 24,
    fruitBn: "ভুট্টা (Corn on the Cob)",
    fruitEn: "Corn",
    sizeCm: "৩০.০ সেমি",
    weightG: "৬০০ গ্রাম",
    iconEmoji: "🌽",
    developmentBn: "ফুসফুসে ব্রঙ্কিয়াল গাছ তৈরি হচ্ছে এবং ত্বকে কৈশিক নালী গঠিত হচ্ছে।",
    developmentEn: "Viability milestone. Lungs are developing branches and baby responds to touch.",
  },
  {
    week: 26,
    fruitBn: "লেটুস পাতা (Lettuce Head)",
    fruitEn: "Lettuce",
    sizeCm: "৩৫.৬ সেমি",
    weightG: "৭৬০ গ্রাম",
    iconEmoji: "🥬",
    developmentBn: "শিশুর চোখ খুলতে শুরু করেছে এবং সে নিয়মিত শ্বাস নেওয়ার অনুশীলন করছে।",
    developmentEn: "Baby opens eyes for the first time and practices breathing amniotic fluid.",
  },
  {
    week: 28,
    fruitBn: "বেগুন (Eggplant)",
    fruitEn: "Eggplant",
    sizeCm: "৩৭.৬ সেমি",
    weightG: "১০০০ গ্রাম (১ কেজি)",
    iconEmoji: "🍆",
    developmentBn: "তৃতীয় ট্রাইমেস্টার শুরু। শিশুর চোখের পলক পড়ছে এবং শরীরের চর্বি দ্রুত বৃদ্ধি পাচ্ছে।",
    developmentEn: "Third trimester begins. Baby blinks eyes, develops body fat, and brain tissue surges.",
  },
  {
    week: 30,
    fruitBn: "বাঁধাকপি (Cabbage)",
    fruitEn: "Cabbage",
    sizeCm: "৩৯.৯ সেমি",
    weightG: "১৩০০ গ্রাম",
    iconEmoji: "🥬",
    developmentBn: "হাড় শক্ত হচ্ছে এবং অস্থিমজ্জা রক্তকণিকা উৎপাদন শুরু করেছে।",
    developmentEn: "Bone structure hardens; red blood cells are now completely produced by bone marrow.",
  },
  {
    week: 32,
    fruitBn: "নারকেল (Coconut)",
    fruitEn: "Coconut",
    sizeCm: "৪২.৪ সেমি",
    weightG: "১৭০০ গ্রাম",
    iconEmoji: "🥥",
    developmentBn: "শিশুর প্রায় সব প্রধান অঙ্গ পরিপক্ক হয়েছে, ত্বকের নিচে নরম চর্বির স্তর তৈরি হচ্ছে।",
    developmentEn: "Major organs are fully matured; baby practices sucking, swallowing, and breathing.",
  },
  {
    week: 34,
    fruitBn: "ফুটি / বাঙ্গি (Cantaloupe)",
    fruitEn: "Cantaloupe",
    sizeCm: "৪৫.০ সেমি",
    weightG: "২১০০ গ্রাম",
    iconEmoji: "🍈",
    developmentBn: "রোগ প্রতিরোধ ক্ষমতা মায়ের কাছ থেকে অ্যান্টিবডি গ্রহণের মাধ্যমে শক্তিশালী হচ্ছে।",
    developmentEn: "Immune system strengthens with maternal antibodies; central nervous system matures.",
  },
  {
    week: 36,
    fruitBn: "পেঁপে (Large Papaya)",
    fruitEn: "Large Papaya",
    sizeCm: "৪৭.৪ সেমি",
    weightG: "২৬০০ গ্রাম",
    iconEmoji: "🥭",
    developmentBn: "শিশু প্রসবের জন্য মাথা নিচের দিকে (Head-down cephalic position) নিয়ে আসছে।",
    developmentEn: "Baby usually settles into a head-down (cephalic) delivery position in the pelvis.",
  },
  {
    week: 38,
    fruitBn: "মিষ্টি কুমড়া (Winter Melon / Pumpkin)",
    fruitEn: "Pumpkin",
    sizeCm: "৪৯.৮ সেমি",
    weightG: "৩০০০ গ্রাম (৩ কেজি)",
    iconEmoji: "🎃",
    developmentBn: "ফুল টার্ম প্রেগন্যান্সি। শিশুর ফুসফুস ও মস্তিষ্ক স্বাভাবিক জন্মের জন্য সম্পূর্ণ প্রস্তুত।",
    developmentEn: "Full-term reached! Lungs, vocal cords, and reflexes are ready for life outside the womb.",
  },
  {
    week: 40,
    fruitBn: "পাকা তরমুজ (Watermelon)",
    fruitEn: "Watermelon",
    sizeCm: "৫১.২ সেমি",
    weightG: "৩৪০০ গ্রাম (৩.৪ কেজি)",
    iconEmoji: "🍉",
    developmentBn: "আপনার প্রত্যাশিত প্রসবের সপ্তাহ! শুভ কামনায় যেকোনো মুহূর্তে সন্তান পৃথিবীতে আসতে পারে।",
    developmentEn: "Due date week! Baby is fully grown and ready to meet you at any moment.",
  },
];

export const TRIMESTER_ADVICE: Record<1 | 2 | 3, TrimesterAdvice> = {
  1: {
    trimester: 1,
    titleBn: "প্রথম ট্রাইমেস্টার (১-১৩ সপ্তাহ)",
    titleEn: "First Trimester (Weeks 1 - 13)",
    rangeBn: "১ থেকে ১৩ সপ্তাহ",
    rangeEn: "1 to 13 weeks",
    nutritionBn: [
      "প্রতিদিন ৪০০-৬০০ মাইক্রোগ্রাম ফলিক অ্যাসিড (Folic Acid) গ্রহণ করুন, যা শিশুর জন্মগত ত্রুটি রোধ করে।",
      "ভিটামিন বি৬ ও আদাযুক্ত চা সকালের বমি বমি ভাব (Morning Sickness) কমাতে সাহায্য করে।",
      "পর্যাপ্ত ডিম, দুধ, বাদাম ও সবুজ শাকসবজি খাদ্যতালিকায় রাখুন।",
      "কাঁচা বা অর্ধসিদ্ধ মাংস, অতিরিক্ত চা/কফি এবং অপাস্তুরিত দুধ সম্পূর্ণ পরিহার করুন।",
    ],
    nutritionEn: [
      "Take 400-600 mcg of daily Folic Acid to prevent neural tube birth defects.",
      "Vitamin B6 and ginger tea help alleviate morning sickness and nausea.",
      "Consume nutrient-rich eggs, milk, nuts, and dark leafy greens.",
      "Avoid raw/undercooked meat, high caffeine, and unpasteurized dairy.",
    ],
    careTipsBn: [
      "কনফার্মেশন টেস্টের পর বিশেষজ্ঞ গাইনী চিকিৎসকের সাথে প্রথম প্রসবপূর্ব চেকআপ (ANC) সম্পন্ন করুন।",
      "ভারী বস্তু উত্তোলন এবং মানসিক চাপ এড়িয়ে চলুন। পর্যাপ্ত বিশ্রাম নিন।",
      "কোনো ওষুধ চিকিৎসকের পরামর্শ ব্যতীত গ্রহণ করবেন না।",
    ],
    careTipsEn: [
      "Schedule your first Antenatal Care (ANC) visit with an Obstetrician/Gynecologist.",
      "Avoid lifting heavy weights and reduce stress; get 8+ hours of sleep.",
      "Never take any medication without consulting your doctor.",
    ],
    warningSignsBn: [
      "যোনিপথে রক্তপাত বা স্পটিং (Bleeding/Spotting)",
      "তলপেটে তীব্র ব্যথা বা তীব্র খিঁচুনি",
      "অতিরিক্ত বমির কারণে তরল খাদ্যও পেটে না থাকা (Hyperemesis)",
      "তীব্র জ্বর বা কাঁপুনি",
    ],
    warningSignsEn: [
      "Vaginal bleeding or spotting",
      "Severe lower abdominal pain or cramping",
      "Inability to keep liquids down due to severe vomiting (Hyperemesis)",
      "High fever with chills",
    ],
  },
  2: {
    trimester: 2,
    titleBn: "দ্বিতীয় ট্রাইমেস্টার (১৪-২৭ সপ্তাহ)",
    titleEn: "Second Trimester (Weeks 14 - 27)",
    rangeBn: "১৪ থেকে ২৭ সপ্তাহ",
    rangeEn: "14 to 27 weeks",
    nutritionBn: [
      "রক্তস্বল্পতা রোধে প্রতিদিন আয়রন (Iron) ও ভিটামিন সি সমৃদ্ধ খাবার ও সাপ্লিমেন্ট গ্রহণ করুন।",
      "শিশুর হাড় ও দাঁত গঠনের জন্য ক্যালসিয়াম (১০০০ মিলিগ্রাম) এবং ভিটামিন ডি নিশ্চিত করুন।",
      "ওমেগা-৩ ফ্যাটি এসিড (মাছ, আখরোট) শিশুর মস্তিষ্কের দ্রুত বিকাশে অপরিহার্য।",
      "কোষ্ঠকাঠিন্য দূর করতে আঁশযুক্ত খাবার (ডাল, ইসবগুল, শাকসবজি) ও প্রচুর পানি পান করুন।",
    ],
    nutritionEn: [
      "Take daily Iron and Vitamin C supplements to prevent maternal anemia.",
      "Ensure 1000mg Calcium and Vitamin D for baby's bone and tooth development.",
      "Include Omega-3 fatty acids (fish, walnuts) for optimal brain growth.",
      "Eat fiber-rich foods and drink 2.5-3 liters of water to avoid constipation.",
    ],
    careTipsBn: [
      "১৮-২২ সপ্তাহের মধ্যে অ্যানোমালি স্ক্যান (Anomaly Ultrasound Scan) অবশ্যই করান।",
      "টিটেনাস (TT) টিকার প্রয়োজনীয় ডোজ চিকিৎসকের পরামর্শ অনুযায়ী গ্রহণ করুন।",
      "বামে কাত হয়ে ঘুমানোর অভ্যাস করুন, যা জরায়ু ও প্লাসেন্টায় রক্ত সঞ্চালন বাড়ায়।",
    ],
    careTipsEn: [
      "Undergo the mid-pregnancy Anomaly Scan between weeks 18-22.",
      "Take Tetanus Toxoid (TT) vaccine doses as recommended by your doctor.",
      "Sleep on your left side to maximize blood flow to the placenta.",
    ],
    warningSignsBn: [
      "২০ সপ্তাহের পর শিশুর নড়াচড়া অনুভূত না হওয়া বা হঠাৎ কমে যাওয়া",
      "হাতে, পায়ে বা মুখে হঠাৎ অস্বাভাবিক ফোলাভাব (Edema)",
      "তীব্র মাথাব্যথা বা দৃষ্টি ঝাপসা হয়ে আসা (Preeclampsia signs)",
      "যোনিপথে পানি ভাঙা বা তরল নির্গমন",
    ],
    warningSignsEn: [
      "Reduced or absent fetal movements after 20 weeks",
      "Sudden severe swelling in face, hands, or feet",
      "Severe headache or blurred vision (Potential preeclampsia)",
      "Vaginal fluid leakage",
    ],
  },
  3: {
    trimester: 3,
    titleBn: "তৃতীয় ট্রাইমেস্টার (২৮-৪০ সপ্তাহ)",
    titleEn: "Third Trimester (Weeks 28 - 40+)",
    rangeBn: "২৮ থেকে ৪০ সপ্তাহ",
    rangeEn: "28 to 40 weeks",
    nutritionBn: [
      "শিশুর দ্রুত ওজন বৃদ্ধির জন্য প্রোটিনসমৃদ্ধ খাবার (ডিম, মুরগি, ডাল, ছানা) বৃদ্ধি করুন।",
      "অ্যাসিডিটি এড়াতে একসাথে বেশি না খেয়ে দিনে ৫-৬ বার অল্প অল্প পুষ্টিকর খাবার খান।",
      "লবণ অতিরিক্ত গ্রহণ সীমিত রাখুন যাতে উচ্চ রক্তচাপের ঝুঁকি কমে।",
      "হাইড্রেটেড থাকুন এবং ডাবের পানি ও টাটকা ফলের রস গ্রহণ করুন।",
    ],
    nutritionEn: [
      "Increase high-protein intake (eggs, lean meat, lentils, paneer) for baby's rapid growth.",
      "Eat small, frequent meals (5-6 times daily) to prevent heartburn and indigestion.",
      "Limit excess sodium intake to manage healthy blood pressure.",
      "Stay well hydrated with fresh coconut water and clean fluids.",
    ],
    careTipsBn: [
      "প্রতিদিন শিশুর নড়াচড়ার হিসাব রাখুন (সাধারণত ২ ঘণ্টায় অন্তত ১০ বার নড়াচড়া স্বাভাবিক)।",
      "প্রসবের জন্য প্রয়োজনীয় হাসপাতাল ব্যাগ ও জরুরি যোগাযোগের প্রস্তুতি নিয়ে রাখুন।",
      "ফেনীর নিকটস্থ রেজিস্টার্ড হাসপাতাল বা ক্লিনিক আগে থেকেই নির্ধারণ করে রাখুন।",
    ],
    careTipsEn: [
      "Monitor baby's kick counts daily (at least 10 kicks within 2 hours).",
      "Pack your hospital delivery bag and keep emergency contacts ready.",
      "Select a registered partner hospital or clinic in Feni for safe delivery.",
    ],
    warningSignsBn: [
      "নিয়মিত ও তীব্র প্রসববেদনার মতো সংকোচন (Contractions)",
      "যোনিপথে রক্তপাত বা হঠাৎ অতিরিক্ত অ্যামনিওটিক ফ্লুইড বের হওয়া",
      "উচ্চ রক্তচাপ, বুকে ব্যথা বা শ্বাসকষ্ট",
      "শিশুর নড়াচড়া মারাত্মকভাবে কমে যাওয়া (Kick count < 10 in 2 hours)",
    ],
    warningSignsEn: [
      "Regular, intense contractions before week 37 (Preterm labor)",
      "Vaginal bleeding or sudden amniotic water breaking",
      "High blood pressure, chest tightness, or severe shortness of breath",
      "Noticeably reduced fetal movement (<10 kicks in 2 hours)",
    ],
  },
};

/**
 * Returns closest milestone for the current gestational week
 */
export function getMilestoneForWeek(week: number): BabyMilestone {
  const clampedWeek = Math.max(4, Math.min(40, week));
  let best = PREGNANCY_MILESTONES[0];
  let minDiff = Infinity;

  for (const m of PREGNANCY_MILESTONES) {
    const diff = Math.abs(m.week - clampedWeek);
    if (diff < minDiff) {
      minDiff = diff;
      best = m;
    }
  }
  return best;
}

/**
 * Calculate EDD and Gestational Age based on Last Menstrual Period (LMP)
 * Adjusted for menstrual cycle length: Naegele's rule -> LMP + 280 days + (cycle - 28)
 */
export function calculateEddFromLmp(lmpDate: Date, cycleLengthDays: number = 28): PregnancyCalculationResult {
  const cycleAdjustment = (cycleLengthDays - 28) * 24 * 60 * 60 * 1000;
  const lmpTime = lmpDate.getTime();
  const eddTime = lmpTime + (280 * 24 * 60 * 60 * 1000) + cycleAdjustment;
  const edd = new Date(eddTime);

  const conceptionTime = lmpTime + ((cycleLengthDays - 14) * 24 * 60 * 60 * 1000);
  const conceptionDate = new Date(conceptionTime);

  const now = new Date();
  // normalize to midnight
  const todayMid = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const lmpMid = new Date(lmpDate.getFullYear(), lmpDate.getMonth(), lmpDate.getDate()).getTime();
  const eddMid = new Date(edd.getFullYear(), edd.getMonth(), edd.getDate()).getTime();

  const gestationalAgeMs = Math.max(0, todayMid - lmpMid);
  const gestationalAgeDays = Math.floor(gestationalAgeMs / (24 * 60 * 60 * 1000));

  const weeks = Math.floor(gestationalAgeDays / 7);
  const days = gestationalAgeDays % 7;

  let trimester: 1 | 2 | 3 = 1;
  if (weeks >= 28) {
    trimester = 3;
  } else if (weeks >= 14) {
    trimester = 2;
  }

  const daysRemainingMs = eddMid - todayMid;
  const daysRemaining = Math.ceil(daysRemainingMs / (24 * 60 * 60 * 1000));

  const progressPercentage = Math.min(100, Math.max(0, Math.round((gestationalAgeDays / 280) * 100)));

  return {
    edd,
    gestationalAgeDays,
    weeks,
    days,
    trimester,
    daysRemaining,
    progressPercentage,
    conceptionDate,
    milestone: getMilestoneForWeek(weeks),
    trimesterInfo: TRIMESTER_ADVICE[trimester],
  };
}

/**
 * Calculate EDD and Gestational Age based on Ultrasound Dating Scan
 * scanWeeks + scanDays at scanDate -> EDD = scanDate + (280 - (scanWeeks*7 + scanDays))
 */
export function calculateEddFromUltrasound(
  scanDate: Date,
  scanWeeks: number,
  scanDays: number = 0
): PregnancyCalculationResult {
  const scanGaDays = scanWeeks * 7 + scanDays;
  const daysUntilEdd = 280 - scanGaDays;

  const scanTime = scanDate.getTime();
  const eddTime = scanTime + (daysUntilEdd * 24 * 60 * 60 * 1000);
  const edd = new Date(eddTime);

  const conceptionTime = eddTime - (266 * 24 * 60 * 60 * 1000);
  const conceptionDate = new Date(conceptionTime);

  const now = new Date();
  const todayMid = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const scanMid = new Date(scanDate.getFullYear(), scanDate.getMonth(), scanDate.getDate()).getTime();
  const eddMid = new Date(edd.getFullYear(), edd.getMonth(), edd.getDate()).getTime();

  const daysSinceScan = Math.floor((todayMid - scanMid) / (24 * 60 * 60 * 1000));
  const totalGaDays = Math.max(0, scanGaDays + daysSinceScan);

  const weeks = Math.floor(totalGaDays / 7);
  const days = totalGaDays % 7;

  let trimester: 1 | 2 | 3 = 1;
  if (weeks >= 28) {
    trimester = 3;
  } else if (weeks >= 14) {
    trimester = 2;
  }

  const daysRemainingMs = eddMid - todayMid;
  const daysRemaining = Math.ceil(daysRemainingMs / (24 * 60 * 60 * 1000));
  const progressPercentage = Math.min(100, Math.max(0, Math.round((totalGaDays / 280) * 100)));

  return {
    edd,
    gestationalAgeDays: totalGaDays,
    weeks,
    days,
    trimester,
    daysRemaining,
    progressPercentage,
    conceptionDate,
    milestone: getMilestoneForWeek(weeks),
    trimesterInfo: TRIMESTER_ADVICE[trimester],
  };
}
