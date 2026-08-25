import {
  evaluateBloodPressure,
  evaluateBloodGlucose,
  BpEvaluationResult,
  GlucoseEvaluationResult,
  GlucoseContext,
} from "@/data/clinicalEvaluatorData";
import { printHealthAssessmentReport, generateHealthReportHtml } from "./healthReportHtmlTemplate";

export { printHealthAssessmentReport, generateHealthReportHtml };

export interface HealthAssessmentInput {
  name?: string;
  age: number;
  gender: "male" | "female";
  heightCm: number;
  weightKg: number;
  activityLevel: "sedentary" | "light" | "moderate" | "active";
  weather?: "normal" | "hot";
  systolicBp?: number;
  diastolicBp?: number;
  bloodGlucose?: number;
  glucoseContext?: GlucoseContext;
}

export interface HealthAssessmentReport {
  reportId: string;
  generatedDate: string;
  generatedTime: string;
  name: string;
  age: number;
  gender: "male" | "female";
  heightCm: number;
  weightKg: number;
  activityLevel: "sedentary" | "light" | "moderate" | "active";

  // BMI
  bmi: number;
  bmiCategory: "underweight" | "normal" | "overweight" | "obese";
  bmiCategoryBn: string;
  bmiCategoryEn: string;
  idealMinKg: number;
  idealMaxKg: number;
  weightStatusAdviceBn: string;
  weightStatusAdviceEn: string;

  // Calorie
  bmr: number;
  maintenanceCalories: number;
  weightLossCalories: number;
  weightGainCalories: number;

  // Hydration
  dailyWaterLiters: number;
  dailyGlasses: number;

  // Clinical Indicators (BP & Sugar)
  bpEvaluation?: BpEvaluationResult;
  glucoseEvaluation?: GlucoseEvaluationResult;

  // Wellness Score
  overallScore: number;
  wellnessStatusBn: string;
  wellnessStatusEn: string;
  wellnessColor: string;

  // Actionable Advice
  dietRecommendationsBn: string[];
  dietRecommendationsEn: string[];
  exerciseRecommendationsBn: string[];
  exerciseRecommendationsEn: string[];
  warningSignsBn: string[];
  warningSignsEn: string[];
  doctorReferralBn: string;
  doctorReferralEn: string;
}

