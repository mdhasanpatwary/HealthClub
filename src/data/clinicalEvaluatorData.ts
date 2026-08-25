export type BpCategory =
  | "hypotension"
  | "normal"
  | "elevated"
  | "stage1"
  | "stage2"
  | "crisis";

export interface BpEvaluationResult {
  category: BpCategory;
  systolic: number;
  diastolic: number;
  pulsePressure: number;
  meanArterialPressure: number;
  titleBn: string;
  titleEn: string;
  badgeBn: string;
  badgeEn: string;
  color: string;
  bgColor: string;
  borderColor: string;
  badgeBg: string;
  summaryBn: string;
  summaryEn: string;
  actionPlanBn: string[];
  actionPlanEn: string[];
  dietTipsBn: string[];
  dietTipsEn: string[];
  warningSignsBn: string[];
  warningSignsEn: string[];
  recommendedDoctorBn: string;
  recommendedDoctorEn: string;
  urgencyLevel: "normal" | "caution" | "warning" | "danger" | "emergency";
}

export function evaluateBloodPressure(systolic: number, diastolic: number): BpEvaluationResult {
  const pulsePressure = systolic - diastolic;
  const meanArterialPressure = Math.round(diastolic + pulsePressure / 3);

  // Hypertensive Crisis: Systolic > 180 and/or Diastolic > 120
  if (systolic > 180 || diastolic > 120) {
    return {
      category: "crisis",
      systolic,
      diastolic,
      pulsePressure,
      meanArterialPressure,
      titleBn: "হাইপারটেনসিভ ক্রাইসিস (জরুরি স্বাস্থ্য ঝুঁকি)",
      titleEn: "Hypertensive Crisis (Emergency Risk)",
      badgeBn: "জরুরি সতর্কতা / Crisis",
      badgeEn: "Emergency Crisis",
      color: "text-rose-600 dark:text-rose-400",
      bgColor: "bg-rose-500/10 dark:bg-rose-950/40",
      borderColor: "border-rose-500/30",
      badgeBg: "bg-rose-600 text-white",
      summaryBn: "আপনার রক্তচাপ মারাত্মক ঝুঁকিপূর্ণ সীমায় পৌঁছেছে। এটি হার্ট অ্যাটাক, স্ট্রোক বা অঙ্গহানির কারণ হতে পারে। অবিলম্বে জরুরি চিকিৎসা বা হাসপাতালে যান।",
      summaryEn: "Your blood pressure is critically high. This requires immediate emergency medical attention to prevent stroke or heart complications.",
      actionPlanBn: [
        "কোনো রকম বিলম্ব না করে দ্রুত নিকটস্থ হাসপাতালের জরুরি বিভাগে যোগাযোগ করুন।",
        "৫ মিনিট শান্তভাবে শুয়ে বা বসে থাকুন এবং পুনরায় প্রেসার মাপুন।",
        "পূর্বনির্ধারিত জরুরি প্রেসারের ওষুধ থাকলে চিকিৎসকের নির্দেশ অনুযায়ী গ্রহণ করুন।",
        "অতিরিক্ত শারীরিক পরিশ্রম ও মানসিক চাপ সম্পূর্ণ পরিহার করুন।",
      ],
      actionPlanEn: [
        "Seek immediate emergency medical care or visit the nearest hospital ER.",
        "Rest quietly for 5 minutes and re-test blood pressure.",
        "Take prescribed emergency medications strictly as advised by your physician.",
        "Avoid any physical exertion and severe emotional stress.",
      ],
      dietTipsBn: [
        "খাবারে বাড়তি লবণ, প্রক্রিয়াজাত স্ন্যাকস ও সোডিয়ামযুক্ত খাবার সম্পূর্ণ বন্ধ রাখুন।",
        "অ্যালকোহল ও ক্যাফেইনযুক্ত পানীয় এড়িয়ে চলুন।",
      ],
      dietTipsEn: [
        "Completely eliminate table salt, processed snacks, and sodium-heavy items.",
        "Avoid caffeine, energy drinks, and alcohol strictly.",
      ],
      warningSignsBn: [
        "বুকে তীব্র ব্যথা, চাপ বা অসাড়তা",
        "প্রচণ্ড মাথাব্যথা ও ঝাপসা দৃষ্টি",
        "শ্বাসকষ্ট ও কথা জড়িয়ে যাওয়া",
        "শরীরের এক পাশ দুর্বল বা অবশ হয়ে যাওয়া",
      ],
      warningSignsEn: [
        "Severe chest pain or shortness of breath",
        "Intense headache accompanied by blurry vision",
        "Difficulty speaking or sudden weakness/numbness on one side",
        "Dizziness or loss of consciousness",
      ],
      recommendedDoctorBn: "কার্ডিওলজিস্ট (হৃদরোগ বিশেষজ্ঞ) / সিসিইউ ও ইমার্জেন্সি বিশেষজ্ঞ",
      recommendedDoctorEn: "Cardiologist / Emergency Medicine Specialist",
      urgencyLevel: "emergency",
    };
  }

  // Hypertension Stage 2: Systolic >= 140 or Diastolic >= 90
  if (systolic >= 140 || diastolic >= 90) {
    return {
      category: "stage2",
      systolic,
      diastolic,
      pulsePressure,
      meanArterialPressure,
      titleBn: "উচ্চ রক্তচাপ - স্টেজ ২ (Hypertension Stage 2)",
      titleEn: "Hypertension - Stage 2 (High Risk)",
      badgeBn: "উচ্চ রক্তচাপ স্টেজ ২",
      badgeEn: "Hypertension Stage 2",
      color: "text-red-500 dark:text-red-400",
      bgColor: "bg-red-500/10 dark:bg-red-950/30",
      borderColor: "border-red-500/30",
      badgeBg: "bg-red-500 text-white",
      summaryBn: "আপনার রক্তচাপ স্টেজ ২ হাইপারটেনশন নির্দেশ করছে। নিয়মিত ওষুধ ও জীবনযাত্রার পরিবর্তন ছাড়া এটি নিয়ন্ত্রণ সম্ভব নাও হতে পারে। চিকিৎসকের পরামর্শ নেওয়া জরুরি।",
      summaryEn: "Your blood pressure is in Stage 2 hypertension. Clinical medication and structured lifestyle modifications are strongly indicated.",
      actionPlanBn: [
        "যত দ্রুত সম্ভব একজন মেডিসিন বা হৃদরোগ বিশেষজ্ঞের পরামর্শ নিয়ে চিকিৎসা পরিকল্পনা নিন।",
        "দৈনিক সকালে ও রাতে নির্দিষ্ট সময়ে প্রেসার মেপে চার্ট তৈরি করে রাখুন।",
        "দৈনিক অন্তত ৩০ মিনিট মাঝারি গতির হাঁটা বা শরীরচর্চা করুন।",
        "পর্যাপ্ত ৭-৮ ঘণ্টা গভীর ঘুম নিশ্চিত করুন এবং স্ট্রেস নিয়ন্ত্রণ করুন।",
      ],
      actionPlanEn: [
        "Consult a medicine specialist or cardiologist for diagnostic evaluation and prescription.",
        "Maintain a daily morning & evening BP log to show your doctor.",
        "Perform at least 30 minutes of moderate aerobic exercise (brisk walk) daily.",
        "Ensure 7-8 hours of quality sleep and practice stress management techniques.",
      ],
      dietTipsBn: [
        "DASH ডায়েট অনুসরণ করুন (সবুজ শাকসবজি, ফলমূল, বাদাম ও লো-ফ্যাট দুধ)।",
        "দৈনিক লবণের পরিমাণ ১ চা চামচ (৫ গ্রাম)-এর নিচে রাখুন।",
        "তেল-চর্বিযুক্ত মাংস ও অতিরিক্ত প্রক্রিয়াজাত খাদ্য বর্জন করুন।",
      ],
      dietTipsEn: [
        "Adopt the DASH diet (high in leafy vegetables, fruits, whole grains, and potassium).",
        "Restrict dietary sodium to less than 2,000 mg (1 teaspoon) daily.",
        "Reduce red meat, fried delicacies, and saturated fats.",
      ],
      warningSignsBn: [
        "ঘন ঘন মাথা ঘোরা বা তীব্র মাথাব্যথা",
        "বুকে ধড়ফড় করা বা হালকা অস্বস্তি",
        "নাক দিয়ে রক্ত পড়া বা কানে ভোঁ ভোঁ শব্দ হওয়া",
      ],
      warningSignsEn: [
        "Frequent dizziness, lightheadedness, or throbbing head pain",
        "Irregular heartbeats or chest palpitations",
        "Nosebleeds or persistent ringing in the ears",
      ],
      recommendedDoctorBn: "মেডিসিন বিশেষজ্ঞ / কার্ডিওলজিস্ট",
      recommendedDoctorEn: "Medicine Specialist / Cardiologist",
      urgencyLevel: "danger",
    };
  }

  // Hypertension Stage 1: Systolic 130-139 or Diastolic 80-89
  if (systolic >= 130 || diastolic >= 80) {
    return {
      category: "stage1",
      systolic,
      diastolic,
      pulsePressure,
      meanArterialPressure,
      titleBn: "উচ্চ রক্তচাপ - স্টেজ ১ (Hypertension Stage 1)",
      titleEn: "Hypertension - Stage 1 (Mild)",
      badgeBn: "উচ্চ রক্তচাপ স্টেজ ১",
      badgeEn: "Hypertension Stage 1",
      color: "text-orange-500 dark:text-orange-400",
      bgColor: "bg-orange-500/10 dark:bg-orange-950/30",
      borderColor: "border-orange-500/30",
      badgeBg: "bg-orange-500 text-white",
      summaryBn: "আপনার রক্তচাপ মৃদু উচ্চ মাত্রায় রয়েছে। সঠিক খাদ্যাভ্যাস, ওজন নিয়ন্ত্রণ ও শারীরিক সক্রিয়তার মাধ্যমে এটি স্বাভাবিক মাত্রায় ফিরিয়ে আনা সম্ভব।",
      summaryEn: "Your blood pressure is in Stage 1 hypertension. Lifestyle adjustments, sodium reduction, and weight management can bring it back to normal.",
      actionPlanBn: [
        "খাবারে বাড়তি লবণ পরিহার করুন এবং সপ্তাহে ২-৩ দিন প্রেসার রেকর্ড করুন।",
        "ওজন অতিরিক্ত হলে ৫-১০% ওজন কমানোর লক্ষ্য নির্ধারণ করুন।",
        "প্রতিদিন ৩০ মিনিট নিয়মিত হাঁটা বা জগিং শুরু করুন।",
        "ধূমপান বা তামাকজাত দ্রব্য ব্যবহার থাকলে তা অবিলম্বে পরিহার করুন।",
      ],
      actionPlanEn: [
        "Eliminate added table salt and check your blood pressure 2-3 times weekly.",
        "Aim for a 5-10% body weight reduction if overweight.",
        "Engage in 30 minutes of aerobic exercise daily.",
        "Quit smoking and avoid secondhand tobacco exposure completely.",
      ],
      dietTipsBn: [
        "পটাশিয়াম সমৃদ্ধ খাবার খান (যেমন কলা, ডাবের পানি, পালং শাক ও টমেটো)।",
        "প্যাকেটজাত খাবার ও চিপস-চানাচুর খাওয়া নিয়ন্ত্রণ করুন।",
        "পর্যাপ্ত পানি পান করুন ও ক্যাফেইন গ্রহণ সীমিত করুন।",
      ],
      dietTipsEn: [
        "Increase potassium intake through bananas, coconut water, spinach, and tomatoes.",
        "Limit packaged salty snacks and canned foods.",
        "Stay hydrated with water and limit caffeine drinks.",
      ],
      warningSignsBn: [
        "সামান্য পরিশ্রমে ক্লান্তি বা অস্থিরতা",
        "ঘাড়ের পেছনের অংশে টানটান ভাব বা অস্বস্তি",
      ],
      warningSignsEn: [
        "Occasional tension in the back of the neck",
        "Unexplained fatigue with mild activity",
      ],
      recommendedDoctorBn: "জেনারেল ফিজিশিয়ান / মেডিসিন বিশেষজ্ঞ",
      recommendedDoctorEn: "General Physician / Internal Medicine",
      urgencyLevel: "warning",
    };
  }

  // Elevated: Systolic 120-129 and Diastolic < 80
  if (systolic >= 120 && diastolic < 80) {
    return {
      category: "elevated",
      systolic,
      diastolic,
      pulsePressure,
      meanArterialPressure,
      titleBn: "উত্তোলিত রক্তচাপ (Elevated Blood Pressure)",
      titleEn: "Elevated Blood Pressure (Pre-hypertension)",
      badgeBn: "উত্তোলিত / প্রাক-উচ্চ রক্তচাপ",
      badgeEn: "Elevated BP",
      color: "text-amber-500 dark:text-amber-400",
      bgColor: "bg-amber-500/10 dark:bg-amber-950/30",
      borderColor: "border-amber-500/30",
      badgeBg: "bg-amber-500 text-white",
      summaryBn: "আপনার সিস্টোলিক রক্তচাপ স্বাভাবিকের চেয়ে কিছুটা বেশি কিন্তু এখনও পূর্ণ হাইপারটেনশনে রূপ নেয়নি। এখনই সচেতন হলে উচ্চ রক্তচাপ প্রতিরোধ সম্ভব।",
      summaryEn: "Your blood pressure is slightly elevated. Proactive heart-healthy habits now can prevent progression into clinical hypertension.",
      actionPlanBn: [
        "খাবারে বাড়তি কাঁচা লবণ খাওয়ার অভ্যাস পরিহার করুন।",
        "দৈনিক কায়িক পরিশ্রম ও হাঁটার অভ্যাস বজায় রাখুন।",
        "পর্যাপ্ত পানি পান ও মানসিক প্রশান্তির দিকে নজর দিন।",
      ],
      actionPlanEn: [
        "Avoid adding raw table salt to cooked dishes.",
        "Maintain regular daily physical activity and active movement.",
        "Keep stress low through meditation, hobbies, and restorative sleep.",
      ],
      dietTipsBn: [
        "তাজা শাকসবজি ও সালাদ খাওয়ার পরিমাণ বাড়ান।",
        "মিষ্টি ও পরিশোধিত কার্বোহাইড্রেট কম গ্রহণ করুন।",
      ],
      dietTipsEn: [
        "Eat more fresh colorful vegetables and whole fruits.",
        "Limit refined sugars and processed fast foods.",
      ],
      warningSignsBn: [
        "সাধারণত কোনো উপসর্গ দেখা দেয় না, তাই মাসে অন্তত ১ বার চেক করুন।",
      ],
      warningSignsEn: [
        "Typically asymptomatic; check your BP at least once monthly.",
      ],
      recommendedDoctorBn: "সাধারণ স্বাস্থ্য সচেতনতা ও বার্ষিক চেকআপ",
      recommendedDoctorEn: "Annual Health Checkup / General Physician",
      urgencyLevel: "caution",
    };
  }

  // Hypotension (Low BP): Systolic < 90 or Diastolic < 60
  if (systolic < 90 || diastolic < 60) {
    return {
      category: "hypotension",
      systolic,
      diastolic,
      pulsePressure,
      meanArterialPressure,
      titleBn: "নিম্ন রক্তচাপ / লো প্রেসার (Hypotension)",
      titleEn: "Low Blood Pressure (Hypotension)",
      badgeBn: "লো প্রেসার / Hypotension",
      badgeEn: "Low Blood Pressure",
      color: "text-sky-600 dark:text-sky-400",
      bgColor: "bg-sky-500/10 dark:bg-sky-950/30",
      borderColor: "border-sky-500/30",
      badgeBg: "bg-sky-600 text-white",
      summaryBn: "আপনার রক্তচাপ স্বাভাবিকের চেয়ে কম। পর্যাপ্ত পানিশূন্যতা রোধ, পুষ্টিকর খাবার এবং লবণযুক্ত স্যালাইন/শরবত প্রেসার স্বাভাবিক রাখতে সাহায্য করে।",
      summaryEn: "Your blood pressure is lower than normal. Ensure proper hydration, electrolyte balance, and nutrient-rich meals.",
      actionPlanBn: [
        "হঠাৎ দাঁড়ানো বা শোয়া থেকে ওঠা পরিহার করুন (ধীরে ধীরে উঠুন)।",
        "প্রচুর পানি, ডাবের পানি ও প্রয়োজনে ওরাল স্যালাইন পান করুন।",
        "একবারে বেশি না খেয়ে অল্প অল্প করে দিনে কয়েকবার খাবার খান।",
        "মাথা ঘোরার সমস্যা থাকলে চিকিৎসকের সাথে কথা বলুন।",
      ],
      actionPlanEn: [
        "Avoid standing up abruptly from sitting or lying positions.",
        "Increase fluid and electrolyte intake (water, coconut water, ORS).",
        "Eat smaller, more frequent balanced meals throughout the day.",
        "Consult a physician if accompanied by chronic fatigue or syncope.",
      ],
      dietTipsBn: [
        "পরিমিত লবণযুক্ত পুষ্টিকর খাবার, ডিম, দুধ ও স্যুপ গ্রহণ করুন।",
        "দৈনিক পর্যাপ্ত তরল ও ইলেক্ট্রোলাইট গ্রহণ করুন।",
      ],
      dietTipsEn: [
        "Include moderate healthy sodium, warm soups, eggs, and dairy.",
        "Maintain optimal hydration with natural fluids.",
      ],
      warningSignsBn: [
        "হঠাৎ মাথা ঘুরে পড়ে যাওয়া বা চোখে অন্ধকার দেখা",
        "অতিরিক্ত দুর্বলতা ও হাত-পা ঠাণ্ডা হয়ে যাওয়া",
      ],
      warningSignsEn: [
        "Fainting spells, blackouts, or severe dizziness upon standing",
        "Cold, clammy skin with intense fatigue",
      ],
      recommendedDoctorBn: "জেনারেল ফিজিশিয়ান / মেডিসিন বিশেষজ্ঞ",
      recommendedDoctorEn: "General Physician / Medicine Specialist",
      urgencyLevel: "caution",
    };
  }

  // Normal: Systolic < 120 and Diastolic < 80 (and >= 90 / >= 60)
  return {
    category: "normal",
    systolic,
    diastolic,
    pulsePressure,
    meanArterialPressure,
    titleBn: "আদর্শ ও স্বাভাবিক রক্তচাপ (Normal Blood Pressure)",
    titleEn: "Optimal & Healthy Blood Pressure",
    badgeBn: "স্বাভাবিক ও স্বাস্থ্যকর",
    badgeEn: "Normal Healthy BP",
    color: "text-primary dark:text-emerald-400",
    bgColor: "bg-primary/10 dark:bg-emerald-950/30",
    borderColor: "border-primary/30",
    badgeBg: "bg-primary text-white",
    summaryBn: "অভিনন্দন! আপনার রক্তচাপ সম্পূর্ণ আদর্শ ও স্বাস্থ্যকর সীমার মধ্যে রয়েছে। এটি আপনার হার্ট ও রক্তনালীর চমৎকার কার্যকারিতা নির্দেশ করে।",
    summaryEn: "Congratulations! Your blood pressure is within the optimal healthy range. Keep up your active lifestyle and balanced nutrition.",
    actionPlanBn: [
      "বর্তমান সুষম খাদ্যাভ্যাস ও স্বাস্থ্যকর অভ্যাসগুলো ধরে রাখুন।",
      "সপ্তাহে অন্তত ১৫০ মিনিট মাঝারি শরীরচর্চা বা হাঁটা বজায় রাখুন।",
      "বছরে অন্তত ১-২ বার রক্তচাপ পরীক্ষা করুন।",
    ],
    actionPlanEn: [
      "Continue maintaining your healthy lifestyle and balanced diet.",
      "Engage in at least 150 minutes of moderate aerobic exercise per week.",
      "Check your blood pressure periodically 1-2 times a year.",
    ],
    dietTipsBn: [
      "রঙিন শাকসবজি, মৌসুমি ফল, গোটা শস্য ও স্বাস্থ্যকর প্রোটিন খান।",
      "পর্যাপ্ত পানি পান করুন এবং অতিরিক্ত প্রক্রিয়াজাত খাদ্য এড়িয়ে চলুন।",
    ],
    dietTipsEn: [
      "Enjoy a balanced variety of whole grains, fruits, vegetables, and lean protein.",
      "Stay hydrated and avoid excess sugary or ultra-processed treats.",
    ],
    warningSignsBn: [
      "কোনো ঝুঁকিপূর্ণ লক্ষণ নেই। নিয়মিত সুস্থ জীবনযাপন বজায় রাখুন।",
    ],
    warningSignsEn: [
      "No clinical risks detected. Continue routine wellness checkups.",
    ],
    recommendedDoctorBn: "নিয়মিত স্বাস্থ্য বজায় রাখুন (বিশেষ কোনো বিশেষজ্ঞের প্রয়োজন নেই)",
    recommendedDoctorEn: "Maintain healthy routine (No specialist required)",
    urgencyLevel: "normal",
  };
}

