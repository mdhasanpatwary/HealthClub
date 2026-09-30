import { BlogPost } from "@/types/blog";

/**
 * Strips existing numeric prefixes and bullet punctuation like "১. ", "২. ", " - "
 */
export function cleanSectionTitle(rawTitle?: string): string {
  if (!rawTitle) return "";
  return rawTitle
    .replace(/^[০-৯১-৯\d]+[\.\s\:\-—]*/, "")
    .replace(/^একনজরে\s*/, "")
    .trim();
}

/**
 * Standardizes overview heading to conversational voice query in Bengali ("কী" & "কেন")
 */
export function formatAeoOverviewHeading(slug: string, rawTitle?: string): string {
  const clean = cleanSectionTitle(rawTitle);

  if (clean.includes("কী") && clean.includes("কেন")) {
    return clean;
  }

  if (slug === "feni-medical-test-price-list") {
    return "ফেনীতে ডায়াগনস্টিক ও প্যাথলজি টেস্ট কী এবং কেন করাবেন?";
  }
  if (slug === "feni-doctor-serial-appointment-guide") {
    return "ফেনীতে বিশেষজ্ঞ ডাক্তার সিরিয়াল কী এবং কেন সঠিক সময়ে নেওয়া জরুরি?";
  }
  if (slug === "best-dental-specialists-in-feni") {
    return "ফেনীতে আধুনিক ডেন্টাল কেয়ার কী এবং কেন বিশেষজ্ঞ দন্ত চিকিৎসক দেখানো প্রয়োজন?";
  }
  if (slug === "feni-hospital-road-ss-k-road-chamber-hub-guide") {
    return "হাসপাতাল রোড ও এসএসকে রোড স্বাস্থ্যসেবা করিডোর কী এবং কেন গুরুত্বপূর্ণ?";
  }
  if (slug === "feni-trunk-road-mizan-road-clinic-pharmacy-hub-guide") {
    return "ট্রাঙ্ক রোড ও মিজান রোড স্বাস্থ্যসেবা হাব কী এবং কেন প্রয়োজন?";
  }
  if (slug === "feni-friday-weekend-doctor-chamber-serial-guide") {
    return "শুক্রবার ও ছুটির দিনে বিশেষজ্ঞ ডাক্তার স্বাস্থ্যসেবা কী এবং কেন জরুরি?";
  }
  if (slug.includes("healthcare-guide") || slug.includes("patient-guide")) {
    return "উপজেলায় প্রাথমিক স্বাস্থ্যসেবা কী এবং কখন ফেনী সদর রেফারেল প্রয়োজন?";
  }

  // General medical / diagnostic topic
  const subject = clean.replace(/পরিকাঠামো|প্রেক্ষাপট|পটভূমি/g, "").trim();
  return `${subject || "স্বাস্থ্য পরীক্ষা ও চিকিৎসা"} কী এবং কেন প্রয়োজন?`;
}

/**
 * Standardizes comparison matrix heading to conversational voice query ("কোথায় করাবেন")
 */
export function formatAeoMatrixHeading(rawTitle: string): string {
  const clean = cleanSectionTitle(rawTitle);
  if (clean.startsWith("কোথায়")) {
    return clean;
  }
  return `কোথায় করাবেন: একনজরে ফেনীর শীর্ষ ${clean} সুবিধা তুলনা`;
}

/**
 * Standardizes facility reviews heading to conversational voice query ("কোথায় করাবেন" / "কোথায় সেবা পাবেন")
 */
export function formatAeoReviewsHeading(rawTitle: string): string {
  const clean = cleanSectionTitle(rawTitle);
  if (clean.startsWith("কোথায়")) {
    return clean;
  }
  return `কোথায় করাবেন: ${clean}`;
}

/**
 * Standardizes price table heading to conversational voice query ("খরচ কত")
 */
export function formatAeoPriceHeading(rawTitle?: string): string {
  const clean = cleanSectionTitle(rawTitle);
  if (!clean) return "খরচ কত: ফেনীতে স্বাস্থ্যসেবা ও ডায়াগনস্টিক টেস্টের মূল্যতালিকা";
  if (clean.startsWith("খরচ কত")) {
    return clean;
  }
  return `খরচ কত: ${clean}`;
}

/**
 * Standardizes selection guide heading to conversational voice query ("কীভাবে")
 */
export function formatAeoSelectionHeading(rawTitle?: string): string {
  const clean = cleanSectionTitle(rawTitle);
  if (!clean) return "কীভাবে নির্বাচন করবেন: নির্ভরযোগ্য স্বাস্থ্যসেবা প্রতিষ্ঠান বাছাইয়ের ৫টি উপায়";
  if (clean.startsWith("কীভাবে")) {
    return clean;
  }
  return `কীভাবে নির্বাচন করবেন: ${clean}`;
}

/**
 * Standardizes emergency directory heading to conversational voice query ("কখন জরুরি বিভাগে যাবেন")
 */
