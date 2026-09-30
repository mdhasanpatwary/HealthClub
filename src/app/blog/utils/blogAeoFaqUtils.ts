import { BlogPost, BlogFAQItem } from "@/types/blog";

/**
 * Common Schema.org SpeakableSpecification selectors for Voice/Answer Engines (Google Assistant, Siri, AI Overviews)
 */
export const SPEAKABLE_AEO_SELECTORS = [
  ".geo-answer-capsule",
  ".faq-answer",
  "#overview",
  "#geo-answer-capsule",
  "#article-quick-summary",
  "#faq-section",
];

/**
 * Extracts a concise topic name from article title for contextual FAQ generation
 */
function extractTopicName(titleBn: string): string {
  if (!titleBn) return "এই স্বাস্থ্যসেবা ও পরীক্ষা";
  return titleBn
    .replace(/^ফেনীতে\s+/, "")
    .replace(/\s+(খরচ|তালিকা|গাইড|ও\s+রোগীদের\s+সহায়তা|ও\s+সিরিয়াল).*$/, "")
    .trim() || titleBn;
}

/**
 * Ensures every blog article generates a high-density list of 5–8 conversational FAQs
 * for Answer Engine Optimization (AEO), Voice Search, and Schema.org FAQPage graph.
 */
export function getHighDensityBlogFaqs(post: BlogPost): BlogFAQItem[] {
  const existingFaqs: BlogFAQItem[] = (post.faqs || [])
    .filter(Boolean)
    .map((raw) => {
      const f = raw as unknown as {
        questionBn?: string;
        answerBn?: string;
        question?: string;
        answer?: string;
        qBn?: string;
        aBn?: string;
        questionEn?: string;
        answerEn?: string;
        qEn?: string;
        aEn?: string;
      };
      const qBn = (f.questionBn || f.qBn || f.question || "").trim();
      const aBn = (f.answerBn || f.aBn || f.answer || "").trim();
      return {
        questionBn: qBn,
        answerBn: aBn,
        questionEn: f.questionEn || f.qEn || "",
        answerEn: f.answerEn || f.aEn || "",
      };
    })
    .filter((f) => f.questionBn.length > 0 && f.answerBn.length > 0);

  if (existingFaqs.length >= 5) {
    return existingFaqs.slice(0, 8);
  }

  const topic = extractTopicName(post.titleBn);
  const existingQuestions = new Set(existingFaqs.map((f) => f.questionBn.toLowerCase()));

  const supplementalPool: BlogFAQItem[] = [
    {
      questionBn: `ফেনীতে ${topic}-এর সাধারণ খরচ কেমন এবং হেলথ ক্লাব মেম্বাররা কী সুবিধা পান?`,
      answerBn: `ফেনী সদর এলাকার অনুমোদিত ও আধুনিক ডায়াগনস্টিক সেন্টার এবং হাসপাতালে ${topic} সম্পর্কিত পরীক্ষায় সাধারণ বাজারদরের তুলনায় হেলথ ক্লাব মেম্বাররা ১০% থেকে ৩০% পর্যন্ত বিশেষ মেম্বার ছাড় পেয়ে থাকেন। বিল পরিশোধের সময় কার্ড প্রদর্শন করলেই তাৎক্ষণিক এই সাশ্রয় কার্যকর হয়।`,
      questionEn: `What is the typical cost of ${post.titleEn || "this service"} in Feni and what discount do Health Club members get?`,
      answerEn: `Health Club members receive an exclusive 10% to 30% discount on ${post.titleEn || "relevant investigations"} across verified partner healthcare facilities in Feni Sadar upon presenting their digital member card.`,
    },
    {
      questionBn: `ফেনী সদর হাসপাতালে বা পার্টনার সেন্টারে কীভাবে দ্রুত টেস্ট বা সিরিয়াল বুক করবেন?`,
      answerBn: `হেলথ ক্লাব অনলাইন প্ল্যাটফর্মে তালিকাভুক্ত বিশেষজ্ঞ ডাক্তার এবং পার্টনার হাসপাতালের সরাসরি অফিসিয়াল সিরিয়াল হটলাইন নাম্বারে কল করে অতি দ্রুত সিরিয়াল বা টেস্ট শিডিউল নিশ্চিত করা যায়। কোনো প্রকার মধ্যস্বত্বভোগী বা বাড়তি ফি ছাড়াই রোগী সরাসরি সিরিয়াল নিশ্চিত করতে পারেন।`,
      questionEn: `How to book an appointment or diagnostic serial in Feni Sadar?`,
      answerEn: `Patients can directly call verified official serial hotlines listed on Health Club Feni platform to secure appointments without middlemen or surcharge fees.`,
    },
    {
      questionBn: `এই সেবা বা পরীক্ষা গ্রহণের পূর্বে রোগীর কী কী প্রস্তুতি বা সতর্কতা প্রয়োজন?`,
      answerBn: `পরীক্ষার ধরন অনুযায়ী চিকিৎসকের পূর্ব নির্দেশনা মেনে চলুন (যেমন রক্তের কিছু পরীক্ষার ক্ষেত্রে খালি পেটে থাকা বা আল্ট্রাসাউন্ডের জন্য পর্যাপ্ত পানি পান করা)। রোগীর পূর্বের সকল প্রেসক্রিপশন ও মেডিকেল রিপোর্ট সাথে নিয়ে নির্ধারিত সময়ের ২০-৩০ মিনিট পূর্বে সেন্টারে পৌঁছানো উত্তম।`,
      questionEn: `What preparations are required before undergoing this test or treatment?`,
      answerEn: `Patients should follow clinical pre-test instructions (such as overnight fasting or bladder filling), carry previous prescriptions and reports, and arrive 20-30 minutes early.`,
    },
    {
      questionBn: `${topic}-এর রিপোর্ট সাধারণত কত সময়ের মধ্যে পাওয়া যায়?`,
      answerBn: `ফেনী সদরের আধুনিক ডায়াগনস্টিক সেন্টারে বেশিরভাগ রুটিন পরীক্ষা ও ডিজিটাল ইমেজিং রিপোর্ট একই দিনে বা সর্বোচ্চ ১২ থেকে ২৪ ঘণ্টার মধ্যে ডেলিভারি দেওয়া হয়। তবে বিশেষায়িত কালচার বা বায়োপসি পরীক্ষার ক্ষেত্রে ২ থেকে ৩ কার্যদিবস সময় লাগতে পারে।`,
      questionEn: `How long does it take to receive the test report in Feni?`,
      answerEn: `Most routine blood, pathology, and imaging reports are available within the same day or 12-24 hours. Specialized cultures or biopsies may require 2 to 3 days.`,
    },
    {
      questionBn: `জরুরি পরিস্থিতিতে ফেনীতে ২৪ ঘণ্টা অ্যাম্বুলেন্স বা স্বাস্থ্য সহায়তা পাওয়ার উপায় কী?`,
      answerBn: `যেকোনো স্বাস্থ্য সংকটে ফেনী ২৫০ শয্যা জেনারেল হাসপাতালের জরুরি বিভাগ অথবা হেলথ ক্লাবের ২৪/৭ জরুরি অ্যাম্বুলেন্স ও অক্সিজেন হেল্পলাইনে (০১৮৮৬৭৬৩৮৪৯) সরাসরি কল করে তাৎক্ষণিক সহায়তা নেওয়া যাবে।`,
      questionEn: `How to access 24/7 emergency medical or ambulance assistance in Feni?`,
      answerEn: `Call the Health Club 24/7 emergency helpline or contact Feni 250-Bed General Hospital Emergency Department for instant ambulance and critical support.`,
    },
    {
      questionBn: `শুক্রবার বা সরকারি ছুটির দিনে কি ফেনীতে এই সেবা বা ডায়াগনস্টিক ল্যাব খোলা থাকে?`,
      answerBn: `ফেনী সদরের শীর্ষ প্রাইভেট হাসপাতাল ও ডায়াগনস্টিক সেন্টারগুলোর জরুরি বিভাগ, ইনডোর ভর্তি ও রুটিন ল্যাব সেবা শুক্রবারসহ সপ্তাহের ৭ দিনই ২৪ ঘণ্টা খোলা থাকে। তবে স্পেশালিস্ট কনসালট্যান্ট চিকিৎসকদের ভিজিটের জন্য শুক্রবারের বিশেষ শিডিউল যাচাই করে নেওয়া ভালো।`,
      questionEn: `Are diagnostic labs and medical centers open on Fridays or holidays in Feni?`,
      answerEn: `Emergency wings, indoor admissions, and standard pathology labs in Feni Sadar remain open 24/7 including Fridays, while specialist doctor visits follow dedicated weekend chamber schedules.`,
    },
  ];

  const result = [...existingFaqs];

  for (const item of supplementalPool) {
    if (result.length >= 6) break;
    if (!existingQuestions.has(item.questionBn.toLowerCase())) {
      result.push(item);
      existingQuestions.add(item.questionBn.toLowerCase());
    }
  }

  return result.slice(0, 8);
}