// -------------------------------------------------------------
// DIABETES / BLOOD GLUCOSE EVALUATION
// -------------------------------------------------------------

export type GlucoseContext = "fasting" | "post_meal" | "random" | "hba1c";
export type GlucoseUnit = "mmol" | "mgdl";

export type GlucoseCategory =
  | "hypoglycemia"
  | "normal"
  | "prediabetes"
  | "diabetes"
  | "severe_hyperglycemia";

export interface GlucoseEvaluationResult {
  category: GlucoseCategory;
  valueMmol: number;
  valueMgDl: number;
  context: GlucoseContext;
  unit: GlucoseUnit;
  titleBn: string;
  titleEn: string;
  badgeBn: string;
  badgeEn: string;
  color: string;
  bgColor: string;
  borderColor: string;
  badgeBg: string;
  summaryBn: string;
  summaryEn: string;
  actionPlanBn: string[];
  actionPlanEn: string[];
  dietTipsBn: string[];
  dietTipsEn: string[];
  warningSignsBn: string[];
  warningSignsEn: string[];
  recommendedDoctorBn: string;
  recommendedDoctorEn: string;
  urgencyLevel: "normal" | "caution" | "warning" | "danger" | "emergency";
  targetRangeBn: string;
  targetRangeEn: string;
}