export function generateHealthAssessmentReport(
  input: HealthAssessmentInput
): HealthAssessmentReport {
  const heightMeters = Math.max(0.5, input.heightCm / 100);
  const weight = Math.max(10, input.weightKg);
  const age = Math.max(5, input.age);

  // 1. BMI Calculation
  const bmiRaw = weight / (heightMeters * heightMeters);
  const bmi = parseFloat(bmiRaw.toFixed(1));
  const idealMinKg = Math.round(18.5 * heightMeters * heightMeters);
  const idealMaxKg = Math.round(24.9 * heightMeters * heightMeters);

  let bmiCategory: "underweight" | "normal" | "overweight" | "obese" = "normal";
  let bmiCategoryBn = "স্বাভাবিক ও আদর্শ ওজন";
  let bmiCategoryEn = "Normal & Healthy Weight";
  let weightStatusAdviceBn =
    "আপনার ওজন উচ্চতা অনুযায়ী আদর্শ সীমার মধ্যে রয়েছে। বর্তমান খাদ্যাভ্যাস ও শারীরিক সক্রিয়তা বজায় রাখুন।";
  let weightStatusAdviceEn =
    "Your weight is well-balanced for your height. Maintain your current diet and regular physical activity.";

  if (bmi < 18.5) {
    bmiCategory = "underweight";
    bmiCategoryBn = "কম ওজন (আন্ডারওয়েট)";
    bmiCategoryEn = "Underweight";
    weightStatusAdviceBn =
      "আপনার ওজন স্বাভাবিকের চেয়ে কম। প্রোটিন, বাদাম, দুধ ও পুষ্টিকর সুষম খাদ্যের পরিমাণ বাড়ান।";
    weightStatusAdviceEn =
      "Your weight is below standard range. Boost nutrient-dense foods, proteins, and healthy calories.";
  } else if (bmi >= 25 && bmi < 30) {
    bmiCategory = "overweight";
    bmiCategoryBn = "অতিরিক্ত ওজন (ওভারওয়েট)";
    bmiCategoryEn = "Overweight";
    weightStatusAdviceBn =
      "আপনার ওজন কিছুটা বেশি। মিষ্টি, ভাজাপোড়া কমিয়ে দৈনিক অন্তত ৩০ মিনিট দ্রুত হাঁটার অভ্যাস গড়ে তুলুন।";
    weightStatusAdviceEn =
      "Your weight is slightly elevated. Cut back on refined sugars and engage in 30 minutes of brisk walking daily.";
  } else if (bmi >= 30) {
    bmiCategory = "obese";
    bmiCategoryBn = "স্থূলতা / ওবেসিটি (Obesity)";
    bmiCategoryEn = "Obesity Range";
    weightStatusAdviceBn =
      "আপনার ওজন স্থূলতার ক্যাটাগরিতে পড়েছে। ডায়েট নিয়ন্ত্রণ ও চিকিৎসকের পরামর্শে ওজন কমানোর লক্ষ্য নির্ধারণ করুন।";
    weightStatusAdviceEn =
      "Your BMI falls into the obesity category. A structured calorie-deficit plan and clinical consultation are advised.";
  }

  // 2. Calorie / BMR (Mifflin-St Jeor)
  let bmr = 10 * weight + 6.25 * input.heightCm - 5 * age;
  if (input.gender === "male") {
    bmr += 5;
  } else {
    bmr -= 161;
  }
  bmr = Math.round(bmr);

  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
  };
  const maintenanceCalories = Math.round(
    bmr * (activityMultipliers[input.activityLevel] || 1.2)
  );
  const weightLossCalories = Math.max(1200, maintenanceCalories - 500);
  const weightGainCalories = maintenanceCalories + 400;

  // 3. Hydration
  let totalMl = weight * 35;
  if (input.activityLevel === "light") totalMl += 250;
  if (input.activityLevel === "moderate") totalMl += 500;
  if (input.activityLevel === "active") totalMl += 1000;
  if (input.weather === "hot") totalMl += 500;

  const dailyWaterLiters = parseFloat((totalMl / 1000).toFixed(1));
  const dailyGlasses = Math.round(totalMl / 250);

  // 4. Clinical Indicators
  let bpEvaluation: BpEvaluationResult | undefined = undefined;
  if (input.systolicBp && input.diastolicBp) {
    bpEvaluation = evaluateBloodPressure(input.systolicBp, input.diastolicBp);
  }

  let glucoseEvaluation: GlucoseEvaluationResult | undefined = undefined;
  if (input.bloodGlucose && input.bloodGlucose > 0) {
    glucoseEvaluation = evaluateBloodGlucose(
      input.bloodGlucose,
      input.glucoseContext || "fasting",
      "mmol"
    );
  }

  // 5. Wellness Score Calculation
  let score = 100;
  if (bmiCategory === "overweight") score -= 10;
  if (bmiCategory === "underweight") score -= 8;
  if (bmiCategory === "obese") score -= 22;

  if (bpEvaluation) {
    if (bpEvaluation.category === "elevated") score -= 5;
    if (bpEvaluation.category === "stage1") score -= 12;
    if (bpEvaluation.category === "stage2") score -= 20;
    if (bpEvaluation.category === "crisis") score -= 30;
    if (bpEvaluation.category === "hypotension") score -= 8;
  }

  if (glucoseEvaluation) {
    if (glucoseEvaluation.category === "prediabetes") score -= 10;
    if (glucoseEvaluation.category === "diabetes") score -= 20;
    if (glucoseEvaluation.category === "severe_hyperglycemia") score -= 28;
    if (glucoseEvaluation.category === "hypoglycemia") score -= 15;
  }

  const overallScore = Math.max(25, Math.min(100, score));

  let wellnessStatusBn = "চমৎকার ও স্বাস্থ্যকর অবস্থা";
  let wellnessStatusEn = "Excellent & Optimal Health";
  let wellnessColor = "text-emerald-600 dark:text-emerald-400";

  if (overallScore < 50) {
    wellnessStatusBn = "উচ্চ স্বাস্থ্য ঝুঁকি — ডাক্তারের পরামর্শ জরুরি";
    wellnessStatusEn = "High Health Risk — Clinical Consultation Required";
    wellnessColor = "text-rose-600 dark:text-rose-400";
  } else if (overallScore < 70) {
    wellnessStatusBn = "সতর্কতা প্রয়োজন — জীবনধারা পরিবর্তন করুন";
    wellnessStatusEn = "Moderate Risk — Lifestyle Intervention Advised";
    wellnessColor = "text-amber-600 dark:text-amber-400";
  } else if (overallScore < 85) {
    wellnessStatusBn = "ভালো অবস্থা — ছোটখাটো অভ্যাস নিয়ন্ত্রণ করুন";
    wellnessStatusEn = "Good Condition — Minor Habit Tuning Recommended";
    wellnessColor = "text-teal-600 dark:text-teal-400";
  }

  // 6. Curate Recommendations & Warning Signs
  const dietRecsBn: string[] = [
    `দৈনিক পানির ন্যূনতম লক্ষ্য ${dailyWaterLiters} লিটার (প্রায় ${dailyGlasses} গ্লাস) পূরণ করুন।`,
    `ওজন নিয়ন্ত্রণে রাখতে দৈনিক ক্যালোরি লক্ষ্য প্রায় ${maintenanceCalories} kcal বজায় রাখুন।`,
    "খাবারে বাড়তি লবণ, অতিরিক্ত চিনি ও গভীর তেলে ভাজা খাবার বর্জন করুন।",
    "প্লেটের অর্ধেক অংশ তাজা শাকসবজি ও সালাদ দিয়ে পূর্ণ করুন।",
  ];
  const dietRecsEn: string[] = [
    `Meet your daily minimum hydration target of ${dailyWaterLiters} L (~${dailyGlasses} glasses).`,
    `Align daily calorie intake with your maintenance target (~${maintenanceCalories} kcal/day).`,
    "Minimize added table salt, refined sugars, and deep-fried fast food.",
    "Fill at least half of your meal plate with colorful vegetables and raw salads.",
  ];

  const exerciseRecsBn: string[] = [
    "প্রতি সপ্তাহে অন্তত ১৫০ মিনিট মাঝারি গতির হাঁটা বা শরীরচর্চা করুন।",
    "প্রতিদিন পর্যাপ্ত ৭-৮ ঘণ্টা নিয়মিত ঘুমানোর অভ্যাস গড়ে তুলুন।",
    "ধূমপান বা তামাকজাত সামগ্রী সম্পূর্ণ পরিহার করুন।",
  ];
  const exerciseRecsEn: string[] = [
    "Engage in at least 150 minutes of moderate aerobic exercise (brisk walk) per week.",
    "Prioritize 7-8 hours of quality, uninterrupted restorative sleep.",
    "Avoid tobacco, smoking, and passive smoke exposure completely.",
  ];

  if (bpEvaluation && bpEvaluation.category !== "normal") {
    dietRecsBn.push(...bpEvaluation.dietTipsBn.slice(0, 1));
    dietRecsEn.push(...bpEvaluation.dietTipsEn.slice(0, 1));
    exerciseRecsBn.push(...bpEvaluation.actionPlanBn.slice(0, 1));
    exerciseRecsEn.push(...bpEvaluation.actionPlanEn.slice(0, 1));
  }

  if (glucoseEvaluation && glucoseEvaluation.category !== "normal") {
    dietRecsBn.push(...glucoseEvaluation.dietTipsBn.slice(0, 1));
    dietRecsEn.push(...glucoseEvaluation.dietTipsEn.slice(0, 1));
  }

  const warningSignsBn: string[] = [
    "হঠাৎ বুকে তীব্র ব্যথা, অস্বাভাবিক শ্বাসকষ্ট বা বুক ধড়ফড় করা।",
    "প্রচণ্ড মাথাব্যথা, চোখের দৃষ্টি ঝাপসা হওয়া বা মাথা ঘুরে পড়ে যাওয়া।",
    "হাত-পা অবশ ভাব বা শরীরের একপাশে আকস্মিক দুর্বলতা।",
  ];
  const warningSignsEn: string[] = [
    "Sudden intense chest tightness, severe shortness of breath, or palpitations.",
    "Severe headache, sudden blurry vision, or fainting spells.",
    "Sudden weakness, numbness, or loss of balance on one side of the body.",
  ];

  let doctorReferralBn =
    "জেনারেল ফিজিশিয়ান / বার্ষিক রুটিন স্বাস্থ্য পরীক্ষা (Health Club Partner Network)";
  let doctorReferralEn =
    "General Physician / Routine Annual Health Check (Health Club Network)";

  if (bpEvaluation && (bpEvaluation.category === "stage2" || bpEvaluation.category === "crisis")) {
    doctorReferralBn = bpEvaluation.recommendedDoctorBn;
    doctorReferralEn = bpEvaluation.recommendedDoctorEn;
  } else if (glucoseEvaluation && glucoseEvaluation.category === "diabetes") {
    doctorReferralBn = glucoseEvaluation.recommendedDoctorBn;
    doctorReferralEn = glucoseEvaluation.recommendedDoctorEn;
  }

  const now = new Date();
  const reportId = `HC-REP-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}-${Math.floor(1000 + Math.random() * 9000)}`;

  return {
    reportId,
    generatedDate: now.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    generatedTime: now.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    name: input.name?.trim() || "",
    age,
    gender: input.gender,
    heightCm: input.heightCm,
    weightKg: input.weightKg,
    activityLevel: input.activityLevel,
    bmi,
    bmiCategory,
    bmiCategoryBn,
    bmiCategoryEn,
    idealMinKg,
    idealMaxKg,
    weightStatusAdviceBn,
    weightStatusAdviceEn,
    bmr,
    maintenanceCalories,
    weightLossCalories,
    weightGainCalories,
    dailyWaterLiters,
    dailyGlasses,
    bpEvaluation,
    glucoseEvaluation,
    overallScore,
    wellnessStatusBn,
    wellnessStatusEn,
    wellnessColor,
    dietRecommendationsBn: Array.from(new Set(dietRecsBn)),
    dietRecommendationsEn: Array.from(new Set(dietRecsEn)),
    exerciseRecommendationsBn: Array.from(new Set(exerciseRecsBn)),
    exerciseRecommendationsEn: Array.from(new Set(exerciseRecsEn)),
    warningSignsBn,
    warningSignsEn,
    doctorReferralBn,
    doctorReferralEn,
  };
}