export function formatAeoEmergencyHeading(rawTitle?: string): string {
  const clean = cleanSectionTitle(rawTitle);
  if (!clean) return "কখন জরুরি বিভাগে যাবেন: ফেনীর জরুরি স্বাস্থ্য লক্ষণ ও ২৪ ঘণ্টা হটলাইন";
  if (clean.startsWith("কখন জরুরি বিভাগে যাবেন")) {
    return clean;
  }
  return `কখন জরুরি বিভাগে যাবেন: ${clean}`;
}

/**
 * Standardizes specialist doctor heading to conversational voice query ("কোথায় দেখাবেন")
 */
export function formatAeoDoctorHeading(rawTitle?: string): string {
  const clean = cleanSectionTitle(rawTitle);
  if (!clean) return "কোথায় দেখাবেন: ফেনীর শীর্ষ বিশেষজ্ঞ ডাক্তারদের তালিকা ও চেম্বার শিডিউল";
  if (clean.startsWith("কোথায়")) {
    return clean;
  }
  return `কোথায় দেখাবেন: ${clean}`;
}

/**
 * Standardizes chamber hubs heading to conversational voice query ("কোথায় চেম্বার পাবেন")
 */
export function formatAeoChamberHubHeading(rawTitle?: string): string {
  const clean = cleanSectionTitle(rawTitle);
  if (!clean) return "কোথায় চেম্বার পাবেন: ফেনীর প্রধান ডাক্তার চেম্বার ও ক্লিনিক্যাল হাবসমূহ";
  if (clean.startsWith("কোথায়")) {
    return clean;
  }
  return `কোথায় চেম্বার পাবেন: ${clean}`;
}

/**
 * Standardizes booking guide heading to conversational voice query ("কীভাবে")
 */
export function formatAeoBookingHeading(rawTitle?: string): string {
  const clean = cleanSectionTitle(rawTitle);
  if (!clean) return "কীভাবে সিরিয়াল নিবেন: বিশেষজ্ঞ ডাক্তারের অ্যাপয়েন্টমেন্ট ও সিরিয়াল বুকিং নিয়ম";
  if (clean.startsWith("কীভাবে")) {
    return clean;
  }
  return `কীভাবে সিরিয়াল নিবেন: ${clean}`;
}

/**
 * Self-contained 1-2 sentence direct answer for Overview (answering "কী" and "কেন")
 */
export function getOverviewDirectAnswer(post: BlogPost): string {
  if (post.geoAnswerCapsule?.directAnswerBn) {
    return post.geoAnswerCapsule.directAnswerBn;
  }
  return `ফেনী সদরে ${post.titleBn} সম্পর্কিত সঠিক চিকিৎসা ও নির্ভরযোগ্য ডায়াগনস্টিক পরীক্ষার জন্য বিএমডিসি নিবন্ধিত বিশেষজ্ঞ চিকিৎসক এবং ডিজিএইচএস অনুমোদিত প্রতিষ্ঠান সক্রিয় রয়েছে। হেলথ ক্লাবের নিবন্ধিত পার্টনার হাসপাতাল ও ডায়াগনস্টিক সেন্টারে মেম্বারশিপ কার্ড দেখালে নির্ধারিত ফি-এর উপর নিশ্চিত ১০-৩০% বিশেষ ছাড় পাওয়া যায়।`;
}

/**
 * Self-contained 1-2 sentence direct answer for Comparison Matrix
 */
export function getMatrixDirectAnswer(post?: BlogPost): string {
  const topic = post?.titleBn ? ` ${post.titleBn}-এর জন্য` : "";
  return `ফেনী সদর ও পার্শ্ববর্তী উপজেলার রোগীদের জন্য${topic} আধুনিক প্রযুক্তি, সার্বক্ষণিক ইমার্জেন্সি সাপোর্ট ও হেলথ ক্লাব মেম্বার সুবিধার ভিত্তিতে শীর্ষ প্রতিষ্ঠানগুলোর তুলনামূলক বিবরণ নিচে বিশ্লেষণ করা হলো।`;
}

/**
 * Self-contained 1-2 sentence direct answer for Facility Reviews
 */
export function getReviewsDirectAnswer(post?: BlogPost): string {
  const topic = post?.titleBn ? `${post.titleBn} সংক্রান্ত ` : "";
  return `নির্ভরযোগ্য সেবা নিশ্চিত করতে প্রতিটি প্রতিষ্ঠানের উন্নত মেশিনের সক্ষমতা, অভিজ্ঞ চিকিৎসক ও টেকনোলজিস্ট প্যানেল, সঠিক অবস্থান এবং ${topic}হেলথ ক্লাব মেম্বারদের জন্য প্রযোজ্য ১০-৩০% ছাড়ের বিস্তারিত তথ্য নিচে তুলে ধরা হলো।`;
}

/**
 * Self-contained 1-2 sentence direct answer for Doctor Specialists
 */