export function convertGlucose(value: number, from: GlucoseUnit, to: GlucoseUnit): number {
  if (from === to) return value;
  if (from === "mmol" && to === "mgdl") {
    return parseFloat((value * 18.0182).toFixed(1));
  }
  return parseFloat((value / 18.0182).toFixed(1));
}

export function evaluateBloodGlucose(
  value: number,
  context: GlucoseContext,
  unit: GlucoseUnit
): GlucoseEvaluationResult {
  // Normalize value to mmol/L for standardized logic (if not hba1c)
  let valMmol = unit === "mmol" ? value : convertGlucose(value, "mgdl", "mmol");
  let valMgDl = unit === "mgdl" ? value : convertGlucose(value, "mmol", "mgdl");

  let category: GlucoseCategory = "normal";

  if (context === "hba1c") {
    valMmol = value;
    valMgDl = value;
    if (value < 4.0) category = "hypoglycemia";
    else if (value < 5.7) category = "normal";
    else if (value < 6.5) category = "prediabetes";
    else if (value <= 10.0) category = "diabetes";
    else category = "severe_hyperglycemia";
  } else if (context === "fasting") {
    if (valMmol < 3.9) category = "hypoglycemia";
    else if (valMmol <= 5.5) category = "normal";
    else if (valMmol <= 6.9) category = "prediabetes";
    else if (valMmol <= 13.9) category = "diabetes";
    else category = "severe_hyperglycemia";
  } else if (context === "post_meal" || context === "random") {
    if (valMmol < 3.9) category = "hypoglycemia";
    else if (valMmol < 7.8) category = "normal";
    else if (valMmol <= 11.0) category = "prediabetes";
    else if (valMmol <= 16.7) category = "diabetes";
    else category = "severe_hyperglycemia";
  }

  // Get Target Ranges
  let targetRangeBn = "";
  let targetRangeEn = "";
  if (context === "fasting") {
    targetRangeBn = "৩.৯ - ৫.৫ mmol/L (৭০ - ৯৯ mg/dL)";
    targetRangeEn = "3.9 - 5.5 mmol/L (70 - 99 mg/dL)";
  } else if (context === "post_meal" || context === "random") {
    targetRangeBn = "< ৭.৮ mmol/L (< ১৪০ mg/dL)";
    targetRangeEn = "< 7.8 mmol/L (< 140 mg/dL)";
  } else {
    targetRangeBn = "< ৫.৭%";
    targetRangeEn = "< 5.7%";
  }

  if (category === "severe_hyperglycemia") {
    return {
      category,
      valueMmol: valMmol,
      valueMgDl: valMgDl,
      context,
      unit,
      targetRangeBn,
      targetRangeEn,
      titleBn: "মারাত্মক উচ্চ রক্তের শর্করা (Severe Hyperglycemia)",
      titleEn: "Critical Hyperglycemia (Emergency Alert)",
      badgeBn: "জরুরি সতর্কতা / Severe High",
      badgeEn: "Severe Hyperglycemia",
      color: "text-rose-600 dark:text-rose-400",
      bgColor: "bg-rose-500/10 dark:bg-rose-950/40",
      borderColor: "border-rose-500/30",
      badgeBg: "bg-rose-600 text-white",
      summaryBn: "আপনার রক্তের শর্করার মাত্রা বিপদজনকভাবে বেশি। এটি ডায়াবেটিক কিটোঅ্যাসিডোসিস (DKA) বা হাইপারঅসমোলার সিন্ড্রোমের মতো মারাত্মক জটিলতা তৈরি করতে পারে। দ্রুত চিকিৎসকের শরণাপন্ন হওয়া প্রয়োজন।",
      summaryEn: "Your blood glucose level is dangerously elevated. Immediate medical evaluation is vital to avert diabetic ketoacidosis (DKA) or hyperosmolar complications.",
      actionPlanBn: [
        "বিলম্ব না করে নিকটস্থ ডায়াবেটিস হাসপাতাল বা বিশেষজ্ঞ ডাক্তারের জরুরি ইউনিটে যোগাযোগ করুন।",
        "প্রচুর পরিমাণ বিশুদ্ধ পানি পান করুন যাতে পানিশূন্যতা না হয়।",
        "ইনসুলিন বা নির্ধারিত ওষুধ চিকিৎসকের পরামর্শ ছাড়া নিজে পরিবর্তন করবেন না।",
        "প্রস্রাবে কিটোন টেস্ট করার নির্দেশ থাকলে তা পরীক্ষা করান।",
      ],
      actionPlanEn: [
        "Seek immediate emergency consultation with an endocrinologist or visit a diabetic hospital ER.",
        "Drink plenty of pure water to prevent dehydration.",
        "Do not self-adjust insulin without medical guidance.",
        "Test for urinary ketones if you have Type 1 diabetes.",
      ],
      dietTipsBn: [
        "যেকোনো মিষ্টি, জুস, কার্বোহাইড্রেট ও কোমল পানীয় সম্পূর্ণ নিষিদ্ধ।",
        "শুধু পানি বা পাতলা শাকসবজির স্যুপ গ্রহণ করুন।",
      ],
      dietTipsEn: [
        "Strictly avoid any sugars, fruits juices, carbohydrates, or sodas.",
        "Stick to plain water and light vegetable broths.",
      ],
      warningSignsBn: [
        "তীব্র পিপাসা ও ঘন ঘন প্রস্রাবের বেগ",
        "বমি বমি ভাব, পেটে তীব্র ব্যথা বা শ্বাসকষ্ট",
        "নিঃশ্বাসে মিষ্টি বা ফলের মতো গন্ধ (Fruity breath)",
        "অতিরিক্ত ঝিমুনি বা মানসিক বিভ্রান্তি",
      ],
      warningSignsEn: [
        "Excessive extreme thirst and very frequent urination",
        "Nausea, persistent vomiting, or abdominal pain",
        "Fruity or acetone-like breath odor",
        "Confusion, extreme drowsiness, or altered consciousness",
      ],
      recommendedDoctorBn: "এন্ডোক্রাইনোলজিস্ট / ডায়াবেটিস ও হরমোন বিশেষজ্ঞ",
      recommendedDoctorEn: "Endocrinologist / Diabetologist",
      urgencyLevel: "emergency",
    };
  }

  if (category === "hypoglycemia") {
    return {
      category,
      valueMmol: valMmol,
      valueMgDl: valMgDl,
      context,
      unit,
      targetRangeBn,
      targetRangeEn,
      titleBn: "হাইপোগ্লাইসেমিয়া / বিপদজনক কম শর্করা (Hypoglycemia)",
      titleEn: "Hypoglycemia (Dangerously Low Blood Sugar)",
      badgeBn: "লো সুগার / Hypoglycemia",
      badgeEn: "Low Blood Sugar",
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-500/10 dark:bg-amber-950/30",
      borderColor: "border-amber-500/30",
      badgeBg: "bg-amber-600 text-white",
      summaryBn: "আপনার রক্তের শর্করা বিপদসীমার নিচে নেমে গেছে (< ৩.৯ mmol/L বা < ৭০ mg/dL)। অবিলম্বে দ্রুত কার্যকরী শর্করা (যেমন চিনি মেশানো পানি বা গ্লুকোজ) গ্রহণ করুন।",
      summaryEn: "Your blood glucose is critically low (< 3.9 mmol/L or < 70 mg/dL). Apply the 15-15 rule immediately: consume 15g fast-acting carbs and re-test in 15 minutes.",
      actionPlanBn: [
        "১৫-১৫ নিয়ম প্রয়োগ করুন: অবিলম্বে ৩-৪ চা চামচ চিনি/গ্লুকোজ বা আধা কাপ ফলের রস খান।",
        "১৫ মিনিট বিশ্রাম নিয়ে পুনরায় রক্তের সুগার মাপুন।",
        "সুগার স্বাভাবিক হলে একটি হালকা স্ন্যাক্স (যেমন বিস্কুট বা রুটি) খান।",
        "ঘন ঘন লো সুগার হলে চিকিৎসকের সাথে পরামর্শ করে ওষুধের ডোজ সমন্বয় করুন।",
      ],
      actionPlanEn: [
        "Apply 15-15 Rule: Immediately take 15g fast-acting sugar (3-4 teaspoons glucose, fruit juice, or candy).",
        "Wait 15 minutes and re-test your blood sugar.",
        "Once normalized, eat a light balanced snack (whole grain cracker or meal).",
        "Consult your diabetologist to adjust medication or insulin dosages.",
      ],
      dietTipsBn: [
        "দ্রুত শর্করা হিসেবে গ্লুকোজ, গুড় বা চিনির শরবত কাছে রাখুন।",
        "খাবার সময়মতো গ্রহণ করুন, কোনো বেলার খাবার বাদ দেবেন না।",
      ],
      dietTipsEn: [
        "Always carry glucose tablets, candies, or sugar packets with you.",
        "Never skip meals or delay eating after taking insulin/medications.",
      ],
      warningSignsBn: [
        "হাত-পা কাঁপুনি ও অতিরিক্ত বুক ধড়ফড়",
        "হঠাৎ ঠান্ডা ঘাম বের হওয়া ও ক্ষুধা লাগা",
        "মাথা ঘোরা, দুর্বলতা ও দৃষ্টি ঝাপসা হওয়া",
      ],
      warningSignsEn: [
        "Shakiness, trembling hands, and rapid heartbeat",
        "Sudden cold sweats, pallor, and intense hunger",
        "Dizziness, confusion, or slurred speech",
      ],
      recommendedDoctorBn: "ডায়াবেটিস ও হরমোন বিশেষজ্ঞ / মেডিসিন বিশেষজ্ঞ",
      recommendedDoctorEn: "Diabetologist / Internal Medicine",
      urgencyLevel: "danger",
    };
  }

  if (category === "diabetes") {
    return {
      category,
      valueMmol: valMmol,
      valueMgDl: valMgDl,
      context,
      unit,
      targetRangeBn,
      targetRangeEn,
      titleBn: "ডায়াবেটিস পরিসীমা (Clinical Diabetes Range)",
      titleEn: "Diabetes Range (Elevated Glucose)",
      badgeBn: "ডায়াবেটিস / Diabetes",
      badgeEn: "Diabetes Range",
      color: "text-red-500 dark:text-red-400",
      bgColor: "bg-red-500/10 dark:bg-red-950/30",
      borderColor: "border-red-500/30",
      badgeBg: "bg-red-500 text-white",
      summaryBn: "আপনার রক্তের শর্করার মাত্রা ডায়াবেটিস নির্দেশ করছে। সঠিক চিকিৎসা ব্যবস্থাপনা, নিয়ন্ত্রিত ডায়েট ও নিয়মিত শরীরচর্চায় ডায়াবেটিস নিয়ন্ত্রণে রাখা সম্ভব।",
      summaryEn: "Your blood glucose level falls within the clinical diabetes diagnostic range. A structured medical care plan and lifestyle discipline are recommended.",
      actionPlanBn: [
        "একজন ডায়াবেটিস বা মেডিসিন বিশেষজ্ঞের সাথে পরামর্শ করে ল্যাব টেস্ট (HbA1c, লিপিড প্রোফাইল) করান।",
        "একটি গ্লুকোমিটারের মাধ্যমে নিয়মিত সুগার চার্ট লিপিবদ্ধ করুন।",
        "প্রতিদিন অন্তত ৩০-৪৫ মিনিট নিয়মিত দ্রুত হাঁটা বা অ্যারোবিক ব্যায়াম করুন।",
        "ডায়াবেটিস কার্ড তৈরি করে স্বাস্থ্য ক্লাবের ডিসকাউন্ট সুবিধায় সেবা নিন।",
      ],
      actionPlanEn: [
        "Consult a diabetologist or endocrinologist for confirmation and lab profiling (HbA1c, lipid panel).",
        "Maintain a structured blood glucose monitoring logbook with your glucometer.",
        "Engage in 30-45 minutes of brisk walking or moderate physical activity daily.",
        "Take advantage of Health Club partner discounts for diagnostic and medicine savings.",
      ],
      dietTipsBn: [
        "ভাত ও রুটি পরিমিত পরিমাণে খান এবং লাল চাল ও লাল আটা বেছে নিন।",
        "তাজা শাকসবজি, করলা, মেথি, শসা ও উচ্চ ফাইবারযুক্ত খাদ্য বাড়ান।",
        "চিনি, মিষ্টি, বেকারি খাবার ও কোল্ড ড্রিংকস এড়িয়ে চলুন।",
      ],
      dietTipsEn: [
        "Control portion sizes of carbohydrates and choose whole grains (brown rice, whole wheat).",
        "Increase dietary fiber with green vegetables, bitter gourd, cucumbers, and salads.",
        "Strictly avoid added refined sugars, sweet desserts, and sweetened drinks.",
      ],
      warningSignsBn: [
        "অতিরিক্ত ক্ষুধা ও বার বার পিপাসা লাগা",
        "শরীরের ওজন দ্রুত হ্রাস পাওয়া ও ক্ষত দেরিতে শুকানো",
        "হাত ও পায়ে অবশ ভাব বা জ্বালাপোড়া করা",
      ],
      warningSignsEn: [
        "Frequent urination and constant intense thirst",
        "Unintentional weight loss and slow-healing cuts/wounds",
        "Numbness, tingling, or burning sensation in feet",
      ],
      recommendedDoctorBn: "ডায়াবেটিস ও এন্ডোক্রাইনোলজিস্ট / মেডিসিন বিশেষজ্ঞ",
      recommendedDoctorEn: "Diabetologist / Endocrinologist",
      urgencyLevel: "danger",
    };
  }

  if (category === "prediabetes") {
    return {
      category,
      valueMmol: valMmol,
      valueMgDl: valMgDl,
      context,
      unit,
      targetRangeBn,
      targetRangeEn,
      titleBn: "ডায়াবেটিস পূর্বাবস্থা (Pre-diabetes / Impaired Glucose)",
      titleEn: "Pre-diabetes (Impaired Glucose Tolerance)",
      badgeBn: "প্রাক-ডায়াবেটিস / Pre-diabetes",
      badgeEn: "Pre-diabetes",
      color: "text-orange-500 dark:text-orange-400",
      bgColor: "bg-orange-500/10 dark:bg-orange-950/30",
      borderColor: "border-orange-500/30",
      badgeBg: "bg-orange-500 text-white",
      summaryBn: "আপনার রক্তের শর্করা স্বাভাবিকের চেয়ে বেশি কিন্তু ডায়াবেটিসের চূড়ান্ত মাত্রায় পৌঁছায়নি। এখনই সঠিক খাদ্যাভ্যাস ও ওজন কমানোর মাধ্যমে ডায়াবেটিস পুরোপুরি ঠেকানো সম্ভব।",
      summaryEn: "Your glucose level indicates pre-diabetes. Lifestyle interventions now can reverse insulin resistance and prevent progression to Type 2 diabetes.",
      actionPlanBn: [
        "শারীরিক ওজন ৫% থেকে ৭% কমানোর লক্ষ্য নির্ধারণ করুন।",
        "সপ্তাহে অন্তত ৫ দিন ৩০ মিনিট করে ঘাম ঝরিয়ে হাঁটুন।",
        "প্রতি ৩-৬ মাস অন্তর রক্তের শর্করা ও HbA1c পরীক্ষা করুন।",
        "দৈনিক মানসিক চাপ ও অনিয়মিত ঘুমের অভ্যাস দূর করুন।",
      ],
      actionPlanEn: [
        "Aim for a 5-7% weight reduction to significantly boost insulin sensitivity.",
        "Commit to 30 minutes of moderate aerobic exercise at least 5 days a week.",
        "Re-screen your fasting blood sugar and HbA1c every 3-6 months.",
        "Improve sleep hygiene and manage workplace/daily stress.",
      ],
      dietTipsBn: [
        "খাবারে মিষ্টি ও প্রসেসড কার্বোহাইড্রেট পরিহার করে শাকসবজি ও সালাদের অনুপাত দ্বিগুণ করুন।",
        "রাতের খাবার ঘুমানোর অন্তত ২ ঘণ্টা আগে সম্পন্ন করুন।",
      ],
      dietTipsEn: [
        "Cut back on sugary snacks and refined flour; double your vegetable and salad intake.",
        "Eat dinner at least 2 hours before going to bed.",
      ],
      warningSignsBn: [
        "সাধারণত স্পষ্ট কোনো উপসর্গ থাকে না, তাই নিয়মিত টেস্ট আবশ্যক।",
      ],
      warningSignsEn: [
        "Often symptom-free; regular screening is the best preventative check.",
      ],
      recommendedDoctorBn: "পুষ্টিবিদ (Nutritionist) / জেনারেল মেডিসিন",
      recommendedDoctorEn: "Clinical Nutritionist / General Physician",
      urgencyLevel: "warning",
    };
  }

  // Normal Range
  return {
    category,
    valueMmol: valMmol,
    valueMgDl: valMgDl,
    context,
    unit,
    targetRangeBn,
    targetRangeEn,
    titleBn: "স্বাভাবিক ও স্বাস্থ্যকর শর্করা (Normal Blood Glucose)",
    titleEn: "Optimal Healthy Blood Glucose",
    badgeBn: "স্বাভাবিক ও স্বাস্থ্যকর",
    badgeEn: "Normal Healthy Glucose",
    color: "text-primary dark:text-emerald-400",
    bgColor: "bg-primary/10 dark:bg-emerald-950/30",
    borderColor: "border-primary/30",
    badgeBg: "bg-primary text-white",
    summaryBn: "অভিনন্দন! আপনার রক্তের শর্করার মাত্রা সম্পূর্ণ স্বাভাবিক ও আদর্শ সীমার মধ্যে রয়েছে। আপনার শরীরের ইনসুলিন কার্যক্ষমতা চমৎকার অবস্থায় আছে।",
    summaryEn: "Congratulations! Your blood glucose is within the optimal healthy reference range. Your metabolism and insulin regulation are functioning well.",
    actionPlanBn: [
      "সুষম ও স্বাস্থ্যকর খাদ্যাভ্যাস বজায় রাখুন।",
      "দৈনিক শারীরিক সক্রিয়তা ও খেলাধুলা/ব্যায়াম চালিয়ে যান।",
      "বছরে অন্তত একবার রুটিন রক্তের শর্করা পরীক্ষা করুন।",
    ],
    actionPlanEn: [
      "Maintain your well-balanced dietary patterns and whole-food choices.",
      "Stay active with daily physical movement and routine fitness activities.",
      "Get a routine fasting blood sugar or HbA1c screening annually.",
    ],
    dietTipsBn: [
      "উচ্চ ফাইবারযুক্ত খাবার, শাকসবজি, ডাল ও মৌসুমি ফলমূল খাদ্যতালিকায় রাখুন।",
      "পর্যাপ্ত পানি পান করুন ও অতিরিক্ত মিষ্টি পানীয় পরিহার করুন।",
    ],
    dietTipsEn: [
      "Include fiber-rich legumes, vegetables, fruits, and lean proteins.",
      "Stay well-hydrated and minimize excessive sugary refreshments.",
    ],
    warningSignsBn: [
      "কোনো ঝুঁকির লক্ষণ নেই। নিয়মিত সুস্থ জীবনধারা বজায় রাখুন।",
    ],
    warningSignsEn: [
      "No clinical risks detected. Keep maintaining your healthy routine.",
    ],
    recommendedDoctorBn: "বার্ষিক রুটিন স্বাস্থ্য পরীক্ষা",
    recommendedDoctorEn: "Routine Annual Checkup",
    urgencyLevel: "normal",
  };
}
