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