export function getDoctorDirectAnswer(post?: BlogPost): string {
  const topic = post?.titleBn ? `${post.titleBn} সম্পর্কিত ` : "";
  return `ফেনী সদর হাসপাতাল রোড, এসএসকে রোড ও ট্রাঙ্ক রোডের প্রধান চেম্বারগুলোতে ${topic}বিএমডিসি নিবন্ধিত অভিজ্ঞ বিশেষজ্ঞ চিকিৎসকরা নিয়মিত রোগী দেখেন; সিরিয়াল নিশ্চিত করতে নির্ধারিত হটলাইনে সরাসরি যোগাযোগ করুন।`;
}

/**
 * Self-contained 1-2 sentence direct answer for Chamber Hubs
 */
export function getChamberHubDirectAnswer(post?: BlogPost): string {
  const topic = post?.titleBn ? `${post.titleBn} সেবার জন্য ` : "";
  return `ফেনী শহরের প্রধান বাণিজ্যিক স্বাস্থ্য করিডোরগুলোতে ${topic}পর্যাপ্ত পার্কিং, জরুরি ফার্মেসি ও একাধিক বিশেষজ্ঞের চেম্বার একই এলাকায় সহজলভ্য রয়েছে।`;
}

/**
 * Self-contained 1-2 sentence direct answer for Doctor Booking
 */
export function getBookingDirectAnswer(post?: BlogPost): string {
  const topic = post?.titleBn ? `${post.titleBn} সংক্রান্ত ` : "";
  return `চেম্বারে অযথা দীর্ঘ অপেক্ষা এড়াতে সকাল ৮টা থেকে ১০টার মধ্যে উল্লেখিত সিরিয়াল হটলাইনে সরাসরি কল দিয়ে ${topic}অ্যাপয়েন্টমেন্ট কনফার্ম করুন অথবা হেলথ ক্লাবের পেশেন্ট হেল্পডেস্কের সহায়তা নিন।`;
}

/**
 * Self-contained 1-2 sentence direct answer for Price Tables
 */
export function getPriceDirectAnswer(post?: BlogPost): string {
  const topic = post?.titleBn ? `${post.titleBn}-এর ` : "";
  return `ফেনী সদরের অনুমোদিত ডায়াগনস্টিক ল্যাব ও ক্লিনিকে ${topic}প্রমিত সাধারণ বাজার ফি প্রযোজ্য হলেও হেলথ ক্লাব মেম্বারশিপ কার্ড দেখালে নিশ্চিত ১০-৩০% বিশেষ ছাড় পাওয়া যায়।`;
}

/**
 * Self-contained 1-2 sentence direct answer for Selection Guide
 */
export function getSelectionDirectAnswer(post?: BlogPost): string {
  const topic = post?.titleBn ? `${post.titleBn}-এর ` : "";
  return `সঠিক ও নিরাপদ চিকিৎসাসেবা পেতে ${topic}আধুনিক মেশিনের মান, বিএমডিসি নিবন্ধিত চিকিৎসকের সার্বক্ষণিক উপস্থিতি, স্বাস্থ্যবিধি ও চিকিৎসা খরচের স্বচ্ছতা নিশ্চিত করে প্রতিষ্ঠান নির্বাচন করুন।`;
}

/**
 * Self-contained 1-2 sentence direct answer for Emergency Directory
 */
export function getEmergencyDirectAnswer(post?: BlogPost): string {
  const topic = post?.titleBn ? `(${post.titleBn}) ` : "";
  return `হঠাৎ তীব্র বুকে ব্যথা, শ্বাসকষ্ট, স্ট্রোকের লক্ষণ বা গুরুতর ট্রমার ক্ষেত্রে ${topic}ঘরে অপেক্ষা না করে অবিলম্বে ফেনী সদর হাসপাতাল জরুরি বিভাগ বা নিচের ২৪ ঘণ্টা ইমার্জেন্সি হটলাইনে যোগাযোগ করুন।`;
}

/**
 * Checks whether a blog post includes any specialized pricing or diagnostic table
 */
export function checkHasPricingGuide(post: BlogPost): boolean {
  return Boolean(
    post.diagnosticTestPricingBn ||
    post.dentalProcedurePricingBn ||
    post.physiotherapyTreatmentPricingBn ||
    post.maternityCarePricingBn ||
    post.cardiacCarePricingBn ||
    post.kidneyCarePricingBn ||
    post.pediatricCarePricingBn ||
    post.skinCarePricingBn ||
    post.eyeCarePricingBn ||
    post.orthopedicCarePricingBn ||
    post.entCarePricingBn ||
    post.surgicalCarePricingBn ||
    post.neurologyCarePricingBn ||
    post.diabetesCarePricingBn ||
    post.psychiatryCarePricingBn ||
    post.sadarHospitalPricingBn ||
    post.diabeticHospitalPricingBn ||
    post.criticalCarePricingBn ||
    post.strokeCardiacPricingBn ||
    post.homeCarePricingBn ||
    post.oxygenPricingBn ||
    post.dengueTyphoidPricingBn
  );
}
