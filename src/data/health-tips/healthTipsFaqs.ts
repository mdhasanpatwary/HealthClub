export interface FAQItem {
  id: string;
  questionBn: string;
  questionEn: string;
  answerBn: string;
  answerEn: string;
}

export const HEALTH_TIPS_FAQS: FAQItem[] = [
  {
    id: "dengue-platelet-threshold",
    questionBn: "ডেঙ্গু জ্বরে প্লাটিলেট কত নিচে নামলে হাসপাতালে ভর্তি হওয়া জরুরি?",
    questionEn: "At what platelet count is hospitalization necessary for dengue fever?",
    answerBn:
      "সুস্থ মানুষের রক্তে স্বাভাবিক প্লাটিলেট দেড় লাখ থেকে সাড়ে চার লাখ। ডেঙ্গু জ্বরে প্লাটিলেট ৫০,০০০-এর নিচে নামলে, অথবা প্লাটিলেটের পাশাপাশি তীব্র পেটব্যথা, নাক বা মাড়ি দিয়ে রক্তপাত, এবং ক্রমাগত বমি দেখা দিলে কালবিলম্ব না করে হাসপাতালে ভর্তি হতে হবে। তবে প্লাটিলেটের সংখ্যার চেয়েও বেশি গুরুত্বপূর্ণ হলো শরীরে তরলের ভারসাম্য (হেমাটোক্রিট) স্বাভাবিক রাখা।",
    answerEn:
      "Normal platelet count ranges from 150,000 to 450,000/μL. If platelets drop below 50,000/μL, or if accompanied by clinical warning signs like severe abdominal pain, persistent vomiting, or mucosal bleeding, hospital admission is immediately required. Maintaining adequate fluid hydration is more critical than platelet count alone.",
  },
  {
    id: "heart-attack-vs-acidity",
    questionBn: "গ্যাস্ট্রিকের বুকজ্বালা এবং হার্ট অ্যাটাকের ব্যথার মধ্যে পার্থক্য কী?",
    questionEn: "How do you distinguish between gastric heartburn and a heart attack?",
    answerBn:
      "গ্যাস্ট্রিকের ব্যথা সাধারণত বুকের মাঝে জ্বালাপোড়া করে এবং অ্যান্টাসিড বা পানি খেলে উপশম হয়। অন্যদিকে হার্ট অ্যাটাকের ব্যথা বুকে ভারী পাথর চেপে বসার মতো তীব্র চাপ সৃষ্টি করে, যা বাম হাত, ঘাড়, চোয়াল বা পিঠে ছড়িয়ে পড়ে। এর সাথে প্রচুর ঠাণ্ডা ঘাম, শ্বাসকষ্ট ও মাথা ঘোরার মতো মারাত্মক উপসর্গ থাকে। যেকোনো সন্দেহজনক তীব্র বুকে ব্যথায় দেরি না করে দ্রুত ইসিজি (ECG) করা উচিত।",
    answerEn:
      "Gastric acidity usually causes a localized burning sensation relieved by antacids or water. In contrast, cardiac pain feels like heavy, crushing central chest pressure radiating to the left arm, neck, jaw, or back, accompanied by cold sweats, dizziness, and breathlessness. Any acute, unexplained chest heaviness requires an immediate emergency ECG.",
  },
  {
    id: "diabetes-target-levels",
    questionBn: "ডায়াবেটিস রোগীর জন্য রক্তের সুগারের আদর্শ মাত্রা (Fasting ও 2HABF) কত?",
    questionEn: "What are the ideal target blood sugar ranges for a diabetic patient?",
    answerBn:
      "ডায়াবেটিস রোগীদের ক্ষেত্রে সকালে খালি পেটে (Fasting) রক্তের গ্লুকোজ ৫.৫ থেকে ৭.০ মিলিলেটার/লিটার (mmol/L) এবং খাবার খাওয়ার ২ ঘণ্টা পর (2HABF) ৮.০ থেকে ১০.০ mmol/L থাকা আদর্শ। এছাড়া বিগত ৩ মাসের গড় শর্করা পরিমাপক HbA1c টেস্টের ফলাফল ৭.০% এর নিচে রাখলে ডায়াবেটিসজনিত দীর্ঘমেয়াদী জটিলতা সম্পূর্ণ প্রতিরোধ করা সম্ভব।",
    answerEn:
      "For individuals with diabetes, target fasting plasma glucose should ideally be between 5.5 to 7.0 mmol/L, and 2-hour post-meal glucose between 8.0 to 10.0 mmol/L. Maintaining an HbA1c below 7.0% prevents microvascular damage to kidneys, eyes, and nerves.",
  },
  {
    id: "bp-medicine-duration",
    questionBn: "উচ্চ রক্তচাপের ওষুধ কি একবার শুরু করলে সারাজীবন খেতে হয়?",
    questionEn: "Do you have to take high blood pressure medication for life once started?",
    answerBn:
      "উচ্চ রক্তচাপ একটি দীর্ঘমেয়াদী লাইফস্টাইল রোগ। ওষুধ রক্তনালীকে শিথিল রেখে প্রেশার নিয়ন্ত্রণে রাখে এবং হার্ট অ্যাটাক ও স্ট্রোকের ঝুঁকি কমায়। তাই রক্তচাপ স্বাভাবিক হলেও চিকিৎসকের পরামর্শ ছাড়া নিজে থেকে ওষুধ বন্ধ করা বিপজ্জনক। তবে খাদ্য নিয়ন্ত্রণ, ওজন হ্রাস ও দৈনিক ব্যায়ামের মাধ্যমে রক্তচাপ নিয়ন্ত্রণে আসলে চিকিৎসক ওষুধের মাত্রা ধীরে ধীরে কমিয়ে আনতে পারেন।",
    answerEn:
      "Hypertension is a chronic metabolic condition. Antihypertensive medications control vascular pressure to prevent sudden heart attacks and strokes. Never discontinue medication abruptly because readings look normal. With significant weight loss, low-sodium nutrition, and exercise, your physician may safely adjust or reduce dosages.",
  },
  {
    id: "stroke-fast-signs",
    questionBn: "ব্রেন স্ট্রোকের প্রাথমিক ৩টি প্রধান লক্ষণ কীভাবে সহজে চেনা যায়?",
    questionEn: "What are the primary signs to recognize a brain stroke immediately?",
    answerBn:
      "স্ট্রোক চেনার আন্তর্জাতিক বৈজ্ঞানিক পদ্ধতি হলো FAST:\n১. Face: মুখের একপাশ বাঁকা হয়ে যাওয়া বা হাসি অসম হওয়া।\n২. Arm: এক হাত বা পা দুর্বল হয়ে যাওয়া বা অবশ হওয়া।\n৩. Speech: কথা জড়িয়ে যাওয়া বা স্পষ্ট বলতে না পারা।\nএই লক্ষণগুলো দেখা দেওয়ার সাথে সাথে রোগীকে ৪.৫ ঘণ্টার মধ্যে সিটি-স্ক্যান সুবিধাযুক্ত হাসপাতালে নিয়ে গেলে রক্তের জমাট গলিয়ে রোগীর স্থায়ী পক্ষাঘাত রোধ করা সম্ভব।",
    answerEn:
      "Use the global F.A.S.T protocol:\n1. Face Drooping: One side of the face droops or feels numb.\n2. Arm Weakness: One arm drifts downward when raised.\n3. Speech Difficulty: Slurred speech or inability to speak clearly.\nReaching a CT-equipped stroke center within the 4.5-hour thrombolysis window can reverse permanent paralysis.",
  },
  {
    id: "daily-water-intake",
    questionBn: "প্রতিদিন কতটুকু পানি পান করা উচিত এবং কিডনি সুস্থ রাখার নিয়ম কী?",
    questionEn: "How much water should you drink daily to keep your kidneys healthy?",
    answerBn:
      "সাধারণত একজন প্রাপ্তবয়স্ক সুস্থ মানুষের দিনে আড়াই থেকে সাড়ে তিন লিটার (১০-১২ গ্লাস) বিশুদ্ধ পানি পান করা উচিত। তবে তীব্র রোদে বা ভারী কায়িক পরিশ্রমে এর পরিমাণ বাড়াতে হবে। আপনার পানি পান পর্যাপ্ত হচ্ছে কিনা তা বোঝার সবচেয়ে সহজ উপায় হলো প্রস্রাবের রং হালকা খড়ের মতো স্বচ্ছ থাকা। তবে কিডনি বা হার্ট ফেইলিওরের রোগীদের ক্ষেত্রে চিকিৎসকের বেঁধে দেওয়া নির্দিষ্ট পরিমাপ মেনে পানি পান করতে হবে।",
    answerEn:
      "A healthy adult generally requires 2.5 to 3.5 liters (10-12 glasses) of clean water daily, with higher amounts during hot weather or strenuous labor. Pale, straw-colored urine indicates optimal hydration. Patients with established renal impairment or congestive heart failure must follow strict fluid intake restrictions prescribed by their doctor.",
  },
  {
    id: "child-fever-antibiotic",
    questionBn: "শিশুদের সাধারণ সর্দি-জ্বরে কি সাথে সাথে অ্যান্টিবায়োটিক খাওয়ানো উচিত?",
    questionEn: "Should antibiotics be given immediately for common childhood fever & cold?",
    answerBn:
      "একদমই না। শিশুদের শতকরা ৮০-৯০ ভাগ সর্দি, কাশি ও জ্বর ভাইরাসজনিত কারণে হয়ে থাকে, যেখানে অ্যান্টিবায়োটিক কোনো কাজ করে না। অপ্রয়োজনীয় অ্যান্টিবায়োটিক শিশুর অন্ত্রের উপকারী ব্যাকটেরিয়া ধ্বংস করে এবং ড্রাগ রেজিস্ট্যান্স তৈরি করে। জ্বর হলে শুধু প্যারাসিটামল, প্রচুর তরল খাবার ও স্বাভাবিক তাপমাত্রার পানি দিয়ে শরীর মুছিয়ে দিন। ৩ দিনের বেশি জ্বর থাকলে বা শিশু নিস্তেজ হয়ে পড়লে শিশু বিশেষজ্ঞ দেখান।",
    answerEn:
      "No. 80-90% of pediatric coughs, colds, and fevers are viral infections where antibiotics are completely ineffective. Unnecessary antibiotic usage destroys gut microbiome balance and breeds antimicrobial resistance. Administer only weight-appropriate Paracetamol, ensure adequate fluids, and consult a pediatrician if fever persists past 3 days.",
  },
];
